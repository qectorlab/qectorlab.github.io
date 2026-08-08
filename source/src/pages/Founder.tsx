import { Link } from 'react-router';
import { SEO, JsonLd } from '../lib/seo';
import CalendlyWidget from '../components/CalendlyWidget';
import { CALENDLY_URL } from '../lib/config';

// Founder / biography page.
//
// This page exists for two reasons, and the second one is the important one:
//
//  1. Buyers of a one-person product want to know who is behind it.
//  2. Entity disambiguation. "Guillaume Lessard" is a common Québécois name
//     shared by other working professionals, and search engines currently
//     conflate them. The Person JSON-LD below: with a sameAs list of
//     identifiers that only this person controls (ORCID, GitHub, PyPI, itch.io,
//     Zenodo): is the mechanism that separates the entities. Keep sameAs
//     accurate and exhaustive; that is what does the work, not the prose.
//
// Everything stated here is verifiable from a linked primary source. Do not add
// credentials, affiliations, or figures that cannot be pointed at.

const ORCID = 'https://orcid.org/0009-0000-3465-3753';

const skillGroups = [
  {
    title: 'Systems & Performance',
    items: ['Rust', 'PyO3 bindings', 'C-adjacent FFI', 'CUDA / OpenCL batch kernels', 'Memory-layout and throughput tuning'],
  },
  {
    title: 'Python Engineering',
    items: ['Python 3.9–3.13', 'NumPy / SciPy', 'Binary wheel packaging (manylinux, macOS, Windows)', 'PyPI release engineering', 'Sigstore attestation'],
  },
  {
    title: 'Quantum Error Correction',
    items: ['MWPM / Blossom matching', 'Union-Find decoding', 'Belief propagation + OSD (qLDPC)', 'Stim / Sinter / PyMatching integration', 'Benchmark design and reproducibility'],
  },
  {
    title: 'Applications & Desktop',
    items: ['CustomTkinter GUI', 'Self-contained runtime bundling', 'PyInstaller / Inno Setup / .deb packaging', 'Model Context Protocol (MCP) servers', 'Offline-first architecture'],
  },
  {
    title: 'Web & Product',
    items: ['React + TypeScript', 'Vite', 'Tailwind', 'SEO and structured data', 'Stripe commerce integration'],
  },
  {
    title: 'Writing & Publishing',
    items: ['Technical documentation', 'Long-form instructional writing', 'Audiobook production', 'Electronic music production', 'Independent distribution'],
  },
];

