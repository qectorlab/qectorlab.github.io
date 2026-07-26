import { Link } from 'react-router';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import { Sparkles, Mail, ShieldCheck } from 'lucide-react';

export default function SatiOs() {
  return (
    <>
      <SEO
        title="SATI OS · QECTOR"
        description="SATI OS - Full-stack Quantum Error Correction Operating Suite. Available soon. Contact us for beta testing and early access."
      />

      <section className="relative py-28 md:py-40 text-center overflow-hidden min-h-[75vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/10 via-surface/30 to-void" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-300/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 section-padding max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-300/10 border border-cyan-300/30 rounded-full text-xs font-bold text-cyan-300 uppercase tracking-widest mb-8 animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Available Soon</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="SATI OS" className="text-4xl md:text-7xl font-extrabold" />
          </h1>

          <p className="text-secondary text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed mb-4 text-cyan-100">
            Available soon — contact us for beta testing.
          </p>

          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-10">
            SATI OS is currently undergoing final optimization for commercial deployment. Join our exclusive beta testing program to get early access to the next-generation QEC operating platform.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="btn-cyan flex items-center gap-2 px-8 py-4 text-base font-semibold shadow-lg shadow-cyan-300/20 hover:shadow-cyan-300/40 transition-all"
            >
              <Mail className="w-5 h-5" />
              Contact Us for Beta Testing
            </Link>

            <Link
              to="/decoder"
              className="btn-outline flex items-center gap-2 px-8 py-4 text-base font-semibold"
            >
              <ShieldCheck className="w-5 h-5" />
              Explore QECTOR Decoder v3
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
