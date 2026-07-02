import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import EvidenceBlock from '../components/EvidenceBlock';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SatiCodex() {
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

  return (
    <>
      <SEO
        title="SATI CODEX · QECTOR"
        description="SATI CODEX research series — theoretical, mathematical, and manufacturing-blueprint layer. [[832,10,4]] CSS code, IBM hardware validation, ZNE Richardson extrapolation."
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-400/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-400/10 border border-gold-400/20 rounded-full text-xs font-semibold text-gold-400 uppercase tracking-wider mb-6">
            IBM ibm_fez · 1.9M Shots · Zenodo DOI Archived
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="SATI CODEX" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Theoretical, mathematical, and manufacturing-blueprint layer for quantum error correction.
            Built on the <span className="text-gold-400 font-semibold">[[832,10,4]] LCL-832</span> CSS code —
            a genus-5 surface code with IBM hardware validation and full reproducibility artifacts.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://doi.org/10.5281/zenodo.20825980" target="_blank" rel="noopener noreferrer" className="btn-gold">Zenodo Evidence →</a>
            <Link to="/pricing" className="btn-outline">Research Licensing</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Gold pills */}
          <div ref={(el) => addRef(el, 0)} className="flex flex-wrap justify-center gap-3">
            {[
              '[[832,10,4]] Genus-5 CSS construction',
              'IBM ibm_fez · ibm_kingston (1.9M shots)',
              'Formal re-derivable certificate',
              'ZNE α extraction · Richardson extrapolation',
              'ORCID 0009-0000-3465-3753',
            ].map((pill) => (
              <span key={pill} className="px-4 py-2 bg-gold-400/10 border border-gold-400/20 rounded-full text-sm text-gold-400">
                {pill}
              </span>
            ))}
          </div>

          {/* LCL-832 */}
          <div ref={(el) => addRef(el, 1)} className="card-surface border-gold-400/20">
            <h3 className="text-gold-400 font-semibold text-lg mb-3">LCL-832 CSS Code</h3>
            <p className="text-secondary leading-relaxed mb-4">
              A <code className="text-cyan-300">[[832,10,4]]</code> CSS stabilizer code constructed on a genus-5 surface.
              The distance-4 property is an exact algebraic property of the certified LCL-832 matrices, verified through formal re-derivation (19/19 checks passed).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-void rounded-xl">
                <div className="text-muted-foreground text-xs uppercase mb-1">Parameters</div>
                <div className="text-primary font-mono">n=832, k=10, d=4</div>
                <div className="text-muted-foreground text-xs mt-1">Genus-5 surface code</div>
              </div>
              <div className="p-4 bg-void rounded-xl">
                <div className="text-muted-foreground text-xs uppercase mb-1">Rate</div>
                <div className="text-primary font-mono">k/n = 10/832 ≈ 1.20%</div>
                <div className="text-muted-foreground text-xs mt-1">Higher than standard surface code</div>
              </div>
            </div>
          </div>

          {/* IBM Hardware */}
          <div ref={(el) => addRef(el, 2)}>
            <EvidenceBlock
              title="IBM Hardware Validation"
              statement="Real IBM Quantum hardware executions on ibm_fez and ibm_kingston. 1.9 million shots collected across GHZ entanglement verification, repetition-code bit-flip suppression, and offline syndrome decoding experiments."
              className="mb-4"
            />
            <div className="space-y-3">
              {[
                { name: 'GHZ Entanglement', result: 'F = 0.874', desc: '7-qubit GHZ state fidelity on ibm_fez' },
                { name: 'Repetition Code', result: 'Λ ~ 2.5–3.5', desc: 'Bit-flip suppression factor, offline MWPM decoding' },
                { name: 'ZNE Extraction', result: 'α_op = 0.8783', desc: 'Design constant from Richardson extrapolation (not measured hardware value)' },
              ].map((exp) => (
                <div key={exp.name} className="flex items-center gap-4 p-3 bg-void rounded-lg">
                  <div className="flex-1">
                    <div className="text-primary text-sm font-medium">{exp.name}</div>
                    <div className="text-muted-foreground text-xs">{exp.desc}</div>
                  </div>
                  <div className="text-cyan-300 font-mono text-sm font-bold">{exp.result}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Boundaries */}
          <EvidenceBlock
            title="Technical Boundaries"
            statement="The [[832,10,4]] distance is an exact algebraic property of the certified LCL-832 matrices, not a hardware fault-tolerance demonstration. The code has never been run end-to-end on hardware (832+ qubits exceed current device limits). Proven IBM hardware results are GHZ entanglement (F=0.874 at 7q) and repetition-code bit-flip suppression (Lambda ~2.5–3.5, offline MWPM). α_op = 0.8783 is a design constant, not a measured hardware value. These boundaries are maintained in all licensing discussions."
          />

        </div>
      </section>
    </>
  );
}
