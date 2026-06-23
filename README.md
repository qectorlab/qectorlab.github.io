# QECTOR Lab

Official GitHub Pages repository for **QECTOR**.

QECTOR is a source-available quantum error correction decoder platform for reproducible benchmarking, research, and commercial QEC workflow evaluation.

**Official website:** https://www.qector.store  
**Official contact:** admin@qector.store  
**Commercial licensing:** admin@qector.store

---

## About QECTOR

QECTOR is a quantum error correction software ecosystem focused on reproducible decoder validation.

The QECTOR ecosystem includes:

- **QECTOR Decoder** — the available Rust/Python decoder library
- **QECTOR Workbench** — the upcoming fullstack benchmarking and validation app
- **QECTOR Benchmark Suite** — reproducible reports, artifacts, hashes, and comparison tools

QECTOR is source-available for personal, academic, educational, and non-commercial research use.

Commercial use requires a paid commercial license.

---

## QECTOR Decoder

**QECTOR Decoder v3** is the core library.

It provides a quantum error correction decoder stack with:

- Rust core with Python bindings via PyO3
- Stim Detector Error Model support
- Sinter integration
- PyMatching-compatible workflows
- Weighted MWPM / Blossom workflows on validated workloads
- Belief-matching accuracy mode
- BP-OSD / LDPC / qLDPC support
- Union-Find and Fast Union-Find decoders
- CPU batch decoding
- CUDA batch decoding
- OpenCL batch decoding
- Reproducible benchmark artifacts
- Artifact SHA-256 hashes
- Hot-path and cold-path timing
- p50 / p90 / p95 / p99 latency reporting
- Native memory profiling
- Benchmark reproduction scripts
- Commercial licensing support

---

## Validated Scope

QECTOR Decoder v3 is designed to make benchmark evidence reproducible and inspectable.

Current validated claims should be read within the tested scope:

- QECTOR weighted MWPM matches PyMatching logical-error-rate performance on tested circuit-level workloads through the documented benchmark range.
- QECTOR belief-matching shows lower observed logical error rate than PyMatching on selected correlated rotated-surface circuit-level workloads.
- QECTOR BP-OSD is competitive with the `ldpc` package on tested LDPC / qLDPC workloads.
- CUDA and OpenCL batch decoding paths are tested for CPU/GPU bit-identical behavior within the covered benchmark suite.
- Benchmark artifacts include reproducibility metadata, hashes, and report evidence.

QECTOR should not be described as a universal PyMatching replacement or as the fastest available decoder. PyMatching remains the latency leader for exact MWPM on larger tested circuit-level workloads. QECTOR's current strengths are reproducible evidence packaging, decoder experimentation, belief-matching workflows, BP-OSD / LDPC support, GPU batch decoding, and commercial QEC workflow integration.

---

## Public Status

| Component | Status |
|---|---|
| QECTOR Decoder v3 | Available / source-available |
| Test suite | 832 collected / 829 passed / 2 skipped / 1 xfailed |
| QECTOR Workbench | Coming soon |
| Commercial licensing | Available |
| Official website | https://www.qector.store |
| Official contact | admin@qector.store |

---

## QECTOR Workbench

**QECTOR Workbench** is the upcoming fullstack app for QEC benchmarking, validation, and report generation.

Planned features include:

- Load Stim circuits
- Load Detector Error Models
- Run QECTOR vs PyMatching comparisons
- Run belief-matching accuracy benchmarks
- Run BP-OSD / LDPC experiments
- Generate PDF benchmark reports
- Export CSV artifacts
- Export JSON artifacts
- Capture environment versions
- Capture dependency versions
- Verify SHA-256 artifact hashes
- Run CPU backend diagnostics
- Run CUDA backend diagnostics
- Run OpenCL backend diagnostics
- Visualize logical error rate
- Visualize latency
- Visualize threshold curves
- Visualize memory usage
- Visualize scaling behavior

---

## Official Website

Visit the official QECTOR product and licensing portal:

https://www.qector.store

This GitHub Pages repository powers the public website and custom domain.

```text
qectorlab.github.io -> https://www.qector.store
```

---

## License

QECTOR is **source-available, not open-source**.

Permitted free use includes:

- Personal learning
- Academic evaluation
- Educational use
- Non-commercial research
- Private experimentation
- Benchmark reproduction
- Source-code review

Commercial use requires a paid commercial license.

Commercial use includes, but is not limited to:

- Company use
- Startup use
- Commercial R&D
- Government use
- Institutional use
- Paid consulting
- SaaS use
- Hosted API use
- OEM embedding
- Product integration
- Redistribution
- Internal business operations
- Commercial benchmarking
- Revenue-generating use
- Fundraising or investor validation

For commercial licensing, contact:

**admin@qector.store**

---

## Commercial Licensing

QECTOR commercial licenses are available for:

- Startup commercial evaluation
- Professional / lab use
- Enterprise deployment
- SaaS / hosted API use
- OEM / embedded integration
- Strategic licensing
- Partnership discussions
- Acquisition discussions

Official licensing portal:

https://www.qector.store

Contact:

**admin@qector.store**

---

## Repository Topics

Recommended GitHub topics:

```text
quantum-computing
quantum-error-correction
qec
decoder
stim
sinter
pymatching
mwpm
belief-matching
bp-osd
ldpc
rust
python
cuda
opencl
benchmarking
reproducibility
source-available
commercial-license
```

---

## SEO Keywords

QECTOR, QECTOR Decoder, QECTOR Workbench, quantum error correction decoder, QEC decoder, Rust quantum decoder, Python quantum decoder, Stim decoder, Sinter decoder, PyMatching-compatible decoder, belief-matching decoder, BP-OSD decoder, LDPC quantum decoder, qLDPC decoder, MWPM decoder, GPU quantum decoder, CUDA quantum decoder, OpenCL quantum decoder, quantum benchmarking, quantum error correction benchmarking, commercial QEC software, source-available QEC decoder.

---

## Contact

**Official website:** https://www.qector.store  
**Official contact:** admin@qector.store  
**Commercial licensing:** admin@qector.store

---

## Copyright

Copyright © 2026 Guillaume Lessard / iD01t Productions.  
All rights reserved.

QECTOR, QECTOR Decoder, and QECTOR Workbench are proprietary/source-available software assets. Commercial use requires a paid commercial license.
