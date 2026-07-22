import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO, JsonLd } from '../lib/seo';
import TrustSignal from '../components/TrustSignal';
import SectionHeader from '../components/SectionHeader';
import AlgorithmCard from '../components/AlgorithmCard';
import MetricCard from '../components/MetricCard';
import EvidenceBlock from '../components/EvidenceBlock';
import QECSimulator from '../components/QECSimulator';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePyPIVersion } from '../hooks/usePyPIVersion';

gsap.registerPlugin(ScrollTrigger);

function CounterStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center px-4 py-3">
      <div className="text-2xl font-bold text-cyan-300">{value}</div>
      <div className="text-xs text-muted-foreground whitespace-nowrap">{label}</div>
    </div>
  );
}

const integrations = [
  { name: 'Stim', href: 'https://github.com/quantumlib/Stim', color: 'text-cyan-300' },
  { name: 'PyMatching', href: 'https://github.com/oscarkey/PyMatching', color: 'text-cyan-300' },
  { name: 'Qiskit', href: 'https://www.ibm.com/quantum/qiskit', color: 'text-cyan-300' },
  { name: 'Sinter', href: 'https://github.com/quantumlib/Stim', color: 'text-cyan-300' },
  { name: 'CUDA', href: '#', color: 'text-green-400' },
  { name: 'OpenCL', href: '#', color: 'text-green-400' },
];

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const { version: pypiVersion } = usePyPIVersion();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.body.appendChild(script);

    const sections = sectionsRef.current.filter(Boolean);
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (script.parentNode === document.body) document.body.removeChild(script);
    };
  }, []);

  const addRef = (el: HTMLElement | null, index: number) => {
    if (el) sectionsRef.current[index] = el as HTMLDivElement;
  };

  return (
    <>
      <SEO
        title="QECTOR · Production-Grade Quantum Error Correction Decoding for Python"
        description="QECTOR Decoder v3 - Production-grade Python library for quantum error correction decoding with exact MWPM parity to PyMatching and measurable Belief-Matching gains."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareApplication',
              name: 'QECTOR Decoder v3',
              description: 'Production-grade poly-algorithmic quantum error correction decoder for Python with exact MWPM and Belief-Matching capabilities.',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Linux, macOS, Windows',
              programmingLanguage: 'Python',
              url: 'https://qector.store/',
              downloadUrl: 'https://pypi.org/project/qector-decoder-v3/',
              softwareVersion: pypiVersion,
              author: { '@type': 'Person', name: 'Guillaume Lessard', url: 'https://github.com/GuillaumeLessard' },
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
            },
            {
              '@type': 'Organization',
              name: 'QECTOR',
              url: 'https://qector.store/',
              logo: 'https://qector.store/assets/logo.svg',
              sameAs: [
                'https://github.com/GuillaumeLessard/qector-decoder',
                'https://pypi.org/project/qector-decoder-v3/',
              ],
            },
          ],
        }}
      />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video
          src="/videos/hero-lattice.mp4"
          autoPlay loop muted playsInline preload="auto" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ filter: 'brightness(0.4) saturate(1.2)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-void/20 to-void z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent z-[1]" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-24 pb-20">
          <Link
            to="/changelog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface/70 border border-cyan-300/20 rounded-full text-xs text-cyan-300 hover:bg-cyan-300/10 transition-all mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
            <span>v{pypiVersion} · Validated MWPM Parity to d=15 · Changelog →</span>
          </Link>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
            style={{ textShadow: '0 4px 32px rgba(0,0,0,0.9)' }}
          >
            Production-Grade{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-400">
              QEC Decoding
            </span>{' '}
            for Python
          </h1>

          <p
            className="text-lg md:text-xl text-secondary/90 max-w-3xl mx-auto mb-8 leading-relaxed"
            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}
          >
            10 battle-tested algorithms including MWPM, Belief-Matching, BP-OSD, and GPU batch decoding.{' '}
            <span className="text-primary font-semibold">Exact parity with PyMatching through d=15.</span>{' '}
            All claims backed by reproducible artifacts.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <Link to="/pricing" className="btn-gold text-base px-8 py-4 text-sm sm:text-base font-bold">
              Start $499 Evaluation →
            </Link>
            <Link to="/decoder" className="btn-cyan text-base px-8 py-4 text-sm sm:text-base">
              Explore the Decoder
            </Link>
            <a
              href="https://github.com/qectorlab/qector-decoder-workbench/releases/tag/v3.4.0"
              className="btn-outline text-base px-8 py-4 text-sm sm:text-base"
              target="_blank" rel="noopener noreferrer"
            >
              Free Workbench GUI
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 border-t border-white/5 pt-6 max-w-2xl mx-auto">
            <CounterStat value="10+" label="Decoding Algorithms" />
            <CounterStat value="29K+" label="Monthly Cluster Pulls" />
            <CounterStat value="d=15" label="Validated MWPM Parity" />
            <CounterStat value="GPU" label="CUDA + OpenCL Batch" />
          </div>
        </div>
      </section>

      {/* ===== INTEGRATION ECOSYSTEM ===== */}
      <section className="border-t border-b border-gridline/30 py-5 bg-void/80">
        <div className="section-padding">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-3">
              Plugs into your existing pipeline
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {integrations.map((i) => (
                <a
                  key={i.name}
                  href={i.href}
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm font-semibold tracking-wide opacity-60 hover:opacity-100 hover:text-cyan-300 transition-all duration-300"
                >
                  {i.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST SIGNAL BAR ===== */}
      <section ref={(el) => addRef(el, 0)} className="py-6 bg-void">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3">
            {[
              { icon: '\uD83D\uDCCB', label: 'Artifacts (GitHub)', href: 'https://github.com/GuillaumeLessard/qector-decoder' },
              { icon: '\uD83D\uDCD6', label: 'Mastering QEC · Google Play', href: 'https://play.google.com/store/books/details?id=dGXuEQAAQBAJ', gold: true },
              { icon: '\uD83D\uDCE6', label: `PyPI v${pypiVersion}`, href: 'https://pypi.org/project/qector-decoder-v3/' },
              { icon: '\uD83D\uDCCB', label: 'ORCID', href: 'https://orcid.org/0009-0000-3465-3753' },
              { icon: '\uD83D\uDDA5\uFE0F', label: 'Free Workbench GUI v3.4', href: 'https://github.com/qectorlab/qector-decoder-workbench/releases/tag/v3.4.0' },
            ].map((pill) => (
              <TrustSignal
                key={pill.label}
                icon={pill.icon}
                label={pill.label}
                href={pill.href}
                variant={pill.gold ? 'gold' : 'default'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 md:py-28 bg-surface/30 border-t border-gridline">
        <div className="section-padding max-w-6xl mx-auto">
          <div ref={(el) => addRef(el, 1)} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">From Installation to Validation in Minutes</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto mt-3">
              QECTOR integrates directly into your existing QEC workflow with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Install',
                desc: 'pip install qector-decoder-v3 into any Python 3.10+ environment alongside your existing Stim or PyMatching workflow.',
                detail: 'pip install qector-decoder-v3',
                code: true,
              },
              {
                step: '02',
                title: 'Decode',
                desc: 'Access 10+ Rust-accelerated decoders through a unified Python API. Swap algorithms without changing your pipeline.',
                detail: 'from qector_decoder_v3 import BlossomDecoder, BPOSODecoder',
                code: true,
              },
              {
                step: '03',
                title: 'Validate',
                desc: 'Every claim is backed by SHA-256 sealed artifacts on GitHub. Run python -m qector.validate to verify on your own hardware.',
                detail: 'reproducible artifacts · SHA-256 sealed',
                code: false,
              },
            ].map((step) => (
              <div key={step.step} className="card-surface p-6 relative">
                <div className="text-4xl font-black text-cyan-300/20 absolute top-4 right-4 select-none">{step.step}</div>
                <div className="w-10 h-10 rounded-full bg-cyan-300/10 border border-cyan-300/20 flex items-center justify-center text-cyan-300 font-bold text-sm mb-4">{step.step}</div>
                <h3 className="text-lg font-bold text-primary mb-2">{step.title}</h3>
                <p className="text-secondary text-sm leading-relaxed mb-3">{step.desc}</p>
                {step.code && (
                  <code className="block text-xs bg-void border border-gridline rounded-lg px-3 py-2 text-cyan-300 font-mono overflow-x-auto">
                    {step.detail}
                  </code>
                )}
                {!step.code && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-cyan-300 font-mono bg-cyan-300/5 px-3 py-1.5 rounded-lg border border-cyan-300/10">
                    {step.detail}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KEY DIFFERENTIATORS ===== */}
      <section id="platform" className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(103, 232, 249, 0.06) 0%, transparent 70%)' }} />
        <div className="section-padding relative z-10">
          <div className="max-w-6xl mx-auto">
            <div ref={(el) => addRef(el, 2)}>
              <SectionHeader
                eyebrow="Why QECTOR"
                heading={<h2 className="text-3xl md:text-4xl font-bold">More Than Just MWPM</h2>}
                description="QEC decoding is not one-size-fits-all. Surface codes, qLDPC codes, GPU batch and real-time workloads each demand different decoders. QECTOR gives you all of them in one Python library with a consistent API — and every claim is backed by reproducible GitHub artifacts."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Exact MWPM — Validated',
                  tag: 'Blossom + Belief-Matching',
                  desc: 'Exact LER parity with PyMatching through d=15. Add BP preprocessing for +35.7% accuracy gain at d=5. These are the production decoders.',
                  proof: 'd = 3-15 · exact LER parity',
                },
                {
                  title: 'qLDPC Support',
                  tag: 'BP-OSD + EBP',
                  desc: 'Matching decoders break on qLDPC codes. BP-OSD handles what Blossom cannot. Required for non-CSS codes and bivariate bicycle codes.',
                  proof: 'Non-CSS + bivariate bicycle codes',
                },
                {
                  title: 'Speed When You Need It',
                  tag: 'Union-Find + GPU Batch',
                  desc: 'Near-linear Union-Find for large-distance real-time decoding. Native CUDA/OpenCL GPU batch for throughput-bound workloads — bit-identical to CPU.',
                  proof: 'Bit-identical CPU ↔ GPU output',
                },
                {
                  title: 'One Library, Pluggable',
                  tag: 'Stim · PyMatching · Sinter · Qiskit',
                  desc: 'Drop QECTOR into any existing Stim or PyMatching workflow. Same API surface, swappable backend. No vendor lock-in.',
                  proof: 'Drop-in, same API surface',
                },
              ].map((card, i) => (
                <div key={card.title} ref={(el) => addRef(el, 3 + i)}>
                  <AlgorithmCard title={card.title} tag={card.tag} desc={card.desc} proof={card.proof} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== DECODER SHOWCASE ===== */}
      <section id="decoder-section" className="py-20 md:py-28 bg-surface/50">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div ref={(el) => addRef(el, 7)} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-4">
                  10 Decoders · Unified API
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Battle-Tested Decoding Algorithms
                </h2>
                <p className="text-secondary text-lg leading-relaxed mb-8">
                  MWPM, Belief-Matching, BP-OSD, Union-Find, GPU Batch, EBP, Restart Belief, KAT/QCT, Astra GNN, and
                  FPGA emulator — all accessible through a consistent Python API.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: '\u2705 Exact Parity', desc: 'QECTOR-Blossom matches PyMatching LER from d=3 to d=15 (adaptive-k MWPM)' },
                    { label: '\uD83D\uDCC8 +35.7% Advantage', desc: 'Belief-matching LER reduction vs PyMatching at d=5 (circuit-level noise)' },
                    { label: '\uD83C\uDFAF 98.3% Optimal', desc: 'Shots with exact minimum weight at d=9 (median gap ≈ 0)' },
                    { label: '\u26A1 GPU Batch', desc: 'CUDA peak: 13.5M shots/s. OpenCL: cross-platform. Bit-identical to CPU.' },
                  ].map((metric) => (
                    <MetricCard key={metric.label} label={metric.label} desc={metric.desc} variant="compact" />
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-8">
                  <a href="https://pypi.org/project/qector-decoder-v3/" target="_blank" rel="noopener noreferrer">
                    <img src="https://img.shields.io/pypi/v/qector-decoder-v3?style=flat-square&color=24e7ff" alt="PyPI" loading="lazy" />
                  </a>
                  <a href="https://github.com/GuillaumeLessard/qector-decoder" target="_blank" rel="noopener noreferrer">
                    <img src="https://img.shields.io/github/v/release/GuillaumeLessard/qector-decoder?style=flat-square&color=24e7ff" alt="GitHub" loading="lazy" />
                  </a>
                  <a href="https://github.com/GuillaumeLessard/qector-decoder" target="_blank" rel="noopener noreferrer">
                    <img src="https://img.shields.io/badge/GitHub-Artifacts-blue?logo=github" alt="GitHub Artifacts" loading="lazy" />
                  </a>
                </div>
              </div>

              <div ref={(el) => addRef(el, 8)} className="relative w-full">
                <QECSimulator />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENCHMARKS ===== */}
      <section id="benchmarks-section" className="py-20 md:py-28 relative">
        <div className="section-padding relative z-10">
          <div className="max-w-6xl mx-auto">
            <div ref={(el) => addRef(el, 9)}>
              <SectionHeader
                eyebrow="Performance"
                heading={<h2 className="text-3xl md:text-4xl font-bold">Head-to-Head Benchmarks</h2>}
              />
              <EvidenceBlock
                title="Validation Report"
                statement="Every figure below comes from the official Validation Report with reproducible artifacts on GitHub, including the full simulation code, seeds, and raw output."
                href="https://github.com/GuillaumeLessard/qector-decoder"
                linkLabel="GitHub Artifacts →"
                className="max-w-3xl mx-auto mb-6"
              />
            </div>

            <div ref={(el) => addRef(el, 10)} className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gridline">
                    <th className="text-left py-4 px-4 text-cyan-300 font-semibold text-sm uppercase tracking-wider">Algorithm</th>
                    <th className="text-left py-4 px-4 text-cyan-300 font-semibold text-sm uppercase tracking-wider">Code Distance</th>
                    <th className="text-left py-4 px-4 text-cyan-300 font-semibold text-sm uppercase tracking-wider">LER vs PyMatching</th>
                    <th className="text-left py-4 px-4 text-cyan-300 font-semibold text-sm uppercase tracking-wider">Speed vs PyMatching</th>
                    <th className="text-left py-4 px-4 text-cyan-300 font-semibold text-sm uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { algo: 'QECTOR-Blossom (MWPM)', dist: 'd = 3 - 15', ler: 'Exact parity', speed: 'Validated', status: 'Validated' },
                    { algo: 'Belief-Matching', dist: 'd = 5', ler: '\u221235.7% LER', speed: 'Comparable', status: 'Validated' },
                    { algo: 'QECTOR-Blossom', dist: 'd = 9', ler: '98.3% optimal shots', speed: 'Validated', status: 'Validated' },
                    { algo: 'GPU Batch Decoder', dist: 'Any', ler: 'Bit-identical to CPU', speed: 'Native CUDA / OpenCL', status: 'Available' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gridline/50 hover:bg-surface/50 transition-colors">
                      <td className="py-4 px-4 text-primary font-semibold text-sm">{row.algo}</td>
                      <td className="py-4 px-4 text-secondary text-sm">{row.dist}</td>
                      <td className="py-4 px-4 text-green-400 font-semibold text-sm">{row.ler}</td>
                      <td className="py-4 px-4 text-secondary text-sm">{row.speed}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          row.status === 'Validated'
                            ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                            : 'bg-cyan-300/10 text-cyan-300 border border-cyan-300/20'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/benchmarks" className="btn-cyan">Full Benchmark Report →</Link>
              <Link to="/evidence" className="btn-outline">Evidence &amp; Reports</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ENTERPRISE COMPLIANCE + LICENSING ===== */}
      <section className="py-16 bg-surface/20 border-t border-gridline">
        <div className="section-padding max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-surface border-cyan-300/20 bg-void/50 p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/5 to-transparent pointer-events-none" />
              <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2 mb-4">
                Corporate Compliance
              </h3>
              <p className="text-secondary text-sm leading-relaxed mb-4">
                Our PyPI package includes <code className="text-cyan-300 bg-cyan-300/5 px-1.5 py-0.5 rounded border border-cyan-300/10 font-mono text-xs">Other/Proprietary License</code> metadata that triggers
                enterprise compliance scanners (Snyk, Black Duck, FOSSA). A commercial receipt clears your entire
                engineering stack instantly — no license keys, no friction.
              </p>
              <Link to="/commercial" className="text-cyan-300 text-sm font-medium hover:underline">
                Learn about licensing →
              </Link>
            </div>

            <div className="card-surface border-gold-400/20 bg-void/50 p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400/5 to-transparent pointer-events-none" />
              <h3 className="text-lg font-bold text-gold-400 flex items-center gap-2 mb-4">
                Start Your Evaluation
              </h3>
              <p className="text-secondary text-sm leading-relaxed mb-4">
                $499 for a 60-day commercial evaluation. Unlimited internal seats, all 10 decoders,
                GPU batch paths, priority support, and full validation artifact access.
                100% credit toward any annual license.
              </p>
              <Link to="/pricing" className="btn-gold text-sm">
                View Pricing &amp; Tiers →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA / STRIPE ===== */}
      <section id="pricing-section" className="py-20 md:py-28 bg-surface/50 border-t border-gridline">
        <div className="section-padding">
          <div className="max-w-xl mx-auto text-center">
            <div ref={(el) => addRef(el, 11)} className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-4">
                Self-Serve · Instant Clearance
              </span>
              <h2 className="text-3xl font-bold mb-3">Commercial Evaluation License</h2>
              <p className="text-secondary text-sm max-w-md mx-auto">
                One-time payment · 60-day pilot · Fully creditable toward annual license
              </p>
            </div>

            <div ref={(el) => addRef(el, 12)} className="card-surface border-cyan-300/35 neon-border-cyan relative overflow-hidden p-8 rounded-2xl bg-void/80 text-center">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 to-transparent pointer-events-none" />
              <div className="mb-6">
                <h3 className="text-4xl font-extrabold text-primary">$499</h3>
                <p className="text-muted-foreground text-xs mt-1">Unlimited internal seats · All 10 algorithms · Priority support</p>
              </div>

              <div className="flex justify-center mb-4 min-h-[50px]">
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<stripe-buy-button
                      buy-button-id="buy_btn_1TsoKxRsa9cg9l8A7ExMmc77"
                      publishable-key="pk_live_51TslzuRsa9cg9l8AusKfWUqqji6ewsc5fIg04BCsvxHtZUhYJ84YXV7Xa9RPvBXTPdAx5vC3xtKRuxJ1hwZFioAl00axAE5v3I"
                    ></stripe-buy-button>`
                  }}
                />
              </div>

              <div className="border-t border-gridline/60 pt-4 mt-4 text-left space-y-2">
                {[
                  'Full QECTOR Decoder v3 (all 10 algorithms)',
                  'CPU + CUDA/OpenCL batch decoding',
                  'Written license agreement',
                  'Priority email support (2 business day response)',
                  'Benchmark artifact package',
                  '100% credit toward annual license',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-secondary">
                    <span className="text-green-400">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Need annual pricing, multi-seat, or OEM? <Link to="/commercial" className="text-cyan-300 hover:underline">View all tiers →</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
