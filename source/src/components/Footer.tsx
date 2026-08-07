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
  { label: 'Workbench GUI v0.5.2', href: '/workbench', badge: 'Desktop App' },
  { label: '56-Tool MCP Server', href: '/mcp-server', badge: 'MCP' },
  { label: 'Installer & App Bundles', href: '/installer' },
  { label: 'Pricing & Licensing', href: '/pricing' },
  { label: 'SATI OS Commercial Stack', href: '/sati-os' },
];

const researchLinks: LinkItem[] = [
  { label: 'Evidence & Provenance', href: '/evidence' },
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
  { label: 'GitHub Repository', href: 'https://github.com/GuillaumeLessard/qector-decoder', external: true },
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
    <footer className="border-t border-cyan-300/15 bg-void/95 relative overflow-hidden text-left">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-cyan-300/10 to-transparent blur-3xl pointer-events-none" />

      <div className="section-padding py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
            
            {/* Column 1 & 2: Brand Header & Status */}
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="inline-flex items-center gap-2.5 text-cyan-300 font-extrabold text-2xl tracking-tight hover:opacity-90 transition-opacity">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <circle cx="16" cy="16" r="14" stroke="#67e8f9" strokeWidth="1.5" fill="none" />
                  <circle cx="16" cy="16" r="6" fill="#67e8f9" fillOpacity="0.3" stroke="#67e8f9" strokeWidth="1" />
                  <line x1="16" y1="2" x2="16" y2="30" stroke="#67e8f9" strokeWidth="0.5" opacity="0.5" />
                  <line x1="2" y1="16" x2="30" y2="16" stroke="#67e8f9" strokeWidth="0.5" opacity="0.5" />
                </svg>
                <span>QECTOR</span>
              </Link>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-400/10 border border-green-400/25 rounded-full text-xs font-mono text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>v1.0.0 Stable Release Train · Live PyPI v{pypiVersion}</span>
              </div>

              <p className="text-secondary text-sm leading-relaxed max-w-md">
                High-performance quantum error correction library &amp; desktop workbench. v1.0.0 first stable release. No universal benchmark figures are published; qector bench ships for measuring on your own hardware. Created by Guillaume Lessard at iD01t Productions.
              </p>

              {/* Direct Quick Badges */}
              <div className="space-y-2 pt-2">
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Official Packages &amp; Repositories</div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://pypi.org/project/qector-decoder-v3/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface/80 border border-cyan-300/30 rounded-lg text-xs text-cyan-300 font-mono hover:bg-cyan-300/10 transition-colors"
                  >
                    <span>📦</span>
                    <span>PyPI Wheel: qector-decoder-v3</span>
                  </a>
                  <Link
                    to="/installer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface/80 border border-gold-400/30 rounded-lg text-xs text-gold-400 font-mono hover:bg-gold-400/10 transition-colors"
                  >
                    <span>💻</span>
                    <span>Workbench App v0.5.2 (Free GUI)</span>
                  </Link>
                  <a
                    href="https://github.com/GuillaumeLessard/qector-decoder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface/80 border border-gridline rounded-lg text-xs text-secondary hover:text-cyan-300 hover:border-cyan-300/30 transition-colors"
                  >
                    <span>📋</span>
                    <span>GitHub Artifacts</span>
                  </a>
                  <a
                    href="https://orcid.org/0009-0000-3465-3753"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface/80 border border-gridline rounded-lg text-xs text-secondary hover:text-cyan-300 hover:border-cyan-300/30 transition-colors"
                  >
                    <span>🆔</span>
                    <span>ORCID 0009-0000-3465-3753</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3: Platform */}
            <div className="space-y-4">
              <h4 className="text-primary font-bold text-xs uppercase tracking-widest text-cyan-300">Platform</h4>
              <div className="flex flex-col gap-2">
                {platformLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href} external={link.external} badge={link.badge}>
                    {link.label}
                  </FooterLink>
                ))}
              </div>
            </div>

            {/* Column 4: Research */}
            <div className="space-y-4">
              <h4 className="text-primary font-bold text-xs uppercase tracking-widest text-cyan-300">Research &amp; Docs</h4>
              <div className="flex flex-col gap-2">
                {researchLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href} external={link.external} badge={link.badge}>
                    {link.label}
                  </FooterLink>
                ))}
              </div>
            </div>

            {/* Column 5: Company */}
            <div className="space-y-4">
              <h4 className="text-primary font-bold text-xs uppercase tracking-widest text-cyan-300">Company &amp; Legal</h4>
              <div className="flex flex-col gap-2">
                {companyLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href} external={link.external} badge={link.badge}>
                    {link.label}
                  </FooterLink>
                ))}
              </div>
            </div>

          </div>

          {/* Distinction Banner Box */}
          <div className="mt-12 p-4 rounded-xl border border-gridline bg-surface/40 text-xs text-muted-foreground leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-cyan-300 text-base shrink-0">💡</span>
              <span>
                <strong className="text-secondary">Distribution note:</strong> PyPI (<code className="text-cyan-300 font-mono">qector-decoder-v3</code>) is the Python library wheel. The free <strong className="text-secondary">QECTOR Workbench GUI v0.5.2</strong> is a standalone desktop application shipped self-contained for Windows x64 and Linux x64, requiring no system Python or pip.
              </span>
            </div>
            <Link to="/installer" className="text-cyan-300 hover:underline shrink-0 font-semibold text-xs">
              View App Installers →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gridline bg-void/80">
        <div className="section-padding py-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <div>
              &copy; 2026 QECTOR Lab / iD01t Productions, Longueuil, QC, Canada - admin@qector.store. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <Link to="/privacy" className="hover:text-cyan-300 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-cyan-300 transition-colors">Terms of Service</Link>
              <Link to="/refund" className="hover:text-cyan-300 transition-colors">Refund Policy</Link>
              <Link to="/license" className="hover:text-cyan-300 transition-colors">License Agreement</Link>
              <a href="/.well-known/security.txt" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
