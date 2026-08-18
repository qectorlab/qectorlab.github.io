# GPU Batch Decoding: Deterministic State Isolation Before Throughput

Author: Guillaume Lessard / qector.store  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: CUDA, OpenCL, batch decoding, GPU determinism, Rust, QEC validation

## Abstract

The interesting GPU question in a decoder is not only how many shots can be launched. It is whether parallel execution preserves the reference result and its correctness contract. QECTOR's CUDA and OpenCL batch paths port the graphlike Union-Find core with isolated per-shot scratch state. This post explains the memory layout, deterministic tie-breaking, the scoped CPU/GPU bit-identity theorem, licensing and runtime gates, and the hardware limitations that must travel with any deployment claim.

## 1. Why batch state must be isolated

For a batch of independent syndromes, each shot can run its own cluster growth and peeling process. A GPU work-item receives one syndrome and owns a private slice of scratch memory. No work-item reads another shot's parent array, parity state, frontier, or correction buffer.

That design avoids two problems at once:

- data races that could invalidate the correction;
- nondeterministic union order that could produce a different, even if still faithful, correction on each run.

Bit identity is stronger than logical equivalence. It is useful when a GPU result must be compared against a CPU reference, debugged, or audited.

## 2. The documented workspace formula

Let

```text
N = n_checks + 1   # includes the virtual boundary node
E = n_edges
```

The manual documents two per-thread scratch strides for the graphlike batch kernel:

```text
u32 stride = 6N + 1 + 4E
u8  stride = 5N + E
```

The exact buffers are an implementation contract, not a universal VRAM budget. A batch of `B` shots needs those per-shot regions plus syndrome, correction, and any weighted-support buffers. The workspace sizes are checked before launch and can trigger a fallback when resources are insufficient.

## 3. Deterministic Union-Find rules

The CPU reference and unweighted batch kernels use deterministic decisions:

1. Union-by-rank handles the normal disjoint-set merge.
2. A deterministic root tie-break, such as the minimum root identifier, resolves equal-rank merges.
3. Edge traversal follows global edge identifiers.
4. Peeling uses a deterministic vertex ordering for its leaf stack.

These choices matter because Union-Find does not need one unique spanning forest for syndrome faithfulness. Different forests can produce different valid corrections. If the engineering goal is bit identity, the forest construction itself must be deterministic.

## 4. The bit-identity theorem

For a graphlike code and a tested configuration, let `c_CPU(s)` be the unweighted CPU Union-Find correction and `c_GPU(s)` the unweighted batch-kernel correction.

### Theorem, scoped

The tested unweighted GPU path produces

$$
c_{GPU}(s) = c_{CPU}(s)
$$

bit for bit.

### Proof idea

The initial singleton clusters are identical. Deterministic rank and root rules make every merge identical. Ordered edge traversal makes each growth set identical. The resulting spanning forest is therefore identical, and ordered leaf-to-root peeling emits the same correction bits. Induction over growth rounds completes the equivalence.

The scope is essential: the manual anchors the theorem to tested graphlike configurations and the CPU/GPU identity tests. It is not a universal statement about every GPU, driver, weighted mode, code family, or future kernel.

## 5. Weighted paths are a separate claim

The batch kernels accept DEM edge weights for weighted growth. The unweighted path has the strongest bit-identity statement. The weighted path mirrors CPU weighted growth and is validated for equivalence on tested configurations, but should not be silently described as the same bit-identity theorem without the configuration and test evidence.

The same distinction applies to `CUDABpOsdDecoder`. It is a batched qLDPC path; the manual recommends the CPU single-shot path where a one-shot GPU launch would not amortize.

## 6. Hardware and licensing gates

`is_available()` answers whether the local runtime can see the relevant hardware. It does not answer whether the caller is licensed to construct the decoder. The v1.0.0 tier table documents GPU-enabled paths under the Enterprise tier, while distance caps are enforced in the Rust core.

Published wheels are CUDA-enabled but can install and run without a GPU; CUDA availability is checked at runtime. OpenCL remains a documented source-build path. These packaging facts are important when a result is reproduced on another machine.

The manual also records a known GPU-context limitation: the native CUDA path and CuPy can use different CUDA contexts, and an intermittent access violation was observed under load on one tested configuration. The documented workaround is to run those workloads in separate processes or hide the device for a monolithic suite.

## 7. How to validate a GPU batch path

A minimal validation record should include:

```text
code family and graphlike proof
checks, qubits, detectors, and edges
weighted or unweighted mode
batch shape and syndrome dtype
CPU reference class and GPU class
GPU model, driver, runtime, OS, and package versions
license tier and feature flags
seed and generated syndromes
H @ c == s result for every shot
CPU/GPU byte comparison result
raw output and SHA-256 hash
```

The reproduction workflow in the manual enables the CUDA feature, runs the focused CPU/GPU identity test, and treats a skipped hardware-gated test as no GPU evidence.

## 8. What not to publish from a local run

A local throughput number is not portable evidence. It depends on kernel version, compiler flags, GPU, driver, transfer path, batch size, warmup, and whether construction and memory movement were included. If a number is needed, publish the raw artifact with the full metadata and report hot and cold paths separately.

The v1.0.0 manual deliberately withdraws earlier latency, throughput, memory, and VRAM figures whose artifacts did not survive a core fingerprint change. A blog post should preserve that caution rather than resurrecting the number in a new chart.

## Takeaway

GPU decoding starts with ownership and determinism. Private per-shot state, deterministic Union-Find rules, and a CPU reference make bit identity testable. The claim then remains properly scoped: unweighted graphlike identity on tested configurations, weighted equivalence where tested, and no universal speed promise. That is a stronger engineering story than a headline rate without an artifact.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
