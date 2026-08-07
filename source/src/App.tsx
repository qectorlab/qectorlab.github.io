import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';
import Home from './pages/Home';

// Route-level code splitting: Home stays eager (it's the primary landing
// page and the most common entry point), everything else loads on demand
// so first paint doesn't pay for pages most visitors never open.
const About = lazy(() => import('./pages/About'));
const Decoder = lazy(() => import('./pages/Decoder'));
const Workbench = lazy(() => import('./pages/Workbench'));
const McpServer = lazy(() => import('./pages/McpServer'));
const SatiOs = lazy(() => import('./pages/SatiOs'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Commercial = lazy(() => import('./pages/Commercial'));
const Contact = lazy(() => import('./pages/Contact'));
const License = lazy(() => import('./pages/License'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Refund = lazy(() => import('./pages/Refund'));
const Founder = lazy(() => import('./pages/Founder'));
const Evidence = lazy(() => import('./pages/Evidence'));
const Changelog = lazy(() => import('./pages/Changelog'));
const TechnicalReference = lazy(() => import('./pages/TechnicalReference'));
const Docs = lazy(() => import('./pages/Docs'));
const Installer = lazy(() => import('./pages/Installer'));
const Manual = lazy(() => import('./pages/Manual'));
const Success = lazy(() => import('./pages/Success'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/decoder" element={<Decoder />} />
            <Route path="/workbench" element={<Workbench />} />
            <Route path="/mcp-server" element={<McpServer />} />
            <Route path="/sati-os" element={<SatiOs />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/commercial" element={<Commercial />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/license" element={<License />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/guillaume-lessard" element={<Founder />} />
            <Route path="/evidence" element={<Evidence />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/technical-reference" element={<TechnicalReference />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/installer" element={<Installer />} />
            <Route path="/manual" element={<Manual />} />
            {/* Stripe success_url target. Must stay in sync with
                stripe_integration.py::create_checkout_session. */}
            <Route path="/success" element={<Success />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}
