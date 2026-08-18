# Syndrome Faithfulness: The Contract Every QEC Decoder Must Keep

Author: Guillaume Lessard / qector.store  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: quantum error correction, stabilizer codes, syndrome decoding, fault tolerance

## Abstract

Quantum error correction is often introduced as a search for the most likely physical error. A decoder has a more basic obligation first: the correction it returns must reproduce the measured syndrome. In the binary representation used by QECTOR, that obligation is

$$
Hc = s \pmod 2.
$$

This post develops the invariant from the parity-check map, proves why it puts the residual error in the kernel of `H`, and explains why that still does not settle the logical outcome. The distinction between a valid syndrome representative and a harmless stabilizer representative is the foundation for comparing every decoder family.

## 1. The binary picture

Work over the field `F2 = {0, 1}`. Addition is XOR. Let `n` be the number of physical qubits and `m` the number of checks. A binary error vector is `e in F2^n`; a parity-check matrix is `H in F2^(m x n)`; and the measured syndrome is

$$
s = He \pmod 2.
$$

The `j`-th syndrome bit records whether the error anticommutes with check `j`. The matrix is therefore not merely metadata for a decoder. It is the map that defines what the measurement means.

The Tanner graph has a qubit node for every column and a check node for every row. An edge means `H[j, i] = 1`. Different algorithms use this same incidence structure differently: message passing follows Tanner edges, Union-Find grows clusters, and graphlike matching interprets low-degree qubits as detector edges.

## 2. Stabilizers, kernels, and cosets

A stabilizer code is the common `+1` eigenspace of commuting Pauli checks. In the binary CSS picture, the two sectors have matrices `H_X` and `H_Z` satisfying

$$
H_X H_Z^T = 0 \pmod 2.
$$

For one sector, the zero-syndrome vectors form

$$
\ker(H) = \{v : Hv = 0\}.
$$

The row space `im(H^T)` is contained in this kernel when the corresponding stabilizers commute. Vectors in `im(H^T)` are products of stabilizers and act trivially on the code space. Vectors in `ker(H)` outside that row space are undetectable logical operators.

This is why a syndrome does not identify one unique physical error. If `e` produces `s`, then every vector in the affine set `e + ker(H)` produces the same syndrome. A decoder chooses a representative of that set using geometry, weights, beliefs, or a lookup table.

## 3. The syndrome-faithfulness theorem

Let a decoder return `c` for a reachable syndrome `s = He`.

### Theorem

The following statements are equivalent for the returned correction:

1. The correction is syndrome-faithful: `Hc = s`.
2. The residual `c + e` lies in `ker(H)`.

### Proof

If `Hc = s` and `He = s`, then

$$
H(c + e) = Hc + He = s + s = 0 \pmod 2.
$$

Therefore `c + e in ker(H)`. Conversely, if `H(c + e) = 0`, then

$$
Hc + He = 0 \quad\Longrightarrow\quad Hc = He = s \pmod 2.
$$

The equation is the complete algebraic gate for returning to the code space. It says nothing yet about which logical coset the residual occupies.

## 4. Logical success is a quotient question

The logical criterion is the next layer:

$$
\text{success} \iff c + e \in \operatorname{im}(H^T),
$$

and

$$
\text{logical failure} \iff c + e \in \ker(H) \setminus \operatorname{im}(H^T).
$$

Two corrections can be different bit strings and still be equally correct logically if their difference is a stabilizer. Scoring `c == e` is therefore the wrong metric for a degenerate stabilizer code. Logical observables or coset membership must be scored instead.

For a CSS code, the sector dimensions expose the same idea. If `H_X H_Z^T = 0`, then

$$
\dim\left(\ker(H_X) / \operatorname{im}(H_Z^T)\right) = k,
$$

so the quotient contains the logical degrees of freedom rather than the raw error representatives.

## 5. A small example: the Steane code

One sector of the Steane `[[7,1,3]]` code can use checks

```text
{3, 4, 5, 6}
{1, 2, 5, 6}
{0, 2, 4, 6}
```

Take an error on qubit 5:

```text
e = [0, 0, 0, 0, 0, 1, 0]
```

Qubit 5 belongs to the first two checks, so

```text
s = [1, 1, 0].
```

The minimal correction is `c = e`, but it is not the only faithful correction. If `g` is a stabilizer row combination, `c + g` also produces `[1, 1, 0]` and has the same logical action. A raw-vector comparison would call these different; a coset comparison would not.

## 6. What graphlike means

Matching-based decoders need an additional structural condition. In a graphlike detector model, every qubit or fault mechanism touches at most two checks. The qubit can then be represented as an edge between detector nodes, with a virtual boundary for one-ended mechanisms.

If any qubit participates in more than two checks, the induced mechanism is a hyperedge. It cannot be silently converted into pairwise matching edges without changing the problem. QECTOR's documented routing rule sends such a matrix to BP-OSD, whose contract works for arbitrary reachable GF(2) check matrices.

This guard is more important than a code-family label. A problem named "surface" is not automatically graphlike, and a general matrix is not automatically eligible for Blossom.

## 7. How the invariant travels through the engine

The reference manual describes fifteen specialized backends, but they share the same gate:

- Blossom constructs paths whose boundary is the defect set.
- Sparse Blossom processes tight collision events and escalates if a sparse solve is incomplete or unfaithful.
- Union-Find grows clusters and peels a spanning forest.
- BP-OSD repairs a residual syndrome with a GF(2) basis solve.
- Ambiguity clustering solves reliable and ambiguous components whose residuals sum to the global syndrome.
- Space-time decoding applies the same boundary argument to a lifted detector matrix.
- GPU batch paths are checked against the CPU reference on tested configurations.

The algorithms are not interchangeable. Their domains and accuracy claims differ. The invariant is the common contract that allows the routing layer and validation harness to compare them safely.

## 8. Evidence and claim boundaries

The manual anchors the faithfulness claim to the syndrome-faithfulness tests and cross-decoder tests in the frozen workspace. It separately scopes exact MWPM, Sparse Blossom, Union-Find, BP-OSD, DEM, GPU identity, and API claims to their named evidence.

It does **not** establish a universal threshold, a universal fastest backend, or a hardware-independent latency number. Those claims require a surviving artifact with the circuit, code, noise model, seed, shots, environment, raw results, and hash.

## Takeaway

The first question for any decoder is not "did it guess the exact error?" It is:

```text
Does H @ correction equal the reachable syndrome modulo 2?
```

Once that answer is yes, the remaining question is which element of `ker(H)` separates the correction from the true error. That is the logical-coset problem. Keeping these two questions separate is the shortest path to correct mathematics, honest benchmarks, and robust decoder engineering.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
