# Evidence-First QEC Engineering: The v1.0.0 Architecture and Benchmark Contract

Author: Guillaume Lessard / qector.store  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: QEC benchmarking, reproducibility, Rust, PyO3, decoder architecture, evidence

## Abstract

The final stage of a decoder project is not a benchmark chart. It is a claim that another engineer can inspect, reproduce, and scope. QECTOR Decoder v3 v1.0.0 organizes fifteen specialized backend families around one syndrome-faithfulness gate and documents how correctness, logical error rates, performance, memory, GPU identity, licensing, and deployment claims must be separated. This post maps the architecture and presents the benchmark metadata contract from the reference manual. It intentionally does not repeat withdrawn hardware figures.

## 1. One invariant, many backends

For a reachable syndrome `s`, every supported decoder returns a correction `c` satisfying

$$
Hc = s \pmod 2.
$$

If `e` is the sampled physical error, then `c + e` lies in `ker(H)`. Logical success requires the stronger condition

$$
c + e \in \operatorname{im}(H^T).
$$

That split is the organizing principle of the v1.0.0 architecture. A decoder can be syndrome-faithful but choose the wrong logical coset. A GPU result can be logically equivalent but not bit-identical to a CPU result. A fast local run can be correct but not evidence for a universal throughput claim.

## 2. Decoder families and domains

The manual's contract table can be summarized as follows:

| Family | Domain | Documented contract |
|---|---|---|
| Union-Find / Fast Union-Find | Graphlike | Faithful cluster growth and peeling |
| Blossom | Graphlike | Exact weighted MWPM on audited small matching codes |
| Sparse Blossom | Graphlike | Faithful, near-optimal region growth in tested scope |
| BP-OSD | Any reachable GF(2) matrix | Faithful LDPC/qLDPC residual solve |
| Lookup table | Small codes | Exact for stored entries, with fallback |
| Hybrid cascade | Graphlike plus escalation | Faithful acceptance predicate and fallback |
| Ambiguity clustering | qLDPC | Exact within small ambiguous components |
| Two-stage CSS | CSS sectors | Faithful under faithful sector stages |
| Space-time | Graphlike lifted detector graph | Faithful space-time correction |
| Streaming/windowed | Multi-round workflows | Windowed simulation primitives, not hardware control |
| CUDA/OpenCL batch | Graphlike batches | Bit identity on tested configurations for the unweighted path |
| CUDA BP-OSD batch | qLDPC batches | Batched path with single-shot CPU preference |
| Native auto routing | Any eligible domain | Routes to a target backend and inherits its contract |

The table deliberately contains claim boundaries. It is not a ranking.

## 3. Architecture layers

The frozen workspace has a Rust core, a Python layer, and a PyO3 boundary.

### Rust core

The module map groups responsibilities into matching, Union-Find, BP-OSD, GPU, temporal, routing, learned, service, and utility areas. Internal module details are proprietary, so public documentation should describe their contracts and evidence anchors rather than inventing source-level implementation facts.

### Python and PyO3

Arrays cross the FFI boundary as contiguous `uint8` NumPy buffers. Repacking occurs only when an input is non-contiguous or has the wrong dtype. Decode calls release the Python GIL, allowing compiled work to run alongside other Python threads.

### Batch and memory model

Batch paths use Rayon data parallelism with worker-local scratch. The observable goal is bit determinism: output should not depend on worker count or prior calls. Hot paths reuse preallocated buffers and reset them in place. Python allocations, process RSS, native heap, and GPU memory are separate metrics and must never be merged into one number.

## 4. What a logical-error report must contain

The manual defines logical error rate in observable space: the predicted observable flips are compared with the sampled observable flips from the same circuit. A raw correction mismatch is not a logical error because stabilizer degeneracy can change the bit string without changing the logical state.

Every report should carry:

