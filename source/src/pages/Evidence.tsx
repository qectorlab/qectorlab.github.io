import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import AlgorithmCard from '../components/AlgorithmCard';
import EvidenceBlock from '../components/EvidenceBlock';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, Github, ExternalLink, Lock } from 'lucide-react';
import { ZENODO_RECORDS } from '../lib/releases';

gsap.registerPlugin(ScrollTrigger);

const REPORTS_DATA = [
  {
    title: 'Official User Manual v1.0.0',
    desc: 'QECTOR Decoder v3 Reference Manual v1.0.0 (August 2026, DOI 10.5281/zenodo.21941046): the normative source for decoder contracts and claim boundaries.',
    status: 'Verified',
  },
  {
    title: 'SHA-256 Sealed Artifact Manifests',
    desc: 'Source and artifact releases are SHA-256 sealed on GitHub, so every published build can be reproduced and verified byte-for-byte.',
    status: 'Verified',
  },
  {
    title: 'Syndromic Validation Harness',
    desc: 'Decode runs verify H·c = s on every shot through the self-debugging harness shipped in the package, with the harness published on GitHub.',
    status: 'Verified',
  },
  {
    title: 'Scoped Methodology and Limitations',
    desc: 'The manual excludes hardware-bound performance figures and documents the metadata, confidence intervals, and artifact requirements for future measurements.',
    status: 'Methodology',
  },
];

export default function Evidence() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    const ctx = gsap.context(() => {
    sectionsRef.current.filter(Boolean).forEach((section) => {
      gsap.fromTo(section, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 85%', once: true },
      });
    });
    });
    return () => { ctx.revert(); };
  }, []);

