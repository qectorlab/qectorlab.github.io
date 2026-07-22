import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO } from '../lib/seo';
import PricingTierCard from '../components/PricingTierCard';
import NeuralReveal from '../components/NeuralReveal';
import EvidenceBlock from '../components/EvidenceBlock';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqItems = [
  {
    q: 'How is the license delivered?',
    a: 'There are no license keys, tokens, or software lockouts. Your Stripe receipt serves as your active legal contract. Your team continues using the standard pip install qector-decoder-v3 package as-is.'
  },
  {
    q: 'What happens after the 60-day evaluation expires?',
    a: 'The $499 evaluation is a flat, non-recurring 60-day window. If you need to extend or convert to an annual license, contact licensing@qector.store. The evaluation fee is 100% creditable toward any annual license.'
  },
  {
    q: 'Can I redistribute QECTOR inside my product?',
    a: 'No — standard tiers cover internal use only. Enterprise OEM licenses cover redistribution, SaaS hosting, and hardware bundling. Email licensing@qector.store for a custom agreement.'
  },
  {
    q: 'Do I need a license for non-commercial research?',
    a: 'No. Non-commercial, academic, and personal use is free under the PolyForm Noncommercial license. Only commercial deployment requires a paid tier.'
  },
  {
    q: 'What about academic discounts?',
    a: 'Yes — academic institutions receive 40% off any annual tier. Contact licensing@qector.store with your .edu domain to verify.'
  },
  {
    q: 'Can we get a signed corporate EULA or tax form?',
    a: 'Yes. If procurement requires a signed PDF agreement, vendor profile, or W-8/W-9, email your request with your Stripe invoice number to licensing@qector.store.'
  },
];

const evaluationSteps = [
  { step: '1', title: 'Contact', desc: 'Reach out with your use case and team size.' },
  { step: '2', title: 'License', desc: 'Sign a written evaluation license agreement.' },
  { step: '3', title: 'Evaluate', desc: 'Full access for 60 days with priority support.' },
  { step: '4', title: 'Decide', desc: 'Convert to annual license or walk away with your data.' },
];

const includedItems = [
  'Full QECTOR Decoder v3 package (all 10 algorithms)',
  'CPU + CUDA batch decoding paths',
  'Commercial use rights (internal evaluation)',
  'Written license agreement',
  'Benchmark artifact package with reproducible scripts',
  'Priority email support (2 business day response)',
  'Pilot success criteria guidance',
  'Integration support call (1 hour)',
];

