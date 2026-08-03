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
        description="QECTOR Decoder v3 - 16 decoder classes in a single Python library. Verified v0.7.0 benchmark set: 54/54 points with zero unfaithful corrections, peak 11.5M shots/s, native GPU batch decoding."
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
            v{pypiVersion} (Source-Available) · Free Workbench GUI v0.5.2 (CustomTkinter + 56 MCP tools)
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="QECTOR Decoder v3" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Rust-core Python library implementing 16 decoder classes from exact MWPM to GPU batch.
            Verified v0.7.0 benchmark set: peak 11.5M shots/s, 54/54 points with zero unfaithful corrections, 42/42 faithfulness cases.
            Stim-native. PyPI binary wheels. All artifacts published on{' '}
            <a href="https://github.com/GuillaumeLessard/qector-decoder" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">GitHub</a>.
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
              { label: 'Verified Points', value: '54/54', desc: 'Benchmark sweep points with zero unfaithful corrections (repetition n=5–65, ring n=16–48)' },
              { label: 'Peak Throughput', value: '11.5M/s', desc: 'FastUnionFind, 5-qubit repetition code, package MCP server' },
              { label: 'Faithfulness', value: '42/42', desc: 'Syndrome-faithfulness cases passed in the verified v0.7.0 set' },
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
              description="Production decoders with a verified v0.7.0 benchmark set; artifacts on GitHub. Experimental decoders are research-stage."
              className="mb-6"
            />

            {/* Production */}
            <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-widest mb-3">Production</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { name: 'Blossom MWPM', tag: 'Exact', color: 'gold', desc: 'Exact minimum-weight perfect matching for graph-like codes. The reference decoder for surface codes.' },
                { name: 'Belief Matching', tag: 'Accuracy', color: 'cyan', desc: 'BP pre-processing + reweighted exact MWPM. Use when accuracy matters more than latency.' },
                { name: 'BP-OSD', tag: 'qLDPC', color: 'purple', desc: 'Belief propagation + ordered statistics decoding. Required for qLDPC codes where matching decoders cannot be applied.' },
                { name: 'Union-Find', tag: 'Fastest', color: 'green', desc: 'Near-linear time approximate decoder. High-throughput option for graph-like codes - trades some LER accuracy for speed.' },
                { name: 'Sparse Blossom', tag: 'Near-Optimal', color: 'gold', desc: 'Region-growing blossom variant for ring-like detector graphs. Lower latency than exact Blossom, close to optimal.' },
                { name: 'GPU Batch', tag: 'Parallel', color: 'gold', desc: 'Native CUDA/OpenCL batch decoding. Throughput advantage grows with batch size.' },
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
            <h3 className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-3">Experimental - Research Stage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Hybrid Decoder', desc: 'HybridDecoder routes between Union-Find and Blossom based on code properties. Research-stage.' },
                { name: 'Predecoded Decoder', desc: 'Wraps pre-existing decoding results for integration into QECTOR pipelines. Useful for hybrid workflows.' },
                { name: 'Lookup-Table Decoder', desc: 'Precomputed correction table for small codes or syndrome subspaces. Fast but limited to small distances.' },
                { name: 'Colour Code Decoder', desc: 'Native colour-code decoder over undecomposed detector error models. Research-stage.' },
                { name: 'Two-Stage Decoder', desc: 'Two-stage decoding pipeline for degenerate codes. Research-stage.' },
                { name: 'Ambiguity Cluster', desc: 'Ambiguity-cluster resolution decoder. Research-stage.' },
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
              statement="Verified v0.7.0 benchmark set: 54/54 points with zero unfaithful corrections, 42/42 faithfulness cases, peak 11.5M shots/s. Reproducible artifacts are on GitHub and at qector.store/benchmarks/v0.7.0/. Pre-v0.7.0 comparison tables are formally withdrawn."
              href="https://github.com/GuillaumeLessard/qector-decoder"
              linkLabel="GitHub Artifacts &amp; Harness →"
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
