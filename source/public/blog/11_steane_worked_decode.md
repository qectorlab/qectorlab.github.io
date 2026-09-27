# A Hand-Worked Steane Decode: Syndrome, Stabilizers, and Logical Cosets

Author: Guillaume Lessard  
Series: QECTOR Decoder v3 companion notes, Post 11  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)
Tags: Steane code, CSS codes, stabilizer codes, worked example, QEC education

## Abstract

The Steane `[[7,1,3]]` code is small enough to verify by hand and rich enough to expose the gap between a syndrome-valid correction and a logically correct one. This worked example writes out one sector's parity-check matrix, computes a syndrome for a single-qubit error, exhibits stabilizer coset freedom with explicit numbers, and maps every step onto QECTOR's decoder contract.

## 1. The check matrix

One sector of the Steane code uses three checks over seven qubits, taken from the reference manual:

```text
S0 = {3, 4, 5, 6}
S1 = {1, 2, 5, 6}
S2 = {0, 2, 4, 6}
```

With columns ordered `q0` through `q6`, the sector matrix is

$$
H =
\begin{bmatrix}
0&0&0&1&1&1&1\\
0&1&1&0&0&1&1\\
1&0&1&0&1&0&1
\end{bmatrix}.
$$

Each row lists which qubits participate in one check. Read row 0: the check fires when the parity of qubits 3, 4, 5, and 6 is odd. All arithmetic below is over `F2`.

The Steane construction reuses this classical structure in both the X and Z sectors. Each sector has rank 3, so the CSS dimension count is

$$
k = 7 - \operatorname{rank}(H_X) - \operatorname{rank}(H_Z) = 7-3-3=1.
$$

One logical qubit, as expected.

## 2. Create a syndrome by hand

Put a single error on qubit 5:

```text
e = [0, 0, 0, 0, 0, 1, 0]
```

Multiplying by `H` selects column 5:

$$
s = He = [1, 1, 0].
$$

Check it against the matrix: column 5 reads `[1, 1, 0]` from the three rows. Checks S0 and S1 fire because both contain qubit 5; check S2 does not.

That syndrome is the complete measured information a sector decoder receives. It does not identify the physical error, because stabilizer codes are degenerate: several distinct errors can produce the same syndrome.

## 3. Verify the obvious correction

The true error is itself a valid correction in this case:

```text
c = [0, 0, 0, 0, 0, 1, 0]
H @ c = [1, 1, 0]  (mod 2)
```

The residual is exactly zero:

$$
c + e = 0.
$$

Zero lies in the stabilizer row space, so the logical state is untouched. This case is deliberately trivial: it establishes the baseline before degeneracy complicates the picture.

## 4. Add a stabilizer: same syndrome, different bits

Take `g` to be row 0 of `H`:

```text
g = [0, 0, 0, 1, 1, 1, 1]
c' = c + g = [0, 0, 0, 1, 1, 0, 1]
```

Stabilizers have zero syndrome by construction, so `Hg^T = 0` and

$$
Hc' = Hc + Hg^T = s + 0 = s.
$$

Verify directly: row 0 of `H` dotted with `c'` gives `1+1+0+1 = 3 = 1 (mod 2)`; row 1 gives `0+0+0+1 = 1`; row 2 gives `0+0+1+1 = 2 = 0 (mod 2)`. So `Hc' = [1, 1, 0] = s`, confirmed.

Yet `c'` differs from `c` in four positions. A test comparing bit strings would report failure, even though

$$
c' + e = g \in \operatorname{im}(H^T)
$$

places the residual squarely in the stabilizer span. The logical action is identical.

This is the smallest useful demonstration of degeneracy. The decoder's job is to choose the right logical coset, not to reproduce the microscopic error.

## 5. Kernel and row-space dimensions

Rank-nullity for one sector gives

$$
\dim\ker(H) = 7 - 3 = 4,
$$

while the row space has dimension 3. The quotient therefore has dimension 1:

$$
\dim\left(\ker(H)/\operatorname{im}(H^T)\right) = 1.
$$

Combining the X and Z sectors yields four logical cosets, conventionally labelled `I`, `Xbar`, `Zbar`, and `Ybar`. A syndrome-faithful correction lands in one of them; only the logical observable reveals whether that landing was harmless.

## 6. What a decoder test should assert

For a known error `e` and a returned correction `c`, assert two things:

```text
1. H @ c == H @ e            # syndrome faithfulness
2. c + e in stabilizer span  # logical success
```

The first applies to every backend. The second needs the code's stabilizer and logical-operator representation. A test that checks only `c == e` rejects valid degenerate corrections and is wrong by design.

## 7. Relation to the public API

The manual's direct-decode example uses a repetition code, but the contract is identical for a Steane sector. The v1.0.0 API entry point is

```python
from qector_decoder_v3 import BlossomDecoder

decoder = BlossomDecoder(checks, n_qubits=7)
correction = decoder.decode(syndrome)
```

Pass a check structure, a reachable `uint8` syndrome, and receive a correction vector of the declared qubit length. Two responsibilities stay with the caller: validating the matrix convention, and scoring the logical coset when the true error or observable data is available.

## Takeaway

The Steane code makes the full QEC argument visible in seven columns:

```text
physical error -> syndrome -> faithful correction -> kernel residual -> logical coset
```

Matrix multiplication proves the decoder returned to the code space. The row-space test decides whether it returned to the correct logical state. Those are different tests, and both matter.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
