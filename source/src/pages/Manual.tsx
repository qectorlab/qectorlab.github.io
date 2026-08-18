import React, { useState } from 'react';
import { SEO, JsonLd } from '../lib/seo';
import CodeBlock from '../components/CodeBlock';
import TerminalEmulator from '../components/TerminalEmulator';
import NeuralReveal from '../components/NeuralReveal';
import { Info, HelpCircle, Cpu, ShieldCheck, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

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
    { id: 'package-reference', title: '8. Package Reference (v1.0.0)', icon: <BookOpen className="w-4 h-4" /> },
  ];

  // Render individual sections beautifully
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <p className="text-secondary text-base leading-relaxed">
              QECTOR Decoder v3 is a production-grade Python library for quantum error correction (QEC) decoding. v1.0.0 is the first stable release: it provides 15+ decoder configurations and helpers integrated into a high-performance compiled Rust core with a plug-and-play Python API.
            </p>
            <div className="p-4 bg-cyan-300/5 border border-cyan-300/10 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
              <p className="text-secondary text-sm leading-relaxed">
                <strong className="text-primary">Ecosystem Native:</strong> Swappable backend design. You can easily plug QECTOR into Stim, PyMatching, Sinter, and Qiskit pipelines with minimal API modifications: v1.0.0 registers Sinter and qiskit-qec entry points so <code className="text-cyan-300">sinter.collect()</code> works with no <code className="text-cyan-300">custom_decoders=</code>.
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
                  <p className="text-muted-foreground text-xs leading-relaxed">15+ decoder configurations from exact Blossom MWPM to Belief-Matching, BP-OSD, and GPU batch decoding.</p>
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
              QECTOR ships as pre-compiled binary wheels on PyPI. Installing requires python and pip.
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
                <div className="p-3 border-b border-gridline flex justify-between">
                  <span className="text-muted-foreground">Python</span>
                  <span className="text-primary">3.9, 3.10, 3.11, 3.12, 3.13 (64-bit)</span>
                </div>
                <div className="p-3 border-b border-gridline flex justify-between">
                  <span className="text-muted-foreground">Operating System</span>
                   <span className="text-primary">Linux, macOS, Windows (see current PyPI wheel metadata)</span>
                </div>
                <div className="p-3 flex justify-between">
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
               Below is a minimal package-only example: create a rotated surface code, generate a syndrome, and verify a Blossom correction against the parity-check matrix.
            </p>

            <CodeBlock
              filename="surface_code_decode.py"
              language="python"
               code={`import numpy as np
import qector_decoder_v3 as qector

# Build a small code and inject one bit error.
code = qector.codes.rotated_surface_code(3)
error = np.zeros(code.n_qubits, dtype=np.uint8)
error[4] = 1
syndrome = code.syndrome(error)

# Decode with the graphlike Blossom backend.
correction = qector.BlossomDecoder(
    code.check_to_qubits,
    n_qubits=code.n_qubits,
).decode(syndrome)

# The syndrome contract is H c = s (mod 2).
matrix = np.asarray(code.parity_check_matrix(), dtype=np.uint8)
assert np.array_equal((matrix @ correction.astype(int)) % 2, syndrome)
print("Syndrome-faithful correction")`}
            />
          </div>
        );

      case 'decoders':
        return (
          <div className="space-y-6">
            <p className="text-secondary text-sm leading-relaxed">
              QECTOR includes 15+ decoder configurations categorized into stable, workload-sensitive, and experimental/research tiers. Choose based on code type and speed/accuracy tradeoffs:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gridline text-left text-sm rounded-xl overflow-hidden">
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
                    { name: 'Union-Find', target: 'Large Surface', speed: 'Near-linear O(N)', accuracy: 'Approximate', tier: 'Production' },
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
                          row.tier === 'Production'
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
              Detailed constructor configuration arguments for QECTOR's primary decoders:
            </p>

            <div>
              <h3 className="text-cyan-300 font-semibold text-sm mb-2">BlossomDecoder</h3>
              <div className="border border-gridline bg-void/30 rounded-xl overflow-hidden divide-y divide-gridline text-sm">
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-mono text-primary min-w-[120px]">adaptive_k</span>
                  <span className="text-secondary text-xs flex-1">`bool` (Default: `True`). Enable union-find matching pre-filtering to minimize match graph sizing.</span>
                </div>
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-mono text-primary min-w-[120px]">timeout</span>
                  <span className="text-secondary text-xs flex-1">`float` (Default: `None`). Maximum time (in seconds) allowed to resolve a single syndrome.</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-cyan-300 font-semibold text-sm mb-2">BeliefMatchingDecoder</h3>
              <div className="border border-gridline bg-void/30 rounded-xl overflow-hidden divide-y divide-gridline text-sm">
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-mono text-primary min-w-[120px]">bp_iters</span>
                  <span className="text-secondary text-xs flex-1">`int` (Default: `30`). Maximum number of belief propagation iterations. Higher Iterations improve syndrome accuracy.</span>
                </div>
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-mono text-primary min-w-[120px]">max_paths</span>
                  <span className="text-secondary text-xs flex-1">`int` (Default: `10`). Maximum number of alternative paths generated for matching reweighting calculations.</span>
                </div>
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-mono text-primary min-w-[120px]">bp_method</span>
                  <span className="text-secondary text-xs flex-1">`str` (Default: `"product_sum"`). Choice of BP update method. Options: `"product_sum"`, `"minimum_sum"`.</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-cyan-300 font-semibold text-sm mb-2">GpuBatchDecoder</h3>
              <div className="border border-gridline bg-void/30 rounded-xl overflow-hidden divide-y divide-gridline text-sm">
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-mono text-primary min-w-[120px]">backend</span>
                  <span className="text-secondary text-xs flex-1">`str` (Default: `"cuda"`). Choose GPU compilation framework. Options: `"cuda"`, `"opencl"`.</span>
                </div>
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-mono text-primary min-w-[120px]">batch_size</span>
                  <span className="text-secondary text-xs flex-1">`int` (Default: `1000`). Number of parallel syndromes transferred to and calculated in the GPU memory space.</span>
                </div>
              </div>
            </div>
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
                  <span>Issue: ImportError when importing `qector`</span>
                </div>
                <p className="text-secondary text-xs leading-relaxed">
                   <strong>Fix:</strong> Ensure your Python architecture matches the wheel and reinstall with `python -m pip install --force-reinstall qector-decoder-v3`.
                </p>
              </div>

              <div className="p-4 bg-gold-400/5 border border-gold-400/20 rounded-xl">
                <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm mb-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Issue: GPU / CUDA is not detected</span>
                </div>
                <p className="text-secondary text-xs leading-relaxed">
                  <strong>Fix:</strong> Verify drivers by typing `nvidia-smi` in terminal. Ensure CUDA Toolkit 11.8 or higher is installed and environment variable `CUDA_PATH` or `LD_LIBRARY_PATH` points to the CUDA install folder.
                </p>
              </div>

              <div className="p-4 bg-red-400/5 border border-red-400/20 rounded-xl">
                <div className="flex items-center gap-2 text-red-400 font-semibold text-sm mb-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Issue: Out Of Memory (OOM) on GPU batching</span>
                </div>
                <p className="text-secondary text-xs leading-relaxed">
                  <strong>Fix:</strong> Lower the `batch_size` argument in your `GpuBatchDecoder` instantiation. For exceptionally large code distances (d &gt; 15), prefer the linear-scaling `UnionFindDecoder` which reduces memory demands.
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
                <p className="text-muted-foreground text-xs">Version: 1.0.0 · PyPI: qector-decoder-v3 · Backend: Rust + PyO3</p>
              </div>
              <a
                href="/docs/reference.md"
                target="_blank"
                download="QECTOR Decoder v3 - Reference (package only).md"
                className="btn-cyan text-xs py-2 px-4"
              >
                Download Reference (.md)
              </a>
            </div>

            <div>
              <h3 className="text-primary font-semibold text-base mb-3">1. Installation &amp; Platforms</h3>
              <CodeBlock
                 code={`pip install qector-decoder-v3==1.0.0\npip install "qector-decoder-v3[stim]"    # Stim / Sinter / PyMatching / LDPC ecosystem\npip install "qector-decoder-v3[bench]"   # local measurement tools\npip install "qector-decoder-v3[all]"     # optional full environment`}
                language="bash"
                filename="terminal"
              />
              <div className="mt-3 border border-gridline bg-void/30 rounded-xl overflow-hidden text-xs">
                <div className="p-2.5 border-b border-gridline flex justify-between"><span className="text-muted-foreground">Python</span><span className="text-primary font-mono">3.9 – 3.13</span></div>
                <div className="p-2.5 border-b border-gridline flex justify-between"><span className="text-muted-foreground">Platforms</span><span className="text-primary">Linux x86_64 (manylinux), Windows x64, macOS arm64</span></div>
                <div className="p-2.5 border-b border-gridline flex justify-between"><span className="text-muted-foreground">License</span><span className="text-primary">Source-available (Free academic / non-commercial)</span></div>
                <div className="p-2.5 border-b border-gridline flex justify-between"><span className="text-muted-foreground">Startup Notice</span><span className="text-primary font-mono">Suppressed with QECTOR_SILENT=1</span></div>
                <div className="p-2.5 flex justify-between"><span className="text-muted-foreground">Licence Env</span><span className="text-primary font-mono">QECTOR_LICENSE (Ed25519 token)</span></div>
              </div>
            </div>

            <div>
              <h3 className="text-primary font-semibold text-base mb-3">2. Core Architecture</h3>
              <ul className="list-disc list-inside space-y-1.5 text-secondary text-xs leading-relaxed">
                <li><strong>Rust Core (compiled extension):</strong> Matching, UF, batch CPU/GPU algorithms.</li>
                <li><strong>Python Surface:</strong> Clean API, Stim/Sinter compat, belief/GNN layers, licensing.</li>
                <li><strong>Zero-copy NumPy:</strong> Direct memory access; GIL-free parallel decoding paths.</li>
                <li><strong>Version Symbol:</strong> <code className="text-cyan-300">qector_decoder_v3.__version__ == "1.0.0"</code></li>
              </ul>
            </div>

            <div>
              <h3 className="text-primary font-semibold text-base mb-3">3. Decoder Families &amp; Incidence Rules</h3>
              <p className="text-muted-foreground text-xs mb-3">
                <strong className="text-cyan-300">Graph-like rule (UF family):</strong> Every qubit must participate in at most two checks (participation &le; 2). Matrices violating this raise a clear error (<code className="text-red-400">-32602</code>). <code className="text-cyan-300">BlossomDecoder</code>, <code className="text-cyan-300">SparseBlossomDecoder</code>, and <code className="text-cyan-300">BpOsdDecoder</code> accept general hyperedge codes.
              </p>
              <div className="border border-gridline bg-void/30 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-4 p-2.5 font-bold border-b border-gridline bg-surface/30">
                  <span>Class</span><span>Best for</span><span>Status</span><span>Graph-like?</span>
                </div>
                <div className="grid grid-cols-4 p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">UnionFindDecoder</span><span>Low-latency approximate</span><span>Stable</span><span>Yes (participation &le; 2)</span></div>
                <div className="grid grid-cols-4 p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">FastUnionFindDecoder</span><span>Faster UF hot path</span><span>Stable</span><span>Yes</span></div>
                <div className="grid grid-cols-4 p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">BlossomDecoder</span><span>Exact MWPM</span><span>Stable</span><span>No (Hyperedge OK)</span></div>
                <div className="grid grid-cols-4 p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">SparseBlossomDecoder</span><span>Near-optimal matching</span><span>Experimental</span><span>Prefer graph-like</span></div>
                <div className="grid grid-cols-4 p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">BeliefMatching</span><span>Correlated-noise accuracy</span><span>Research</span><span>Prefer graph-like</span></div>
                <div className="grid grid-cols-4 p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">BpOsdDecoder</span><span>LDPC / qLDPC</span><span>Experimental</span><span>No (Hyperedge OK)</span></div>
                <div className="grid grid-cols-4 p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">BatchDecoder</span><span>High-throughput CPU batch</span><span>Stable</span><span>Yes for UF batch</span></div>
                <div className="grid grid-cols-4 p-2.5 border-b border-gridline"><span className="font-mono text-cyan-300">CUDABatchDecoder</span><span>GPU batch (NVIDIA)</span><span>Runtime-dependent</span><span>N/A</span></div>
                <div className="grid grid-cols-4 p-2.5"><span className="font-mono text-cyan-300">AutoDecoder</span><span>7-tier self-debugging fallback</span><span>Stable</span><span>N/A</span></div>
              </div>
            </div>

            <div>
              <h3 className="text-primary font-semibold text-base mb-3">4. Code Generators</h3>
              <CodeBlock
                 code={`from qector_decoder_v3 import (\n    generate_repetition_code_checks,  # (checks, n_qubits)\n    generate_ring_code_checks,        # (checks, n_qubits)\n    generate_surface_code_checks,     # surface-code checks\n)`}
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
                 For general matrices, use the decoder family documented for that workload and verify every returned correction against H c = s (mod 2):
              </p>
              <CodeBlock
                code={`import numpy as np\nfrom qector_decoder_v3 import BlossomDecoder, SparseBlossomDecoder, BpOsdDecoder\n\ndef decode_hyperedge(checks, n_qubits, syndrome, kind="Blossom", **opts):\n    syn = np.asarray(syndrome, dtype=np.uint8).ravel()\n    if kind in ("Blossom", "blossom"):\n        return BlossomDecoder(checks, n_qubits).decode(syn)\n    if kind in ("SparseBlossom", "sparse_blossom"):\n        return SparseBlossomDecoder(checks, n_qubits).decode(syn)\n    if kind.lower() in ("bposd", "bp_osd"):\n        H = np.zeros((len(checks), n_qubits), dtype=np.uint8)\n        for i, c in enumerate(checks):\n            for q in c: H[i, q] ^= 1\n        return BpOsdDecoder(H, error_rate=opts.get("error_rate", 0.05)).decode(syn)\n    raise ValueError(f"unsupported kind: {kind}")`}
                language="python"
                filename="hyperedge_workaround.py"
              />
            </div>

            <div>
               <h3 className="text-primary font-semibold text-base mb-3">6. Verified Fallback Pattern</h3>
               <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                 A fallback is safe only when each candidate is checked against the same parity-check matrix. The following pattern uses the stable Union-Find and Blossom classes and fails closed if a candidate is not syndrome-faithful:
              </p>
              <CodeBlock
                 code={`import numpy as np\nfrom qector_decoder_v3 import FastUnionFindDecoder, UnionFindDecoder, BlossomDecoder\n\ndef faithful_decode(check_to_qubits, n_qubits, syndrome):\n    syndrome = np.asarray(syndrome, dtype=np.uint8).ravel()\n    matrix = np.zeros((len(check_to_qubits), n_qubits), dtype=np.uint8)\n    for check, qubits in enumerate(check_to_qubits):\n        matrix[check, qubits] = 1\n\n    for decoder_type in (FastUnionFindDecoder, UnionFindDecoder, BlossomDecoder):\n        try:\n            correction = np.asarray(\n                decoder_type(check_to_qubits, n_qubits=n_qubits).decode(syndrome),\n                dtype=np.uint8,\n            )\n            if np.array_equal((matrix @ correction.astype(int)) % 2, syndrome):\n                return correction, decoder_type.__name__\n        except Exception:\n            continue\n    raise RuntimeError("No syndrome-faithful decoder result")`}
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
             15 Backend Families · GPU Batch · Stim · Sinter · Qiskit
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
