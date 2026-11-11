# Integrating QECTOR With Stim, Sinter, PyMatching, and Qiskit

Author: Guillaume Lessard / qector.store  
Series: QECTOR Decoder v3 companion notes, Post 20  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)
Tags: Stim, Sinter, PyMatching, Qiskit, quantum software integration, QEC APIs

## Abstract

Decoder research is most useful when it fits the surrounding ecosystem. QECTOR v1.0.0 documents a PyMatching-compatible shim, Sinter decoder entry points, a Qiskit plugin, a DEM parser, and provisional service surfaces. This post describes the integration boundaries and shows how to keep the shared syndrome, observable, and noise-model contracts intact when swapping a decoder into an existing workflow.

## 1. The common pipeline

Most ecosystem integrations follow one shape:

```text
circuit -> detector error model -> detector samples -> decoder -> observables
```

The decoder must not change the circuit or silently change the detector convention. It consumes the same DEM-derived problem and returns a correction whose detector boundary matches the sampled syndrome.

## 2. Stim and the DEM path

The DEM module accepts a Stim detector error model object or text and handles the standard statements. A typical flow:

```python
from qector_decoder_v3 import dem

dem_model = dem.from_stim(
    circuit.detector_error_model(decompose_errors=True)
)

if dem_model.is_graphlike:
    dem_model = dem_model.collapse_to_graph()
decoder = dem_model.make_decoder("blossom")
```

For a non-graphlike model, choose BP-OSD instead of forcing a matching path. Record `decompose_errors`, the collapse settings, raw and collapsed mechanism counts, and the observable mapping with the result.

## 3. The PyMatching-compatible shim

The documented compatibility surface covers the subset pipelines actually use:

```python
from qector_decoder_v3.pymatching import Matching

m = Matching.from_check_matrix(check_matrix)
m2 = Matching.from_detector_error_model(dem_model)
```

The shim also exposes `add_edge` and `add_boundary_edge` for graph construction. It exists for migration: one import changes while the caller keeps a familiar construction and decode shape. Compatibility does not mean every PyMatching option or every graph assumption is identical. Validate the returned correction against the caller's matrix and boundary convention.

## 4. Sinter entry points

QECTOR exposes five Sinter decoder factories: `qector_blossom`, `qector_belief`, `qector_unionfind`, `qector_bposd`, and `qector_unionfind_unweighted`. The value goes beyond convenience. Sinter gives the community a standard harness for using the same circuit, samples, and logical scoring across decoder rows.

For a fair comparison, hold constant:

```text
same circuit
same DEM settings
same samples
same observable scoring
same shots and seed protocol
different decoder row only
```

Do not let a Sinter row hide whether the decoder was weighted, batched, learned, or routed through a fallback. Those options belong in the report metadata.

## 5. Qiskit results

The optional Qiskit plugin (`qector=qector_decoder_v3.qiskit_plugin`) decodes syndrome counts from Qiskit results and also supports a raw-dictionary mode without Qiskit installed. That makes the adapter useful even where Qiskit exists only at the experiment boundary.

The adapter still needs a declared ordering for checks, qubits, and counts. A count dictionary with the right number of bits can encode the wrong syndrome if the ordering is undocumented.

## 6. Observables and logical scoring

The adapter must keep detector corrections and logical observables distinct. The correction is checked with `Hc=s`; the logical outcome is scored by the observable map. A stabilizer-equivalent correction can differ from the sampled physical error while giving the same logical outcome.

This is the most common integration mistake: exporting an edge list or correction vector and comparing it directly with a sampled error vector. The correct comparison happens in observable space.

## 7. Service surfaces

The engine documents REST, gRPC, MCP stdio, and Prometheus metrics surfaces. They dispatch to the same core decoder contracts and do not reimplement decoding. They are provisional, so a deployment review is required for authentication, authorization, TLS, rate limits, request size, timeouts, audit logs, and resource quotas.

An MCP client should treat decoder type, input shape, and frame size as explicit validated fields. A network wrapper is not automatically safe because the local library is safe.

## 8. Workbench and artifacts

The Workbench controller loads real `.stim` and `.dem` files, runs decode benchmarks through a cancellable job queue, and exports JSON/CSV/PDF artifacts with an environment snapshot and commit. The integration pattern is traceability: every number should point back to an input file, a decoder configuration, and an environment.

## 9. A migration checklist

When replacing an existing decoder:

1. Freeze the check and qubit ordering.
2. Export the original DEM and observable map.
3. Confirm graphlike eligibility before selecting matching.
4. Use the same detector samples for both decoders.
5. Validate `Hc=s` on every row.
6. Compare logical observables, not raw corrections.
7. Record weights, fallback routes, package versions, and seed.
8. Preserve raw artifacts and hashes.

This workflow makes a one-line import change scientifically useful, not just syntactically successful.

## Takeaway

Integration is a contract-translation problem. Stim supplies detectors and mechanisms, Sinter supplies a comparison harness, PyMatching compatibility lowers the migration cost, and Qiskit adapters connect experiment results. QECTOR's invariant stays the anchor: the returned correction must reproduce the syndrome, and the logical result must be scored in observable space.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