| Field | Required detail |
|---|---|
| Code family | Repetition, ring, surface, toric, heavy-hex, LDPC/qLDPC, or DEM-derived |
| Size | Distance, rounds, checks, qubits, detectors, and code parameters |
| Noise | Physical rate, channel/circuit source, code-capacity or circuit-level tag |
| Decoder | Class, weights, belief mode, batch/GPU flags, and configuration |
| Sampling | Trials, shots, warmup, and seed |
| Metric | Correctness, LER, latency, throughput, memory, identity, or scaling |
| Environment | OS, CPU, RAM, Python/Rust/package versions, GPU/runtime, commit |
| Artifact | Raw JSON/CSV path and SHA-256 |

## 5. Wilson intervals and comparability

For `k` logical errors in `n` shots, QECTOR reports a 95 percent Wilson interval rather than the simple Wald interval:

$$
\frac{\hat p + z^2/(2n) \pm z\sqrt{\hat p(1-\hat p)/n + z^2/(4n^2)}}{1+z^2/n},
$$

with `z = 1.959963985`. The interval stays within `[0,1]` and behaves better for small counts and extreme rates.

Noise models must also be comparable. A code-capacity LER at a nominal `p` cannot be compared directly with a circuit-level LER at the same `p`. A competitive harness should hold the circuit, detector samples, DEM, observable scoring, and sampling protocol constant so the decoder is the only changed row.

## 6. Hot path and cold path

Decoder construction is the cold path: graph building, weight preprocessing, and allocation. Repeated `decode()` on an already-built decoder with syndromes in memory is the hot path. Reporting only hot-path latency is valid only for a clearly labeled pre-built repeated-decode workload.

A latency report should include `n`, mean, median, standard deviation, minimum, maximum, p50, p90, p95, p99, and a 95 percent confidence interval on the mean. A single mean is not a complete public claim.

## 7. Evidence anchors

The manual maps claims to concrete evidence classes:

- syndrome faithfulness and cross-decoder tests;
- property-based GF(2) and reachable-syndrome tests;
- exhaustive small-code oracles for exact matching;
- batch equivalence and GPU/CPU identity tests;
- DEM parsing, collapse, weight, and observable tests;
- LER noise-model parity tests;
- qLDPC CSS and BP-OSD tests;
- memory and native RSS tests;
- public API and signature tests.

The frozen tree records an older test-count report as stale. No current pass/fail count should be copied from that historical table; the live suite and its artifacts are authoritative.

## 8. Release and deployment posture

The public delivery path is wheels only. No source distribution is published because the proprietary Rust core is not tracked as rebuildable source. Release gates include Rust tests, Clippy with warnings denied, Python lint/format checks, the Python test suite, wheel import/decode smoke tests, and dependency audit policy.

The local CPU library is the preferred research path. CUDA/OpenCL are controlled local paths. REST, gRPC, MCP, and metrics surfaces are provisional and require authentication, authorization, TLS, rate limits, timeouts, audit logging, request limits, and resource quotas before a customer-facing deployment. The decoder does not make a blocking network call during local decoding; license verification is offline.

## 9. A reproducible benchmark skeleton

The manual's reproduction path has this shape:

```text
create a virtual environment
install the wheel/build tooling and declared dependencies
build/import the chosen feature set
run the focused correctness tests
run the workload with a fixed seed and explicit shots
write raw JSON/CSV plus environment metadata
hash the artifacts
publish only the scoped result
```

The important output is not a pretty chart. It is the relationship between a sentence, a command, an artifact, and an evidence anchor.

## 10. What v1.0.0 does not claim

The reference manual deliberately excludes universal latency, throughput, memory, VRAM, and threshold numbers. Earlier benchmark artifacts were withdrawn when they did not survive a core fingerprint change. The safe alternative is to regenerate measurements on the target workload and publish the complete metadata.

That is not a weaker engineering position. It lets a hardware team reproduce a claim on its own system, lets a researcher distinguish mathematical scope from empirical scope, and prevents an old chart from becoming a misleading product promise.

## Takeaway

QEC engineering becomes credible when correctness, logical scoring, performance, memory, identity, licensing, and deployment are treated as separate evidence classes. QECTOR's v1.0.0 architecture provides the common syndrome-faithfulness contract and the evidence map; the benchmark harness supplies the numbers for a declared workload. The DOI is the reference point, and the artifact is the proof.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
