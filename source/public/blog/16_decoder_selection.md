# Choosing a QEC Decoder From the Matrix, Not the Marketing Name

Author: Guillaume Lessard / qector.store  
Series: QECTOR Decoder v3 companion notes, Post 16  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)
Tags: decoder selection, QEC architecture, graphlike codes, qLDPC, routing

## Abstract

Decoder selection gets easier when it starts with structural facts. Is the induced matrix graphlike? Are weights available? Is the workload single-shot, streaming, or batched? Does the job prioritize accuracy, speed, or a balance of both? This guide turns those questions into a practical decision path and spells out what each choice guarantees and what it does not.

## 1. Start with the check structure

Inspect `check_to_qubits` or the DEM-derived matrix. Count how many checks each qubit or mechanism touches, then take the maximum.

```text
max degree <= 2  -> graphlike candidate set
max degree > 2   -> non-graphlike; BP-OSD path
```

Do this before reading the code-family label. A rotated surface code and a hypergraph-product qLDPC code are both stabilizer codes, yet they need different decoder families. The matrix decides, not the name.

## 2. The decision guide

| Workload fact | First candidate | Why |
|---|---|---|
| Small code with stored entries | Lookup table | Exhaustive stored mapping |
| Graphlike, accuracy priority | Blossom | Weighted MWPM reference path |
| Graphlike, larger sparse instance | Sparse Blossom | Event-driven tight-edge growth |
| Graphlike, speed priority | Union-Find | Cluster growth and peeling |
| Graphlike with escalation policy | Hybrid cascade | Faithful pre-filter plus fallback |
| Non-graphlike qLDPC or hyperedges | BP-OSD | Arbitrary GF(2) matrix path |
| Small ambiguous qLDPC components | Ambiguity clustering | Exact local enumeration where bounded |
| Multiple noisy rounds | Space-time decoder | Lifts data and measurement faults |
| Repeated online window | Streaming primitives | Bounded-history workflow |
| Large graphlike batch | CPU/GPU batch | Independent per-shot execution |
| Correlated CSS sectors | Two-stage decoder | Feeds X-induced syndrome into Z |

This table lists domains and contracts, not a universal performance ranking.

## 3. Accuracy, speed, and balanced priorities

For graphlike inputs, a routing policy can set a priority:

- `accuracy`: exact Blossom for small and moderate problems, Sparse Blossom for larger ones;
- `speed`: Union-Find, or a batch path when the workload is large enough;
- `balanced`: interpolate from code size and batch shape.

The exact thresholds are configuration, not physics. Record them alongside any published result. For a non-graphlike problem, the structure forces the BP-OSD path, whatever the speed or accuracy preference.

## 4. A practical routing sequence

```text
1. Parse checks or DEM.
2. Verify the reachable-syndrome convention and boundaries.
3. Classify graphlike versus hypergraph.
4. Select weights from the DEM when available.
5. Choose single-shot, batch, space-time, or streaming mode.
6. Select the decoder priority.
7. Decode and verify H @ c == s.
8. Score logical observables or escalate.
```

Step 7 belongs in the sequence even when the decoder's own tests already establish faithfulness. It guards the integration boundary: matrix ordering, dtype, boundary convention, and syndrome shape can all be wrong outside the decoder.

## 5. What each choice means

### Blossom

Use it as the weighted MWPM reference for graphlike problems and for audited exactness comparisons on small codes. It does not accept a hypergraph under a new label.

### Sparse Blossom

Use it when event-driven region growth is the right tool. The v1.0.0 claim is faithful and near-optimal within tested scope, with escalation when the sparse candidate solve is incomplete or unfaithful.

### Union-Find

Use it for supported graphlike codes when near-linear cluster growth and peeling are the contract you want. It is not minimum-weight matching, and its logical behaviour must be evaluated on its own.

### BP-OSD

Use it for arbitrary reachable GF(2) matrices, especially LDPC/qLDPC and hyperedge structures. BP ranks candidates; OSD then solves the residual exactly over a basis.

### Space-time

Use it when measurement faults across rounds are part of the problem. A single-round decoder cannot tell whether a transient detector event was spatial or temporal without an appropriate history model.

## 6. A decision example

Suppose a team has:

```text
rotated surface patch
graphlike check structure
calibrated data and measurement probabilities
many independent shots
offline logical-error estimation
```

The path is:

```text
DEM -> graph collapse and weights -> space-time if rounds are noisy
    -> CPU/GPU batch for the sampling workload
    -> observable scoring and Wilson interval
```

For a single online round with a tight latency budget, the same physical code might use a Union-Find or cascade path. The router is allowed to choose differently because the workload changed, and the claim and timing basis change with it.

## 7. Do not confuse API stability with algorithmic scope

Version 1.0.0 freezes a stable surface for the whole 1.x line. Stable symbols include `UnionFindDecoder`, `BlossomDecoder`, `SparseBlossomDecoder`, `NativeAutoDecoder`, the four `generate_*_code_checks` helpers, `set_license_key`, `get_license_info`, the Sinter and qiskit-qec entry points, and `DecodeResult`.

Provisional surfaces stay supported and tested, but their exact shape may change with a changelog note. This group includes BP-OSD tuning kwargs, GPU batch constructors, and network surfaces.

A stable constructor does not make every backend valid for every matrix. API stability answers one question: "can I rely on this symbol across the 1.x line?" Domain eligibility answers another: "is this algorithm valid for my problem?"

## 8. Selection checklist

Before committing to a decoder, write one sentence for each:

```text
My matrix is graphlike because ...
My noise model is ... and my weights are ...
My workload is single-shot, batch, space-time, or streaming because ...
My priority is ...
My logical metric is ...
My correctness evidence is ...
My fallback is ...
```

If those sentences cannot be written, the decoder choice is not ready for a benchmark or a deployment review.

## Takeaway

Choose the decoder from the matrix, the noise model, the time horizon, and the workload shape. The code name is a hint; the structural guard and the evidence contract are the decision. QECTOR's orchestration layer makes that decision explicit, but it does not replace engineering judgment.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
