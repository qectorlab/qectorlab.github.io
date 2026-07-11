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
        description="Commercial licenses for QECTOR Decoder v3 (Source-Available). Free Workbench GUI. Evaluation pilots from $499. Professional support for research and production teams."
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
            60-day pilot from <span className="text-cyan-300 font-semibold">$499</span>, fully creditable toward any annual license.
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
              { step: '3', title: 'Evaluate', desc: 'Full access for 60 days with priority support.' },
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
              <p><strong>Personal / Academic:</strong> Free for non-commercial use, full artifacts, community support.</p>
              <p><strong>Commercial Evaluation License:</strong> $499/60 days, full decoder suite, up to 3 named users. 100% credit toward annual license. Self-serve.</p>
              <p><strong>Solo / Indie Commercial:</strong> $1,299/year or $899 one-time perpetual. Single named user, full commercial R&D rights.</p>
              <p><strong>Startup / Growth Team:</strong> $4,499/year, up to 10 named users. Advanced BP-OSD/LDPC + batch/GPU workflows.</p>
              <p><strong>Professional / Lab:</strong> $11,500/year, up to 25 named users. Built-in proof-of-value with Validation Report Package credit.</p>
              <p><strong>Enterprise R&D:</strong> $28,000+/year, custom volume. Full platform with dedicated support.</p>
              <p><strong>SaaS / Hosted API / OEM / Strategic:</strong> Contact sales for custom terms.</p>
            </div>
            <p className="text-xs mt-2">What remains free: Workbench GUI, public PyPI package (non-commercial), all GitHub artifacts.</p>
            <p className="text-xs mt-2">Source-available under PolyForm Noncommercial. Commercial use requires license. What you get: full Rust source access (on request for qualified licensees), priority support, custom builds, IBM Quantum evaluation pathway.</p>
          </div>

          {/* Pricing Cards */}
          <div ref={(el) => addRef(el, 2)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PricingTierCard
              name="Commercial Evaluation License"
              price="$499"
              period="/ 60 days"
              desc="Up to 3 named users. 100% credit toward annual license. Self-serve."
              centered
              ctaLabel="Start Evaluation"
            />
            <PricingTierCard
              name="Solo / Indie Commercial"
              price="$1,299"
              period="/ year"
              desc="Single named user. Also $899 one-time perpetual."
              centered
            />
            <PricingTierCard
              name="Startup / Growth Team"
              price="$4,499"
              period="/ year"
              desc="Up to 10 named users. Advanced workflows."
              centered
              featured
              featuredLabel="Recommended"
            />
            <PricingTierCard
              name="Professional / Lab"
              price="$11,500"
              period="/ year"
              desc="Up to 25 named users. Validation Report Package credit."
              centered
            />
            <PricingTierCard
              name="Enterprise R&D"
              price="$28,000+"
              period="/ year"
              desc="Custom user volume · Dedicated support."
              centered
            />
          </div>

          {/* Why License QECTOR */}
          <div ref={(el) => addRef(el, 3)} className="card-surface">
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

          {/* Validation Sprint */}
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
          </div>

          {/* Evaluation Success Criteria */}
          <div ref={(el) => addRef(el, 5)} className="p-6 bg-surface border border-gridline rounded-2xl">
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

          {/* Rights & Portal */}
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

          {/* Pricing Position */}
          <div className="p-6 bg-gold-400/5 border border-gold-400/20 rounded-2xl">
            <h3 className="text-gold-400 font-semibold mb-2">Commercial Pricing Position</h3>
            <p className="text-secondary text-sm">
              QECTOR is positioned as a source-available Rust/Python QEC R&amp;D platform focused on decoder diversity, reproducible benchmark packaging, BP-OSD/LDPC workflows, CPU/GPU batch paths, and commercial legal clarity.
              QECTOR is not positioned as the universal fastest MWPM decoder. PyMatching remains the reference for exact MWPM latency on standard surface-code workloads. Commercial value derives from integrated multi-decoder experimentation, LDPC/qLDPC coverage, reproducible artifact workflows, and clear licensing for revenue-linked or institutional use.
            </p>
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
