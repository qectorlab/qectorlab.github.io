import { Link } from 'react-router-dom';
import { SEO, JsonLd } from '../lib/seo';
import CalendlyWidget from '../components/CalendlyWidget';
import { CALENDLY_URL } from '../lib/config';
import {
  CLAUDE_PLUGIN_RELEASE,
  PYPI_CURRENT_RELEASE,
  PYPI_FIRST_STABLE_RELEASE,
  PYPI_RELEASES,
  PYPI_WHEELS,
  PYTHON_RANGE,
  WORKBENCH_RELEASES,
} from '../lib/releases';

// Founder page. Two jobs:
//  1. Tell a buyer or employer, in one screen, who builds QECTOR and why the
//     work can be trusted.
//  2. Entity disambiguation: the Person JSON-LD sameAs list (identifiers only
//     this person controls) separates him from others with the same name.
// Everything stated here must be verifiable from a linked primary source.

const ORCID = 'https://orcid.org/0009-0000-3465-3753';
const LINKEDIN = 'https://www.linkedin.com/in/qector/';
const GITHUB = 'https://github.com/GuillaumeLessard';
const PYPI = 'https://pypi.org/project/qector-decoder-v3/';

const fmt = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

const current = PYPI_CURRENT_RELEASE;
const firstStable = PYPI_FIRST_STABLE_RELEASE;
const first = PYPI_RELEASES[PYPI_RELEASES.length - 1];
const workbench = WORKBENCH_RELEASES[0];

const FOCUS = [
  {
    title: 'Decoders that prove their output',
    body: 'A Rust core behind a Python API: Union-Find, exact MWPM, BP-OSD and Relay-BP for qLDPC codes, on CPU and GPU. Every correction is checked against its syndrome, H·c = s (mod 2).',
  },
  {
    title: 'Releases you can verify',
    body: 'Wheels built in public CI, tested on each operating system before publishing, with Sigstore provenance, PyPI attestations and Trusted Publishing.',
  },
  {
    title: 'Tools that stay offline',
    body: 'Air-gapped licensing with Ed25519 tokens, a schema-validated MCP server for Claude, and a self-contained desktop Workbench.',
  },
];

const RECORD: { date: string; title: string; detail: string; href: string }[] = [
  { date: current.releaseDate, title: `QECTOR Decoder v3 ${current.version}`, detail: `${PYPI_WHEELS} wheels for CPython ${PYTHON_RANGE}, tested per OS, Sigstore provenance on every file`, href: `https://github.com/GuillaumeLessard/qector-decoder/releases/tag/v${current.version}` },
  { date: CLAUDE_PLUGIN_RELEASE.releaseDate, title: `QECTOR Claude Plugin ${CLAUDE_PLUGIN_RELEASE.version}`, detail: 'Air-gapped, schema-validated MCP server for Claude Code and Claude Desktop', href: CLAUDE_PLUGIN_RELEASE.releaseUrl },
  { date: workbench.releaseDate, title: `QECTOR Workbench ${workbench.version}`, detail: `Free desktop GUI for Windows and Linux, ${workbench.decoderKinds} decoder kinds, ${workbench.codeFamilies} code families`, href: workbench.releaseUrl },
  { date: firstStable.releaseDate, title: `QECTOR Decoder v3 ${firstStable.version}`, detail: 'First stable release: API stability tiers, qector CLI, reference manual', href: PYPI },
  { date: first.releaseDate, title: `First public release (${first.version})`, detail: `Published on PyPI; ${PYPI_RELEASES.length} releases to date`, href: PYPI },
];

const PUBLICATIONS = [
  { title: 'QECTOR Decoder v3 User Manual (v1.0.0)', doi: '10.5281/zenodo.21611214' },
  { title: 'Normative Reference Manual (v1.0.0)', doi: '10.5281/zenodo.21941046' },
  { title: 'Verification and Proof Bundle', doi: '10.5281/zenodo.22046403' },
];

const EXPERTISE = [
  { area: 'Quantum error correction', items: 'MWPM and Blossom, Union-Find, BP-OSD and Relay-BP for qLDPC, detector error models, Stim and Sinter' },
  { area: 'Systems', items: 'Rust, PyO3, CUDA and OpenCL batch kernels, memory layout and throughput' },
  { area: 'Python and release engineering', items: 'Binary wheels for Linux, Windows and macOS, PyPI Trusted Publishing, Sigstore, supply-chain gates' },
  { area: 'Tooling and product', items: 'MCP servers, desktop apps, React and TypeScript, Stripe and licensing infrastructure' },
];

const IDS: [string, string, string?][] = [
  ['ORCID', '0009-0000-3465-3753', ORCID],
  ['GitHub', 'github.com/GuillaumeLessard', GITHUB],
  ['GitHub organisation', 'github.com/qectorlab', 'https://github.com/qectorlab'],
  ['PyPI', 'qector-decoder-v3', PYPI],
  ['LinkedIn', 'linkedin.com/in/qector', LINKEDIN],
  ['E-mail', 'admin@qector.store', 'mailto:admin@qector.store'],
];

