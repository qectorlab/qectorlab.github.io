import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import AlgorithmCard from '../components/AlgorithmCard';
import EvidenceBlock from '../components/EvidenceBlock';
import QECSimulator from '../components/QECSimulator';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePyPIVersion } from '../hooks/usePyPIVersion';

gsap.registerPlugin(ScrollTrigger);

export default function Workbench() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const { version: pypiVersion } = usePyPIVersion();

  useEffect(() => {
    sectionsRef.current.filter(Boolean).forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 85%', once: true },
        }
      );
    });
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const addRef = (el: HTMLDivElement | null, index: number) => {
    if (el) sectionsRef.current[index] = el;
  };

  const decodersList = [
    { kind: 'hybrid_cascade', type: 'Graphlike', desc: 'Union-Find pre-filter + Blossom/BP-OSD escalation.' },
    { kind: 'fast_union_find', type: 'Graphlike', desc: 'Ultra-fast approximate Union-Find variant.' },
    { kind: 'lookup_table', type: 'Small (<20 checks)', desc: 'Exhaustive syndrome lookup table.' },
    { kind: 'union_find', type: 'Graphlike', desc: 'Standard cluster-growth Union-Find decoder.' },
    { kind: 'blossom', type: 'Universal', desc: 'Weight-optimal exact MWPM matching.' },
    { kind: 'sparse_blossom', type: 'Graphlike', desc: 'Region-growing blossom variant for sparse error graphs.' },
    { kind: 'hybrid', type: 'Graphlike', desc: 'Multi-strategy adaptive solver.' },
    { kind: 'predecoded', type: 'Graphlike', desc: 'Fast pre-decoding pass prior to matching.' },
    { kind: 'auto', type: 'Graphlike', desc: 'Self-selecting 7-tier heuristic selector.' },
    { kind: 'bp_osd', type: 'Universal / qLDPC', desc: 'Belief propagation + ordered statistics decoding.' },
    { kind: 'gnn_belief_matching', type: 'Graphlike', desc: 'GNN-guided edge-weighted matching with fallback.' },
    { kind: 'belief_matching', type: 'Universal', desc: 'BP posteriors reweight Blossom matching.' },
    { kind: 'auto_router', type: 'Universal', desc: 'Policy router: matching for graphlike, BP-OSD for qLDPC.' },
    { kind: 'colour_code', type: 'Triangular colour code', desc: 'Colour-code decoder for triangular colour lattices.' },
    { kind: 'two_stage', type: 'Graphlike', desc: 'Two-stage decoding pipeline.' },
    { kind: 'ambiguity_cluster', type: 'Graphlike', desc: 'Ambiguity-cluster resolution decoder.' },
  ];

  const codeFamilies = [
    { name: 'repetition', params: 'distance (int)', decoders: '16 / 16', desc: '1D chain parity-check code.' },
    { name: 'ring', params: 'distance (int)', decoders: '16 / 16', desc: 'Periodic 1D chain.' },
    { name: 'rotated_surface', params: 'distance (int)', decoders: '16 / 16', desc: 'Standard rotated surface code.' },
    { name: 'unrotated_surface', params: 'distance (int)', decoders: '15 / 16', desc: 'Square lattice surface code (lookup_table refused >20 checks).' },
    { name: 'toric', params: 'distance (int)', decoders: '15 / 16', desc: 'Toric code with periodic boundaries.' },
    { name: 'heavy_hex', params: 'distance (int)', decoders: '16 / 16', desc: 'IBM heavy-hex lattice.' },
    { name: 'hypergraph_product', params: 'distance (int)', decoders: '16 / 16', desc: 'CSS code from repetition seed.' },
    { name: 'bicycle', params: 'circulant size (int)', decoders: '16 / 16', desc: 'qLDPC bicycle code.' },
    { name: 'bivariate_bicycle', params: 'preset index (int)', decoders: '13 / 16', desc: 'IBM bivariate bicycle presets (qLDPC).' },
    { name: 'color_code', params: 'triangular size (int)', decoders: '5 / 16', desc: 'Triangular & 2D 4.8.8 colour codes.' },
  ];

  return (
    <>
      <SEO
        title="QECTOR Workbench v0.5.2 · 56 MCP Tools · 16 Decoders · 10 Code Families"
        description="QECTOR Workbench v0.5.2 — Free cross-platform desktop GUI & MCP server for QECTOR Decoder v3. 56 MCP tools, 16 decoders, 10 code families, visual circuit builder, and offline execution."
      />

      {/* Top Notice */}
      <div className="bg-emerald-950/50 border-b border-emerald-500/30 py-2.5 text-center text-sm px-4">
        <span className="text-emerald-400 font-semibold">Free Desktop Application:</span> QECTOR Workbench v0.5.2 (CustomTkinter GUI + 56 MCP Tools) —{' '}
        <a
          href="https://github.com/qectorlab/qector-decoder-workbench/releases/"
          className="underline hover:text-emerald-300 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download User Manual &amp; Package
        </a>
      </div>

      {/* Hero */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-400/10 border border-gold-400/20 rounded-full text-xs font-semibold text-gold-400 uppercase tracking-wider mb-6">
            Workbench 0.5.2 · Backend qector_decoder_v3 {pypiVersion || '0.7.0'} · 56 MCP Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="QECTOR Workbench v0.5.2" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            The free cross-platform desktop application (Windows, Linux, macOS) and Model Context Protocol server for{' '}
            <span className="text-cyan-300 font-semibold">QECTOR Decoder v3</span>.
            Includes 16 decoders, 10 quantum code families, visual circuit builder, 56 AI model tools, REST engine, and dual CLI.
            On first launch, it automatically installs <code className="text-cyan-300">qector-decoder-v3</code> from PyPI, operating 100% offline afterwards.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://github.com/qectorlab/qector-decoder-workbench/releases/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyan"
            >
              Download Workbench App
            </a>
            <Link to="/technical-reference" className="btn-outline">
              Technical Reference
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-6xl mx-auto space-y-14">

          {/* Stats Grid */}
          <div ref={(el) => addRef(el, 0)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 'v0.5.2', label: 'Workbench Release' },
              { value: '56', label: 'MCP Server Tools' },
              { value: '16', label: 'Decoder Algorithms' },
              { value: '10', label: 'Quantum Code Families' },
            ].map((s) => (
              <div key={s.label} className="card-surface text-center">
                <div className="text-cyan-300 font-bold text-3xl mb-1">{s.value}</div>
                <div className="text-secondary text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Decoders Table */}
          <div ref={(el) => addRef(el, 1)} className="card-surface space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">16 Integrated Decoders</h2>
                <p className="text-secondary text-sm mt-1">
                  All 16 decoder kinds exposed through the Workbench MCP server. No benchmark figures are published for this release beyond the verified v0.7.0 set — run the included harness to measure your own hardware.
                </p>
              </div>
              <span className="text-xs px-3 py-1 bg-cyan-300/10 border border-cyan-300/20 text-cyan-300 rounded-full font-mono">
                qector_decoder_v3 v{pypiVersion || '0.7.0'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gridline text-cyan-300 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Decoder Kind</th>
                    <th className="py-3 px-3">Compatibility</th>
                    <th className="py-3 px-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gridline/50">
                  {decodersList.map((d) => (
                    <tr key={d.kind} className="hover:bg-surface/30 transition-colors">
                      <td className="py-3 px-3 font-mono font-semibold text-primary">{d.kind}</td>
                      <td className="py-3 px-3 text-muted-foreground text-xs">{d.type}</td>
                      <td className="py-3 px-3 text-secondary text-xs">{d.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 10 Code Families */}
          <div ref={(el) => addRef(el, 2)}>
            <h2 className="text-2xl font-bold mb-6">10 Supported Code Families</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {codeFamilies.map((c) => (
                <div key={c.name} className="p-4 bg-void border border-gridline rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-300 font-bold">{c.name}</span>
                    <span className="text-[11px] px-2 py-0.5 bg-surface border border-gridline rounded text-secondary font-mono">
                      {c.decoders} decoders
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">Param: {c.params}</div>
                  <p className="text-xs text-secondary">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Application Features */}
          <div ref={(el) => addRef(el, 3)}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Workbench Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'CustomTkinter GUI',
                  desc: 'Polished cross-platform desktop UI (Windows, Linux, macOS). Visual circuit builder, syndrome viewer, and decoder performance dashboard.',
                },
                {
                  name: '56 MCP Tools',
                  desc: 'Native Model Context Protocol integration. Connect AI agents (Claude, Cursor, Antigravity) directly to decoder benchmarking and execution.',
                },
                {
                  name: 'Automated PyPI Installer',
                  desc: 'On first launch, the app automatically fetches qector-decoder-v3 from PyPI and configures your local environment. Works offline afterwards.',
                },
                {
                  name: 'FastAPI REST Server',
                  desc: 'Embedded OpenAPI REST engine for remote decoder calls, benchmark dispatching, and asynchronous syndrome processing.',
                },
                {
                  name: 'Dual CLI Harness',
                  desc: 'Rich interactive terminal interface and headless batch CLI for scripting, cluster jobs, and automated CI/CD pipelines.',
                },
                {
                  name: 'PDF & Report Exporter',
                  desc: 'Multi-format reporting engine generating LaTeX, PDF, Markdown, and JSON benchmark summaries with citation metadata.',
                },
              ].map((f) => (
                <AlgorithmCard key={f.name} title={f.name} desc={f.desc} />
              ))}
            </div>
          </div>

          {/* Interactive Sandbox */}
          <div ref={(el) => addRef(el, 4)} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Decoder Sandbox</h2>
            <p className="text-secondary text-sm">
              Below is an interactive sandbox replicating the basic topological planar code matching module inside QECTOR Workbench. Click to inject errors and inspect Blossom correction paths in real time.
            </p>
            <QECSimulator />
          </div>

          {/* Documentation & Reference */}
          <div ref={(el) => addRef(el, 5)}>
            <EvidenceBlock
              title="Documentation &amp; Reference"
              statement="QECTOR Workbench v0.5.2 documentation and the verified v0.7.0 benchmark set are published alongside the app release and on this site."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <a
                href="https://github.com/qectorlab/qector-decoder-workbench/releases/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors"
              >
                <div className="text-xs text-muted-foreground uppercase mb-1">User Manual &amp; Licensing</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">GitHub Releases</div>
                <div className="text-xs text-secondary mt-1">Full manual, Windows, Linux, macOS editions</div>
              </a>

              <Link
                to="/benchmarks"
                className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors"
              >
                <div className="text-xs text-muted-foreground uppercase mb-1">Performance Benchmarks</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">qector.store/benchmarks</div>
                <div className="text-xs text-secondary mt-1">Verified v0.7.0 set · 54/54 points, 0 unfaithful</div>
              </Link>

              <Link
                to="/technical-reference"
                className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors"
              >
                <div className="text-xs text-muted-foreground uppercase mb-1">Architecture Whitepaper</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">qector.store/technical-reference</div>
                <div className="text-xs text-secondary mt-1">Technical specification &amp; design</div>
              </Link>
            </div>
          </div>

          {/* Installation & Operating System Guides */}
          <div ref={(el) => addRef(el, 6)} className="card-surface space-y-6">
            <h2 className="text-2xl font-bold">App Installation &amp; Execution</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-void border border-gridline rounded-xl space-y-2">
                <h3 className="text-cyan-300 font-semibold text-base">Windows Edition</h3>
                <p className="text-secondary text-xs leading-relaxed">
                  Standalone Windows app (<code className="text-cyan-300">QECTOR_User_Manual_Windows.pdf</code> reference).
                </p>
                <ul className="text-xs space-y-1 text-secondary list-disc pl-4">
                  <li>Run <code className="text-cyan-300">qector-workbench.exe</code>.</li>
                  <li>Auto-installs <code className="text-cyan-300">qector-decoder-v3==0.7.0</code> on first launch.</li>
                  <li>100% offline after setup.</li>
                </ul>
              </div>

              <div className="p-4 bg-void border border-gridline rounded-xl space-y-2">
                <h3 className="text-cyan-300 font-semibold text-base">Linux Edition</h3>
                <p className="text-secondary text-xs leading-relaxed">
                  Python application (<code className="text-cyan-300">QECTOR_User_Manual_Linux.pdf</code> reference).
                </p>
                <ul className="text-xs space-y-1 text-secondary list-disc pl-4">
                  <li>Requires <code className="text-cyan-300">python3</code> and <code className="text-cyan-300">python3-pip</code>.</li>
                  <li>Launch: <code className="text-cyan-300">python3 -m qector_workbench</code>.</li>
                  <li>Auto-installs <code className="text-cyan-300">qector-decoder-v3==0.7.0</code>.</li>
                </ul>
              </div>

              <div className="p-4 bg-void border border-gridline rounded-xl space-y-2">
                <h3 className="text-cyan-300 font-semibold text-base">macOS Edition</h3>
                <p className="text-secondary text-xs leading-relaxed">
                  Apple Silicon / Intel (<code className="text-cyan-300">QECTOR_User_Manual_macOS.pdf</code> reference).
                </p>
                <ul className="text-xs space-y-1 text-secondary list-disc pl-4">
                  <li>Run <code className="text-cyan-300">qector-workbench.app</code>.</li>
                  <li>Auto-installs <code className="text-cyan-300">qector-decoder-v3==0.7.0</code>.</li>
                  <li>No separate pip setup required.</li>
                </ul>
              </div>
            </div>

            {/* Troubleshooting & Error Resolution */}
            <div className="p-5 bg-red-950/40 border border-red-500/30 rounded-xl space-y-3">
              <h3 className="text-red-400 font-bold text-base flex items-center gap-2">
                <span>⚠️ Troubleshooting: "QECTOR Decoder unavailable"</span>
              </h3>
              <p className="text-secondary text-xs leading-relaxed">
                If the desktop app displays the dialog <em>"QECTOR could not start because qector-decoder-v3 is unavailable... another QECTOR instance is installing the decoder"</em>:
              </p>
              <div className="bg-void/80 p-3 rounded-lg border border-gridline font-mono text-xs text-cyan-300 space-y-1">
                <div>1. Ensure 64-bit CPython (3.9–3.13) with pip is installed on PATH.</div>
                <div>2. If Python is not on PATH, set the environment variable: <span className="text-gold-400">set QECTOR_PYTHON=C:\Python312\python.exe</span></div>
                <div>3. Or manually pre-install the backend wheel: <span className="text-gold-400">pip install qector-decoder-v3==0.7.0</span></div>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Environment Variables:</strong> <code className="text-cyan-300">QECTOR_PYTHON</code> (CPython path), <code className="text-cyan-300">QECTOR_DATA_DIR</code> (custom data directory), <code className="text-cyan-300">QECTOR_AUTO_UPGRADE=0</code> (disable background upgrade checks).
              </p>
            </div>

            <div className="p-4 bg-cyan-300/5 border border-cyan-300/20 rounded-xl text-xs text-secondary leading-relaxed">
              <strong>Offline Operation:</strong> The application is distributed without embedding the heavy decoder binary wheels directly. On first launch, it connects to PyPI to install the verified backend wheel. After that initial setup, QECTOR Workbench operates completely offline with zero network requirement.
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <Link to="/contact" className="btn-cyan">
              Contact for Technical Support
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
