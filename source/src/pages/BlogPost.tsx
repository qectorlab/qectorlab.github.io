import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { blogPosts } from '../lib/blogData';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';

// IMPORTANT: We need KaTeX CSS to render math formulas correctly
import 'katex/dist/katex.min.css';

/**
 * Extract plain text from React children, recursively flattening
 * any nested elements. Strips KaTeX/math markup so that the slug
 * matches the hand-authored TOC anchors in each blog post.
 */
function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (!children) return '';
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (typeof children === 'object' && 'props' in children) {
    return extractText((children as React.ReactElement).props.children);
  }
  return '';
}

/**
 * Slugify text using the same algorithm as github-slugger / rehype-slug:
 * lowercase, strip non-alphanumeric (except hyphens and spaces), collapse
 * whitespace to single hyphens, trim leading/trailing hyphens.
 *
 * Additionally strips LaTeX commands ($...$, \\mathrm{}, \\equiv, etc.)
 * before slugifying so that headings containing math produce the same
 * anchors the TOC links expect.
 */
function slugify(text: string): string {
  return text
    .replace(/\$[^$]*\$/g, '')           // strip inline math $...$
    .replace(/\\[a-zA-Z]+\{[^}]*\}/g, '') // strip \command{...}
    .replace(/[\\{}]/g, '')               // strip remaining backslashes/braces
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')             // strip non-word chars except spaces/hyphens
    .replace(/\s+/g, '-')                 // spaces to hyphens
    .replace(/-+/g, '-')                  // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '');             // trim leading/trailing hyphens
}

/**
 * Factory for heading components (h1..h6) that auto-generate id attributes
 * from the heading text. This replaces rehype-slug which produces
 * unpredictable IDs when headings contain KaTeX math.
 */
function makeHeading(Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  return function HeadingWithId({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    const text = extractText(children);
    const id = props.id || slugify(text);
    return <Tag {...props} id={id}>{children}</Tag>;
  };
}

const headingComponents: Partial<Components> = {
  h1: makeHeading('h1'),
  h2: makeHeading('h2'),
  h3: makeHeading('h3'),
  h4: makeHeading('h4'),
  h5: makeHeading('h5'),
  h6: makeHeading('h6'),
};

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const postMeta = blogPosts.find((p) => p.id === id);
  const [content, setContent] = useState<string>('');
  const [loadedFilename, setLoadedFilename] = useState<string | null>(null);
  const [errorFilename, setErrorFilename] = useState<string | null>(null);

  useEffect(() => {
    if (!postMeta) return;

    const controller = new AbortController();
    const filename = postMeta.filename;
    // Fetch the markdown file from the public directory
    fetch(`/blog/${filename}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load post');
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoadedFilename(filename);
        setErrorFilename(null);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error(err);
        setLoadedFilename(filename);
        setErrorFilename(filename);
      });

    return () => controller.abort();
  }, [postMeta]);

  const loading = Boolean(postMeta && loadedFilename !== postMeta.filename);
  const error = Boolean(postMeta && errorFilename === postMeta.filename);

  // Handle click on in-page anchor links for smooth scrolling
  useEffect(() => {
    function handleAnchorClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash without jumping
        window.history.pushState(null, '', href);
      }
    }
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  if (!postMeta) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-emerald-400 hover:text-emerald-300">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      <SEO 
        title={`${postMeta.title} - QECTOR Blog`}
        description={postMeta.description} 
      />

      <main className="pt-32 pb-24 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-800/20 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-slate-400 hover:text-emerald-400 mb-12 transition-colors duration-300 font-medium tracking-wide"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to All Articles
          </Link>

          <header className="mb-16 border-b border-slate-800/60 pb-10">
            <div className="flex flex-wrap items-center text-emerald-400 mb-6 gap-4">
              <span className="flex items-center text-sm font-semibold tracking-widest uppercase">
                <Calendar size={16} className="mr-2" />
                {postMeta.date}
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold tracking-wider text-slate-400">
                {postMeta.category}
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
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 size={48} className="animate-spin text-emerald-500 mb-4" />
                <p className="animate-pulse">Decrypting content...</p>
              </div>
            ) : error ? (
              <div className="py-20 text-center text-red-400">
                <p>Failed to load the article. Please try again later.</p>
              </div>
            ) : (
              <article className="prose prose-invert prose-emerald max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-code:text-emerald-300 prose-code:bg-emerald-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-slate-950/80 prose-pre:border prose-pre:border-slate-800 prose-img:rounded-xl prose-img:border prose-img:border-slate-800">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]} 
                  rehypePlugins={[rehypeKatex, rehypeRaw]}
                  components={{
                    ...headingComponents,
                    img: (props) => {
                      return <img {...props} className="rounded-xl border border-slate-800 shadow-xl" loading="lazy" />;
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </article>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
