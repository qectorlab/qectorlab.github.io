import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import { PYTHON_RANGE } from '../lib/releases';

// Who QECTOR is for, by audience. Describes what each audience can do with
// shipped features; no customer names or quotes are implied.

const CASES = [
  {
    id: 'hardware',
    who: 'Quantum hardware teams',
    need: 'You run memory experiments and need decoders that match your noise, scale to batch sizes and can run inside a locked-down lab network.',
    how: [
      'Turn Stim circuits or measured detector error models into weighted decoders in one call.',
      'Batch-decode on GPU (CUDA or OpenCL) with a Pro or Lab licence.',
      'Licences verify offline, so decoding works on air-gapped control machines.',
      'Compare matching, Union-Find and BP-OSD on the same detector graph before choosing one.',
    ],
    plan: 'Pro or Lab',
  },
  {
    id: 'qldpc',
    who: 'qLDPC code researchers',
    need: 'Your codes are not graph-like, so matching decoders do not apply, and you need to compare BP variants fairly.',
    how: [
      'BP-OSD and Relay-BP with configurable OSD order and damping.',
      'Built-in code families, including bivariate bicycle codes, as parity-check matrices.',
      'Every correction is checked against its syndrome, so a decoder failure is never silent.',
      'Sinter integration for threshold and logical-error-rate sweeps.',
    ],
    plan: 'Free for non-commercial research; Lab for funded commercial work',
  },
  {
    id: 'academic',
    who: 'Universities and public labs',
    need: 'You teach or research QEC and need a decoder library students can install in one command, without licence paperwork.',
    how: [
      'Free under PolyForm Noncommercial for academic, educational and public research use, whatever the funding source.',
      `Wheels for Python ${PYTHON_RANGE} on Linux, Windows and macOS: no compiler needed.`,
      'A free desktop Workbench for teaching without code.',
      '40% off Lab when a paid plan is needed, for example to pass commercial rights to an industry partner.',
    ],
    plan: 'Free, or Lab at 40% off',
  },
  {
    id: 'claude',
    who: 'Teams working with Claude',
    need: 'You want an assistant that can build codes, decode syndromes and check results without sending data off the machine.',
    how: [
      'The QECTOR Claude plugin exposes verified decoding tools to Claude Code and Claude Desktop.',
      'The default server refuses network access and validates every message against JSON Schema.',
      'Every result carries a status, so Claude never reports an unchecked result as verified.',
    ],
    plan: 'Free plugin; the decoder licence follows your use',
  },
];

export default function UseCases() {
  return (
    <>
      <SEO
        title="Use Cases · QECTOR"
        description="How quantum hardware teams, qLDPC researchers, universities and Claude users use QECTOR Decoder v3: weighted circuit decoding, GPU batches, BP-OSD for qLDPC, free academic use and offline licensing."
      />
      <section className="relative pt-32 pb-12 md:pt-36 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6">Use Cases</h1>
          <p className="text-secondary text-lg leading-relaxed">What each kind of team gets from QECTOR, and which plan fits.</p>
          <nav aria-label="Use cases" className="flex flex-wrap justify-center gap-2 mt-6">
            {CASES.map((c) => (
              <a key={c.id} href={`#${c.id}`} className="px-3 py-1.5 rounded-full border border-gridline text-sm text-secondary hover:text-cyan-300 hover:border-cyan-300/40">{c.who}</a>
            ))}
          </nav>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-8">
          {CASES.map((c) => (
            <article key={c.id} id={c.id} className="scroll-mt-28 bg-[#0b1329]/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 grid md:grid-cols-[1fr_1.4fr] gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-3">{c.who}</h2>
                <p className="text-secondary leading-relaxed mb-4">{c.need}</p>
                <p className="text-sm"><span className="text-muted-foreground">Fits: </span><span className="text-cyan-300 font-semibold">{c.plan}</span></p>
              </div>
              <ul className="space-y-3">
                {c.how.map((h) => (
                  <li key={h} className="flex gap-3 text-secondary text-sm leading-relaxed">
                    <span className="text-cyan-300 mt-0.5" aria-hidden="true">✓</span><span>{h}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/getting-started" className="btn-cyan">Try it in 15 minutes</Link>
            <Link to="/pricing" className="btn-outline">Compare plans</Link>
          </div>
        </div>
      </section>
    </>
  );
}
