# Weighted Decoding: Why the Prior Belongs in the Graph

Author: Guillaume Lessard / qector.store  
Series: QECTOR Decoder v3 companion notes, Post 14  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: weighted decoding, likelihood ratios, DEM, MWPM, Union-Find

## Abstract

An unweighted graph treats every fault mechanism as equally plausible. That may be acceptable for a uniform code-capacity toy model, but circuit-level decoding normally supplies different data and measurement probabilities. QECTOR's matching decoders accept log-likelihood weights, and its weighted Union-Find path uses the same probability information for adaptive growth. This post derives the weight, shows what changes under nonuniform noise, and explains why weighted correctness claims must be separated from performance claims.

## 1. From probability to cost

For a binary mechanism with error probability `p`, the odds of an error versus no error are `p/(1-p)`. The negative log odds are

$$
w(p) = -\log\left(\frac{p}{1-p}\right) = \log\left(\frac{1-p}{p}\right).
$$

Independent mechanisms add log probabilities, so a path cost is the sum of its edge weights. Minimizing that cost is equivalent to selecting the most likely chain under the model assumptions.

The formula is monotone: rare mechanisms have larger costs, common mechanisms smaller costs. A decoder that ignores the variation cannot distinguish the two.

## 2. A two-edge comparison

Consider two available mechanisms:

```text
p_a = 0.0001  -> w_a ~= 9.21
p_b = 0.01    -> w_b ~= 4.60
```

A path containing one `b` edge is cheaper than a path containing one `a` edge, even if both paths have the same number of edges. Under an unweighted model they would tie. The weighted model therefore uses information that the calibration or DEM already provided.

The example does not say which correction is logically better. It says which representative is preferred by the declared independent-noise likelihood.

## 3. Uniform noise is a special case

If every mechanism has the same probability `p`, every edge receives the same weight. A path with fewer edges also has lower total weight, so weighted and unweighted matching agree on the ordering. That is why a uniform code-capacity experiment can make an unweighted decoder look adequate.

The agreement does not transfer automatically to circuit-level noise, biased noise, or a model with different temporal and spatial rates.

## 4. Matching and Union-Find use weights differently

For Blossom and Sparse Blossom, weights define shortest-path distances and matching costs. For weighted Union-Find, clusters advance by adaptive time steps that saturate frontier edges according to their lengths. The implementations share the probability-to-weight convention but not the same optimization contract.

| Decoder | Use of weights | Claim boundary |
|---|---|---|
| Blossom | Exact weighted MWPM on audited small matching codes | Exactness is scoped |
| Sparse Blossom | Event times and candidate growth | Faithful/near-optimal tested scope |
| Union-Find | Adaptive weighted cluster growth | Faithful supported graphlike path |
| BP-OSD | Priors and posterior reliabilities | Faithful residual solve for reachable matrices |

Weights improve the model fit; they do not make an approximate decoder exact.

## 5. Space-time anisotropy

In a lifted detector lattice, data and measurement mechanisms commonly use different probabilities:

$$
w_{space}=\log\left(\frac{1-p_{data}}{p_{data}}\right),\qquad
w_{time}=\log\left(\frac{1-p_{meas}}{p_{meas}}\right).
$$

This creates an anisotropic graph. A measurement glitch may be cheaper to explain with a time-like path than with a spatial data chain. If the prior changes, the preferred path can change while the path-boundary proof remains unchanged.

## 6. Per-shot reweighting

The manual documents in-place edge-weight replacement in `O(E)` and a batched path that accepts one weight vector per shot. This supports workflows in which BP posteriors or calibrated mechanism rates alter the graph for each syndrome.

The validation target is equivalence of the reweighted and freshly constructed paths on the tested configurations. It is not a universal statement that all weight updates preserve the same correction or logical result.

## 7. Weight validation

Before running a weighted decoder, check:

```text
0 < p < 1 for every mechanism
probability ordering matches the calibration source
boundary mechanisms have explicit treatment
parallel DEM mechanisms are collapsed consistently
spatial and temporal weights use the intended channels
weight dtype and precision are recorded
```

The decoder should reject invalid weights at construction rather than silently treating them as uniform.

## 8. Claim boundaries

A weight formula is a mathematical contract. A logical-error curve is an empirical result. To publish the latter, include the circuit or DEM, code, noise model, shots, seed, decoder mode, environment, raw artifact, and confidence interval. Do not compare a weighted circuit-level result with an unweighted code-capacity result simply because both use the same nominal `p`.

## Takeaway

Likelihood weights are how a decoder listens to the noise model. Uniform weights are a useful special case, not a universal default. Put the prior into the DEM and decoder, keep the structural graph/hypergraph guard, and report the resulting logical behaviour only with comparable artifacts.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
