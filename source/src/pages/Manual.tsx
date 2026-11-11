import React, { useState } from 'react';
import { SEO, JsonLd } from '../lib/seo';
import CodeBlock from '../components/CodeBlock';
import TerminalEmulator from '../components/TerminalEmulator';
import NeuralReveal from '../components/NeuralReveal';
import { Info, HelpCircle, Cpu, ShieldCheck, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { PYPI_PACKAGE, PYPI_VERSION, PYTHON_RANGE } from '../lib/releases';

const INLINE_CODE_CLASS = 'font-mono text-[11px] bg-cyan-300/10 text-cyan-200 px-1 py-0.5 rounded border border-cyan-300/20';

function inlineCodeParts(text: string, keyBase: string): React.ReactNode[] {
  return text
    .replace(/\\"/g, '"')
    .split(/(`[^`\n]+`)/g)
    .map((part, i) => {
      if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={`${keyBase}-${i}`} className={INLINE_CODE_CLASS}>
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
}

/** Renders markdown-style `code` spans inside JSX text as <code> elements. */
function InlineMD({ children }: { children: React.ReactNode }) {
  const walk = (node: React.ReactNode, base: string): React.ReactNode => {
    if (typeof node === 'string') {
      return <React.Fragment key={base}>{inlineCodeParts(node, base)}</React.Fragment>;
    }
    if (Array.isArray(node)) {
      return (
        <>
          {node.map((n, i) => (
            <React.Fragment key={`${base}-${i}`}>{walk(n, `${base}-${i}`)}</React.Fragment>
          ))}
        </>
      );
    }
    return node;
  };
  return <>{walk(children, 'imd')}</>;
}


interface ConfigRow { name: string; type: string; default: string; desc: string }
interface ConfigGroup { name: string; signature: string; note: string; parameters: ConfigRow[] }

// Constructor arguments for the Configuration section. Names, signatures and
// defaults are copied from src/content/api-<version>.json (the index generated
// from the published wheel): never list an argument the index does not have.
const CONFIG_GROUPS: ConfigGroup[] = [
  {
    name: 'BlossomDecoder',
    signature: 'BlossomDecoder(check_to_qubits, n_qubits=None, edge_weights=None)',
    note: 'There is no pre-filter switch and no timeout argument. For a Union-Find pre-filter with a deadline, see `HybridCascadeDecoder` and its `decode_timed(syndrome, max_latency_ms=10.0)` method.',
    parameters: [
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'For each check, the indices of the qubits it covers. The checks must be graphlike: each qubit in at most two checks.' },
      { name: 'n_qubits', type: 'int', default: 'None', desc: 'Number of data qubits.' },
      { name: 'edge_weights', type: '-', default: 'None', desc: 'Optional matching weights, one per qubit. `set_edge_weights(weights)` changes them later.' },
    ],
  },
  {
    name: 'BeliefMatching',
    signature: `BeliefMatching.from_numpy_h(H, error_rate: float = 0.05, max_iter: int = 20) -> BeliefMatching
BeliefMatching(matrices: _Matrices, max_iter: int = 30, bp_shortcut: bool = False)`,
    note: 'Build instances with `from_numpy_h`, `from_detector_error_model(dem, max_iter=20)` or `from_stim_circuit(circuit, max_iter=20)`; the bare constructor takes an internal matrices object.',
    parameters: [
      { name: 'H', type: '-', default: 'Required', desc: '`from_numpy_h` only. Parity-check matrix of shape (n_checks, n_qubits).' },
      { name: 'error_rate', type: 'float', default: '0.05', desc: '`from_numpy_h` only. Physical error rate used for the priors.' },
      { name: 'max_iter', type: 'int', default: '20', desc: 'Maximum number of belief propagation iterations for the three `from_*` constructors. The bare constructor defaults to `30`.' },
      { name: 'bp_shortcut', type: 'bool', default: 'False', desc: 'Constructor only. When `True`, return the BP hard decision as soon as it reproduces the syndrome, skipping the matching step.' },
    ],
  },
  {
    name: 'CUDABatchDecoder',
    signature: 'CUDABatchDecoder(check_to_qubits, n_qubits=None, edge_weights=None)',
    note: 'There is no `backend` or `batch_size` argument. The batch is the array passed to `batch_decode(syndromes)`, one row per shot; check `CUDABatchDecoder.is_available()` first. `OpenCLBatchDecoder` requires a source build.',
    parameters: [
      { name: 'check_to_qubits', type: 'list[list[int]]', default: 'Required', desc: 'For each check, the indices of the qubits it covers. The checks must be graphlike.' },
      { name: 'n_qubits', type: 'int', default: 'None', desc: 'Number of data qubits.' },
      { name: 'edge_weights', type: '-', default: 'None', desc: 'Optional weights for weighted Union-Find growth.' },
    ],
  },
  {
    name: 'BackendConfig (AutoDecoder)',
    signature: 'BackendConfig(rayon_threshold: int = 8, gpu_threshold: int = 4096, allow_gpu: bool = True, prefer: str = "cuda", force: str | None = None, enable_auto_debug: bool = True) -> None',
    note: 'Pass it to the router: `AutoDecoder(check_to_qubits, n_qubits=None, config=None)`. `AutoDecoder.select(batch_size)` returns the backend that would run for a batch of that size.',
    parameters: [
      { name: 'rayon_threshold', type: 'int', default: '8', desc: 'Batches at or above this size use the Rayon CPU path instead of the single-thread decoder.' },
      { name: 'gpu_threshold', type: 'int', default: '4096', desc: 'Batches at or above this size use a GPU path, if one is available.' },
      { name: 'allow_gpu', type: 'bool', default: 'True', desc: 'Master switch for GPU usage.' },
      { name: 'prefer', type: 'str', default: '"cuda"', desc: 'Preferred GPU backend when both are present: `"cuda"` or `"opencl"`.' },
      { name: 'force', type: 'str | None', default: 'None', desc: 'Force one backend for every call, bypassing automatic selection.' },
      { name: 'enable_auto_debug', type: 'bool', default: 'True', desc: 'Enable the self-debugging fallback and automatic error recovery.' },
    ],
  },
];

function configRowText(row: ConfigRow): string {
  const type = row.type === '-' ? '' : '`' + row.type + '` ';
  const value = row.default === 'Required' ? '(Required)' : '(Default: `' + row.default + '`)';
  return `${type}${value}. ${row.desc}`;
}

interface ManualSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export default function Manual() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections: ManualSection[] = [
    { id: 'overview', title: '1. Overview', icon: <Info className="w-4 h-4" /> },
    { id: 'installation', title: '2. Installation', icon: <Cpu className="w-4 h-4" /> },
    { id: 'quickstart', title: '3. Quick Start', icon: <SparklesIcon className="w-4 h-4" /> },
    { id: 'decoders', title: '4. Choosing a Decoder', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'measurement', title: '5. Local Measurements', icon: <ChartIcon className="w-4 h-4" /> },
    { id: 'configuration', title: '6. Configuration', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'troubleshooting', title: '7. Troubleshooting', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'package-reference', title: `8. Package Reference (v${PYPI_VERSION})`, icon: <BookOpen className="w-4 h-4" /> },
  ];

  // Render individual sections beautifully
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <p className="text-secondary text-base leading-relaxed">
              QECTOR Decoder v3 is a Python library for quantum error correction (QEC) decoding. v{PYPI_VERSION} is the current stable release (v1.0.0, August 2026, was the first): it provides 17 decoder configurations and helpers integrated into a high-performance compiled Rust core with a plug-and-play Python API.
            </p>
            <div className="p-4 bg-cyan-300/5 border border-cyan-300/10 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
              <p className="text-secondary text-sm leading-relaxed">
                <strong className="text-primary">Ecosystem Native:</strong> Swappable backend design. You can easily plug QECTOR into Stim, PyMatching, Sinter, and Qiskit pipelines with minimal API modifications: Sinter decoders plug in with <code className="text-cyan-300">custom_decoders=qector_sinter_decoders()</code>, and a qiskit-qec plugin is registered.
              </p>
            </div>
            <div>
              <h3 className="text-primary font-semibold text-lg mb-3">Key Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-void border border-gridline rounded-xl">
                  <h4 className="text-cyan-300 font-semibold text-sm mb-1">v1.0.0: First Stable Release</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">API stability tiers, Relay-BP, CS-OSD(lambda, w), colour-code cluster_bposd, qector CLI + qector-doctor, Sinter/qiskit entry points, pymatching shim.</p>
                </div>
                <div className="p-4 bg-void border border-gridline rounded-xl">
                    <h4 className="text-cyan-300 font-semibold text-sm mb-1">Validate on Your Hardware</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">Hardware, GPU, and measurement results are device-local. Use the package diagnostic and declared measurement workflow instead of treating site text as performance evidence.</p>
                </div>
                <div className="p-4 bg-void border border-gridline rounded-xl">
                  <h4 className="text-cyan-300 font-semibold text-sm mb-1">Multi-Algorithm Diversity</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">17 decoder configurations from exact Blossom MWPM to Belief-Matching, BP-OSD, and GPU batch decoding.</p>
                </div>
                <div className="p-4 bg-void border border-gridline rounded-xl">
                    <h4 className="text-cyan-300 font-semibold text-sm mb-1">Compiled Rust Core</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">A compiled Rust core with a Python API. Exact memory, latency, and throughput behavior depends on the selected workload and environment.</p>
                </div>
                <div className="p-4 bg-void border border-gridline rounded-xl">
                    <h4 className="text-cyan-300 font-semibold text-sm mb-1">Optional GPU Paths</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">GPU paths are optional and environment-dependent. Read the installed release diagnostics before relying on them.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'installation':
        return (
          <div className="space-y-6">
            <p className="text-secondary text-sm leading-relaxed">
              QECTOR ships as pre-compiled binary wheels on PyPI. Installing requires Python and pip.
            </p>

            <div>
              <h3 className="text-primary font-semibold text-sm mb-2">Standard Installation</h3>
              <CodeBlock
                code="pip install qector-decoder-v3"
                filename="terminal"
                language="bash"
              />
            </div>

            <div>
              <h3 className="text-primary font-semibold text-sm mb-2">System Requirements</h3>
              <div className="border border-gridline bg-void/30 rounded-xl overflow-hidden text-sm">
                <div className="p-3 border-b border-gridline flex justify-between gap-3">
                  <span className="text-muted-foreground">Python</span>
                  <span className="text-primary">CPython {PYTHON_RANGE} (64-bit)</span>
                </div>
                <div className="p-3 border-b border-gridline flex justify-between gap-3">
                  <span className="text-muted-foreground">Operating System</span>
                   <span className="text-primary">Linux, macOS, Windows (see current PyPI wheel metadata)</span>
                </div>
                <div className="p-3 flex justify-between gap-3">
                  <span className="text-muted-foreground">GPU Requirements (Optional)</span>
                   <span className="text-primary">Optional and environment-dependent; check the installed release diagnostics</span>
                </div>
              </div>
            </div>

            <div>
               <h3 className="text-primary font-semibold text-sm mb-2">Install Optional Dependencies</h3>
               <p className="text-secondary text-xs mb-3">Install only the extras required by your workflow:</p>
               <CodeBlock
                 code={`# Stim / Sinter / PyMatching ecosystem
 pip install "qector-decoder-v3[stim]"

 # Full optional environment
 pip install "qector-decoder-v3[all]"`}
                filename="terminal"
                language="bash"
              />
            </div>
          </div>
        );

      case 'quickstart':
        return (
          <div className="space-y-6">
            <p className="text-secondary text-sm leading-relaxed">
               Below is a minimal package-only example: build a distance-5 repetition code, generate a syndrome, and verify a Blossom correction against the parity-check matrix.
            </p>

            <CodeBlock
              filename="repetition_code_decode.py"
              language="python"
               code={`import numpy as np
from qector_decoder_v3 import BlossomDecoder, generate_parity_check_matrix

# Distance-5 repetition code: 5 data qubits, 4 parity checks.
check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]
H = generate_parity_check_matrix(check_to_qubits, 5)

# Inject one bit error and compute which checks fire.
error = np.array([0, 0, 1, 0, 0], dtype=np.uint8)
syndrome = (H @ error) % 2

# Decode with the graphlike Blossom backend.
decoder = BlossomDecoder(check_to_qubits, n_qubits=5)
correction = np.asarray(decoder.decode(syndrome), dtype=np.uint8)

# The syndrome contract is H c = s (mod 2).
assert np.array_equal((H @ correction) % 2, syndrome)
print("Syndrome-faithful correction")`}
            />
          </div>
        );

      case 'decoders':
        return (
          <div className="space-y-6">
            <p className="text-secondary text-sm leading-relaxed">
              QECTOR includes 17 decoder configurations categorized into stable, workload-sensitive, and experimental/research tiers. Choose based on code type and speed/accuracy tradeoffs:
            </p>

            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Decoder comparison">
              <table className="w-full min-w-[640px] border-collapse border border-gridline text-left text-sm rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-surface/50 border-b border-gridline text-cyan-300 font-semibold">
                    <th className="p-3">Decoder</th>
                    <th className="p-3">Target Code</th>
                    <th className="p-3">Speed</th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gridline">
                  {[
                     { name: 'Blossom (MWPM)', target: 'Graphlike CSS / surface', speed: 'Workload-dependent', accuracy: 'Minimum-weight matching objective', tier: 'Stable' },
                     { name: 'Belief-Matching', target: 'Correlated-noise research', speed: 'Workload-dependent', accuracy: 'Evaluate locally', tier: 'Research' },
                     { name: 'BP-OSD', target: 'qLDPC, LDPC', speed: 'Workload-dependent', accuracy: 'Evaluate locally', tier: 'Research' },
                    { name: 'Union-Find', target: 'Large Surface', speed: 'Near-linear O(N)', accuracy: 'Approximate', tier: 'Stable' },
                     { name: 'GPU Batch', target: 'Supported batch workloads', speed: 'Runtime-dependent', accuracy: 'Validate locally', tier: 'Workload-sensitive' },
                    { name: 'Hybrid / Cascade', target: 'Degenerate, mixed', speed: 'Iterative', accuracy: 'High', tier: 'Research' },
                    { name: 'Colour Code', target: 'Triangular colour code', speed: 'Moderate', accuracy: 'Native', tier: 'Research' },
                  ].map((row) => (
                    <tr key={row.name} className="hover:bg-surface/20 transition-colors">
                      <td className="p-3 font-semibold text-primary">{row.name}</td>
                      <td className="p-3 text-secondary">{row.target}</td>
                      <td className="p-3 text-secondary">{row.speed}</td>
                      <td className="p-3 text-secondary">{row.accuracy}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                          row.tier === 'Stable'
                            ? 'bg-green-400/10 text-green-400 border-green-400/20'
                            : 'bg-gold-400/10 text-gold-400 border-gold-400/20'
                        }`}>
                          {row.tier}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'measurement':
        return (
          <div className="space-y-6">
            <p className="text-secondary text-sm leading-relaxed">
               Hardware-specific measurements are not published on this site. If your project requires a local measurement,
               record the code, noise model, decoder configuration, seed, shots, environment, and raw artifact.
            </p>

            <div>
              <h3 className="text-primary font-semibold text-sm mb-2">Environment Diagnostic</h3>
              <CodeBlock
                code="qector-doctor"
                filename="terminal"
                language="bash"
              />
              <p className="text-secondary text-xs mt-2">
                15-check diagnostic that reports PASS / WARN / FAIL per check and explains WHY a decoder is unavailable on your machine. Full report via <code className="text-cyan-300">qector-doctor --json</code>.
              </p>
            </div>

            <div>
               <h3 className="text-primary font-semibold text-sm mb-2">Local measurement via qector bench</h3>
              <p className="text-secondary text-xs mb-2">
                 Use the command documented by the installed package release. The result is machine- and workload-specific, not a site claim:
              </p>
              <CodeBlock
                code="qector bench --distance 5 --rounds 5 --shots 10000 --decoder blossom --noise 0.001"
                filename="terminal"
                language="bash"
              />
            </div>

            <div>
              <h3 className="text-primary font-semibold text-sm mb-2">Interactive Sandbox CLI</h3>
              <p className="text-secondary text-xs mb-3">
                 This UI is a command-output demonstration only; it does not execute commands or generate benchmark data:
              </p>
              <TerminalEmulator />
            </div>
          </div>
        );

      case 'configuration':
        return (
          <div className="space-y-6">
            <p className="text-secondary text-sm leading-relaxed">
              Constructor arguments for QECTOR's primary decoders, as listed in the generated API index on the Technical Reference page:
            </p>

            {CONFIG_GROUPS.map((group) => (
              <div key={group.name}>
                <h3 className="text-cyan-300 font-semibold text-sm mb-2">{group.name}</h3>
                <CodeBlock code={group.signature} language="python" className="!mt-0 !mb-2" />
                <div className="border border-gridline bg-void/30 rounded-xl overflow-hidden divide-y divide-gridline text-sm">
                  {group.parameters.map((row) => (
                    <div key={row.name} className="p-3 flex justify-between gap-4">
                      <span className="font-mono text-primary min-w-[120px]">{row.name}</span>
                      <span className="text-secondary text-xs flex-1"><InlineMD>{configRowText(row)}</InlineMD></span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground text-xs mt-2 leading-relaxed"><InlineMD>{group.note}</InlineMD></p>
              </div>
            ))}
          </div>
        );

      case 'troubleshooting':
        return (
          <div className="space-y-6">
            <p className="text-secondary text-sm leading-relaxed">
              Solutions for common installation and running issues:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-red-400/5 border border-red-400/20 rounded-xl">
                <div className="flex items-center gap-2 text-red-400 font-semibold text-sm mb-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span><InlineMD>Issue: ImportError when importing `qector_decoder_v3`</InlineMD></span>
                </div>
                <p className="text-secondary text-xs leading-relaxed">
                   <InlineMD><strong>Fix:</strong> Ensure your Python architecture matches the wheel and reinstall with `python -m pip install --force-reinstall qector-decoder-v3`.</InlineMD>
                </p>
              </div>

              <div className="p-4 bg-gold-400/5 border border-gold-400/20 rounded-xl">
                <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm mb-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Issue: GPU / CUDA is not detected</span>
                </div>
                <p className="text-secondary text-xs leading-relaxed">
                  <InlineMD><strong>Fix:</strong> Verify drivers by typing `nvidia-smi` in terminal. Ensure CUDA Toolkit 11.8 or higher is installed and environment variable `CUDA_PATH` or `LD_LIBRARY_PATH` points to the CUDA install folder.</InlineMD>
                </p>
              </div>

              <div className="p-4 bg-red-400/5 border border-red-400/20 rounded-xl">
                <div className="flex items-center gap-2 text-red-400 font-semibold text-sm mb-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Issue: Out Of Memory (OOM) on GPU batching</span>
                </div>
                <p className="text-secondary text-xs leading-relaxed">
                  <InlineMD><strong>Fix:</strong> `CUDABatchDecoder` has no batch-size argument: pass fewer syndromes to each `batch_decode` call. For files larger than memory, `decode_mmap` decodes in chunks of `batch_size` shots (default `65536`). For exceptionally large code distances (d &gt; 15), prefer the linear-scaling `UnionFindDecoder` which reduces memory demands.</InlineMD>
                </p>
              </div>
            </div>
          </div>
        );

      case 'package-reference':
        return (
          <div className="space-y-8">
            <div className="p-4 bg-cyan-300/5 border border-cyan-300/20 rounded-xl flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-primary font-bold text-lg">QECTOR Decoder v3: Extended Reference (package only)</h3>
                <p className="text-muted-foreground text-xs">Version: {PYPI_VERSION} · PyPI: {PYPI_PACKAGE} · Backend: Rust + PyO3</p>
              </div>
              <a
                href="/docs/reference.md"
                target="_blank"
                rel="noopener noreferrer"
                download="QECTOR Decoder v3 - Reference (package only).md"
                className="btn-cyan text-xs py-2 px-4"
              >
                Download Reference (.md)
              </a>
            </div>

            <div>
              <h3 className="text-primary font-semibold text-base mb-3">1. Installation &amp; Platforms</h3>
              <CodeBlock
                 code={`pip install --upgrade "qector-decoder-v3>=${PYPI_VERSION},<2"\npip install "qector-decoder-v3[stim]"    # Stim / Sinter / PyMatching / LDPC ecosystem\npip install "qector-decoder-v3[bench]"   # local measurement tools\npip install "qector-decoder-v3[all]"     # optional full environment`}
                language="bash"
                filename="terminal"
              />
              <div className="mt-3 border border-gridline bg-void/30 rounded-xl overflow-hidden text-xs">
                <div className="p-2.5 border-b border-gridline flex justify-between"><span className="text-muted-foreground">Python</span><span className="text-primary font-mono">{PYTHON_RANGE}</span></div>
                <div className="p-2.5 border-b border-gridline flex justify-between"><span className="text-muted-foreground">Platforms</span><span className="text-primary">Linux x86_64 (manylinux), Windows x64, macOS arm64</span></div>
                <div className="p-2.5 border-b border-gridline flex justify-between"><span className="text-muted-foreground">License</span><span className="text-primary">Source-available (Free academic / non-commercial)</span></div>
                <div className="p-2.5 border-b border-gridline flex justify-between"><span className="text-muted-foreground">Startup Notice</span><span className="text-primary font-mono">Suppressed with QECTOR_SILENT=1</span></div>
                <div className="p-2.5 flex justify-between"><span className="text-muted-foreground">License Env</span><span className="text-primary font-mono">QECTOR_LICENSE + QECTOR_LICENSE_KEY (Ed25519 token)</span></div>
              </div>
            </div>

            <div>
              <h3 className="text-primary font-semibold text-base mb-3">2. Core Architecture</h3>
              <ul className="list-disc list-inside space-y-1.5 text-secondary text-xs leading-relaxed">
                <li><strong>Rust Core (compiled extension):</strong> Matching, UF, batch CPU/GPU algorithms.</li>
                <li><strong>Python Surface:</strong> Clean API, Stim/Sinter compat, belief/GNN layers, licensing.</li>
                <li><strong>Zero-copy NumPy:</strong> Direct memory access; GIL-free parallel decoding paths.</li>
                <li><strong>Version Symbol:</strong> <code className="text-cyan-300">qector_decoder_v3.__version__ == &quot;{PYPI_VERSION}&quot;</code></li>
              </ul>
            </div>

            <div>
              <h3 className="text-primary font-semibold text-base mb-3">3. Decoder Families &amp; Incidence Rules</h3>
              <p className="text-muted-foreground text-xs mb-3">
                <strong className="text-cyan-300">Graph-like rule:</strong> Inspect the check-to-qubit structure before choosing a backend. <code className="text-cyan-300">UnionFindDecoder</code>, <code className="text-cyan-300">FastUnionFindDecoder</code>, <code className="text-cyan-300">BlossomDecoder</code> and <code className="text-cyan-300">SparseBlossomDecoder</code> need graphlike checks: every qubit participates in at most two checks (participation &le; 2). Any higher degree is a hyperedge: route hypergraph and qLDPC matrices to BP-OSD (<code className="text-cyan-300">BpOsdDecoder</code>), which accepts general GF(2) check matrices. Hyperedges must not be silently decomposed into pairwise matching edges. The Union-Find decoders reject a non-graphlike matrix with a clear error.
              </p>
              <div className="overflow-x-auto rounded-xl" tabIndex={0} role="region" aria-label="Decoder classes">
              <div className="border border-gridline bg-void/30 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-4 min-w-[560px] p-2.5 font-bold border-b border-gridline bg-surface/30">
                  <span>Class</span><span>Best for</span><span>Status</span><span>Graph-like?</span>
                </div>
                <div className="grid grid-cols-4 min-w-[560px] p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">UnionFindDecoder</span><span>Low-latency approximate</span><span>Stable</span><span>Yes (participation &le; 2)</span></div>
                <div className="grid grid-cols-4 min-w-[560px] p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">FastUnionFindDecoder</span><span>Faster UF hot path</span><span>Stable</span><span>Yes</span></div>
                <div className="grid grid-cols-4 min-w-[560px] p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">BlossomDecoder</span><span>Exact MWPM</span><span>Stable</span><span>Yes (participation &le; 2)</span></div>
                <div className="grid grid-cols-4 min-w-[560px] p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">SparseBlossomDecoder</span><span>Near-optimal matching</span><span>Experimental</span><span>Yes (participation &le; 2)</span></div>
                <div className="grid grid-cols-4 min-w-[560px] p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">BeliefMatching</span><span>Correlated-noise accuracy</span><span>Research</span><span>Prefer graph-like</span></div>
                <div className="grid grid-cols-4 min-w-[560px] p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">BpOsdDecoder</span><span>LDPC / qLDPC</span><span>Experimental</span><span>No (Hyperedge OK)</span></div>
                <div className="grid grid-cols-4 min-w-[560px] p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">BatchDecoder</span><span>High-throughput CPU batch</span><span>Stable</span><span>Yes for UF batch</span></div>
                <div className="grid grid-cols-4 min-w-[560px] p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">CUDABatchDecoder</span><span>GPU batch (NVIDIA)</span><span>Workload-sensitive</span><span>Yes (graphlike batches)</span></div>
                <div className="grid grid-cols-4 min-w-[560px] p-2.5"><span className="font-mono text-cyan-300">AutoDecoder</span><span>7-tier self-debugging fallback</span><span>Stable</span><span>N/A</span></div>
              </div>
              </div>
            </div>

            <div>
              <h3 className="text-primary font-semibold text-base mb-3">4. Code Generators</h3>
              <CodeBlock
                 code={`from qector_decoder_v3 import (\n    generate_repetition_code_checks,  # (distance) -> (checks, n_qubits)\n    generate_ring_code_checks,        # (distance) -> (checks, n_qubits)\n    generate_surface_code_checks,     # (distance): compact periodic (toric) surface-code checks\n    generate_parity_check_matrix,     # (check_to_qubits, n_qubits=None) -> binary matrix H\n)`}
                language="python"
                filename="python"
              />
            </div>

            <div>
               <h3 className="text-primary font-semibold text-base mb-3">5. MCP and General-Matrix Workflows</h3>
               <CodeBlock
                 code={`# The standalone library MCP server is documented separately.\n# Start it from the plugin package with:\npython mcp/mcp_server_library.py\n\n# Initialize and call tools/list before using a tool.`}
                 language="python"
                 filename="mcp_server.py"
               />
               <p className="text-muted-foreground text-xs mt-2 mb-3">
                 For general matrices, apply the structural routing guard first: graphlike inputs may use matching, and anything with a hyperedge goes to BP-OSD. Verify every returned correction against H c = s (mod 2):
              </p>
              <CodeBlock
                code={`import numpy as np
from qector_decoder_v3 import BlossomDecoder, BpOsdDecoder, generate_parity_check_matrix

def decode_routed(check_to_qubits, n_qubits, syndrome, error_rate=0.05):
    syn = np.asarray(syndrome, dtype=np.uint8).ravel()
    H = np.asarray(generate_parity_check_matrix(check_to_qubits, n_qubits), dtype=np.uint8)

    # Structural guard: graphlike means every qubit is in at most two checks.
    if int(H.sum(axis=0).max()) <= 2:
        decoder = BlossomDecoder(check_to_qubits, n_qubits=n_qubits)
    else:
        decoder = BpOsdDecoder(H, error_rate=error_rate)   # hyperedges route to BP-OSD

    correction = np.asarray(decoder.decode(syn), dtype=np.uint8)
    if not np.array_equal((H @ correction) % 2, syn):
        raise RuntimeError("correction is not syndrome-faithful")
    return correction`}
                language="python"
                filename="structural_routing.py"
              />
            </div>

            <div>
               <h3 className="text-primary font-semibold text-base mb-3">6. Verified Fallback Pattern</h3>
               <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                 A fallback is safe only when each candidate is checked against the same parity-check matrix. The following pattern is for graphlike inputs: it uses the stable Union-Find and Blossom classes, refuses a matrix with a hyperedge, and fails closed if a candidate is not syndrome-faithful:
              </p>
              <CodeBlock
                 code={`import numpy as np\nfrom qector_decoder_v3 import FastUnionFindDecoder, UnionFindDecoder, BlossomDecoder\n\ndef faithful_decode(check_to_qubits, n_qubits, syndrome):\n    syndrome = np.asarray(syndrome, dtype=np.uint8).ravel()\n    matrix = np.zeros((len(check_to_qubits), n_qubits), dtype=np.uint8)\n    for check, qubits in enumerate(check_to_qubits):\n        matrix[check, qubits] = 1\n    if int(matrix.sum(axis=0).max()) > 2:\n        raise ValueError("not graphlike: route this matrix to BP-OSD")\n\n    for decoder_type in (FastUnionFindDecoder, UnionFindDecoder, BlossomDecoder):\n        try:\n            correction = np.asarray(\n                decoder_type(check_to_qubits, n_qubits=n_qubits).decode(syndrome),\n                dtype=np.uint8,\n            )\n            if np.array_equal((matrix @ correction.astype(int)) % 2, syndrome):\n                return correction, decoder_type.__name__\n        except Exception:\n            continue\n    raise RuntimeError("No syndrome-faithful decoder result")`}
                language="python"
                filename="cascade_decode.py"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SEO
        title="User Manual · QECTOR"
        description="Complete user manual for QECTOR Decoder v3. Installation, configuration, decoder selection, validation, and troubleshooting."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          'name': 'How to Install and Run QECTOR Decoder v3',
               'description': 'Step-by-step instructions to install QECTOR, verify a syndrome-faithful decode, select a decoder, and review evidence boundaries.',
          'step': [
            {
              '@type': 'HowToStep',
              'name': 'Install the package',
              'text': 'Run pip install qector-decoder-v3 in your Python terminal to install the Rust core binary wheels.'
            },
            {
              '@type': 'HowToStep',
              'name': 'Verify the installation',
               'text': 'Verify the installation with python -c "import qector_decoder_v3 as qd; print(qd.__version__)" and a small syndrome-faithfulness check.'
            },
            {
              '@type': 'HowToStep',
               'name': 'Review evidence boundaries',
               'text': 'Read the v1.0.0 reference manual and record code, noise model, decoder configuration, seed, environment, and artifact metadata before making a local measurement.'
            }
          ]
        }}
      />

      {/* Hero */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="eyebrow-pill mb-6">
             15 backend families powering 17 decoder configurations · GPU Batch · Stim · Sinter · Qiskit
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"><NeuralReveal text="User Manual" className="text-4xl md:text-6xl font-extrabold" /></h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
             Complete guide to QECTOR Decoder v3: installation, decoder selection,
             local measurements, diagnostics, and ecosystem integration.
          </p>
        </div>
      </section>

      {/* Docs Grid Sidebar layout */}
      <section className="section-padding pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav aria-label="Manual sections" className="sticky top-24 space-y-1 bg-surface/10 p-2 rounded-xl border border-gridline/50">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    aria-current={activeSection === section.id ? 'true' : undefined}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                      activeSection === section.id
                        ? 'bg-cyan-300/10 text-cyan-300 border border-cyan-300/20'
                        : 'text-secondary hover:text-primary hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {section.icon}
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Display */}
            <div className="lg:col-span-3">
              <div className="card-surface bg-surface/20 min-h-[500px]">
                <h2 className="text-2xl font-bold mb-6 text-primary border-b border-gridline pb-4 flex items-center gap-2">
                  {sections.find((s) => s.id === activeSection)?.title.substring(3)}
                </h2>
                <div className="transition-all duration-300">{renderContent()}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Helpers for icon placement to prevent compilation issues
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929a10 10 0 0 0-14.142 0M12 3v3m0 12v3M3 12h3m12 0h3" opacity="0.5" />
    </svg>
  );
}

function ChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0 1 3 18.375v-5.25ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125v-9.75ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.936 6.936 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}
