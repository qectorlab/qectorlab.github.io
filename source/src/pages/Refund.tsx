import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import { PRICES } from '../lib/pricing';

// Refund policy. Required as a distinct, linkable page: Stripe asks for a
// published refund policy on the first chargeback. Kept indexable (unlike
// /terms and /privacy) so it is reachable from a dispute case file. Must match
// the FAQ in src/lib/faqData.ts and the prerendered shell in prerenderData.ts.
export default function Refund() {
  return (
    <>
      <SEO
        title="Refund Policy · QECTOR"
        description={`QECTOR Decoder v3 refund policy: ${PRICES.refundDays}-day money-back guarantee on your first payment of any plan, cancel renewals any time, free ${PRICES.trialDays}-day trial before you buy.`}
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-gridline rounded-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            All prices in USD · Instant digital delivery · Last updated November 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"><NeuralReveal text="Refund Policy" className="text-4xl md:text-6xl font-extrabold" /></h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Try it free for {PRICES.trialDays} days, then buy with a {PRICES.refundDays}-day money-back guarantee.
            Plans renew automatically and you can cancel at any time. See{' '}
            <Link to="/pricing" className="text-cyan-300 hover:underline">Pricing</Link>.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto space-y-8">

          <div className="card-surface border-cyan-300/25">
            <h2 className="text-xl font-bold mb-4">{PRICES.refundDays}-day money-back guarantee</h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              If QECTOR is not right for you, email{' '}
              <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a> with your
              Stripe receipt within {PRICES.refundDays} days of your <strong className="text-primary">first payment</strong> of
              any plan (Pro monthly or annual, Pro Perpetual, Team, Lab or the Pilot). We refund it in full, no questions asked,
              and revoke the licence token.
            </p>
            <ul className="text-secondary text-sm space-y-1.5">
              <li>• One guarantee per organisation; it applies to the first purchase, not to later renewals.</li>
              <li>• Refunds go back to the original payment method through Stripe, usually within 5–10 business days.</li>
              <li>• Once refunded, the licence ends and the token must no longer be used.</li>
            </ul>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Try before you buy: free {PRICES.trialDays}-day trial</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Request a free {PRICES.trialDays}-day commercial trial on the{' '}
              <Link to="/pricing" className="text-cyan-300 hover:underline">pricing page</Link>. No card is needed and the
              token simply expires, so there is nothing to cancel or refund. Larger evaluations can use the
              {' '}{PRICES.pilotDays}-day Pilot, which is covered by the same money-back guarantee.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Renewals and cancelling</h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              Pro (monthly or annual), Team and Lab are subscriptions and <strong className="text-primary">renew automatically</strong>{' '}
              until cancelled. We email a reminder 14 days before each annual renewal. Cancel any time from the link in your
              Stripe receipt or by emailing admin@qector.store; your licence stays valid until the end of the period you paid for.
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              Renewal payments are not refunded pro rata. If a renewal went through that you meant to cancel and you have not
              used the renewed term, write to us within 7 days and we will refund it. Pro Perpetual and the Pilot are one-time
              payments and never renew.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Delivery problems are not refund matters: we fix them</h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              If your token never arrives, arrives corrupted, is tied to the wrong email, or fails offline verification,
              that is a delivery fault on our side. Do not open a dispute: email{' '}
              <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a> with your
              Stripe receipt and we will reissue or correct it, at no cost and with no expiry on that obligation.
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              Tokens are issued and emailed within minutes of successful payment (usually under 10 minutes). If it has been
              longer, check your spam folder first: automated licence mail is a common false positive.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Duplicate and mistaken charges</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Accidental duplicate purchases of the same plan for the same organisation, and charges made in obvious
              error, are always refunded in full. Email admin@qector.store with both Stripe receipts within 30 days of
              the charge.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Statutory rights</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Nothing in this policy limits or waives rights that cannot be waived under the consumer-protection law that
              applies to you, including the Québec Consumer Protection Act where it applies.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Currency and tax</h2>
            <p className="text-secondary text-sm leading-relaxed">
              All prices are quoted and charged in <strong className="text-primary">US dollars (USD)</strong>, exclusive of tax.
              Any applicable sales tax, GST/HST or VAT is calculated and added at checkout from your billing address, and is
              refunded together with the price when a payment is refunded. Businesses can enter a VAT/GST number at checkout.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Seller and contact</h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              Licences are sold by <strong className="text-primary">Guillaume Lessard</strong>, sole proprietor, trading as
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
