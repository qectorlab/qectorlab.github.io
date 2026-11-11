import { lazy, Suspense, useContext, useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import { blogPosts } from '../lib/blogData';
import { EmbeddedPostContext } from '../lib/embeddedPost';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';

// The Markdown/KaTeX renderer is most of this page's code. Loaded on its own,
// the post's header and links work (and hydrate) without waiting for it.
const loadMarkdownArticle = () => import('../components/MarkdownArticle');
const MarkdownArticle = lazy(loadMarkdownArticle);

// The article title is rendered by the page header; drop the Markdown's
// leading H1 so the page keeps a single h1 landmark.
const withoutTitle = (markdown: string) => markdown.replace(/^\s*#[^#\n]*\r?\n/, '');

const articleLoading = (
  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
    <Loader2 size={48} className="animate-spin text-cyan-400 mb-4" />
    <p className="animate-pulse">Loading article...</p>
  </div>
);

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const postMeta = blogPosts.find((p) => p.id === id);
  // The article this page was generated with (a full page load of this post):
  // its Markdown came embedded in the HTML, so the first render already has it
  // and matches the static page. Any other post is fetched.
  const embedded = useContext(EmbeddedPostContext);
  const embeddedMarkdown = postMeta && embedded?.filename === postMeta.filename ? embedded.markdown : null;
  const [fetched, setFetched] = useState<{ filename: string; markdown: string } | null>(null);
  const [errorFilename, setErrorFilename] = useState<string | null>(null);

  useEffect(() => {
    if (!postMeta || embeddedMarkdown !== null) return;

    const controller = new AbortController();
    const filename = postMeta.filename;
    // Fetch the renderer alongside the article, not after it. A failure here
    // is reported when the article is rendered.
    loadMarkdownArticle().catch(() => undefined);
    // Fetch the markdown file from the public directory
    fetch(`/blog/${filename}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load post');
        return res.text();
      })
      .then((markdown) => {
        setFetched({ filename, markdown });
        setErrorFilename(null);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error(err);
        setErrorFilename(filename);
      });

    return () => {
      controller.abort();
      // Coming back to this post later starts clean and tries again.
      setErrorFilename(null);
    };
  }, [postMeta, embeddedMarkdown]);

  const markdown = embeddedMarkdown ?? (postMeta && fetched?.filename === postMeta.filename ? fetched.markdown : null);
  const content = useMemo(() => (markdown === null ? '' : withoutTitle(markdown)), [markdown]);
  const error = Boolean(postMeta && markdown === null && errorFilename === postMeta.filename);
  const loading = Boolean(postMeta && markdown === null && !error);

  // Handle click on in-page anchor links for smooth scrolling
  useEffect(() => {
    function handleAnchorClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#') || href.length < 2) return;
      let id = href.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // Malformed escape: use the raw fragment.
      }
      const el = document.getElementById(id);
      // No such target: leave the link to the browser.
      if (!el) return;
      e.preventDefault();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      // Update URL hash without jumping
      window.history.pushState(null, '', href);
      // Keyboard and screen-reader users follow the link too, not only the viewport.
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  if (!postMeta) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-cyan-300 hover:text-cyan-200">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-400/30">
      <SEO 
        title={`${postMeta.title} - QECTOR Blog`}
        description={postMeta.description} 
      />

      <div className="pt-32 pb-24 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-800/20 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link 
            to="/blog" 
            className="inline-flex items-center min-h-[44px] text-slate-400 hover:text-cyan-300 mb-12 transition-colors duration-300 font-medium tracking-wide"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to All Articles
          </Link>

          <header className="mb-16 border-b border-slate-800/60 pb-10">
            <div className="flex flex-wrap items-center text-cyan-300 mb-6 gap-4">
              <span className="flex items-center text-sm font-semibold tracking-widest uppercase">
                <Calendar size={16} className="mr-2" />
                {postMeta.date}
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold tracking-wider text-slate-400">
                {postMeta.category}
              </span>
              <span className="text-sm text-slate-400">
                By <Link to="/guillaume-lessard" className="hover:text-cyan-300">Guillaume Lessard</Link>
                {content ? ` · ${Math.max(1, Math.round(content.split(/\s+/).length / 220))} min read` : ''}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-tight text-white">
              {postMeta.title}
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
              {postMeta.description}
            </p>
          </header>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 md:p-12 shadow-2xl">
            {loading ? (
              articleLoading
            ) : error ? (
              <div className="py-20 text-center text-red-400">
                <p>Failed to load the article. Please try again later.</p>
              </div>
            ) : (
              <Suspense fallback={articleLoading}>
                <article className="prose prose-invert prose-cyan max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:underline prose-code:text-cyan-200 prose-code:bg-cyan-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-slate-950/80 prose-pre:border prose-pre:border-slate-800 prose-img:rounded-xl prose-img:border prose-img:border-slate-800">
                  <MarkdownArticle content={content} />
                </article>
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
