import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import CodeBlock from '../components/CodeBlock';
import step1 from '../content/tutorial/step1.py?raw';
import step2 from '../content/tutorial/step2.py?raw';
import step3 from '../content/tutorial/step3.py?raw';
import step4 from '../content/tutorial/step4.py?raw';
import step5 from '../content/tutorial/step5.py?raw';

// Every snippet is a real file in src/content/tutorial/, run end to end against
// the published qector-decoder-v3 1.0.1 wheel before publishing. Re-run them
// when the package changes; never edit the code here by hand.

const STEPS = [
  {
    id: 'install',
    title: 'Install and check',
    text: 'Install from PyPI. Wheels exist for CPython 3.9 to 3.14 on Linux x86_64, Windows x64 and macOS on Apple silicon, so there is nothing to compile. The tier stays "Community" until you activate a licence, and every decoder works on the CPU in that tier.',
    shell: 'python -m pip install --upgrade "qector-decoder-v3>=1.0.1,<2" stim sinter',
    code: step1,
    file: 'step1_check.py',
  },
  {
    id: 'first-decode',
    title: 'Your first decode, checked',
    text: 'Build a distance-5 repetition code, inject one error, and decode its syndrome with Union-Find and exact matching. The assert is the contract every QECTOR decoder keeps: the correction reproduces the syndrome, H·c = s (mod 2).',
    code: step2,
    file: 'step2_first_decode.py',
  },
  {
    id: 'stim',
    title: 'Decode a Stim circuit',
    text: 'Generate a rotated surface-code memory experiment with Stim, turn its detector error model into a weighted matching graph, and count logical errors over sampled shots. The decoder uses the error model’s weights, so rare and common faults are treated differently.',
    code: step3,
    file: 'step3_stim.py',
  },
  {
    id: 'qldpc',
    title: 'qLDPC with BP-OSD',
    text: 'Matching needs graph-like errors; qLDPC codes do not have them. Build the [[144,12,12]] bivariate bicycle code and decode a random error with belief propagation plus ordered statistics, again checking the syndrome.',
    code: step4,
    file: 'step4_qldpc.py',
  },
  {
    id: 'sinter',
    title: 'Scale up with Sinter',
    text: 'Sinter runs many circuits across worker processes and collects statistics. QECTOR registers its decoders as Sinter custom decoders. Keep the main guard: Sinter starts worker processes.',
    code: step5,
    file: 'step5_sinter.py',
  },
];

export default function GettingStarted() {
  return (
    <>
      <SEO
        title="Getting Started · QECTOR Decoder v3"
        description="A 15-minute tutorial for QECTOR Decoder v3: install, a first checked decode, a Stim surface-code circuit, qLDPC decoding with BP-OSD, and Sinter. Every snippet is tested against version 1.0.1."
      />
      <section className="relative pt-32 pb-12 md:pt-36 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding max-w-3xl mx-auto">
          <div className="eyebrow-pill mb-6">About 15 minutes · Tested on 1.0.1</div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6">Getting Started</h1>
          <p className="text-secondary text-lg leading-relaxed">
            From <code className="font-mono text-cyan-200">pip install</code> to decoding a surface-code circuit and a qLDPC code. Each step is a
            complete script you can copy and run.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-[13rem_1fr] gap-10">
          <nav aria-label="Steps" className="hidden lg:block">
            <ol className="sticky top-28 space-y-2 text-sm">
              {STEPS.map((s, i) => (
                <li key={s.id}><a href={`#${s.id}`} className="text-secondary hover:text-cyan-300">{i + 1}. {s.title}</a></li>
              ))}
            </ol>
          </nav>

          <div className="space-y-14 min-w-0">
            {STEPS.map((s, i) => (
              <article key={s.id} id={s.id} className="scroll-mt-28">
                <p className="text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-1">Step {i + 1}</p>
                <h2 className="text-2xl font-bold mb-3">{s.title}</h2>
                <p className="text-secondary leading-relaxed mb-4">{s.text}</p>
                {s.shell && <div className="mb-4"><CodeBlock language="bash" filename="terminal" code={s.shell} /></div>}
                <CodeBlock language="python" filename={s.file} code={s.code.trimEnd()} />
              </article>
            ))}

            <div className="bg-[#0b1329]/40 border border-slate-800/80 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-3">Where to go next</h2>
              <ul className="text-secondary text-sm space-y-2 list-disc pl-5">
                <li>Every class and function, with signatures: the <Link to="/technical-reference" className="text-cyan-300 hover:underline">API index</Link>.</li>
                <li>Choosing a decoder and the full feature set: <Link to="/decoder" className="text-cyan-300 hover:underline">Decoder</Link> and the <Link to="/manual" className="text-cyan-300 hover:underline">user manual</Link>.</li>
                <li>Using QECTOR from Claude: the <Link to="/claude-plugin" className="text-cyan-300 hover:underline">Claude plugin</Link>.</li>
                <li>GPU batch decoding and commercial use: <Link to="/pricing" className="text-cyan-300 hover:underline">plans</Link>, from $79/month.</li>
              </ul>
              <p className="text-muted-foreground text-xs mt-4">
                Verified: each script above was run against the published qector-decoder-v3 1.0.1 wheel on Linux (CPython 3.13) on 6 November 2026.
                Logical-error counts depend on the random seed and noise settings; measure on your own workloads.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
