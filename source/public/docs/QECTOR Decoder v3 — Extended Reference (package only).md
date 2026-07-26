QECTOR Decoder v3 — Extended Reference (package only)  
Version: 0.6.9 · PyPI: qector-decoder-v3 · Backend: Rust + PyO3

This document covers only the installable Python package qector-decoder-v3==0.6.9. It does not describe the Workbench GUI or the Workbench’s 47-tool MCP server.

---

### 1. Installation and platforms

```bash
pip install qector-decoder-v3==0.6.9
pip install "qector-decoder-v3[stim]"    # Stim / Sinter / PyMatching
pip install "qector-decoder-v3[bench]"   # benchmarks
pip install "qector-decoder-v3[all]"     # full research stack
```

| Item | Value |
| ----- | ----- |
| Python | 3.9 – 3.13 |
| Platforms | Linux x86_64 (manylinux), Windows x64, macOS arm64 |
| License | Source-available (free academic / personal / non-commercial; commercial licence required) |
| Startup notice | Suppressed with QECTOR_SILENT=1 |
| Licence env | QECTOR_LICENSE (Ed25519 token); overrides "academic" / "commercial" for testing |

---

### 2. Core architecture

* Rust core (compiled extension) — matching, UF, batch, GPU paths  
* Python surface — API, Stim/Sinter compat, belief/GNN, licensing  
* Zero-copy NumPy where possible; GIL-free decode on native paths

Public version string: `qector_decoder_v3.__version__ == "0.6.9"`.

---

### 3. Decoder families (package API)

| Class / entry | Best for | Status | Graph-like required |
| ----- | ----- | ----- | ----- |
| UnionFindDecoder | Low-latency approximate | Stable | Yes (weight ≤ 2 / participation ≤ 2) |
| FastUnionFindDecoder | Faster UF hot path | Stable | Yes |
| BlossomDecoder | Exact MWPM / PyMatching parity | Stable | No |
| SparseBlossomDecoder | Near-optimal matching | Experimental | Prefer graph-like |
| BeliefMatching | Correlated-noise accuracy | Research | Prefer graph-like |
| BpOsdDecoder / BPOSDDecoder | LDPC / qLDPC | Experimental | No |
| BatchDecoder / CPUBatchDecoder | High-throughput CPU batch | Stable | Yes for UF-based batch |
| CUDABatchDecoder | GPU batch | Runtime-dependent | — |
| OpenCLBatchDecoder | OpenCL batch | Build/runtime-dependent | — |
| AutoDecoder | 7-tier self-debugging fallback | Stable | — |
| HybridDecoder | UF + Blossom routing | Experimental | Prefer graph-like |
| PredecodedDecoder | Easy-syndrome prefilter | Experimental | Prefer graph-like |
| LookupTableDecoder | Small codes only | Experimental | Small *n_checks* |
| SlidingWindowDecoder / StreamingDecoder | Multi-round / streaming | Experimental | — |
| GNNBeliefMatcher / GNNPredecoder | GNN-guided matching | Research | Prefer graph-like |
| NeuralPredecoder | Learned predecoder | Research | — |
| Workbench | High-level orchestration | Stable | — |
| DecoderPool | Multi-process batch | Stable | — |
| LERBenchmark | LER sweeps | Experimental | — |

Graph-like rule (UF family): every qubit must participate in at most two checks. Matrices that violate this raise a clear error (no silent wrong results). BlossomDecoder, SparseBlossomDecoder, and BpOsdDecoder accept hyperedge / higher-degree codes.

---

### 4. Code generators (package)

```python
from qector_decoder_v3 import (
    generate_repetition_code_checks,  # (checks, n_qubits)
    generate_ring_code_checks,
    generate_surface_code_checks,     # hyperedge-style surface
    generate_toy_code_checks,
)
```

| Generator | Shape | Graph-like? |
| ----- | ----- | ----- |
| generate_repetition_code_checks(d) | path of length *d* | Yes |
| generate_ring_code_checks(d) | cycle, *n_qubits* = *d*² | Yes |
| generate_surface_code_checks(d) | surface-like, often hyperedge | No (e.g. d=3 → participation 8) |

For production surface-code work, prefer a Stim DEM (decompose_errors=True) via stim_compat.from_stim_detector_error_model, or use the Workbench’s graph-like rotated_surface generator outside this package.

---

### 5. Minimal usage examples

Single syndrome (graph-like)

