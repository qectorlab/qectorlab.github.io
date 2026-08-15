export interface BlogPostMeta {
  id: string;
  filename: string;
  title: string;
  description: string;
  category: string;
  date: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    id: "01QecFoundations",
    filename: "01_qec_foundations_syndrome_faithfulness.md",
    title: "Syndrome Faithfulness: The Decoder Contract",
    description: "The GF(2) invariant Hc=s, logical cosets, degeneracy, and graphlike eligibility explained from first principles.",
    category: "Foundations",
    date: "August 2026"
  },
  {
    id: "02BlossomMwpmExact",
    filename: "02_blossom_mwpm_exact.md",
    title: "Exact Blossom Decoding for Graphlike QEC",
    description: "How weighted MWPM, Edmonds' primal-dual view, path boundaries, and sparse candidate escalation fit together.",
    category: "Decoder Algorithms",
    date: "August 2026"
  },
  {
    id: "03SparseBlossomEventDriven",
    filename: "03_sparse_blossom_event_driven.md",
    title: "Sparse Blossom and Event-Driven Growth",
    description: "Region states, collision times, tight edges, radix heaps, and the tested scope of Sparse Blossom.",
    category: "Decoder Algorithms",
    date: "August 2026"
  },
  {
    id: "04FastUnionFind",
    filename: "04_fast_union_find_uf01.md",
    title: "UF-01: Parity, Peeling, and Graphlike Decoding",
    description: "Cluster parity, spanning-forest peeling, weighted growth, zero-allocation structure, and domain boundaries.",
    category: "Decoder Algorithms",
    date: "August 2026"
  },
  {
    id: "05BpOsdQldpc",
    filename: "05_bp_osd_qldpc.md",
    title: "BP-OSD for qLDPC Hypergraphs",
    description: "Log-domain belief propagation, ordered statistics, residual GF(2) solving, and faithful non-graphlike decoding.",
    category: "qLDPC and AI",
    date: "August 2026"
  },
  {
    id: "06AmbiguityGnnNeural",
    filename: "06_ambiguity_gnn_neural.md",
    title: "Ambiguity Clustering and Learned Predecoders",
    description: "Freeze confident qubits, solve ambiguous components, and add learned priors without moving the correctness proof.",
    category: "qLDPC and AI",
    date: "August 2026"
  },
  {
    id: "07SpaceTimeDecoder",
    filename: "07_space_time_decoder.md",
    title: "Space-Time Decoding with Noisy Measurements",
    description: "Detector differencing, temporal and spatial weights, measurement glitches, and streaming scope.",
    category: "Multi-Round",
    date: "August 2026"
  },
  {
    id: "08AutoDecoderCascade",
    filename: "08_autodecoder_cascade.md",
    title: "Routing, Cascades, and Two-Stage CSS Decoding",
    description: "Structural backend eligibility, fallback verification, hybrid acceptance, and CSS sector feedforward.",
    category: "Orchestration",
    date: "August 2026"
  },
  {
    id: "09GpuAcceleration",
    filename: "09_gpu_acceleration.md",
    title: "GPU Batch Decoding and Tested Bit Identity",
    description: "Per-shot GPU state isolation, deterministic Union-Find, scoped CPU/GPU identity, and deployment gates.",
    category: "Systems",
    date: "August 2026"
  },
  {
    id: "10BenchmarksArchitecture",
    filename: "10_benchmarks_architecture.md",
    title: "Evidence-First QEC Architecture and Benchmarks",
    description: "The v1.0.0 backend map, logical scoring, Wilson intervals, metadata, release gates, and claim boundaries.",
    category: "Evidence",
    date: "August 2026"
  },
  {
    id: "11SteaneWorkedDecode",
    filename: "11_steane_worked_decode.md",
    title: "A Hand-Worked Steane Decode",
    description: "Compute a Steane syndrome by hand and see why stabilizer cosets matter more than raw correction equality.",
    category: "Foundations",
    date: "August 2026"
  },
  {
    id: "12RotatedSurfaceD3",
    filename: "12_rotated_surface_d3.md",
    title: "Rotated Surface Code d=3",
    description: "Nine data qubits, boundaries, graphlike eligibility, logical strings, and a complete structural audit.",
    category: "Foundations",
    date: "August 2026"
  },
  {
    id: "13DemPipeline",
    filename: "13_dem_pipeline.md",
    title: "Detector Error Models from Faults to Graphs",
    description: "Parse DEMs, classify hyperedges, collapse parallel mechanisms, set weights, and preserve observables.",
    category: "Noise Models",
    date: "August 2026"
  },
  {
    id: "14WeightedDecoding",
    filename: "14_weighted_decoding.md",
    title: "Weighted Decoding and Likelihood Priors",
    description: "Why log((1-p)/p) belongs in the graph and how matching, Union-Find, and space-time paths use weights.",
    category: "Noise Models",
    date: "August 2026"
  },
  {
    id: "15LogicalErrorRates",
    filename: "15_logical_error_rates.md",
    title: "Logical Error Rates Without the Wrong Metric",
    description: "Score observables, compute Wilson intervals, keep noise models comparable, and report reproducible LERs.",
    category: "Evidence",
    date: "August 2026"
  },
  {
    id: "16DecoderSelection",
    filename: "16_decoder_selection.md",
    title: "Choosing a Decoder From the Matrix",
    description: "A practical decision guide for graphlike, qLDPC, space-time, streaming, CSS, and batch workloads.",
    category: "Orchestration",
    date: "August 2026"
  },
  {
    id: "17ReproducibleBenchmarks",
    filename: "17_reproducible_benchmarks.md",
    title: "Reproducible QEC Benchmarks",
    description: "Separate correctness from performance and make every benchmark claim traceable to an artifact and hash.",
    category: "Evidence",
    date: "August 2026"
  },
  {
    id: "18RustPyo3Architecture",
    filename: "18_rust_pyo3_architecture.md",
    title: "Rust, PyO3, and QEC Memory Discipline",
    description: "FFI buffers, selective repacking, GIL release, Rayon worker state, and memory metrics at the Python boundary.",
    category: "Systems",
    date: "August 2026"
  },
  {
    id: "19ReleaseLicensing",
    filename: "19_release_licensing.md",
    title: "Shipping a QEC Decoder Responsibly",
    description: "API stability, wheels, offline licensing, release gates, and the difference between local and network deployment.",
    category: "Deployment",
    date: "August 2026"
  },
  {
    id: "20EcosystemIntegration",
    filename: "20_ecosystem_integration.md",
    title: "Stim, Sinter, PyMatching, and Qiskit Integration",
    description: "Connect QECTOR to common quantum software workflows while preserving detector, observable, and noise contracts.",
    category: "Ecosystem",
    date: "August 2026"
  }
];
