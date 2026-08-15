import { Link } from 'react-router';
import { usePyPIVersion } from '../hooks/usePyPIVersion';

interface LinkItem {
  label: string;
  href: string;
  external?: boolean;
  badge?: string;
}

const platformLinks: LinkItem[] = [
  { label: 'QECTOR Decoder v3', href: '/decoder', badge: 'Library' },
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
  { label: 'iD01t Productions', href: 'https://id01t.store/', external: true },
  { label: 'Commercial Licensing', href: '/commercial' },
  { label: 'Contact Engineering', href: '/contact' },
  { label: 'EULA & License', href: '/license' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Refund Policy', href: '/refund' },
];

function FooterLink({ href, external, badge, children }: { href: string; external?: boolean; badge?: string; children: React.ReactNode }) {
  const classes = 'group flex items-center justify-between text-secondary hover:text-cyan-300 text-sm transition-colors duration-200 py-0.5';
  
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

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
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
              <Link to="/" className="inline-flex items-center gap-3 text-cyan-300 hover:text-cyan-100 transition-colors">
                <img src="/assets/logo.svg" alt="QECTOR official logo" width="96" height="54" className="h-10 w-auto object-contain" />
              </Link>

              <p className="text-secondary/80 text-sm leading-relaxed max-w-sm">
                Production-grade quantum error correction decoding for Python. Built by Guillaume Lessard at iD01t Productions.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <a href="https://pypi.org/project/qector-decoder-v3/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cyan-300 transition-colors" aria-label="PyPI">
                  <span className="text-sm font-mono border border-gridline rounded px-2 py-1 hover:border-cyan-300/30">v{pypiVersion}</span>
                </a>
                <a href="https://github.com/GuillaumeLessard/qector-decoder" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cyan-300 transition-colors text-sm font-medium" aria-label="GitHub">
                  GitHub
                </a>
                <a href="https://orcid.org/0009-0000-3465-3753" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cyan-300 transition-colors text-sm font-medium" aria-label="ORCID">
                  ORCID
                </a>
              </div>
            </div>

            {/* Column 3: Platform */}
            <div className="space-y-5">
              <h4 className="text-white font-semibold text-sm tracking-wide">Platform</h4>
              <div className="flex flex-col gap-3">
                {platformLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href} external={link.external} badge={link.badge}>
                    {link.label}
                  </FooterLink>
                ))}
              </div>
            </div>

            {/* Column 4: Research */}
            <div className="space-y-5">
              <h4 className="text-white font-semibold text-sm tracking-wide">Research &amp; Docs</h4>
              <div className="flex flex-col gap-3">
                {researchLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href} external={link.external} badge={link.badge}>
                    {link.label}
                  </FooterLink>
                ))}
              </div>
            </div>

            {/* Column 5: Company */}
            <div className="space-y-5">
              <h4 className="text-white font-semibold text-sm tracking-wide">Company</h4>
              <div className="flex flex-col gap-3">
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
              <span className="font-semibold text-secondary">Distribution:</span> PyPI (<code className="text-cyan-300/80 font-mono">qector-decoder-v3</code>) is the Python library. The free <Link to="/installer" className="text-cyan-300 hover:underline">Workbench GUI</Link> is a standalone desktop application shipped self-contained for Windows &amp; Linux (no system Python required).
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
              <Link to="/privacy" className="hover:text-cyan-300 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-cyan-300 transition-colors">Terms</Link>
              <Link to="/refund" className="hover:text-cyan-300 transition-colors">Refund</Link>
              <Link to="/license" className="hover:text-cyan-300 transition-colors">License</Link>
              <a href="/.well-known/security.txt" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">Security</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#050b14]">
        <div className="section-padding py-4">
          <div className="max-w-7xl mx-auto text-xs text-muted-foreground/70 text-center md:text-left">
            &copy; 2026 QECTOR Lab / iD01t Productions. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
