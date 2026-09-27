# Shipping a QEC Decoder Responsibly: API Stability, Wheels, and Deployment Gates

Author: Guillaume Lessard / qector.store  
Series: QECTOR Decoder v3 companion notes, Post 19  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)
Tags: release engineering, API stability, licensing, deployment security, QEC software

## Abstract

Research code becomes infrastructure when other people install it, automate it, and place it near sensitive circuits or hardware. The QECTOR v1.0.0 manual treats release engineering, licensing, API stability, and service hardening as part of the technical contract. This post summarizes those boundaries so an evaluator can tell a stable Python symbol from a provisional service surface, and a local research library from a network deployment.

## 1. API stability has layers

The manual separates public surfaces into stable, provisional, and internal detail.

Stable symbols for the whole 1.x line include:

```text
UnionFindDecoder, BlossomDecoder, SparseBlossomDecoder
NativeAutoDecoder
the four generate_*_code_checks helpers
set_license_key, get_license_info
the Sinter and qiskit-qec entry points
DecodeResult
```

Provisional or workload-sensitive surfaces include batch aliases, AutoDecoder ordering, streaming constructors, BP-OSD tuning kwargs, GPU batch constructors, and network surfaces. A provisional symbol is supported and tested, but its exact shape may change in a 1.x release with a changelog note.

The distinction lets downstream teams plan upgrades without treating every experimental option as frozen.

## 2. Wheels only

The 1.0.0 release (published 2026-08-06) ships deterministic binary wheels on PyPI and no source distribution: 15 wheels covering CPython 3.9 through 3.13 on Windows (win_amd64), Linux (manylinux x86_64), and macOS (arm64), with `requires-python >= 3.9` and a PolyForm-Noncommercial-1.0.0 license. The proprietary Rust core is delivered into the build pipeline through a chunked, hash-anchored packaging mechanism, and the manifest is checked before building so stale or corrupted input fails explicitly.

The user-facing implication is simple:

```text
pip install -> resolve a supported wheel
wheel smoke -> import, decode, assert H @ c == s
```

Read the platform and feature flags from the release notes of the installed version. No CUDA wheel is published for 1.0.0: do not assume a GPU is present, and do not assume an OpenCL wheel exists when the manual says OpenCL requires a source build.

## 3. License tiers are enforced locally

The v1.0.0 manual documents these distance caps:

| Tier | Maximum distance | GPU batch |
|---|---:|---|
| Community | 7 | No |
| Pro | 19 | No |
| Enterprise | 63 | Yes |

Tokens are verified offline in the Rust core using Ed25519, with expiry and an offline revocation list. Decoding never makes a blocking network call.

Key resolution order:

```text
QECTOR_LICENSE_KEY
QECTOR_LICENSE_FILE
~/.qector/license.key
```

An explicitly set but unreadable license-file path is invalid, not a silent downgrade. `QECTOR_ENFORCE=1` turns tier violations into hard errors; the default mode logs a warning. `QECTOR_SILENT=1` quiets the licensing output.

Hardware availability and licensing are separate facts. A device probe can report a GPU even when the requested tier is not active.

## 4. Pre-flight gates

The documented release gates include:

1. Rust tests with default and no-default features.
2. Clippy with warnings denied.
3. Python lint and format checks.
4. The Python validation suite.
5. Wheel import/decode smoke testing.
6. Dependency audit according to release policy.

The wheel smoke test matters most for a proprietary core: it validates the artifact users install, not just the source tree that built it.

## 5. Local library versus service

| Mode | Status | Guidance |
|---|---|---|
| Local CPU library | Supported public path | Preferred for research and evaluation |
| CUDA/OpenCL batch | Optional local path | Controlled driver/runtime setup |
| Docker REST | Demo/local service | Do not expose directly to the public internet |
| gRPC/MCP/metrics | Feature-gated | Deployment review required |
| SaaS/hosted API | Contact-only beta | Separate commercial agreement and hardening |
| OEM/embedded | Contact-only partner path | Validate hardware and support scope |

Transport wrappers reuse the same decoder contracts, but transport security is not inherited from the local library.

## 6. Service hardening checklist

Before a network-accessible deployment:

```text
pin the release and Cargo.lock
generate dependency inventories
disable unused optional services and GPU features
run import and local correctness smoke tests
place the service behind TLS and a reverse proxy
authenticate and authorize clients
enforce request size, rate, timeout, and resource limits
redact customer inputs and proprietary circuits from logs
document owner, rollback, update, and incident paths
```

The manual notes built-in request and frame caps on some surfaces, but treats them as necessary rather than sufficient hardening.

## 7. Commercial boundaries

Network use, hosted APIs, OEM integration, internal commercial use, product integration, paid consulting, and commercial benchmarking require the written commercial scope described by the project. A public post can explain the boundary without embedding tokens, private keys, customer circuits, or internal fulfillment details.

## 8. Version promotion

A provisional symbol becomes stable only after a dated promotion entry, the same property, regression, and example test bar, an update to the stable API document, and a changelog note. The process generalizes: it turns "we have used this for a while" into an auditable compatibility decision.

## Takeaway

Shipping a decoder responsibly means shipping the artifact, its compatibility promise, its license boundary, and its deployment assumptions. Wheels, tests, offline token verification, service hardening, and promotion rules are not administrative extras; they are what make a research decoder safe to integrate.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
