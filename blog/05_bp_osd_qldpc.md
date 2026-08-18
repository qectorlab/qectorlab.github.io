# BP-OSD for qLDPC: When Matching Stops Being the Right Abstraction

Author: Guillaume Lessard / qector.store  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: qLDPC, BP-OSD, belief propagation, ordered statistics, GF(2), hypergraphs

## Abstract

Minimum-weight matching is natural when each fault mechanism touches at most two detectors. Quantum LDPC and other non-graphlike codes do not provide that guarantee. BP-OSD is QECTOR's general GF(2) path: belief propagation supplies a reliability ordering, then ordered-statistics decoding solves a residual linear system. The important design separation is that beliefs choose a candidate representative while the algebraic solve restores syndrome faithfulness. This post derives the log-domain update, the OSD-0/OSD-W stages, and the residual-solve theorem, then explains the numerical, batching, and claim boundaries documented in v1.0.0.

## 1. Why hyperedges change the decoder choice

Let a column of `H` describe one fault mechanism. If that column has weight two, it can be drawn as a graph edge between two detectors. If it has weight three or more, it is a hyperedge. Pairing its detectors independently loses the fact that one mechanism caused all of them.

QECTOR uses the structural rule

```text
max qubit/check degree <= 2  -> graphlike decoders may be eligible
any degree > 2               -> matching is ineligible; use BP-OSD
```

The BP-OSD contract is expressed for an arbitrary reachable GF(2) matrix. This is why it is the correct fallback for qLDPC, color-code, and general hypergraph inputs.

## 2. Belief propagation in the log domain

For each qubit `q`, let the prior log-likelihood ratio be combined with messages from neighboring checks. With `m_(q->c)` and `m_(c->q)` denoting variable-to-check and check-to-variable messages, the exact sum-product check update uses

$$
m_{c\to q} = \operatorname{sgn}\left(\prod_{q'\in N(c)\setminus q}m_{q'\to c}\right)
\phi\left(\sum_{q'\in N(c)\setminus q}\phi(|m_{q'\to c}|)\right),
$$

where

$$
\phi(x) = -\log\left(\tanh\frac{x}{2}\right) = \log\coth\frac{x}{2}.
$$

The posterior reliability is

$$
\gamma_q = \operatorname{LLR}_{prior}(q) + \sum_{c\in N(q)}m_{c\to q}.
$$

The decoder hard-decodes from the signs of `gamma`. If that hard decision already satisfies `H e = s`, it can return immediately. Otherwise it passes the residual to OSD.

QECTOR also documents min-sum as an opt-in approximation and a relay/layered schedule in which checks are processed sequentially. These are schedule choices; they do not remove the need for the faithful post-process.

## 3. Ordered statistics decoding

OSD uses BP for ranking rather than treating BP's hard decision as infallible.

1. Sort qubit columns by ascending `|gamma_q|`, so the least reliable columns are known.
2. Extract a rank-`r` independent column basis of `H` using GF(2) elimination.
3. Keep BP's hard decisions on the fixed/free portion according to the implementation's basis convention.
4. Solve the basis for the residual syndrome.
5. For OSD-W, sweep combinations among a width

   $$
   W = \max(2\,\text{osd\_order}, 6)
   $$

   of the least-reliable columns and retain the lowest-weight faithful candidate.

OSD-0 performs one residual solve. Higher order adds a search over selected reliability perturbations. The search changes which representative is preferred; it does not change the syndrome equation that every candidate must satisfy.

## 4. The residual-solve theorem

Let `B` be a rank-`r` column basis of `H`. Suppose the fixed columns contribute `H_fixed e_fixed`. Define

$$
s_{eff} = s + H_{fixed}e_{fixed} \pmod 2.
$$

The OSD stage solves

$$
H_B e_B = s_{eff} \pmod 2.
$$

### Theorem

If `s` is reachable, every OSD candidate constructed from a consistent residual solve satisfies `Hc = s (mod 2)`.

### Proof

Reachability means `s` lies in the column space of `H`. The fixed contribution also lies in that column space, so their sum `s_eff` remains in it. Because `B` is a full-rank column basis, the residual system has a solution for every reachable residual. Reconstructing the full correction gives

$$
Hc = H_{fixed}e_{fixed} + H_B e_B
    = H_{fixed}e_{fixed} + s_{eff}
    = s \pmod 2.
$$

Therefore BP convergence affects which candidate the decoder prefers, but not whether the OSD candidate reproduces the reachable syndrome.

## 5. What OSD does and does not optimize

The reliability ordering is a proxy for the probability of each error bit. OSD-W can search multiple low-reliability combinations and select a lower-weight candidate. In a degenerate quantum code, the goal is not raw-vector equality with the sampled error. The residual must land in the correct logical coset:

$$
c + e \in \operatorname{im}(H^T)
$$

for logical success. Faithfulness only establishes `c + e in ker(H)`.

This division of labour is useful:

| Stage | Question answered |
|---|---|
| BP | Which qubits look reliable or ambiguous? |
| GF(2) basis solve | Can the residual syndrome be satisfied exactly? |
| OSD-W search | Which faithful representative has the best available weight? |
| Logical scoring | Did the residual stay in the stabilizer coset? |

## 6. Numerical stability and implementation scope

The manual records two check-node rules, exact sum-product and min-sum, plus a relay schedule. The Rust implementation evaluates the box-plus function exactly in a small range and uses a tabulated interpolation path over a larger range. The relevant evidence is numerical-stability testing, not a universal floating-point guarantee across arbitrary hardware.

The Python batch path can run BP over a batch on a usable GPU and send only non-converged shots through the exact GF(2) post-process. Without a device it falls back to NumPy with the same validity contract. The single-shot path is CPU-oriented because a GPU launch is not assumed to amortize for one syndrome.

## 7. Complexity language that stays honest

The manual describes the dominant terms as BP message work plus GF(2) elimination and any OSD-W search. A compact workload-level expression is

$$
O(I_{BP}E + r^3 + \text{OSD search work}),
$$

where `I_BP` is the iteration count, `E` the Tanner-graph edge count, and `r` the matrix rank. These terms explain tuning pressure; they are not a wall-clock result.

An evaluation must state the matrix, rank, message schedule, damping or min-sum choice, OSD order, dtype, batch size, device, seed, and artifact. A qLDPC result without those details is difficult to reproduce and should not be presented as a general threshold.

## 8. A small residual example

Take

$$
H = \begin{bmatrix}1&1&0\\0&1&1\end{bmatrix},\qquad s = [1,0].
$$

If the hard decision is `[1,0,0]`, it already satisfies the syndrome. If BP instead proposes `[0,1,0]`, then

```text
H @ [0, 1, 0] = [1, 1]
residual = [1, 0] + [1, 1] = [0, 1]  (mod 2)
```

Fix column 1 at its proposed value and use columns 0 and 2 as a basis. Column 2 contributes `[0,1]`, so the repaired candidate is `[0,1,1]`. Multiplication gives

```text
H @ [0, 1, 1] = [1, 0]  (mod 2).
```

The hard decision was not faithful; the OSD residual solve was.

## Takeaway

BP-OSD is not "matching with more messages." It is a different contract for a different matrix structure. BP supplies soft information, OSD supplies an exact GF(2) repair, and logical evaluation remains a coset question. That separation is what lets QECTOR handle non-graphlike checks without pretending that hyperedges are ordinary graph edges.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
