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
        title="Workbench · QECTOR"
        description="SATI OS Workbench — full-stack QEC workbench with GUI, FastAPI REST, dual CLI, MCP server, headless engine, and 17 HAL adapters."
      />

      {/* New free QECTOR Workbench note */}
      <div className="bg-emerald-950/50 border-b border-emerald-500/30 py-2 text-center text-sm">
        <span className="text-emerald-400 font-semibold">New &amp; Free:</span> QECTOR Workbench v3.4.0 GUI for the Decoder — <a href="https://github.com/qectorlab/qector-decoder-workbench/releases/tag/v3.4.0" className="underline hover:text-emerald-300" target="_blank" rel="noopener noreferrer">Download the production package</a> (CustomTkinter, 25 MCP tools, 10/10 polished).
      </div>

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-400/10 border border-gold-400/20 rounded-full text-xs font-semibold text-gold-400 uppercase tracking-wider mb-6">
            GA Released · 1,204 Tests · 17 HAL Adapters · Windows Native
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="SATI OS Workbench" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Desktop GUI, FastAPI REST, dual CLI, MCP server, and{' '}
            <span className="text-cyan-300 font-semibold">17 hardware abstraction adapters</span> across 21 backend targets —
            SATI OS is the full suite. It integrates the new QECTOR Decoder v3 (v{pypiVersion || '0.6.2'}) and the new free QectorWorkbench GUI v3.4.0 (CustomTkinter, 25 tools, premium docs) with advanced commercial layers: 17 HAL adapters, expanded MCP, REST/CLI, and production support.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-cyan">Get License Key</Link>
            <Link to="/sati-os" className="btn-outline">Platform Overview</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Stats */}
          <div ref={(el) => addRef(el, 0)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '1,204', label: 'Tests Passing' },
              { value: '93 tools', label: 'MCP Server' },
              { value: '17', label: 'HAL Adapters' },
              { value: '21', label: 'Backends' },
            ].map((s) => (
              <div key={s.label} className="card-surface text-center">
                <div className="text-cyan-300 font-bold text-3xl mb-1">{s.value}</div>
                <div className="text-secondary text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div ref={(el) => addRef(el, 1)}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Workbench Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Desktop GUI', desc: 'NiceGUI-based cross-platform interface. Visual circuit builder, syndrome viewer, decoder comparison dashboard.' },
                { name: 'FastAPI REST Server', desc: 'Full REST API for remote decoder access. OpenAPI documentation. Async request handling.' },
                { name: 'Dual CLI', desc: 'Interactive CLI (rich) and headless batch CLI for scripting and CI/CD integration.' },
                { name: 'MCP Server', desc: 'Model Context Protocol server for AI assistant integration. Zero-config deployment.' },
                { name: 'Headless Engine', desc: 'Run decoding pipelines without GUI. Perfect for HPC clusters and cloud deployment.' },
                { name: 'HAL Adapters', desc: '17 hardware abstraction layer adapters for IBM Quantum, AWS Braket, Azure Quantum, and custom backends.' },
              ].map((f) => (
                <AlgorithmCard key={f.name} title={f.name} desc={f.desc} />
              ))}
            </div>
          </div>

          {/* QEC Interactive Sandbox */}
          <div ref={(el) => addRef(el, 3)} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Decoder Sandbox</h2>
            <p className="text-secondary text-sm">
              SATI OS bundles full-fidelity visual debuggers. Below is an interactive sandbox replicating the basic topological 1D/2D planar code matching module inside SATI OS. Click to inject errors and inspect Blossom correction paths.
            </p>
            <QECSimulator />
          </div>

          {/* IBM Verified */}
          <div ref={(el) => addRef(el, 2)}>
            <EvidenceBlock
              title="IBM Quantum Verified"
              statement="Workbench configurations verified on IBM Quantum hardware including ibm_fez and ibm_kingston. GHZ entanglement fidelity F=0.874 at 7 qubits. Repetition-code bit-flip suppression Lambda ~2.5–3.5."
            />
            <div className="flex flex-wrap gap-2 mt-3 px-1">
              {['ibm_fez', 'ibm_kingston', 'ibm_brisbane', 'ibm_sherbrooke'].map((dev) => (
                <span key={dev} className="px-3 py-1.5 bg-void border border-gridline rounded-lg text-xs text-muted-foreground font-mono">{dev}</span>
              ))}
            </div>
          </div>

          {/* Status */}
          <EvidenceBlock
            title="Release Status"
            statement={`SATI OS v1.0.0 is the full commercial suite. The new free core is QECTOR Decoder v3 (v${pypiVersion || '0.6.2'}) + QectorWorkbench GUI v3.4 (open, polished, MCP-enabled). SATI OS adds the complete production stack (39 panels, 122 routes, 17 HAL adapters, 93+ tool MCP) plus commercial licensing and support.`}
          />

          {/* Install */}
          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">SATI OS Installation</h2>
            <p className="text-secondary text-sm mb-3">Self-contained Windows (10/11 x64) per-user install. No admin or Python required. ~3-4 GB. Default: %LOCALAPPDATA%\Programs\SATI OS.</p>
            <ul className="text-sm space-y-1 text-secondary list-disc pl-5">
              <li>Graphical: Double-click SATI_OS_Setup.exe, read/accept EULA (checkbox required), click Install. Creates Start Menu + Desktop shortcuts.</li>
              <li>Silent/Unattended: SATI_OS_Setup.exe /SILENT /ACCEPTEULA or powershell -File Install-SATI_OS.ps1 -Silent -AcceptEula.</li>
              <li>Launch: qector.exe (no args = full desktop GUI with 39 panels). CLI commands: campaign, decode, bench, doctor, providers, workbench, mcp (e.g. qector.exe campaign --code lcl832).</li>
              <li>Uninstall: Settings &gt; Apps or the registry entry under HKCU\...\Uninstall\SATI_OS.</li>
            </ul>
            <p className="text-xs mt-2 text-muted-foreground">BETA. Simulation-validated only (not fault-tolerant hardware). Full terms in EULA.txt. Support: admin@qector.store.</p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/contact" className="btn-cyan">Request Commercial License</Link>
          </div>

        </div>
      </section>
    </>
  );
}
