import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO, JsonLd } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import MetricCard from '../components/MetricCard';
import AlgorithmCard from '../components/AlgorithmCard';
import SectionHeader from '../components/SectionHeader';
import EvidenceBlock from '../components/EvidenceBlock';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePyPIVersion } from '../hooks/usePyPIVersion';

gsap.registerPlugin(ScrollTrigger);

export default function Decoder() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const { version: pypiVersion } = usePyPIVersion();
  useEffect(() => {
    sectionsRef.current.filter(Boolean).forEach((section) => {
      gsap.fromTo(section, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 85%', once: true },
      });
    });
    return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
  }, []);
  const addRef = (el: HTMLDivElement | null, index: number) => { if (el) sectionsRef.current[index] = el; };

  return (
    <>
      <SEO
        title="QECTOR Decoder v3 · Production-Grade QEC Decoding for Python"
        description="QECTOR Decoder v3 — ten battle-tested QEC decoding algorithms in a single Python library. Exact MWPM parity to PyMatching, measurable accuracy gains, native GPU batch decoding."
        pageType="SoftwareApplication"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'QECTOR Decoder v3',
          description: 'Production-grade poly-algorithmic quantum error correction decoder for Python with exact MWPM and Belief-Matching capabilities.',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Linux, macOS, Windows',
          programmingLanguage: 'Python',
          url: 'https://qector.store/decoder',
          downloadUrl: 'https://pypi.org/project/qector-decoder-v3/',
          softwareVersion: pypiVersion || '0.6.2',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
        }}
      />

      {/* Hero */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse-dot" />
            v{pypiVersion || '0.6.2'} · New Free Workbench GUI v3.4 (CustomTkinter + 25 MCP tools)
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="QECTOR Decoder v3" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Rust-core Python library implementing ten QEC decoders from exact MWPM to GPU batch.
            Exact parity with PyMatching through d=15. +35.7% accuracy gain with Belief-Matching.
            Stim-native. PyPI binary wheels. All benchmarks published on{' '}
            <a href="https://doi.org/10.5281/zenodo.20825980" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">Zenodo</a>.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://pypi.org/project/qector-decoder-v3/" target="_blank" rel="noopener noreferrer" className="btn-cyan">pip install qector-decoder-v3</a>
            <Link to="/benchmarks" className="btn-outline">View Benchmarks</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Core Metrics */}
          <div ref={(el) => addRef(el, 0)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Exact Parity', value: 'd=3–15', desc: 'MWPM LER matches PyMatching across all tested distances' },
              { label: '+35.7% Gain', value: 'Belief-Match', desc: 'LER reduction vs PyMatching at d=5, circuit-level noise' },
              { label: '98.3% Optimal', value: 'd=9', desc: 'Shots achieving exact minimum-weight correction' },
              { label: '832 / 832 Tests', value: '100% Pass', desc: 'Validation and Stim comparison tests passing successfully' },
            ].map((m) => (
              <MetricCard key={m.label} label={m.label} value={m.value} desc={m.desc} centered />
            ))}
          </div>

          {/* Algorithm Cards — tiered */}
          <div ref={(el) => addRef(el, 1)}>
            <SectionHeader
              align="left"
              maxWidth="max-w-none"
              heading="Decoding Algorithms"
              description="Production decoders are validated against PyMatching and published on Zenodo. Experimental decoders are research-stage."
              className="mb-6"
            />

            {/* Production */}
            <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-widest mb-3">Production — Validated</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { name: 'Blossom MWPM', tag: 'Exact', color: 'gold', desc: 'Adaptive-k minimum-weight perfect matching. Exact LER parity with PyMatching through d=15. The reference decoder for surface codes.' },
                { name: 'Belief Matching', tag: 'Best LER', color: 'cyan', desc: 'BP pre-processing + reweighted exact MWPM. +35.7% LER reduction vs plain MWPM at d=5. Use when accuracy matters more than latency.' },
                { name: 'BP-OSD', tag: 'qLDPC', color: 'purple', desc: 'Belief propagation + ordered statistics decoding. Required for qLDPC codes where matching decoders cannot be applied.' },
                { name: 'Union-Find', tag: 'Fastest', color: 'green', desc: 'Near-linear time approximate decoder. Fastest option at large code distances — trades some LER accuracy for speed.' },
                { name: 'Sparse Blossom', tag: 'Near-Optimal', color: 'gold', desc: 'Region-growing blossom variant for ring-like detector graphs. Lower latency than exact Blossom, close to optimal.' },
                { name: 'GPU Batch', tag: 'Parallel', color: 'gold', desc: 'Native CUDA/OpenCL batch decoding. Bit-identical corrections to CPU MWPM. Throughput advantage grows with batch size.' },
              ].map((algo) => (
                <AlgorithmCard
                  key={algo.name}
                  title={algo.name}
                  badge={{ label: algo.tag, color: algo.color as 'cyan' | 'green' | 'purple' | 'gold' }}
                  desc={algo.desc}
                />
              ))}
            </div>

            {/* Experimental */}
            <h3 className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-3">Experimental — Research Stage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'EBP', desc: 'Enhanced belief propagation for harder LDPC/qLDPC instances where standard BP-OSD stalls.' },
                { name: 'Restart Belief', desc: 'BP with restart strategies to escape local minima on degenerate syndromes.' },
                { name: 'KAT / QCT', desc: 'Transformer-based decoder for maximum-accuracy offline analysis. High latency — not for real-time use.' },
                { name: 'Astra GNN', desc: 'Graph neural network decoder. Research benchmarking only. Not validated for production workloads.' },
              ].map((algo) => (
                <AlgorithmCard
                  key={algo.name}
                  title={algo.name}
                  badge={{ label: 'Experimental', color: 'gold' }}
                  desc={algo.desc}
                  muted
                />
              ))}
            </div>
          </div>

          {/* Technical Details */}
          <div ref={(el) => addRef(el, 2)} className="card-surface">
            <h3 className="text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-4">Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Languages', 'Rust core (PyO3) / Python 3.10+ API'],
                ['Platforms', 'Linux, macOS ARM64/x86, Windows'],
                ['GPU', 'CUDA 11.8+ / OpenCL 2.0+'],
                ['QEC Library', 'Stim (quantum-circuit noise simulation)'],
                ['Packaging', 'PyPI binary wheels (manylinux, macOS, Windows)'],
                ['License', 'PolyForm Noncommercial 1.0.0 (community) / Commercial'],
                ['Validation', 'Zenodo DOI 10.5281/zenodo.20825980'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <span className="text-muted-foreground text-sm min-w-[140px]">{k}</span>
                  <span className="text-secondary text-sm">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Validation */}
          <div ref={(el) => addRef(el, 3)}>
            <EvidenceBlock
              title="Validation Status"
              statement="All benchmark claims are simulation-validated using Stim + PyMatching cross-validation. Validation artifacts are published on Zenodo with DOI 10.5281/zenodo.20825980."
              href="https://doi.org/10.5281/zenodo.20825980"
              linkLabel="Zenodo Evidence Bundle →"
            />
            <div className="flex flex-wrap gap-4 mt-3 px-1">
              <Link to="/benchmarks" className="text-cyan-300 text-sm hover:underline">Full Benchmarks →</Link>
              <Link to="/evidence" className="text-cyan-300 text-sm hover:underline">Evidence Reports →</Link>
            </div>
          </div>

          {/* CTA */}
          <div ref={(el) => addRef(el, 4)} className="text-center py-8">
            <div className="inline-flex flex-wrap gap-4 justify-center">
              <a href="https://pypi.org/project/qector-decoder-v3/" target="_blank" rel="noopener noreferrer" className="btn-cyan">
                pip install qector-decoder-v3
              </a>
              <Link to="/commercial" className="btn-gold">Start Commercial Evaluation</Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
