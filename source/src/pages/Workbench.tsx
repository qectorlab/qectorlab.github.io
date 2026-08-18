import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import AlgorithmCard from '../components/AlgorithmCard';
import EvidenceBlock from '../components/EvidenceBlock';
import QECSimulator from '../components/QECSimulator';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WINDOWS_WORKBENCH_VERSION = 'v1.0.0';
const WINDOWS_BACKEND_VERSION = '1.0.0';
const WINDOWS_MCP_TOOLS = '82';
const WINDOWS_RELEASES = 'https://github.com/qectorlab/qector-decoder-workbench-windows/releases/tag/v1.0.0';
const LINUX_WORKBENCH_VERSION = 'v0.5.3';
const LINUX_BACKEND_VERSION = '0.7.0';
const LINUX_MCP_TOOLS = '56';
const LINUX_RELEASES = 'https://github.com/qectorlab/qector-decoder-workbench-linux/releases/latest';

export default function Workbench() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    });

    return () => {
      ctx.revert();
    };
  }, []);


  const addRef = (el: HTMLDivElement | null, index: number) => {
    if (el) sectionsRef.current[index] = el;
  };

  // Decoder coverage against the qector_decoder_v3 backend.
  // The v1.0.0 app ships 15 decoder backends (Zenodo 10.5281/zenodo.21941046).
  const decodersList = [
    { kind: 'union_find', type: 'Graphlike', desc: 'Zero-allocation Union-Find (UF 01).' },
    { kind: 'fast_union_find', type: 'Graphlike', desc: 'Ultra-fast approximate Union-Find variant.' },
    { kind: 'blossom', type: 'Universal', desc: 'Exact minimum-weight perfect matching (Edmonds\' Blossom).' },
    { kind: 'sparse_blossom', type: 'Graphlike', desc: 'Event-driven Sparse Blossom with radix-heap region growth.' },
    { kind: 'hybrid', type: 'Graphlike', desc: 'Multi-strategy adaptive solver.' },
    { kind: 'predecoded', type: 'Graphlike', desc: 'Fast pre-decoding pass prior to matching.' },
    { kind: 'auto', type: 'Graphlike', desc: 'Self-selecting 7-tier heuristic selector.' },
    { kind: 'bp_osd', type: 'Universal / qLDPC', desc: 'Belief propagation + ordered statistics decoding.' },
    { kind: 'gnn_belief_matching', type: 'Graphlike', desc: 'GNN-guided edge-weighted matching with fallback.' },
    { kind: 'belief_matching', type: 'Universal', desc: 'BP posteriors reweight Blossom matching.' },
    { kind: 'auto_router', type: 'Universal', desc: 'Native routing layer: 7-tier fallback chain.' },
    { kind: 'colour_code', type: 'Triangular colour code', desc: 'Colour-code decoder for triangular colour lattices.' },
    { kind: 'two_stage', type: 'Graphlike', desc: 'Two-stage CSS decoding for correlated X/Z noise.' },
    { kind: 'ambiguity_cluster', type: 'Graphlike', desc: 'Ambiguity clustering with learned pre-decoders.' },
    { kind: 'lookup_table', type: 'Small (<20 checks)', desc: 'Exhaustive syndrome lookup table.' },
  ];

  const codeFamilies = [
    { name: 'repetition', params: 'distance (int)', desc: '1D chain parity-check code.' },
    { name: 'ring', params: 'distance (int)', desc: 'Periodic 1D chain.' },
    { name: 'rotated_surface', params: 'distance (int)', desc: 'Standard rotated surface code.' },
    { name: 'unrotated_surface', params: 'distance (int)', desc: 'Square lattice surface code.' },
    { name: 'toric', params: 'distance (int)', desc: 'Toric code with periodic boundaries.' },
    { name: 'heavy_hex', params: 'distance (int)', desc: 'Heavy-hex lattice.' },
    { name: 'hypergraph_product', params: 'distance (int)', desc: 'CSS code from repetition seed.' },
    { name: 'bicycle', params: 'circulant size (int)', desc: 'qLDPC bicycle code.' },
    { name: 'bivariate_bicycle', params: 'preset index (int)', desc: 'Bivariate bicycle presets (qLDPC).' },
    { name: 'color_code', params: 'triangular size (int)', desc: 'Triangular & 2D 4.8.8 colour codes.' },
  ];

  // The workspaces ship in v1.0.0 as described by the Windows release notes:
  // eight GUI tabs plus a live Console.
  const modules = [
    'Code Explorer',
    'Decoder Lab',
    'Benchmark',
    'Batch & Streaming',
    'Hardware',
    'Diagnostics',
    'Documentation Studio',
    'Lab & Personal Info',
    'Console',
  ];

  return (
    <>
      <SEO
        title="QECTOR Workbench · Windows v1.0.0 and Linux v0.5.3"
        description={`QECTOR Workbench desktop GUI and MCP releases: Windows ${WINDOWS_WORKBENCH_VERSION} with ${WINDOWS_MCP_TOOLS} tools and a ${WINDOWS_BACKEND_VERSION} backend, plus Linux ${LINUX_WORKBENCH_VERSION} with ${LINUX_MCP_TOOLS} tools and a ${LINUX_BACKEND_VERSION} backend.`}
      />

      {/* Top Notice */}
      <div className="bg-emerald-950/50 border-b border-emerald-500/30 py-2.5 text-center text-sm px-4">
        <span className="text-emerald-400 font-semibold">Free Desktop Application:</span>{' '}
        <a href={WINDOWS_RELEASES} className="underline hover:text-emerald-300 transition-colors" target="_blank" rel="noopener noreferrer">
          Windows {WINDOWS_WORKBENCH_VERSION} · {WINDOWS_MCP_TOOLS} MCP tools
        </a>{' · '}
        <a href={LINUX_RELEASES} className="underline hover:text-emerald-300 transition-colors" target="_blank" rel="noopener noreferrer">
          Linux {LINUX_WORKBENCH_VERSION} · {LINUX_MCP_TOOLS} MCP tools
        </a>
      </div>

      {/* Hero */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-400/10 border border-gold-400/20 rounded-full text-xs font-semibold text-gold-400 uppercase tracking-wider mb-6">
            Windows {WINDOWS_WORKBENCH_VERSION} · backend qector_decoder_v3 {WINDOWS_BACKEND_VERSION} · {WINDOWS_MCP_TOOLS} MCP tools
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="QECTOR Workbench" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            The free desktop application and Model Context Protocol server for{' '}
            <span className="text-cyan-300 font-semibold">QECTOR Decoder v3</span>.{' '}
            The Windows release includes 15 decoder backends, 10 quantum code families, a visual circuit builder, and an 82-tool MCP server. The Linux release is a separate {LINUX_WORKBENCH_VERSION} build with a {LINUX_BACKEND_VERSION} backend and {LINUX_MCP_TOOLS} tools.
            Ships as a portable Windows executable: each one
            <span className="text-primary font-semibold">fully self-contained</span>, bundling its own Python runtime,
            scientific stack, and decoder wheel. No system Python, no pip, no internet connection, and no update checks.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={WINDOWS_RELEASES} target="_blank" rel="noopener noreferrer" className="btn-cyan">
              Windows download
            </a>
            <a href={LINUX_RELEASES} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Linux download
            </a>
            <Link to="/technical-reference" className="btn-outline">
              Technical Reference
            </Link>
          </div>
          <p className="text-muted-foreground text-xs mt-4">
            Windows x64 and Linux x64 releases are published. No macOS build is currently published.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-6xl mx-auto space-y-14">

          {/* Stats Grid */}
          <div ref={(el) => addRef(el, 0)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: WINDOWS_WORKBENCH_VERSION, label: 'Windows release' },
              { value: `${WINDOWS_MCP_TOOLS} / ${LINUX_MCP_TOOLS}`, label: 'MCP tools (Win / Linux)' },
              { value: '15 / 16', label: 'Backends (Win / Linux)' },
              { value: '10', label: 'Quantum Code Families' },
            ].map((s) => (
              <div key={s.label} className="card-surface text-center">
                <div className="text-cyan-300 font-bold text-3xl mb-1">{s.value}</div>
                <div className="text-secondary text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Workspaces */}
          <div ref={(el) => addRef(el, 0.5)}>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Inside the Workbench</h2>
            <p className="text-secondary text-sm mb-6">
              Nine workspaces are documented for the Windows {WINDOWS_WORKBENCH_VERSION} release:{' '}
              {modules.map((m, i) => (
                <span key={m}>
                  <span className="text-primary font-medium">{m}</span>
                  {i < modules.length - 1 ? ' · ' : ''}
                </span>
              ))}
              .
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {modules.slice(0, 6).map((module) => (
                <div key={module} className="bg-void border border-gridline rounded-xl p-5">
                  <span className="text-cyan-300 font-semibold text-sm block mb-2">{module}</span>
                  <p className="text-secondary text-xs leading-relaxed">
                    Explore this workspace with the release documentation and inspect results on your own machine. No
                    hardware-specific run data is published here.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Downloads */}
          <div ref={(el) => addRef(el, 0.75)} className="card-surface space-y-5">
            <h2 className="text-2xl font-bold">Downloads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 bg-void border border-gridline rounded-xl space-y-3">
                <h3 className="text-cyan-300 font-semibold text-base">Windows x64</h3>
                <p className="text-secondary text-xs leading-relaxed">
                  Portable single executable. No installer, no admin rights, no internet connection.
                </p>
                <ul className="text-xs space-y-1 text-secondary list-disc pl-4">
                  <li>Download <code className="text-cyan-300">QectorWorkbench-Portable.exe</code> and double-click.</li>
                  <li>Headless MCP server: <code className="text-cyan-300">QectorWorkbench-Portable.exe --mcp</code></li>
                  <li>Runtime data: <code className="text-cyan-300">%LOCALAPPDATA%\QectorWorkbench</code></li>
                </ul>
                <a href={WINDOWS_RELEASES} target="_blank" rel="noopener noreferrer" className="btn-cyan text-sm inline-block">
                  Windows release
                </a>
              </div>

              <div className="p-5 bg-void border border-gridline rounded-xl space-y-3">
                <h3 className="text-cyan-300 font-semibold text-base">Linux x64</h3>
                <p className="text-secondary text-xs leading-relaxed">
                  Published {LINUX_WORKBENCH_VERSION} Debian/package release with a bundled qector-decoder-v3 {LINUX_BACKEND_VERSION} backend and {LINUX_MCP_TOOLS}-tool MCP server.
                </p>
                <a href={LINUX_RELEASES} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm inline-block">
                  Linux release
                </a>
              </div>
            </div>

            <div className="p-4 bg-cyan-300/5 border border-cyan-300/20 rounded-xl text-xs text-secondary leading-relaxed">
              <strong className="text-primary">Verify your download:</strong> SHA-256 checksums for every file are published in
              the release notes. Override the runtime data directory with <code className="text-cyan-300">QECTOR_DATA_DIR</code>.
            </div>
          </div>

          {/* Decoders Table */}
          <div ref={(el) => addRef(el, 1)} className="card-surface space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Integrated Decoders</h2>
                <p className="text-secondary text-sm mt-1">
                  All 15 decoder backends exposed through the Workbench MCP server. No benchmark figures are published on the site: run the included harness to measure your own hardware.
                </p>
              </div>
              <span className="text-xs px-3 py-1 bg-cyan-300/10 border border-cyan-300/20 text-cyan-300 rounded-full font-mono">
              Windows backend qector_decoder_v3 {WINDOWS_BACKEND_VERSION}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
                   The Windows {WINDOWS_WORKBENCH_VERSION} release declares <strong className="text-secondary">15 decoder backends</strong>;
                   the Linux {LINUX_WORKBENCH_VERSION} release declares 16 against its older bundled backend. Consult each release's
                   included manuals for platform-specific coverage.
            </p>

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

          {/* Code Families */}
          <div ref={(el) => addRef(el, 2)}>
            <h2 className="text-2xl font-bold mb-2">10 Supported Code Families</h2>
            <p className="text-secondary text-sm mb-6">
               The published releases cover <strong className="text-primary">10 code families</strong>, including qLDPC
              and colour codes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {codeFamilies.map((c) => (
                <div key={c.name} className="p-4 bg-void border border-gridline rounded-xl space-y-2">
                  <span className="font-mono text-cyan-300 font-bold">{c.name}</span>
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
                  name: 'Desktop GUI',
                  desc: 'CustomTkinter desktop UI for Windows. Visual circuit builder, syndrome viewer, decoder performance dashboard, and a distance slider covering d3–d63 on supported families.',
                },
                {
                   name: 'MCP Tools',
                   desc: 'Native Model Context Protocol server over stdio JSON-RPC 2.0, launched with --mcp and usable headlessly with no display. Connects AI agents directly to decoder execution and diagnostics.',
                },
                {
                  name: 'Fully Self-Contained',
                  desc: 'Bundles its own Python runtime, the scientific stack, and the qector_decoder_v3 1.0.0 wheel. No system Python, pip, or internet connection required, and no online update checks.',
                },
                {
                  name: 'Self / Auto-Debug Layer',
                  desc: 'Verifies H·c == s on every decode with a full attempt trace, and falls back across decoders automatically when a decoder fails to produce a faithful correction.',
                },
                {
                  name: 'Hardware Dashboard',
                  desc: 'Auto-detects CUDA, OpenCL, and CPU backends, and reports OpenCL absence honestly: it names why a backend is unavailable rather than printing a bare N/A.',
                },
                {
                  name: 'Lab & Personal Info',
                  desc: 'Deposit profile (author, ORCID, affiliation, DOI, funding, keywords) for generated reports, plus decoder licence-key installation with a live tier readout.',
                },
                {
                  name: 'Documentation Export',
                   desc: 'Export documentation and evidence in the formats supported by the selected release, with optional .zenodo.json and CITATION.cff deposit sidecars.',
                },
                {
                  name: 'Bundled Manuals & EULA',
                  desc: 'Each release ships an API Reference, MCP Integration Guide, Quick Start Guide, a per-OS User Manual, a machine-readable LLM manual, and EULA.txt, with SHA-256 checksums for every file.',
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
              title="Documentation & Reference"
               statement={`QECTOR Workbench documentation is published alongside each app release. Windows ${WINDOWS_WORKBENCH_VERSION} and Linux ${LINUX_WORKBENCH_VERSION} are separate builds with different bundled backend and MCP versions; use the release-specific manuals and SHA-256 checksums.`}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <a
                 href={WINDOWS_RELEASES}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors"
              >
                <div className="text-xs text-muted-foreground uppercase mb-1">Manuals & EULA</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">GitHub Releases</div>
                <div className="text-xs text-secondary mt-1">API Reference, MCP guide, Quick Start, per-OS manual</div>
              </a>

              <Link
                to="/evidence"
                className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors"
              >
                <div className="text-xs text-muted-foreground uppercase mb-1">Validation & Evidence</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">qector.store/evidence</div>
                <div className="text-xs text-secondary mt-1">Validation reports and SHA-256 sealed artifact manifests</div>
              </Link>

              <Link
                to="/technical-reference"
                className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors"
              >
                <div className="text-xs text-muted-foreground uppercase mb-1">Architecture Whitepaper</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">qector.store/technical-reference</div>
                <div className="text-xs text-secondary mt-1">Technical specification & design</div>
              </Link>
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
