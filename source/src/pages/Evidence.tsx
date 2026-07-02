import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import AlgorithmCard from '../components/AlgorithmCard';
import EvidenceBlock from '../components/EvidenceBlock';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REPORTS_DATA = [
  {
    title: 'MWPM LER Parity Validation',
    desc: 'Exact LER parity between QECTOR-Blossom and PyMatching verified across distances d=3 to d=15. Full Stim circuit files, exact parameters, and expected outputs included.',
    status: 'Validated',
  },
  {
    title: 'Belief-Matching Gain Report',
    desc: '+35.7% LER reduction vs PyMatching at d=5 under circuit-level noise. BP preprocessing parameters, reweighting factors, and convergence criteria documented.',
    status: 'Validated',
  },
  {
    title: 'GPU Batch Bit-Identity',
    desc: 'CUDA and OpenCL batch decoders produce bit-identical corrections to CPU MWPM. Byte-for-byte verified on 10,000 random syndromes per distance.',
    status: 'Validated',
  },
  {
    title: 'Optimal Shot Analysis',
    desc: '98.3% of shots achieve exact minimum-weight correction at d=9. Medium gap analysis shows zero median deviation from optimal.',
    status: 'Validated',
  },
  {
    title: 'SATI CODEX Certificate',
    desc: 'Formal re-derivable certificate for [[832,10,4]] LCL-832 CSS code. 19/19 algebraic checks passed. SHA-256 sealed artifact.',
    status: 'Certified',
  },
  {
    title: 'IBM Hardware Execution Log',
    desc: 'Real IBM Quantum hardware results: GHZ entanglement (F=0.874 at 7q), repetition-code suppression (Λ~2.5-3.5), job IDs and timestamp proofs.',
    status: 'Hardware',
  },
];

export default function Evidence() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    sectionsRef.current.filter(Boolean).forEach((section) => {
      gsap.fromTo(section, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 85%', once: true },
      });
    });
    return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
  }, []);
  const addRef = (el: HTMLDivElement | null, index: number) => { if (el) sectionsRef.current[index] = el; };

  const filteredReports = REPORTS_DATA.filter(
    (report) => selectedStatus === 'All' || report.status === selectedStatus
  );

  return (
    <>
      <SEO
        title="Evidence & Reports · QECTOR"
        description="Validation reports, reproducible artifacts, and evidence bundles for QECTOR quantum error correction decoder. Zenodo DOI 10.5281/zenodo.20825980."
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-400/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-400/10 border border-green-400/20 rounded-full text-xs font-semibold text-green-400 uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
            SHA-256 Manifests · Stim Cross-Validation · IBM Hardware Job IDs
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="Evidence & Reports" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Every public claim is backed by a verifiable artifact. Validation reports, benchmark data,
            and IBM hardware job IDs — all archived on Zenodo with DOI{' '}
            <span className="text-green-400 font-semibold font-mono">10.5281/zenodo.20825980</span>.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://doi.org/10.5281/zenodo.20825980" target="_blank" rel="noopener noreferrer" className="btn-cyan">Open Zenodo Record →</a>
            <Link to="/benchmarks" className="btn-outline">Benchmark Details</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Zenodo CTA */}
          <div ref={(el) => addRef(el, 0)} className="text-center">
            <a
              href="https://doi.org/10.5281/zenodo.20825980"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-300/10 border border-cyan-300/20 rounded-2xl hover:bg-cyan-300/20 transition-all"
            >
              <span className="text-2xl">📋</span>
              <div className="text-left">
                <div className="text-cyan-300 font-semibold">Zenodo Evidence Bundle</div>
                <div className="text-muted-foreground text-sm">DOI: 10.5281/zenodo.20825980</div>
              </div>
            </a>
          </div>

          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
            {['All', 'Validated', 'Certified', 'Hardware'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-300 ${
                  selectedStatus === status
                    ? 'bg-cyan-300 text-void border-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.35)]'
                    : 'bg-[#0b1329]/40 text-secondary border-gridline hover:text-primary hover:border-cyan-300/40'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Reports Grid */}
          <div ref={(el) => addRef(el, 1)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((report) => (
              <AlgorithmCard
                key={report.title}
                title={report.title}
                badge={{
                  label: report.status,
                  color: report.status === 'Validated' ? 'green' : report.status === 'Certified' ? 'cyan' : 'gold',
                }}
                desc={report.desc}
              />
            ))}
          </div>

          {/* Reproducibility */}
          <div ref={(el) => addRef(el, 2)} className="card-surface">
            <h3 className="text-cyan-300 font-semibold mb-3">Reproducing Our Results</h3>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              All artifacts include: Stim circuit definitions, exact noise parameters, decoder configuration files,
              expected output hashes, and reproduction instructions.
            </p>
            <div className="p-4 bg-void rounded-xl font-mono text-sm text-muted-foreground">
              <div className="text-cyan-300 mb-2"># Quick validation</div>
              <div>pip install qector-decoder-v3</div>
              <div>python -m qector.validate -all</div>
            </div>
          </div>

          {/* Transparency */}
          <EvidenceBlock
            title="Our Transparency Commitment"
            statement={`We publish all validation results — passes, non-passes, and known limitations. A "non-pass" is a test that doesn't meet the strictest criterion but has a documented explanation (typically stale-test artifacts or local-source configuration differences). We do not hide non-passes behind aggregate statistics.`}
          />

        </div>
      </section>
    </>
  );
}
