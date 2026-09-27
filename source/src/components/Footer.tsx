import { Link } from 'react-router-dom';
import { usePyPIVersion } from '../hooks/usePyPIVersion';

interface LinkItem {
  label: string;
  href?: string;
  external?: boolean;
  badge?: string;
}

const platformLinks: LinkItem[] = [
  { label: 'QECTOR Decoder v3', href: '/decoder', badge: 'Library' },
  { label: 'Claude Code Plugin', href: '/claude-plugin', badge: 'Claude' },
  { label: 'Workbench GUI', href: '/workbench', badge: 'Desktop App' },
  { label: 'QECTOR MCP Server', href: '/mcp-server', badge: 'MCP' },
  { label: 'Installer & App Bundles', href: '/installer' },
  { label: 'Pricing & Licensing', href: '/pricing' },
];

const researchLinks: LinkItem[] = [
  { label: 'Evidence & Reports', href: '/evidence' },
  { label: 'Technical Reference', href: '/technical-reference' },
  { label: 'Package User Manual', href: '/manual' },
  { label: 'Documentation Hub', href: '/docs' },
  { label: 'Version Changelog', href: '/changelog' },
];

const companyLinks: LinkItem[] = [
  { label: 'About QECTOR', href: '/about' },
  { label: 'Guillaume Lessard (Founder)', href: '/guillaume-lessard' },
  { label: 'iD01t Productions' },
  { label: 'Commercial Licensing', href: '/commercial' },
  { label: 'Contact Engineering', href: '/contact' },
  { label: 'EULA & License', href: '/license' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Refund Policy', href: '/refund' },
];

function FooterLink({ href, external, badge, children }: { href?: string; external?: boolean; badge?: string; children: React.ReactNode }) {
  const classes = 'group flex items-center justify-between gap-3 min-h-[44px] py-1.5 text-secondary hover:text-cyan-300 text-sm transition-colors duration-200';

  const content = (
    <>
      <span className="group-hover:translate-x-0.5 transition-transform duration-200">{children}</span>
      {badge && (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-gridline text-muted-foreground group-hover:border-cyan-300/30 group-hover:text-cyan-300 transition-colors">
          {badge}
        </span>
      )}
    </>
  );

  if (!href) {
    // Plain text item: no link, no navigation.
    return <span className={classes}>{content}</span>;
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
        <span className="sr-only">(opens in new tab)</span>
      </a>
    );
  }
  return (
    <Link to={href} className={classes}>
      {content}
    </Link>
  );
}

export default function Footer() {
  const { version: pypiVersion } = usePyPIVersion();
  return (
    <footer className="border-t border-cyan-900/40 bg-void/95 relative overflow-hidden text-left">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-16 bg-gradient-to-b from-cyan-400/5 to-transparent blur-3xl pointer-events-none" />

      <div className="section-padding py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            
            {/* Column 1 & 2: Brand Header */}
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="inline-flex items-center gap-3 text-cyan-300 hover:text-cyan-100 transition-colors duration-200">
                <img src="/images/logo.png" alt="QECTOR official logo" width="40" height="40" className="h-10 w-10 rounded-lg object-cover" />
                <span className="text-lg font-extrabold tracking-tight text-white">
                  QECTOR<span className="text-cyan-300">.</span>
                </span>
              </Link>

              <p className="text-secondary/80 text-sm leading-relaxed max-w-sm">
                Quantum error correction decoding for Python. Built by Guillaume Lessard at iD01t Productions.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <a href="https://pypi.org/project/qector-decoder-v3/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] text-muted-foreground hover:text-cyan-300 transition-colors" aria-label="PyPI">
                  <span className="text-sm font-mono border border-gridline rounded px-2 py-1 hover:border-cyan-300/30">v{pypiVersion}</span>
                  <span className="sr-only">(opens in new tab)</span>
                </a>
                <a href="https://github.com/GuillaumeLessard/qector-decoder" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] px-1 text-muted-foreground hover:text-cyan-300 transition-colors text-sm font-medium" aria-label="GitHub">
                  GitHub
                  <span className="sr-only">(opens in new tab)</span>
                </a>
                <a href="https://orcid.org/0009-0000-3465-3753" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] px-1 text-muted-foreground hover:text-cyan-300 transition-colors text-sm font-medium" aria-label="ORCID">
                  ORCID
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </div>
            </div>

            {/* Column 3: Platform */}
            <div className="space-y-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/90">Platform</h2>
              <div className="flex flex-col gap-1">
                {platformLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href} external={link.external} badge={link.badge}>
                    {link.label}
                  </FooterLink>
                ))}
              </div>
            </div>

            {/* Column 4: Research */}
            <div className="space-y-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/90">Research &amp; Docs</h2>
              <div className="flex flex-col gap-1">
                {researchLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href} external={link.external} badge={link.badge}>
                    {link.label}
                  </FooterLink>
                ))}
              </div>
            </div>

            {/* Column 5: Company */}
            <div className="space-y-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/90">Company</h2>
              <div className="flex flex-col gap-1">
                {/* Omit legal links from this column, keep only company links */}
                {companyLinks.slice(0, 5).map((link) => (
                  <FooterLink key={link.label} href={link.href} external={link.external} badge={link.badge}>
                    {link.label}
                  </FooterLink>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-gridline flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              <span className="font-semibold text-secondary">Distribution:</span> PyPI (<code className="text-cyan-300/80 font-mono">qector-decoder-v3</code>) is the Python library. The free <Link to="/installer" className="link-accent">Workbench GUI</Link> is a standalone desktop application shipped self-contained for Windows x64 and Linux x64 (no system Python required).
            </div>
            
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
              <Link to="/privacy" className="inline-flex items-center min-h-[44px] px-1 hover:text-cyan-300 transition-colors duration-200">Privacy</Link>
              <Link to="/terms" className="inline-flex items-center min-h-[44px] px-1 hover:text-cyan-300 transition-colors duration-200">Terms</Link>
              <Link to="/refund" className="inline-flex items-center min-h-[44px] px-1 hover:text-cyan-300 transition-colors duration-200">Refund</Link>
               <Link to="/license" className="inline-flex items-center min-h-[44px] px-1 hover:text-cyan-300 transition-colors duration-200">License</Link>
              <a href="/.well-known/security.txt" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] px-1 hover:text-cyan-300 transition-colors duration-200">Security<span className="sr-only">(opens in new tab)</span></a>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#050b14]">
        <div className="section-padding py-4">
          <div className="max-w-7xl mx-auto text-xs text-muted-foreground/70 text-center md:text-left">
            &copy; 2026 QECTOR Lab / iD01t Productions. All rights reserved.
            <div className="mt-1">
              Éditeur : Guillaume Lessard, entrepreneur individuel (iD01t Productions), 2004 De Lorimier, Longueuil, QC J4K 3H7, Canada · admin@qector.store
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

