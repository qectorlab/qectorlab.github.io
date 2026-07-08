import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePyPIVersion } from '../hooks/usePyPIVersion';

gsap.registerPlugin(ScrollTrigger);

export default function SatiOs() {
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
        title="SATI OS · QECTOR"
        description="SATI OS v1.0.0 — full-stack QEC platform with GUI, FastAPI REST, dual CLI, MCP server, headless engine, and 17 HAL adapters. Windows-native GA release."
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            GA Released · Windows Native · 1,204 Tests Passing
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="SATI OS v1.0.0" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            SATI OS is the full commercial QEC suite built on the new QECTOR Decoder v3 (Source Available, v{pypiVersion}) + the new free QectorWorkbench GUI v3.4 — desktop GUI (39 panels), FastAPI REST (122 routes), dual CLI, MCP server,
            and <span className="text-cyan-300 font-semibold">17 hardware abstraction adapters</span> across 21 backend targets.
            The core decoder is Source Available; the Workbench GUI app is free. Full SATI OS adds commercial HAL adapters, expanded MCP, support, and enterprise features.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-cyan">Get License Key</Link>
            <Link to="/workbench" className="btn-outline">View Workbench</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Status */}
          <div ref={(el) => addRef(el, 0)} className="p-6 bg-cyan-300/5 border border-cyan-300/20 rounded-2xl text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-medium text-cyan-300 uppercase tracking-wider mb-3">
              GA Released (v1.0.0)
            </span>
            <p className="text-secondary text-sm leading-relaxed">
              SATI OS v1.0.0 is officially released as a production-grade software package.
              It consists of an LCL-free open core workbench, plus an optional AES-256-GCM encrypted LCL-832 premium plugin.
              Self-contained Windows executable (qector.exe). Per-user install to %LOCALAPPDATA%\Programs\SATI OS, no admin rights required (~3-4 GB). Simulation-validated QEC platform (BETA). See EULA for full terms.
            </p>
          </div>

          {/* Installation */}
          <div ref={(el) => addRef(el, 3)} className="card-surface">
            <h2 className="text-xl font-bold mb-4">Installation (SATI OS Setup)</h2>
            <p className="text-secondary text-sm mb-4">
              Download SATI_OS_Setup.exe from the distribution. Per-user install to <code>%LOCALAPPDATA%\Programs\SATI OS</code>. No Python or admin rights needed.
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-primary">Graphical:</strong> Run SATI_OS_Setup.exe, accept EULA, click Install. Creates Start Menu + Desktop shortcuts.
              </div>
              <div>
                <strong className="text-primary">Silent/Unattended:</strong> <code>SATI_OS_Setup.exe /SILENT /ACCEPTEULA</code> or use Install-SATI_OS.ps1 -Silent -AcceptEula.
              </div>
              <div>
                <strong className="text-primary">Launch:</strong> No args opens full GUI. CLI: <code>qector.exe campaign|decode|bench|doctor|providers|workbench|mcp</code>.
              </div>
              <div>
                <strong className="text-primary">Uninstall:</strong> Settings &gt; Apps or registry entry.
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Windows 10/11 x64 only. ~3-4 GB disk. See EULA for terms (simulation-validated software, not hardware fault-tolerant system).</p>
          </div>

          {/* Architecture */}
          <div ref={(el) => addRef(el, 1)}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Platform Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { layer: 'Presentation', items: ['NiceGUI Desktop App', '39 panels (fail-soft)', 'Web Dashboard'] },
                { layer: 'API Layer', items: ['FastAPI (122 routes)', 'MCP Server (93 tools)', '2 WebSocket Endpoints'] },
                { layer: 'Engine Layer', items: [`New QECTOR Decoder v3 (Source Available, v${pypiVersion})`, 'New free QectorWorkbench GUI v3.4', 'Headless + Stim/PyMatching'] },
                { layer: 'Hardware Layer', items: ['17 HAL Adapters', '21 Backend Targets', 'IBM live-exercised'] },
                { layer: 'Data Layer', items: ['Circuit Storage', 'Syndrome Database', 'Artifact Manager'] },
                { layer: 'License Layer', items: ['HMAC-JWT Enforcement', 'AES-256-GCM cryptography', 'Scrypt Key Derivation'] },
              ].map((layer) => (
                <div key={layer.layer} className="card-surface">
                  <h3 className="text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-3">{layer.layer}</h3>
                  <ul className="space-y-1.5">
                    {layer.items.map((item) => (
                      <li key={item} className="text-secondary text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Test Stats */}
          <div ref={(el) => addRef(el, 2)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '1,204', label: 'Tests Passing', sub: '0 failed' },
              { value: '93 tools', label: 'MCP Server', sub: '0 defects' },
              { value: '17', label: 'HAL Adapters', sub: '21 backends' },
              { value: 'Windows', label: 'Native Installer', sub: 'PowerShell / Setup' },
            ].map((s) => (
              <div key={s.label} className="card-surface text-center">
                <div className="text-cyan-300 font-bold text-3xl mb-1">{s.value}</div>
                <div className="text-primary text-sm font-medium">{s.label}</div>
                <div className="text-muted-foreground text-xs">{s.sub}</div>
              </div>
            ))}
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
