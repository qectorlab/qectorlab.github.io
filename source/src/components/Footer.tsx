import { Link } from 'react-router';
import { usePyPIVersion } from '../hooks/usePyPIVersion';

interface LinkItem {
  label: string;
  href: string;
  external?: boolean;
}

const productLinks: LinkItem[] = [
  { label: 'Decoder v3', href: '/decoder' },
  { label: 'SATI OS', href: '/sati-os' },
  { label: 'Workbench', href: '/workbench' },
  { label: 'SATI CODEX', href: '/sati-codex' },
  { label: 'Evidence & Reports', href: '/evidence' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Pricing', href: '/pricing' },
];

const companyLinks: LinkItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Commercial', href: '/commercial' },
  { label: 'Contact', href: '/contact' },
  { label: 'GitHub', href: 'https://github.com/GuillaumeLessard/qector-decoder', external: true },
];

const researchLinks: LinkItem[] = [
  { label: 'Benchmarks', href: '/benchmarks' },
  { label: 'Technical Reference', href: '/technical-reference' },
  { label: 'User Manual', href: '/manual' },
  { label: 'Docs Hub', href: '/docs' },
];

function FooterLink({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  const classes = 'text-secondary hover:text-cyan-300 text-sm transition-colors duration-200';
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={classes}>
      {children}
    </Link>
  );
}

function LinkList({ links }: { links: LinkItem[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {links.map((link) => (
        <FooterLink key={link.label} href={link.href} external={link.external}>
          {link.label}
        </FooterLink>
      ))}
    </div>
  );
}

export default function Footer() {
  const { version: pypiVersion } = usePyPIVersion();
  return (
    <footer className="border-t border-gridline bg-void">
      <div className="section-padding py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 text-cyan-300 font-bold text-xl tracking-tight mb-4">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" stroke="#67e8f9" strokeWidth="1.5" fill="none" />
                  <circle cx="16" cy="16" r="6" fill="#67e8f9" fillOpacity="0.3" stroke="#67e8f9" strokeWidth="1" />
                  <line x1="16" y1="2" x2="16" y2="30" stroke="#67e8f9" strokeWidth="0.5" opacity="0.5" />
                  <line x1="2" y1="16" x2="30" y2="16" stroke="#67e8f9" strokeWidth="0.5" opacity="0.5" />
                </svg>
                QECTOR
              </Link>
              <p className="text-secondary text-sm leading-relaxed max-w-sm mb-6">
                QECTOR Decoder v3 under the qectorlab brand. Exact MWPM parity with PyMatching through d=15. +35.7% LER reduction with Belief-Matching. All benchmarks and artifacts on GitHub.
              </p>
              <p className="text-xs text-muted-foreground">Created by Guillaume Lessard (ORCID) / iD01t Productions</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: '\uD83D\uDCCB', label: 'Artifacts (GitHub)', href: 'https://github.com/GuillaumeLessard/qector-decoder' },
                  { icon: '\uD83D\uDCE6', label: `PyPI v${pypiVersion} + Workbench v3.4`, href: 'https://pypi.org/project/qector-decoder-v3/' },
                  { icon: '\uD83D\uDCD6', label: 'Mastering QEC', href: 'https://play.google.com/store/books/details?id=dGXuEQAAQBAJ' },
                  { icon: '\uD83D\uDCCB', label: 'ORCID', href: 'https://orcid.org/0009-0000-3465-3753' },
                ].map((pill) => (
                  <a
                    key={pill.label}
                    href={pill.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-gridline rounded-full text-xs text-secondary hover:text-cyan-300 hover:border-cyan-300/30 transition-all duration-200"
                  >
                    <span>{pill.icon}</span>
                    <span>{pill.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">Product</h4>
              <LinkList links={productLinks} />
            </div>

            {/* Company */}
            <div>
              <h4 className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
              <LinkList links={companyLinks} />
            </div>

            {/* Research */}
            <div>
              <h4 className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">Research</h4>
              <LinkList links={researchLinks} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gridline">
        <div className="section-padding py-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; 2026 Guillaume Lessard / iD01t Productions. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-cyan-300 transition-colors">Privacy</Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-cyan-300 transition-colors">Terms</Link>
              <Link to="/license" className="text-xs text-muted-foreground hover:text-cyan-300 transition-colors">License</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
