# Ambiguity Clustering and Learned Predecoders: Adding AI Without Moving the Proof

Author: Guillaume Lessard / qector.store  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: qLDPC, ambiguity clustering, GNN, neural predecoder, decoder verification

## Abstract

Belief propagation can leave only a small part of a qLDPC problem uncertain, even when its global hard decision is not faithful. Ambiguity clustering exploits that: freeze confident qubits, compute the residual syndrome, and solve disconnected ambiguous components exactly when they are small. QECTOR also exposes learned predecoder surfaces that supply priors or dynamic weights. The architectural boundary matters: learned components may influence the selected correction, but the final syndrome-faithfulness gate stays algebraic and independent of training quality.

## 1. Confidence is not correctness

After BP, each qubit receives a posterior log-likelihood ratio `gamma_q`. A large magnitude means the model is confident about the bit. It does not prove the bit correct. A hard decision can still fail the syndrome equation

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

Freeze the reliable set to its hard decision `e_rel` and compute the residual

$$
s_{res} = s + H_{rel}e_{rel} \pmod 2.
$$

If `s_res` is zero, the frozen assignment is already faithful. Otherwise the remaining work concentrates on the ambiguous support.

## 2. Component-wise solving

Build the Tanner-induced subgraph on `Q_amb`. When the component-separation condition holds, it decomposes into connected components `C_k` with disjoint column support. QECTOR's documented strategy is:

1. Solve a component exactly by enumeration when its size is at most the configured `K_max`, documented as 12 by default.
2. Use a restricted OSD-0 solve for larger components.
3. Escalate if a component cannot satisfy its residual syndrome.
4. XOR the component corrections with the frozen reliable assignment.

The exact path searches the local space, not the full `2^n` space. It is attractive when BP confidence leaves small disconnected islands. It is not a promise that every qLDPC instance decomposes into small components.

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

The threshold `tau` changes which representative is frozen and which work is enumerated. It does not change the algebraic conclusion, as long as every component residual is solved or escalated.

## 4. Logical scoring remains a separate layer

Faithfulness implies `c + e` lies in `ker(H)`. It does not identify whether that residual is a stabilizer or a logical operator. For a stabilizer code, the logical criterion remains

$$
c + e \in \operatorname{im}(H^T)
$$

for success. An exact local component solve can still pick a globally nontrivial logical coset when the code's logical structure crosses a component boundary. That is why the manual calls the method faithful and exact within clusters, but makes no universal logical-accuracy claim for any learned or thresholded configuration.

## 5. Learned predecoders

The manual describes two research-grade surfaces, available in the package as `NeuralPredecoder` and `GNNPredecoder`:

- `NeuralPredecoder`: a small leaky-ReLU MLP trained with SGD.
- `GNNPredecoder`: a message-passing network with a softplus edge readout that predicts dynamic per-edge weights.

```python
from qector_decoder_v3 import NeuralPredecoder, GNNPredecoder
```

The learned output can influence BP priors, reliability ordering, or matching weights. A positive softplus readout is useful when the downstream matching path expects non-negative edge costs. But training data, architecture, calibration, and distribution shift all affect the result.

The safe statement is therefore:

> Learned surfaces are training-dependent research paths. Their accuracy is not claimed by the v1.0.0 manual without a surviving artifact. Their returned correction still passes the same `Hc = s` gate.

This distinction serves both researchers and product teams. A model can be a useful prior without becoming the authority on correctness.

## 6. A practical failure mode

Suppose BP marks most qubits reliable but freezes one wrong bit. That bit contributes a nonzero term to `H_rel e_rel`, so the residual syndrome records the mistake. A component solver that ignores the residual may return a plausible-looking vector with the wrong boundary. A solver that receives `s_res` can repair it, and the final matrix product exposes any implementation bug immediately.

The residual is not optional bookkeeping. It is the interface between a probabilistic front end and a deterministic algebraic back end.

## 7. Choosing a threshold

Raising `tau` makes more qubits ambiguous. That can improve the chance that the frozen set is reliable, but it also grows component sizes and enumeration cost. Lowering `tau` freezes more qubits and may leave a harder residual. The manual prescribes no universal threshold.

A responsible experiment should record:

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

A threshold tuned on one code family should not be described as a general decoder law.

## 8. Where this fits in routing

Ambiguity clustering is a middle path between a full BP-OSD solve and an unverified learned guess:

```text
BP reliabilities
      |
      v
freeze reliable bits -> residual -> solve ambiguous components
      |
      v
verify H @ correction == syndrome
      |
      v
score logical observables or escalate
```

The routing layer may use a learned predecoder to choose weights or priors, but structural eligibility and syndrome verification stay deterministic. That separation lets a learned configuration be compared against an unlearned baseline without changing the correctness test.

## Takeaway

Ambiguity clustering localizes uncertainty; it does not redefine correctness. Learned priors can make a decoder more informed, and exact local solves can reduce unnecessary global work, but both stay subordinate to the residual equation and the logical-coset metric. That is how to add AI to QEC without moving the proof goalposts.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
