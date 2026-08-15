# Rust, PyO3, and QEC Memory Discipline at the FFI Boundary

Author: Guillaume Lessard / qector.store  
Series: QECTOR Decoder v3 companion notes, Post 18  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: Rust, PyO3, Python, FFI, Rayon, memory model, QEC systems

## Abstract

Quantum-error-correction software sits between numerical Python workflows and stateful, performance-sensitive decoder cores. QECTOR's v1.0.0 architecture uses Rust with PyO3 bindings, contiguous NumPy buffers, GIL release, Rayon batch workers, and reusable scratch state. This post explains the boundary as an engineering contract, shows what can be measured safely, and identifies the memory and threading properties that should be tested rather than assumed.

## 1. The boundary has a shape

The public decoder contract is simple:

```text
input:  check structure + reachable uint8 syndrome
output: uint8 correction with length n_qubits
gate:   H @ correction == syndrome modulo 2
```

The FFI layer must preserve shape, dtype, contiguity, and ownership long enough for the Rust core to consume the data safely. A mathematically correct decoder can still be integrated incorrectly if Python sends a transposed batch, a non-contiguous view, or a dtype the binding interprets differently.

## 2. Contiguous buffers and selective repacking

The manual documents contiguous `uint8` NumPy buffers across PyO3. The boundary repacks only when an input is non-contiguous or has the wrong dtype; it does not align or copy gratuitously.

That policy creates two useful test cases:

```text
contiguous uint8 input -> direct boundary path
non-contiguous/wrong dtype input -> explicit normalization path
```

Both paths must return the same correction and faithfulness result. The copy itself belongs to the cold or boundary path and should not be confused with the decoder's hot path.

## 3. Releasing the GIL

Decode calls release the Python GIL so compiled work can run concurrently with other Python threads. This is useful for independent batches or service workers, but it does not mean every Rust data structure is safe to share mutably. The documented design uses worker-local scratch and explicit ownership boundaries.

The right concurrency test is not merely "many threads ran." It is:

```text
same input + different worker count -> same output
batch decode == per-shot decode
prior calls do not change later output
```

Those properties are observable and can be locked with tests.

## 4. Rayon and batch determinism

Batch paths use Rayon data parallelism. Each worker keeps its own scratch so output does not depend on row-to-worker assignment. This is especially important for graphlike Union-Find and GPU comparison, where multiple valid spanning forests could otherwise produce different correction vectors.

Determinism is a contract only when the implementation and tests establish it. A general parallel loop is not automatically deterministic.

## 5. Reusable memory

The hot paths allocate buffers to the graph size, reset them in place, and grow only when the problem grows. The manual describes this as allocation-free hot-path construction for the relevant backends.

Memory should be reported in separate categories:

| Category | Appropriate tool or evidence |
|---|---|
| Python allocations | `tracemalloc` |
| Process RSS | `psutil`, when installed |
| Native Rust heap | Backend diagnostics |
| GPU memory | Vendor/runtime diagnostics |

Do not add these numbers into one "memory usage" figure. They measure different allocators and lifetimes.

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

The public architecture explains responsibilities without claiming access to proprietary internals. That is the right level for an integration guide.

## 7. A safe FFI smoke test

The manual's build-and-import path ends with a small import smoke. A decode smoke should add a direct parity check:

```python
import numpy as np
from qector_decoder_v3 import UnionFindDecoder

checks = [[0, 1], [1, 2], [2, 3], [3, 4]]
syndrome = np.array([0, 1, 0, 0], dtype=np.uint8)
decoder = UnionFindDecoder(checks, n_qubits=5)
correction = decoder.decode(syndrome)

assert correction.dtype == np.uint8
assert correction.shape == (5,)
assert np.array_equal(
    np.array([sum(row[i] for i in range(5) if i in check) % 2 for check in checks], dtype=np.uint8),
    syndrome,
)
```

The example's matrix multiplication is intentionally explicit. Production code can use the package's structured result and validation helpers, but the invariant should remain visible in tests.

## 8. Packaging consequences

The release path publishes deterministic binary wheels only. No source distribution is published because the proprietary Rust core is not tracked as rebuildable source. A wheel smoke test therefore matters: install the built wheel, import it, decode a known reachable syndrome, and assert the parity equation.

OpenCL is a documented source-build path while CUDA support can ship in a wheel and load at runtime only when a device is available. Packaging, feature flags, and hardware availability belong in the environment block of any benchmark.

## Takeaway

The FFI boundary is part of the decoder. Contiguous buffers, selective copying, GIL release, worker-local scratch, deterministic batches, and separate memory metrics are all testable contracts. Treat them as architecture, not incidental optimization, and the Python-facing system becomes much easier to audit.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
