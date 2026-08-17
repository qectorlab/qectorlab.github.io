import { useState } from 'react';
import { Link } from 'react-router';
import { SEO, JsonLd } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import CodeBlock from '../components/CodeBlock';
import {
  ShieldCheck,
  Terminal,
  Cpu,
  BookOpen,
  Download,
  ExternalLink,
  Layers,
  Activity,
  CheckCircle2,
  Lock,
  Workflow,
  Sparkles,
  Check,
  Copy,
  Code2,
  Binary,
} from 'lucide-react';

const SKILLS = [
  {
    name: 'qector-core',
    role: 'Core Ground Truth',
    desc: 'Verified platform facts, 8 library MCP tools, 5 stable decoders, and strict API grounding to prevent hallucination.',
    keyFeatures: ['Grounds tool names & signatures', 'Enforces strict math boundary', 'Zero-egress verification'],
  },
  {
    name: 'qector-math-foundations',
    role: 'Mathematical Axioms',
    desc: 'Theorems 1–16 executable obligations over GF(2), syndrome equivalence H c = s (mod 2), Wilson 95% CIs, and coset scoring.',
    keyFeatures: ['Theorem 1 fail-closed verification', 'Theorem 2 logical coset scoring', 'Wilson score intervals'],
  },
  {
    name: 'qector-developer',
    role: 'SDK & Engineering',
    desc: 'Integration guidance for qector-decoder-v3 Python SDK, parity-check matrix generation, Sinter/Stim adapters, and CI/CD testing.',
    keyFeatures: ['Python SDK best practices', 'Matrix construction helpers', 'Local test automation'],
  },
  {
    name: 'qector-researcher',
    role: 'Quantum Information Science',
    desc: 'Threshold discovery workflows, noise modeling, Monte Carlo error simulations, and academic paper reproduction.',
    keyFeatures: ['Code-capacity sweeps', 'Noise model parameterization', 'Reproducible artifact export'],
  },
  {
    name: 'qector-hardware-engineer',
    role: 'Experimental & Cryogenic',
    desc: 'Hardware constraint modeling, heavy-hex/surface graph mapping, physical error rate profiling, and latency budgets.',
    keyFeatures: ['Physical qubit layout mapping', 'Hardware latency analysis', 'Cryogenic error budgets'],
  },
  {
    name: 'qector-educator',
    role: 'Pedagogy & Concepts',
    desc: 'Interactive tutorial creation, mathematical explanations of syndrome decoding, MWPM matching, and BP-OSD.',
    keyFeatures: ['Step-by-step decoding explanations', 'Interactive code walkthroughs', 'Visual homology concepts'],
  },
  {
    name: 'qector-sysadmin',
    role: 'Operations & Hygiene',
    desc: 'Environment diagnostics, resource limits (MAX_CHECKS, MAX_QUBITS), safe file I/O, and deployment validation.',
    keyFeatures: ['15-point runtime health check', 'DoS & memory limit guards', 'Platform compatibility audit'],
  },
];

const AGENTS = [
  {
    file: 'qec-developer.md',
    title: 'QEC Software Engineer',
    desc: 'Specialized in Python SDK integration, decoder benchmarking, matrix generation, and production deployment.',
  },
  {
    file: 'qec-researcher.md',
    title: 'QEC Research Scientist',
    desc: 'Specialized in academic literature review, threshold sweeps, Wilson confidence intervals, and Monte Carlo studies.',
  },
  {
    file: 'qec-validator.md',
    title: 'Mathematical Proof Validator',
    desc: 'Specialized in formal theorem checking, finite matrix verification, syndrome faithfulness, and zero-egress enforcement.',
  },
  {
    file: 'qec-sysadmin.md',
    title: 'Systems & Runtime Engineer',
    desc: 'Specialized in Python environment health, MCP server stdio management, resource bounds, and packaging.',
  },
  {
    file: 'qec-hardware-engineer.md',
    title: 'Quantum Hardware Architect',
    desc: 'Specialized in superconducting qubit topologies, heavy-hex grids, cryogenic latency constraints, and noise budgets.',
  },
];

