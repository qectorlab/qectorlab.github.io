# Exact Blossom Decoding: Why MWPM Is a Reference Solver for Graphlike QEC

Author: Guillaume Lessard / qector.store  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: MWPM, Blossom, graphlike decoding, surface codes, optimization

## Abstract

For a graphlike detector model, a syndrome is a set of defects. Minimum-weight perfect matching (MWPM) pairs those defects, and each pair is expanded into a minimum-weight path in the detector graph. QECTOR's `BlossomDecoder` implements the exact weighted matching contract described in the v1.0.0 manual. This post explains the matching problem, the primal-dual view of Edmonds' algorithm, the path-flipping proof of syndrome faithfulness, and the boundary between the exact solver and sparse candidate generation.

## 1. From defects to a matching problem

Let `H` be a graphlike parity-check map and let `s` be a reachable syndrome. The defect set is

$$
D = \{v : s_v = 1\}.
$$

Each graph edge represents a fault mechanism. A mechanism with probability `p` receives the log-likelihood weight

$$
w = \log\left(\frac{1-p}{p}\right) = -\log\left(\frac{p}{1-p}\right).
$$

For two defects `u` and `v`, the matching graph uses the shortest-path distance between them. A virtual boundary node handles a one-ended path. The solver selects a perfect matching on the defects and then XORs the selected graph paths into one correction vector.

The graphlike condition matters: a mechanism touching three or more detectors is a hyperedge, not a matching edge. The correct QECTOR route for that structure is BP-OSD.

## 2. The primal and dual programs

For the complete graph on `D`, let `x_uv` indicate whether defects `u` and `v` are paired. The primal objective is

$$
\min \sum_{(u,v)} w_{uv}x_{uv}
$$

subject to every defect being matched exactly once, together with the odd-set constraints that define the matching polytope. The dual assigns vertex potentials and blossom potentials. In schematic form, its edge constraints are

$$
y_u + y_v + \sum_{B \ni u,v} z_B \leq w_{uv}, \qquad z_B \geq 0.
$$

An edge is *tight* when equality holds. Complementary slackness supplies the optimality certificate: an optimal matching can be supported by tight edges, and every active blossom has the required matching boundary condition.

Blossom contraction is not a heuristic shortcut. An odd cycle can prevent an augmenting path from being visible in the current alternating forest. Contracting that cycle into a temporary pseudonode lets the primal-dual search continue; expanding it restores the matching structure.

## 3. The path-flipping theorem

The matching objective chooses a likely pairing. The syndrome-faithfulness proof is a separate boundary argument.

### Theorem

Let `M` be a perfect matching of the defect set. For every matched pair `(u, v)`, let `P_uv` be a graph path between the two defects, or a path from a defect to the virtual boundary. Define

$$
c = \bigoplus_{(u,v)\in M} P_{uv}.
$$

Then `Hc = s (mod 2)`.

### Proof

The interior vertices of a path have even incidence, so they cancel over `F2`. A path from `u` to `v` has boundary `e_u + e_v`; a boundary path has boundary `e_u` because the virtual boundary contributes no detector syndrome. Therefore

$$
Hc = \bigoplus_{(u,v)\in M} (e_u + e_v).
$$

Every defect appears exactly once in the perfect matching, so the right-hand side is the XOR of all defect basis vectors. That is exactly `s`.

The proof does not require a unique path. If two shortest paths connect the same endpoints, their XOR is a cycle in `ker(H)`. This is degeneracy, not a correctness failure.

## 4. A hand-worked ring example

Consider the ring checks

```text
{0, 1}, {1, 2}, {2, 3}, {3, 4}, {4, 0}
```

and syndrome

```text
s = [1, 0, 1, 0, 0].
```

The defects are checks 0 and 2. There are two arcs between them:

- the short arc uses qubits 1 and 2, so `c_short = [0, 1, 1, 0, 0]`;
- the long arc uses qubits 0, 4, and 3.

With unit weights, the short arc is selected. Direct multiplication verifies

```text
H @ c_short = [1, 0, 1, 0, 0]  (mod 2).
```

If the edge probabilities change, the selected arc can change too. Both paths remain syndrome-faithful because they have the same boundary. The weight model selects a representative; it does not change the algebraic contract.

## 5. Exact solver versus sparse candidate generation

The dense matching problem grows quickly with the number of defects. QECTOR's exact `BlossomDecoder` is the reference weighted MWPM path and is documented as exact on the audited small matching codes. It is the right comparison point for correctness and optimality tests.

The sparse decoder uses a different engineering strategy. Candidate neighbors can be restricted with

$$
k = \max\left(12,\left\lceil k_{mult}\sqrt{|D|}\right\rceil\right),
$$

and the sparse solve can escalate to the full graph when the candidate set is incomplete or the returned correction fails verification. The manual therefore describes Sparse Blossom as faithful and near-optimal within its tested scope, not as a universal replacement for exact MWPM.

This distinction is useful in practice:

| Question | Exact Blossom | Sparse Blossom |
|---|---|---|
| Matching objective | Exact weighted MWPM | Event-driven sparse solve |
| Evidence boundary | Audited small matching codes | Tested faithfulness and near-optimality |
| Candidate graph | Full matching graph | Adaptive candidates with escalation |
| Shared gate | `H c = s` | `H c = s` |

## 6. Minimal API path

The stable API example in the manual is deliberately small:

```python
import numpy as np
from qector_decoder_v3 import BlossomDecoder

checks = [[0, 1], [1, 2], [2, 3], [3, 4]]
syndrome = np.array([0, 1, 0, 0], dtype=np.uint8)

correction = BlossomDecoder(checks, n_qubits=5).decode(syndrome)
# Validate H @ correction == syndrome modulo 2.
```

For a detector error model, parse the model, verify that it is graphlike, collapse parallel mechanisms when appropriate, and pass its likelihood weights to the decoder. Unweighted decoding is not a substitute for a circuit-level prior when mechanisms have different probabilities.

## 7. What MWPM does not prove

An optimal matching objective does not automatically prove a threshold for every code, noise model, or implementation. Nor does a faithful correction imply logical success for the sampled error. The logical test remains

$$
c + e \in \operatorname{im}(H^T).
$$

Any public comparison should name the code family, distance, rounds, noise model, DEM settings, decoder mode, shots, seed, environment, and raw artifact. The v1.0.0 manual intentionally excludes hardware-bound latency and throughput figures.

## Takeaway

Blossom is valuable not because every QEC problem is a matching problem, but because it provides a precise reference for the graphlike problems that are matching problems. The optimization certificate chooses the minimum-weight pairing; the path boundary proof guarantees the syndrome; the logical-coset test determines whether the correction is harmless.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
