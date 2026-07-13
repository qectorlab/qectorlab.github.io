import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO, JsonLd } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
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

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const { version: pypiVersion } = usePyPIVersion();

  useEffect(() => {
    // Load Stripe buy button script
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
      document.body.removeChild(script);
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

      {/* Dynamic Verification Banner */}
      <div className="relative z-50 bg-cyan-300/10 border-b border-cyan-300/20 py-3 text-center text-xs sm:text-sm font-semibold text-cyan-300 tracking-wide backdrop-blur-md">
        Powering 29,000+ automated QEC simulation cluster pulls monthly across the US, Europe, and China.
      </div>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          src="/videos/hero-lattice.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ filter: 'brightness(0.6)' }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/30 to-void" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-24 pb-16">
          {/* Badge */}
          <Link
            to="/changelog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface/80 border border-gridline rounded-full text-sm text-secondary hover:text-cyan-300 hover:border-cyan-300/30 transition-all mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
            <span>QECTOR Decoder v{pypiVersion} (Source-Available, not free) under qectorlab · New Free Workbench</span>
            <span className="opacity-50 ml-1">· Changelog →</span>
          </Link>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}
          >
            QECTOR Decoder v3 - Production-Grade Quantum Error Correction Decoding with Exact PyMatching Parity
            <br />
            <span className="text-cyan-300">Validated MWPM Parity to d=15 + 35.7% LER Reduction via Belief-Matching | GPU Batch Decoding</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-secondary max-w-3xl mx-auto mb-10 leading-relaxed" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
            QECTOR Decoder v3 under the qectorlab brand. Exact MWPM parity with PyMatching through d=15.{' '}
            <strong className="text-primary">+35.7% LER reduction</strong> with Belief-Matching at d=5.
            GPU batch decoding included. All claims are simulation-validated with reproducible artifacts on GitHub.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/decoder" className="btn-cyan text-base px-8 py-4">
              Explore the Decoder
            </Link>
            <a href="https://github.com/qectorlab/qector-decoder-workbench/releases/tag/v3.4.0" className="btn-outline text-base px-8 py-4" target="_blank" rel="noopener noreferrer">
              Free Professional GUI - QECTOR Decoder Workbench v3.4
            </a>
            <Link to="/commercial" className="btn-gold text-base px-8 py-4">
              Start Commercial Evaluation
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Simulation-validated · IBM Quantum verification pathway available under commercial evaluation
          </p>
        </div>
      </section>

      {/* ===== TRUST SIGNAL BAR ===== */}
      <section ref={(el) => addRef(el, 0)} className="border-t border-gridline py-6 bg-void">
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

      {/* ===== VALIDATION & EVIDENCE (P0) ===== */}
      <section className="py-16 bg-surface/30 border-t border-gridline">
        <div className="section-padding max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Every Claim is Backed by Reproducible Artifacts</h2>
          <p className="text-secondary mb-6 max-w-2xl mx-auto">
            All performance and correctness claims are simulation-validated with public, reproducible artifacts on GitHub.
            No hidden data. Run it yourself.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-left max-w-4xl mx-auto">
            <div className="card-surface">
              <strong>Exact MWPM Parity</strong><br />
              Matches PyMatching LER d=3 to d=15. <a href="https://github.com/GuillaumeLessard/qector-decoder" className="text-cyan-300">View stim_ler_d13_d15.json</a>
            </div>
            <div className="card-surface">
              <strong>+35.7% LER Reduction</strong><br />
              Belief-Matching at d=5, circuit-level noise. <a href="https://github.com/GuillaumeLessard/qector-decoder" className="text-cyan-300">Full artifact + seeds</a>
            </div>
            <div className="card-surface">
              <strong>GPU Batch &amp; BP-OSD</strong><br />
              Bit-identical CUDA/OpenCL, qLDPC support. <a href="https://github.com/GuillaumeLessard/qector-decoder" className="text-cyan-300">Repro harness</a>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://github.com/GuillaumeLessard/qector-decoder" target="_blank" rel="noopener noreferrer" className="btn-cyan">View Artifacts on GitHub</a>
            <Link to="/benchmarks" className="btn-outline">See Full Benchmarks</Link>
            <Link to="/evidence" className="btn-outline">Evidence &amp; Reports</Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4">One-click reproduction: git clone ... ; python -m qector.validate</p>
        </div>
      </section>

      {/* ===== PLATFORM ===== */}
      <section id="platform" className="py-24 md:py-32 relative overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(103, 232, 249, 0.08) 0%, transparent 70%)' }} />

        <div className="section-padding relative z-10">
          <div className="max-w-6xl mx-auto">
            <div ref={(el) => addRef(el, 1)}>
              <SectionHeader
                heading={<NeuralReveal text="Key Differentiators" className="text-3xl md:text-4xl font-bold" />}
                description="QEC decoding is not one-size-fits-all. Surface codes, qLDPC codes, and real-time vs. batch workloads need different decoders. QECTOR Decoder v3 under qectorlab gives you all of them in one Python library with a consistent API. Every claim backed by GitHub artifacts."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Exact MWPM - Validated',
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
                  desc: 'Near-linear Union-Find for large-distance real-time decoding. Native CUDA/OpenCL GPU batch for throughput-bound workloads - bit-identical to CPU.',
                  proof: 'Bit-identical CPU ↔ GPU output',
                },
                {
                  title: 'One Library, Pluggable',
                  tag: 'Stim · PyMatching · Sinter · Qiskit',
                  desc: 'Drop QECTOR into any existing Stim or PyMatching workflow. Same API surface, swappable backend. No vendor lock-in.',
                  proof: 'Drop-in, same API surface',
                },
              ].map((card, i) => (
                <div key={card.title} ref={(el) => addRef(el, 2 + i)}>
                  <AlgorithmCard title={card.title} tag={card.tag} desc={card.desc} proof={card.proof} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== DECODER SHOWCASE ===== */}
      <section id="decoder-section" className="py-24 md:py-32 bg-surface/50">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div ref={(el) => addRef(el, 6)} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Metrics */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <NeuralReveal text="Decoder" className="text-3xl md:text-4xl font-bold" />
                </h2>
                <p className="text-secondary text-lg leading-relaxed mb-8">
                  Ten battle-tested decoding algorithms in a single Python library - MWPM, Belief-Matching,
                  BP-OSD, Union-Find, GPU Batch, EBP, Restart Belief, KAT/QCT, Astra GNN, and FPGA emulator -
                  with provable accuracy guarantees and reproducible validation artifacts.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: '\u2705 Exact Parity', desc: 'QECTOR-Blossom matches PyMatching LER from d=3 to d=15 (adaptive-k MWPM)' },
                    { label: '\uD83D\uDCC8 +35.7% Advantage', desc: 'Belief-matching LER reduction vs PyMatching at d=5 (circuit-level noise)' },
                    { label: '\uD83C\uDFAF 98.3% Optimal', desc: 'Shots with exact minimum weight at d=9 (median gap ≈ 0)' },
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

              {/* Right - Visual */}
              <div ref={(el) => addRef(el, 7)} className="relative w-full">
                <QECSimulator />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENCHMARKS ===== */}
      <section id="benchmarks-section" className="py-24 md:py-32 relative">
        <div className="section-padding relative z-10">
          <div className="max-w-6xl mx-auto">
            <div ref={(el) => addRef(el, 8)}>
              <SectionHeader
                eyebrow="Performance"
                heading={<NeuralReveal text="Head-to-Head Benchmarks" className="text-3xl md:text-4xl font-bold" />}
              />
              <EvidenceBlock
                title="Validation Report"
                statement="Every figure below comes from the official Validation Report with reproducible artifacts on GitHub, including the full simulation code, seeds, and raw output."
                href="https://github.com/GuillaumeLessard/qector-decoder"
                linkLabel="GitHub Artifacts →"
                className="max-w-3xl mx-auto mb-4"
              />
            </div>

            <div ref={(el) => addRef(el, 9)} className="overflow-x-auto">
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
                    { algo: 'QECTOR-Blossom (MWPM)', dist: 'd = 3 - 15', ler: 'Exact parity', speed: '6.9-7.7× faster', status: 'Validated' },
                    { algo: 'Belief-Matching', dist: 'd = 5', ler: '\u221235.7% LER', speed: 'Comparable', status: 'Validated' },
                    { algo: 'QECTOR-Blossom', dist: 'd = 9', ler: '98.3% optimal shots', speed: 'Faster', status: 'Validated' },
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

            <div className="text-center mt-8">
              <Link to="/benchmarks" className="btn-outline">
                Full Benchmark Report →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Related Research & Ecosystem (P1) ===== */}
      <section className="py-12 bg-void/50 border-t border-gridline">
        <div className="section-padding max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Related Research &amp; Ecosystem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <a href="https://github.com/GuillaumeLessard/qector-decoder" className="card-surface hover:border-cyan-300/50">QECTOR Decoder GitHub - Artifacts, code, full validation harness</a>
            <a href="https://github.com/qectorlab/qector-decoder-workbench" className="card-surface hover:border-cyan-300/50">Free Workbench v3.4 - GUI, MCP server, benchmarks</a>
            <div className="card-surface">
              Broader QECTOR / SATI CODEX / LCL-833 theoretical work and papers available via the decoder repo README and linked Zenodo records.
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">Cross-linked with ORCID, "Mastering QEC" book, and full research corpus on GitHub.</p>
        </div>
      </section>

      {/* ===== ENTERPRISE COMPLIANCE ===== */}
      <section className="py-16 bg-surface/20 border-t border-gridline">
        <div className="section-padding max-w-4xl mx-auto">
          <div className="card-surface border-cyan-300/20 bg-void/50 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/5 to-transparent pointer-events-none" />
            <h3 className="text-xl font-bold text-cyan-300 flex items-center gap-2 mb-4">
              🛡️ Corporate Compliance &amp; R&amp;D Licensing
            </h3>
            <p className="text-primary text-sm font-semibold mb-3">
              Running QECTOR inside a commercial hardware lab or corporate testing cluster?
            </p>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              Our PyPI package includes explicit <code className="text-cyan-300 bg-cyan-300/5 px-1.5 py-0.5 rounded border border-cyan-300/10 font-mono">Other/Proprietary License</code> metadata tags designed to trigger automated enterprise compliance workflows (Snyk, Black Duck, FOSSA).
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              To legally clear your internal CI/CD pipelines, secure an official corporate evaluation receipt below. No software locks, no license-key friction—just instant legal clearance for your entire engineering stack.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA / PRICING ===== */}
      <section id="pricing-section" className="py-24 md:py-32 bg-surface/50 border-t border-gridline">
        <div className="section-padding">
          <div className="max-w-xl mx-auto">
            <div ref={(el) => addRef(el, 10)} className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Secure Your License</h2>
              <p className="text-secondary text-sm max-w-md mx-auto">
                Secure your official corporate evaluation receipt and instantly clear compliance pipelines.
              </p>
            </div>

            <div className="card-surface border-cyan-300/35 neon-border-cyan relative overflow-hidden p-8 rounded-2xl bg-void/80 text-center">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 to-transparent pointer-events-none" />
              <div className="mb-6">
                <span className="px-3 py-1 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Commercial Evaluation License
                </span>
                <h3 className="text-3xl font-extrabold text-primary mt-3">$499</h3>
                <p className="text-muted-foreground text-xs mt-1">One-time payment · 60-day pilot · Fully creditable</p>
              </div>

              {/* Stripe Buy Button */}
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

              <div className="border-t border-gridline/60 pt-4 mt-6 text-left">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  💡 <strong>Coupon Instructions:</strong> If you have an academic discount or partner referral coupon, you can enter it directly on the Stripe checkout page after clicking the button above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
