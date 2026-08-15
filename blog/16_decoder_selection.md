# Choosing a QEC Decoder From the Matrix, Not the Marketing Name

Author: Guillaume Lessard / qector.store  
Series: QECTOR Decoder v3 companion notes, Post 16  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: decoder selection, QEC architecture, graphlike codes, qLDPC, routing

## Abstract

Decoder selection becomes easier when it starts with structural facts. Is the induced matrix graphlike? Are weights available? Is the workload single-shot, streaming, or batched? Is the priority accuracy, speed, or balanced operation? This guide turns those questions into a practical QECTOR decision path and explains what each choice does and does not guarantee.

## 1. Start with the actual check structure

Inspect `check_to_qubits` or the DEM-derived matrix. Compute the maximum number of checks touched by any qubit or mechanism.

```text
max degree <= 2  -> graphlike candidate set
max degree > 2   -> non-graphlike; BP-OSD path
```

Do this before looking at the code-family label. A graphlike rotated surface code and a hypergraph-product qLDPC code need different decoder families even when both are described as stabilizer codes.

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
| Multiple noisy rounds | Space-time decoder | Lift data and measurement faults |
| Repeated online window | Streaming primitives | Bounded history workflow |
| Large graphlike batch | CPU/GPU batch | Independent per-shot execution |
| Correlated CSS sectors | Two-stage decoder | Feed X-induced syndrome into Z |

These are domains and contracts, not a universal performance ranking.

## 3. Accuracy, speed, and balanced priorities

For graphlike inputs, QECTOR's recommendation policy can use a priority:

- `accuracy`: exact Blossom for small/moderate problems and Sparse Blossom for larger ones;
- `speed`: Fast Union-Find or a batch path when the workload is large enough;
- `balanced`: interpolate using code size and batch shape.

The actual thresholds for a policy are configuration details. They should be recorded if a result is published. If the problem is non-graphlike, BP-OSD is forced by structure rather than by a speed/accuracy preference.

## 4. A practical routing sequence

```text
1. Parse checks or DEM.
2. Verify reachable-syndrome convention and boundaries.
3. Classify graphlike versus hypergraph.
4. Select weights from the DEM when available.
5. Choose single-shot, batch, space-time, or streaming mode.
6. Select the decoder priority.
7. Decode and verify H @ c == s.
8. Score logical observables or escalate.
```

The verification step belongs in the sequence even for a decoder whose own tests establish faithfulness. It protects the integration boundary: matrix ordering, dtype, boundary convention, and syndrome shape can all be wrong outside the decoder.

## 5. What each choice means

### Blossom

Use it as the weighted MWPM reference for graphlike problems and audited small-code exactness comparisons. It does not accept a hypergraph by relabeling it.

### Sparse Blossom

Use it when event-driven region growth is appropriate. The v1.0.0 claim is faithful and near-optimal within tested scope, with escalation if the sparse candidate solve is incomplete or unfaithful.

### Union-Find

Use it for supported graphlike codes when near-linear cluster growth and peeling are the desired contract. It is not minimum-weight matching and its logical behaviour must be evaluated separately.

### BP-OSD

Use it for arbitrary reachable GF(2) matrices, especially LDPC/qLDPC and hyperedge structures. BP ranks candidates; OSD solves the residual exactly over a basis.

### Space-time

Use it when measurement faults across rounds are part of the problem. A single-round decoder cannot infer whether a transient detector event was spatial or temporal without an appropriate history model.

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

For a single online round with a tight latency budget, the same physical code may use a graphlike Union-Find or cascade path, but the claim and timing basis are different. The router is allowed to choose differently because the workload changed.

## 7. Do not confuse API stability with algorithmic scope

The manual separates stable and provisional surfaces. Stable symbols include the core Union-Find, Blossom, Sparse Blossom, code helpers, licensing functions, shot accounting, and `DecodeResult`. Batch, auto, streaming, BP-OSD tuning, GPU, and network surfaces are supported but some are provisional or workload-sensitive.

A stable constructor does not mean that every backend is appropriate for every matrix. API stability answers "can I rely on this symbol in the 1.x line?" Domain eligibility answers "is this algorithm valid for my problem?"

## 8. Selection checklist

Before committing to a decoder, write one sentence answering each:

```text
My matrix is graphlike because ...
My noise model is ... and my weights are ...
My workload is single-shot, batch, space-time, or streaming because ...
My priority is ...
My logical metric is ...
My correctness evidence is ...
My fallback is ...
```

If those sentences cannot be written, the decoder choice is not ready for a benchmark or deployment review.

## Takeaway

Choose the decoder from the matrix, noise model, time horizon, and workload shape. The code name is a useful hint; the structural guard and evidence contract are the decision. QECTOR's orchestration layer makes that decision explicit, but it does not remove the need for engineering judgment.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
