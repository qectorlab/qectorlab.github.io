import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';

// Feature comparison with the main open-source QEC decoders. Features and
// licences only, taken from each project's PyPI page (checked 2026-11-06).
// No speed numbers: QECTOR publishes no portable performance figures.

type Cell = string;
interface Row { label: string; qector: Cell; pymatching: Cell; ldpc: Cell; fusion: Cell }

const ROWS: Row[] = [
  { label: 'Main decoders', qector: 'Union-Find, exact MWPM (Blossom), near-optimal Sparse Blossom, BP-OSD, Relay-BP', pymatching: 'MWPM (Sparse Blossom), correlated matching', ldpc: 'BP+OSD, BP+LSD, BeliefFind (BP + Union-Find)', fusion: 'Parallel MWPM' },
  { label: 'Graph-like codes (surface, repetition)', qector: 'Yes', pymatching: 'Yes, its specialty', ldpc: 'Yes', fusion: 'Yes' },
  { label: 'qLDPC and non-graph-like codes', qector: 'Yes (BP-OSD, Relay-BP)', pymatching: 'No: needs graph-like error models', ldpc: 'Yes, its specialty', fusion: 'No' },
  { label: 'Several families on one check matrix', qector: 'Yes, one API', pymatching: 'Matching only', ldpc: 'BP-based family', fusion: 'Matching only' },
  { label: 'GPU batch decoding', qector: 'Yes (CUDA, OpenCL; paid plans)', pymatching: 'No', ldpc: 'No', fusion: 'No' },
  { label: 'Stim and Sinter', qector: 'Yes', pymatching: 'Yes', ldpc: 'Via Sinter decoder classes', fusion: 'Via Sinter' },
  { label: 'Core language', qector: 'Rust, Python API', pymatching: 'C++, Python API', ldpc: 'C++, Python API', fusion: 'Rust, Python API' },
  { label: 'Licence', qector: 'PolyForm Noncommercial; commercial plans', pymatching: 'Apache 2.0', ldpc: 'MIT', fusion: 'MIT' },
  { label: 'Commercial support', qector: 'Yes, with offline-verified licences', pymatching: 'Community', ldpc: 'Community', fusion: 'Community' },
];

const SOURCES = [
  ['PyMatching', 'https://pypi.org/project/pymatching/'],
  ['ldpc', 'https://pypi.org/project/ldpc/'],
  ['fusion-blossom', 'https://pypi.org/project/fusion-blossom/'],
  ['QECTOR Decoder v3', 'https://pypi.org/project/qector-decoder-v3/'],
] as const;

export default function Compare() {
  return (
    <>
      <SEO
        title="QECTOR vs PyMatching, ldpc and fusion-blossom · Feature Comparison"
        description="An honest feature comparison of QECTOR Decoder v3 with PyMatching, ldpc and fusion-blossom: decoder families, qLDPC support, GPU, Stim and Sinter, licences and support. No speed claims."
      />

      <section className="relative py-24 md:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-gridline rounded-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            Features, not speed claims · Checked November 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="How QECTOR Compares" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            PyMatching, ldpc and fusion-blossom are excellent open-source decoders. QECTOR&apos;s case is breadth: many decoder families,
            qLDPC and GPU batch decoding behind one API, with every correction checked.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="card-surface overflow-x-auto" tabIndex={0} role="region" aria-label="Feature comparison">
            <table className="w-full min-w-[760px] text-sm text-left">
              <thead>
                <tr className="border-b border-gridline">
                  <th scope="col" className="py-3 pr-4 text-muted-foreground font-semibold w-[20%]">Feature</th>
                  <th scope="col" className="py-3 pr-4 text-cyan-300 font-bold">QECTOR Decoder v3</th>
                  <th scope="col" className="py-3 pr-4 text-primary font-semibold">PyMatching</th>
                  <th scope="col" className="py-3 pr-4 text-primary font-semibold">ldpc</th>
                  <th scope="col" className="py-3 text-primary font-semibold">fusion-blossom</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.label} className="border-b border-gridline/50 align-top">
                    <th scope="row" className="py-3 pr-4 text-primary font-medium">{r.label}</th>
                    <td className="py-3 pr-4 text-primary bg-cyan-300/[0.04]">{r.qector}</td>
                    <td className="py-3 pr-4 text-secondary">{r.pymatching}</td>
                    <td className="py-3 pr-4 text-secondary">{r.ldpc}</td>
                    <td className="py-3 text-secondary">{r.fusion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-surface">
              <h2 className="text-xl font-bold mb-3">Choose another tool when</h2>
              <ul className="text-secondary text-sm space-y-2 list-disc pl-5">
                <li>You only decode surface or repetition codes with matching and want the most established tool: PyMatching is the reference.</li>
                <li>You need a permissive open-source licence to redistribute the decoder inside your own product for free.</li>
                <li>You only need BP-based qLDPC decoding and are happy on CPU: ldpc is mature and MIT-licensed.</li>
              </ul>
            </div>
            <div className="card-surface border-cyan-300/25">
              <h2 className="text-xl font-bold mb-3">Choose QECTOR when</h2>
              <ul className="text-secondary text-sm space-y-2 list-disc pl-5">
                <li>You compare several decoder families on the same codes and want one API and one output format.</li>
                <li>You work on qLDPC codes and want GPU batch decoding.</li>
                <li>You need every correction checked against its syndrome, and commercial support with licences that work air-gapped.</li>
                <li>You use Claude: the <Link to="/claude-plugin" className="text-cyan-300 hover:underline">QECTOR Claude plugin</Link> brings verified decoding into Claude Code and Claude Desktop.</li>
              </ul>
            </div>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-3">About this comparison</h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              Features and licences come from each project&apos;s own PyPI page, checked on 6 November 2026. We publish no speed comparison:
              decoder speed depends on code, noise model, hardware and settings, so measure on your own workload. QECTOR ships a PyMatching
              compatibility shim (<code className="font-mono text-cyan-200">from qector_decoder_v3.pymatching import Matching</code>) so you can switch
              and compare in place. Spotted something out of date? Write to{' '}
              <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a> and we will correct it.
            </p>
            <p className="text-secondary text-sm">
              Sources:{' '}
              {SOURCES.map(([name, url], i) => (
                <span key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">{name}</a>
                  {i < SOURCES.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
