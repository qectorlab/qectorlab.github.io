# UF-01: Parity, Peeling, and Allocation-Free Graphlike Decoding

Author: Guillaume Lessard / qector.store  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: Union-Find, graphlike decoding, cluster growth, GF(2), Rust systems

## Abstract

Union-Find decoding trades global matching optimality for a simple local process: grow clusters around fired detectors, merge them, and peel a spanning forest. QECTOR's UF-01 path makes that process predictable in memory as well as in algebra. This post derives the cluster-parity invariant, explains the satisfiability condition and boundary sink, proves why leaf-to-root peeling returns a syndrome-faithful correction, and states the documented domain boundary: Union-Find is for graphlike codes, not arbitrary hypergraph checks.

## 1. Eligibility comes first

In a graphlike problem, each qubit appears in at most two checks. A qubit can therefore be represented as an edge between detector nodes. The decoder receives a syndrome `s` on detector nodes and must emit a set of edges `c` such that

$$
Hc = s \pmod 2.
$$

If a qubit participates in more than two checks, it is a hyperedge. QECTOR explicitly rejects that structure for the Union-Find family and routes it to BP-OSD. This is a contract, not a performance limitation to be worked around by silently changing the graph.

## 2. Cluster parity

For a cluster `C` of detector vertices, define

$$
\pi(C) = \bigoplus_{v\in C} s_v.
$$

The parity has a simple merge law. For disjoint clusters `C1` and `C2`,

$$
\pi(C1 \cup C2) = \pi(C1) \oplus \pi(C2).
$$

An even cluster can be satisfied internally. An odd cluster needs either another odd cluster or a boundary. The virtual boundary is a parity sink: a one-ended path may terminate there without leaving an unsatisfied detector.

## 3. Growth and fusion

The unweighted procedure can be read as five stages:

1. Create a cluster for each fired detector.
2. Grow the frontier of every unsatisfied odd cluster.
3. Add newly reached vertices and mark the corresponding graph edges.
4. Fuse clusters when their growth touches.
5. Stop when every cluster is even or boundary-attached.

The stopping condition is exactly

$$
\pi(C) = 0 \quad\text{or}\quad \text{boundary}(C)=1.
$$

The implementation maintains parity, boundary state, root, and size in the Union-Find structure. Union-by-rank and path compression make the disjoint-set operations amortized near-linear in the graph size.

## 4. Peeling a spanning forest

Growth records a subgraph, not necessarily a tree. UF-01 builds a spanning forest and processes each tree from leaves to root. For an oriented tree edge from parent `p` to child `v`, flip the edge if the residual parity of the child subtree is one:

$$
c_{(p,v)} = \pi(\text{subtree}(v)).
$$

The child residual is then XORed into the parent residual.

### Peeling proof

At a leaf, the only way to remove a syndrome bit is to flip its parent edge when that bit is one. Assume every processed child subtree has satisfied all internal vertices and has passed only one residual bit to its parent. XOR is additive over `F2`, so combining child residuals and the parent's syndrome gives the correct residual for the larger subtree. At the root, the growth halt condition guarantees that the residual is zero or is absorbed by the virtual boundary. Therefore every detector receives exactly its requested syndrome parity, and

$$
Hc = s \pmod 2.
$$

This proof is why UF peeling can be simple without being unverified.

## 5. Weighted growth

When mechanisms have different probabilities, edge lengths should reflect their priors:

$$
w_e = \log\left(\frac{1-p_e}{p_e}\right).
$$

The weighted UF path advances clusters by adaptive time steps, stopping when a frontier edge saturates. Invalid weights are rejected during construction. With uniform weights, the weighted and unweighted paths are documented to agree in correction cost within the tested scope.

The weighted path is still a graphlike cluster-growth decoder. It is not a replacement for BP-OSD on hyperedges and it is not an exact MWPM solver.

## 6. Repetition-code example

Use the repetition checks

```text
{0, 1}, {1, 2}, {2, 3}, {3, 4}
```

There are five qubits and four checks. Consider these reachable syndromes:

```text
s1 = [1, 0, 0, 0]
s2 = [1, 1, 0, 0]
```

For `s1`, the cluster at check 0 is odd and attaches to the left boundary through qubit 0. Peeling returns

```text
c1 = [1, 0, 0, 0, 0].
```

For `s2`, the two adjacent defects form an even cluster. The connecting edge is qubit 1, so

```text
c2 = [0, 1, 0, 0, 0].
```

Directly, `H @ c1 = s1` and `H @ c2 = s2` modulo two. The decoder did not need to enumerate all error patterns; cluster parity determined the required forest action.

## 7. What zero allocation means here

UF-01 preallocates graph-sized buffers and resets them in place. The manual describes no heap allocation in the steady-state hot path and points to memory-growth and scratch-reuse tests. That is a structural property of the implementation, not a promise of a particular latency.

The same distinction applies to complexity. The documented amortized bound is

$$
O((V+E)\alpha(V+E))
$$

with `O(V+E)` space. Here `alpha` is the inverse Ackermann function. An asymptotic bound does not identify the wall-clock behavior of a particular CPU, compiler, graph, batch shape, or memory hierarchy.

## 8. Logical correctness is separate

UF-01 guarantees the syndrome contract on supported graphlike inputs. If `e` is the sampled physical error, faithfulness gives

$$
H(c+e)=0,
$$

so `c + e` lies in `ker(H)`. Whether the residual is harmless depends on the stabilizer row space:

$$
\text{logical success} \iff c+e \in \operatorname{im}(H^T).
$$

Union-Find is not minimum-weight perfect matching, so its logical-error behavior must be evaluated on a declared workload rather than inferred from the peeling proof.

## 9. Validation checklist

For a UF experiment, record:

- the check-to-qubit structure and proof that every qubit degree is at most two;
- boundary convention and whether growth is weighted;
- code family, distance, rounds, noise model, and reachable-syndrome generator;
- single-shot versus pre-built hot-path versus batch timing;
- the exact package/build environment and commit;
- faithfulness results and logical-observable results separately;
- raw artifacts and their SHA-256 hashes.

The manual anchors UF claims to faithfulness, property, batch-equivalence, memory, and native RSS tests. It does not carry a current universal test count or a universal speed claim.

## Takeaway

UF-01 is a compact example of proof-guided systems design. Cluster parity tells the algorithm when it may stop, forest peeling turns that state into a correction, and preallocated buffers make the memory behavior explicit. The result is a faithful graphlike decoder with a near-linear amortized bound, not a universal decoder for every quantum code.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
