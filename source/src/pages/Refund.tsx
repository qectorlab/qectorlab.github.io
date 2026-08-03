import { Link } from 'react-router';
import { SEO } from '../lib/seo';

// Refund policy. Required as a distinct, linkable page: Stripe asks for a
// published refund policy on the first chargeback, and "all sales final" is
// only defensible if the buyer could read it before paying. Kept indexable
// (unlike /terms and /privacy) so it is reachable from a dispute case file.
export default function Refund() {
  return (
    <>
      <SEO
        title="Refund Policy · QECTOR"
        description="QECTOR Decoder v3 refund policy. License tokens are delivered instantly and are non-refundable; the $499 60-day evaluation is the creditable way to evaluate before committing."
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-gridline rounded-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            All prices in USD · Instant digital delivery · Last updated August 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">Refund Policy</h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            QECTOR commercial licenses are digital goods delivered immediately on payment.
            All sales are final. The <Link to="/pricing" className="text-cyan-300 hover:underline">$499 evaluation</Link> exists
            so you can validate QECTOR before committing to an annual tier.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto space-y-8">

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">All sales are final</h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              Every commercial license is an Ed25519-signed token issued and emailed within minutes of successful payment.
              Because the licensed rights and the token are delivered in full and immediately, and cannot be returned or
              revoked once received, commercial licenses are <strong className="text-primary">non-refundable</strong>.
              This applies to the Commercial Evaluation License, all annual tiers, and the perpetual license.
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              By completing checkout you acknowledge that delivery begins immediately and that you are purchasing a
              non-refundable digital license.
            </p>
          </div>

          <div className="card-surface border-cyan-300/25">
            <h2 className="text-xl font-bold mb-4">Evaluate first — that is what the $499 tier is for</h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              We would rather you test than request a refund. The Commercial Evaluation License is a flat, non-recurring
              <strong className="text-primary"> $499</strong> for 60 days with unlimited internal seats, intended for
              benchmarking, integration testing, and architecture assessment against your own workloads.
            </p>
            <ul className="text-secondary text-sm space-y-1.5">
              <li>• It does not auto-renew and is not a subscription.</li>
              <li>• It is 100% creditable toward any annual tier purchased within 90 days of your evaluation start.</li>
              <li>• Example: $499 evaluation, then Solo/Indie within the window — you pay $800, not $1,299.</li>
              <li>• To claim the credit, email your Stripe invoice number to admin@qector.store and we invoice the difference.</li>
            </ul>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Delivery problems are not refund matters — we fix them</h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              If your token never arrives, arrives corrupted, is tied to the wrong email, or fails offline verification,
              that is a delivery fault on our side. Do not open a dispute — email{' '}
              <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a> with your
              Stripe invoice number and we will reissue or correct it, at no cost and with no expiry on that obligation.
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              Tokens usually arrive in under 10 minutes. If it has been longer, check your spam folder first — automated
              license mail is a common false positive.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Duplicate and mistaken charges</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Accidental duplicate purchases of the same tier for the same organization, and charges made in obvious
              error, are refunded in full on request. Email admin@qector.store with both Stripe invoice numbers within
              30 days of the charge.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Cancelling an annual license</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Annual licenses are term licenses, not recurring subscriptions — they do not auto-renew, so there is nothing
              to cancel. Your rights simply run for the term you paid for, and we contact you before the term ends.
              Stopping use partway through a term does not generate a partial refund.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Statutory rights</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Nothing in this policy limits or waives rights that cannot be waived under the consumer-protection law that
              applies to you. Where a non-waivable right to cancel a digital purchase exists and you have not yet been
              issued or used a license token, contact us and we will honour it.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Currency and tax</h2>
            <p className="text-secondary text-sm leading-relaxed">
              All prices are quoted and charged in <strong className="text-primary">US dollars (USD)</strong>, exclusive of tax.
              Stripe adds any applicable sales tax, GST/HST, or VAT at checkout based on your billing location. Tax collected
              on a completed sale is remitted to the relevant authority and is refundable only where that authority allows it;
              tax-exempt organizations should provide a registration number at checkout rather than seek a refund afterward.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Seller and contact</h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              Licenses are sold by <strong className="text-primary">Guillaume Lessard</strong>, sole proprietor, trading as
              iD01t Productions, Québec, Canada. Payments are processed by Stripe; card details never reach QECTOR systems.
            </p>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              Registered address: 2004 De Lorimier, Longueuil, Québec, Canada, J4K 3H7.
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              Refund and billing questions:{' '}
              <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>.
              Typical response time is 1 business day. See also{' '}
              <Link to="/terms" className="text-cyan-300 hover:underline">Terms</Link> and{' '}
              <Link to="/license" className="text-cyan-300 hover:underline">License</Link>.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
