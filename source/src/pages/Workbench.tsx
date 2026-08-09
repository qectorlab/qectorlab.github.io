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

// Workbench release facts are taken verbatim from the published GitHub
// releases, not from marketing copy:
//   Windows: qectorlab/qector-decoder-workbench-windows (tag v0.5.3)
//   Linux  : qectorlab/qector-decoder-workbench-linux   (tag v0.5.3)
// Both ship the SAME product version, v0.5.3: the release titles, bodies, and
// asset filenames (QectorWorkbench-v0.5.3-*-x64-Public.zip) all say v0.5.3.
// The site previously advertised "v3.5.1", a macOS build, and a first-launch
// PyPI download: none of which match what ships. Verify against the release
// pages before editing numbers.
const WORKBENCH_VERSION = 'v0.5.3';
const WIN_RELEASES = 'https://github.com/qectorlab/qector-decoder-workbench-windows/releases/latest';
const LINUX_RELEASES = 'https://github.com/qectorlab/qector-decoder-workbench-linux/releases/latest';

export default function Workbench() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
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

  // Decoder coverage against the qector_decoder_v3 backend. The v0.5.3
  // app ships 16 decoders, all listed below from the release manifest.
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

  // Screenshots live in /public/assets and are served from /assets/*.png.
  // Captions describe only what is actually visible in each capture: the
  // figures shown are one operator's run on their own hardware, not a
  // published benchmark figure.
  const screenshots = [
    {
      src: '/assets/w1.png',
      alt: 'QECTOR Workbench Code Explorer tab showing a rotated_surface distance-5 code with its Tanner graph, properties panel and decoder recommendation.',
      title: 'Code Explorer',
      caption: 'Build and inspect codes. Here, a rotated_surface d=5 code (25 qubits, 12 checks, rate 0.52) with its Tanner graph and parity-check matrix, plus an analysis panel recommending union_find on CUDA at batch size 1024.',
    },
    {
      src: '/assets/ww2.png',
      alt: 'QECTOR Workbench Decoder Lab tab running the fast_union_find decoder with resilient fallback enabled, showing syndrome validity and logical failure status.',
      title: 'Decoder Lab',
      caption: 'Test decoders interactively on the current code. Each run reports Hamming weight, syndrome validity, and logical failure alongside the raw error, syndrome, and correction vectors, with a toggleable resilient fallback.',
    },
    {
      src: '/assets/w4.png',
      alt: 'QECTOR Workbench Benchmark Suite tab showing throughput and latency percentiles for union_find on a repetition distance-11 code, with latency and session comparison charts.',
      title: 'Benchmark Suite',
      caption: 'Measure throughput and latency across codes, with JSON export. This run: union_find on repetition d=11, 20,000 trials, 100% syndrome match, p50 latency 2.4 µs. Session comparison charts stack repeated runs side by side.',
    },
    {
      src: '/assets/w5.png',
      alt: 'QECTOR Workbench Batch and Streaming tab showing a 10,000-sample batch decode on the CPU backend with a histogram of correction Hamming weights.',
      title: 'Batch & Streaming',
      caption: 'Batch-decode many samples and run sliding-window streaming sessions. Backend availability (cpu, cpu_parallel, cuda, opencl) is probed and reported up front, and unavailable backends surface their error verbatim rather than failing silently.',
    },
  ];

  // The workspaces ship in v0.5.3 as described by the Windows release notes:
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
        title={`QECTOR Workbench ${WORKBENCH_VERSION} · 56 MCP Tools · 16 Decoders · 10 Code Families`}
        description={`QECTOR Workbench ${WORKBENCH_VERSION}: free desktop GUI and MCP server for QECTOR Decoder v3. Windows portable exe and Linux .deb, 56 MCP tools, 16 decoders, 10 code families. Fully self-contained: no system Python, pip, or internet required.`}
      />

      {/* Top Notice */}
      <div className="bg-emerald-950/50 border-b border-emerald-500/30 py-2.5 text-center text-sm px-4">
        <span className="text-emerald-400 font-semibold">Free Desktop Application:</span> QECTOR Workbench {WORKBENCH_VERSION} (56 MCP tools):{' '}
        <a href={WIN_RELEASES} className="underline hover:text-emerald-300 transition-colors" target="_blank" rel="noopener noreferrer">
          Windows
        </a>{' '}
        ·{' '}
        <a href={LINUX_RELEASES} className="underline hover:text-emerald-300 transition-colors" target="_blank" rel="noopener noreferrer">
          Linux
        </a>
      </div>

      {/* Hero */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-400/10 border border-gold-400/20 rounded-full text-xs font-semibold text-gold-400 uppercase tracking-wider mb-6">
            Workbench {WORKBENCH_VERSION} · Bundled backend qector_decoder_v3 0.7.0 · 56 MCP Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text={`QECTOR Workbench ${WORKBENCH_VERSION}`} className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            The free desktop application and Model Context Protocol server for{' '}
            <span className="text-cyan-300 font-semibold">QECTOR Decoder v3</span>.{' '}
            16 decoders, 10 quantum code families, visual circuit builder, and a comprehensive MCP server.
            Ships as a portable Windows executable and native Linux packages: each one{' '}
            <span className="text-primary font-semibold">fully self-contained</span>, bundling its own Python runtime,
            scientific stack, and decoder wheel. No system Python, no pip, no internet connection, and no update checks.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={WIN_RELEASES} target="_blank" rel="noopener noreferrer" className="btn-cyan">
              Download for Windows
            </a>
            <a href={LINUX_RELEASES} target="_blank" rel="noopener noreferrer" className="btn-cyan">
              Download for Linux
            </a>
            <Link to="/technical-reference" className="btn-outline">
              Technical Reference
            </Link>
          </div>
          <p className="text-muted-foreground text-xs mt-4">
            Windows x64 and Linux x64. No macOS build is currently published.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-6xl mx-auto space-y-14">

          {/* Stats Grid */}
          <div ref={(el) => addRef(el, 0)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: WORKBENCH_VERSION, label: 'Workbench Release' },
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

          {/* Screenshots */}
          <div ref={(el) => addRef(el, 0.5)}>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Inside the Workbench</h2>
            <p className="text-secondary text-sm mb-6">
              Nine workspaces ship in {WORKBENCH_VERSION}:{' '}
              {modules.map((m, i) => (
                <span key={m}>
                  <span className="text-primary font-medium">{m}</span>
                  {i < modules.length - 1 ? ' · ' : ''}
                </span>
              ))}
              .
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {screenshots.map((shot) => (
                <figure key={shot.src} className="bg-void border border-gridline rounded-xl overflow-hidden flex flex-col">
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    loading="lazy"
                    className="w-full h-auto block border-b border-gridline"
                  />
                  <figcaption className="p-4">
                    <span className="text-cyan-300 font-semibold text-sm block mb-1">{shot.title}</span>
                    <span className="text-secondary text-xs leading-relaxed">{shot.caption}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Figures shown in these captures are single runs on one operator's machine, included to show the interface: not
              published benchmark results. No universal figures are published; run the included harness to measure your own hardware.
            </p>
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
                <a href={WIN_RELEASES} target="_blank" rel="noopener noreferrer" className="btn-cyan text-sm inline-block">
                  Windows release
                </a>
              </div>

              <div className="p-5 bg-void border border-gridline rounded-xl space-y-3">
                <h3 className="text-cyan-300 font-semibold text-base">Linux x64</h3>
                <p className="text-secondary text-xs leading-relaxed">
                  Native Debian package for amd64, bundling its own Python 3.11 runtime and Tcl/Tk: no system Python required.
                </p>
                <div className="bg-void/80 p-3 rounded-lg border border-gridline font-mono text-[11px] text-cyan-300 space-y-1 overflow-x-auto">
                  <div># Ubuntu / Debian / Mint</div>
                  <div>sudo apt install ./qector-workbench_0.5.3_amd64.deb</div>
                  <div className="pt-1"># antiX / MX Linux</div>
                  <div>sudo dpkg -i ./qector-workbench_0.5.3_amd64.deb</div>
                  <div>sudo apt-get -f install</div>
                </div>
                <ul className="text-xs space-y-1 text-secondary list-disc pl-4">
                  <li>Launch: <code className="text-cyan-300">qector-workbench</code></li>
                  <li>MCP server: <code className="text-cyan-300">qector-workbench --mcp</code></li>
                  <li>Runtime data: <code className="text-cyan-300">~/.local/share/QectorWorkbench</code></li>
                </ul>
                <a href={LINUX_RELEASES} target="_blank" rel="noopener noreferrer" className="btn-cyan text-sm inline-block">
                  Linux release
                </a>
              </div>
            </div>

            <div className="p-4 bg-cyan-300/5 border border-cyan-300/20 rounded-xl text-xs text-secondary leading-relaxed">
              <strong className="text-primary">Linux compatibility:</strong> built on a glibc 2.31 baseline: Ubuntu 20.04+,
              Debian 11+, Linux Mint 20+, antiX 21+ / MX 21+, Fedora 32+, openSUSE Leap 15.3+, and newer.
              <br />
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
                  All 16 decoder kinds exposed through the Workbench MCP server. No benchmark figures are published on the site: run the included harness to measure your own hardware.
                </p>
              </div>
              <span className="text-xs px-3 py-1 bg-cyan-300/10 border border-cyan-300/20 text-cyan-300 rounded-full font-mono">
                qector_decoder_v3 v0.7.0 (bundled)
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Workbench {WORKBENCH_VERSION} ships <strong className="text-secondary">16 decoders</strong>; all 16 are listed
              below and exposed through the Workbench MCP server in this build.
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
              Workbench {WORKBENCH_VERSION} covers <strong className="text-primary">10 code families</strong>, including qLDPC
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
                  desc: 'CustomTkinter desktop UI for Windows and Linux. Visual circuit builder, syndrome viewer, decoder performance dashboard, and a distance slider covering d3–d63 on supported families.',
                },
                {
                  name: '56 MCP Tools',
                  desc: 'Native Model Context Protocol server over stdio JSON-RPC 2.0, launched with --mcp and usable headlessly with no display. Connects AI agents directly to decoder execution and benchmarking.',
                },
                {
                  name: 'Fully Self-Contained',
                  desc: 'Bundles its own Python runtime, the scientific stack, and the qector_decoder_v3 0.7.0 wheel. No system Python, pip, or internet connection required, and no online update checks.',
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
                  desc: 'Export in Markdown, HTML, JSON, LaTeX, PDF, and SVG, plus .zenodo.json and CITATION.cff deposit sidecars: a five-figure publication suite in 8 formats.',
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
              title="Documentation &amp; Reference"
              statement={`QECTOR Workbench ${WORKBENCH_VERSION} documentation is published alongside the app release and on this site. No universal benchmark figures are published; run the included harness to measure your own hardware. Manuals ship inside each release alongside SHA-256 checksums.`}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <a
                href={WIN_RELEASES}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors"
              >
                <div className="text-xs text-muted-foreground uppercase mb-1">Manuals &amp; EULA</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">GitHub Releases</div>
                <div className="text-xs text-secondary mt-1">API Reference, MCP guide, Quick Start, per-OS manual</div>
              </a>

              <Link
                to="/evidence"
                className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors"
              >
                <div className="text-xs text-muted-foreground uppercase mb-1">Validation &amp; Evidence</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">qector.store/evidence</div>
                <div className="text-xs text-secondary mt-1">Validation reports and SHA-256 sealed artifact manifests</div>
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
