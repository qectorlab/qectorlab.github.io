# Logical Error Rates Without the Wrong Metric

Author: Guillaume Lessard  
Series: QECTOR Decoder v3 companion notes, Post 15  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)
Tags: logical error rate, Wilson interval, observables, reproducible QEC

## Abstract

Logical-error-rate plots are easy to produce and easy to misinterpret. In a degenerate stabilizer code, a correction can differ from the sampled physical error by a stabilizer and still be logically correct. QECTOR's methodology therefore scores observable flips from the same circuit, uses Wilson confidence intervals, and refuses comparisons across incompatible noise models. This post gives the metric, a hand calculation, and a report checklist.

## 1. Do not score raw correction equality

Let `e` be the sampled error and `c` the decoder correction. Syndrome faithfulness gives

$$
H(c+e)=0.
$$

The residual sits in the kernel. It is logically harmless only when it also sits in the stabilizer row space. A different correction vector is not automatically a logical error.

For a circuit with logical observables, compare the sampled observable flips with the predicted observable flips after applying the correction. A shot counts as a logical error when those observable values differ.

This definition respects degeneracy and matches the manual's LER methodology.

## 2. The Wilson interval

Suppose `k` of `n` shots are logical errors and `p_hat = k/n`. The 95 percent Wilson interval is

$$
\left(
\frac{\hat p + z^2/(2n) - z\sqrt{\hat p(1-\hat p)/n + z^2/(4n^2)}}{1+z^2/n},
\frac{\hat p + z^2/(2n) + z\sqrt{\hat p(1-\hat p)/n + z^2/(4n^2)}}{1+z^2/n}
\right),
$$

where `z = 1.959963985`.

The interval stays inside `[0,1]` and behaves better than the Wald approximation when errors are rare or counts are small.

## 3. Hand calculation: 10 errors in 1000 shots

This is a worked example from the reference manual, not a product measurement. Take `k=10` and `n=1000`, so `p_hat=0.01`. The manual evaluates the Wilson interval as approximately

```text
lower ~= 0.00544
upper ~= 0.01831
```

The point estimate is one percent, but the interval shows the uncertainty carried by only 1000 trials. Publishing `0.01` alone hides that uncertainty.

## 4. Comparability is part of the metric

The same nominal physical error value can describe different experiments. QECTOR tags results as `code_capacity` or `circuit_level` and refuses to compare across those model classes. A fair decoder comparison holds constant:

```text
circuit generator or DEM
decompose_errors and collapse settings
distance and rounds
physical noise source and value
detector samples
observable scoring
shots and seed
package versions and environment
```

Then the decoder row is the changing factor. Mixing a code-capacity QECTOR run with a circuit-level reference is not a meaningful leaderboard.

## 5. An example of a published comparison

The v1.0.0 package changelog ships a 120-test LER suite against PyMatching on a repetition code at `d=3` and `p=0.01`. It reports `ler_qector=0.00392` and `ler_pymatching=0.00317`, described as agreeing within a declared 4.5x margin.

These are measurements on one fixed workload, not universal claims. Their value is the discipline behind them: both decoders ran the same workload with the same noise value, so the comparison isolates the decoder rather than the setup.

## 6. The report schema

Every public LER report should include:

| Field | Example content |
|---|---|
| Circuit | Generator command or checked-in `.stim` file |
| DEM | Settings, counts, graphlike status |
| Code | Family, distance, rounds, checks, qubits |
| Noise | Channel, rate, model tag |
| Decoder | Exact class, weights, BP/OSD flags |
| Sampling | Shots, warmup, seed, error count |
| Statistics | LER and Wilson interval |
| Environment | OS, CPU, RAM, Python/Rust/packages |
| Artifact | Raw JSON/CSV path and SHA-256 |

If one of these fields is missing, the result may still be a useful smoke test, but it is not a complete portable evidence artifact.

## 7. Correctness before statistics

The LER harness should reject or record unfaithful shots before logical scoring. The sequence is:

1. Generate or load the same detector samples for every decoder.
2. Decode each syndrome.
3. Check `H @ correction == syndrome` on reachable inputs.
4. Compute observable flips.
5. Count logical mismatches.
6. Compute the LER and its interval.

This stops an invalid correction from hiding inside an apparently low logical-error rate.

## 8. Threshold language

A crossing in a plot is a workload result, not a property of a decoder in the abstract. Safe wording names the code, noise model, distance range, shots, seed, decoder configuration, and surviving artifact. The reference manual excludes threshold claims that lack that evidence.

Likewise, do not infer that exact MWPM is always logically best on a non-graphlike code, or that a GPU result is faster simply because it ran on a GPU. The methodology is part of the claim.

## Takeaway

An honest LER pipeline has three layers: syndrome validity, logical-observable scoring, and statistical uncertainty. Wilson intervals quantify the sampling uncertainty; comparable noise models protect the comparison; raw artifacts let another engineer check the sentence. That is enough to make a plot evidence rather than decoration.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
