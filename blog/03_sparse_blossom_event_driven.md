# Sparse Blossom: Turning Matching Into an Event-Driven Growth Process

Author: Guillaume Lessard / qector.store  
Source: QECTOR Decoder v3 Reference Manual v1.0.0  
Date: August 2026  
DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)  
Tags: Sparse Blossom, MWPM, region growth, radix heap, quantum error correction

## Abstract

Exact matching is a useful reference for graphlike quantum error correction, but building every defect-to-defect distance is wasteful when the decoding graph is sparse and geometric. Sparse Blossom changes the execution model: regions grow from defects, collision events are scheduled, and only edges that become tight are exposed to the matching logic. This post explains the region states, collision-time equation, tight-edge invariant, radix-heap queue, and the important scope boundary in the v1.0.0 manual: the shipped decoder is documented and tested as syndrome-faithful and near-optimal, with escalation when a sparse solve is incomplete or unfaithful.

## 1. Why avoid a dense distance matrix?

For a syndrome `s`, matching operates on the complete graph of defects. Even when the physical detector graph has only local edges, the complete matching graph contains a potential edge for every pair of defects. Most of those pairs cannot participate in an optimal low-weight solution at the current dual state.

Sparse Blossom does not guess that long edges are impossible. It discovers candidate edges in the order in which they can become tight under a feasible dual solution. This is a correctness-oriented form of laziness: an edge is not ignored forever; it is deferred until its collision event is relevant.

## 2. The three region states

Each top-level region has a dual radius and one of three states:

```text
Growing   dy/dt = +1   unmatched outer region
Frozen    dy/dt =  0   matched region or outer blossom shell
Shrinking dy/dt = -1   inner region of a blossom
```

The states are a compact representation of Edmonds' alternating-tree labels. Growing regions expand their dual variables. Frozen regions hold their current value. Shrinking regions contract inside a blossom so internal tight edges stay tight.

For a dual edge constraint, define the slack

$$
f_{uv}(t) = w_{uv} - y_u(t) - y_v(t) - \sum_{B \ni u,v} z_B.
$$

The algorithm must never let a feasible slack become negative. The event queue is the mechanism that handles the exact time at which a slack reaches zero.

## 3. Collision time

Two regions meet when their accumulated radii account for the model distance:

$$
y_u(t^*) + y_v(t^*) + \sum_{B \ni u,v}z_B(t^*) = w_{uv}.
$$

With constant state speeds over the interval, the general update is

$$
t^* = t + \frac{w_{uv}-y_u-y_v-\sum z_B}{dy_u/dt + dy_v/dt + \sum dz_B/dt},
$$

when the denominator is positive. In the simplest Growing-Growing case this becomes

$$
t^* = t + \frac{w_{uv}-y_u-y_v}{2}.
$$

If the denominator is non-positive, the regions are not approaching one another under the current state assignment, so there is no future collision for that interval.

The event queue stores future collision times. Processing events in non-decreasing order means that the first moment an edge can become tight is handled before a dual constraint is violated.

## 4. Tight edges and complementary slackness

Let

$$
E_{tight}(t) = \{(u,v): y_u+y_v+\sum z_B = w_{uv}\}.
$$

For a feasible dual solution, complementary slackness says that an optimal matching can be selected from tight edges, with the usual blossom boundary conditions. Sparse Blossom therefore needs to expose the tight subgraph, not the whole complete graph, at each event time.

This is the core invariant:

> An edge that has not reached its collision time is not yet required by the current tight-edge solve; an edge that reaches its collision time enters the candidate structure.

The implementation still verifies the returned correction. A candidate set that cannot complete a faithful solve is not silently accepted.

## 5. Blossoms in an event-driven solver

When a tight edge is popped, the solver examines the alternating-tree roots:

1. Different outer roots can grow an alternating tree or expose an augmenting path.
2. An edge whose endpoints close an odd cycle in the same alternating structure forms a blossom.
3. A blossom is contracted at its lowest common ancestor.
4. The new region continues with the state implied by the outer/inner structure.
5. An edge internal to an inner region is not an augmenting event.

Shrinking is not merely a graph operation. It is a dual update. The outer and inner rates are chosen so that the sum controlling an internal edge remains constant. That is why edges already known to be tight remain usable while the search continues.

## 6. Why a radix heap fits the event stream

Collision keys are processed in non-decreasing order. When weights are represented by bounded integer keys, a radix heap can exploit that monotonicity. With a binary heap, the queue work is logarithmic in the number of vertices. With a radix heap over keys bounded by `C`, the documented amortized bound is of the form

$$
O(E + V\log C).
$$

The manual also records the ordinary binary-heap bound `O(E log V)` for the event path. These are asymptotic implementation bounds. They are not wall-clock promises, and a benchmark must report its machine, workload, distribution, and artifact separately.

## 7. Candidate sparsification and fallback

The matching candidate rule is adaptive:

$$
k = \max(12,\lceil k_{mult}\sqrt{n_{defects}}\rceil),
$$

with a documented default multiplier of `2.0`. Candidate generation is event-driven. If the sparse solve is detected to be incomplete or unfaithful, the solver escalates to the full graph.

This is the right way to communicate the guarantee:

- syndrome faithfulness is a required checked property;
- sparse region growth is documented as near-optimal within its tested scope;
- exact MWPM remains the reference path for audited small matching codes;
- no universal optimality or hardware performance claim follows from the asymptotic mechanism alone.

## 8. A useful mental model

Imagine each defect inflating a weighted ball. The radius is not a physical distance; it is a dual variable. When two balls meet, the connecting route becomes tight and the matching search can use it. If the tight edges contain an odd cycle, the cycle becomes a blossom and the dual motion changes locally.

That mental model explains why the algorithm can avoid an up-front all-pairs computation without changing the matching mathematics. It also explains why the implementation has to track state transitions carefully: missing a collision is a dual-feasibility bug, while accepting an unverified sparse completion is a syndrome-faithfulness bug.

## 9. How to evaluate it

The manual points reviewers to the Sparse Blossom faithfulness test, adaptive-`k` regression, and candidate-set tests. A useful evaluation should record:

```text
code family and distance
detector graph and boundary convention
noise model and edge weights
defect distribution and batch shape
decoder configuration and k multiplier
seed, shots, environment, and commit
raw output and SHA-256 hash
```

If optimality is the question, compare the matching objective against an exact oracle on an audited small code. If correctness is the question, verify `H @ c == s` for reachable syndromes. If logical performance is the question, score observables or cosets under one comparable noise model.

## Takeaway

Sparse Blossom is best understood as event-driven primal-dual matching, not as a generic shortcut around correctness. Growth exposes tight edges, the queue orders the moments at which those edges matter, and blossom state transitions preserve the dual structure. The shipped scope remains explicit: faithful and near-optimal in tested configurations, with escalation when sparse evidence is insufficient.

## Reference

Guillaume Lessard, *QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine*, v1.0.0, August 2026. DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046).
