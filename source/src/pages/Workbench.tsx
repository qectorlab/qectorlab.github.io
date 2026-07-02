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

export default function Workbench() {
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
        title="Workbench · QECTOR"
        description="SATI OS Workbench — full-stack QEC workbench with GUI, FastAPI REST, dual CLI, MCP server, headless engine, and 17 HAL adapters."
      />

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
            all integrated with QECTOR Decoder v3 for end-to-end QEC workflows.
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
            statement="SATI OS v1.0.0 (build 1.0.0.0) is officially released. It is delivered as a self-contained PE-versioned Windows executable (qector.exe) featuring 39 GUI panels, FastAPI server, dual CLIs, and MCP server. Free LCL-free open core with optional AES-256-GCM encrypted LCL-832 premium plugin."
          />

          {/* CTA */}
          <div className="text-center">
            <Link to="/contact" className="btn-cyan">Request Commercial License</Link>
          </div>

        </div>
      </section>
    </>
  );
}
