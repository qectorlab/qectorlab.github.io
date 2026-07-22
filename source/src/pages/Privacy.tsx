import { SEO } from '../lib/seo';

export default function Privacy() {
  return (
    <>
      <SEO title="Privacy Policy · QECTOR" description="Privacy policy for QECTOR website and services." noindex />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-gridline rounded-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            No ad tracking · No data sold · Last updated June 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">Privacy Policy</h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            We collect only what's needed to respond to your inquiry.
            No third-party ad networks. No data sold. Ever.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto space-y-8">

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Overview</h2>
            <p className="text-secondary text-sm leading-relaxed">
              QECTOR (operated by iD01t Productions) respects your privacy. This policy explains what data we collect,
              how we use it, and your rights. We minimize data collection and do not sell your personal information.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Data We Collect</h2>
            <ul className="space-y-2 text-secondary text-sm leading-relaxed list-disc pl-5">
              <li><strong className="text-primary">Contact form:</strong> Name, email, organization, message - stored only to respond to your inquiry.</li>
              <li><strong className="text-primary">Usage analytics:</strong> Standard server access logs only (no page-view analytics, no cookies, no tracking scripts).</li>
              <li><strong className="text-primary">Technical logs:</strong> Standard server logs (IP address, user agent) retained for 30 days for security.</li>
            </ul>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">How We Use Data</h2>
            <ul className="space-y-2 text-secondary text-sm leading-relaxed list-disc pl-5">
              <li>Respond to inquiries and support requests</li>
              <li>Improve website and product experience</li>
              <li>Send occasional product updates (only if you opt in)</li>
              <li>Detect and prevent abuse</li>
            </ul>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Data Sharing</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We do not sell, rent, or trade your personal information. Data is only shared with:
            </p>
            <ul className="space-y-2 text-secondary text-sm leading-relaxed list-disc pl-5 mt-3">
              <li>Service providers necessary for operation (hosting, email delivery)</li>
              <li>When required by law or to protect our rights</li>
            </ul>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Your Rights</h2>
            <p className="text-secondary text-sm leading-relaxed">
              You have the right to access, correct, or delete your personal data. Contact us at{' '}
              <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a> to exercise these rights.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Contact</h2>
            <p className="text-secondary text-sm leading-relaxed">
              For privacy-related questions, contact us at{' '}
              <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
