import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO, JsonLd } from '../lib/seo';
import PricingTierCard from '../components/PricingTierCard';
import NeuralReveal from '../components/NeuralReveal';
import EvidenceBlock from '../components/EvidenceBlock';
import { FAQ_ITEMS } from '../lib/faqData';
import { CALENDLY_URL } from '../lib/config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const evaluationSteps = [
  { step: '1', title: 'Contact', desc: 'Reach out with your use case and team size.' },
  { step: '2', title: 'License', desc: 'Sign a written evaluation license agreement.' },
  { step: '3', title: 'Evaluate', desc: 'Full access for 60 days with priority support.' },
  { step: '4', title: 'Decide', desc: 'Convert to annual license or walk away with your data.' },
];

const includedItems = [
  'Full QECTOR Decoder v3 package (all decoders)',
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

    let ctx = gsap.context(() => {
      // Stagger animate all sections
      sectionsRef.current.filter(Boolean).forEach((section, i) => {
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
        description="QECTOR Decoder v3 commercial licensing. $499 one-time 60-day evaluation, fully creditable. Annual production tiers $1,299 to $28,000+. Enterprise and OEM available. Prices in USD."
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
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            <NeuralReveal text="License QECTOR for Production" className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70" />
          </h1>
          <p className="text-secondary text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            QECTOR Decoder v3 is Source-Available for academic and non-commercial research. 
            For internal R&D, pilot programs, and commercial deployment, select a license below.
          </p>
        </div>
      </section>

      <div className="px-6 pb-24 max-w-6xl mx-auto space-y-20 relative z-10">

        {/* 1. THE EVALUATION BANNER (Most important entry point) */}
        <div ref={(el) => addRef(el, 0)} id="evaluation" className="scroll-mt-32">
          <div className="relative p-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-gradient-xy">
            <div className="bg-void/90 backdrop-blur-xl rounded-[23px] p-8 md:p-12 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-left">
                <div className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                  Self-Serve · Instant Clearance
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Commercial Evaluation</h2>
                <p className="text-secondary text-base leading-relaxed max-w-xl">
                  A 60-day full-access pilot designed for serious QEC research teams. 
                  Includes CPU + CUDA batch decoding, written license agreement, benchmark artifact package, and priority support.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-cyan-100/70">
                  <div className="flex items-center gap-2"><span className="text-cyan-400">✓</span> 100% creditable toward annual license</div>
                  <div className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Unlimited internal seats</div>
                </div>
              </div>
              
              <div className="w-full md:w-auto flex flex-col items-center">
                <div className="text-4xl font-black text-white mb-1">$499</div>
                <div className="text-secondary text-sm mb-6">One-time flat fee</div>
                <a
                  href="https://buy.stripe.com/6oU00l77Xc8ifsegEqeUU07"
                  className="w-full text-center py-4 px-8 bg-cyan-400 hover:bg-cyan-300 text-void font-bold rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all hover:scale-105"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Start 60-Day Pilot
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. THE PRODUCTION TIERS */}
        <div ref={(el) => addRef(el, 1)}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Production & Annual Tiers</h2>
            <p className="text-secondary max-w-2xl mx-auto">Convert your evaluation to an annual license when you're ready to deploy. No auto-renewing without confirmation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PricingTierCard
              name="Solo / Indie"
              price="$1,299"
              period="/ year"
              desc="Production rights for a single named user."
              features={['Full v3 decoders', 'Commercial R&D rights', 'Single named user', 'Priority email support']}
              ctaLabel="Subscribe Now"
              ctaHref="https://buy.stripe.com/cNi9AV63TfkubbY87UeUU09"
            />
            <PricingTierCard
              name="Startup / Growth"
              price="$4,499"
              period="/ year"
              desc="Up to 10 named users. Advanced BP-OSD/LDPC workflows."
              featured
              featuredLabel="Most Popular"
              features={['Up to 10 named users', 'Advanced BP-OSD/LDPC', 'CPU + CUDA batch', 'Support SLA + 2hr integration']}
              ctaLabel="Subscribe Now"
              ctaHref="https://buy.stripe.com/14A5kF4ZP5JU7ZMdseeUU0c"
            />
            <PricingTierCard
              name="Professional"
              price="$11,500"
              period="/ year"
              desc="Up to 25 named users. Validation Report Package credit."
              features={['Up to 25 named users', 'All advanced workflows', 'Dedicated integration', 'Validation Report credit']}
              ctaLabel="Subscribe Now"
              ctaHref="https://buy.stripe.com/28EeVf1ND0pA6VIewieUU0d"
            />
            <PricingTierCard
              name="Enterprise & OEM"
              price="Custom"
              period=""
              desc="Unlimited seats, custom builds, and SaaS/OEM distribution."
              accent="gold"
              features={['Unlimited logical qubits', 'SaaS hosting rights', 'OEM bundling rights', 'Dedicated support engineer']}
              ctaLabel="Contact Sales"
              ctaHref="/contact"
            />
          </div>
          
          {/* Solo Perpetual Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-secondary">
              Prefer to own it outright? <strong className="text-cyan-300">Solo / Indie Perpetual is $3,299 one-time.</strong>{' '}
              <a href="https://buy.stripe.com/3cI14p77Xdcm0xk2NAeUU0e" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">Buy perpetual license</a>
            </p>
          </div>
        </div>

        {/* 3. ADDITIONAL SERVICES (Validation Sprint) */}
        <div ref={(el) => addRef(el, 2)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-surface border-gold-400/20 bg-gold-400/5">
            <h3 className="text-2xl font-bold text-gold-400 mb-2">QECTOR Validation Sprint</h3>
            <p className="text-sm text-gold-200/60 mb-4">$3,750 one-time · 10–20 days delivery</p>
            <p className="text-secondary text-sm mb-6">
              The recommended fast-track for teams seeking immediate, defensible proof of workflow value. 
              We execute up to 3 standard benchmark workloads using QECTOR and deliver reproducible artifact bundles.
            </p>
            <ul className="text-secondary text-sm space-y-2 mb-8">
              <li className="flex gap-2"><span className="text-gold-400">✓</span> Includes 60-day Commercial Evaluation</li>
              <li className="flex gap-2"><span className="text-gold-400">✓</span> Comparative analysis vs PyMatching/Stim</li>
              <li className="flex gap-2"><span className="text-gold-400">✓</span> 60-minute results review call</li>
            </ul>
            <Link to="/contact" className="btn-gold block text-center">Request Validation Sprint</Link>
          </div>
          
          <div className="card-surface bg-surface border-gridline">
            <h3 className="text-2xl font-bold mb-4">Activating Your License</h3>
            <p className="text-secondary text-sm mb-6">
              Everyone installs the same wheel from PyPI: there is no separate commercial build. 
              Setting your license token simply disables the non-commercial usage notice.
            </p>
            <pre className="bg-void/50 border border-gridline rounded-xl p-4 text-xs font-mono text-cyan-300 overflow-x-auto mb-6">
{`# Commercial use: activate with the Ed25519 token
export QECTOR_LICENSE="<your-token>"

# Optional: suppress the licensing notice in CI logs
export QECTOR_SILENT=1`}
            </pre>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tokens are verified offline against a public key embedded in the package: no license server, no phone-home, works completely air-gapped.
            </p>
          </div>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="card-surface bg-surface/30 border-gridline/40 hover:bg-surface/60 transition-colors p-6 rounded-2xl">
                <h4 className="text-base font-bold text-primary mb-3 text-cyan-300">
                  {item.q}
                </h4>
                <p className="text-secondary text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. FINE PRINT & PROCUREMENT */}
        <div ref={(el) => addRef(el, 5)} className="border-t border-gridline/40 pt-12 text-center text-xs text-muted-foreground max-w-3xl mx-auto space-y-4">
          <p>
            <strong>What is not included:</strong> Unless explicitly granted, no tier includes redistribution, OEM, SaaS hosting, or sublicensing rights. Contact sales for Custom terms.
          </p>
          <p>
            <strong>Procurement:</strong> All prices are USD and exclude tax. Stripe handles local taxes automatically. Tokens are delivered instantly via email. Due to instant delivery, sales are final. Please use the $499 Evaluation to test suitability before annual commitment.
          </p>
          <div className="flex justify-center gap-6 pt-4">
            <Link to="/refund" className="hover:text-cyan-300 transition-colors">Refund Policy</Link>
            <Link to="/contact" className="hover:text-cyan-300 transition-colors">Contact Engineering</Link>
          </div>
        </div>

      </div>
    </>
  );
}
