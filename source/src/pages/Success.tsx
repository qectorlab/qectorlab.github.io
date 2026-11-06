import { Link, useSearchParams } from 'react-router-dom';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';

/**
 * Stripe success_url landing page.
 *
 * stripe_integration.py sends buyers here:
 *   success_url = https://www.qector.store/success?session_id={CHECKOUT_SESSION_ID}
 * Before this page existed the route 404'd, so every completed payment landed on
 * the NotFound page. The session id is surfaced as a support reference and as the
 * support reference for the fulfilment worker's protected ledger.
 */
export default function Success() {
  const [params] = useSearchParams();
  const raw = params.get('session_id') ?? '';
  // Stripe leaves the literal placeholder if success_url was never templated.
  const sessionId = /^cs_(live|test)_[A-Za-z0-9]{10,}$/.test(raw) ? raw : '';

  // Only a real Stripe Checkout redirect says "payment received". Anyone who
  // opens /success/ directly gets help finding their licence instead.
  if (!sessionId) {
    return (
      <>
        <SEO title="Your QECTOR licence · QECTOR" description="Where to find your QECTOR licence token, manage your subscription or get help." noindex />
        <section className="relative py-24 md:py-32 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
          <div className="relative z-10 section-padding max-w-2xl mx-auto">
            <div className="eyebrow-pill mb-6">Licence help</div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">Looking for your licence?</h1>
            <p className="text-secondary text-lg leading-relaxed mb-8">
              This page confirms a purchase right after Stripe checkout. If you bought a plan, your licence token is in the
              e-mail you used at checkout, usually within 10 minutes (check spam).
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pricing" className="btn-gold">View plans</Link>
              <a href="https://billing.stripe.com/p/login/7sY9AVdwlgoyfse9bYeUU00" className="btn-cyan" target="_blank" rel="noopener noreferrer">Manage subscription</a>
              <a href="mailto:admin@qector.store" className="btn-outline">E-mail support</a>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Purchase complete · QECTOR"
        description="Your QECTOR Decoder v3 license is being issued. Activation instructions and your Stripe reference."
        noindex
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="eyebrow-pill mb-6">
            Payment received
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="Thank you" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Stripe has confirmed your payment. Your{' '}
            <span className="text-primary font-semibold">Ed25519-signed license token</span>{' '}
            is issued automatically and sent to the email address you used at checkout.
          </p>

          {sessionId && (
            <div className="max-w-2xl mx-auto p-4 bg-void rounded-xl text-left">
              <div className="text-cyan-300 font-semibold text-xs uppercase tracking-wider mb-2">
                Stripe reference
              </div>
              {/* Rendered as text, never as markup: the value comes from the URL. */}
              <code className="text-secondary text-sm break-all">{sessionId}</code>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto space-y-8">

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">What happens next</h2>
            <ol className="space-y-4 text-secondary text-sm leading-relaxed">
              <li>
                <strong className="text-primary">1. Check your email.</strong> The license
                token arrives within a few minutes. If nothing has appeared after 15
                minutes, check spam, then contact us with the reference above.
              </li>
              <li>
                <strong className="text-primary">2. Activate it.</strong> Set the token as
                both licence environment variables:
                <div className="mt-2 p-4 bg-void rounded-xl">
                  <code className="text-cyan-300 text-sm break-all">
                    export QECTOR_LICENSE="&lt;your-token&gt;"
                    <br />
                    export QECTOR_LICENSE_KEY="&lt;your-token&gt;"
                  </code>
                </div>
                <span className="block mt-2">
                  Windows PowerShell:{' '}
                  <code className="text-cyan-300">$env:QECTOR_LICENSE = "&lt;your-token&gt;"; $env:QECTOR_LICENSE_KEY = "&lt;your-token&gt;"</code>
                </span>
              </li>
              <li>
                <strong className="text-primary">3. Verify.</strong> Confirm the signature
                validates: this makes no network call:
                <div className="mt-2 p-4 bg-void rounded-xl">
                  <code className="text-cyan-300 text-sm break-all">
                    python -c "import qector_decoder_v3 as q; print(q.get_license_info()['tier'])"
                  </code>
                </div>
                <span className="block mt-2">
                  This should print your paid tier (for example <code className="text-cyan-300">Pro</code> or <code className="text-cyan-300">Enterprise</code>), not <code className="text-cyan-300">Community</code>.
                </span>
              </li>
            </ol>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Keep the token safe</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Your token is tied to your checkout email and verifies offline against a
              public key embedded in the package. There is no license server and no
              phone-home, so it keeps working on air-gapped machines and inside CI.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/installer" className="btn-cyan">Install QECTOR</Link>
            <Link to="/docs" className="btn-outline">Read the docs</Link>
            <a href="mailto:admin@qector.store" className="btn-outline">Contact support</a>
          </div>

        </div>
      </section>
    </>
  );
}

