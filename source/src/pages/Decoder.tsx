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
        description="QECTOR Decoder v3 – 15+ decoder configurations in a single Python library. v1.0.0 first stable release with API stability tiers, Relay-BP, CS-OSD, Sinter/qiskit entry points. A reproducible benchmark harness (qector bench) ships with the package for measuring on your own hardware."
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
          softwareVersion: pypiVersion,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
        }}
      />

      {/* Hero */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse-dot" />
            v{pypiVersion} (Source-Available) · Free Workbench GUI v0.5.3 (CustomTkinter + 56 MCP tools)
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="QECTOR Decoder v3" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Rust-core Python library implementing 15+ decoder configurations from exact MWPM to GPU batch.
            v1.0.0 is the first stable release: API stability tiers, Relay-BP and CS-OSD, Sinter/qiskit entry points, and the qector CLI.
            A reproducible benchmark harness (qector bench) ships with the package so you can measure on your own hardware.
            Stim-native. PyPI binary wheels. All artifacts published on{' '}
            <a href="https://github.com/GuillaumeLessard/qector-decoder" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">GitHub</a>.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://pypi.org/project/qector-decoder-v3/" target="_blank" rel="noopener noreferrer" className="btn-cyan">pip install qector-decoder-v3</a>
            <Link to="/workbench" className="btn-outline">Free Workbench GUI</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Core Metrics */}
          <div ref={(el) => addRef(el, 0)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Decoder Configs', value: '25+', desc: 'From exact MWPM to GPU batch, across documented stability tiers' },
              { label: 'Binary Wheels', value: '15', desc: 'Python 3.9–3.13 on Windows amd64, Linux x86_64, macOS arm64, Sigstore-attested' },
              { label: 'Stable API', value: 'v1.0.0', desc: 'First stable release with documented API stability tiers' },
              { label: 'CI Test Suite', value: 'Automated', desc: 'Continuous validation and Stim comparison test suite on GitHub' },
            ].map((m) => (
              <MetricCard key={m.label} label={m.label} value={m.value} desc={m.desc} centered />
            ))}
          </div>

          {/* Algorithm Cards - tiered */}
          <div ref={(el) => addRef(el, 1)}>
            <SectionHeader
              align="left"
              maxWidth="max-w-none"
              heading="Decoding Algorithms"
              description="Production decoders with validation artifacts on GitHub. Experimental decoders are research-stage. v1.0.0 freezes the public API under documented stability tiers. No universal benchmark figures are published; the qector bench harness ships in the package for measuring on your own hardware."
              className="mb-6"
            />

            {/* Production */}
            <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-widest mb-3">Production Stable Decoders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { name: 'Union-Find', tag: 'Fastest', color: 'green', desc: 'Near-linear time approximate decoder. High-throughput option for graph-like codes: trades some LER accuracy for speed.' },
                { name: 'Fast Union-Find', tag: 'Hot Path', color: 'green', desc: 'Optimized Union-Find hot path for low-latency offline simulation pipelines.' },
                { name: 'Blossom MWPM', tag: 'Exact Reference', color: 'gold', desc: 'Exact minimum-weight perfect matching for graph-like codes. The reference decoder for surface codes.' },
                { name: 'CPU & GPU Batch Decoder', tag: 'Parallel', color: 'gold', desc: 'Native CUDA / OpenCL batch decoding. Throughput advantage grows with batch size; CUDA accepts edge_weights and precision="f64" in v1.0.0.' },
              ].map((algo) => (
                <AlgorithmCard
                  key={algo.name}
                  title={algo.name}
                  badge={{ label: algo.tag, color: algo.color as 'cyan' | 'green' | 'purple' | 'gold' }}
                  desc={algo.desc}
                />
              ))}
            </div>

            {/* Experimental & Research */}
            <h3 className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-3">Experimental &amp; Research Decoders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'BP-OSD', tag: 'qLDPC Research', color: 'purple', desc: 'Belief propagation + ordered statistics decoding. v1.0.0 adds Relay-BP schedules, CS-OSD(lambda, w) and LLR damping.' },
                { name: 'Belief-Matching', tag: 'Correlated Noise', color: 'cyan', desc: 'BP pre-processing + reweighted exact MWPM. Research path for correlated noise scenarios.' },
                { name: 'Sparse Blossom', tag: 'Near-Optimal', color: 'gold', desc: 'Region-growing blossom variant for detector graphs. Zero-allocation hot path in v1.0.0.' },
                { name: 'Hybrid & AutoDecoder', tag: 'Adaptive Routing', color: 'cyan', desc: 'AutoDecoder and HybridDecoder route between Union-Find and Blossom based on code properties.' },
                { name: 'Lookup-Table Decoder', tag: 'Small Codes', color: 'gold', desc: 'Precomputed correction table for small codes or syndrome subspaces.' },
                { name: 'Colour Code / Two-Stage / Ambiguity-Cluster', tag: 'Research', color: 'purple', desc: 'New v1.0.0 families: ColourCodeDecoder (opt-in cluster_bposd), TwoStageDecoder, AmbiguityClusterDecoder.' },
              ].map((algo) => (
                <AlgorithmCard
                  key={algo.name}
                  title={algo.name}
                  badge={{ label: algo.tag, color: 'gold' }}
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
                ['Languages', 'Rust core (PyO3) / Python 3.9–3.13 API'],
                ['Platforms', 'Linux, macOS ARM64/x86, Windows'],
                ['GPU', 'CUDA 11.8+ / OpenCL 2.0+'],
                ['QEC Library', 'Stim (quantum-circuit noise simulation)'],
                ['Packaging', 'PyPI binary wheels (manylinux, macOS, Windows)'],
                ['License', 'PolyForm Noncommercial 1.0.0 (community) / Commercial'],
                ['Validation', 'GitHub: github.com/GuillaumeLessard/qector-decoder'],
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
              statement="v1.0.0 (2026-08-06) is the first stable release. Decode runs are syndrome-validated (H·c = s) through the self-debugging harness, and artifact manifests are SHA-256 sealed on GitHub. No universal benchmark figures are published; the qector bench harness ships in the package for measuring on your own hardware."
              href="https://github.com/GuillaumeLessard/qector-decoder"
              linkLabel="GitHub Artifacts &amp; Harness →"
            />
            <div className="flex flex-wrap gap-4 mt-3 px-1">
              <Link to="/evidence" className="text-cyan-300 text-sm hover:underline">Evidence &amp; Reports →</Link>
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