export default function Pricing() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.body.appendChild(script);

    sectionsRef.current.filter(Boolean).forEach((section) => {
      gsap.fromTo(section, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 85%', once: true },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (script.parentNode === document.body) document.body.removeChild(script);
    };
  }, []);

  const addRef = (el: HTMLDivElement | null, index: number) => { if (el) sectionsRef.current[index] = el; };

  return (
    <>
      <SEO
        title="Pricing · QECTOR"
        description="QECTOR Decoder v3 commercial licensing. Self-serve evaluation from $499. Annual tiers from $1,299. Enterprise and OEM available."
      />

      {/* HERO */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse-dot" />
            Written License Agreement · Benchmark Artifact Package
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="Commercial Licensing" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            QECTOR Decoder v3 is Source-Available (not free for commercial use). The Workbench GUI is free.
            Start with a <span className="text-cyan-300 font-semibold">$499</span> 60-day evaluation, fully creditable toward any annual license.
            Full decoder access, written agreement, benchmark artifact package, and priority support.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#evaluation" className="btn-gold">Start Evaluation</a>
            <Link to="/contact" className="btn-cyan">Contact Sales</Link>
          </div>
        </div>
      </section>

      <div className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* EVALUATION STEPS */}
          <div ref={(el) => addRef(el, 0)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {evaluationSteps.map((s) => (
              <div key={s.step} className="card-surface text-center">
                <div className="w-10 h-10 rounded-full bg-cyan-300/10 border border-cyan-300/20 flex items-center justify-center text-cyan-300 font-bold mx-auto mb-3">{s.step}</div>
                <h3 className="text-primary font-semibold mb-1">{s.title}</h3>
                <p className="text-secondary text-sm">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* WHAT'S INCLUDED */}
          <div ref={(el) => addRef(el, 1)}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">What's Included in Evaluation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {includedItems.map((item) => (
                <div key={item} className="flex items-start gap-3 p-4 bg-surface border border-gridline rounded-xl">
                  <span className="text-cyan-300 mt-0.5">✓</span>
                  <span className="text-secondary text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FREE VS LICENSED */}
          <div ref={(el) => addRef(el, 1.5)} className="card-surface">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Free vs Licensed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-emerald-400 font-semibold mb-2">Free (Source-Available)</h3>
                <ul className="text-secondary text-sm space-y-1">
                  <li>• QECTOR Decoder v3 PyPI package (non-commercial use)</li>
                  <li>• Qector Workbench GUI v3.4 (full featured, 25+ MCP tools)</li>
                  <li>• Public benchmarks, artifacts, and validation on GitHub</li>
                  <li>• Documentation and examples</li>
                  <li>• Community issues and discussions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-gold-400 font-semibold mb-2">Licensed (Commercial)</h3>
                <ul className="text-secondary text-sm space-y-1">
                  <li>• Commercial use rights (internal R&amp;D / production)</li>
                  <li>• Written license agreement</li>
                  <li>• Priority support and response SLAs</li>
                  <li>• Full access to validation artifacts and reproduction harnesses</li>
                  <li>• IBM Quantum evaluation pathway</li>
                  <li>• Custom integration guidance and onboarding</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">Source-Available under PolyForm Noncommercial. Commercial use requires a license.</p>
              </div>
            </div>
          </div>

          {/* PRICING PHILOSOPHY */}
          <div className="p-6 bg-gold-400/5 border border-gold-400/20 rounded-2xl">
            <h3 className="text-gold-400 font-semibold mb-2">Pricing Philosophy</h3>
            <p className="text-secondary text-sm">
              Designed for serious QEC research and production teams. Licenses support continued independent development.
              No auto-renewing without confirmation. Written agreements. Priority support included.
            </p>
          </div>

          {/* ALL TIER CARDS */}
          <div ref={(el) => addRef(el, 2)}>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Choose Your Tier</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PricingTierCard
                name="Commercial Evaluation License"
                price="$499"
                period="/ 60 days"
                desc="Unlimited internal seats. 100% credit toward annual license. Self-serve."
                features={[
                  'Full decoder v3 (all 10 algorithms)',
                  'CPU + CUDA/OpenCL batch decoding',
                  'Commercial use rights (internal)',
                  'Written license agreement',
                  'Benchmark artifact package',
                  'Priority email support',
                  'Integration support call (1 hour)',
                ]}
                centered
                ctaLabel="Buy Now"
                ctaHref="#evaluation"
              />
              <PricingTierCard
                name="Solo / Indie Commercial"
                price="$1,299"
                period="/ year"
                desc="Single named user. Also $899 one-time perpetual."
                features={[
                  'Full decoder v3 (all 10 algorithms)',
                  'Commercial R&D rights',
                  'Single named user',
                  'Priority email support',
                  'Benchmark artifact access',
                ]}
                centered
                ctaLabel="Contact Sales"
              />
              <PricingTierCard
                name="Startup / Growth Team"
                price="$4,499"
                period="/ year"
                desc="Up to 10 named users. Advanced workflows."
                featured
                featuredLabel="Recommended"
                features={[
                  'Full decoder v3 (all 10 algorithms)',
                  'Up to 10 named users',
                  'Advanced BP-OSD/LDPC workflows',
                  'CPU + CUDA/OpenCL batch decoding',
                  'Priority support with SLA',
                  'Benchmark artifact package',
                  'Integration support (2 hours)',
                ]}
                centered
                ctaLabel="Contact Sales"
              />
              <PricingTierCard
                name="Professional / Lab"
                price="$11,500"
                period="/ year"
                desc="Up to 25 named users. Validation Report Package credit."
                features={[
                  'Full decoder v3 (all 10 algorithms)',
                  'Up to 25 named users',
                  'All advanced workflows',
                  'CPU + CUDA/OpenCL batch decoding',
                  'Priority support with SLA',
                  'Validation Report Package credit',
                  'Dedicated integration support',
                ]}
                centered
                ctaLabel="Contact Sales"
              />
              <PricingTierCard
                name="Enterprise R&D"
                price="$28,000+"
                period="/ year"
                desc="Custom user volume. Dedicated support."
                features={[
                  'Full decoder v3 (all 10 algorithms)',
                  'Unlimited named users',
                  'All advanced workflows + custom builds',
                  'CPU + CUDA/OpenCL batch decoding',
                  'Dedicated support engineer',
                  'Custom integration and onboarding',
                  'Rust source access (on request)',
                ]}
                centered
                ctaLabel="Contact Sales"
              />
              <PricingTierCard
                name="SaaS / Hosted API / OEM"
                price="Custom"
                period=""
                desc="Contact sales for custom terms."
                accent="gold"
                features={[
                  'Redistribution rights',
                  'SaaS hosting rights',
                  'OEM bundling rights',
                  'Custom SLA and terms',
                  'Dedicated engineering support',
                  'Priority feature development',
                ]}
                centered
                ctaLabel="Contact Sales"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              What remains free: Workbench GUI, public PyPI package (non-commercial), all GitHub artifacts.
              Source-available under PolyForm Noncommercial. Commercial use requires a license.
            </p>
          </div>

          {/* $499 STRIPE BUY BUTTON */}
          <div
            id="evaluation"
            ref={(el) => addRef(el, 3)}
            className="card-surface border-cyan-300/35 neon-border-cyan relative overflow-hidden p-8 rounded-2xl bg-void/80 text-center scroll-mt-32"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 to-transparent pointer-events-none" />
            <div className="mb-6">
              <span className="px-3 py-1 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Self-Serve · Instant Clearance
              </span>
              <h2 className="text-3xl font-extrabold text-primary mt-3">Commercial Evaluation License</h2>
              <p className="text-muted-foreground text-sm mt-1 mb-4">One-time $499 · 60-day pilot · Fully creditable toward any annual license</p>
            </div>

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

            <div className="border-t border-gridline/60 pt-4 mt-4 text-left space-y-2 max-w-md mx-auto">
              {[
                'Full QECTOR Decoder v3 (all 10 algorithms)',
                'CPU + CUDA/OpenCL batch decoding',
                'Unlimited internal seats',
                'Written license agreement',
                'Priority email support (2 business day response)',
                'Benchmark artifact package',
                '100% credit toward annual license',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-secondary">
                  <span className="text-green-400">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gridline/60 pt-4 mt-6 text-left max-w-md mx-auto">
              <p className="text-xs text-muted-foreground leading-relaxed">
                💡 <strong>Coupon Instructions:</strong> If you have an academic discount or partner referral coupon, enter it on the Stripe checkout page.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2 italic">
                <strong>Note:</strong> This tier covers internal R&D, architecture design, and threshold optimization workflows only. It does not grant commercial software/hardware redistribution or SaaS hosting rights.
              </p>
            </div>
          </div>

          {/* VALIDATION SPRINT */}
          <div ref={(el) => addRef(el, 4)} className="p-6 bg-gold-400/5 border border-gold-400/20 rounded-2xl">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-gold-400">QECTOR Validation Sprint</h3>
                <p className="text-secondary text-sm">10–20 business days delivery · $3,750 one-time</p>
              </div>
            </div>
            <p className="text-secondary text-sm mb-4">The recommended fast-track entry point for teams seeking immediate, defensible proof of workflow value.</p>
            <ul className="text-secondary text-sm space-y-1.5">
              <li>• 60-day Commercial Evaluation License for up to 3 named users</li>
              <li>• Execution of up to 3 customer-specified or standard benchmark workloads using QECTOR</li>
              <li>• Complete reproducible artifact bundles (environment snapshots, input hashes, LER curves, timing data, manifest)</li>
              <li>• Comparative analysis against PyMatching / Stim baselines where applicable</li>
              <li>• 60-minute results review call with your team</li>
            </ul>
            <div className="mt-4">
              <Link to="/contact" className="btn-gold text-sm">Request Validation Sprint</Link>
            </div>
          </div>

          {/* WHY LICENSE QECTOR */}
          <div ref={(el) => addRef(el, 5)} className="card-surface">
            <h2 className="text-2xl font-bold mb-4">Why License QECTOR?</h2>
            <p className="text-secondary text-sm mb-6">
              PyMatching and Stim provide excellent free baselines. QECTOR is the appropriate commercial choice when a team requires:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gridline">
                    <th className="text-left py-3 px-4 text-cyan-300 font-semibold text-sm">Need</th>
                    <th className="text-left py-3 px-4 text-cyan-300 font-semibold text-sm">QECTOR Value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { need: 'Multi-decoder experimentation', value: 'Union-Find, Blossom, Sparse Blossom, BP-OSD, batch, streaming, and hybrid workflows in a single source-available platform' },
                    { need: 'LDPC / qLDPC coverage', value: 'BP-OSD and LDPC workflows beyond standard graph-like MWPM' },
                    { need: 'Reproducible evidence', value: 'Benchmark artifacts, environment snapshots, reproducibility scripts, and Workbench report bundles' },
                    { need: 'Commercial permission', value: 'Written license terms for company, lab, funded, product, hosted, or revenue-generating use' },
                    { need: 'Rapid proof of workflow value', value: 'Productized Validation Sprints that deliver customer-specific, reproducible results within weeks' },
                  ].map((row) => (
                    <tr key={row.need} className="border-b border-gridline/50 hover:bg-surface/50 transition-colors">
                      <td className="py-3 px-4 text-primary text-sm font-medium">{row.need}</td>
                      <td className="py-3 px-4 text-secondary text-sm">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHTS NOT INCLUDED + PORTAL */}
          <div ref={(el) => addRef(el, 6)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-surface border border-gridline rounded-2xl">
              <h3 className="text-lg font-bold mb-3">Rights Not Included by Default</h3>
              <p className="text-secondary text-xs mb-3">Unless explicitly granted in a written commercial agreement, no license tier includes:</p>
              <ul className="text-secondary text-sm space-y-1">
                <li>• Redistribution rights</li>
                <li>• Sublicensing rights</li>
                <li>• OEM rights</li>
                <li>• Hosted API or SaaS rights</li>
                <li>• Trademark rights · Patent rights</li>
                <li>• Exclusivity · Warranty or indemnification</li>
                <li>• Government or defense-specific rights</li>
              </ul>
            </div>
            <div className="p-6 bg-surface border border-gridline rounded-2xl">
              <h3 className="text-lg font-bold mb-3">Official Licensing Portal</h3>
              <p className="text-secondary text-sm mb-3">
                Self-serve purchasing for Commercial Evaluation License and Solo / Indie tiers:
              </p>
              <a href="https://www.qector.store" className="text-cyan-300 hover:underline font-semibold block mb-4">https://www.qector.store</a>
              <p className="text-secondary text-sm mb-2">
                Higher tiers, Validation Sprints, and custom services:
              </p>
              <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline font-semibold block">admin@qector.store</a>
              <p className="text-muted-foreground text-xs mt-4">
                All commercial licenses are issued under written agreement. Source-available access for non-commercial use continues under the repository license.
              </p>
            </div>
          </div>

          {/* EVALUATION SUCCESS CRITERIA */}
          <div ref={(el) => addRef(el, 7)} className="p-6 bg-surface border border-gridline rounded-2xl">
            <h2 className="text-xl font-bold mb-3">Evaluation & Pilot Success Criteria</h2>
            <p className="text-secondary text-sm mb-3">Commercial engagements are evaluated on measurable workflow value. Recommended proof points:</p>
            <ul className="text-secondary text-sm space-y-1.5">
              <li>• Successful installation on your target environment(s)</li>
              <li>• At least one reproduced benchmark artifact bundle with full manifest, hashes, and environment snapshot</li>
              <li>• One QECTOR vs. PyMatching / Stim comparison run (where relevant)</li>
              <li>• One BP-OSD / LDPC workflow execution (if within scope)</li>
              <li>• Documented time savings or insight velocity versus your existing workflow</li>
              <li>• Clear attribution of results to QECTOR components</li>
            </ul>
          </div>

          {/* TRANSPARENCY */}
          <EvidenceBlock
            title="What We Won't Do"
            statement={
              <ul className="space-y-2">
                <li>• No auto-renewing subscriptions without explicit confirmation</li>
                <li>• No price increases after first year without 90-day notice</li>
                <li>• No restrictions on publishing benchmark results (with attribution)</li>
                <li>• No vendor lock-in - data and models are yours</li>
                <li>• No claims beyond what validation artifacts prove</li>
              </ul>
            }
          />

          {/* FAQ */}
          <div ref={(el) => addRef(el, 8)} className="border-t border-gridline/60 pt-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-cyan-300">
              Frequently Asked Questions
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

          {/* FINAL CTA */}
          <div className="text-center py-8">
            <Link to="/contact" className="btn-cyan text-lg px-10 py-4">Contact Sales for Custom Licensing</Link>
            <p className="text-muted-foreground text-sm mt-4">Typical response time: 1 business day</p>
          </div>

        </div>
      </div>
    </>
  );
}
