import { useEffect } from 'react';
import { SEO } from '../lib/seo';

export default function Pricing() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const faqItems = [
    {
      q: 'How is the license delivered?',
      a: 'There are no license keys, tokens, or software lockouts to manage. Your Stripe receipt serves as your active legal contract. Your team continues to use the un-throttled, standard package via pip install qector-decoder-v3.'
    },
    {
      q: 'What happens after the 60 days expire?',
      a: 'This is a flat, non-recurring evaluation window. Your team is legally cleared to run internal simulations using QECTOR for 60 consecutive days. If you need to extend usage or transition to an annual corporate deployment contract, contact us at licensing@qector.store.'
    },
    {
      q: 'Does this include redistribution rights?',
      a: 'No. This tier provides strict clearance for internal evaluation and R&D pipelines only. If you want to bundle QECTOR binaries inside a commercial product, deploy it inside a cloud SaaS framework, or compile it onto physical quantum control hardware, email us to establish an Enterprise OEM License.'
    },
    {
      q: 'Can we get a signed corporate EULA or W-8/W-9 tax form?',
      a: 'Yes. If your company\'s procurement or legal departments require a formally signed PDF agreement, vendor onboarding profiles, or tax validation documents to clear the invoice, simply email your request alongside your Stripe invoice number.'
    }
  ];

  return (
    <>
      <SEO
        title="Pricing · QECTOR"
        description="Purchase QECTOR Decoder v3. Transparent commercial licensing for enterprise evaluation."
      />

      {/* ===== Pricing Card ===== */}
      <section className="py-24 md:py-32 bg-void">
        <div className="section-padding">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Secure Your License</h1>
              <p className="text-secondary text-sm max-w-md mx-auto">
                Secure your official corporate evaluation receipt and instantly clear compliance pipelines.
              </p>
            </div>

            <div className="card-surface border-cyan-300/35 neon-border-cyan relative overflow-hidden p-8 rounded-2xl bg-void/80 text-center">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 to-transparent pointer-events-none" />
              <div className="mb-6">
                <span className="px-3 py-1 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Commercial Evaluation License
                </span>
                <h2 className="text-3xl font-extrabold text-primary mt-3">$499</h2>
                <p className="text-muted-foreground text-xs mt-1">One-time payment · 60-day pilot · Fully creditable</p>
              </div>

              {/* Stripe Buy Button */}
              <div className="flex justify-center mb-4 min-h-[50px]">
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<stripe-buy-button
                      buy-button-id="buy_btn_1TsoKxRsa9cg9l8A7ExMmc77"
                      publishable-key="pk_live_51TslzuRsa9cg9l8AusKfWUqqji6ewsc5fIg04BCsvxHtZUhYJ84YXV7Xa9RPvBXTPdAx5vC3xtKRuxJ1hwZFioAl00axAE5v3I"
                    ></stripe-buy-button>`
                  }}
                />
              </div>

              <div className="border-t border-gridline/60 pt-4 mt-6 text-left">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  💡 <strong>Coupon Instructions:</strong> If you have an academic discount or partner referral coupon, you can enter it directly on the Stripe checkout page after clicking the button above.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Block */}
          <div className="max-w-2xl mx-auto mt-16 border-t border-gridline/60 pt-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-cyan-300">
              📋 Frequently Asked Questions
            </h3>
            <div className="space-y-6 text-left">
              {faqItems.map((item, idx) => (
                <div key={idx} className="card-surface bg-[#0b1329]/40 border-gridline/40 p-5 rounded-xl">
                  <h4 className="text-sm font-semibold text-primary mb-2 flex items-start gap-2">
                    <span className="text-cyan-300">Q:</span>
                    <span>{item.q}</span>
                  </h4>
                  <p className="text-secondary text-xs sm:text-sm leading-relaxed pl-6">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
