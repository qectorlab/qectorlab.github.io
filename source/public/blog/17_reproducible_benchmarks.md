# Reproducible QEC Benchmarks: The Artifact Is Part of the Result

Author: Guillaume Lessard / qector.store  
Series: QECTOR Decoder v3 companion notes, Post 17  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: reproducible research, QEC benchmarks, artifacts, latency, logical error rate

## Abstract

Quantum-decoder benchmarks combine a mathematical problem, a stochastic workload, compiled code, and hardware. A number without that context is not portable evidence. The QECTOR v1.0.0 manual defines the metadata, statistical, memory, and claim rules needed to turn a local run into a reviewable artifact. This post turns those rules into a practical checklist for research teams, systems engineers, and product reviews.

## 1. Start with a scoped sentence

Write the claim before writing the benchmark script. A safe claim looks like:

> On this checked-in artifact, for this code, noise model, seed, batch shape, and environment, decoder A produced this measured result.

An unsafe claim looks like:

> Decoder A is universally faster or always more accurate.

The manual excludes the second style. It also warns that previous benchmark artifacts were withdrawn after a core fingerprint change.

## 2. Separate correctness from performance

Every run should answer the correctness question before the timing question:

```text
Did every reachable syndrome produce H @ c == s?
Did the batch path equal the per-shot path where that is claimed?
Were observables scored rather than raw correction vectors?
```

Only after those gates pass should the run report latency, throughput, memory, or logical-error statistics.

## 3. Cold path and hot path

Decoder construction includes graph creation, weight preprocessing, allocations, and setup. That is the cold path. Repeated `decode()` with a pre-built decoder and in-memory syndromes is the hot path.

Both can be useful, but they answer different operational questions:

| Measurement | Includes | Appropriate for |
|---|---|---|
| Cold path | Build and setup | Per-job startup or service provisioning |
| Hot path | Repeated decode only | Steady-state repeated workloads |
| End to end | Input, transfers, decode, output | Application-level capacity |

Never present a hot-path number as end-to-end performance without labeling the omitted work.

## 4. Required benchmark metadata

The manual's artifact table requires:

```text
code family and distance/size
rounds, checks, qubits, detectors
physical error rate and noise source
code-capacity or circuit-level tag
decoder class and all mode flags
shots, trials, warmup, and seed
metric definition
OS, CPU, RAM, Python, Rust, package, GPU, runtime
git commit or release tag
raw JSON/CSV path and SHA-256
```

If a number depends on a GPU or driver, include the exact device and runtime. If memory is measured, identify whether it is Python allocation, process RSS, native heap, or VRAM.

## 5. Statistical reporting

For latency, report the distribution: `n`, mean, median, standard deviation, minimum, maximum, p50, p90, p95, p99, and a confidence interval on the mean.

For logical error rates, report errors, shots, the LER, and a Wilson interval. If the result has zero observed errors, do not turn that observation into a claim of zero logical-error probability; report the interval and sampling context.

For decoder comparisons, use the same sampled detector data, DEM settings, observable map, and noise model. A different random sample can be useful for an independent replication, but it is not a paired head-to-head comparison unless the pairing protocol is stated.

## 6. Reproducible command design

A good command is explicit about every hidden degree of freedom:

```text
benchmark --code rotated_surface --distance 5
          --noise circuit_level --p 0.001
          --decoder blossom --weighted
          --shots 100000 --seed 42
          --out results/run.json
```

The actual command should be stored beside the output. The environment block and the commit hash make it possible to distinguish a changed workload from a changed implementation.

## 7. Benchmark images need a disposition

The manual includes structural figures and excludes charts tied to withdrawn or non-surviving hardware measurements. A useful chart can still be generated locally, but its status should be clear:

```text
structural illustration
local smoke measurement
checked-in evidence artifact
published comparative result
```

Only the last two should support public numerical claims, and only with the accompanying artifact.

## 8. A release-review checklist

Before quoting a result:

1. Pin the release or commit.
2. Capture dependency versions and hardware.
3. Run the local correctness and import smoke tests.
4. Label hot/cold/end-to-end timing.
5. Store raw JSON/CSV and hash it.
6. Attach a Wilson interval for LER.
7. State safe and unsafe wording.
8. Remove customer data, proprietary circuits, and secrets from logs.

The last item matters for service deployments: a benchmark artifact can accidentally disclose inputs that were never meant to be public.

## Takeaway

Reproducibility is not a citation added after the graph. It is the relationship between the claim, command, environment, raw artifact, and hash. That discipline makes a local QEC result useful to another lab and keeps product language honest.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
