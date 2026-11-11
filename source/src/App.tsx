import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';
import Home from './pages/Home';
// Eager, like Home: 404.html is served for every unknown URL, so the browser
// renders it afresh rather than attaching to its HTML (see main.tsx). With the
// page in the entry bundle that render is complete at once, with no spinner
// in between.
import NotFound from './pages/NotFound';

// Route-level code splitting: everything else loads on demand so first paint
// doesn't pay for pages most visitors never open. Every route is also rendered
// to static HTML at build time (src/entry-server.tsx), and the browser attaches
// to that HTML: while a route's chunk is on its way, React leaves the static
// page in place instead of showing the Suspense fallback.
const About = lazy(() => import('./pages/About'));
const Decoder = lazy(() => import('./pages/Decoder'));
const Workbench = lazy(() => import('./pages/Workbench'));
const McpServer = lazy(() => import('./pages/McpServer'));
const ClaudePlugin = lazy(() => import('./pages/ClaudePlugin'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

const Pricing = lazy(() => import('./pages/Pricing'));
const PricingFR = lazy(() => import('./pages/PricingFR'));
const Commercial = lazy(() => import('./pages/Commercial'));
const Contact = lazy(() => import('./pages/Contact'));
const License = lazy(() => import('./pages/License'));
const LicenseFR = lazy(() => import('./pages/LicenseFR'));
const DecoderFR = lazy(() => import('./pages/DecoderFR'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const TermsFR = lazy(() => import('./pages/TermsFR'));
const Refund = lazy(() => import('./pages/Refund'));
const RefundFR = lazy(() => import('./pages/RefundFR'));
const PrivacyFR = lazy(() => import('./pages/PrivacyFR'));
const LicenseAgreement = lazy(() => import('./pages/LicenseAgreement'));
const LicenseAgreementFR = lazy(() => import('./pages/LicenseAgreementFR'));
const Security = lazy(() => import('./pages/Security'));
const HomeFR = lazy(() => import('./pages/HomeFR'));
const GettingStarted = lazy(() => import('./pages/GettingStarted'));
const UseCases = lazy(() => import('./pages/UseCases'));
const Status = lazy(() => import('./pages/Status'));
const Compare = lazy(() => import('./pages/Compare'));
const Founder = lazy(() => import('./pages/Founder'));
const Evidence = lazy(() => import('./pages/Evidence'));
const Changelog = lazy(() => import('./pages/Changelog'));
const TechnicalReference = lazy(() => import('./pages/TechnicalReference'));
const Docs = lazy(() => import('./pages/Docs'));
const Installer = lazy(() => import('./pages/Installer'));
const Manual = lazy(() => import('./pages/Manual'));
const Success = lazy(() => import('./pages/Success'));

// Sets <html data-app-ready="true"> once the first route has rendered or been
// attached to its static HTML. It sits inside the routes' Suspense boundary,
// so it waits for the route's own code: before that, the page can be on
// screen (static HTML) without its content being interactive yet. Read by
// tests/browser-check.mjs.
function AppReady() {
  useEffect(() => {
    document.documentElement.dataset.appReady = 'true';
  }, []);
  return null;
}

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
            <Route path="/claude-plugin" element={<ClaudePlugin />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />

            <Route path="/pricing" element={<Pricing />} />
            <Route path="/fr/pricing" element={<PricingFR />} />
            <Route path="/commercial" element={<Commercial />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/license" element={<License />} />
            <Route path="/fr/license" element={<LicenseFR />} />
            <Route path="/fr/decoder" element={<DecoderFR />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/fr/terms" element={<TermsFR />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/fr/refund" element={<RefundFR />} />
            <Route path="/fr/privacy" element={<PrivacyFR />} />
            <Route path="/license-agreement" element={<LicenseAgreement />} />
            <Route path="/fr/license-agreement" element={<LicenseAgreementFR />} />
            <Route path="/security" element={<Security />} />
            <Route path="/fr" element={<HomeFR />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/status" element={<Status />} />
            <Route path="/compare" element={<Compare />} />
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
          <AppReady />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}

