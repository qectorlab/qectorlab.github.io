import { Link } from 'react-router';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';

export default function License() {
  return (
    <>
      <SEO title="License · QECTOR" description="QECTOR Decoder v3 is licensed under PolyForm Noncommercial License 1.0.0. Commercial licenses available." />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            PolyForm Noncommercial 1.0.0 · Free for Research · Commercial by Written Agreement
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"><NeuralReveal text="License" className="text-4xl md:text-6xl font-extrabold" /></h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            QECTOR Decoder v3 is <span className="text-primary font-semibold">Source-Available</span> (not free for commercial use).
            Free for personal, academic, and non-commercial research.
            Commercial use requires a written agreement from <span className="text-cyan-300 font-semibold">$499</span> (evaluation) or <span className="text-cyan-300 font-semibold">$1,299/yr</span>. The Workbench GUI is free.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/pricing" className="btn-cyan">View Pricing</Link>
            <a href="mailto:admin@qector.store" className="btn-outline">Contact for Commercial</a>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto space-y-8">

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Community License</h2>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              QECTOR Decoder v3 is released under the <strong className="text-primary">PolyForm Noncommercial License 1.0.0</strong>.
              This means you can use, modify, and distribute the software for non-commercial purposes free of charge.
            </p>
            <div className="p-4 bg-void rounded-xl">
              <h3 className="text-cyan-300 font-semibold text-sm mb-2">Permitted (Non-Commercial)</h3>
              <ul className="space-y-1 text-secondary text-sm">
                <li>• Personal research and learning</li>
                <li>• Academic research and teaching</li>
                <li>• Non-commercial open-source projects</li>
                <li>• Publishing benchmark results (with attribution)</li>
              </ul>
            </div>
            <div className="p-4 bg-void rounded-xl mt-4">
              <h3 className="text-gold-400 font-semibold text-sm mb-2">Requires Commercial License</h3>
              <ul className="space-y-1 text-secondary text-sm">
                <li>• Commercial product integration</li>
                <li>• Internal commercial R&D with value extraction</li>
                <li>• Government and defense contracts</li>
                <li>• Redistribution in commercial products</li>
                <li>• SaaS / hosted API usage</li>
              </ul>
            </div>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Commercial License</h2>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              Commercial licenses grant internal use rights, written agreements, priority support, and
              validation packages. See <Link to="/pricing" className="text-cyan-300 hover:underline">Pricing</Link> for tier details.
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              All commercial licenses include: written license agreement, commercial use rights (internal),
              reproducible artifact bundles, and priority bug review. No redistribution or OEM rights included by default;
              contact <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a> for OEM/SaaS licensing.
            </p>
          </div>

          {/* Commercial addendum. Buyers and their legal teams need to know
              exactly what the paid tier changes over PolyForm Noncommercial,
              and, just as importantly, what it does not change in the package. */}
          <div className="card-surface border-gold-400/25">
            <h2 className="text-xl font-bold mb-4">Commercial Addendum: What a Paid License Changes</h2>
            <ul className="space-y-2 text-secondary text-sm">
              <li>• Grants the commercial use that PolyForm Noncommercial withholds, for the seats and term you purchased.</li>
              <li>• <strong className="text-primary">Internal use only.</strong> Redistribution, sublicensing, OEM bundling, and customer-facing SaaS or hosted APIs are excluded unless a written Enterprise/OEM agreement grants them.</li>
              <li>• Activated by setting <code className="text-cyan-300 font-mono text-xs">QECTOR_LICENSE</code> to your Ed25519 token. Verification is offline against a public key embedded in the package: no license server, no phone-home, works air-gapped.</li>
              <li>• <strong className="text-primary">The package is identical for licensed and unlicensed users.</strong> Without a token, a licensing notice prints on import (suppressible with <code className="text-cyan-300 font-mono text-xs">QECTOR_SILENT=1</code>). No functionality is gated, degraded, or disabled.</li>
              <li>• No warranty, indemnification, exclusivity, trademark, or patent grant is included by default.</li>
            </ul>
            <p className="text-secondary text-sm leading-relaxed mt-4">
              Tokens are delivered instantly and all sales are final: see the{' '}
              <Link to="/refund" className="text-cyan-300 hover:underline">Refund Policy</Link>. The $499 evaluation is the
              creditable way to evaluate before committing.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Full License Text</h2>
            <p className="text-secondary text-sm leading-relaxed">
              The complete, authoritative PolyForm Noncommercial License 1.0.0 text is published at{' '}
              <a href="https://polyformproject.org/licenses/noncommercial/1.0.0/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                polyformproject.org/licenses/noncommercial/1.0.0
              </a>{' '}
              and is bundled verbatim with every package distribution (<code className="text-cyan-300 font-mono text-xs">LICENSE</code> in the wheel and sdist).
              The summaries on this page are for orientation only; where they differ from the license text, the license text governs.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Third-Party Licenses</h2>
            <p className="text-secondary text-sm leading-relaxed">
              QECTOR depends on several open-source projects including Stim (Apache 2.0), PyMatching (MIT),
              NumPy (BSD), and NetworkX (BSD). Full third-party attribution is included in the distribution.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