export default function Founder() {
  return (
    <>
      <SEO
        title="Guillaume Lessard · Founder of QECTOR and iD01t Productions"
        description="Guillaume Lessard, software engineer, author, and independent researcher in Longueuil, Québec. Founder of iD01t Productions and creator of QECTOR Decoder v3. ORCID 0009-0000-3465-3753."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': 'https://qector.store/guillaume-lessard#person',
          name: 'Guillaume Lessard',
          givenName: 'Guillaume',
          familyName: 'Lessard',
          identifier: '0009-0000-3465-3753',
          jobTitle: 'Founder, Software Engineer and Independent Researcher',
          description:
            'Software engineer, author and independent researcher. Founder of iD01t Productions and author of the QECTOR Decoder v3 quantum error correction library.',
          image: 'https://qector.store/assets/g.png',
          url: 'https://qector.store/guillaume-lessard',
          email: 'admin@qector.store',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '2004 De Lorimier',
            addressLocality: 'Longueuil',
            addressRegion: 'QC',
            postalCode: 'J4K 3H7',
            addressCountry: 'CA',
          },
          worksFor: {
            '@type': 'Organization',
            name: 'iD01t Productions',
            url: 'https://id01t.store/',
            foundingDate: '2023',
          },
          knowsAbout: [
            'Quantum error correction',
            'Minimum-weight perfect matching decoders',
            'Belief propagation and OSD decoding',
            'Rust',
            'Python',
            'GPU batch computing',
            'Technical writing',
          ],
          sameAs: [
            ORCID,
            'https://github.com/GuillaumeLessard',
            'https://github.com/qectorlab',
            'https://pypi.org/project/qector-decoder-v3/',
            'https://id01t.itch.io/',
            'https://id01t.store/',
            'https://www.linkedin.com/in/qector/',
          ],
        }}
      />

      {/* HERO */}
      <section className="relative py-24 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
            <img
              src="/assets/g.png"
              alt="Portrait of Guillaume Lessard, founder of QECTOR and iD01t Productions"
              width={176}
              height={176}
              className="w-40 h-40 md:w-44 md:h-44 rounded-2xl object-cover border border-cyan-300/30 shadow-lg shrink-0"
            />
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-4">
                Founder · Developer · Author · Independent Researcher
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
                Guillaume Lessard
              </h1>
              <p className="text-secondary text-lg leading-relaxed mb-5">
                I build QECTOR. I am a professional software engineer with over two decades of experience. Today,
                I write Rust decoders for quantum error correction, publish the evidence that backs every claim I make,
                and ship everything independently from Longueuil, Québec.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs">
                <a href={ORCID} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-surface border border-gridline rounded-full text-secondary hover:text-cyan-300 hover:border-cyan-300/30 transition-all">
                  ORCID 0009-0000-3465-3753
                </a>
                <a href="https://github.com/qectorlab" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-surface border border-gridline rounded-full text-secondary hover:text-cyan-300 hover:border-cyan-300/30 transition-all">
                  GitHub
                </a>
                <a href="https://pypi.org/project/qector-decoder-v3/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-surface border border-gridline rounded-full text-secondary hover:text-cyan-300 hover:border-cyan-300/30 transition-all">
                  PyPI
                </a>
                <a href="https://id01t.store/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-surface border border-gridline rounded-full text-secondary hover:text-cyan-300 hover:border-cyan-300/30 transition-all">
                  iD01t Productions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* DISAMBIGUATION */}
          <div className="card-surface border-gold-400/25">
            <h2 className="text-xl font-bold mb-3">Making sure you have the right Guillaume Lessard</h2>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              It is a common Québécois name, and several accomplished professionals share it, including a compiler engineer who works
              on Swift and a real estate executive. None of them are me, and I claim none of their work. If you are
              evaluating QECTOR, verifying an invoice, or checking a citation, these are the primary identifiers I control:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                ['ORCID', '0009-0000-3465-3753', ORCID],
                ['GitHub', 'github.com/qectorlab', 'https://github.com/qectorlab'],
                ['PyPI', 'qector-decoder-v3', 'https://pypi.org/project/qector-decoder-v3/'],
                ['Studio', 'iD01t Productions, Longueuil QC', 'https://id01t.store/'],
                ['itch.io', 'id01t.itch.io', 'https://id01t.itch.io/'],
                ['Email', 'admin@qector.store', 'mailto:admin@qector.store'],
              ].map(([label, value, href]) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="p-3 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors"
                >
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="text-cyan-300 font-mono text-xs break-all">{value}</div>
                </a>
              ))}
            </div>
          </div>

          {/* BACKGROUND */}
          <div className="card-surface">
            <h2 className="text-2xl font-bold mb-4">Background</h2>
            <div className="space-y-4 text-secondary text-sm leading-relaxed">
              <p>
                My engineering philosophy is rooted in practical execution. Over the course of my career, I learned to build robust systems because I wanted to
                make things that worked in the real world. That has been the method ever since:
                pick the problem, learn what the problem requires, ship the result, publish the evidence.
              </p>
              <p>
                For most of the last twenty years that meant applications, tools, and books: {' '}
                <strong className="text-primary">167+ eBooks</strong> and <strong className="text-primary">103 audiobooks</strong>{' '}
                published, desktop utilities and games released independently, and six albums plus twenty-three singles produced
                as DJ iD01T during 2024 and 2025. I founded{' '}
                <a href="https://id01t.store/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">iD01t Productions</a>{' '}
                in 2023 to put all of it under one roof. It remains a focused one-person operation.
              </p>
              <p>
                Quantum error correction is where that approach currently points. QECTOR Decoder v3 is a Rust core behind a
                Python API implementing 15+ decoder configurations, with v1.0.0 as the first stable release (2026-08-06).
                No universal benchmark figures are published on the site, because results depend on your hardware; the
                qector bench harness ships in the package so you can measure on your own machines. Every claim is backed by a
                verifiable artifact, because a claim without an artifact is just marketing.
              </p>
              <p className="text-primary italic border-l-2 border-cyan-300/40 pl-4">
                We ship. Even tired. Even messy. Still shipping.
              </p>
            </div>
          </div>

          {/* WHAT I'VE SHIPPED */}
          <div>
            <h2 className="text-2xl font-bold mb-5">What I've shipped</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '167+', label: 'eBooks published' },
                { value: '103', label: 'Audiobooks' },
                { value: '20+', label: 'Years writing software' },
                { value: '2023', label: 'iD01t Productions founded' },
              ].map((s) => (
                <div key={s.label} className="card-surface text-center">
                  <div className="text-cyan-300 font-bold text-2xl mb-1">{s.value}</div>
                  <div className="text-secondary text-xs">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-5 bg-surface border border-gridline rounded-xl">
                <h3 className="text-cyan-300 font-semibold mb-2 text-sm">Quantum error correction</h3>
                <ul className="text-secondary text-xs space-y-1.5">
                  <li className="flex items-start gap-2"><span className="text-cyan-300">✓</span><span><Link to="/decoder" className="text-cyan-300 hover:underline font-semibold">QECTOR Decoder v3</Link>: Rust-core Python library, 15+ decoder configurations</span></li>
                  <li className="flex items-start gap-2"><span className="text-cyan-300">✓</span><span><Link to="/workbench" className="text-cyan-300 hover:underline font-semibold">QECTOR Workbench v0.5.3</Link>: free desktop GUI and 56-tool MCP server</span></li>
                  <li className="flex items-start gap-2"><span className="text-cyan-300">✓</span><span><Link to="/evidence" className="text-cyan-300 hover:underline font-semibold">Evidence &amp; Provenance</Link>: validation reports and SHA-256 sealed manifests on GitHub</span></li>
                  <li className="flex items-start gap-2"><span className="text-cyan-300">✓</span><span>Mastering QEC and the QEC Academy instructional series</span></li>
                </ul>
              </div>
              <div className="p-5 bg-surface border border-gridline rounded-xl">
                <h3 className="text-cyan-300 font-semibold mb-2 text-sm">Research &amp; publishing</h3>
                <ul className="text-secondary text-xs space-y-1.5">
                  <li className="flex items-start gap-2"><span className="text-cyan-300">✓</span><span>Work signed and traceable through ORCID and Zenodo</span></li>
                  <li className="flex items-start gap-2"><span className="text-cyan-300">✓</span><span>SATI CODEX and the LCL-832/833 corpora</span></li>
                  <li className="flex items-start gap-2"><span className="text-cyan-300">✓</span><span>Developer tools and games on itch.io</span></li>
                  <li className="flex items-start gap-2"><span className="text-cyan-300">✓</span><span>DJ iD01T: 6 albums, 23 singles (2024 to 2025)</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* SKILLS */}
          <div>
            <h2 className="text-2xl font-bold mb-5">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillGroups.map((group) => (
                <div key={group.title} className="p-5 bg-void border border-gridline rounded-xl">
                  <h3 className="text-cyan-300 font-semibold text-sm mb-3">{group.title}</h3>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="text-secondary text-xs flex items-start gap-2">
                        <span className="text-cyan-300 mt-0.5">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* BOOKING */}
          <div className="card-surface">
            <h2 className="text-2xl font-bold mb-2">Book a 30-minute call</h2>
            <p className="text-secondary text-sm mb-5">
              For a decoder audit, licensing questions, or an integration walkthrough, you will speak directly with me.
              Prefer email? <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>.
            </p>
            <CalendlyWidget url={CALENDLY_URL} />
          </div>

          {/* CTA */}
          <div className="text-center pt-2">
            <Link to="/pricing" className="btn-cyan">View Pricing &amp; Licensing</Link>
          </div>

        </div>
      </section>
    </>
  );
}
