# Ambiguity Clustering and Learned Predecoders: Adding AI Without Moving the Proof

Author: Guillaume Lessard / qector.store  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: qLDPC, ambiguity clustering, GNN, neural predecoder, decoder verification

## Abstract

Belief propagation can leave only a small part of a qLDPC problem uncertain, even when its global hard decision is not faithful. Ambiguity clustering uses that observation: freeze confident qubits, compute the residual syndrome, and solve disconnected ambiguous components exactly when they are small. QECTOR also exposes learned predecoder surfaces that provide priors or dynamic weights. The important boundary is architectural: learned components may influence the selected correction, but the final syndrome-faithfulness gate remains algebraic and is enforced independently of training quality.

## 1. Confidence is not correctness

After BP, each qubit receives a posterior log-likelihood ratio `gamma_q`. A large magnitude means the model is confident about the bit; it does not prove the bit is correct. A hard decision can still fail the syndrome equation

$$
H\hat e \ne s \pmod 2.
$$

The useful question is therefore not "did BP converge globally?" but "where is BP uncertain, and can that uncertainty be isolated?"

Choose a reliability threshold `tau` and partition the qubits:

$$
Q_{rel} = \{q : |\gamma_q| \ge \tau\},
$$

$$
Q_{amb} = \{q : |\gamma_q| < \tau\}.
$$

Freeze the reliable set to its hard decision `e_rel` and compute

$$
s_{res} = s + H_{rel}e_{rel} \pmod 2.
$$

If `s_res` is zero, the frozen assignment is already faithful. Otherwise, the remaining work is concentrated on the ambiguous support.

## 2. Component-wise solving

Build the Tanner-induced subgraph on `Q_amb`. Under the component-separation condition, it decomposes into connected components `C_k` with disjoint column support. QECTOR's documented strategy is:

1. Solve a component exactly by enumeration when its size is at most the configured `K_max`, documented as 12 by default.
2. Use a restricted OSD-0 solve for larger components.
3. Escalate if a component cannot satisfy its residual syndrome.
4. XOR the component corrections with the frozen reliable assignment.

The exact-enumeration path searches the local space rather than the full `2^n` space. The method is attractive when BP confidence leaves small disconnected islands, but it is not a promise that every qLDPC instance decomposes into small components.

## 3. Faithfulness theorem

Let each component solver return `e_k` satisfying

$$
H_{C_k}e_k = s_{res,k} \pmod 2.
$$

Construct

$$
c = e_{rel} + \bigoplus_k e_k.
$$

Because the component supports are disjoint and their residual equations sum to `s_res`,

$$
\begin{aligned}
Hc
  &= H_{rel}e_{rel} + H_{amb}e_{amb} \\
  &= H_{rel}e_{rel} + s_{res} \\
  &= H_{rel}e_{rel} + (s + H_{rel}e_{rel}) \\
  &= s \pmod 2.
\end{aligned}
$$

The threshold `tau` changes which representative is frozen and which work is enumerated. It does not change the algebraic conclusion as long as every component residual is solved or escalated.

## 4. Logical scoring remains a separate layer

Faithfulness implies that `c + e` lies in `ker(H)`. It does not identify whether that residual is a stabilizer or a logical operator. For a stabilizer code, the logical criterion remains

$$
c + e \in \operatorname{im}(H^T)
$$

for success. An exact local component solve can still choose a globally nontrivial logical coset if the code's logical structure crosses the component boundary. That is why the manual calls the component method faithful and exact within clusters, but does not make a universal logical-accuracy claim for a learned or thresholded configuration.

## 5. Learned predecoders

The manual describes two research-grade surfaces:

- `NeuralPredecoder`: a small leaky-ReLU MLP trained with SGD.
- `GNNPredecoder`: a message-passing network with a softplus edge readout that predicts dynamic per-edge weights.

The learned output can influence BP priors, reliability ordering, or matching weights. A positive softplus readout is useful when the downstream matching path expects non-negative edge costs. But training data, architecture, calibration, and distribution shift all affect the result.

The safe statement is therefore:

> Learned surfaces are training-dependent research paths. Their accuracy is not claimed by the v1.0.0 manual without a surviving artifact. Their returned correction still passes the same `Hc = s` gate.

This distinction is valuable to both researchers and product teams. A model can be useful as a prior without becoming the authority on correctness.

## 6. A practical failure mode

Suppose BP marks most qubits reliable but freezes one wrong bit. That bit contributes a nonzero term to `H_rel e_rel`, so the residual syndrome records the mistake. A component solver that ignores that residual may return a plausible-looking vector with the wrong boundary. A component solver that receives `s_res` can repair it, and the final matrix product exposes any implementation bug immediately.

The residual is not optional bookkeeping. It is the interface between a probabilistic front end and a deterministic algebraic back end.

## 7. Choosing a threshold

Increasing `tau` makes more qubits ambiguous. That can improve the chance that the frozen set is reliable, but it also increases component sizes and enumeration cost. Decreasing `tau` freezes more qubits and may leave a harder residual.

The manual does not prescribe a universal threshold. A responsible experiment should record:

```text
code family and matrix
training or calibration artifact
noise model and physical error rate
tau and K_max
component-size distribution
faithfulness failures and escalations
logical-observable results
seed, environment, and raw artifact hash
```

A threshold selected on one code family should not be described as a general decoder law.

## 8. Where this fits in routing

Ambiguity clustering is a useful middle path between a full BP-OSD solve and an unverified learned guess:

```text
BP reliabilities
      |
      v
freeze reliable bits -> compute residual -> solve ambiguous components
      |
      v
verify H @ correction == syndrome
      |
      v
score logical observables or escalate
```

The routing layer may use a learned predecoder to choose weights or priors, but structural eligibility and syndrome verification remain deterministic. That separation also makes it possible to compare a learned configuration with an unlearned baseline without changing the correctness test.

## Takeaway

Ambiguity clustering localizes uncertainty; it does not redefine correctness. Learned priors can make a decoder more informed, and exact local solves can reduce unnecessary global work, but both remain subordinate to the residual equation and the logical-coset metric. That is how to add AI to QEC without moving the proof goalposts.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