```python
import numpy as np
from qector_decoder_v3 import UnionFindDecoder, BlossomDecoder

checks, n_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]], 5
syndrome = np.array([0, 1, 0, 0], dtype=np.uint8)

uf = UnionFindDecoder(checks, n_qubits)
print(uf.decode(syndrome))

mwpm = BlossomDecoder(checks, n_qubits)
print(mwpm.decode(syndrome))
```

Batch

```python
from qector_decoder_v3 import BatchDecoder, CUDABatchDecoder

batch = BatchDecoder(checks, n_qubits)
syndromes = np.random.randint(0, 2, (4096, 4), dtype=np.uint8)
corrections = batch.parallel_batch_decode(syndromes)

if CUDABatchDecoder.is_available():
    gpu = CUDABatchDecoder(checks, n_qubits)
    corrections = gpu.batch_decode(syndromes)
```

AutoDecoder (7-tier fallback)

```python
from qector_decoder_v3 import AutoDecoder

dec = AutoDecoder(checks, n_qubits)
corrections = dec.batch_decode(syndromes)
# inspect: dec._diag.backend_health, dec._diag.active_backend
```

BeliefMatching / BP-OSD

```python
from qector_decoder_v3 import BeliefMatching, BpOsdDecoder
import numpy as np

H = np.array([[1,1,0,0,0],[0,1,1,0,0],[0,0,1,1,0],[0,0,0,1,1]], dtype=np.uint8)
bm = BeliefMatching.from_numpy_h(H)          # v0.6.9: returns length-n_qubits vector
print(bm.decode(np.array([0,1,0,0], dtype=np.uint8)))

bp = BpOsdDecoder(H, error_rate=0.05, osd_order=0, bp_method="exact")
print(bp.decode(np.array([0,1,0,0], dtype=np.uint8)))
```

Stim

```python
import stim
from qector_decoder_v3 import BlossomDecoder
from qector_decoder_v3.stim_compat import from_stim_detector_error_model

circuit = stim.Circuit.generated(
    "surface_code:rotated_memory_z", distance=5, rounds=5,
    after_clifford_depolarization=0.005,
)
dem = circuit.detector_error_model(decompose_errors=True)
checks, n_qubits = from_stim_detector_error_model(dem)
decoder = BlossomDecoder(checks, n_qubits)
```

Licence

```python
from qector_decoder_v3.license import verify_license_token
verify_license_token("")                    # False
verify_license_token("garbage")             # False (no raise; hardened in 0.6.9)
verify_license_token("academic")            # True (dev override)
```

---

### 6. v0.6.9 package highlights

| Area | Change |
| ----- | ----- |
| BeliefMatching | from_numpy_h returns faithful length-n_qubits correction (H @ corr ≡ syndrome) |
| BP-OSD | Exact log-domain sum-product BP by default; OSD-1/2 via osd_order |
| GNN | GNNBeliefMatcher end-to-end GNN-guided MWPM with faithfulness fallback |
| Licence | Malformed tokens return False (no exception); v2 tokens carry tier + expiry |
| Docs | Tuning env vars documented (accuracy vs throughput) |

Tuning environment variables

| Variable | Default | Effect |
| ----- | ----- | ----- |
| QECTOR_BLOSSOM_K_MULT | 2.0 | Candidate-neighbour multiplier (affects accuracy) |
| QECTOR_BLOSSOM_INTRA_PAR | auto | Intra-decode parallelism (throughput only) |
| QECTOR_BLOSSOM_INTRA_THREADS | unset | Dedicated Rayon pool size |
| QECTOR_CUDA_DEVICE_ID | 0 | CUDA device index |
| QECTOR_OPENCL_DEVICE_ALLOW | unset | Device name filter substrings |

Only QECTOR_BLOSSOM_K_MULT and device selection change matching quality.

---

### 7. Package MCP server (run_mcp_server)

```python
from qector_decoder_v3 import run_mcp_server
run_mcp_server()   # JSON-RPC 2.0 on stdin/stdout
```

Tools (3)

| Tool | Role |
| ----- | ----- |
| decode_syndrome | Single syndrome; accepts undocumented decoder_type |
| benchmark_decoder | Simple latency harness |
| get_decoder_info | Version + partial capability list |

decoder_type values that route successfully (graph-like codes):  
UnionFind, FastUnionFind, Blossom, SparseBlossom, bposd, LookupTable, SlidingWindow, Streaming, Auto, Hybrid, BeliefMatching, Predecoded, GNNBeliefMatcher, Batch, … (case variants often accepted).

Limitation: the package MCP applies a UF-style structural gate (qubit participation ≤ 2). Hyperedge matrices (including generate_surface_code_checks) are rejected for all decoder_type values with error −32602. There is no argument that disables this gate.

