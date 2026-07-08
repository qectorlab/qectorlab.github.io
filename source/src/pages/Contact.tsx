import { useState, useEffect, useRef } from 'react';
import { SEO, JsonLd } from '../lib/seo';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="Contact · QECTOR"
        description="Contact QECTOR · commercial inquiries, technical support schedules, and evaluation requests."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact QECTOR',
          description: 'Commercial inquiries, technical support, and evaluation requests for QECTOR.',
          url: 'https://qector.store/contact',
          mainEntity: {
            '@type': 'Organization',
            name: 'QECTOR',
            url: 'https://qector.store',
            email: 'mailto:admin@qector.store',
            sameAs: [
              'https://github.com/GuillaumeLessard/qector-decoder',
              'https://pypi.org/project/qector-decoder-v3/',
              'https://github.com/GuillaumeLessard/qector-decoder',
            ],
          },
        }}
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
            admin@qector.store · Mon–Fri EST/EDT
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">Contact Us</h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Commercial evaluation requests, technical inquiries, partnership discussions,
            and support — all handled directly by Guillaume Lessard / iD01t Productions.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Left Info */}
            <div ref={(el) => addRef(el, 0)} className="lg:col-span-2 space-y-4">
              <div className="card-surface">
                <h3 className="text-primary font-semibold mb-2">Office</h3>
                <p className="text-secondary text-sm leading-relaxed">
                  QECTOR is developed by iD01t Productions.<br />
                  Primary contact: Guillaume Lessard.<br />
                  Email: <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>
                </p>
              </div>
              <div className="card-surface">
                <h3 className="text-primary font-semibold mb-2">Working Hours</h3>
                <p className="text-secondary text-sm leading-relaxed">
                  Monday – Friday: 09:00–17:00 EST/EDT<br />
                  Saturday – Sunday: Closed
                </p>
              </div>
              <div className="card-surface">
                <h3 className="text-primary font-semibold mb-2">Links</h3>
                <div className="flex flex-col gap-2">
                  <a href="https://orcid.org/0009-0000-3465-3753" target="_blank" rel="noopener noreferrer" className="text-cyan-300 text-sm hover:underline">ORCID</a>
                  <a href="https://play.google.com/store/books/details?id=dGXuEQAAQBAJ" target="_blank" rel="noopener noreferrer" className="text-cyan-300 text-sm hover:underline">QEC Book</a>
                </div>
              </div>
              <div className="p-4 bg-green-400/5 border border-green-400/20 rounded-xl">
                <p className="text-green-400 text-sm font-semibold">⚡ Lead-reply time: 1 business day for commercial inquiries.</p>
              </div>
            </div>

            {/* Right Form */}
            <div ref={(el) => addRef(el, 1)} className="lg:col-span-3">
              <div className="card-surface">
                {submitted ? (
                  <div className="text-center py-12" role="status" aria-live="polite">
                    <div className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-400 text-2xl" aria-hidden="true">✓</span>
                    </div>
                    <h3 className="text-primary font-bold text-xl mb-2">Message Sent</h3>
                    <p className="text-secondary">We'll get back to you within 1 business day.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block text-secondary text-sm mb-2">Full Name <span className="text-cyan-300">*</span></label>
                        <input id="contact-name" name="name" type="text" required autoComplete="name" className="w-full px-4 py-3 bg-void border border-gridline rounded-lg text-primary text-sm focus:border-cyan-300/50 focus:outline-none transition-colors" placeholder="Your name" />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-secondary text-sm mb-2">Email Address <span className="text-cyan-300">*</span></label>
                        <input id="contact-email" name="email" type="email" required autoComplete="email" className="w-full px-4 py-3 bg-void border border-gridline rounded-lg text-primary text-sm focus:border-cyan-300/50 focus:outline-none transition-colors" placeholder="you@company.com" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-org" className="block text-secondary text-sm mb-2">Organization / Affiliation</label>
                      <input id="contact-org" name="organization" type="text" autoComplete="organization" className="w-full px-4 py-3 bg-void border border-gridline rounded-lg text-primary text-sm focus:border-cyan-300/50 focus:outline-none transition-colors" placeholder="Company or Institution" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-referral" className="block text-secondary text-sm mb-2">Referral Source</label>
                        <select id="contact-referral" name="referral" className="w-full px-4 py-3 bg-void border border-gridline rounded-lg text-primary text-sm focus:border-cyan-300/50 focus:outline-none transition-colors">
                          <option value="">— Select —</option>
                          <option>Web search</option>
                          <option>Social media</option>
                          <option>Conference / event</option>
                          <option>Publication / DOI</option>
                          <option>Recommendation</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="contact-timeline" className="block text-secondary text-sm mb-2">Evaluation Timeline</label>
                        <select id="contact-timeline" name="timeline" className="w-full px-4 py-3 bg-void border border-gridline rounded-lg text-primary text-sm focus:border-cyan-300/50 focus:outline-none transition-colors">
                          <option value="">— Select —</option>
                          <option>0–30 days</option>
                          <option>30–90 days</option>
                          <option>90+ days</option>
                          <option>Undecided</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-secondary text-sm mb-2">Message <span className="text-cyan-300">*</span></label>
                      <textarea id="contact-message" name="message" required rows={6} className="w-full px-4 py-3 bg-void border border-gridline rounded-lg text-primary text-sm focus:border-cyan-300/50 focus:outline-none transition-colors resize-y" placeholder="Tell us about your interest in QECTOR and evaluation needs..." />
                    </div>
                    <button type="submit" className="btn-gold w-full py-3">
                      Send Message
                    </button>
                    <p className="text-muted-foreground text-xs">
                      By submitting this form, you agree to the processing of your contact data to respond to your inquiry. We do not share submission contents with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
