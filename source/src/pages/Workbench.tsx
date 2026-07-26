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

  return (
    <>
      <SEO
        title="QECTOR Workbench v3.5.1 · Free QEC Desktop App & MCP Server"
        description="QECTOR Workbench v3.5.1 — Free cross-platform desktop GUI (Windows, Linux, macOS) for QECTOR Decoder v3. 47 MCP tools, 13 decoders, 9 code families, visual circuit builder, and offline decoding."
      />

      {/* Free QECTOR Workbench Notice */}
      <div className="bg-emerald-950/50 border-b border-emerald-500/30 py-2.5 text-center text-sm px-4">
        <span className="text-emerald-400 font-semibold">Free &amp; Open Application:</span> QECTOR Workbench v3.5.1 (CustomTkinter GUI + 47 MCP tools) —{' '}
        <a
          href="https://doi.org/10.5281/zenodo.21363016"
          className="underline hover:text-emerald-300 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download User Manual &amp; Package (DOI: 10.5281/zenodo.21363016)
        </a>
      </div>

      {/* Hero */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-400/10 border border-gold-400/20 rounded-full text-xs font-semibold text-gold-400 uppercase tracking-wider mb-6">
            v3.5.1 Released · 47 MCP Tools · 13 Decoders · 9 Code Families · Windows &amp; Linux Apps
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="QECTOR Workbench v3.5.1" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            The free desktop application and MCP server for{' '}
            <span className="text-cyan-300 font-semibold">QECTOR Decoder v3</span> (v{pypiVersion}).
            CustomTkinter GUI, visual circuit builder, syndrome inspector, 47 AI model tools, REST engine, and dual CLI.
            On first launch, it automatically fetches and installs <code className="text-cyan-300">qector-decoder-v3</code> from PyPI, then runs 100% offline.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://doi.org/10.5281/zenodo.21363016"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyan"
            >
              Download Workbench App (Zenodo)
            </a>
            <Link to="/docs" className="btn-outline">
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Stats Grid */}
          <div ref={(el) => addRef(el, 0)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 'v3.5.1', label: 'App Release' },
              { value: '47', label: 'MCP Tools' },
              { value: '13', label: 'Decoder Algorithms' },
              { value: '9', label: 'Code Families' },
            ].map((s) => (
              <div key={s.label} className="card-surface text-center">
                <div className="text-cyan-300 font-bold text-3xl mb-1">{s.value}</div>
                <div className="text-secondary text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Core App Features */}
          <div ref={(el) => addRef(el, 1)}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Workbench Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'CustomTkinter GUI',
                  desc: 'Polished cross-platform desktop UI (Windows, Linux, macOS). Visual circuit builder, syndrome viewer, and decoder comparison dashboard.',
                },
                {
                  name: '47 MCP Tools',
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
          <div ref={(el) => addRef(el, 2)} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Decoder Sandbox</h2>
            <p className="text-secondary text-sm">
              Below is an interactive sandbox replicating the basic topological 1D/2D planar code matching module inside QECTOR Workbench. Click to inject errors and inspect Blossom correction paths in real time.
            </p>
            <QECSimulator />
          </div>

          {/* Archival Records & DOIs */}
          <div ref={(el) => addRef(el, 3)}>
            <EvidenceBlock
              title="Archival Documentation & DOIs"
              statement="QECTOR Workbench v3.5.1 documentation and performance benchmark datasets are archived with permanent Digital Object Identifiers (DOIs) on Zenodo."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <a
                href="https://doi.org/10.5281/zenodo.21363016"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors"
              >
                <div className="text-xs text-muted-foreground uppercase mb-1">User Manual &amp; Licensing</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">DOI: 10.5281/zenodo.21363016</div>
                <div className="text-xs text-secondary mt-1">Full manual, Windows &amp; Linux editions</div>
              </a>

              <a
                href="https://doi.org/10.5281/zenodo.21339300"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors"
              >
                <div className="text-xs text-muted-foreground uppercase mb-1">Performance Benchmarks</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">DOI: 10.5281/zenodo.21339300</div>
                <div className="text-xs text-secondary mt-1">Master report, 1,858 timing measurements</div>
              </a>

              <a
                href="https://doi.org/10.5281/zenodo.21320543"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors"
              >
                <div className="text-xs text-muted-foreground uppercase mb-1">Architecture Whitepaper</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">DOI: 10.5281/zenodo.21320543</div>
                <div className="text-xs text-secondary mt-1">Technical specification &amp; design</div>
              </a>
            </div>
          </div>

          {/* Installation & Operating System Guides */}
          <div ref={(el) => addRef(el, 4)} className="card-surface space-y-6">
            <h2 className="text-2xl font-bold">App Installation &amp; Execution</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-void border border-gridline rounded-xl space-y-2">
                <h3 className="text-cyan-300 font-semibold text-base">Windows Edition (10 / 11 x64)</h3>
                <p className="text-secondary text-xs leading-relaxed">
                  Distributed as a standalone Windows app (<code className="text-cyan-300">QECTOR_User_Manual_Windows.pdf</code> reference). No separate Python or pip setup required.
                </p>
                <ul className="text-xs space-y-1 text-secondary list-disc pl-4">
                  <li>Run <code className="text-cyan-300">qector-workbench.exe</code> or launch shortcut.</li>
                  <li>First launch connects to PyPI to fetch <code className="text-cyan-300">qector-decoder-v3==0.6.9</code>.</li>
                  <li>Operates 100% offline after initial setup.</li>
                </ul>
              </div>

              <div className="p-4 bg-void border border-gridline rounded-xl space-y-2">
                <h3 className="text-cyan-300 font-semibold text-base">Linux Edition (Ubuntu / Debian / RHEL)</h3>
                <p className="text-secondary text-xs leading-relaxed">
                  Cross-platform Python application (<code className="text-cyan-300">QECTOR_User_Manual_Linux.pdf</code> reference).
                </p>
                <ul className="text-xs space-y-1 text-secondary list-disc pl-4">
                  <li>Requires system <code className="text-cyan-300">python3</code> and <code className="text-cyan-300">python3-pip</code>.</li>
                  <li>Launch command: <code className="text-cyan-300">python3 -m qector_workbench</code>.</li>
                  <li>Auto-installs <code className="text-cyan-300">qector-decoder-v3==0.6.9</code> on first launch.</li>
                </ul>
              </div>
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
