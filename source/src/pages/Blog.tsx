import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import { blogPosts } from '../lib/blogData';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Blog() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      <SEO 
        title="Blog · QECTOR"
        description="Deep dives into quantum error correction, surface codes, MWPM, and the architecture of QECTOR."
      />

      <Navigation />

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
              Deep dives into the architecture, mathematics, and empirical performance of the QECTOR quantum error correction framework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.id}`}
                className="group relative flex flex-col bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center space-x-2 text-emerald-400 mb-6">
                    <BookOpen size={18} />
                    <span className="text-sm font-semibold tracking-wider uppercase">Article</span>
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

      <Footer />
    </div>
  );
}
