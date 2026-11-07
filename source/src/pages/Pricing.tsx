import { GraduationCap } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SEO, JsonLd } from '../lib/seo';
import PricingTierCard from '../components/PricingTierCard';
import NeuralReveal from '../components/NeuralReveal';
import { FAQ_ITEMS } from '../lib/faqData';
import CodeBlock from '../components/CodeBlock';
import MobileCollapse from '../components/MobileCollapse';
import { LINKS, PRICES, usd } from '../lib/pricing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Pricing() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.body.appendChild(script);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Stagger animate all sections
       sectionsRef.current.filter(Boolean).forEach((section) => {
        gsap.fromTo(section, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 85%', once: true },
        });
      });
    });

    return () => {
      ctx.revert();
      if (script.parentNode === document.body) document.body.removeChild(script);
    };
  }, []);

  const addRef = (el: HTMLDivElement | null, index: number) => { if (el) sectionsRef.current[index] = el; };

  return (
    <>
      <SEO
        title="Pricing · QECTOR"
        description={`QECTOR Decoder v3 commercial licensing. Pro from ${usd(PRICES.proMonthly)}/month, Lab ${usd(PRICES.lab)}/yr, Enterprise and OEM from ${usd(PRICES.enterpriseFrom)}/yr. ${PRICES.refundDays}-day money-back. Prices in USD; tax added at checkout where applicable.`}
        lang="en"
        alternates={[
          { lang: 'en', href: 'https://qector.store/pricing/' },
          { lang: 'fr', href: 'https://qector.store/fr/pricing/' },
        ]}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ_ITEMS.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />

      {/* HERO */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/10 via-surface/30 to-void" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-void to-void pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-bold text-cyan-300 uppercase tracking-widest mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse-dot" />
            Clear, Transparent Commercial Licensing
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            <NeuralReveal text="License QECTOR for Production" className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70" />
          </h1>
          <p className="text-secondary text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Free for academic and non-commercial research. For commercial use, pick a plan: licences are verified
            offline and work fully air-gapped, cancel any time, {PRICES.refundDays}-day money-back on your first payment.
          </p>
        </div>
      </section>

      <div className="px-6 pb-24 max-w-6xl mx-auto space-y-20 relative z-10">

        {/* 1. ASSURANCES */}
        <div ref={(el) => addRef(el, 0)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="card-surface py-6"><p className="text-cyan-300 font-bold">Air-gapped</p><p className="text-secondary text-sm mt-1">Signed token, verified offline. No licence server, no phone-home.</p></div>
          <div className="card-surface py-6"><p className="text-cyan-300 font-bold">{PRICES.refundDays}-day money-back</p><p className="text-secondary text-sm mt-1">Full refund on your first payment of any plan, no questions asked.</p></div>
          <div className="card-surface py-6"><p className="text-cyan-300 font-bold">Cancel any time</p><p className="text-secondary text-sm mt-1">Your licence stays valid to the end of the period you paid for.</p></div>
        </div>

        {/* 2. THE PRODUCTION TIERS */}
        <div ref={(el) => addRef(el, 1)}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Commercial Plans</h2>
            <p className="text-secondary text-lg mb-4">
              Production rights for your organisation's internal use. Subscriptions renew automatically until cancelled.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-400/30 rounded-full text-xs font-semibold text-blue-300">
              <GraduationCap size={14} className="shrink-0" aria-hidden="true" /> {PRICES.academicDiscountPct}% off Lab for academic institutions. Non-commercial research is free.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <PricingTierCard
              name="Pro"
              price={usd(PRICES.proMonthly)}
              period="/ month"
              desc={`Or ${usd(PRICES.proAnnual)}/year (2 months free). Pro licence tier.`}
              featured
              featuredLabel="Most popular"
              features={['Commercial internal use', 'All decoder families', 'CPU + GPU (CUDA/OpenCL) batch', 'Code distances up to 19', 'Email support (2 business days)']}
              ctaLabel="Buy monthly"
              ctaHref={LINKS.proMonthly}
            />
            <PricingTierCard
              name="Lab"
              price={usd(PRICES.lab)}
              period="/ year"
              desc="Enterprise licence tier, for research groups and labs."
              features={['Everything in Pro', 'Code distances up to 63', 'Priority support with SLA', '2-hour onboarding call', 'One Validation Report ($5,000 value)']}
              ctaLabel="Buy Lab"
              ctaHref={LINKS.lab}
            />
            <PricingTierCard
              name="Enterprise & OEM"
              price={`$${PRICES.enterpriseFrom / 1000}k+`}
              period="/ year"
              desc="Redistribution, SaaS, OEM and custom terms."
              accent="gold"
              features={['Signed agreement, custom terms', 'SaaS and customer-facing APIs', 'OEM and hardware bundling', 'Named support engineer']}
              ctaLabel="Contact Sales"
              ctaHref="/contact"
            />
          </div>

          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-secondary">
              Pro billed yearly: <a href={LINKS.proAnnual} className="text-cyan-400 hover:underline" rel="noopener">{usd(PRICES.proAnnual)} / year</a>.{' '}
              Prefer to own it? <a href={LINKS.proPerpetual} className="text-cyan-400 hover:underline" rel="noopener"><strong>Pro Perpetual: {usd(PRICES.proPerpetual)} one-time</strong></a>{' '}
              (every 1.x release, 12 months of support).
            </p>
          </div>
        </div>

        {/* 3. ADDITIONAL SERVICES (Validation Sprint) */}
        <MobileCollapse more="Validation Sprint and activation">
        <div ref={(el) => addRef(el, 2)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-surface border-gold-400/20 bg-gold-400/5">
            <h3 className="text-2xl font-bold text-gold-400 mb-2">QECTOR Validation Sprint</h3>
            <p className="text-sm text-gold-200/60 mb-4">$3,750 one-time · 10-20 days delivery</p>
            <p className="text-secondary text-sm mb-6">
              The recommended fast-track for teams seeking immediate, defensible proof of workflow value. 
              We execute up to 3 standard benchmark workloads using QECTOR and deliver reproducible artifact bundles.
            </p>
            <ul className="text-secondary text-sm space-y-2 mb-8">
              <li className="flex gap-2"><span className="text-gold-400">✓</span> Includes a {PRICES.pilotDays}-day Pilot licence</li>
              <li className="flex gap-2"><span className="text-gold-400">✓</span> Comparative analysis vs PyMatching/Stim</li>
              <li className="flex gap-2"><span className="text-gold-400">✓</span> 60-minute results review call</li>
            </ul>
            <Link to="/contact" className="btn-gold block text-center">Request Validation Sprint</Link>
            <p className="text-xs text-gold-200/60 mt-6">
              Need only the licence and a call? The <a href={LINKS.pilot} className="text-gold-400 hover:underline" rel="noopener">{PRICES.pilotDays}-day Pilot is {usd(PRICES.pilot)}</a>:
              {' '}a 1-hour integration call and a written validation memo, 100% creditable toward Lab within 90 days.
            </p>
          </div>
          
          <div className="card-surface bg-surface border-gridline">
            <h3 className="text-2xl font-bold mb-4">Activating Your License</h3>
            <p className="text-secondary text-sm mb-6">
              Everyone installs the same wheel from PyPI: there is no separate commercial build.
              Your token unlocks the paid features: GPU (CUDA/OpenCL) batch decoding on every paid plan, and code distances up to 63 on Lab and Enterprise.
              CPU decoding is never blocked; distance caps are enforced only when you set QECTOR_ENFORCE=1.
            </p>
            <CodeBlock
              language="bash"
              className="mb-6"
              code={`pip install --upgrade "qector-decoder-v3>=1.0.1,<2"
export QECTOR_LICENSE_KEY="<your-token>"
export QECTOR_LICENSE="<your-token>"

# Verify offline: prints Pro or Enterprise
python -c "import qector_decoder_v3 as q; print(q.get_license_info()['tier'])"`}
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tokens are verified offline against a public key embedded in the package: no license server, no phone-home, works completely air-gapped.
            </p>
          </div>
        </div>
        </MobileCollapse>

        {/* 4. COMPARISON AND WHY QECTOR */}
        <div ref={(el) => addRef(el, 3)}>
          <h2 className="text-3xl font-bold mb-8 text-center">Why License QECTOR?</h2>
          <div className="card-surface bg-surface/50 border border-gridline">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gridline/50">
                    <th className="text-left py-4 px-6 text-cyan-300 font-semibold text-sm">Free (Source-Available)</th>
                    <th className="text-left py-4 px-6 text-gold-400 font-semibold text-sm">Licensed (Commercial)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gridline/30">
                    <td className="py-4 px-6 text-secondary border-r border-gridline/30">Non-commercial research use only</td>
                    <td className="py-4 px-6 text-primary font-medium">Internal R&D and production rights</td>
                  </tr>
                  <tr className="border-b border-gridline/30">
                    <td className="py-4 px-6 text-secondary border-r border-gridline/30">Community support (GitHub Issues)</td>
                    <td className="py-4 px-6 text-primary font-medium">Priority email support & SLAs</td>
                  </tr>
                  <tr className="border-b border-gridline/30">
                    <td className="py-4 px-6 text-secondary border-r border-gridline/30">QECTOR Workbench GUI (Free)</td>
                    <td className="py-4 px-6 text-primary font-medium">Validation artifact reproduction harnesses</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-secondary border-r border-gridline/30">PolyForm Noncommercial License</td>
                    <td className="py-4 px-6 text-primary font-medium">Written Commercial License Agreement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 5. FAQ */}
        <div ref={(el) => addRef(el, 4)} className="pt-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {FAQ_ITEMS.map((item, idx) => (
              <details key={idx} className="faq-item group bg-surface/30 border border-gridline/40 rounded-2xl hover:bg-surface/60 transition-colors">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-5 min-h-[44px] text-base font-bold text-cyan-300">
                  <h3 className="text-base font-bold">{item.q}</h3>
                  <span aria-hidden="true" className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="text-secondary text-sm leading-relaxed px-5 pb-5">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* 6. FINE PRINT & PROCUREMENT */}
        <div ref={(el) => addRef(el, 5)} className="border-t border-gridline/40 pt-12 text-center text-xs text-muted-foreground max-w-3xl mx-auto space-y-4">
          <p>
            <strong>What is not included:</strong> Unless explicitly granted, no tier includes redistribution, OEM, SaaS hosting, or sublicensing rights. Contact sales for Custom terms.
          </p>
          <p>
            <strong>Procurement:</strong> All prices are in USD; applicable taxes are added at checkout. Monthly and annual plans renew automatically until cancelled, with a reminder before each annual renewal.
            {' '}{PRICES.refundDays}-day money-back guarantee on your first payment of any plan. Tokens are emailed within minutes.
          </p>
          <p>
            By purchasing, you accept the <Link to="/license-agreement" className="text-cyan-300 hover:underline">Commercial Licence Agreement</Link>.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4">
            <Link to="/license-agreement" className="hover:text-cyan-300 transition-colors">Licence Agreement</Link>
            <Link to="/refund" className="hover:text-cyan-300 transition-colors">Refund Policy</Link>
            <a href="https://billing.stripe.com/p/login/7sY9AVdwlgoyfse9bYeUU00" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">Manage subscription</a>
            <Link to="/contact" className="hover:text-cyan-300 transition-colors">Contact Engineering</Link>
          </div>
        </div>

      </div>
    </>
  );
}

