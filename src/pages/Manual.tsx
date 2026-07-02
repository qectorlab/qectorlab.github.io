import React, { useState } from 'react';
import { SEO, JsonLd } from '../lib/seo';
import CodeBlock from '../components/CodeBlock';
import TerminalEmulator from '../components/TerminalEmulator';
import { Info, HelpCircle, Cpu, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

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
    { id: 'benchmarking', title: '5. Running Benchmarks', icon: <ChartIcon className="w-4 h-4" /> },
    { id: 'configuration', title: '6. Configuration', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'troubleshooting', title: '7. Troubleshooting', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  // Render individual sections beautifully
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <p className="text-secondary text-base leading-relaxed">
              QECTOR Decoder v3 is a production-grade Python library for quantum error correction (QEC) decoding. It provides ten battle-tested algorithms integrated into a high-performance compiled Rust core with a plug-and-play Python API.
            </p>
            <div className="p-4 bg-cyan-300/5 border border-cyan-300/10 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
              <p className="text-secondary text-sm leading-relaxed">
                <strong className="text-primary">Ecosystem Native:</strong> Swappable backend design. You can easily plug QECTOR into Stim, PyMatching, Sinter, and Qiskit pipelines with minimal API modifications.
              </p>
            </div>
            <div>
              <h3 className="text-primary font-semibold text-lg mb-3">Key Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-void border border-gridline rounded-xl">
                  <h4 className="text-cyan-300 font-semibold text-sm mb-1">Exact MWPM Parity</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">Matches PyMatching LER exact calculations through distance 15, verified via cross-simulation.</p>
                </div>
                <div className="p-4 bg-void border border-gridline rounded-xl">
                  <h4 className="text-cyan-300 font-semibold text-sm mb-1">Measurable Accuracy Gains</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">+35.7% logical error rate reduction at distance 5 with Belief-Matching under depolarizing noise.</p>
                </div>
                <div className="p-4 bg-void border border-gridline rounded-xl">
                  <h4 className="text-cyan-300 font-semibold text-sm mb-1">Rust compiled speed</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">Extremely fast C-bindings, zero-copy NumPy inputs, multi-threaded CPU parallel paths.</p>
                </div>
                <div className="p-4 bg-void border border-gridline rounded-xl">
                  <h4 className="text-cyan-300 font-semibold text-sm mb-1">GPU Batch Acceleration</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">Native CUDA and OpenCL implementations for high-throughput cloud decoding pipelines.</p>
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
                  <span className="text-primary">Linux (manylinux2014), macOS (Apple Silicon / Intel), Windows 10/11</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-muted-foreground">GPU Requirements (Optional)</span>
                  <span className="text-primary">NVIDIA GPU with CUDA 11.8+ OR OpenCL 2.0+ platform drivers</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-primary font-semibold text-sm mb-2">Install Optional GPU Backends</h3>
              <p className="text-secondary text-xs mb-3">Install appropriate packages to compile/enable GPU paths:</p>
              <CodeBlock
                code={`# For CUDA support
pip install qector-decoder-v3[cuda]

# For OpenCL support
pip install qector-decoder-v3[opencl]`}
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
              Below is an example showing how to create a rotated surface code in Stim, generate a syndrome, and decode using the default Blossom (MWPM) decoder.
            </p>

            <CodeBlock
              filename="surface_code_decode.py"
              language="python"
              code={`import qector
import numpy as np
from stim import Circuit

# 1. Generate a Stim surface code memory experiment
circuit = Circuit.generated(
    "surface_code:rotated_memory_x",
    distance=5,
    rounds=5,
    after_clifford_depolarization=0.001
)

# 2. Extract the Detector Error Model (DEM) and sample a syndrome
dem = circuit.detector_error_model()
sampler = circuit.compile_detector_sampler()
syndromes, logical_observables = sampler.sample(shots=1, separate_observables=True)

# 3. Create the decoder and predict errors
decoder = qector.BlossomDecoder(dem)
prediction = decoder.decode(syndromes[0])

# Compare predicted logical flip to actual logical observables
is_correct = np.array_equal(prediction, logical_observables[0])
print(f"Decoded accurately: {is_correct}")`}
            />

            <div>
              <h3 className="text-primary font-semibold text-sm mb-2">Using Belief-Matching</h3>
              <p className="text-secondary text-xs mb-2">
                Simply swap the class to `BeliefMatchingDecoder` to achieve 35.7% accuracy gains:
              </p>
              <CodeBlock
                filename="belief_matching.py"
                language="python"
                code={`# Instantiate the Belief-Matching decoder instead
decoder = qector.BeliefMatchingDecoder(dem, bp_iters=30)
prediction = decoder.decode(syndrome)`}
              />
            </div>
          </div>
        );

      case 'decoders':
        return (
          <div className="space-y-6">
            <p className="text-secondary text-sm leading-relaxed">
              QECTOR includes ten decoders categorized into production-grade and research-grade algorithms. Choose based on code type and speed/accuracy tradeoffs:
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
                    { name: 'Blossom (MWPM)', target: 'CSS, Surface', speed: 'Fast (UF pre-match)', accuracy: 'Exact Optimal', tier: 'Production' },
                    { name: 'Belief-Matching', target: 'CSS, Surface', speed: 'Moderate', accuracy: 'Maximum (+35.7%)', tier: 'Production' },
                    { name: 'BP-OSD', target: 'qLDPC, LDPC', speed: 'Moderate', accuracy: 'Optimal for qLDPC', tier: 'Production' },
                    { name: 'Union-Find', target: 'Large Surface', speed: 'Near-linear O(N)', accuracy: 'Approximate', tier: 'Production' },
                    { name: 'GPU Batch', target: 'Any (Batch)', speed: 'High Throughput', accuracy: 'Identical to CPU', tier: 'Production' },
                    { name: 'EBP / Restart Belief', target: 'Degenerate LDPC', speed: 'Iterative', accuracy: 'High', tier: 'Research' },
                    { name: 'KAT / Astra GNN', target: 'Surface, Research', speed: 'Slow (Offline)', accuracy: 'Neural-enhanced', tier: 'Research' },
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

      case 'benchmarking':
        return (
          <div className="space-y-6">
            <p className="text-secondary text-sm leading-relaxed">
              All published QECTOR benchmarks are fully reproducible. You can run benchmarks locally to verify exact error rate thresholds and performance.
            </p>

            <div>
              <h3 className="text-primary font-semibold text-sm mb-2">Verify All Tests</h3>
              <CodeBlock
                code="python -m qector.validate -all"
                filename="terminal"
                language="bash"
              />
            </div>

            <div>
              <h3 className="text-primary font-semibold text-sm mb-2">Head-to-head Benchmarking vs PyMatching</h3>
              <p className="text-secondary text-xs mb-2">
                Simulates rotated surface code distance 5 and matches corrections:
              </p>
              <CodeBlock
                code="python -m qector.benchmark -vs-pymatching -distance 5 -shots 100000"
                filename="terminal"
                language="bash"
              />
            </div>

            <div>
              <h3 className="text-primary font-semibold text-sm mb-2">Benchmarking GPU Batch Througput</h3>
              <CodeBlock
                code="python -m qector.benchmark -gpu -batch-size 1000 -distance 7"
                filename="terminal"
                language="bash"
              />
            </div>

            <div>
              <h3 className="text-primary font-semibold text-sm mb-2">Interactive Sandbox CLI</h3>
              <p className="text-secondary text-xs mb-3">
                Try running QECTOR commands directly in this interactive sandbox shell to see realistic tool executions:
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
                  <strong>Fix:</strong> Ensure your Python architecture matches 64-bit and is python 3.9–3.13. If using macOS, verify you are not using the default system Python. Run `pip install -force-reinstall qector-decoder-v3` to rebuild binary wheels.
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

      default:
        return null;
    }
  };

  return (
    <>
      <SEO
        title="User Manual · QECTOR"
        description="Complete user manual for QECTOR Decoder v3. Installation, configuration, decoder selection, benchmarking, and troubleshooting."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          'name': 'How to Install and Run QECTOR Decoder v3',
          'description': 'Step-by-step instructions to install the QECTOR QEC decoder package, run syndromic validation tests, and execute benchmarks.',
          'step': [
            {
              '@type': 'HowToStep',
              'name': 'Install the package',
              'text': 'Run pip install qector-decoder-v3 in your Python terminal to install the Rust core binary wheels.'
            },
            {
              '@type': 'HowToStep',
              'name': 'Verify the installation',
              'text': 'Verify detection by running the command python -m qector.validate -quick to execute validation suites.'
            },
            {
              '@type': 'HowToStep',
              'name': 'Run benchmarks',
              'text': 'Run the command python -m qector.benchmark -vs-pymatching -distance 5 -shots 100000 to benchmark LER metrics against PyMatching.'
            }
          ]
        }}
      />

      {/* Hero */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            10 Decoders · GPU Batch · Stim · Sinter · Qiskit
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">User Manual</h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Complete guide to QECTOR Decoder v3 — installation, all ten decoders,
            GPU batch workflows, benchmarking, diagnostics, and ecosystem integration.
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
