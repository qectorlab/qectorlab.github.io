import { useEffect } from 'react';
import { useLocation } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Move focus to main content on route change so screen reader users
    // land on the new page instead of staying on the old nav position.
    document.getElementById('main-content')?.focus();
    
    // Clean up old ScrollTriggers from previous routes to prevent memory leaks
    // and calculation errors on the new page layout.
    ScrollTrigger.getAll().forEach(t => t.kill());

    // Global reveal animation for top-tier aesthetics, robust against Suspense lazy loading
    let observer: MutationObserver | null = null;
    
    const animateNodes = () => {
      let added = false;
      const elements = document.querySelectorAll('.card-surface:not(.gsap-revealed), .prose:not(.gsap-revealed)');
      elements.forEach((el) => {
        added = true;
        el.classList.add('gsap-revealed');
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        );
      });
      if (added) {
        // Force GSAP to recalculate positions now that new elements are in the DOM
        ScrollTrigger.refresh();
      }
    };

    observer = new MutationObserver((mutations) => {
      if (mutations.some(m => m.addedNodes.length > 0)) {
        animateNodes();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    animateNodes(); // Initial check

    return () => {
      if (observer) observer.disconnect();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-void text-foreground quantum-grid-bg relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-300 focus:text-void focus:font-semibold focus:rounded-lg"
      >
        Skip to main content
      </a>
      <Navigation />
      <main id="main-content" tabIndex={-1} className="pt-20 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}
