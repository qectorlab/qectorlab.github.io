import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO, JsonLd } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import PricingTierCard from '../components/PricingTierCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ProductTab = 'decoder' | 'sati-os' | 'codex' | 'support';

export default function Pricing() {
  const [activeTab, setActiveTab] = useState<ProductTab>('decoder');
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

  const tabs: { key: ProductTab; label: string }[] = [
    { key: 'decoder', label: 'QECTOR Decoder v3' },
    { key: 'sati-os', label: 'SATI OS' },
    { key: 'codex', label: 'SATI CODEX' },
    { key: 'support', label: 'Support' },
  ];

  return (
    <>
      <SEO
        title="Pricing · QECTOR"
        description="Transparent commercial pricing for QECTOR Decoder v3, SATI OS, and SATI CODEX. Source-available Rust and Python QEC decoder, full-stack platform, and IBM-verified topological code."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          'name': 'QECTOR Decoder v3',
          'description': 'Python and Rust quantum error correction decoder library with exact MWPM parity and Belief-Matching LER gains.',
          'brand': { '@type': 'Brand', 'name': 'QECTOR' },
          'offers': {
            '@type': 'AggregateOffer',
            'priceCurrency': 'USD',
            'lowPrice': '0',
            'highPrice': '15000',
            'offerCount': '4',
            'offers': [
              { '@type': 'Offer', 'name': 'Academic & Personal', 'price': '0', 'priceCurrency': 'USD' },
              { '@type': 'Offer', 'name': 'Evaluation Pilot', 'price': '1500', 'priceCurrency': 'USD' },
              { '@type': 'Offer', 'name': 'Startup', 'price': '3500', 'priceCurrency': 'USD' },
              { '@type': 'Offer', 'name': 'Lab License', 'price': '15000', 'priceCurrency': 'USD' }
            ]
          }
        }}
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-400/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-400/10 border border-gold-400/20 rounded-full text-xs font-semibold text-gold-400 uppercase tracking-wider mb-6">
            No retracted figures · No inflated claims · Source-available
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="Transparent Pricing" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Every tier priced on verified capability. Decoder free for non-commercial use.
            Commercial licenses from <span className="text-gold-400 font-semibold">$1,500</span> for a 90-day pilot.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-gold">Contact Sales</Link>
            <Link to="/commercial" className="btn-outline">Evaluation Options</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-6xl mx-auto">

          {/* Honesty strip */}
          <div ref={(el) => addRef(el, 0)} className="p-4 bg-gold-400/5 border border-gold-400/20 rounded-xl mb-10 max-w-3xl mx-auto">
            <p className="text-secondary text-sm leading-relaxed">
              <strong className="text-gold-400">Honesty register:</strong> QECTOR Decoder v3 and SATI OS are simulation-validated, production-grade software.
              They are <strong>not</strong> demonstrated fault-tolerant hardware systems. Pricing reflects engineering and IP value, not speculative hardware traction.
            </p>
          </div>

          {/* Product Tabs */}
          <div
            ref={(el) => addRef(el, 1)}
            role="tablist"
            aria-label="Pricing by product"
            className="flex flex-wrap justify-center gap-1 p-1 bg-surface border border-gridline rounded-xl w-fit mx-auto mb-10"
            onKeyDown={(e) => {
              if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
              e.preventDefault();
              const currentIndex = tabs.findIndex((t) => t.key === activeTab);
              const nextIndex = e.key === 'ArrowRight'
                ? (currentIndex + 1) % tabs.length
                : (currentIndex - 1 + tabs.length) % tabs.length;
              const nextTab = tabs[nextIndex];
              setActiveTab(nextTab.key);
              document.getElementById(`pricing-tab-${nextTab.key}`)?.focus();
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                id={`pricing-tab-${tab.key}`}
                role="tab"
                type="button"
                aria-selected={activeTab === tab.key}
                aria-controls={`pricing-panel-${tab.key}`}
                tabIndex={activeTab === tab.key ? 0 : -1}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                  activeTab === tab.key
                    ? 'bg-cyan-300/10 text-cyan-300 border border-cyan-300/20'
                    : 'text-secondary hover:text-primary hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Decoder Pricing */}
          {activeTab === 'decoder' && (
            <div
              ref={(el) => addRef(el, 2)}
              id="pricing-panel-decoder"
              role="tabpanel"
              aria-labelledby="pricing-tab-decoder"
              tabIndex={0}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <span className="text-cyan-300 text-xs font-semibold uppercase tracking-wider">QECTOR Decoder v3 · v0.5.7</span>
                <h2 className="text-2xl font-bold mt-2">Decoder Licensing</h2>
                <p className="text-secondary text-sm mt-2 max-w-2xl mx-auto">
                  10 decoder algorithms with compiled Rust core, CPU and CUDA, and PyPI binary distribution.
                  Free for personal and academic non-commercial use.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {['Exact LER parity d=3–15', 'Linux · Windows · macOS ARM64', 'Python 3.9–3.13', 'CUDA 6.9–7.7× CPU', 'Sigstore-attested wheels'].map((pill) => (
                  <span key={pill} className="px-3 py-1.5 bg-cyan-300/5 border border-cyan-300/15 rounded-full text-xs text-cyan-300">{pill}</span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Personal & Academic', price: '$0', period: '', desc: 'Non-commercial use, no time limit', features: ['All 10 decoder algorithms', 'CPU + CUDA batch paths', 'Stim / Sinter / Workbench integration', 'Full benchmark artifact bundle', 'Community issues on GitHub'], dim: ['No commercial use rights', 'No written license for funded work'] },
                  { name: 'Evaluation Pilot', price: '$1,500', period: '/ 90 days', desc: 'Creditable toward annual license', features: ['Full decoder package with commercial rights', 'Written license agreement', 'Benchmark artifact package', 'Pilot success criteria guidance', 'Email support during evaluation'], dim: ['Internal use only, no redistribution'] },
                  { name: 'Startup', price: '$3,500', period: '/ year', desc: 'Up to 5 named users', featured: true, features: ['Full decoder: all 10 algorithms', 'Commercial use rights: internal', 'Written license + legal clarity', 'CUDA + OpenCL batch paths', 'Reproducible artifact bundles', 'Priority bug review'], dim: ['No redistribution / OEM'] },
                  { name: 'Lab License', price: '$15,000', period: '/ year', desc: 'Up to 20 named users', features: ['Everything in Startup', 'Integration support + onboarding', 'Validation report package', 'Priority support queue', 'Benchmark review & reproducibility audit'], dim: ['No redistribution / OEM'] },
                ].map((tier) => (
                  <PricingTierCard
                    key={tier.name}
                    name={tier.name}
                    price={tier.price}
                    period={tier.period}
                    desc={tier.desc}
                    features={tier.features}
                    excluded={tier.dim}
                    featured={tier.featured}
                    ctaLabel={tier.price === '$0' ? 'pip install' : 'Contact Sales'}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SATI OS Pricing */}
          {activeTab === 'sati-os' && (
            <div id="pricing-panel-sati-os" role="tabpanel" aria-labelledby="pricing-tab-sati-os" tabIndex={0} className="space-y-8">
              <div className="text-center mb-8">
                <span className="text-cyan-300 text-xs font-semibold uppercase tracking-wider">SATI OS · v1.0.0</span>
                <h2 className="text-2xl font-bold mt-2">SATI OS Platform Licensing</h2>
                <p className="text-cyan-300 text-sm mt-1">GA Released July 2, 2026</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Trailblazer', price: '$1,788', period: '/ year', desc: 'Single named user · non-commercial', features: ['Full SATI OS core workbench', 'Desktop GUI + CLI + REST API', 'MCP server', '5 standard code providers', 'QECTOR Decoder v3 integrated', 'Community support'], dim: ['No LCL-832 premium code', 'Non-commercial only'] },
                  { name: 'Research', price: '$6,995', period: '/ year', desc: 'Up to 10 named users', featured: true, features: ['Everything in Trailblazer', 'Up to 10 named users', 'Full reproducibility + evidence package', 'IBM hardware job IDs + proof certificates', 'Publication and citation rights', 'Priority technical support', 'HAL access: all 17 vendor adapters'] },
                  { name: 'Commercial', price: '$19,995', period: '/ year', desc: 'Up to 25 named users', features: ['Everything in Research', 'Up to 25 named users', 'Commercial internal use rights', 'Integration guidance + onboarding', 'Bug fixes, maintenance + version updates', 'Quarterly feature roadmap access'], dim: ['OEM / SaaS: contact separately'] },
                  { name: 'Enterprise', price: '$49,995+', period: '/ year', desc: 'Unlimited internal users · custom SLA', features: ['Everything in Commercial', 'Unlimited internal named users', 'Custom SLA + response commitments', 'Architecture advisory sessions', 'Custom engineering scope available', 'Strategic IP licensing pathway', 'Source escrow available on request'] },
                ].map((tier) => (
                  <PricingTierCard
                    key={tier.name}
                    name={tier.name}
                    price={tier.price}
                    period={tier.period}
                    desc={tier.desc}
                    features={tier.features}
                    excluded={tier.dim}
                    featured={tier.featured}
                    featuredLabel="Research Tier"
                  />
                ))}
              </div>
            </div>
          )}

          {/* SATI CODEX Pricing */}
          {activeTab === 'codex' && (
            <div id="pricing-panel-codex" role="tabpanel" aria-labelledby="pricing-tab-codex" tabIndex={0} className="space-y-8">
              <div className="text-center mb-8">
                <span className="text-gold-400 text-xs font-semibold uppercase tracking-wider">SATI CODEX · Research Series</span>
                <h2 className="text-2xl font-bold mt-2">SATI CODEX Licensing</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {[
                  { name: 'Research Access', price: '$2,995', period: '/ year', desc: 'University / non-profit lab', features: ['Full SATI CODEX document access', 'LCL-832 construction + certificate', 'IBM hardware job IDs + datasets', 'ZNE methodology + extrapolation scripts', 'Citation + publication rights', '1 named researcher'] },
                  { name: 'Commercial IP', price: '$14,995', period: '/ year', desc: 'Commercial entity · full IP access', gold: true, features: ['Everything in Research Access', 'Commercial internal use rights', 'LCL-832 code family commercial license', 'Manufacturing blueprint access', 'Up to 5 named users', 'Provenance chain + Zenodo DOI'] },
                  { name: 'Due Diligence', price: 'Contact', period: '', desc: 'IP sale · exclusive license · acquisition', features: ['Full SATI OS + CODEX IP data room', 'Restricted Zenodo archive access', 'Full test suite + validation artifacts', 'IBM hardware evidence + job IDs', 'Replacement cost documentation', 'Valuation report furnished'] },
                ].map((tier) => (
                  <PricingTierCard
                    key={tier.name}
                    name={tier.name}
                    price={tier.price}
                    period={tier.period}
                    desc={tier.desc}
                    features={tier.features}
                    featured={tier.gold}
                    accent={tier.gold ? 'gold' : 'cyan'}
                    showRibbon={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Support Pricing */}
          {activeTab === 'support' && (
            <div id="pricing-panel-support" role="tabpanel" aria-labelledby="pricing-tab-support" tabIndex={0} className="space-y-8 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Support & Services</h2>
                <p className="text-secondary text-sm mt-2">Available as additions to any license tier.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gridline">
                      <th className="text-left py-3 px-4 text-cyan-300 font-semibold text-sm">Service</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-semibold text-sm">Price</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-semibold text-sm">Scope</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { service: 'Priority Support', price: '$5,000 / year', scope: 'Private email support, priority bug review, guaranteed response within 2 business days.' },
                      { service: 'Integration Support', price: '$10,000 / year', scope: 'Benchmark review, install support, integration guidance, and pipeline validation.' },
                      { service: 'Validation Report Package', price: '$5,000 one-time', scope: 'Review of customer benchmark setup, environment snapshot, reproducibility audit.' },
                      { service: 'Custom Engineering', price: '$150 / hour', scope: 'Private fixes, special reports, workflow adaptation. Min 10-hour engagement.' },
                      { service: 'Technical Advisory', price: '$2,000 / day', scope: 'Architecture review, QEC workflow consulting, stack evaluation.' },
                      { service: 'Pilot Evaluation Package', price: '$3,500 bundled', scope: '90-day decoder pilot + integration support + 1 validation report + setup call.' },
                    ].map((row) => (
                      <tr key={row.service} className="border-b border-gridline/50 hover:bg-surface/50 transition-colors">
                        <td className="py-3 px-4 text-primary text-sm font-medium">{row.service}</td>
                        <td className="py-3 px-4 text-gold-400 text-sm font-bold whitespace-nowrap">{row.price}</td>
                        <td className="py-3 px-4 text-secondary text-sm">{row.scope}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
