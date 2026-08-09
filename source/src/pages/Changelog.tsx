import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import ChangelogEntry from '../components/ChangelogEntry';

export default function Changelog() {
  return (
    <>
      <SEO title="Changelog · QECTOR" description="Version history for QECTOR Decoder v3. PyPI release train, feature additions, and validation milestones." />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
            Latest: v1.0.0 Decoder (first stable release, live from PyPI RSS) · Workbench GUI (current)
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"><NeuralReveal text="Changelog" className="text-4xl md:text-6xl font-extrabold" /></h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Version history for QECTOR Decoder v3. Exact release dates on{' '}
            <a href="https://pypi.org/project/qector-decoder-v3/#history" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">PyPI</a>. All artifacts and validation on GitHub.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto pl-8 ml-2 sm:ml-6 md:ml-8 relative space-y-12 border-l border-gridline/60">
          {/* Vertical neon timeline line */}
          <div className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-300 via-gold-400/30 to-transparent shadow-[0_0_8px_rgba(103,232,249,0.5)]" />

          {/* Latest Decoder v1.0.0 */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-cyan-300 border-4 border-void shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
            <ChangelogEntry
              latest
              version="v1.0.0 · 2026-08-06 (first stable release)"
              note={
                <>
                  Exact release dates on{' '}
                  <a href="https://pypi.org/project/qector-decoder-v3/#history" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">PyPI</a>.
                </>
              }
              items={[
                'First stable (v1) release: semantic-versioning frozen; the public API is governed by documented stability tiers (Stable / Workload-sensitive / Experimental / Internal detail)',
                'Ecosystem entry points: five Sinter decoders (qector_blossom, qector_belief, qector_unionfind, and more) and a qiskit-qec plugin registered: sinter.collect() works without custom_decoders=',
                'New decoder families: AmbiguityClusterDecoder, TwoStageDecoder, ColourCodeDecoder (opt-in method="cluster_bposd")',
                'Relay-BP layered serial BP schedule (bp_method="relay"), CS-OSD(lambda, w) with configurable osd_lambda, and LLR message damping in BP-OSD',
                'Weighted Union-Find on GPU: CUDABatchDecoder / OpenCLBatchDecoder accept edge_weights, plus precision="f64" double-precision growth',
                'qector decode / qector bench / qector serve CLI and qector-doctor (environment diagnostic)',
                'pymatching submodule shim (from qector_decoder_v3.pymatching import Matching); DemModel.make_decoder covers all native families',
                'SparseBlossomDecoder hot path zero-allocation (thread-local SbScratch); six Rust panic-to-abort paths removed; licence hardening (v2 tokens with tier + expiry)',
                'Binary wheels (cp39–cp313, Windows amd64 / Linux x86_64 / macOS 11.0+ arm64) with PyPI Trusted Publishing + Sigstore; no sdist',
                'Official user manual v1.0.0 (DOI 10.5281/zenodo.21363016)',
                'Free QECTOR Workbench (current): Comprehensive MCP tools, 16 decoders, 10 code families, including qLDPC and colour codes, visual circuit builder, and a self/auto-debug layer verifying H·c = s on every decode',
                'No universal benchmark figures are published on the site; qector bench ships with the package for measuring on your own hardware',
              ]}
            />
          </div>

          {/* v0.7.1 */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-gold-400 border-4 border-void shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <ChangelogEntry
              version="v0.7.1 · 2026-08-04"
              items={[
                'CLI qector decode crash fix (nonexistent import)',
                'MCP ping implemented; MCP no longer responds to notifications',
              ]}
            />
          </div>

          {/* v0.7.0 */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-gold-400 border-4 border-void shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <ChangelogEntry
              version="v0.7.0 · 2026-07-24"
              items={[
                'Production release with benchmark suite, hyper saturation suite, and Stripe live integration',
                'MCP Server integration (MCP stdio, JSON-RPC 2.0) exposing 13 verified tools',
                'Added 200-status SPA route shells for all application routes and /success checkout flow',
              ]}
            />
          </div>

          {/* v0.6.8 */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-gold-400 border-4 border-void shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <ChangelogEntry
              version="v0.6.8 · 2026-07-22"
              items={[
                'Fixed _guard() handling for gated research decoders; public wheels expose HybridDecoder (UF + Blossom routing)',
                'Website updated with validation data',
              ]}
            />
          </div>

          {/* v0.5.7 */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-gold-400 border-4 border-void shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <ChangelogEntry
              version="v0.5.7 · 2026"
              items={[
                'Sigstore attestation for PyPI wheels',
                'Performance regression fixes in BP-OSD path',
                'Documentation updates for GPU batch decoder',
                'Validation report refresh with latest Stim compatibility',
              ]}
            />
          </div>

          {/* v0.5.6 */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-gold-400 border-4 border-void shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <ChangelogEntry
              version="v0.5.6 - 2026"
              items={[
                'Union-Find decoder: near-linear time path compression',
                'CUDA batch decoder: improved memory layout for large batches',
                'Added integration tests for Stim 1.15+ compatibility',
                'Fixed edge case in adaptive-k MWPM for d=15',
              ]}
            />
          </div>

          {/* v0.5.5 */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-gridline border-4 border-void" />
            <ChangelogEntry
              version="v0.5.5 - 2026"
              items={[
                'Belief-Matching: configurable BP iteration counts',
                'BP-OSD: added ordered statistics decoding for qLDPC',
                'OpenCL backend: byte-for-byte CPU parity verified',
                'CLI: added batch decode command with progress bar',
              ]}
            />
          </div>

          {/* v0.5.4 */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-gridline border-4 border-void" />
            <ChangelogEntry
              version="v0.5.4 - 2025-2026"
              items={[
                'GPU batch decoder: native CUDA implementation',
                'Benchmark suite: head-to-head PyMatching comparison scripts',
                'Validation artifacts: GitHub publication workflow',
              ]}
            />
          </div>

          {/* v0.5.3 */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-gridline border-4 border-void" />
            <ChangelogEntry
              version="v0.5.3 - 2025"
              items={[
                'Initial public PyPI release',
                'MWPM Blossom: adaptive-k exact matching',
                'Belief-Matching: BP + reweighted MWPM',
                'Surface code support: distances 3-15 verified',
              ]}
            />
          </div>

          {/* Pre-v0.5.x */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-gridline border-4 border-void" />
            <ChangelogEntry
              version="Pre-v0.5.x - 2024-2025"
              items={[
                '2024: iD01t Productions established. Initial QEC research begins.',
                '2025 Q1: Advanced topological framework.',
                '2025 Q2: QECTOR Decoder v3 core engine in Rust / PyO3.',
                '2025 Q3: Titan-Class BB QLDPC code environment validation.',
                '2025 Q4: v0.5.x PyPI release train begins.',
              ]}
            />
          </div>

        </div>
      </section>
    </>
  );
}
