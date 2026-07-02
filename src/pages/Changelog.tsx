import { SEO } from '../lib/seo';
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
            Latest: v0.5.8 · PyPI
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">Changelog</h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Version history for QECTOR Decoder v3. Exact release dates on{' '}
            <a href="https://pypi.org/project/qector-decoder-v3/#history" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">PyPI</a>.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto pl-8 ml-2 sm:ml-6 md:ml-8 relative space-y-12 border-l border-gridline/60">
          {/* Vertical neon timeline line */}
          <div className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-300 via-gold-400/30 to-transparent shadow-[0_0_8px_rgba(103,232,249,0.5)]" />

          {/* v0.5.8 */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-cyan-300 border-4 border-void shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
            <ChangelogEntry
              latest
              version="v0.5.8 — 2026"
              note={
                <>
                  Exact release dates on{' '}
                  <a href="https://pypi.org/project/qector-decoder-v3/#history" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">PyPI</a>.
                </>
              }
              items={[
                'Optimizations for Rust-core matching decoders, reducing runtime memory allocations',
                'Added full Python 3.13 pre-built binary wheels on PyPI',
                'Fixed rare edge case in Union-Find path compression at distance d=15',
                'Corrected stabilizer parity check mappings for newer Stim versions',
              ]}
            />
          </div>

          {/* v0.5.7 */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-gold-400 border-4 border-void shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <ChangelogEntry
              version="v0.5.7 — 2026"
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
              version="v0.5.6 — 2026"
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
              version="v0.5.5 — 2026"
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
              version="v0.5.4 — 2025–2026"
              items={[
                'GPU batch decoder: native CUDA implementation',
                'Benchmark suite: head-to-head PyMatching comparison scripts',
                'Validation artifacts: Zenodo publication workflow',
              ]}
            />
          </div>

          {/* v0.5.3 */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-gridline border-4 border-void" />
            <ChangelogEntry
              version="v0.5.3 — 2025"
              items={[
                'Initial public PyPI release',
                'MWPM Blossom: adaptive-k exact matching',
                'Belief-Matching: BP + reweighted MWPM',
                'Surface code support: distances 3–15 verified',
              ]}
            />
          </div>

          {/* Pre-v0.5.x */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-gridline border-4 border-void" />
            <ChangelogEntry
              version="Pre-v0.5.x — 2024–2025"
              items={[
                '2024: iD01t Productions established. Initial QEC research begins.',
                '2025 Q1: SATI CODEX LCL-832 framework. IBM Quantum hardware runs on ibm_fez.',
                '2025 Q2: QECTOR Decoder v3 core engine in Rust / PyO3.',
                '2025 Q3: SATI v18 Titan-Class BB QLDPC code environment.',
                '2025 Q4: v0.5.x PyPI release train begins.',
              ]}
            />
          </div>

        </div>
      </section>
    </>
  );
}