Workbench MCP (47 tools) is a separate product surface and is not part of this package reference.

---

### 8. Hyperedge workaround (package only)

```python
import numpy as np
from qector_decoder_v3 import BlossomDecoder, SparseBlossomDecoder, BpOsdDecoder

def decode_hyperedge(checks, n_qubits, syndrome, kind="Blossom", **opts):
    """Use when MCP or UF-family reject high-degree incidence matrices."""
    syn = np.asarray(syndrome, dtype=np.uint8).ravel()
    if kind in ("Blossom", "blossom"):
        return BlossomDecoder(checks, n_qubits).decode(syn)
    if kind in ("SparseBlossom", "sparse_blossom"):
        return SparseBlossomDecoder(checks, n_qubits).decode(syn)
    if kind.lower() in ("bposd", "bp_osd"):
        H = np.zeros((len(checks), n_qubits), dtype=np.uint8)
        for i, c in enumerate(checks):
            for q in c:
                if 0 <= q < n_qubits:
                    H[i, q] ^= 1
        return BpOsdDecoder(H, error_rate=opts.get("error_rate", 0.05),
                            osd_order=opts.get("osd_order", 0)).decode(syn)
    raise ValueError(f"unsupported kind for hyperedge: {kind}")
```

MCP + fallback pattern: try package MCP; on message containing "hyperedge" / "weight ≤ 2" / "participates in", call decode_hyperedge (or BlossomDecoder directly).

---

### 9. HybridCascadeDecoder Wheel Analysis & Manual Cascade Pattern

```python
import qector_decoder_v3 as qd
import numpy as np

# Native diagnostic check
has_native_cascade = hasattr(qd, "HybridCascadeDecoder") and not getattr(qd, "HybridCascadeDecoder").__name__.endswith("_Unavailable")

def cascade_decode(check_to_qubits, n_qubits, syndrome, max_mwpm_weight=5):
    """Manual cascade decoder pattern (works on all public wheels)."""
    uf = qd.UnionFindDecoder(check_to_qubits, n_qubits)
    uf_corr = uf.decode(syndrome)
    
    # Evaluate syndrome residual: H * corr (mod 2)
    syn_len = len(check_to_qubits)
    H = np.zeros((syn_len, n_qubits), dtype=np.uint8)
    for i, qubits in enumerate(check_to_qubits):
        H[i, qubits] = 1
    residual = (H @ uf_corr) % 2
    
    if not np.any(residual):
        return uf_corr  # UF solved the syndrome faithfully
        
    # Switch to exact Blossom MWPM if residual is non-zero
    mwpm = qd.BlossomDecoder(check_to_qubits, n_qubits)
    return mwpm.decode(syndrome)
```

---

### 10. AutoDecoder 7-tier fallback (v0.6.8+)

| Tier | Backend |
| ----- | ----- |
| 1 | CUDA batch |
| 2 | OpenCL batch |
| 3 | CPU Rayon parallel batch |
| 4 | CPU batch |
| 5 | CPU single |
| 6 | Blossom (exact) |
| 7 | Lookup / pure Python |

Failed backends are health-scored and suspended; reset_backend_health() re-enables them.

---

### 11. Validated claims (package artefacts)

* MWPM parity with PyMatching on tested surface distances (LER counts match; latency is workload-dependent; PyMatching often faster on standard MWPM).  
* Belief-matching LER reduction on low-distance circuit-level noise (research path; much slower).  
* GPU batch bit-identical to CPU when CUDA/OpenCL builds and hardware are available.  
* Faithfulness: corrections satisfy Hc ≡ s (mod 2) on successful graph-like trials in package tests.

---

### 12. Practical recommendations (v0.6.9 package)

| Goal | Choice |
| ----- | ----- |
| Fast graph-like Monte Carlo | FastUnionFindDecoder / BatchDecoder / AutoDecoder |
| Exact MWPM validation | BlossomDecoder |
| Hyperedge / general stabilizer | BlossomDecoder or BpOsdDecoder (direct API) |
| qLDPC / LDPC | BpOsdDecoder (bp_method="exact", osd_order as needed) |
| Accuracy research | BeliefMatching / GNNBeliefMatcher |
| Agent / stdio automation | Package MCP for graph-like only; else direct API + fallback |
| Licence checks | verify_license_token (offline Ed25519; v2 tokens with tier/exp) |

---

Package: qector-decoder-v3==0.6.9  
Docs / site: https://www.qector.store · https://pypi.org/project/qector-decoder-v3/  
Repository: https://github.com/GuillaumeLessard/qector-decoder
