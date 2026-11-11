import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const hasNavigated = useRef(false);
  const isFrench = location.pathname === '/fr' || location.pathname.startsWith('/fr/');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Keep <html lang> in sync with the route: French routes under /fr/*
    // must announce lang="fr" to screen readers during SPA navigation
    // (the prerendered shells carry the right lang from the build).
    document.documentElement.lang = isFrench ? 'fr' : 'en';
    // Move focus to main content on route change so screen reader users
    // land on the new page instead of staying on the old nav position.
    // Not on the first render: a fresh page load must start at the top of the
    // document so the first Tab reaches the skip link and the navigation.
    if (hasNavigated.current) document.getElementById('main-content')?.focus();
    hasNavigated.current = true;
    
    // Reveal-on-scroll for cards and article bodies, with no animation library.
    //
    // Content is visible by default. A block is hidden only after the observer
    // has seen it and found it off screen ('reveal-pending'), and is shown the
    // moment any part of it scrolls in ('revealed'; the CSS in index.css runs
    // the transition). So a block the observer never hears about, or one too
    // tall to ever be mostly on screen, is simply shown: nothing can be left
    // invisible. (The earlier version hid every block by default and revealed
    // it at 10% visibility. A blog article is taller than ten screens, and it
    // was added to the page after the first scan, so it never appeared.)
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const SELECTOR = '.card-surface, .prose';
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.remove('reveal-pending');
            el.classList.add('revealed');
            revealObserver.unobserve(el);
          } else if (!el.classList.contains('revealed')) {
            el.classList.add('reveal-pending');
          }
        }
      },
      // Any visible part counts, once it is 10% of the viewport above the fold.
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    );

    const watch = (root: ParentNode) => {
      const blocks: Element[] = [...root.querySelectorAll(SELECTOR)];
      // querySelectorAll only returns descendants: an added node can itself be a block.
      if (root instanceof Element && root.matches(SELECTOR)) blocks.push(root);
      for (const el of blocks) {
        if (!el.classList.contains('revealed')) revealObserver.observe(el);
      }
    };

    // Lazy routes, Suspense and fetched content add blocks after the first scan.
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) watch(node);
        });
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    watch(document);

    return () => {
      revealObserver.disconnect();
      mutationObserver.disconnect();
      // Nothing stays hidden once nothing is watching.
      document.querySelectorAll('.reveal-pending').forEach((el) => el.classList.remove('reveal-pending'));
    };
  }, [location.pathname, isFrench]);

  return (
    <div className="min-h-screen bg-void text-foreground quantum-grid-bg relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-300 focus:text-void focus:font-semibold focus:rounded-lg"
      >
        {isFrench ? 'Aller au contenu principal' : 'Skip to main content'}
      </a>
      <Navigation />
      <main id="main-content" tabIndex={-1} className="pt-20 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}

