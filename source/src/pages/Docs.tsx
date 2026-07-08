import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO } from '../lib/seo';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Docs() {
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

  const docLinks = [
    { title: 'Technical Reference', desc: 'API documentation, decoder parameters, code examples', href: '/technical-reference' },
    { title: 'User Manual', desc: 'Installation, configuration, workflow guides', href: '/manual' },
    { title: 'Installation Guide', desc: 'Platform-specific setup instructions', href: '/installer' },
    { title: 'Benchmarks', desc: 'Performance comparisons and validation data', href: '/benchmarks' },
    { title: 'Evidence & Reports', desc: 'Validation artifacts and reproducibility data', href: '/evidence' },
    { title: 'Changelog', desc: 'Version history and release notes', href: '/changelog' },
  ];

  return (
    <>
      <SEO
        title="Documentation · QECTOR"
        description="Documentation hub for QECTOR quantum error correction decoder. API reference, user manual, installation guides, and validation reports."
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            Python 3.9–3.13 · Linux · macOS · Windows
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">Documentation</h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Install, configure, and integrate QECTOR Decoder v3 with your QEC stack.
            Stim, PyMatching, Sinter, and Qiskit compatible.
          </p>
          <div className="inline-block px-6 py-3 bg-void border border-gridline rounded-xl font-mono text-sm text-cyan-300">
            pip install qector-decoder-v3
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Quick Install */}
          <div ref={(el) => addRef(el, 0)} className="card-surface text-center">
            <h2 className="text-xl font-bold mb-4">Quick Install</h2>
            <div className="p-4 bg-void rounded-xl font-mono text-sm text-muted-foreground inline-block text-left">
              pip install qector-decoder-v3
            </div>
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <Link to="/installer" className="btn-outline text-sm">Full Installation Guide</Link>
              <Link to="/manual" className="btn-outline text-sm">User Manual</Link>
            </div>
          </div>

          {/* Doc Grid */}
          <div ref={(el) => addRef(el, 1)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docLinks.map((doc) => (
              <Link
                key={doc.title}
                to={doc.href}
                className="card-surface group hover:border-cyan-300/30 transition-all"
              >
                <h3 className="text-cyan-300 font-semibold group-hover:text-cyan-200 transition-colors mb-1">{doc.title}</h3>
                <p className="text-secondary text-sm">{doc.desc}</p>
              </Link>
            ))}
          </div>

          {/* External Resources */}
          <div ref={(el) => addRef(el, 2)} className="card-surface">
            <h2 className="text-xl font-bold mb-4">External Resources</h2>
            <div className="flex flex-col gap-3">
              <a href="https://github.com/GuillaumeLessard/qector-decoder" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-void rounded-xl hover:bg-surface transition-colors">
                <span className="text-2xl">🤖</span>
                <div>
                  <div className="text-primary font-medium text-sm">GitHub Repository</div>
                  <div className="text-muted-foreground text-xs">Source code, issues, and contributions</div>
                </div>
              </a>
              <a href="https://pypi.org/project/qector-decoder-v3/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-void rounded-xl hover:bg-surface transition-colors">
                <span className="text-2xl">📦</span>
                <div>
                  <div className="text-primary font-medium text-sm">PyPI Package</div>
                  <div className="text-muted-foreground text-xs">Latest release and installation</div>
                </div>
              </a>
              <a href="https://github.com/GuillaumeLessard/qector-decoder" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-void rounded-xl hover:bg-surface transition-colors">
                <span className="text-2xl">📋</span>
                <div>
                  <div className="text-primary font-medium text-sm">GitHub Artifacts &amp; Validation</div>
                  <div className="text-muted-foreground text-xs">github.com/GuillaumeLessard/qector-decoder</div>
                </div>
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
