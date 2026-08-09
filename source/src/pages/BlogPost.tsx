import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { blogPosts } from '../lib/blogData';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

// IMPORTANT: We need KaTeX CSS to render math formulas correctly
import 'katex/dist/katex.min.css';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const postMeta = blogPosts.find((p) => p.id === id);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!postMeta) return;

    setLoading(true);
    // Fetch the markdown file from the public directory
    fetch(`/blog/${postMeta.filename}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load post');
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [postMeta]);

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
        title={`${postMeta.title} · QECTOR Blog`}
        description={postMeta.description} 
      />

      <Navigation />

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
            <div className="flex items-center text-emerald-400 mb-6 space-x-4">
              <span className="flex items-center text-sm font-semibold tracking-widest uppercase">
                <Calendar size={16} className="mr-2" />
                {postMeta.date}
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
                    img: ({node, ...props}) => {
                      // Fix local image paths from markdown so they point to the correct public path
                      const src = props.src?.startsWith('./graphs/') || props.src?.startsWith('graphs/')
                        ? `/blog/graphs/${props.src.replace('./graphs/', '').replace('graphs/', '')}`
                        : props.src;
                      return <img {...props} src={src} className="rounded-xl border border-slate-800 shadow-xl" loading="lazy" />;
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

      <Footer />
    </div>
  );
}
