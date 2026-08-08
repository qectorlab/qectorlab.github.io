import { useEffect } from 'react';
import { useLocation } from 'react-router';
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
