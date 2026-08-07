import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO, JsonLd } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import EvidenceBlock from '../components/EvidenceBlock';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Verified v0.7.0 benchmark set — generated 2026-08-02 via the package MCP server.
// Source of truth: REPORT.md + summary.json + benchmarks.csv + VERIFIED_APPLE_TO_APPLE_REPORT.pdf
// (published at /benchmarks/v0.7.0/). All rows: n_unfaithful = 0.
const BENCH_ROWS: Array<[string, number, string, number, number, number]> = [
  ['repetition', 5, 'union_find', 8000, 11462979, 0.087],
  ['repetition', 5, 'fast_union_find', 8000, 11540387, 0.087],
  ['repetition', 5, 'blossom', 8000, 8262646, 0.121],
  ['repetition', 5, 'sparse_blossom', 8000, 5236849, 0.191],
  ['repetition', 5, 'bp_osd', 8000, 314525, 3.179],
  ['repetition', 5, 'auto', 8000, 8261043, 0.121],
  ['repetition', 9, 'union_find', 4000, 9877914, 0.101],
  ['repetition', 9, 'fast_union_find', 4000, 10000813, 0.1],
  ['repetition', 9, 'blossom', 4000, 5070210, 0.197],
  ['repetition', 9, 'sparse_blossom', 4000, 1980725, 0.505],
  ['repetition', 9, 'bp_osd', 4000, 94640, 10.566],
  ['repetition', 9, 'auto', 4000, 3177478, 0.315],
  ['repetition', 17, 'union_find', 2500, 4242251, 0.236],
  ['repetition', 17, 'fast_union_find', 2500, 4472615, 0.224],
  ['repetition', 17, 'blossom', 2500, 1695841, 0.59],
  ['repetition', 17, 'sparse_blossom', 2500, 1136156, 0.88],
  ['repetition', 17, 'bp_osd', 2500, 79299, 12.61],
  ['repetition', 17, 'auto', 2500, 3357187, 0.298],
  ['repetition', 25, 'union_find', 1500, 6178188, 0.162],
  ['repetition', 25, 'fast_union_find', 1500, 6300252, 0.159],
  ['repetition', 25, 'blossom', 1500, 2159946, 0.463],
  ['repetition', 25, 'sparse_blossom', 1500, 1521550, 0.657],
  ['repetition', 25, 'bp_osd', 1500, 52477, 19.056],
  ['repetition', 25, 'auto', 1500, 2151542, 0.465],
  ['repetition', 33, 'union_find', 1000, 4932787, 0.203],
  ['repetition', 33, 'fast_union_find', 1000, 4953127, 0.202],
  ['repetition', 33, 'blossom', 1000, 1536840, 0.651],
  ['repetition', 33, 'sparse_blossom', 1000, 1165277, 0.858],
  ['repetition', 33, 'bp_osd', 1000, 45271, 22.089],
  ['repetition', 33, 'auto', 1000, 1292897, 0.773],
  ['repetition', 49, 'union_find', 600, 3346108, 0.299],
  ['repetition', 49, 'fast_union_find', 600, 3512604, 0.285],
  ['repetition', 49, 'blossom', 600, 1010423, 0.99],
  ['repetition', 49, 'sparse_blossom', 600, 774424, 1.291],
  ['repetition', 49, 'bp_osd', 600, 27953, 35.773],
  ['repetition', 49, 'auto', 600, 985420, 1.015],
  ['repetition', 65, 'union_find', 400, 2900839, 0.345],
  ['repetition', 65, 'fast_union_find', 400, 2754975, 0.363],
  ['repetition', 65, 'blossom', 400, 172643, 5.792],
  ['repetition', 65, 'sparse_blossom', 400, 253455, 3.945],
  ['repetition', 65, 'bp_osd', 400, 19176, 52.148],
  ['repetition', 65, 'auto', 400, 251774, 3.972],
  ['ring', 16, 'union_find', 3000, 6791172, 0.147],
  ['ring', 16, 'fast_union_find', 3000, 7687193, 0.13],
  ['ring', 16, 'blossom', 3000, 3940735, 0.254],
  ['ring', 16, 'auto', 3000, 4104082, 0.244],
  ['ring', 32, 'union_find', 1500, 5100896, 0.196],
  ['ring', 32, 'fast_union_find', 1500, 5183528, 0.193],
  ['ring', 32, 'blossom', 1500, 1877142, 0.533],
  ['ring', 32, 'auto', 1500, 1883361, 0.531],
  ['ring', 48, 'union_find', 800, 3377505, 0.296],
  ['ring', 48, 'fast_union_find', 800, 3448535, 0.29],
  ['ring', 48, 'blossom', 800, 1064594, 0.939],
  ['ring', 48, 'auto', 800, 1038234, 0.963],
];

