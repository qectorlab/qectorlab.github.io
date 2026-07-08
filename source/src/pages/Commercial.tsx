import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import PricingTierCard from '../components/PricingTierCard';
import EvidenceBlock from '../components/EvidenceBlock';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Commercial() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    sectionsRef.current.filter(Boolean).forEach((section) => {
      gsap.fromTo(section, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 85%', once: true },
      });
    });
    return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
  }, []);
  const addRef = (el: HTMLDivElement | null, index: number) => { if (el) sectionsRef.current[index] = el; };

  return (
    <>
      <SEO
        title="Commercial · QECTOR"
        description="Commercial licenses for QECTOR Decoder v3 (Source-Available). Free Workbench GUI. Evaluation pilots from $1,500. Professional support for research and production teams."
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse-dot" />
            Written License Agreement · Benchmark Artifact Package
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="Commercial Evaluation" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            QECTOR Decoder v3 is Source-Available (not free for commercial use). The Workbench GUI is free.
            90-day pilot from <span className="text-cyan-300 font-semibold">$1,500</span>, creditable toward an annual license.
            Full decoder access, written agreement, benchmark artifact package, and priority support.
            Walk away with your data either way.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-cyan">Start Evaluation</Link>
            <Link to="/pricing" className="btn-outline">View All Tiers</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Evaluation Steps */}
          <div ref={(el) => addRef(el, 0)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Contact', desc: 'Reach out with your use case and team size.' },
              { step: '2', title: 'License', desc: 'Sign a written evaluation license agreement.' },
              { step: '3', title: 'Evaluate', desc: 'Full access for 90 days with priority support.' },
              { step: '4', title: 'Decide', desc: 'Convert to annual license or walk away with data.' },
            ].map((s) => (
              <div key={s.step} className="card-surface text-center">
                <div className="w-10 h-10 rounded-full bg-cyan-300/10 border border-cyan-300/20 flex items-center justify-center text-cyan-300 font-bold mx-auto mb-3">{s.step}</div>
                <h3 className="text-primary font-semibold mb-1">{s.title}</h3>
                <p className="text-secondary text-sm">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* What's Included */}
          <div ref={(el) => addRef(el, 1)}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">What's Included in Evaluation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Full QECTOR Decoder v3 package (all 10 algorithms)',
                'CPU + CUDA batch decoding paths',
                'Commercial use rights (internal evaluation)',
                'Written license agreement',
                'Benchmark artifact package with reproducible scripts',
                'Priority email support (2 business day response)',
                'Pilot success criteria guidance',
                'Integration support call (1 hour)',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 p-4 bg-surface border border-gridline rounded-xl">
                  <span className="text-cyan-300 mt-0.5">✓</span>
                  <span className="text-secondary text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Free vs Licensed */}
          <div ref={(el) => addRef(el, 1.5)} className="card-surface">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">What is Free vs Licensed</h2>
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

          {/* Pricing Philosophy */}
          <div className="p-6 bg-gold-400/5 border border-gold-400/20 rounded-2xl">
            <h3 className="text-gold-400 font-semibold mb-2">Pricing Philosophy</h3>
            <p className="text-secondary text-sm">
              Designed for serious QEC research and production teams. Licenses support continued independent development.
              No auto-renewing without confirmation. Written agreements. Priority support included.
            </p>
          </div>

          {/* Clear Tiers */}
          <div>
            <h2 className="text-2xl font-bold mb-4">License Tiers</h2>
            <div className="text-secondary text-sm">
              <p><strong>Researcher / Academic Lab:</strong> Free for non-commercial, full artifacts, community support.</p>
              <p><strong>Commercial Deployment:</strong> Internal use rights, written license, priority support, IBM eval access.</p>
              <p><strong>Enterprise + Support:</strong> Full access, custom builds, SLAs, onboarding.</p>
            </div>
            <p className="text-xs mt-2">What remains free: Workbench GUI, public PyPI package (non-commercial), all GitHub artifacts.</p>
            <p className="text-xs mt-2">Source-available under PolyForm Noncommercial. Commercial use requires license. What you get: full Rust source access (on request for qualified licensees), priority support, custom builds, IBM Quantum evaluation pathway.</p>
          </div>

          {/* Pricing Cards */}
          <div ref={(el) => addRef(el, 2)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PricingTierCard
              name="Evaluation Pilot"
              price="$1,500"
              period="/ 90 days"
              desc="Up to 2 named users. Creditable toward annual license."
              centered
              ctaLabel="Start Evaluation"
            />
            <PricingTierCard
              name="Startup"
              price="$3,500"
              period="/ year"
              desc="Up to 5 named users. Full commercial R&D rights."
              centered
              featured
              featuredLabel="Recommended"
            />
            <PricingTierCard
              name="Enterprise"
              price="$35,000+"
              period="/ year"
              desc="Custom user count · SLA options · Advisory."
              centered
            />
          </div>

          {/* Transparency */}
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

          {/* CTA */}
          <div className="text-center py-8">
            <Link to="/contact" className="btn-cyan text-lg px-10 py-4">Request Commercial Evaluation</Link>
            <p className="text-muted-foreground text-sm mt-4">Typical response time: 1 business day</p>
          </div>

        </div>
      </section>
    </>
  );
}
