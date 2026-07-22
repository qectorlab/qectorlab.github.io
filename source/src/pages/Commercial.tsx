import { useEffect } from 'react';
import { Link } from 'react-router';
import { SEO } from '../lib/seo';

export default function Commercial() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Enterprise Licensing · QECTOR"
        description="Enterprise and OEM licenses for QECTOR Decoder v3. Custom agreements for redistribution, SaaS hosting, and hardware bundling."
      />
      <section className="py-24 md:py-32 section-padding text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Enterprise & OEM Licensing</h1>
          <p className="text-secondary text-lg mb-8">
            Custom licensing for redistribution, SaaS hosting, hardware bundling, and strategic partnerships.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/pricing" className="btn-cyan">View All Pricing & Tiers →</Link>
            <Link to="/contact" className="btn-gold">Contact Enterprise Sales</Link>
          </div>
          <p className="text-muted-foreground text-sm mt-6">
            All standard licensing information including evaluation, annual tiers, and FAQs has moved to the{' '}
            <Link to="/pricing" className="text-cyan-300 hover:underline">Pricing page</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
