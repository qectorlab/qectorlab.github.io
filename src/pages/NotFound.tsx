import { Link } from 'react-router';
import { SEO } from '../lib/seo';

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found · QECTOR" description="The requested page could not be found." noindex />

      <section className="min-h-[70vh] flex items-center justify-center section-padding">
        <div className="text-center max-w-lg">
          <div className="text-8xl font-extrabold text-cyan-300/20 mb-4">404</div>
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-secondary mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/" className="btn-cyan">Back to Home</Link>
            <Link to="/docs" className="btn-outline">Documentation</Link>
          </div>
        </div>
      </section>
    </>
  );
}