const TOOLS = [
  {
    name: 'list_code_families',
    desc: 'Lists available code families (Rotated Surface, Toric, Ring, Repetition, Color, Heavy-Hex, Hypergraph Product).',
  },
  {
    name: 'list_decoders',
    desc: 'Lists the five stable decoder classes: UnionFind, FastUnionFind, Blossom (MWPM), SparseBlossom, NativeAuto.',
  },
  {
    name: 'get_license_info',
    desc: 'Reads live offline licensing tier and feature flags from the installed qector-decoder-v3 package.',
  },
  {
    name: 'decode_syndrome',
    desc: 'Decodes a binary syndrome with mandatory Theorem 1 fail-closed verification: H c = s (mod 2).',
  },
  {
    name: 'decode_single',
    desc: 'Executes a single-shot decode with logical-coset scoring (Theorem 2) against logical observables.',
  },
  {
    name: 'threshold_sweep',
    desc: 'Runs device-local code-capacity sweeps with Wilson 95% confidence intervals and SHA-256 sealed artifacts.',
  },
  {
    name: 'build_code_from_matrix',
    desc: 'Validates and compiles an arbitrary binary parity-check matrix with rank and observable analysis.',
  },
  {
    name: 'compat_report',
    desc: 'Audits runtime health, wheel version, NumPy compatibility, and provisional feature boundaries.',
  },
];

