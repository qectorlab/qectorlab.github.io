# Space-Time Decoding: Letting the Decoder See Measurement Errors

Author: Guillaume Lessard / qector.store  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: space-time decoding, detector error model, measurement noise, streaming QEC

## Abstract

With noisy syndrome extraction, a single round of measurements is not the same object as a clean syndrome. Data faults and measurement faults must be represented together so the decoder can decide whether a detection event is spatial or temporal. QECTOR's `SpaceTimeDecoder` lifts the problem into a `(2+1)`-dimensional detector lattice; `StreamingDecoder` and `SlidingWindowDecoder` provide separate multi-round primitives. This post derives detector differencing, anisotropic edge weights, the lifted faithfulness equation, a measurement-glitch example, and the manual's explicit boundary on Python streaming claims.

## 1. Raw syndromes are histories

Let `s_(c,t)` be the observed syndrome bit for check `c` at round `t`. It can contain both data-error effects and measurement noise. Instead of decoding each round as an isolated two-dimensional problem, form detector differences:

$$
d_{c,t} = s_{c,t} + s_{c,t-1} \pmod 2,
$$

with the initial layer handled by the chosen boundary convention.

The difference records changes rather than absolute values. A data fault that persists across rounds creates events at the temporal boundaries of its interval. A measurement flip that appears and then disappears creates a pair of events at the same detector in adjacent layers. The decoder can then prefer a time-like explanation when the measurement prior makes it more likely.

## 2. The lifted parity-check problem

The lifted detector matrix `H_ST` contains both data-fault columns and measurement-fault columns. Rows represent detectors at particular time layers. A space-like column changes detector locations according to the base code; a time-like column connects the same detector across adjacent rounds.

The correction is now a space-time vector `c_ST`, and the correctness equation is

$$
H_{ST}c_{ST} = d \pmod 2.
$$

For graphlike lifted models, paths in the detector lattice have the same boundary property as paths in the two-dimensional graph. The `SpaceTimeDecoder` can therefore solve one matching problem over all rounds instead of making independent decisions that confuse measurement faults with data faults.

![Space and time edge weights](graphs/07_spacetime_weights.png)

*The edge-weight illustration is structural and shows the meaning of the prior, not a measured threshold.*

## 3. Anisotropic weights

Data and measurement mechanisms need not have the same probability. Assign

$$
w_{space} = \log\left(\frac{1-p_{data}}{p_{data}}\right),
$$

and

$$
w_{time} = \log\left(\frac{1-p_{meas}}{p_{meas}}\right).
$$

The decoder compares path costs using these priors. If measurement faults are more likely than data faults, a time-like path may be cheaper. If the measurement channel is cleaner, spatial paths may be preferred. The weights are part of the detector model, not a cosmetic tuning parameter.

For example, if `p_data = 0.01`, then `w_space` is approximately `4.595`. If `p_meas = 0.03`, then `w_time` is approximately `3.476`. The numerical example explains the direction of the preference; it is not a claim about logical-error performance.

## 4. A glitch that must not become a data correction

Assume clean rounds 1 and 2. At round 3, check 2 reports a spurious flip. At round 4 the measurement returns to its previous value. Differencing produces two detector events:

```text
appearance at (check 2, round 3)
disappearance at (check 2, round 4)
```

The most natural explanation is a pair of time-like edges. The projected spatial correction is empty because no data qubit changed. This is precisely the regression behaviour described in the manual: a lone measurement glitch that reverts on the next round must not corrupt the spatial correction.

## 5. The lifted faithfulness theorem

Let `d` be the detector-event vector. If the decoder returns a space-time correction with

$$
H_{ST}c_{ST} = d,
$$

then every detector event is reproduced by the correction. Projecting away the measurement columns yields a spatial correction whose final-round syndrome differs from the raw final measurement only by the final-round measurement-error boundary term. The projection statement is a property of the lifted chain complex, not a claim that measurement noise has been eliminated from the physical device.

The logical test remains separate. Once the final spatial correction is formed, its residual must be evaluated in the appropriate logical-observable or stabilizer quotient.

## 6. Full space-time versus streaming primitives

These names describe different scopes:

| Surface | Documented role |
|---|---|
| `SpaceTimeDecoder` | Full lifted detector-lattice decoding across `T` rounds |
| `StreamingDecoder` | Rust streaming primitive with accumulated history |
| `SlidingWindowDecoder` | Rust window with decay weighting |
| Python streaming layer | Per-round/windowed workflow for batching and telemetry; not full 3D matching by itself |

For a decayed window, the manual gives a geometric truncation bound. If `0 <= lambda < 1`,

$$
\|S_W-S_{infty}\|_1 \leq \frac{\lambda^W}{1-\lambda}\|s\|_{infty}.
$$

The expression describes the history approximation. It does not by itself establish a numerical logical-fidelity loss or a hardware-control guarantee.

## 7. Choosing between offline and online paths

Use the full lifted decoder when the experiment needs a circuit-level or multi-round decision that can use the complete detector history. Use a streaming primitive when the workflow needs bounded state, incremental commits, or telemetry and can accept the stated windowing semantics.

In either case, record:

```text
number of rounds and boundary convention
data and measurement error priors
detector construction and DEM settings
decoder family and weight mode
window length and decay factor, if applicable
observable scoring, seed, environment, and artifact hash
```

Do not describe a per-round Python window as full circuit-level space-time matching. The manual explicitly reserves that claim for the lifted `SpaceTimeDecoder` path.

## 8. Why this matters to hardware teams

The detector lattice is an interface between measurement electronics and decoding software. It lets a decoder consume repeated stabilizer outcomes without requiring the hardware layer to declare every event a data fault. It also makes priors visible: calibration data can inform time-like and space-like weights, while the algebraic gate verifies the emitted detector correction.

This separation supports heterogeneous systems. The physical layer produces rounds, the DEM describes mechanisms, the space-time decoder handles correlated history, and the validation harness scores observables under a named noise model.

## Takeaway

Noisy measurements do not invalidate syndrome decoding; they change the matrix. XOR differencing turns a history into detector events, anisotropic weights express the relative fault priors, and the lifted equation preserves the same syndrome-faithfulness idea in one higher dimension. Streaming is useful, but its scope must be stated precisely rather than marketed as full circuit-level matching.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
