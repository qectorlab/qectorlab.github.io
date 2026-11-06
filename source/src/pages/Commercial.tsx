import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import { PRICES, usd } from '../lib/pricing';

const OFFERS = [
  { title: 'Hosted, SaaS and API', body: 'Offer QECTOR decoding to your own customers through a hosted service or API. Standard plans cover internal use only.' },
  { title: 'OEM and hardware bundling', body: 'Ship QECTOR inside your control stack, appliance or software product, with redistribution rights for your customers.' },
  { title: 'Named support engineer', body: 'A direct line to the developer, response targets written into the agreement, and help with integration and upgrades.' },
  { title: 'Custom terms', body: 'Signed agreement, your paper or ours, purchase orders and invoicing, security questionnaires and vendor onboarding.' },
];

const STEPS = [
  'E-mail admin@qector.store or book a call: tell us the use case, deployment and timeline.',
  'Optional: start with the Pilot (60 days, creditable toward Lab) or a Validation Sprint on your workloads.',
  'We send a written proposal and agreement; Enterprise starts from ' + usd(PRICES.enterpriseFrom) + ' a year.',
  'Sign, pay by invoice or card, and receive offline licence tokens the same day.',
];

export default function Commercial() {
  return (
    <>
      <SEO
        title="Enterprise & OEM Licensing · QECTOR"
        description={`Enterprise and OEM licences for QECTOR Decoder v3: hosted and SaaS rights, OEM and hardware bundling, named support and a signed agreement, from ${usd(PRICES.enterpriseFrom)} a year. Air-gapped licensing.`}
      />
      <section className="relative py-24 md:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/30 to-void" />
        <div className="relative z-10 section-padding max-w-3xl mx-auto">
          <span className="eyebrow-pill">Enterprise &amp; OEM</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] my-6">
            <NeuralReveal text="Enterprise & OEM Licensing" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl leading-relaxed mb-8">
            For teams that put QECTOR in front of their own customers, inside their hardware, or under their own contract terms.
            From {usd(PRICES.enterpriseFrom)} a year, with licences that verify offline.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-gold">Talk to us</Link>
            <Link to="/pricing" className="btn-cyan">Compare all plans</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="grid sm:grid-cols-2 gap-6">
            {OFFERS.map((o) => (
              <div key={o.title} className="card-surface">
                <h2 className="text-lg font-bold mb-2">{o.title}</h2>
                <p className="text-secondary text-sm leading-relaxed">{o.body}</p>
              </div>
            ))}
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">How it works</h2>
            <ol className="list-decimal pl-5 space-y-2 text-secondary text-sm leading-relaxed">
              {STEPS.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-3">Not sure you need Enterprise?</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Internal research and production use, including GPU decoding, is covered by Pro ({usd(PRICES.proMonthly)}/month) or Lab
              ({usd(PRICES.lab)}/year), bought online with no seat counts. You need Enterprise only for hosted or customer-facing use, OEM
              redistribution or custom contract terms. See the{' '}
              <Link to="/license-agreement" className="text-cyan-300 hover:underline">Commercial Licence Agreement</Link> and the{' '}
              <Link to="/security" className="text-cyan-300 hover:underline">Security &amp; Trust</Link> pack for procurement.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