export default function ClaudePlugin() {
  const [copiedMarketplace, setCopiedMarketplace] = useState(false);
  const [copiedLocal, setCopiedLocal] = useState(false);

  const copyText = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const marketplaceSnippet = `claude plugin marketplace add GuillaumeLessard/qector-claude-plugin\nclaude plugin install qector@qector-tools`;
  const localSnippet = `git clone https://github.com/GuillaumeLessard/qector-claude-plugin.git\ncd qector-claude-plugin\npip install -r requirements.txt\nclaude --plugin-dir .`;

  return (
    <>
      <SEO
        title="QECTOR Claude Plugin · Quantum Error Correction for Claude Code"
        description="Official QECTOR plugin for Claude Code and Claude Desktop. 7 strict-math skills, 5 specialized agents, 8 local MCP tools, and zero-egress quantum decoding."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'QECTOR Claude Plugin',
          description:
            'Official QECTOR plugin for Claude Code and Claude Desktop. 7 strict-math skills, 5 specialized agents, 8 local MCP tools, and zero-egress quantum decoding.',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Linux, macOS, Windows',
          softwareVersion: '1.0.0',
          author: {
            '@type': 'Person',
            name: 'Guillaume Lessard',
            url: 'https://orcid.org/0009-0000-3465-3753',
          },
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/5 via-surface/40 to-void pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-mono font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>ANTHROPIC CLAUDE CODE & DESKTOP PLUGIN · v1.0.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-100 mb-6 max-w-4xl mx-auto leading-[1.1]">
            <NeuralReveal text="QECTOR Claude Plugin" />
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Empower Claude with local, production-grade Quantum Error Correction engineering.
            Features <span className="text-cyan-300 font-semibold">7 strict-math skills</span>,{' '}
            <span className="text-cyan-300 font-semibold">5 specialized agents</span>,{' '}
            <span className="text-cyan-300 font-semibold">8 local MCP tools</span>, and full zero-egress data isolation.
          </p>

          {/* Quick Install Box */}
          <div className="max-w-2xl mx-auto bg-slate-950/90 border border-cyan-900/60 rounded-2xl p-5 mb-10 shadow-2xl backdrop-blur-md text-left">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Instant Marketplace Install
                </span>
              </div>
              <button
                onClick={() => copyText(marketplaceSnippet, setCopiedMarketplace)}
                className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors px-2.5 py-1 rounded bg-cyan-950/50 border border-cyan-800/40"
              >
                {copiedMarketplace ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMarketplace ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="font-mono text-sm text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed">
              {marketplaceSnippet}
            </pre>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/GuillaumeLessard/qector-claude-plugin"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-400/20 inline-flex items-center gap-2"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              to="/mcp-server"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all inline-flex items-center gap-2"
            >
              <span>MCP Server Reference</span>
              <Code2 className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-surface p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center text-cyan-400 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-100 mb-2">Zero-Egress Security</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pure local stdio transport. Parity matrices, syndromes, quantum circuits, and simulation artifacts never leave your device.
            </p>
          </div>

          <div className="card-surface p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center text-cyan-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-100 mb-2">Strict Mathematics</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every decode is checked against <code className="text-cyan-300 font-mono">H c = s (mod 2)</code>. Scored with logical cosets and Wilson 95% CIs.
            </p>
          </div>

          <div className="card-surface p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center text-cyan-400 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-100 mb-2">App-Free Library</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Built on the official <code className="text-cyan-300 font-mono">qector-decoder-v3==1.0.0</code> Rust/PyO3 wheel. No desktop GUI required.
            </p>
          </div>

          <div className="card-surface p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center text-cyan-400 mb-4">
              <Workflow className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-100 mb-2">Multi-Agent System</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              7 domain skills and 5 tailored agent personas designed for research, hardware design, verification, and engineering.
            </p>
          </div>
        </div>
      </section>

      {/* 7 Strict-Math Skills */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/40 text-cyan-300 text-xs font-mono font-medium mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>DOMAIN SKILLS ECOSYSTEM</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            7 Grounded QEC Skills
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Each skill encodes verified domain rules and strict-math obligations to prevent AI hallucination and ground every interaction in reproducible physics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((skill) => (
            <div
              key={skill.name}
              className="card-surface p-6 rounded-2xl border border-slate-800/90 flex flex-col justify-between hover:border-cyan-500/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm font-bold text-cyan-400">{skill.name}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {skill.role}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{skill.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                {skill.keyFeatures.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5 Specialized Agents */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/40 text-cyan-300 text-xs font-mono font-medium mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>AGENT ROLES & PERSONAS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            5 Specialized QEC Agents
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Custom agent definitions for Claude Code configured with tailored instructions, prompt templates, and tool access boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENTS.map((agent) => (
            <div
              key={agent.file}
              className="card-surface p-6 rounded-2xl border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{agent.file}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{agent.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{agent.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8 MCP Tools Table */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/40 text-cyan-300 text-xs font-mono font-medium mb-3">
            <Binary className="w-3.5 h-3.5" />
            <span>MCP SERVER TOOL SURFACE</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            8 Local Verification Tools
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Local JSON-RPC 2.0 stdio tools running directly against the PyO3 Rust decoder core.
          </p>
        </div>

        <div className="card-surface rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/90 text-xs font-mono text-cyan-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Tool Name</th>
                  <th className="px-6 py-4">Functionality & Mathematical Invariant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
                {TOOLS.map((tool) => (
                  <tr key={tool.name} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-cyan-300 whitespace-nowrap">
                      {tool.name}
                    </td>
                    <td className="px-6 py-4 font-sans text-sm text-slate-400">{tool.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Installation & Configuration */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Installation & Setup
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Configure QECTOR Claude Plugin for Claude Code or Claude Desktop in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Method 1: Claude Code Plugin Marketplace */}
          <div className="card-surface p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-lg font-bold text-slate-100">Claude Code Marketplace</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Install directly via Claude Code marketplace registration:
              </p>
              <CodeBlock
                code={`# 1. Add marketplace repository\nclaude plugin marketplace add GuillaumeLessard/qector-claude-plugin\n\n# 2. Install plugin\nclaude plugin install qector@qector-tools`}
                language="bash"
              />
            </div>
          </div>

          {/* Method 2: Local Git Clone */}
          <div className="card-surface p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="text-lg font-bold text-slate-100">Local Plugin Directory</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Clone the source repository and launch with the <code className="text-cyan-300 font-mono">--plugin-dir</code> flag:
              </p>
              <CodeBlock
                code={`git clone https://github.com/GuillaumeLessard/qector-claude-plugin.git\ncd qector-claude-plugin\npip install -r requirements.txt\nclaude --plugin-dir .`}
                language="bash"
              />
            </div>
          </div>
        </div>

        {/* Verification & Math Gate */}
        <div className="mt-8 card-surface p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-bold text-slate-100 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Mathematical Validation Gate</span>
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Verify all 16 Reference Manual theorems and 29 executable proof obligations locally on your machine:
          </p>
          <CodeBlock
            code={`# Run the complete public reference manual mathematical gate\npython bin/run_manual_math_validation.py\n\n# Or run full pytest integration suite\npython -m pytest tests/test_reference_manual_math.py -v`}
            language="bash"
          />
        </div>
      </section>

      {/* Package Downloads & Prebuilt Artifacts */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 mb-12">
        <div className="card-surface p-8 rounded-3xl border border-cyan-900/50 relative overflow-hidden bg-gradient-to-br from-slate-950 via-surface/60 to-slate-950">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-100 mb-2">
                Download Distribution Packages
              </h3>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Pre-packaged standalone ZIP archives formatted specifically for the Claude.ai custom-skill uploader (forward-slash path normalized) and Claude Code multi-skill plugin distributions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/GuillaumeLessard/qector-claude-plugin/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs font-mono transition-all inline-flex items-center gap-2 shadow-lg shadow-cyan-400/20"
              >
                <Download className="w-4 h-4" />
                <span>Releases & Checksums</span>
              </a>
              <Link
                to="/docs"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs font-mono transition-all inline-flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Docs Hub</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
