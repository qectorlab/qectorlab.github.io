import { useState } from 'react';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import CodeBlock from '../components/CodeBlock';
import ApiIndex from '../components/ApiIndex';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PYPI_VERSION } from '../lib/releases';
import { Search, ChevronDown, ChevronRight, Terminal, BookOpen, Layers } from 'lucide-react';

// Guided entries for the most used classes and functions. Every name,
// signature and default below is copied from src/content/api-<version>.json
// (the index generated from the published wheel, rendered by <ApiIndex />).
// When the index changes, update these entries to match it: never document a
// name, parameter or default the index does not list.

interface APIClass {
  name: string;
  signature: string;
  desc: string;
  parameters: Array<{ name: string; type: string; default: string; desc: string }>;
  example: string;
}

const classes: APIClass[] = [
  {
    name: 'BlossomDecoder',
    signature: 'BlossomDecoder(check_to_qubits, n_qubits=None, edge_weights=None)',
    desc: "Minimum-weight perfect matching (MWPM) decoder via Edmonds' Blossom algorithm. Graphlike inputs only: every qubit may take part in at most two checks. Hypergraph and qLDPC check matrices go to BpOsdDecoder instead.",
    parameters: [
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'For each check, the indices of the qubits it covers' },
      { name: 'n_qubits', type: 'int', default: 'None', desc: 'Number of data qubits' },
      { name: 'edge_weights', type: '-', default: 'None', desc: 'Optional matching weights, one per qubit; set_edge_weights(weights) changes them later' },
    ],
    example: `import numpy as np
from qector_decoder_v3 import BlossomDecoder, generate_parity_check_matrix

# Distance-5 repetition code: 5 data qubits, 4 parity checks.
check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]
H = generate_parity_check_matrix(check_to_qubits, 5)
syndrome = np.array([0, 1, 1, 0], dtype=np.uint8)

decoder = BlossomDecoder(check_to_qubits, n_qubits=5)
correction = np.asarray(decoder.decode(syndrome), dtype=np.uint8)
assert np.array_equal((H @ correction) % 2, syndrome)   # H c = s (mod 2)`,
  },
  {
    name: 'SparseBlossomDecoder',
    signature: 'SparseBlossomDecoder(check_to_qubits, n_qubits=None, edge_weights=None)',
    desc: 'Region-growing Sparse Blossom decoder with a radix heap: an event-driven matching path, faithful and near-optimal in its tested scope. Graphlike inputs only. decode_with_weights(syndrome, weights) decodes one syndrome with per-call weights.',
    parameters: [
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'For each check, the indices of the qubits it covers' },
      { name: 'n_qubits', type: 'int', default: 'None', desc: 'Number of data qubits' },
      { name: 'edge_weights', type: '-', default: 'None', desc: 'Optional matching weights, one per qubit' },
    ],
    example: `import numpy as np
from qector_decoder_v3 import SparseBlossomDecoder

check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]
syndrome = np.array([0, 1, 1, 0], dtype=np.uint8)

decoder = SparseBlossomDecoder(check_to_qubits, n_qubits=5)
correction = decoder.decode(syndrome)`,
  },
  {
    name: 'UnionFindDecoder / FastUnionFindDecoder',
    signature: `UnionFindDecoder(check_to_qubits, n_qubits=None, edge_weights=None)
FastUnionFindDecoder(check_to_qubits, n_qubits=None, edge_weights=None)`,
    desc: 'Union-Find decoding: cluster growth followed by spanning-forest peeling. Fast and approximate; graphlike inputs only. FastUnionFindDecoder is the variant with a zero-allocation hot path and reusable buffers. Both offer batch_decode(syndromes) and the flat-buffer methods decode_batch_flat and decode_batch_into_flat.',
    parameters: [
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'For each check, the indices of the qubits it covers' },
      { name: 'n_qubits', type: 'int', default: 'None', desc: 'Number of data qubits; inferred from the largest index when omitted' },
      { name: 'edge_weights', type: '-', default: 'None', desc: 'Optional matching weights, one per qubit, as log((1-p)/p); set_edge_weights(edge_weights) changes them later' },
    ],
    example: `import numpy as np
from qector_decoder_v3 import FastUnionFindDecoder, UnionFindDecoder

check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]
syndrome = np.array([0, 1, 1, 0], dtype=np.uint8)

for decoder_type in (UnionFindDecoder, FastUnionFindDecoder):
    decoder = decoder_type(check_to_qubits, n_qubits=5)
    correction = decoder.decode(syndrome)

# Batch: one row per shot.
syndromes = np.array([[0, 1, 1, 0], [1, 0, 0, 0]], dtype=np.uint8)
corrections = decoder.batch_decode(syndromes)`,
  },
  {
    name: 'BpOsdDecoder / BPOSDDecoder',
    signature: `BpOsdDecoder(
    H: Any,
    error_rate: float = 0.05,
    priors: Any = None,
    max_iter: int = 30,
    ms_scale: float = 1.0,
    osd_order: int = 0,
    bp_method: str = "sum_product",
    use_gpu: Any = None,
    max_latency_ms: float | None = None,
    damping: float = 0.0,
    osd_lambda: Any = None,
)
BPOSDDecoder(check_to_qubits, n_qubits=None, error_rate=0.1, bp_method=None, osd_order=None)`,
    desc: 'Belief propagation plus ordered-statistics decoding for general GF(2) check matrices: the route for hypergraph and qLDPC codes, where matching does not apply. BpOsdDecoder takes a dense parity-check matrix H; the table below lists its parameters. BPOSDDecoder is the native variant that takes check lists, with the different defaults shown in its signature.',
    parameters: [
      { name: 'H', type: 'Any', default: 'Required', desc: 'Dense GF(2) parity-check matrix, shape (n_checks, n_qubits)' },
      { name: 'error_rate', type: 'float', default: '0.05', desc: 'Physical error rate used for uniform priors' },
      { name: 'priors', type: 'Any', default: 'None', desc: 'Optional per-qubit prior probabilities; used instead of error_rate when given' },
      { name: 'max_iter', type: 'int', default: '30', desc: 'Maximum belief-propagation iterations' },
      { name: 'ms_scale', type: 'float', default: '1.0', desc: 'Scaling factor for min-sum BP' },
      { name: 'osd_order', type: 'int', default: '0', desc: 'OSD order; 0 is OSD-0' },
      { name: 'bp_method', type: 'str', default: '"sum_product"', desc: 'BP update rule: "sum_product", "min_sum" or "relay"' },
      { name: 'use_gpu', type: 'Any', default: 'None', desc: 'Batched-BP GPU policy for batch_decode: None chooses automatically, True or False forces it' },
      { name: 'max_latency_ms', type: 'float | None', default: 'None', desc: 'Optional wall-clock budget for one decode, in milliseconds' },
      { name: 'damping', type: 'float', default: '0.0', desc: 'Message damping factor' },
      { name: 'osd_lambda', type: 'Any', default: 'None', desc: 'Optional lambda for CS-OSD post-processing' },
    ],
    example: `import numpy as np
from qector_decoder_v3 import BpOsdDecoder, generate_parity_check_matrix

# Three weight-4 checks on 7 qubits. Qubit 6 is in all three checks,
# so this is not graphlike and matching does not apply.
check_to_qubits = [[0, 2, 4, 6], [1, 2, 5, 6], [3, 4, 5, 6]]
H = np.asarray(generate_parity_check_matrix(check_to_qubits, 7), dtype=np.uint8)

error = np.array([0, 0, 0, 0, 0, 0, 1], dtype=np.uint8)
syndrome = (H @ error) % 2

decoder = BpOsdDecoder(H, error_rate=0.05, osd_order=0)
correction = np.asarray(decoder.decode(syndrome), dtype=np.uint8)
assert np.array_equal((H @ correction) % 2, syndrome)   # H c = s (mod 2)`,
  },
  {
    name: 'BeliefMatching',
    signature: `BeliefMatching(matrices: _Matrices, max_iter: int = 30, bp_shortcut: bool = False)
BeliefMatching.from_numpy_h(H, error_rate: float = 0.05, max_iter: int = 20) -> BeliefMatching
BeliefMatching.from_detector_error_model(dem: Any, max_iter: int = 20) -> BeliefMatching
BeliefMatching.from_stim_circuit(circuit, max_iter: int = 20) -> BeliefMatching`,
    desc: 'Belief propagation followed by minimum-weight perfect matching: BP estimates the error probabilities and the matching stage uses them. Build instances with one of the three from_* constructors; the bare constructor takes an internal matrices object. Methods: decode, decode_batch, decode_correction and decode_observables.',
    parameters: [
      { name: 'matrices', type: '_Matrices', default: 'Required', desc: 'Internal matrices object; use a from_* constructor instead of building it by hand' },
      { name: 'max_iter', type: 'int', default: '30', desc: 'Maximum belief-propagation iterations (the from_* constructors default to 20)' },
      { name: 'bp_shortcut', type: 'bool', default: 'False', desc: 'When True, return the BP hard decision as soon as it reproduces the syndrome, skipping the matching step' },
      { name: 'error_rate', type: 'float', default: '0.05', desc: 'from_numpy_h only: physical error rate used for the priors' },
    ],
    example: `import numpy as np
from qector_decoder_v3 import BeliefMatching, generate_parity_check_matrix

check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]
H = np.asarray(generate_parity_check_matrix(check_to_qubits, 5), dtype=np.uint8)
syndrome = np.array([0, 1, 1, 0], dtype=np.uint8)

decoder = BeliefMatching.from_numpy_h(H, error_rate=0.05, max_iter=20)
correction = decoder.decode(syndrome)`,
  },
  {
    name: 'CPUBatchDecoder / BatchDecoder',
    signature: `CPUBatchDecoder(check_to_qubits, n_qubits=None)
BatchDecoder(check_to_qubits, n_qubits=None)`,
    desc: 'CPU batch decoders. CPUBatchDecoder is the SIMD-friendly batch decoder with pooled buffers: batch_decode(syndromes) decodes a batch and batch_decode_par(syndromes) is its parallel path. BatchDecoder is the Rayon parallel batch decoder: batch_decode(syndromes) and parallel_batch_decode(syndromes). Neither takes a thread-count argument.',
    parameters: [
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'For each check, the indices of the qubits it covers' },
      { name: 'n_qubits', type: 'int', default: 'None', desc: 'Number of data qubits' },
    ],
    example: `import numpy as np
from qector_decoder_v3 import BatchDecoder, CPUBatchDecoder

check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]
# One row per shot.
syndromes = np.array([[0, 1, 1, 0], [1, 0, 0, 0]], dtype=np.uint8)

decoder = CPUBatchDecoder(check_to_qubits, n_qubits=5)
corrections = decoder.batch_decode(syndromes)
corrections_par = decoder.batch_decode_par(syndromes)

rayon = BatchDecoder(check_to_qubits, n_qubits=5)
corrections_rayon = rayon.parallel_batch_decode(syndromes)`,
  },
  {
    name: 'CUDABatchDecoder / OpenCLBatchDecoder',
    signature: `CUDABatchDecoder(check_to_qubits, n_qubits=None, edge_weights=None)
OpenCLBatchDecoder(*a, **k)`,
    desc: 'GPU batch decoders for graphlike batches. CUDABatchDecoder is the NVIDIA CUDA path: check CUDABatchDecoder.is_available() or cuda_is_available() before constructing it. There is no batch-size argument; the batch is the array passed to batch_decode(syndromes). Since 1.0.1 every paid licence (Pro or Enterprise) unlocks GPU batch decoding. OpenCLBatchDecoder requires a source build with --features opencl: the published wheels do not include the OpenCL backend, which OpenCLBatchDecoder.is_available() and opencl_is_available() report.',
    parameters: [
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'CUDABatchDecoder: for each check, the indices of the qubits it covers' },
      { name: 'n_qubits', type: 'int', default: 'None', desc: 'CUDABatchDecoder: number of data qubits' },
      { name: 'edge_weights', type: '-', default: 'None', desc: 'CUDABatchDecoder: optional weights for weighted Union-Find growth' },
      { name: '*a, **k', type: '-', default: '-', desc: 'OpenCLBatchDecoder: the only signature the published wheels report; the backend needs a source build' },
    ],
    example: `import numpy as np
from qector_decoder_v3 import CUDABatchDecoder

check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]
# One row per shot.
syndromes = np.array([[0, 1, 1, 0], [1, 0, 0, 0]], dtype=np.uint8)

if CUDABatchDecoder.is_available():
    decoder = CUDABatchDecoder(check_to_qubits, n_qubits=5)
    corrections = decoder.batch_decode(syndromes)
else:
    print("CUDA batch decoding is not available on this machine")`,
  },
  {
    name: 'get_decoder / get_decoder_pool / clear_decoder_cache',
    signature: `get_decoder(checks_tuple: tuple[tuple[int, ...]], n_qubits: int, decoder_type: str = "union_find")
get_decoder_pool(checks_tuple: tuple[tuple[int, ...]], n_qubits: int, decoder_type: str = "union_find", n_workers: int | None = None)
clear_decoder_cache()`,
    desc: 'Cached decoder factories. get_decoder constructs a decoder once and returns the cached instance on later calls with the same arguments; get_decoder_pool does the same for a multi-process DecoderPool. clear_decoder_cache() empties both caches.',
    parameters: [
      { name: 'checks_tuple', type: 'tuple[tuple[int, ...]]', default: 'Required', desc: 'The checks as a hashable tuple of tuples: tuple(tuple(c) for c in check_to_qubits)' },
      { name: 'n_qubits', type: 'int', default: 'Required', desc: 'Number of data qubits' },
      { name: 'decoder_type', type: 'str', default: '"union_find"', desc: 'Which decoder to create' },
      { name: 'n_workers', type: 'int | None', default: 'None', desc: 'get_decoder_pool only: number of worker processes' },
    ],
    example: `import numpy as np
import qector_decoder_v3 as qd

checks = ((0, 1), (1, 2), (2, 3), (3, 4))   # hashable tuple of tuples
syndrome = np.array([0, 1, 1, 0], dtype=np.uint8)

decoder = qd.get_decoder(checks, 5, decoder_type="union_find")
correction = decoder.decode(syndrome)

# The second call returns the cached instance.
assert qd.get_decoder(checks, 5, decoder_type="union_find") is decoder
qd.clear_decoder_cache()`,
  },
  {
    name: 'decode_mmap',
    signature: `decode_mmap(
    syndrome_path: str,
    output_path: str,
    check_to_qubits,
    n_qubits: int,
    decoder_type: str = "cpu_batch",
    batch_size: int = 65536,
    n_shots: int | None = None,
    dtype: np.dtype = np.dtype("uint8"),
    verbose: bool = False,
)`,
    desc: 'Out-of-core batch decoding via memory-mapped arrays: the syndrome file is read and the correction file is written in chunks of batch_size shots, so neither has to fit in memory. It takes the check lists, not a decoder instance, and returns the output path.',
    parameters: [
      { name: 'syndrome_path', type: 'str', default: 'Required', desc: 'Path of the syndrome file: a raw array of shape (n_shots, n_checks)' },
      { name: 'output_path', type: 'str', default: 'Required', desc: 'Path of the correction file to write: a raw uint8 array of shape (n_shots, n_qubits)' },
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'For each check, the indices of the qubits it covers' },
      { name: 'n_qubits', type: 'int', default: 'Required', desc: 'Number of data qubits' },
      { name: 'decoder_type', type: 'str', default: '"cpu_batch"', desc: 'Which decoder to use' },
      { name: 'batch_size', type: 'int', default: '65536', desc: 'Number of syndromes decoded per chunk' },
      { name: 'n_shots', type: 'int | None', default: 'None', desc: 'Total number of shots; inferred from the file size when None' },
      { name: 'dtype', type: 'np.dtype', default: 'np.dtype("uint8")', desc: 'NumPy dtype of the syndrome file' },
      { name: 'verbose', type: 'bool', default: 'False', desc: 'Print progress information' },
    ],
    example: `import numpy as np
import qector_decoder_v3 as qd

check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]

# Raw uint8 file: one row of 4 syndrome bits per shot.
syndromes = np.array([[0, 1, 1, 0], [1, 0, 0, 0]], dtype=np.uint8)
syndromes.tofile("syndromes.bin")

out_path = qd.decode_mmap(
    "syndromes.bin", "corrections.bin", check_to_qubits, 5,
    decoder_type="cpu_batch", batch_size=65536,
)
corrections = np.fromfile(out_path, dtype=np.uint8).reshape(-1, 5)`,
  },
  {
    name: 'decode_with_diagnostics / DecodeResult',
    signature: `decode_with_diagnostics(code: Any, syndrome: Sequence[int], kind: str = "blossom", decoder: Any = None, logicals: np.ndarray | None = None) -> DecodeResult
DecodeResult.verify(H: np.ndarray) -> bool
DecodeResult.explain() -> str
DecodeResult.to_dict() -> dict
DecodeResult.to_json(indent: int = 2) -> str
DecodeResult.as_uint8() -> np.ndarray`,
    desc: 'Decodes one syndrome and returns a fully populated DecodeResult. Its fields are correction, syndrome, n_qubits, n_checks, weight, logical_flips, decode_seconds, backend, fallback, fallback_reason, syndrome_valid and metadata.',
    parameters: [
      { name: 'code', type: 'Any', default: 'Required', desc: 'The code being decoded: a code object from qector_decoder_v3.codes, or a (check_to_qubits, n_qubits) tuple' },
      { name: 'syndrome', type: 'Sequence[int]', default: 'Required', desc: 'Binary syndrome, one entry per check' },
      { name: 'kind', type: 'str', default: '"blossom"', desc: 'Decoder family to build when decoder is not given' },
      { name: 'decoder', type: 'Any', default: 'None', desc: 'Optional pre-built decoder to reuse' },
      { name: 'logicals', type: 'np.ndarray | None', default: 'None', desc: 'Optional logical-observable matrix, shape (n_logicals, n_qubits)' },
    ],
    example: `import numpy as np
import qector_decoder_v3 as qd

check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]
H = np.asarray(qd.generate_parity_check_matrix(check_to_qubits, 5), dtype=np.uint8)

result = qd.decode_with_diagnostics((check_to_qubits, 5), [0, 1, 1, 0], kind="blossom")
print(result.backend, result.fallback, result.syndrome_valid)
print(result.explain())
assert result.verify(H)          # H c = s (mod 2)
record = result.to_dict()`,
  },
  {
    name: 'Workbench',
    signature: `Workbench()
Workbench.load_stim(source: Any) -> dict
Workbench.load_dem(source: Any) -> dict
Workbench.run_benchmark(spec: dict, job: Job | None = None) -> dict
Workbench.submit_job(spec: dict) -> str
Workbench.wait(job_id: str, timeout: float | None = None) -> dict
Workbench.job_artifact(job_id: str) -> dict | None
Workbench.export_json(artifact: dict, path: str) -> str
Workbench.export_csv(artifact: dict, path: str) -> str
Workbench.export_pdf(artifact: dict, path: str) -> str`,
    desc: 'Controller for the Workbench workflow: load, benchmark, export. The constructor takes no arguments. run_benchmark(spec) runs a benchmark and returns its artifact; submit_job(spec) queues the same work and returns a job id for wait, get_job, list_jobs, cancel_job and job_artifact. detect_backends() and environment_snapshot() describe the machine. Benchmark figures are specific to your hardware and workload.',
    parameters: [
      { name: 'spec', type: 'dict', default: 'Required', desc: 'run_benchmark and submit_job: benchmark specification. Keys: code, distances, decoders, trials, warmup, error_rate, source' },
      { name: 'job', type: 'Job | None', default: 'None', desc: 'run_benchmark only: job handle supplied by the job queue' },
      { name: 'timeout', type: 'float | None', default: 'None', desc: 'wait only: seconds to wait before returning' },
    ],
    example: `import qector_decoder_v3 as qd

wb = qd.Workbench()
print(wb.detect_backends())

spec = {
    "code": "repetition",
    "distances": [3, 5],
    "decoders": ["union_find", "blossom"],
    "trials": 200,
    "warmup": 10,
    "error_rate": 0.05,
}
artifact = wb.run_benchmark(spec)
wb.export_json(artifact, "benchmark.json")
wb.shutdown()`,
  },
  {
    name: 'from_circuit (Stim)',
    signature: 'from_circuit(circuit, decoder_type="blossom", **kwargs)',
    desc: 'Builds a decoder from a Stim circuit in one call. The stim_compat and sinter_compat modules hold the Stim conversion layer and the Sinter decoders, and the pymatching module provides a PyMatching-style Matching class. Getting Started has tested Stim and Sinter scripts.',
    parameters: [
      { name: 'circuit', type: 'stim.Circuit', default: 'Required', desc: 'The Stim circuit to decode' },
      { name: 'decoder_type', type: 'str', default: '"blossom"', desc: 'Decoder to build: "blossom", "sparse_blossom", "bposd", "belief_match", "colour_code" or "auto"' },
      { name: '**kwargs', type: '-', default: '-', desc: 'Passed to the decoder constructor' },
    ],
    example: `import stim
import qector_decoder_v3 as qd

circuit = stim.Circuit.generated(
    "surface_code:rotated_memory_z", distance=3, rounds=3,
    after_clifford_depolarization=0.005,
)
decoder = qd.from_circuit(circuit, decoder_type="blossom")`,
  },
  {
    name: 'Licence helpers',
    signature: `verify_license_token(token: str, customer_email: str = "") -> bool
set_license_key(key: str) -> None
set_license_key_file(path) -> None
get_license_info() -> dict`,
    desc: 'Offline licensing. verify_license_token checks the Ed25519 signature of a licence token with no network call and returns a bool. set_license_key and set_license_key_file activate a key for tier enforcement, and get_license_info returns the active licence information.',
    parameters: [
      { name: 'token', type: 'str', default: 'Required', desc: 'verify_license_token: the licence token to verify' },
      { name: 'customer_email', type: 'str', default: '""', desc: 'verify_license_token: optional customer e-mail' },
      { name: 'key', type: 'str', default: 'Required', desc: 'set_license_key: the licence key to activate' },
      { name: 'path', type: '-', default: 'Required', desc: 'set_license_key_file: path of a file holding the licence key' },
    ],
    example: `import qector_decoder_v3 as qd

print(qd.get_license_info()["tier"])   # "Community" until you activate a licence

# Offline signature check of a licence token; returns a bool.
is_valid = qd.verify_license_token("paste-your-licence-token-here")

# Activate a licence key for tier enforcement, from a string or a file:
# qd.set_license_key("paste-your-licence-key-here")
# qd.set_license_key_file("/path/to/licence.key")`,
  },
  {
    name: 'HybridCascadeDecoder',
    signature: 'HybridCascadeDecoder(check_to_qubits, n_qubits=None, edge_weights=None, max_accept_weight=None, escalation=None, error_rate=None)',
    desc: 'Experimental hybrid cascading decoder: a Union-Find pre-filter with escalation to Blossom or BP-OSD. Graphlike inputs. decode_timed and batch_decode_timed take a max_latency_ms deadline (default 10.0).',
    parameters: [
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'For each check, the indices of the qubits it covers' },
      { name: 'n_qubits', type: 'int', default: 'None', desc: 'Number of data qubits; inferred when omitted' },
      { name: 'edge_weights', type: '-', default: 'None', desc: 'Optional per-qubit weights, used by the Blossom escalation' },
      { name: 'max_accept_weight', type: '-', default: 'None', desc: 'Optional cap on the weight of a pre-filter correction; heavier results escalate' },
      { name: 'escalation', type: '-', default: 'None', desc: 'Escalation decoder: "blossom" or "bposd"' },
      { name: 'error_rate', type: '-', default: 'None', desc: 'Physical error rate for the BP-OSD escalation' },
    ],
    example: `import numpy as np
from qector_decoder_v3 import HybridCascadeDecoder

check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]
syndrome = np.array([0, 1, 1, 0], dtype=np.uint8)

decoder = HybridCascadeDecoder(check_to_qubits, n_qubits=5)
correction = decoder.decode(syndrome)
timed = decoder.decode_timed(syndrome, max_latency_ms=10.0)`,
  },
  {
    name: 'HybridDecoder',
    signature: 'HybridDecoder(check_to_qubits, n_qubits=None, check_positions=None, check_types=None, base_weights=None, gnn_hidden_size=64, gnn_n_layers=3)',
    desc: 'Experimental hybrid decoder: a GNN pre-decoder that feeds SparseBlossom. decode_standard(syndrome) and decode_hybrid(syndrome) select the path explicitly; train, save_weights and load_weights manage the GNN.',
    parameters: [
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'For each check, the indices of the qubits it covers' },
      { name: 'n_qubits', type: 'int', default: 'None', desc: 'Number of data qubits' },
      { name: 'check_positions', type: '-', default: 'None', desc: 'Optional check positions for the detector graph' },
      { name: 'check_types', type: '-', default: 'None', desc: 'Optional check types for the detector graph' },
      { name: 'base_weights', type: '-', default: 'None', desc: 'Optional base weights for the detector graph' },
      { name: 'gnn_hidden_size', type: 'int', default: '64', desc: 'Hidden size of the GNN' },
      { name: 'gnn_n_layers', type: 'int', default: '3', desc: 'Number of GNN layers' },
    ],
    example: `import numpy as np
from qector_decoder_v3 import HybridDecoder

check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]
syndrome = np.array([0, 1, 1, 0], dtype=np.uint8)

decoder = HybridDecoder(check_to_qubits, n_qubits=5)
correction = decoder.decode_standard(syndrome)`,
  },
  {
    name: 'LookupTableDecoder / PredecodedDecoder',
    signature: `LookupTableDecoder(check_to_qubits, n_qubits=None)
PredecodedDecoder(check_to_qubits, n_qubits=None, backend: str = "blossom")`,
    desc: 'Research decoders. LookupTableDecoder is an exact lookup-table decoder for small codes with a Union-Find fallback outside its stored entries; build_table(max_entries) fills the table. PredecodedDecoder runs a local-matching predecoder and hands the residual to an exact or fast decoder chosen with backend.',
    parameters: [
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'For each check, the indices of the qubits it covers' },
      { name: 'n_qubits', type: 'int', default: 'None', desc: 'Number of data qubits' },
      { name: 'backend', type: 'str', default: '"blossom"', desc: 'PredecodedDecoder only: decoder used for the residual' },
    ],
    example: `import numpy as np
from qector_decoder_v3 import LookupTableDecoder, PredecodedDecoder

check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]
syndrome = np.array([0, 1, 1, 0], dtype=np.uint8)

lookup = LookupTableDecoder(check_to_qubits, n_qubits=5)
correction = lookup.decode(syndrome)

predecoded = PredecodedDecoder(check_to_qubits, n_qubits=5, backend="blossom")
correction = predecoded.decode(syndrome)`,
  },
  {
    name: 'ColourCodeDecoder',
    signature: `ColourCodeDecoder(dem: Any, max_iter: int = 30, osd_order: int = 0, method: str = "bposd")
ColourCodeDecoder.from_stim_circuit(circuit: Any, max_iter: int = 30, osd_order: int = 0) -> ColourCodeDecoder
ColourCodeDecoder.from_detector_error_model(dem: Any, max_iter: int = 30, osd_order: int = 0) -> ColourCodeDecoder`,
    desc: 'Research colour-code decoder: BP-OSD over the undecomposed hypergraph detector error model. Colour codes are not graphlike, so matching-based decoders do not apply. Methods: decode, decode_batch, decode_correction and decode_observables.',
    parameters: [
      { name: 'dem', type: 'Any', default: 'Required', desc: 'Detector error model, not decomposed' },
      { name: 'max_iter', type: 'int', default: '30', desc: 'BP iterations before OSD post-processing' },
      { name: 'osd_order', type: 'int', default: '0', desc: 'OSD order; 0 is OSD-0' },
      { name: 'method', type: 'str', default: '"bposd"', desc: '"bposd", or the opt-in "cluster_bposd"' },
      { name: 'circuit', type: 'Any', default: 'Required', desc: 'from_stim_circuit only: the Stim circuit; the detector error model is derived without decomposition' },
    ],
    example: `import stim
from qector_decoder_v3 import ColourCodeDecoder

circuit = stim.Circuit.generated(
    "color_code:memory_xyz", distance=3, rounds=2,
    after_clifford_depolarization=0.001,
)
decoder = ColourCodeDecoder.from_stim_circuit(circuit, max_iter=30, osd_order=0)

dets, obs = circuit.compile_detector_sampler(seed=7).sample(100, separate_observables=True)
predicted = decoder.decode_observables(dets[0].astype("uint8"))`,
  },
  {
    name: 'TwoStageDecoder',
    signature: 'TwoStageDecoder(check_to_qubits, check_types, n_qubits=None, x_decoder="blossom", z_decoder="blossom")',
    desc: 'Research decoder: correlated two-stage matching for CSS codes. It decodes the X-type checks first, feeds the result into the Z-type syndrome, then decodes that. Faithful when both sector stages are faithful.',
    parameters: [
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'All checks: the X checks, then the Z checks' },
      { name: 'check_types', type: 'list[bool]', default: 'Required', desc: 'One entry per check: True for an X check, False for a Z check' },
      { name: 'n_qubits', type: 'int', default: 'None', desc: 'Number of data qubits; inferred when omitted' },
      { name: 'x_decoder', type: 'str', default: '"blossom"', desc: 'Decoder for the X stage' },
      { name: 'z_decoder', type: 'str', default: '"blossom"', desc: 'Decoder for the Z stage' },
    ],
    example: `import numpy as np
from qector_decoder_v3 import TwoStageDecoder

# Two X checks, then two Z checks, on 3 qubits.
check_to_qubits = [[0, 1], [1, 2], [0, 1], [1, 2]]
check_types = [True, True, False, False]
syndrome = np.array([1, 0, 0, 0], dtype=np.uint8)

decoder = TwoStageDecoder(check_to_qubits, check_types, n_qubits=3)
correction = decoder.decode(syndrome)`,
  },
  {
    name: 'AmbiguityClusterDecoder',
    signature: 'AmbiguityClusterDecoder(check_to_qubits, n_qubits=None, error_rate=0.05, ambig_threshold=0.5, max_cluster_size=12)',
    desc: 'Research decoder for qLDPC codes: belief propagation, then exact decoding of the ambiguous qubits in bounded clusters.',
    parameters: [
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'For each check, the indices of the qubits it covers' },
      { name: 'n_qubits', type: 'int', default: 'None', desc: 'Number of data qubits; inferred when omitted' },
      { name: 'error_rate', type: 'float', default: '0.05', desc: 'Physical error rate for the BP prior' },
      { name: 'ambig_threshold', type: 'float', default: '0.5', desc: 'Threshold below which a qubit counts as ambiguous' },
      { name: 'max_cluster_size', type: 'int', default: '12', desc: 'Largest cluster solved exactly' },
    ],
    example: `import numpy as np
from qector_decoder_v3 import AmbiguityClusterDecoder

# Three weight-4 checks on 7 qubits; qubit 6 is in all three (not graphlike).
check_to_qubits = [[0, 2, 4, 6], [1, 2, 5, 6], [3, 4, 5, 6]]
syndrome = np.array([1, 1, 1], dtype=np.uint8)

decoder = AmbiguityClusterDecoder(check_to_qubits, n_qubits=7, error_rate=0.05)
correction = decoder.decode(syndrome)`,
  },
  {
    name: 'GNNBeliefMatcher',
    signature: `GNNBeliefMatcher(check_to_qubits, n_qubits=None, *, gnn=None, hidden_size: int = 32, n_layers: int = 2, train_samples: int = 0, error_rate: float = 0.05, train_epochs: int = 3, seed=None)
decode_with_gnn(check_to_qubits, n_qubits, syndrome, **kwargs) -> np.ndarray`,
    desc: 'Research-stage GNN-guided minimum-weight perfect matching: a graph neural network predicts weights from the syndrome and matching uses them. Not validated for production use. decode_with_gnn is the one-shot form.',
    parameters: [
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'For each check, the indices of the qubits it covers (graphlike)' },
      { name: 'n_qubits', type: 'int', default: 'None', desc: 'Number of data qubits; inferred when omitted' },
      { name: 'gnn', type: '-', default: 'None', desc: 'Keyword-only: optional pre-configured GNN; a GNNPredecoder is built when omitted' },
      { name: 'hidden_size', type: 'int', default: '32', desc: 'Keyword-only: hidden size of the default GNN' },
      { name: 'n_layers', type: 'int', default: '2', desc: 'Keyword-only: number of layers of the default GNN' },
      { name: 'train_samples', type: 'int', default: '0', desc: 'Keyword-only: when above 0, train the GNN on that many synthetic samples before first use' },
      { name: 'error_rate', type: 'float', default: '0.05', desc: 'Keyword-only: noise level for the optional training' },
      { name: 'train_epochs', type: 'int', default: '3', desc: 'Keyword-only: epochs for the optional training' },
      { name: 'seed', type: '-', default: 'None', desc: 'Keyword-only: random seed for the optional training' },
    ],
    example: `import numpy as np
from qector_decoder_v3 import GNNBeliefMatcher, decode_with_gnn

check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]
syndrome = np.array([0, 1, 1, 0], dtype=np.uint8)

matcher = GNNBeliefMatcher(check_to_qubits, n_qubits=5, hidden_size=32, n_layers=2, seed=0)
correction = matcher.decode(syndrome)

# One-shot form.
correction = decode_with_gnn(check_to_qubits, 5, syndrome)`,
  },
];

