import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Keep <html lang> in sync with the route: French routes under /fr/*
    // must announce lang="fr" to screen readers during SPA navigation
    // (the prerendered shells carry the right lang from the build).
    document.documentElement.lang = location.pathname.startsWith('/fr/')
      ? 'fr'
      : 'en';
    // Move focus to main content on route change so screen reader users
    // land on the new page instead of staying on the old nav position.
    document.getElementById('main-content')?.focus();
    
    // Reveal-on-scroll without any animation JS dependency: an
    // IntersectionObserver adds the 'revealed' class (the CSS in index.css
    // handles the transition). A MutationObserver keeps detecting newly added
    // nodes (lazy routes, Suspense).
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealElements = (root: ParentNode = document) => {
      root
        .querySelectorAll('.card-surface:not(.revealed), .prose:not(.revealed)')
        .forEach((el) => {
          if (reducedMotion) {
            el.classList.add('revealed');
          } else {
            revealObserver.observe(el);
          }
        });
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    let mutationObserver: MutationObserver | null = null;
    if (reducedMotion) {
      // No animation at all: reveal everything immediately.
      revealElements();
    } else {
      mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              revealElements(node as Element);
            }
          });
        });
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
      revealElements(); // Initial check
    }

    return () => {
      revealObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-void text-foreground quantum-grid-bg relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-300 focus:text-void focus:font-semibold focus:rounded-lg"
      >
        {location.pathname.startsWith('/fr/') ? 'Aller au contenu principal' : 'Skip to main content'}
      </a>
      <Navigation />
      <main id="main-content" tabIndex={-1} className="pt-20 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}

