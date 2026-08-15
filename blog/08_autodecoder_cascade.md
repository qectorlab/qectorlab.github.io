# Routing QEC Workloads: AutoDecoder, Cascades, and Two-Stage CSS Decoding

Author: Guillaume Lessard / qector.store  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: decoder routing, cascade decoding, CSS codes, orchestration, QEC systems

## Abstract

A quantum error-correction stack rarely has one workload. It may receive a small code, a large batch, a graphlike surface-code syndrome, a qLDPC hypergraph, or two correlated CSS sectors. QECTOR's orchestration layer chooses an eligible backend, verifies the result, and escalates when the chosen path is unsuitable. This post explains the structural routing guard, the documented fallback sequence, the hybrid cascade acceptance criterion, two-stage CSS feedforward, lookup tables, and the limits of an `AutoDecoder` policy.

## 1. Routing is a validity decision

The first routing question is not speed. It is whether a decoder family is valid for the matrix.

```text
if any qubit touches more than two checks:
    matching and Union-Find are ineligible
    route to BP-OSD
else:
    graphlike decoders may be considered
```

This check is made from the actual `check_to_qubits` structure, not from a label supplied by a caller. A graphlike algorithm applied to a hypergraph is not a slower version of the correct algorithm; it is a different problem.

## 2. Policy inputs

The documented recommendation policy can consider:

- code family and topology;
- distance and qubit/check counts;
- batch size;
- priority such as accuracy, speed, or balanced operation;
- graphlike eligibility.

For graphlike inputs, an accuracy priority can select exact Blossom for small or moderate instances and Sparse Blossom for larger ones. A speed priority can select Fast Union-Find or a batch path. For non-graphlike inputs, BP-OSD is forced regardless of the supplied family label.

The policy is a recommendation. The backend contract and post-decode syndrome verification are the safety mechanisms.

## 3. The fallback controller

The Python `AutoDecoder` controller tries progressively safer execution paths and verifies the syndrome after each tier. The documented sequence includes native routing, CUDA, OpenCL, Rayon batch, CPU batch, single-thread execution, Blossom, and lookup-table paths, followed by BP-OSD as the arbitrary-GF(2) fallback. A zero correction is documented only as a last-resort return after all verification paths fail; it is not a successful decode claim.

This controller separates two failure classes:

- a backend may be unavailable because of hardware or licensing;
- a backend may return a result that is incomplete or fails `Hc = s`.

GPU failures disable the GPU path for subsequent attempts in the controller, while CPU paths may be retried for transient failures. Every route still inherits the contract of the selected backend.

## 4. The hybrid cascade

The cascade uses a cheap faithful pre-filter and an expensive fallback. Let `c_UF` be the Fast Union-Find result and let `W_budget` be a declared weight budget. The acceptance criterion is

$$
Hc_{UF} = s \pmod 2
\quad\text{and}\quad
|c_{UF}| \le W_{budget}.
$$

If both conditions pass, the correction is accepted. Otherwise the controller escalates to Blossom for a graphlike workload or BP-OSD for a non-graphlike workload/deadline path.

The parity check is not redundant even though UF is documented as faithful on supported graphs. It turns the cascade into a self-checking boundary and catches integration errors. The weight budget is a policy choice; it must be recorded with the workload rather than treated as a universal constant.

The cascade preserves syndrome faithfulness when the pre-filter is faithful and the fallback is faithful. It does not, by itself, prove that accepted UF corrections have the same logical-coset quality as exact MWPM on every noise model.

## 5. Two-stage CSS decoding

Independent X and Z decoders assume that sector errors are independent. Depolarizing noise contains Y errors, which couple the sectors. QECTOR documents a feedforward construction:

$$
c_X \leftarrow \operatorname{Decode}_X(s_X),
$$

$$
s'_Z = s_Z + H_{Z,X}c_X \pmod 2,
$$

$$
c_Z \leftarrow \operatorname{Decode}_Z(s'_Z),
$$

and `c = c_X + c_Z`.

If both sector decoders are faithful on their actual inputs, then stage two cancels the induced cross-coupling:

$$
H_Z(c_X+c_Z) = H_{Z,X}c_X + s'_Z = s_Z \pmod 2.
$$

Together with `H_X c_X = s_X`, the joint correction is faithful. The theorem establishes the algebraic composition, not a universal threshold improvement over independent decoding.

## 6. Lookup tables and small codes

For sufficiently small codes, a lookup table can enumerate stored syndrome-to-correction entries. The manual scopes `LookupTableDecoder` to small codes, with exhaustive entries for `n_qubits <= 20` and a Union-Find fallback. The lookup is exact for entries that are actually stored; it is not a general solution for arbitrary code sizes.

The table must still be generated and validated against the parity-check map. A fast array access is not evidence unless the stored correction satisfies the syndrome equation for its key.

## 7. Read routing decisions as contracts

A useful diagnostic record looks like this:

```text
input shape: checks, qubits, syndrome, batch
structural class: graphlike or hypergraph
priority: accuracy, speed, or balanced
selected backend and fallback order
weights and noise model
license/hardware availability
verification result: H @ c == s
logical score, if a sampled error/observable is available
```

This record makes a routing decision explainable. It also prevents an accidental benchmark comparison from mixing a graphlike path with a hypergraph path or an unweighted path with a DEM-weighted path.

## 8. Licensing is separate from hardware availability

The manual documents Community, Pro, and Enterprise distance caps of 7, 19, and 63, with GPU batch paths gated by Enterprise. Token verification is offline and performed in the Rust core. `is_available()` reports hardware; it does not grant a license tier. These are separate decisions and should remain separate in diagnostics and documentation.

## 9. The right claim about orchestration

An orchestrator can provide a common API, structural eligibility checks, fallback behaviour, and verification. It cannot make every backend exact, every workload comparable, or every hardware path production-ready. The manual explicitly classifies network surfaces as provisional and requires deployment review for authentication, rate limits, TLS, audit logging, and resource quotas.

## Takeaway

Good routing is not a table of speed slogans. It is a sequence of eligibility checks, policy choices, backend contracts, and verification gates. AutoDecoder chooses a path, Cascade limits the cost of escalation, and TwoStage handles CSS cross-talk. The final authority remains the actual matrix and the equation `Hc = s`.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
