import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import { Home, BookOpen, Cpu, FlaskConical, Mail, ArrowRight } from 'lucide-react';

const HELPFUL_LINKS = [
  { to: '/decoder', icon: Cpu, title: 'QECTOR Decoder v3', desc: '17 decoder configurations for Python' },
  { to: '/docs', icon: BookOpen, title: 'Documentation Hub', desc: 'Guides, manuals, and references' },
  { to: '/evidence', icon: FlaskConical, title: 'Evidence & Reports', desc: 'Contracts, methodology, artifacts' },
  { to: '/contact', icon: Mail, title: 'Contact Engineering', desc: 'Talk to the team behind QECTOR' },
];

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found · QECTOR" description="The requested page could not be found." noindex />

      <section className="relative min-h-[80vh] flex items-center justify-center section-padding py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-transparent to-void pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full min-w-0 text-center max-w-2xl mx-auto">
          <span className="eyebrow-pill mb-6">404 · Not found</span>

          <div className="text-8xl md:text-9xl font-extrabold tracking-tight leading-none mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-300/80 to-cyan-300/10 select-none" aria-hidden="true">
              404
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <NeuralReveal text="Page Not Found" className="text-3xl md:text-4xl font-bold" />
          </h1>

          <p className="text-secondary text-lg leading-relaxed max-w-prose mx-auto mb-10">
            The page you are looking for does not exist or has been moved.
            The links below will get you back on track.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-14">
            <Link to="/" className="btn-cyan inline-flex items-center gap-2">
              <Home size={16} aria-hidden="true" />
              Back to Home
            </Link>
            <Link to="/docs" className="btn-outline">
              Documentation
            </Link>
          </div>

          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 text-center">
              You might be looking for
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HELPFUL_LINKS.map(({ to, icon: Icon, title, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className="card-surface group flex items-center gap-4 !p-5 text-left"
                >
                  <span className="shrink-0 w-10 h-10 rounded-xl bg-cyan-300/10 border border-cyan-300/20 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-300/20 transition-colors duration-200">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-primary group-hover:text-cyan-200 transition-colors duration-200">
                      {title}
                    </span>
                    <span className="block text-xs text-muted-foreground leading-relaxed">
                      {desc}
                    </span>
                  </span>
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 text-muted-foreground group-hover:text-cyan-300 group-hover:translate-x-1 transition-all duration-200"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
