export interface BlogPostMeta {
  id: string;
  filename: string;
  title: string;
  description: string;
  date: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    id: "01QecFoundations",
    filename: "01_qec_foundations_syndrome_faithfulness.md",
    title: "QEC Foundations: Syndrome Faithfulness",
    description: "Deep dive into syndrome faithfulness, logical error criteria, and the mathematical invariant underpinning QECTOR.",
    date: "August 6, 2026"
  },
  {
    id: "02BlossomMwpmExact",
    filename: "02_blossom_mwpm_exact.md",
    title: "Blossom MWPM Exact",
    description: "Engineering an O(N³) Exact Decoder in Rust. Exploring the Blossom algorithm and exact matching.",
    date: "August 6, 2026"
  },
  {
    id: "03SparseBlossomEventDriven",
    filename: "03_sparse_blossom_event_driven.md",
    title: "Sparse Blossom Event Driven",
    description: "Event-driven region growth and radix heap optimization for Sparse Blossom achieving O(E log V).",
    date: "August 6, 2026"
  },
  {
    id: "04FastUnionFind",
    filename: "04_fast_union_find_uf01.md",
    title: "Fast Union Find UF-01",
    description: "Zero-allocation rank-based Union-Find decoding for sub-microsecond latency.",
    date: "August 6, 2026"
  },
  {
    id: "05BpOsdQldpc",
    filename: "05_bp_osd_qldpc.md",
    title: "BP-OSD for qLDPC",
    description: "Exact and Relay BP-OSD implementations for decoding high-rate quantum LDPC codes.",
    date: "August 6, 2026"
  },
  {
    id: "06AmbiguityGnnNeural",
    filename: "06_ambiguity_gnn_neural.md",
    title: "Ambiguity GNN & Neural Predecoders",
    description: "Leveraging Graph Neural Networks for LLR reweighting and ambiguity clustering in decoding.",
    date: "August 6, 2026"
  },
  {
    id: "07SpaceTimeDecoder",
    filename: "07_space_time_decoder.md",
    title: "Space-Time Decoder",
    description: "Simultaneous spatial and measurement error resolution over multiple syndrome rounds.",
    date: "August 6, 2026"
  },
  {
    id: "08AutoDecoderCascade",
    filename: "08_autodecoder_cascade.md",
    title: "AutoDecoder & Cascade",
    description: "Dynamic O(1) dispatch and cascade pre-filtering for bridging MWPM accuracy and UF speed.",
    date: "August 6, 2026"
  },
  {
    id: "09GpuAcceleration",
    filename: "09_gpu_acceleration.md",
    title: "GPU Acceleration (CUDA/OpenCL)",
    description: "Achieving >48 million shots/s with bit-identical GPU batch execution.",
    date: "August 6, 2026"
  },
  {
    id: "10BenchmarksArchitecture",
    filename: "10_benchmarks_architecture.md",
    title: "Empirical Benchmarks & Architecture",
    description: "Thresholds, latency scaling, and the industrial architecture unifying all 15 backends.",
    date: "August 6, 2026"
  }
];
