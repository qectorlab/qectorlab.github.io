import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import { blogPosts } from '../lib/blogData';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(blogPosts.map((post) => post.category)))];
  const visiblePosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
        <SEO
          title="Blog · QECTOR"
          description="QECTOR field notes on quantum error correction, decoder algorithms, qLDPC, noise models, evidence, systems, and ecosystem integration."
      />

      <main className="pt-32 pb-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
              Engineering <br />
              <span className="text-emerald-400">Fault Tolerance</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Field notes from parity checks to production interfaces: mathematics, decoder design, evidence, and systems practice for quantum error correction.
            </p>
          </div>

          <div className="mb-12 flex flex-wrap items-center justify-center gap-3" aria-label="Filter articles by topic">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  selectedCategory === category
                    ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-emerald-500/40 hover:text-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <p className="mb-6 text-center text-sm text-slate-500">
            Showing {visiblePosts.length} of {blogPosts.length} field notes. Claims are scoped to the <a className="text-emerald-400 hover:text-emerald-300" href="https://doi.org/10.5281/zenodo.21941046">v1.0.0 reference manual</a>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePosts.map((post, index) => (
              <Link 
                key={post.id} 
                 to={`/blog/${post.id}/`}
                className="group relative flex flex-col bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between gap-3 mb-6">
                      <div className="flex items-center space-x-2 text-emerald-400">
                      <BookOpen size={18} />
                      <span className="text-sm font-semibold tracking-wider uppercase">Article</span>
                      </div>
                      <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                        {post.category}
                      </span>
                    </div>
                  
                  <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-300 transition-colors duration-300">
                    {post.title}
                  </h2>
                  
                  <p className="text-slate-400 mb-8 flex-grow leading-relaxed">
                    {post.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-800">
                    <div className="flex items-center text-slate-500 text-sm">
                      <Calendar size={14} className="mr-2" />
                      {post.date}
                    </div>
                    <ArrowRight size={18} className="text-emerald-500 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
