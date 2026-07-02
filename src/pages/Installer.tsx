import { SEO } from '../lib/seo';

export default function Installer() {
  return (
    <>
      <SEO title="Installation · QECTOR" description="Install QECTOR Decoder v3 on Linux, macOS, or Windows. PyPI pip install with binary wheels." />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            PyPI Binary Wheels · AIO Installer · CUDA + OpenCL Optional
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">Installation</h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            QECTOR Decoder v3 ships as a Rust-compiled Python wheel.
            One command on <span className="text-cyan-300 font-semibold">Linux, macOS ARM64/x86, and Windows</span>.
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
              <li>Stim (automatically installed): <code className="text-cyan-300 font-mono text-xs">pip install stim</code></li>
              <li>For GPU batch decoding: CUDA 11.8+ or OpenCL 2.0+ capable GPU</li>
            </ul>
          </div>

          {/* Quick Install */}
          <div className="card-surface border-cyan-300/20">
            <h2 className="text-xl font-bold mb-4 text-cyan-300">Quick Install (Recommended)</h2>
            <div className="p-4 bg-void rounded-xl font-mono text-sm text-muted-foreground">
              <div>pip install qector-decoder-v3</div>
            </div>
            <p className="text-secondary text-sm mt-3">
              This installs the latest stable release with pre-compiled binary wheels.
            </p>
          </div>

          {/* Verify */}
          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Verify Installation</h2>
            <div className="p-4 bg-void rounded-xl font-mono text-sm text-muted-foreground space-y-1">
              <div>python -c "import qector; print(qector.__version__)"</div>
              <div className="text-green-400 font-semibold"># Should print: 0.5.8</div>
              <div className="mt-2">python -m qector.validate -quick</div>
              <div className="text-green-400"># Should print: QECTOR OK</div>
            </div>
          </div>

          {/* Platform-specific */}
          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Platform-Specific Notes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-primary font-semibold text-sm mb-2">Linux</h3>
                <p className="text-secondary text-sm">Manylinux2014 wheels provided. Tested on Ubuntu 20.04+, Debian 11+, RHEL 8+.</p>
              </div>
              <div>
                <h3 className="text-primary font-semibold text-sm mb-2">macOS</h3>
                <p className="text-secondary text-sm">Universal2 wheels for both Apple Silicon (ARM64) and Intel (x86_64). macOS 12+ required.</p>
              </div>
              <div>
                <h3 className="text-primary font-semibold text-sm mb-2">Windows</h3>
                <p className="text-secondary text-sm">Windows 10/11 x64 wheels. GPU batch decoding requires NVIDIA GPU with CUDA 11.8+.</p>
              </div>
            </div>
          </div>

          {/* GPU Setup */}
          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">GPU Batch Decoding Setup</h2>
            <div className="p-4 bg-void rounded-xl font-mono text-sm text-muted-foreground space-y-1">
              <div className="text-cyan-300"># CUDA backend (requires NVIDIA GPU)</div>
              <div>pip install qector-decoder-v3[cuda]</div>
              <div className="mt-2 text-cyan-300"># OpenCL backend (broader compatibility)</div>
              <div>pip install qector-decoder-v3[opencl]</div>
              <div className="mt-2 text-cyan-300"># Verify GPU detection</div>
              <div>python -m qector.validate -gpu</div>
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