export default function Founder() {
  return (
    <>
      <SEO
        title="Guillaume Lessard · Founder and Lead Engineer, QECTOR"
        description="Guillaume Lessard, founder and lead engineer of QECTOR: Rust and Python quantum error correction decoders, verifiable releases and offline licensing. Longueuil, Québec. ORCID 0009-0000-3465-3753."
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
          jobTitle: 'Founder and Lead Engineer, QECTOR',
          description:
            'Founder and lead engineer of QECTOR, a Rust and Python quantum error correction decoding platform. Founder of iD01t Productions.',
          image: 'https://qector.store/assets/g.png',
          url: 'https://qector.store/guillaume-lessard/',
          email: 'admin@qector.store',
          address: { '@type': 'PostalAddress', addressLocality: 'Longueuil', addressRegion: 'QC', addressCountry: 'CA' },
          worksFor: { '@type': 'Organization', name: 'iD01t Productions', foundingDate: '2012', url: 'https://qector.store/' },
          knowsAbout: ['Quantum error correction', 'Minimum-weight perfect matching', 'Belief propagation and OSD decoding', 'qLDPC codes', 'Rust', 'Python', 'GPU computing', 'Software supply-chain security'],
          sameAs: [ORCID, GITHUB, 'https://github.com/qectorlab', PYPI, LINKEDIN, 'https://id01t.itch.io/'],
        }}
      />

      {/* HERO */}
      <section className="relative pt-32 pb-16 md:pt-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
            <img
              src="/assets/g.png"
              alt="Guillaume Lessard"
              width={176}
              height={176}
              fetchPriority="high"
              className="w-44 h-44 rounded-2xl object-cover border border-cyan-300/30 shadow-lg shrink-0"
            />
            <div className="text-center md:text-left">
              <p className="text-cyan-300 text-sm font-semibold tracking-wide mb-2">Founder and Lead Engineer, QECTOR</p>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-4">Guillaume Lessard</h1>
              <p className="text-secondary text-lg leading-relaxed mb-6 max-w-2xl">
                I build quantum error correction decoders in Rust and Python, and the release and licensing infrastructure that lets
                teams trust them: corrections checked against their syndromes, wheels with verifiable provenance, and licences that work
                air-gapped. Based in Longueuil, Québec.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <a href="#book" className="btn-gold px-6 py-3 text-sm">Book a call</a>
                <a href="mailto:admin@qector.store" className="btn-outline px-6 py-3 text-sm">admin@qector.store</a>
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn-outline px-6 py-3 text-sm">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-14">

          {/* FOCUS */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">What I work on</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {FOCUS.map((f) => (
                <div key={f.title} className="card-surface">
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-secondary text-sm leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RECORD */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Track record</h2>
            <p className="text-secondary text-sm mb-6">Public releases, newest first. Each links to its release page.</p>
            <ol className="relative border-l border-gridline ml-2 space-y-6">
              {RECORD.map((r) => (
                <li key={r.title} className="pl-6 relative">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-300" aria-hidden="true" />
                  <time dateTime={r.date} className="text-xs font-mono text-muted-foreground">{fmt(r.date)}</time>
                  <h3 className="font-semibold text-primary">
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300">{r.title}</a>
                  </h3>
                  <p className="text-secondary text-sm">{r.detail}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* PUBLICATIONS */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Publications and records</h2>
            <p className="text-secondary text-sm mb-6">
              Manuals and verification material are archived with DOIs on Zenodo and linked to my{' '}
              <a href={ORCID} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">ORCID record</a>.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {PUBLICATIONS.map((p) => (
                <a key={p.doi} href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer" className="card-surface block hover:border-cyan-300/40">
                  <span className="block text-primary font-semibold text-sm mb-2">{p.title}</span>
                  <span className="block font-mono text-xs text-cyan-300 break-all">doi:{p.doi}</span>
                </a>
              ))}
            </div>
          </div>

          {/* EXPERTISE */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Expertise</h2>
            <dl className="card-surface divide-y divide-gridline/60 !py-2">
              {EXPERTISE.map((e) => (
                <div key={e.area} className="grid md:grid-cols-[14rem_1fr] gap-1 md:gap-6 py-4">
                  <dt className="text-primary font-semibold text-sm">{e.area}</dt>
                  <dd className="text-secondary text-sm">{e.items}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* BEYOND QEC */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="card-surface">
              <h2 className="text-xl font-bold mb-3">iD01t Productions</h2>
              <p className="text-secondary text-sm leading-relaxed">
                I founded iD01t Productions in 2012 as an independent studio. It publishes technical books, desktop software and games,
                and electronic music. QECTOR is its quantum error correction line, built and supported by me directly, so you always deal
                with the person who wrote the code.
              </p>
            </div>
            <div className="card-surface">
              <h2 className="text-xl font-bold mb-3">Verify my identity</h2>
              <p className="text-secondary text-sm leading-relaxed mb-4">
                Several people share my name. For invoices, citations or due diligence, these are the identifiers I control:
              </p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {IDS.map(([label, value, href]) => (
                  <li key={label}>
                    <a href={href} {...(href?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="block p-2.5 bg-void border border-gridline rounded-lg hover:border-cyan-300/40">
                      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
                      <span className="block font-mono text-xs text-cyan-300 break-all">{value}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* BOOKING */}
          <div id="book" className="card-surface scroll-mt-28">
            <h2 className="text-2xl font-bold mb-2">Book a 30-minute call</h2>
            <p className="text-secondary text-sm mb-5">
              Decoder evaluation, integration, licensing or research collaboration: you will speak with me directly. Prefer e-mail?{' '}
              <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>.
            </p>
            <CalendlyWidget url={CALENDLY_URL} />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/decoder" className="btn-cyan">Explore the decoder</Link>
            <Link to="/pricing" className="btn-outline">Plans and licensing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
