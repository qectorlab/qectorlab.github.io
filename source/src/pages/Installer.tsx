import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import { usePyPIVersion } from '../hooks/usePyPIVersion';

export default function Installer() {
  const { version: pypiVersion } = usePyPIVersion();
  return (
    <>
      <SEO title="Installation · QECTOR" description="Install QECTOR Decoder v3 on Linux, macOS, or Windows. PyPI pip install with binary wheels." />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            PyPI Binary Wheels · AIO Installer · CUDA + OpenCL Optional
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"><NeuralReveal text="Installation" className="text-4xl md:text-6xl font-extrabold" /></h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            QECTOR Decoder v3 ships as a Rust-compiled Python wheel (v1.0.0: 15 binary wheels for CPython 3.9–3.13,
            no sdist).
            One command on <span className="text-cyan-300 font-semibold">Linux x86_64, macOS ARM64, and Windows amd64</span>.
            GPU backends optional.
          </p>
          <div className="inline-block px-6 py-3 bg-void border border-gridline rounded-xl font-mono text-sm text-cyan-300">
            pip install qector-decoder-v3
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Requirements */}
          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">System Requirements</h2>
            <ul className="space-y-2 text-secondary text-sm list-disc pl-5">
              <li>Python 3.9, 3.10, 3.11, 3.12, or 3.13</li>
              <li>64-bit operating system (Linux, macOS ARM64/x86, Windows)</li>
               <li>Stim/Sinter/PyMatching are optional extras; install <code className="text-cyan-300 font-mono text-xs">qector-decoder-v3[stim]</code> when needed.</li>
               <li>GPU paths are optional and environment-dependent; follow the package release documentation for supported drivers and extras.</li>
            </ul>
          </div>

          {/* Quick Install */}
          <div className="card-surface border-cyan-300/20">
            <h2 className="text-xl font-bold mb-4 text-cyan-300">Quick Install (Recommended)</h2>
            <div className="p-4 bg-void rounded-xl font-mono text-sm text-muted-foreground">
              <div>pip install qector-decoder-v3=={pypiVersion}</div>
            </div>
            <p className="text-secondary text-sm mt-3">
              This installs the latest stable release with pre-compiled binary wheels.
            </p>
            <p className="text-secondary text-xs mt-2">
               Optional extras: <code className="text-cyan-300 font-mono text-xs">[stim]</code> (Stim/Sinter/PyMatching), <code className="text-cyan-300 font-mono text-xs">[bench]</code> (local measurement tools), <code className="text-cyan-300 font-mono text-xs">[all]</code> (full environment).
            </p>
          </div>

          {/* Verify */}
          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Verify Installation</h2>
            <div className="p-4 bg-void rounded-xl font-mono text-sm text-muted-foreground space-y-1">
              <div>python -c "import qector_decoder_v3; print(qector_decoder_v3.__version__)"</div>
              <div className="text-green-400 font-semibold"># Should print: {pypiVersion}</div>
              <div className="mt-2">qector-doctor</div>
              <div className="text-green-400"># 15-check environment diagnostic; reports PASS / WARN / FAIL per check</div>
              <div className="mt-2">python -c "from qector_decoder_v3 import BlossomDecoder, UnionFindDecoder; print('QECTOR OK')"</div>
              <div className="text-green-400"># Should print: QECTOR OK</div>
            </div>
          </div>

          {/* Platform-specific */}
          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Platform-Specific Notes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-primary font-semibold text-sm mb-2">Linux</h3>
                 <p className="text-secondary text-sm">Use the current PyPI wheel and the release documentation for supported Linux platforms and runtime dependencies.</p>
              </div>
              <div>
                <h3 className="text-primary font-semibold text-sm mb-2">macOS</h3>
                 <p className="text-secondary text-sm">Use the current PyPI wheel and the release documentation for supported macOS architectures and minimum version.</p>
              </div>
              <div>
                <h3 className="text-primary font-semibold text-sm mb-2">Windows</h3>
                 <p className="text-secondary text-sm">Use the current PyPI wheel for supported Windows Python and architecture combinations. GPU availability remains driver- and device-dependent.</p>
              </div>
            </div>
          </div>

          {/* GPU Setup */}
           <div className="card-surface">
             <h2 className="text-xl font-bold mb-4">Optional GPU Workflows</h2>
             <p className="text-secondary text-sm mb-3">GPU availability depends on the installed wheel, optional dependencies, operating system, driver, and device. Use the extras and support matrix documented by the package release rather than assuming a GPU backend is available.</p>
             <div className="p-4 bg-void rounded-xl font-mono text-sm text-muted-foreground space-y-1">
               <div className="text-cyan-300"># Optional full environment</div>
               <div>pip install "qector-decoder-v3[all]"</div>
               <div className="mt-2 text-cyan-300"># Verify the installed package API and environment</div>
               <div>qector-doctor</div>
               <div className="text-green-400"># Read the diagnostic&apos;s backend-specific PASS / WARN / FAIL output</div>
             </div>
          </div>

          {/* Troubleshooting */}
          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Troubleshooting</h2>
            <div className="space-y-3 text-secondary text-sm">
              <p><strong className="text-primary">ImportError on macOS:</strong> Ensure you have Python 3.9+ from python.org or Homebrew. The system Python may not work.</p>
              <p><strong className="text-primary">GPU not detected:</strong> Verify CUDA installation with <code className="text-cyan-300 font-mono">nvidia-smi</code>. Ensure CUDA 11.8+ is in PATH.</p>
              <p><strong className="text-primary">Slow import:</strong> First import compiles Rust extensions. Subsequent imports are fast.</p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
