# Detector Error Models: From Fault Mechanisms to a Decoder Graph

Author: Guillaume Lessard  
Series: QECTOR Decoder v3 companion notes, Post 13  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)
Tags: detector error model, Stim, graph collapse, observables, QEC tooling

## Abstract

A decoder cannot choose sensible paths from a circuit without a machine-readable description of that circuit's fault mechanisms. A detector error model (DEM) provides the description: rows are detectors, columns are mechanisms, and each mechanism carries a prior probability and an observable effect. This post follows QECTOR's DEM pipeline from parsing and graphlike classification through parallel-edge collapse, likelihood weights, prior recalibration, and decoder construction.

## 1. The DEM as a matrix

Represent a DEM by a binary matrix `H_DEM`:

- one row per detector;
- one column per fault mechanism;
- `H[d,m] = 1` when mechanism `m` flips detector `d`.

The syndrome is a vector of fired detectors. A correction is a selection of mechanism columns whose XOR reproduces that vector.

The parser described by the manual handles `error`, `detector`, `logical_observable`, `shift_detectors`, and `repeat` blocks. It can parse a Stim DEM object or DEM text without requiring Stim to be installed at parse time.

## 2. Graphlike classification

The column weight is the structural test:

```text
weight <= 2  -> graph edge or boundary edge
weight > 2   -> hyperedge; matching is not valid
```

This classification must happen before constructing a matching decoder. Decomposing a hyperedge into pairwise edges silently changes the fault model and can change the logical result. QECTOR routes non-graphlike models to BP-OSD.

## 3. Likelihood weights

Each mechanism with probability `p` receives

$$
w = \log\left(\frac{1-p}{p}\right).
$$

For a graphlike model, a shortest path under these weights is the most likely chain under the independent-mechanism model the DEM encodes. A matching decoder then optimizes over pairings of detector defects.

Weights are not optional decoration. If one mechanism has probability `1e-4` and another has probability `1e-2`, their weights are approximately `9.21` and `4.60`. Treating them as equal erases information the circuit model already supplied.

## 4. Collapsing parallel mechanisms

Circuit decomposition can create multiple independent mechanisms connecting the same detector pair. QECTOR collapses them for graphlike decoding with the independent-XOR rule:

$$
p = p_1(1-p_2) + p_2(1-p_1).
$$

For `p1=0.01` and `p2=0.02`:

$$
p = 0.01(0.98)+0.02(0.99)=0.0296.
$$

The collapsed edge receives `log((1-p)/p)`. The manual also documents which observable set survives: the set belonging to the most likely member of the parallel group. The rule is covered by dedicated DEM-collapse fixtures.

## 5. Observables are not detector rows

Detectors tell the decoder which parity constraints fired. Logical observables tell the scoring harness whether the predicted logical outcome differs from the sampled outcome. Conflating them is a common source of wrong LER numbers.

The DEM therefore carries both:

```text
detector incidence: used to build H and decode
observable incidence: used to score logical outcomes
```

This separation is the practical reason QECTOR rejects `correction != error` as a logical-error metric.

## 6. Prior recalibration

If observed detector events are available, the manual describes simple prior estimators:

- for a weight-1 mechanism, use the detector firing rate;
- for a weight-2 mechanism, estimate the correlated XOR probability `P_xor = 2p(1-p)` and invert

  $$
  p = \frac{1-\sqrt{1-2P_{xor}}}{2};
  $$

- for a hyperedge, use the maximum firing rate among its detectors as the documented conservative estimate.

Recalibration changes the weights and therefore the selected representative. It does not remove the need to validate `Hc=s`, nor to score logical observables under a declared experiment.

## 7. A safe construction workflow

```python
from qector_decoder_v3 import dem

model = dem.from_stim(
    circuit.detector_error_model(decompose_errors=True)
)

if model.is_graphlike:
    model = model.collapse_to_graph()
    decoder = model.make_decoder("blossom")
else:
    decoder = model.make_decoder("bposd")
```

The method names (`from_stim`, `is_graphlike`, `collapse_to_graph`, `make_decoder`) are confirmed in the v1.0.0 API; check the installed package for the full option set. The structural guard is the important part: never force a matching decoder onto a hypergraph model.

## 8. DEM audit fields

For a reproducible DEM-derived result, record:

```text
source circuit or DEM text
Stim version, if used
decompose_errors setting
raw mechanism count
graphlike status
collapsed mechanism count
probability and weight convention
observable mapping
code distance and rounds
decoder class and seed
raw results and SHA-256
```

A DEM object without its construction settings is not enough to reproduce a circuit-level comparison.

## Takeaway

The DEM is the bridge from a noisy circuit to a decoding problem. Parse mechanisms into columns, classify graphlike structure before choosing a solver, combine parallel probabilities correctly, keep observables for logical scoring, and record every transformation. The output is only as trustworthy as that pipeline.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
