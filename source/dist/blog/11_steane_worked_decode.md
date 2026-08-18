# A Hand-Worked Steane Decode: Syndrome, Stabilizers, and Logical Cosets

Author: Guillaume Lessard / qector.store  
Series: QECTOR Decoder v3 companion notes, Post 11  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: Steane code, CSS codes, stabilizer codes, worked example, QEC education

## Abstract

The Steane `[[7,1,3]]` code is small enough to verify on paper and rich enough to show the distinction between a syndrome-valid correction and a logically correct correction. This worked example writes one sector's parity-check matrix, computes a syndrome for a single-qubit error, shows the stabilizer coset freedom, and connects the calculation to QECTOR's decoder contract.

## 1. The check matrix

Use the three check supports from the reference manual:

```text
S0 = {3, 4, 5, 6}
S1 = {1, 2, 5, 6}
S2 = {0, 2, 4, 6}
```

With columns ordered `q0` through `q6`, one sector matrix is

$$
H =
\begin{bmatrix}
0&0&0&1&1&1&1\\
0&1&1&0&0&1&1\\
1&0&1&0&1&0&1
\end{bmatrix}.
$$

All arithmetic below is over `F2`.

The Steane construction uses the same classical check structure in the X and Z sectors. Each sector has rank 3. The CSS dimension count is

$$
k = 7 - \operatorname{rank}(H_X) - \operatorname{rank}(H_Z) = 7-3-3=1.
$$

## 2. Create a syndrome by hand

Take a single error on qubit 5:

```text
```

Column 5 of `H` is `[1,1,0]`, so

$$
s = He = [1,1,0].
$$

The first and second checks fire because both contain qubit 5. The third check does not.

This is the complete measured information available to a sector decoder. It does not identify the physical error uniquely because stabilizer codes are degenerate.

## 3. Verify the obvious correction

The original error is a syndrome-faithful correction in this example:

```text
c = [0, 0, 0, 0, 0, 1, 0]
H @ c = [1, 1, 0]  (mod 2)
```

The residual is zero:

$$
c+e=0 \in \operatorname{im}(H^T).
$$

The logical state is unchanged.

## 4. Add a stabilizer and nothing changes logically

Let `g` be any row combination of the relevant stabilizer matrix. Because stabilizers have zero syndrome,

$$
Hg^T = 0.
$$

The correction `c' = c + g` then satisfies

$$
Hc' = Hc + Hg^T = s.
$$

But `c'` is generally a different bit string. Comparing `c'` to `e` bit by bit would report a mismatch even though

$$
c' + e = g \in \operatorname{im}(H^T)
$$

and the logical action is identical.

This is the smallest useful demonstration of degeneracy: the decoder needs to choose the right logical coset, not reproduce the exact microscopic error.

## 5. Kernel and row-space dimensions

For one sector, rank-nullity gives

$$
\dim\ker(H) = 7-3=4.
$$

The row space has dimension 3. The quotient therefore has dimension 1:

$$
\dim\left(\ker(H)/\operatorname{im}(H^T)\right)=1.
$$

Combining X and Z sectors produces four logical cosets, conventionally represented as `I`, `Xbar`, `Zbar`, and `Ybar`. A syndrome-faithful correction lands in one of those cosets; the logical observable decides whether that landing is harmless.

## 6. What a decoder test should assert

For a known error `e` and returned correction `c`, use two assertions:

```text
1. H @ c == H @ e                 # syndrome faithfulness
2. c + e is in the stabilizer span # logical success
```

The first assertion applies to every supported backend. The second depends on the code's stabilizer and logical-operator representation. A test that checks only `c == e` rejects valid degenerate corrections.

## 7. Relation to the public API

The manual's direct decode example uses a repetition code, but the contract is the same for a Steane sector: pass a check structure, a reachable `uint8` syndrome, and receive a correction vector of the declared qubit length. The caller remains responsible for validating the matrix convention and for scoring the logical coset when the true error or observable data is available.

## Takeaway

The Steane code makes the full QEC argument visible in seven columns:

```text
physical error -> syndrome -> faithful correction -> kernel residual -> logical coset
```

The matrix multiplication proves the decoder returned to the code space. The row-space test decides whether it returned to the correct logical state. Those are different tests, and both matter.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
