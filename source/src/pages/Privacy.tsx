import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';

export default function Privacy() {
  return (
    <>
      <SEO title="Privacy Policy · QECTOR" description="Privacy policy for QECTOR website and services." />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-gridline rounded-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            No ad networks · No data sold · Last updated September 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"><NeuralReveal text="Privacy Policy" className="text-4xl md:text-6xl font-extrabold" /></h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            We collect only what's needed to respond to your inquiry.
            No third-party ad networks. We do not sell your personal information. If this ever changes, we will update this policy and obtain your consent first.
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
            <h2 className="text-xl font-bold mb-4">Data controller</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Data controller: Guillaume Lessard, sole proprietor trading as iD01t Productions,
              2004 De Lorimier, Longueuil, Quebec, Canada, J4K 3H7. Privacy contact:{' '}
              <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Data We Collect</h2>
            <ul className="space-y-2 text-secondary text-sm leading-relaxed list-disc pl-5">
              <li><strong className="text-primary">Contact form:</strong> Name, email, organization, referral source, evaluation timeline, message - stored only to respond to your inquiry.</li>
              <li><strong className="text-primary">Usage analytics:</strong> Standard server access logs only (no first-party analytics, no advertising). Third-party scripts loaded on this site (the Stripe buy-button script on pricing pages, the Calendly scheduling widget on the contact page) and third-party services you use directly (Stripe checkout) operate under their own privacy policies.</li>
              <li><strong className="text-primary">Technical logs:</strong> Standard server logs (IP address, user agent) retained for a limited period for security purposes.</li>
            </ul>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Cookies and third-party trackers</h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              We do not run ad networks and we do not set advertising cookies. Two third-party
              integrations load their own scripts on this site:
            </p>
            <ul className="space-y-2 text-secondary text-sm leading-relaxed list-disc pl-5">
              <li><strong className="text-primary">Stripe buy-button script</strong> (js.stripe.com), loaded automatically on the pricing pages. Purpose: payment processing. See the <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">Stripe Privacy Policy</a>.</li>
              <li><strong className="text-primary">Calendly scheduling widget</strong>, loaded on the contact page. Purpose: booking appointments. See the <a href="https://calendly.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">Calendly Privacy Policy</a>.</li>
            </ul>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">How We Use Data</h2>
            <ul className="space-y-2 text-secondary text-sm leading-relaxed list-disc pl-5">
              <li>Respond to inquiries and support requests</li>
              <li>Improve website and product experience</li>
              <li>Send product updates you have opted into</li>
              <li>Detect and prevent abuse</li>
            </ul>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Data retention</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Technical access logs are retained for a maximum of 12 months. Contact inquiries
              are retained for 3 years.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Data Sharing</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We do not sell, rent, or trade your personal information. Data is only shared with:
            </p>
            <ul className="space-y-2 text-secondary text-sm leading-relaxed list-disc pl-5 mt-3">
              <li>Service providers necessary for operation (hosting, email delivery, scheduling, payment processing)</li>
              <li>When required by law or to protect our rights</li>
            </ul>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">International transfers and payments</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Some data is processed outside Canada by our providers (Stripe in the United States
              for payments, Calendly in the United States for scheduling). Card details are handled
              solely by Stripe and never touch our servers.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Your Rights</h2>
            <p className="text-secondary text-sm leading-relaxed">
              You have the right to access, correct, or delete your personal data. You also have the
              right to data portability, to object to or restrict processing, and to withdraw consent
              at any time. You may lodge a complaint with your data protection authority
              (Commission d'accès à l'information du Québec, or your EU supervisory authority).
              Contact us at{' '}
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
