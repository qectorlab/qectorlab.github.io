# Rust, PyO3, and QEC Memory Discipline at the FFI Boundary

Author: Guillaume Lessard / qector.store  
Series: QECTOR Decoder v3 companion notes, Post 18  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)
Tags: Rust, PyO3, Python, FFI, Rayon, memory model, QEC systems

## Abstract

Quantum-error-correction software sits between numerical Python workflows and stateful, performance-sensitive decoder cores. QECTOR's v1.0.0 architecture uses Rust with PyO3 bindings, contiguous NumPy buffers, GIL release, Rayon batch workers, and reusable scratch state. This post explains the boundary as an engineering contract, shows what can be measured safely, and names the memory and threading properties that should be tested rather than assumed.

## 1. The boundary has a shape

The public decoder contract is simple:

```text
input:  check structure + reachable uint8 syndrome
output: uint8 correction with length n_qubits
gate:   H @ correction == syndrome modulo 2
```

The FFI layer must preserve shape, dtype, contiguity, and ownership long enough for the Rust core to consume the data safely. A mathematically correct decoder can still fail at integration time if Python sends a transposed batch, a non-contiguous view, or a dtype the binding reads differently.

## 2. Contiguous buffers and selective repacking

The manual documents contiguous `uint8` NumPy buffers across PyO3. The boundary repacks only when an input is non-contiguous or has the wrong dtype; it does not copy gratuitously.

That policy creates two test cases:

```text
contiguous uint8 input -> direct boundary path
non-contiguous/wrong dtype input -> explicit normalization path
```

Both paths must return the same correction and the same faithfulness result. The copy belongs to the cold or boundary path, never to the decoder's hot path.

## 3. Releasing the GIL

Decode calls release the Python GIL so compiled work can run alongside other Python threads. This suits independent batches or service workers, but it does not make every Rust data structure safe to share mutably. The documented design uses worker-local scratch and explicit ownership boundaries.

The right concurrency test is not "many threads ran." It is:

```text
same input + different worker count -> same output
batch decode == per-shot decode
prior calls do not change later output
```

Those properties are observable and can be locked with tests.

## 4. Rayon and batch determinism

Batch paths use Rayon data parallelism. Each worker keeps its own scratch so the output does not depend on row-to-worker assignment. That matters for Union-Find style paths, where several valid forests could otherwise yield different correction vectors.

Determinism is a contract only when the implementation and the tests establish it. A parallel loop is not automatically deterministic.

## 5. Reusable memory

The hot paths allocate buffers sized to the graph, reset them in place, and grow only when the problem grows. The manual describes this as allocation-free hot-path construction for the relevant backends.

Report memory in separate categories:

| Category | Appropriate tool or evidence |
|---|---|
| Python allocations | `tracemalloc` |
| Process RSS | `psutil`, when installed |
| Native Rust heap | Backend diagnostics |
| GPU memory | Vendor/runtime diagnostics |

Do not merge these numbers into one "memory usage" figure. They measure different allocators and lifetimes.

## 6. The module map

The reference manual groups the core into:

```text
matching       exact and sparse MWPM
union-find     graphlike single and batch paths
BP-OSD         belief propagation, GF(2), ambiguity components
GPU            CUDA/OpenCL batch kernels
temporal       space-time and streaming primitives
routing        auto, cascade, two-stage
learned        GNN and neural predecoders
services       MCP, gRPC, metrics, licensing
utilities      bit packing, GF(2), shared infrastructure
```

The public architecture explains responsibilities without exposing proprietary internals. That is the right level for an integration guide.

## 7. A safe FFI smoke test

The manual's build-and-import path ends with a small import smoke. A decode smoke adds a direct parity check:

```python
import numpy as np
from qector_decoder_v3 import UnionFindDecoder

checks = [[0, 1], [1, 2], [2, 3], [3, 4]]
syndrome = np.array([0, 1, 0, 0], dtype=np.uint8)
decoder = UnionFindDecoder(checks, n_qubits=5)
correction = decoder.decode(syndrome)

assert correction.dtype == np.uint8
assert correction.shape == (5,)
```

Then verify `H @ correction == syndrome` with the package's structured result and validation helpers. The invariant should stay visible in tests, even when production code uses the richer helpers.

## 8. Packaging consequences

The release path publishes deterministic binary wheels only; no source distribution is shipped. A wheel smoke test therefore matters: install the built wheel, import it, decode a known reachable syndrome, and assert the parity equation.

The v1.0.0 wheels are CPU-only. No published wheel ships a CUDA binary. CUDA and OpenCL are build feature-gates: OpenCL is a documented source-build path, and CUDA support is compiled in through its own build configuration. Whether a GPU path is actually usable is a runtime question, probed with a runtime check such as `cuda_is_available()`. Packaging, feature flags, driver, and device presence all belong in the environment block of any benchmark.

## Takeaway

The FFI boundary is part of the decoder. Contiguous buffers, selective copying, GIL release, worker-local scratch, deterministic batches, and separate memory metrics are testable contracts. Treat them as architecture, not incidental optimization, and the Python-facing system becomes much easier to audit.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
