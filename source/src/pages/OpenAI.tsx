import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import AlgorithmCard from '../components/AlgorithmCard';
import EvidenceBlock from '../components/EvidenceBlock';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MCP_TOOLS_LIBRARY = 8;

export default function OpenAI() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionsRef.current.filter(Boolean).forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 85%', once: true },
          }
        );
      });
    });
    return () => {
      ctx.revert();
    };
  }, []);

  const addRef = (el: HTMLDivElement | null, index: number) => {
    if (el) sectionsRef.current[index] = el;
  };

  return (
    <>
      <SEO
        title="QECTOR for OpenAI & Codex · Quantum Error Correction via MCP"
        description="Connect QECTOR Decoder v3 to OpenAI Codex and any MCP-compatible client: local stdio JSON-RPC decoding tools, first-boot verification, and zero-egress syndrome handling."
      />

      {/* Hero */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-400/10 border border-gold-400/20 rounded-full text-xs font-semibold text-gold-400 uppercase tracking-wider mb-6">
            OpenAI / Codex · local stdio · backend qector_decoder_v3 1.0.0
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="QECTOR for OpenAI & Codex" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            First-class quantum error correction for{' '}
            <span className="text-cyan-300 font-semibold">OpenAI Codex</span> and every MCP-compatible
            client. A local Model Context Protocol server over stdio JSON-RPC 2.0 connects your agent
            directly to the Rust-core decoder: circuits, parity matrices, and syndromes never leave your machine.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://pypi.org/project/qector-decoder-v3/" target="_blank" rel="noopener noreferrer" className="btn-cyan">
              Get the wheel
            </a>
            <Link to="/docs" className="btn-outline">
              Documentation
            </Link>
            <Link to="/evidence" className="btn-outline">
              Evidence
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-6xl mx-auto space-y-14">

          {/* Capability matrix */}
          <div ref={(el) => addRef(el, 0)} className="card-surface space-y-5">
            <h2 className="text-2xl font-bold">Capability Matrix</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Each QECTOR host surface is scoped independently — tool counts are stated per product and version,
              never as an unqualified total.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gridline text-cyan-300 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Surface</th>
                    <th className="py-3 px-3">Transport</th>
                    <th className="py-3 px-3">MCP Tools</th>
                    <th className="py-3 px-3">Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gridline/50">
                  <tr className="hover:bg-surface/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-primary">OpenAI / Codex adapter</td>
                    <td className="py-3 px-3 text-muted-foreground text-xs">local stdio</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">{MCP_TOOLS_LIBRARY}</td>
                    <td className="py-3 px-3 text-secondary text-xs">8 verified library tools over the qector_decoder_v3 1.0.0 wheel</td>
                  </tr>
                  <tr className="hover:bg-surface/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-primary">
                      <Link to="/claude-plugin" className="hover:underline">Claude Plugin v1.0.2</Link>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground text-xs">local stdio</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">37</td>
                    <td className="py-3 px-3 text-secondary text-xs">8 library + 29 benchmark tools, 28 skills, 5 agents</td>
                  </tr>
                  <tr className="hover:bg-surface/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-primary">
                      <Link to="/workbench" className="hover:underline">Workbench v1.0.2</Link>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground text-xs">local stdio (--mcp)</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">85</td>
                    <td className="py-3 px-3 text-secondary text-xs">desktop GUI + full MCP surface, Windows / Linux / macOS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick start */}
          <div ref={(el) => addRef(el, 1)} className="card-surface space-y-4">
            <h2 className="text-2xl font-bold">First-Boot Verification</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Install the wheel, run the diagnostic, then point Codex at the MCP server. Every decode is verified
              against the H·c == s contract by the self-debug layer.
            </p>
            <div className="p-4 bg-void rounded-xl font-mono text-sm text-muted-foreground overflow-x-auto">
              <div className="text-cyan-300 mb-2"># 1 · install the decoder wheel</div>
              <div>pip install qector-decoder-v3==1.0.0 mcp</div>
              <div className="mt-2 text-cyan-300 mb-2"># 2 · verify the environment (first boot)</div>
              <div>qector-doctor</div>
              <div className="mt-2 text-cyan-300 mb-2"># 3 · register the MCP server with Codex CLI</div>
              <div>codex mcp add qector -- python path/to/mcp_server_library.py</div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The server script ships with the{' '}
              <a href="https://github.com/GuillaumeLessard/qector-claude-plugin" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                qector-claude-plugin repository
              </a>{' '}
              and speaks MCP protocol 2024-11-05 over stdio JSON-RPC 2.0.
            </p>
          </div>

          {/* What the tools do */}
          <div ref={(el) => addRef(el, 2)}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">The {MCP_TOOLS_LIBRARY} Library Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'decode_syndrome', desc: 'Decode a syndrome with any stable decoder and receive the faithful correction.' },
                { name: 'decode_single', desc: 'Single-shot decode path for quick interactive checks.' },
                { name: 'list_code_families', desc: 'Enumerate the supported quantum code families with parameters.' },
                { name: 'list_decoders', desc: 'List available decoder backends and their compatibility classes.' },
                { name: 'build_code_from_matrix', desc: 'Construct a code object from a parity-check matrix.' },
                { name: 'threshold_sweep', desc: 'Run noise sweeps across decoders for threshold estimation.' },
                { name: 'get_license_info', desc: 'Read the installed licence tier and status.' },
                { name: 'compat_report', desc: 'Environment and compatibility report for reproducibility.' },
              ].map((t) => (
                <AlgorithmCard key={t.name} title={t.name} desc={t.desc} />
              ))}
            </div>
          </div>

          {/* Evidence model */}
          <div ref={(el) => addRef(el, 3)} className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Evidence Model</h2>
            <p className="text-secondary text-sm">
              Claims surfaced through this adapter are grounded in the six-record Zenodo evidence corpus and the
              normative reference manual (DOI 10.5281/zenodo.21941046).
            </p>
            <EvidenceBlock
              title="Zero-Egress Architecture"
              statement="The OpenAI/Codex adapter runs entirely on your machine over local stdio. Circuits, parity-check matrices, syndromes, and corrections are never transmitted to QECTOR systems or any third party."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Link to="/evidence" className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors">
                <div className="text-xs text-muted-foreground uppercase mb-1">Validation</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">qector.store/evidence</div>
                <div className="text-xs text-secondary mt-1">Six-record Zenodo registry + V&V report</div>
              </Link>
              <Link to="/mcp-server" className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors">
                <div className="text-xs text-muted-foreground uppercase mb-1">Generic MCP</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">qector.store/mcp-server</div>
                <div className="text-xs text-secondary mt-1">Any MCP-compatible client</div>
              </Link>
              <Link to="/workbench" className="p-4 bg-void border border-gridline rounded-xl hover:border-cyan-300/40 transition-colors">
                <div className="text-xs text-muted-foreground uppercase mb-1">Desktop</div>
                <div className="text-cyan-300 font-mono text-sm font-semibold">qector.store/workbench</div>
                <div className="text-xs text-secondary mt-1">GUI + 85-tool MCP for Win/Linux/macOS</div>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <Link to="/contact" className="btn-cyan">
              Contact for Technical Support
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
