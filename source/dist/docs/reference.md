# QECTOR Decoder v3 Reference

Version: 1.0.0  
Reference manual: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Package: `qector-decoder-v3==1.0.0`

This page is the web companion to the reference manual. The PDF is normative for the complete mathematical proofs, implementation contracts, evidence anchors, limitations, and reproduction commands.

## Core contract

All supported decoders are evaluated against syndrome faithfulness:

```text
H @ correction == syndrome (mod 2)
```

For a sampled physical error `e`, faithfulness puts `correction + e` in `ker(H)`. Logical success is a separate coset/observable question; raw correction-vector equality is not a valid universal logical metric for a degenerate stabilizer code.

## Structural routing guard

Inspect the actual check-to-qubit structure before selecting a backend:

```text
maximum qubit/check degree <= 2  -> graphlike decoders may be eligible
any degree > 2                    -> non-graphlike; use BP-OSD
```

Hyperedges must not be silently decomposed into pairwise matching edges.

## Decoder families

| Family | Domain | Contract boundary |
|---|---|---|
| `UnionFindDecoder` / `FastUnionFindDecoder` | Graphlike | Cluster growth and faithful spanning-forest peeling |
| `BlossomDecoder` | Graphlike | Exact weighted MWPM on audited small matching codes |
| `SparseBlossomDecoder` | Graphlike | Faithful, near-optimal event-driven path in tested scope |
| `BpOsdDecoder` / `BPOSDDecoder` | Reachable GF(2) matrices | BP reliability plus faithful OSD residual solve |
| `LookupTableDecoder` | Small codes | Exact for stored entries; fallback applies outside entries |
| `HybridCascadeDecoder` | Graphlike | Faithful pre-filter plus checked escalation |
| `AmbiguityClusterDecoder` | qLDPC | Exact within bounded ambiguous components |
| `TwoStageDecoder` | CSS | Faithful when both sector stages are faithful |
| `SpaceTimeDecoder` | Lifted graphlike detector model | Faithful space-time correction |
| `StreamingDecoder` / `SlidingWindowDecoder` | Multi-round workflow | Windowed primitives, not automatic full 3D matching |
| `CUDABatchDecoder` / `OpenCLBatchDecoder` | Graphlike batches | Bit identity on tested configurations for the unweighted path |
| `CUDABpOsdDecoder` | qLDPC batches | Batched BP-OSD path; single-shot CPU path preferred |
| `NativeAutoDecoder` | Eligible inputs | Routes and inherits the selected backend contract |

## Stable and provisional APIs

Stable symbols include the core Union-Find and Blossom decoders, code helpers, license status helpers, shot accounting, and `DecodeResult`. Batch aliases, auto-routing order, streaming tuning, BP-OSD tuning arguments, GPU paths, and network surfaces are supported but workload-sensitive or provisional according to the manual.

## Direct decode example

```python
import numpy as np
from qector_decoder_v3 import BlossomDecoder

checks = [[0, 1], [1, 2], [2, 3], [3, 4]]
syndrome = np.array([0, 1, 0, 0], dtype=np.uint8)
correction = BlossomDecoder(checks, n_qubits=5).decode(syndrome)

# Validate the contract with the same H used to construct the decoder.
```

## DEM workflow

```python
from qector_decoder_v3 import dem

model = dem.from_stim(
    circuit.detector_error_model(decompose_errors=True)
)
if model.is_graphlike:
    model = model.collapse_to_graph()
decoder = model.make_decoder("blossom")
```

Parallel graph mechanisms combine with the independent-XOR probability rule. Mechanism weights use `log((1-p)/p)`. Record the DEM settings, mechanism counts, graphlike status, and observable mapping with any result.

## Validation policy

The live repository suite is authoritative. The manual maps claims to syndrome-faithfulness, property, exhaustive-oracle, cross-decoder, DEM, logical-observable, qLDPC, memory, API, and hardware-gated GPU tests.

A skipped hardware-gated test is not evidence for that hardware path. A historical test count is not a current pass/fail statement.

## Measurement policy

This website publishes no hardware-specific benchmark data, charts, screenshots, latency, throughput, VRAM, or threshold results. Such values depend on code family, distance, rounds, noise model, decoder options, compiler, operating system, hardware, driver, batch shape, seed, and warmup.

For an independent local measurement, store:

```text
code family and size
noise model and DEM settings
shots, trials, warmup, and seed
hot/cold/end-to-end path label
raw JSON/CSV plus SHA-256
Wilson interval for logical-error rates
```

Keep Python allocation, process RSS, native memory, and GPU memory as separate metrics. Score logical observables rather than raw correction equality. Do not compare code-capacity and circuit-level rows.

## Deployment posture

The local Rust/Python CPU library is the preferred research path. CUDA/OpenCL batch paths require controlled runtime setup. REST, gRPC, MCP, and metrics surfaces are provisional and require authentication, authorization, TLS, rate limits, timeouts, audit logging, request limits, and resource quotas before production use.

License verification is offline. The decoder does not make a blocking network call during decoding. Distance caps and GPU feature access are enforced by the Rust core according to the active license tier.

## Canonical citation

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, version 1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
