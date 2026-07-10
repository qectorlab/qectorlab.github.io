import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router';

const navLinks = [
  { label: 'Platform', href: '/' },
  { label: 'Decoder', href: '/decoder' },
  { label: 'Benchmarks', href: '/benchmarks' },
  { label: 'Workbench', href: '/workbench' },
  { label: 'SATI CODEX', href: '/sati-codex' },
  { label: 'SATI OS', href: '/sati-os' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Commercial', href: '/commercial' },
  { label: 'Contact', href: '/contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
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
  }, [location]);

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
    return location.pathname === href;
  };

  return (
    <>
      <nav
        aria-label="Main"
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-500 ease-out ${
          hidden && !isOpen ? '-translate-y-[140%]' : 'translate-y-0'
        }`}
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
              className="flex items-center gap-2 text-cyan-300 font-bold text-lg tracking-tight hover:text-cyan-200 transition-colors"
            >
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" stroke="#67e8f9" strokeWidth="1.5" fill="none" />
                <circle cx="16" cy="16" r="6" fill="#67e8f9" fillOpacity="0.3" stroke="#67e8f9" strokeWidth="1" />
                <line x1="16" y1="2" x2="16" y2="30" stroke="#67e8f9" strokeWidth="0.5" opacity="0.5" />
                <line x1="2" y1="16" x2="30" y2="16" stroke="#67e8f9" strokeWidth="0.5" opacity="0.5" />
                <line x1="5" y1="5" x2="27" y2="27" stroke="#67e8f9" strokeWidth="0.5" opacity="0.3" />
                <line x1="27" y1="5" x2="5" y2="27" stroke="#67e8f9" strokeWidth="0.5" opacity="0.3" />
              </svg>
              <span>QECTOR</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(link.href)
                      ? 'text-cyan-300 bg-cyan-300/10'
                      : 'text-secondary hover:text-primary hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                to="/commercial"
                className="hidden sm:inline-flex items-center px-4 py-2 border border-gold-400/60 text-gold-400 text-sm font-medium rounded-lg hover:bg-gold-400/10 transition-all duration-300"
              >
                Get License
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
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
          className={`lg:hidden mt-2 glass-nav rounded-2xl overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-cyan-300 bg-cyan-300/10'
                    : 'text-secondary hover:text-primary hover:bg-white/5'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/commercial"
              className="block sm:hidden mt-2 text-center px-4 py-2.5 border border-gold-400/60 text-gold-400 text-sm font-medium rounded-lg hover:bg-gold-400/10 transition-all"
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
