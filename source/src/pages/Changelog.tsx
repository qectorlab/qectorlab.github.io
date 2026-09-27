import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import ChangelogEntry from '../components/ChangelogEntry';
import { PYPI_RELEASES } from '../lib/releases';

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
                'Ecosystem entry points: five Sinter decoders (qector_blossom, qector_belief, qector_unionfind, and more) and a qiskit-qec plugin registered; sinter.collect() works without custom_decoders=',
                'New decoder families: AmbiguityClusterDecoder, TwoStageDecoder, ColourCodeDecoder (opt-in method="cluster_bposd")',
                'Relay-BP layered serial BP schedule (bp_method="relay"), CS-OSD(lambda, w) with configurable osd_lambda, and LLR message damping in BP-OSD',
                'Weighted Union-Find on GPU: CUDABatchDecoder / OpenCLBatchDecoder accept edge_weights, plus precision="f64" double-precision growth',
                'qector decode / qector bench / qector serve CLI and qector-doctor (environment diagnostic)',
                'pymatching submodule shim (from qector_decoder_v3.pymatching import Matching); DemModel.make_decoder covers all native families',
                'SparseBlossomDecoder hot path zero-allocation (thread-local SbScratch); six Rust panic-to-abort paths removed; license hardening (v2 tokens with tier + expiry)',
                'Binary wheels (cp39-cp313, Windows amd64 / Linux x86_64 / macOS 11.0+ arm64); no sdist',
                 'Official QECTOR Decoder v3 reference manual v1.0.0 (DOI 10.5281/zenodo.21941046)',
                'Free QECTOR Workbench (current): Comprehensive MCP tools, 19 named kinds (17 concrete decoder configurations plus AutoDecoder and Auto Router), 10 code families including qLDPC and colour codes, visual circuit builder, and a self/auto-debug layer verifying H·c = s on every decode',
                'No universal benchmark figures are published on the site; qector bench ships with the package for measuring on your own hardware',
              ]}
            />
          </div>

          {/* Verified PyPI history */}
          <div className="relative">
            <div className="absolute -left-[40px] top-6 w-4 h-4 rounded-full bg-gridline border-4 border-void" />
            <ChangelogEntry
              version="Verified PyPI release dates · UTC"
              items={[
                'No v0.7.1 release appears in the public PyPI history; it is intentionally omitted.',
                'Dates below are PyPI upload dates, not inferred development or local file dates.',
                ...PYPI_RELEASES.slice(1).map(({ version, releaseDate, label }) => `v${version} · ${releaseDate} · ${label}`),
              ]}
            />
          </div>

        </div>
      </section>
    </>
  );
}
