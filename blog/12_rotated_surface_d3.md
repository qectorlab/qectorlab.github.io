# Rotated Surface Code d=3: The Smallest Useful Detector Graph

Author: Guillaume Lessard  
Series: QECTOR Decoder v3 companion notes, Post 12  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)
Tags: rotated surface code, graphlike codes, detector graphs, boundaries, QEC

## Abstract

Distance-three surface codes are small enough for a complete structural audit and large enough to show boundaries, logical strings, and the graphlike condition. The QECTOR reference manual describes one sector of the rotated surface code at `d=3`: nine data qubits, four checks, one logical qubit per combined CSS code. This post explains what that description means, why matching applies, and how to avoid confusing a graphlike rotated construction with an explicitly non-graphlike legacy generator.

## 1. The geometry

Arrange nine data qubits on a `3 x 3` grid. In one sector, the manual describes four checks:

- two weight-4 plaquette checks on the even sublattice;
- one weight-2 check on the top boundary;
- one weight-2 check on the bottom boundary.

The X and Z sectors act on the same nine data qubits, giving eight checks in the combined CSS description.

The exact index convention belongs to the code constructor. Do not infer an index ordering from a picture; the `check_to_qubits` structure or the code helper is the authoritative object passed to a decoder.

## 2. Why the sector is graphlike

Every qubit participates in at most two checks per sector. In the detector representation, a qubit is therefore an edge joining two detector nodes, or an edge joining one detector to a virtual boundary. That is the structural condition required by the matching and Union-Find decoder families.

This condition is independent of the word "surface" in a class name. A legacy toric-style weight-4 generator can be explicitly non-graphlike, while `codes.rotated_surface_code` is the documented graphlike construction for this use. The decoder family must match the actual matrix, not the class name.

## 3. Dimension count

For one sector the manual gives `n=9` data qubits and `m=4` checks. The kernel has dimension 5 and the stabilizer row space has dimension 4:

$$
\dim\ker(H)=5,\qquad \dim\operatorname{im}(H^T)=4.
$$

The quotient has dimension 1: the single logical qubit of the code. A representative logical string runs horizontally across the top row in the manual's convention.

The quotient is why a zero-syndrome cycle can still be a logical operator. A decoder can satisfy every check and still land in a nontrivial homology class.

## 4. Boundaries are virtual nodes

On an open surface patch, a defect can be paired with a boundary instead of another defect. The boundary is represented as a virtual node that contributes no syndrome bit. In a path proof, a boundary path has one physical endpoint and one invisible virtual endpoint, so its detector boundary is a single defect.

This convention affects four things:

```text
which syndromes are reachable
which paths are legal
how matching costs are computed
how Union-Find decides an odd cluster is satisfied
```

It must be held constant across code generation, decoder construction, and logical-observable scoring.

## 5. One sector, one error chain

Suppose a single data error flips two checks. In the detector graph it creates two defects. The decoder connects them with a path whose boundary is exactly those two nodes. If the error touches a boundary, the syndrome can contain one defect, and the decoder connects it to the corresponding virtual boundary node.

For any returned graph path `c`, the core check is

$$
Hc=s \pmod 2.
$$

The matching objective or the Union-Find growth rule chooses the path. The boundary equation verifies it.

## 6. What distance three demonstrates

The small code is useful for more than a tutorial. Everything can be enumerated:

- every check and qubit listed explicitly;
- reachable syndromes generated exhaustively;
- lookup tables checked entry by entry;
- Blossom compared against a brute-force oracle;
- Union-Find peeling verified on every reachable input;
- logical strings and stabilizer products listed explicitly.

Exactness claims should be anchored on these small audited workloads before anyone extrapolates to larger distances.

## 7. API caution

The v1.0.0 stable API lists `generate_surface_code_checks(d)` as a legacy toric-style weight-4 generator and explicitly warns that it is not graphlike. For a graphlike rotated surface code, use the documented `codes.rotated_surface_code` path.

This is a small naming detail with a large correctness consequence: a matching decoder is only valid on a genuinely graphlike matrix.

## 8. A structural audit checklist

Before routing a `d=3` surface instance to matching or Union-Find, confirm:

```text
number of data qubits: 9
checks per sector: 4
combined CSS checks: 8
maximum qubit degree per sector: 2
boundary convention: explicit and consistent
logical observables: defined for scoring
```

Then generate a reachable syndrome from an error vector and verify `H @ correction == syndrome` modulo two. For logical tests, compare observables or the stabilizer quotient, not only the correction vector.

## Takeaway

The rotated `d=3` patch is a complete miniature of graphlike QEC: local checks become detector nodes, data qubits become edges, boundaries become virtual sinks, and logical strings live in the kernel outside the stabilizer span. Audit this structure first; only then choose the decoder.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