const addRef = (el: HTMLDivElement | null, index: number) => { if (el) sectionsRef.current[index] = el; };

  const filteredReports = REPORTS_DATA.filter(
    (report) => selectedStatus === 'All' || report.status === selectedStatus
  );

  return (
    <>
      <SEO
        title="Evidence & Reports · QECTOR"
        description="Validation reports, reproducible artifacts, and evidence bundles for QECTOR quantum error correction decoder. Available on GitHub."
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-400/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-400/10 border border-green-400/20 rounded-full text-xs font-semibold text-green-400 uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
            Verified v1.0.0 Manual · SHA-256 Sealed Manifests
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="Evidence & Reports" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Every public claim is backed by a verifiable artifact: the six-record Zenodo evidence corpus,
            validation reports, and SHA-256 sealed manifests archived on GitHub.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://github.com/GuillaumeLessard/qector-decoder" target="_blank" rel="noopener noreferrer" className="btn-cyan">GitHub Repository →</a>
            <Link to="/technical-reference" className="btn-outline">Technical Reference</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Artifacts CTA Grid */}
          <div ref={(el) => addRef(el, 0)} className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/GuillaumeLessard/qector-decoder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-300/10 border border-cyan-300/20 rounded-2xl hover:bg-cyan-300/20 transition-all"
            >
              <Github className="w-6 h-6 text-cyan-300" aria-hidden="true" />
              <div className="text-left">
                <div className="text-cyan-300 font-semibold">GitHub Artifacts &amp; Validation</div>
                <div className="text-muted-foreground text-sm">github.com/GuillaumeLessard/qector-decoder</div>
              </div>
            </a>
              <a
                href="/docs/reference.md"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gold-400/10 border border-gold-400/20 rounded-2xl hover:bg-gold-400/20 transition-all"
              >
                <FileText className="w-6 h-6 text-gold-400" aria-hidden="true" />
              <div className="text-left">
                <div className="text-gold-400 font-semibold">Official User Manual v1.0.0</div>
                <div className="text-muted-foreground text-sm">qector.store/docs/reference.md</div>
              </div>
            </a>
          </div>

          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
            {['All', 'Verified', 'Methodology'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-300 ${
                  selectedStatus === status
                    ? 'bg-cyan-300 text-void border-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.35)]'
                    : 'bg-[#0b1329]/40 text-secondary border-gridline hover:text-primary hover:border-cyan-300/40'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Reports Grid */}
          <div ref={(el) => addRef(el, 1)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((report) => (
              <AlgorithmCard
                key={report.title}
                title={report.title}
                badge={{
                  label: report.status,
                  color: report.status === 'Verified' ? 'green' : 'gold',
                }}
                desc={report.desc}
                proof={report.proof}
              />
            ))}
          </div>

          {/* Zenodo Evidence Registry */}
          <div ref={(el) => addRef(el, 1.5)} className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Zenodo Evidence Registry</h2>
              <p className="text-secondary text-sm mt-1">
                The complete six-record evidence corpus for QECTOR Decoder v3 v1.0.0. Each record is a DOI-stable,
                versioned deposit with its scope and date listed below.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gridline text-cyan-300 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">DOI</th>
                    <th className="py-3 px-3">Scope</th>
                    <th className="py-3 px-3 hidden md:table-cell">Title</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gridline/50">
                  {ZENODO_RECORDS.map((rec) => (
                    <tr key={rec.id} className="hover:bg-surface/30 transition-colors">
                      <td className="py-3 px-3">
                        <a
                          href={rec.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-cyan-300 hover:underline inline-flex items-center gap-1"
                        >
                          10.5281/zenodo.{rec.id}
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      </td>
                      <td className="py-3 px-3 text-secondary text-xs">{rec.kindLabel}</td>
                      <td className="py-3 px-3 text-muted-foreground text-xs hidden md:table-cell">{rec.title}</td>
                      <td className="py-3 px-3 text-muted-foreground text-xs font-mono whitespace-nowrap">{rec.date}</td>
                      <td className="py-3 px-3 text-xs whitespace-nowrap">
                        {rec.access === 'open' ? (
                          <span className="text-green-400">open</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gold-400">
                            <Lock className="w-3 h-3" aria-hidden="true" /> embargoed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Document deposits carry their own document-level publication licence; software licensing
              (PolyForm Noncommercial / commercial) is separate and governed by the{' '}
              <Link to="/license" className="text-cyan-300 hover:underline">licence page</Link>. The embargoed record is
              restricted source custody and is not part of the public evidence set.
            </p>
          </div>

          {/* Reproducibility */}
          <div ref={(el) => addRef(el, 2)} className="card-surface">
            <h3 className="text-cyan-300 font-semibold mb-3">Verify on Your Own Machine</h3>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              No universal benchmark figures are published on this site, because results depend on your hardware.
              The package ships the qector-doctor environment diagnostic and the qector bench harness so you can
              validate and measure on your own machines. Run them yourself:
            </p>
            <div className="p-4 bg-void rounded-xl font-mono text-sm text-muted-foreground">
              <div className="text-cyan-300 mb-2"># Quick validation</div>
              <div>pip install qector-decoder-v3==1.0.0</div>
              <div>python -c &quot;import qector_decoder_v3 as qd; print(qd.__version__)&quot;</div>
              <div className="mt-2"># 15-check environment diagnostic (v1.0.0)</div>
              <div>qector-doctor</div>
              <div className="mt-2"># Throughput benchmark on a generated surface-code circuit</div>
              <div>qector bench -d 5 -r 5 -s 10000 --decoder blossom --noise 0.001</div>
            </div>
          </div>

          {/* Citation BibTeX */}
          <div className="card-surface">
            <h3 className="text-cyan-300 font-semibold mb-3">How to Cite QECTOR</h3>
            <p className="text-secondary text-xs leading-relaxed mb-3">
              If you use QECTOR Decoder v3 or its validation artifacts in academic research, please cite our software artifact release:
            </p>
            <pre className="p-4 bg-void border border-gridline rounded-xl text-xs text-muted-foreground font-mono overflow-x-auto select-all">
{`@software{lessard2026qector,
  author  = {Guillaume Lessard},
  title   = {{QECTOR Decoder v3}: Rust/Python Quantum Error Correction Decoding Platform},
  year    = {2026},
  version = {1.0.0},
  url     = {https://www.qector.store},
  note    = {Source-available under PolyForm Noncommercial 1.0.0. Commercial license required for commercial use.}
}`}
            </pre>
          </div>

          {/* Transparency */}
          <EvidenceBlock
            title="Our Transparency Commitment"
            statement={`We publish all validation results: passes, non-passes, and known limitations. All numeric claims link to GitHub artifact releases. We do not hide non-passes behind aggregate statistics.`}
          />

        </div>
      </section>
    </>
  );
}
