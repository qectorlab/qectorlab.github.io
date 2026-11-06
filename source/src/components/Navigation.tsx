import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem { label: string; href: string; note?: string }
interface NavGroup { label: string; items: NavItem[] }
type NavEntry = NavItem | NavGroup;

const isGroup = (e: NavEntry): e is NavGroup => 'items' in e;

const navEntries: NavEntry[] = [
  {
    label: 'Products',
    items: [
      { label: 'Decoder', href: '/decoder', note: 'Python library, Rust core' },
      { label: 'Claude Plugin', href: '/claude-plugin', note: 'Air-gapped MCP for Claude' },
      { label: 'Workbench', href: '/workbench', note: 'Free desktop GUI' },
      { label: 'MCP Server', href: '/mcp-server', note: 'Tools for any MCP client' },
      { label: 'Installers', href: '/installer', note: 'Downloads and checksums' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Documentation', href: '/docs', note: 'Start here' },
      { label: 'User Manual', href: '/manual', note: 'Reference manual (DOI)' },
      { label: 'Technical Reference', href: '/technical-reference', note: 'API tiers and decoders' },
      { label: 'Compare', href: '/compare', note: 'QECTOR and alternatives' },
      { label: 'Evidence', href: '/evidence', note: 'Validation and DOIs' },
      { label: 'Changelog', href: '/changelog', note: 'Every release' },
      { label: 'Blog', href: '/blog', note: 'QEC articles' },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  {
    label: 'Company',
    items: [
      { label: 'About', href: '/about' },
      { label: 'Founder', href: '/guillaume-lessard' },
      { label: 'Enterprise & OEM', href: '/commercial' },
      { label: 'Security & Trust', href: '/security' },
      { label: 'Licence Agreement', href: '/license-agreement' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrolled(currentScrollY > 50);
    if (currentScrollY > 200) {
      setHidden(currentScrollY > (window as unknown as { lastScrollY: number }).lastScrollY);
    } else {
      setHidden(false);
    }
    (window as unknown as { lastScrollY: number }).lastScrollY = currentScrollY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close the mobile menu whenever the route changes. This is a legitimate
  // effect: we can't derive `isOpen` from `location` because the user can also
  // toggle it independently, but we need to reset it on navigation. React 19's
  // linter flags setState-in-effect as a perf hazard, so we keep the reset but
  // silence the rule with a targeted comment explaining why it's intentional.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    setOpenGroup(null);
  }, [location]);

  useEffect(() => {
    if (!openGroup) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) {
        if (e.key === 'Escape') setOpenGroup(null);
        return;
      }
      const target = e.target as HTMLElement | null;
      if (!target?.closest('[data-nav-group]')) setOpenGroup(null);
    };
    window.addEventListener('mousedown', close);
    window.addEventListener('keydown', close);
    return () => {
      window.removeEventListener('mousedown', close);
      window.removeEventListener('keydown', close);
    };
  }, [openGroup]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };
  const groupActive = (g: NavGroup) => g.items.some((i) => isActive(i.href));

  return (
    <>
      <nav
        aria-label="Main"
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-500 ease-out ${
          hidden && !isOpen ? '-translate-y-[140%]' : 'translate-y-0'
        }`}
        inert={hidden && !isOpen}
      >
        <div
          className={`glass-nav rounded-2xl px-4 sm:px-6 py-3 transition-all duration-300 ${
            scrolled ? 'shadow-deep' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 text-cyan-300 hover:text-cyan-100 transition-colors"
            >
              <img src="/images/logo.png" alt="QECTOR official logo" width="36" height="36" className="h-9 w-9 rounded-lg object-cover" />
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navEntries.map((entry) =>
                isGroup(entry) ? (
                  <div key={entry.label} className="relative" data-nav-group
                    onMouseEnter={() => setOpenGroup(entry.label)}
                    onMouseLeave={() => setOpenGroup((g) => (g === entry.label ? null : g))}
                  >
                    <button
                      type="button"
                      aria-expanded={openGroup === entry.label}
                      aria-haspopup="true"
                      onClick={() => setOpenGroup((g) => (g === entry.label ? null : entry.label))}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        groupActive(entry) ? 'text-cyan-300 bg-cyan-300/10' : 'text-secondary hover:text-primary hover:bg-white/5'
                      }`}
                    >
                      {entry.label}
                      <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${openGroup === entry.label ? 'rotate-180' : ''}`}><path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
                    </button>
                    {openGroup === entry.label && (
                      <div className="absolute left-0 top-full pt-2 z-50">
                        <ul className="glass-nav rounded-xl p-2 w-64 shadow-deep" role="list">
                          {entry.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                to={item.href}
                                aria-current={isActive(item.href) ? 'page' : undefined}
                                className={`block px-3 py-2 rounded-lg transition-colors ${isActive(item.href) ? 'bg-cyan-300/10' : 'hover:bg-white/5'}`}
                              >
                                <span className={`block text-sm font-medium ${isActive(item.href) ? 'text-cyan-300' : 'text-primary'}`}>{item.label}</span>
                                {item.note && <span className="block text-xs text-muted-foreground">{item.note}</span>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={entry.href}
                    to={entry.href}
                    aria-current={isActive(entry.href) ? 'page' : undefined}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive(entry.href) ? 'text-cyan-300 bg-cyan-300/10' : 'text-secondary hover:text-primary hover:bg-white/5'
                    }`}
                  >
                    {entry.label}
                  </Link>
                ),
              )}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                to="/pricing"
                className="hidden sm:inline-flex items-center px-4 py-2 border border-gold-400/60 text-gold-400 text-sm font-medium rounded-lg hover:bg-gold-400/10 transition-all duration-300"
              >
                Get License
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex flex-col items-center justify-center gap-1.5 p-2 min-h-[44px] min-w-[44px] rounded-lg hover:bg-white/5 transition-colors"
                aria-label={location.pathname.startsWith('/fr/') ? (isOpen ? 'Fermer le menu' : 'Ouvrir le menu') : (isOpen ? 'Close menu' : 'Open menu')}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <span className={`block w-5 h-0.5 bg-primary transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-primary transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-primary transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          aria-hidden={!isOpen}
          className={`lg:hidden mt-2 glass-nav rounded-2xl overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-[calc(100dvh-110px)] overflow-y-auto opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="px-4 py-3 space-y-1">
            {navEntries.map((entry) =>
              isGroup(entry) ? (
                <div key={entry.label} className="pt-2">
                  <div className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{entry.label}</div>
                  {entry.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={`flex items-center px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(item.href) ? 'text-cyan-300 bg-cyan-300/10' : 'text-secondary hover:text-primary hover:bg-white/5'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={entry.href}
                  to={entry.href}
                  aria-current={isActive(entry.href) ? 'page' : undefined}
                  className={`flex items-center px-4 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(entry.href) ? 'text-cyan-300 bg-cyan-300/10' : 'text-secondary hover:text-primary hover:bg-white/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {entry.label}
                </Link>
              ),
            )}
            <Link
              to="/pricing"
              className="sm:hidden mt-2 text-center px-4 py-3 min-h-[44px] flex items-center justify-center border border-gold-400/60 text-gold-400 text-sm font-medium rounded-lg hover:bg-gold-400/10 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Get License
            </Link>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