/** First identifier of an entry name, used to name its example file. */
function exampleFilename(name: string): string {
  const first = name.match(/[A-Za-z_][A-Za-z0-9_]*/)?.[0] ?? 'example';
  return `${first.toLowerCase()}_usage.py`;
}

export default function TechnicalReference() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedClass, setExpandedClass] = useState<string | null>('BlossomDecoder');
  // Reveals the details of the selected entry (see the keyed div below); the
  // hook does nothing for visitors who ask for reduced motion.
  const addRef = useScrollReveal({ y: 10, duration: 300 });

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleClass = (name: string) => {
    setExpandedClass(expandedClass === name ? null : name);
  };

  return (
    <>
      <SEO
        title="Technical Reference · QECTOR"
        description="API reference, decoder parameters, and technical documentation for QECTOR quantum error correction decoder."
      />

      {/* Hero */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="eyebrow-pill mb-6">
            17 Decoder Configurations · Stim DEM · Generated API Index
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"><NeuralReveal text="Technical Reference" className="text-4xl md:text-6xl font-extrabold" /></h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            API overview for QECTOR's decoders. The guided entries below cover the most used classes and functions;
            their signatures and defaults follow the API index at the end of this page, which is generated from the
            published {PYPI_VERSION} package.
          </p>
        </div>
      </section>

      {/* API Explorer section */}
      <section className="section-padding pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Search bar */}
          <div className="relative mb-8 max-w-md mx-auto md:mx-0">
            <label htmlFor="decoder-search" className="sr-only">Search classes and functions</label>
            <input
              id="decoder-search"
              type="search"
              placeholder="Search classes and functions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-3 bg-surface/50 border border-gridline rounded-xl text-primary text-sm focus:border-cyan-300/50 focus-visible:ring-2 focus-visible:ring-cyan-300 transition-colors"
            />
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-3.5" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* List column */}
            <div className="lg:col-span-4 space-y-2">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Classes &amp; Functions
              </div>
              <div className="space-y-1">
                {filteredClasses.map((item) => (
                  <button
                    key={item.name}
                    aria-expanded={expandedClass === item.name}
                    onClick={() => toggleClass(item.name)}
                    className={`w-full flex items-center justify-between gap-2 p-3.5 rounded-xl border text-sm text-left transition-all duration-200 ${
                      expandedClass === item.name
                        ? 'bg-cyan-300/10 text-cyan-300 border-cyan-300/20 shadow-xs'
                        : 'bg-surface/20 text-secondary hover:text-primary hover:bg-surface/40 border-gridline/50'
                    }`}
                  >
                    <span className="font-mono font-semibold min-w-0 [overflow-wrap:anywhere]">{item.name}</span>
                    {expandedClass === item.name ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />}
                  </button>
                ))}
                {filteredClasses.length === 0 && (
                  <div className="p-4 text-center text-xs text-muted-foreground italic border border-dashed border-gridline rounded-xl">
                    No entries matching "{searchTerm}"
                  </div>
                )}
              </div>
            </div>

            {/* Details column */}
            <div className="lg:col-span-8 min-w-0">
              {expandedClass ? (
                (() => {
                  const active = classes.find((c) => c.name === expandedClass);
                  if (!active) return null;
                  return (
                    // Layout reveals .card-surface blocks as they are added to the page.
                    // Keying this wrapper and the placeholder makes React mount fresh
                    // nodes when the panel is closed and reopened, instead of recycling
                    // the placeholder's div, so the card always arrives as a new block.
                    // The inner div is keyed by entry and remounts on every selection,
                    // which lets the hook replay its short reveal.
                    <div key="details">
                    <div className="card-surface bg-surface/10">
                    <div key={active.name} ref={(el) => addRef(el)} className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-primary font-mono [overflow-wrap:anywhere]">{active.name}</h2>
                        <p className="text-secondary text-sm mt-3 leading-relaxed">{active.desc}</p>
                      </div>

                      {/* Signature block */}
                      <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5" />
                          Signature
                        </div>
                        <CodeBlock
                          code={active.signature}
                          language="python"
                          className="!my-0 bg-void/70"
                        />
                      </div>

                      {/* Parameters Table */}
                      <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          Parameters
                        </div>
                        <div className="overflow-x-auto border border-gridline rounded-xl" tabIndex={0} role="region" aria-label="Parameters">
                          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                            <thead>
                              <tr className="bg-surface/50 border-b border-gridline text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                                <th className="p-3">Name</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Default</th>
                                <th className="p-3">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gridline">
                              {active.parameters.map((p) => (
                                <tr key={p.name} className="hover:bg-surface/20 transition-colors">
                                  <td className="p-3 font-mono font-semibold text-primary">{p.name}</td>
                                  <td className="p-3 font-mono text-xs text-secondary">{p.type}</td>
                                  <td className="p-3 font-mono text-xs text-cyan-300">{p.default}</td>
                                  <td className="p-3 text-xs text-secondary leading-relaxed">{p.desc}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-muted-foreground text-xs mt-2">
                          Types come from the package signature where it is annotated, otherwise from documented usage;
                          &quot;-&quot; means neither states one.
                        </p>
                      </div>

                      {/* Code Example */}
                      <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Usage Example</div>
                        <CodeBlock
                          code={active.example}
                          language="python"
                          filename={exampleFilename(active.name)}
                        />
                      </div>
                    </div>
                    </div>
                    </div>
                  );
                })()
              ) : (
                <div key="placeholder" className="h-full flex items-center justify-center border border-dashed border-gridline rounded-2xl p-12 text-center text-muted-foreground italic text-sm">
                  Select an entry from the list to inspect its parameters and example usage.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <ApiIndex />
    </>
  );
}