const fmt = (n: number) => n.toLocaleString('en-US');

export default function Benchmarks() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
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
        title="Benchmarks · QECTOR"
        description="QECTOR Decoder v3 v0.7.0 verified benchmark set: peak 11.5M shots/s (FastUnionFind, 5-qubit repetition code), 54/54 benchmark points with 0 unfaithful corrections, 42/42 syndrome-faithfulness cases, 13 MCP tools. Fair synchronized comparison with PyMatching."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          'headline': 'QECTOR Decoder v3 (v0.7.0) Verified Benchmark Set',
          'description': 'MCP self-benchmark on Linux (glibc 2.35), Python 3.12.13: 13 tools, 54/54 benchmark points with zero unfaithful corrections, 42/42 syndrome-faithfulness cases, peak throughput 11,540,387 shots/s.',
          'author': { '@type': 'Person', 'name': 'Guillaume Lessard' },
          'publisher': { '@type': 'Organization', 'name': 'iD01t Productions' }
        }}
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-400/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-400/10 border border-green-400/20 rounded-full text-xs font-semibold text-green-400 uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
            Verified v0.7.0 Benchmark Set · MCP Self-Benchmark · v1.0.0 Stable (2026-08-06)
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="Verified v0.7.0 Benchmarks" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            This is the last published verified set, measured with the qector-decoder-v3 0.7.0 package MCP server
            on Linux (glibc 2.35, Python 3.12.13) and published with its raw data: REPORT.md, summary.json,
            benchmarks.csv, and a verified apple-to-apple comparison with PyMatching.
            v1.0.0 (2026-08-06) is the first stable release; it publishes no new headline figures and ships
            the honest benchmarking methodology (qector bench, the ler module) to measure on your own hardware.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/benchmarks/v0.7.0/REPORT.md" target="_blank" rel="noopener noreferrer" className="btn-cyan">Full Report (REPORT.md) →</a>
            <a href="/benchmarks/v0.7.0/VERIFIED_APPLE_TO_APPLE_REPORT.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline">Apple-to-Apple vs PyMatching (PDF) →</a>
            <Link to="/evidence" className="btn-outline">All Evidence</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Headline numbers */}
          <div ref={(el) => addRef(el, 0)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: '11.5M', label: 'Peak shots/s', desc: 'FastUnionFind · 5-qubit repetition code (11,540,387 shots/s)' },
              { value: '54 / 54', label: 'Benchmark points', desc: 'Zero unfaithful corrections across the entire sweep' },
              { value: '42 / 42', label: 'Faithfulness cases', desc: 'All syndrome-faithfulness cases passed' },
              { value: '13', label: 'MCP tools', desc: 'Verified operational over stdio JSON-RPC 2.0' },
            ].map((s) => (
              <div key={s.label} className="card-surface text-center p-6">
                <div className="text-cyan-300 font-bold text-3xl mb-1">{s.value}</div>
                <div className="text-secondary text-sm font-medium mb-2">{s.label}</div>
                <div className="text-muted-foreground text-xs leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Context */}
          <div ref={(el) => addRef(el, 1)} className="card-surface">
            <h3 className="text-cyan-300 font-semibold mb-3">How this set was measured</h3>
            <ul className="text-secondary text-sm space-y-2 list-disc pl-5">
              <li><strong className="text-primary">Transport:</strong> package MCP server, stdio JSON-RPC 2.0 (13 tools operational).</li>
              <li><strong className="text-primary">Host:</strong> Linux 6.6.122+ x86_64, glibc 2.35, Python 3.12.13.</li>
              <li><strong className="text-primary">Codes:</strong> repetition (n=5…65) and ring (n=16…48) parity-check codes; identical problem instances for every decoder.</li>
              <li><strong className="text-primary">Correctness:</strong> every correction verified against its parity-check equation; 42/42 faithfulness cases passed.</li>
              <li><strong className="text-primary">Timestamp:</strong> 2026-08-02T05:59:13Z — raw rows, seeds, and environment block ship with the artifacts.</li>
            </ul>
          </div>

          {/* Full sweep table */}
          <div ref={(el) => addRef(el, 2)} className="overflow-x-auto">
            <h3 className="text-cyan-300 font-semibold mb-3">Full sweep — 54 benchmark points, 0 unfaithful</h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gridline">
                  {['Code', 'n', 'Decoder', 'Samples', 'Throughput (shots/s)', 'Mean latency (µs)', 'Unfaithful'].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-cyan-300 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BENCH_ROWS.map(([code, n, dec, samples, tput, lat], i) => (
                  <tr key={i} className="border-b border-gridline/50 hover:bg-surface/50 transition-colors">
                    <td className="py-2 px-3 text-primary font-mono">{code}</td>
                    <td className="py-2 px-3 text-secondary">{n}</td>
                    <td className="py-2 px-3 text-primary font-mono">{dec}</td>
                    <td className="py-2 px-3 text-secondary">{fmt(samples)}</td>
                    <td className="py-2 px-3 text-green-400 font-mono font-semibold">{fmt(tput)}</td>
                    <td className="py-2 px-3 text-secondary font-mono">{lat.toFixed(3)}</td>
                    <td className="py-2 px-3 text-green-400 font-semibold">0</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-wrap gap-4 mt-4">
              <a href="/benchmarks/v0.7.0/benchmarks.csv" target="_blank" className="text-cyan-300 text-sm hover:underline">Raw CSV data →</a>
              <a href="/benchmarks/v0.7.0/summary.json" target="_blank" className="text-cyan-300 text-sm hover:underline">summary.json →</a>
            </div>
          </div>

          {/* Apple-to-apple vs PyMatching */}
          <div ref={(el) => addRef(el, 3)} className="card-surface">
            <h3 className="text-cyan-300 font-semibold mb-3">vs PyMatching — verified apple-to-apple</h3>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              On matching Stim workloads with identical syndromes and batch APIs, QECTOR Union-Find tracks PyMatching
              within the same order of magnitude. On the synchronized batch curve in the verified report, PyMatching
              sits at or above QECTOR UF across the plotted sizes. This is a fair ranking — it is not a single speedup number,
              and no multiplier is claimed.
            </p>
            <div className="flex gap-4">
              <a href="/benchmarks/v0.7.0/VERIFIED_APPLE_TO_APPLE_REPORT.pdf" target="_blank" className="text-cyan-300 text-sm hover:underline">Download the verified chart (PDF) →</a>
            </div>
          </div>

          {/* Withdrawn tables notice */}
          <div ref={(el) => addRef(el, 4)} className="p-6 bg-gold-400/5 border border-gold-400/20 rounded-2xl">
            <h3 className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Pre-v0.7.0 comparison tables — formally withdrawn</h3>
            <p className="text-secondary text-sm leading-relaxed">
              Four benchmark tables published in earlier documentation (MWPM parity vs PyMatching at d=13/15,
              belief-matching LER at d=5/7, GPU bit-identity, and the native memory profile) are withdrawn
              for v0.7.0. Do not cite them. The benchmark harness ships with the package and writes JSON with its own
              environment and parameter block — run it on your target hardware and compare decoders under the
              conditions you actually care about.
            </p>
          </div>

          {/* Reproducibility */}
          <EvidenceBlock
            title="Run it yourself"
            statement={
              <>
                Everything above is reproducible. With the v1.0.0 package the benchmark harness is{' '}
                <code className="text-cyan-300">qector bench</code> (throughput) and the{' '}
                <code className="text-cyan-300">ler</code> module (logical error rate);{' '}
                <code className="text-cyan-300">qector-doctor</code> explains why any decoder is unavailable on your machine.
                The raw artifacts are published at <code className="text-cyan-300">/benchmarks/v0.7.0/</code>.
                No figure on this page describes a machine that is not yours.
              </>
            }
            href="https://github.com/GuillaumeLessard/qector-decoder"
            linkLabel="GitHub Artifacts →"
          />

        </div>
      </section>
    </>
  );
}
