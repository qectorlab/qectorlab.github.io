import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO, JsonLd } from '../lib/seo';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePyPIVersion } from '../hooks/usePyPIVersion';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const { version: pypiVersion } = usePyPIVersion();

  useEffect(() => {
    const sections = sectionsRef.current.filter(Boolean);
    sections.forEach((section) => {
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
        title="About · QECTOR"
        description="About QECTOR: Guillaume Lessard, iD01t Productions, QEC research background, ORCID, GitHub artifacts, mission and engineering philosophy."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Person',
              name: 'Guillaume Lessard',
              alternateName: "El'Nox Rah",
              url: 'https://qector.store/about',
              sameAs: ['https://orcid.org/0009-0000-3465-3753', 'https://github.com/GuillaumeLessard'],
              affiliation: { '@type': 'Organization', name: 'iD01t Productions' },
              jobTitle: 'Independent QEC Researcher & Software Engineer',
              knowsAbout: ['Quantum Error Correction', 'CSS Codes', 'LDPC Codes', 'MWPM Decoding', 'Rust', 'Python'],
            },
            {
              '@type': 'Organization',
              name: 'iD01t Productions',
              url: 'https://qector.store',
              founder: { '@type': 'Person', name: 'Guillaume Lessard' },
              description: 'Independent multidisciplinary studio: QEC software, electronic music, cyberpunk fiction, game development.',
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse-dot" />
            iD01t Productions · Longueuil, Québec · ORCID 0009-0000-3465-3753
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">About QECTOR</h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Independent quantum error correction research, engineering, and commercialization -
            built by <span className="text-cyan-300 font-semibold">Guillaume Lessard</span> with full transparency,
            reproducible artifacts, and no speculative claims.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://github.com/GuillaumeLessard/qector-decoder" target="_blank" rel="noopener noreferrer" className="btn-outline">GitHub</a>
            <a href="https://github.com/GuillaumeLessard/qector-decoder" target="_blank" rel="noopener noreferrer" className="btn-outline">GitHub</a>
            <Link to="/contact" className="btn-cyan">Contact</Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding pb-24">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Creator */}
          <div ref={(el) => addRef(el, 0)} className="card-surface">
            <h3 className="text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-4">Creator</h3>
            <p className="text-primary text-lg mb-3">
              <strong>Guillaume Lessard</strong>, independent multidisciplinary creator and researcher based in Montreal / Longueuil, Québec, Canada.
            </p>
            <p className="text-secondary leading-relaxed mb-4">
              Operating under <strong>iD01t Productions</strong> since 2024, Guillaume works simultaneously across quantum error correction software engineering, electronic music production, game development, and publishing (268+ titles).
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-secondary text-sm">Publishing aliases:</span>
              <span className="px-2 py-1 bg-surface rounded text-xs text-muted-foreground font-mono">Guillaume Lessard</span>
              <span className="text-muted-foreground text-xs self-center">→ engineering</span>
              <span className="px-2 py-1 bg-surface rounded text-xs text-muted-foreground font-mono">El'Nox Rah</span>
              <span className="text-muted-foreground text-xs self-center">→ research / authorship</span>
              <span className="px-2 py-1 bg-surface rounded text-xs text-muted-foreground font-mono">DJ iD01t</span>
              <span className="text-muted-foreground text-xs self-center">→ music</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="https://orcid.org/0009-0000-3465-3753" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/20 rounded-lg text-sm text-green-400 font-mono hover:bg-green-400/20 transition-colors">
                🆔 ORCID 0009-0000-3465-3753
              </a>
              {[
                { label: 'GitHub Artifacts', href: 'https://github.com/GuillaumeLessard/qector-decoder', external: true },
                { label: 'GitHub', href: 'https://github.com/GuillaumeLessard/qector-decoder', external: true },
                { label: 'PyPI', href: 'https://pypi.org/project/qector-decoder-v3/', external: true },
                { label: 'Play Store Book', href: 'https://play.google.com/store/books/details?id=dGXuEQAAQBAJ', external: true },
              ].map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-surface border border-gridline rounded-lg text-sm text-muted-foreground hover:text-cyan-300 hover:border-cyan-300/30 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div ref={(el) => addRef(el, 1)} className="card-surface">
              <h3 className="text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-4">Research Background</h3>
              <ul className="space-y-2 text-secondary text-sm leading-relaxed list-disc pl-5">
                <li>CSS stabilizer codes: surface codes, LDPC, qLDPC</li>
                <li>MWPM (Blossom), Belief-Matching, BP-OSD decoding</li>
                <li>SATI CODEX: <code className="text-cyan-300 text-xs">[[832,10,4]]</code> CSS code on genus-5 surface, with IBM Quantum operational verification on ibm_fez</li>
                <li>SATI v18: <code className="text-cyan-300 text-xs">[[72,12,6]]</code> Bivariate Bicycle QLDPC targeting IBM hardware</li>
                <li>Reproducible provenance and SHA-256 sealed artifacts on GitHub</li>
                <li>Monte Carlo FSS threshold analysis, Z₁₂ monodromy algebra, Jones polynomial verification</li>
              </ul>
            </div>
            <div ref={(el) => addRef(el, 2)} className="card-surface">
              <h3 className="text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-4">Software Stack</h3>
              <ul className="space-y-2 text-secondary text-sm leading-relaxed list-disc pl-5">
                <li>Rust / PyO3 - core decoder engine</li>
                <li>Python 3.10+ - API, CLI, benchmarking, simulation</li>
                <li>Stim - circuit-level noise simulation</li>
                <li>OpenCL / CUDA - GPU-accelerated batch decoding</li>
                <li>PyPI distribution - <code className="text-cyan-300 text-xs">qector-decoder-v3</code></li>
                <li>HMAC-JWT commercial license enforcement</li>
                <li>NiceGUI / CustomTkinter - SATI OS desktop interface</li>
              </ul>
            </div>
            <div ref={(el) => addRef(el, 3)} className="card-surface">
              <h3 className="text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-4">Engineering Philosophy</h3>
              <ul className="space-y-2 text-secondary text-sm leading-relaxed list-disc pl-5">
                <li>Reproducibility first - every claim ships with verifiable artifacts</li>
                <li>Honest documentation - Decoder is Source-Available (not free); Workbench GUI app is free</li>
                <li>Simulation-validated before any public benchmark claim</li>
                <li>Full provenance trail - DOI, SHA-256 bundles, IBM job IDs</li>
                <li>No vendor lock-in - pluggable CodeProvider architecture</li>
                <li>Transparent validation reports with non-pass classification</li>
              </ul>
            </div>
            <div ref={(el) => addRef(el, 4)} className="card-surface">
              <h3 className="text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-4">QECTOR Product Scope (qectorlab)</h3>
              <p className="text-xs text-secondary mb-2">This site and QECTOR Decoder v3 + Workbench are the high-performance decoder library + professional GUI. Broader QECTOR vision (LCL-833, full SATI CODEX theoretical work) is research context - see GitHub for details.</p>
              <ul className="space-y-2 text-secondary text-sm leading-relaxed list-disc pl-5">
                <li><strong className="text-primary">QECTOR Decoder v3</strong>: Rust/Python multi-algorithm QEC decoder library (Source-Available)</li>
                <li><strong className="text-primary">Free Qector Workbench v3.4</strong>: Professional GUI, MCP, benchmarks (fully free)</li>
                <li><strong className="text-primary">SATI OS</strong>: Full commercial stack on top (GUI + HALs + support)</li>
                <li><strong className="text-primary">Research</strong>: SATI CODEX, LCL codes, "Mastering QEC" book - cross-linked on GitHub</li>
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div ref={(el) => addRef(el, 5)} className="card-surface">
            <h3 className="text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-4">Project Timeline</h3>
            <div className="space-y-4">
              {[
                { year: '2024', event: 'iD01t Productions established. Initial QEC research begins: CSS codes, surface code simulation with Stim, MWPM benchmarking against PyMatching.' },
                { year: '2025 Q1', event: 'SATI CODEX LCL-832 framework developed: [[832,10,4]] CSS code on genus-5 surface. IBM Quantum hardware runs on ibm_fez. Artifacts on GitHub.' },
                { year: '2025 Q2', event: 'QECTOR Decoder v3 core engine written in Rust / PyO3. Initial PyPI releases. Belief-Matching, BP-OSD, Union-Find decoders integrated. SATI OS desktop UI scaffolded.' },
                { year: '2025 Q3', event: 'SATI v18 Titan-Class [[72,12,6]] BB QLDPC code environment. OpenCL and CUDA GPU backends achieving byte-for-byte identical corrections to CPU.' },
                { year: '2025 Q4-2026', event: `v${pypiVersion} Decoder (Source-Available) + free QectorWorkbench GUI v3.4 (25 tools, 10/10 polish). SATI OS full suite on top.` },
                { year: '2026 Q2', event: 'SATI OS v1.0.0 (build 1.0.0.0) first GA release. Features 39-panel desktop GUI, FastAPI server, dual CLIs, MCP server, and LCL-free open core with optional premium LCL-832 plugin. 1204 tests passing.' },
              ].map((item) => (
                <div key={item.year} className="flex gap-4 items-start pb-4 border-b border-gridline/50 last:border-0">
                  <span className="text-cyan-300 font-mono text-sm min-w-[80px] pt-0.5">{item.year}</span>
                  <p className="text-secondary text-sm leading-relaxed">{item.event}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transparency Statement */}
          <div ref={(el) => addRef(el, 6)} className="p-6 bg-green-400/5 border border-green-400/20 rounded-2xl">
            <h3 className="text-green-400 font-semibold text-sm uppercase tracking-wider mb-3">Transparency Statement</h3>
            <p className="text-secondary text-sm leading-relaxed">
              QECTOR is an independent R&D project, not backed by a quantum hardware company, VC funding, or a university lab.
              All claims are simulation-validated using Stim + PyMatching cross-validation. IBM hardware runs are real but limited in scope.
              QECTOR Decoder is Source-Available (not free). The Workbench GUI is free. Latest from PyPI RSS. We publish validation reports, non-pass counts, and known limitations openly.
              What you see is what you get.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
