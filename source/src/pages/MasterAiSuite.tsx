import { Link } from 'react-router';
import { SEO, JsonLd } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Cloud,
  Code2,
  FileCheck2,
  FileText,
  Network,
  ShieldCheck,
} from 'lucide-react';

const ITCH_URL = 'https://id01t.itch.io/qector-master-ai-suite-v2';

const agents = [
  {
    icon: Bot,
    name: 'QEC Researcher',
    description: 'Parse papers, inspect code structures, compare decoding ideas, and turn research questions into traceable work items.',
  },
  {
    icon: Network,
    name: 'Hardware Engineer',
    description: 'Translate abstract QEC workflows into physical-layer, control, and integration questions without hiding hardware assumptions.',
  },
  {
    icon: ShieldCheck,
    name: 'Systems Administrator',
    description: 'Coordinate environments, dependencies, cloud services, permissions, and operational setup around the research workflow.',
  },
  {
    icon: FileText,
    name: 'QEC Educator',
    description: 'Turn difficult error-correction concepts into structured explanations, onboarding material, and reusable learning paths.',
  },
  {
    icon: Code2,
    name: 'QEC Developer',
    description: 'Help implement, review, document, and maintain the surrounding Python, configuration, and integration code.',
  },
];

const packageAreas = [
  {
    icon: FileCheck2,
    label: 'Grounded starting points',
    text: 'Includes a threshold-sweep script and a repetition-code Stim input so agents can be tested against concrete QEC material rather than only abstract prompts.',
  },
  {
    icon: Network,
    label: 'MCP and IDE configuration',
    text: 'Use mcp_config.json, plugin.json, and .cursorrules as the configuration layer for tool-aware AI work in a compatible editor and cloud API workflow.',
  },
  {
    icon: FileText,
    label: 'Documentation that ships',
    text: 'Start with the user manual, developer onboarding, security playbook, master cheat sheet, and executive pitch template included in the archive.',
  },
];

export default function MasterAiSuite() {
  return (
    <>
      <SEO
        title="QECTOR Master AI Suite v2 · Multi-Agent QEC Research Toolkit"
        description="QECTOR Master AI Suite v2 is a downloadable multi-agent AI toolkit for quantum error correction research, MCP workflows, documentation, and deployment planning."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'QECTOR Master AI Suite v2',
          description: 'Downloadable multi-agent AI toolkit for quantum error correction research, MCP workflows, documentation, and deployment planning.',
          brand: { '@type': 'Brand', name: 'QECTOR' },
          creator: { '@type': 'Organization', name: 'iD01t Productions', url: 'https://id01t.itch.io' },
          url: ITCH_URL,
          offers: {
            '@type': 'Offer',
            price: '99.99',
            priceCurrency: 'CAD',
            availability: 'https://schema.org/InStock',
            url: `${ITCH_URL}/purchase`,
          },
        }}
      />

      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.14),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.12),_transparent_42%)]" />
        <div className="section-padding relative z-10">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse-dot" />
                New from iD01t Productions
              </div>
              <h1 className="mb-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                <NeuralReveal text="QECTOR Master AI Suite v2" className="text-4xl font-extrabold md:text-6xl" />
              </h1>
              <p className="mb-8 max-w-2xl text-lg leading-relaxed text-secondary md:text-xl">
                A focused multi-agent AI toolkit for quantum error-correction research, technical software work, and deployment planning.
                Bring a prepared AI team to the work instead of rebuilding the same research context for every project.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={ITCH_URL} target="_blank" rel="noopener noreferrer" className="btn-cyan">
                  View the itch.io release <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
                <Link to="/decoder" className="btn-outline">
                  Explore the decoder <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                The public listing sets the minimum price at $99.99 CAD. This is a downloadable toolkit, not a hosted AI service or a replacement for QECTOR Decoder v3.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-4 rounded-[2rem] bg-cyan-300/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-void/80 p-6 shadow-2xl">
                <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                  <span>Research workspace</span>
                  <span className="text-cyan-300">v2</span>
                </div>
                <img src="/images/logo.png" alt="QECTOR logo" className="mx-auto aspect-square w-full rounded-2xl object-cover" />
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] text-secondary">
                  <div className="rounded-lg border border-gridline bg-surface/60 px-2 py-3">Agents</div>
                  <div className="rounded-lg border border-gridline bg-surface/60 px-2 py-3">MCP</div>
                  <div className="rounded-lg border border-gridline bg-surface/60 px-2 py-3">QEC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-300">A prepared team, not a generic chatbot</p>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Five roles for the real QEC workflow</h2>
            <p className="leading-relaxed text-secondary">
              Each role is designed around a different part of the research-to-deployment loop. Use them independently for focused work or compose them into a reviewable team workflow.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {agents.map(({ icon: Icon, name, description }) => (
              <article key={name} className="card-surface group">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300 transition-transform duration-300 group-hover:-translate-y-1">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-primary">{name}</h3>
                <p className="text-sm leading-relaxed text-secondary">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface/40 py-24">
        <div className="section-padding">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-300">Inside the archive</p>
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">A launchpad for serious technical work</h2>
                <p className="leading-relaxed text-secondary">
                  The suite packages prompts, configuration, grounded inputs, and operational documentation together so the first useful session starts with context already in place.
                </p>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {packageAreas.map(({ icon: Icon, label, text }) => (
                  <article key={label} className="rounded-2xl border border-gridline bg-void/70 p-5">
                    <Icon className="mb-4 h-5 w-5 text-cyan-300" aria-hidden="true" />
                    <h3 className="mb-2 text-sm font-semibold text-primary">{label}</h3>
                    <p className="text-xs leading-relaxed text-secondary">{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-300">Designed for</p>
            <h2 className="text-3xl font-bold md:text-4xl">From independent research to team onboarding</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="card-surface"><h3 className="mb-2 font-semibold text-primary">Independent researchers</h3><p className="text-sm leading-relaxed text-secondary">Keep literature parsing, code exploration, experiment planning, and technical writing in one consistent workspace.</p></div>
            <div className="card-surface"><h3 className="mb-2 font-semibold text-primary">AI and QEC engineers</h3><p className="text-sm leading-relaxed text-secondary">Prototype MCP-connected workflows with explicit roles, reusable configuration, and concrete Stim/Python starting points.</p></div>
            <div className="card-surface"><h3 className="mb-2 font-semibold text-primary">Technical teams and educators</h3><p className="text-sm leading-relaxed text-secondary">Use onboarding, security, and explanation materials to align contributors before they touch a complex QEC codebase.</p></div>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-7">
            <Cloud className="mb-4 h-6 w-6 text-cyan-300" aria-hidden="true" />
            <h2 className="mb-3 text-xl font-bold text-primary">Requirements</h2>
            <ul className="space-y-3 text-sm leading-relaxed text-secondary">
              <li>• A compatible code editor such as VS Code or Cursor.</li>
              <li>• An active cloud AI API provider for the MCP workflow.</li>
              <li>• Python and Stim familiarity for the included technical inputs.</li>
              <li>• A review process for generated code, claims, and security decisions.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-gold-400/20 bg-gold-400/5 p-7">
            <ShieldCheck className="mb-4 h-6 w-6 text-gold-400" aria-hidden="true" />
            <h2 className="mb-3 text-xl font-bold text-primary">Use it responsibly</h2>
            <p className="text-sm leading-relaxed text-secondary">
              The suite accelerates reasoning and orchestration; it does not certify a decoder, prove a threshold, or replace domain review. Validate generated scripts against declared matrices, noise models, observables, and security requirements before relying on them.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding pb-28">
        <div className="mx-auto max-w-4xl rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-surface/70 to-void p-8 text-center md:p-12">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Start with a prepared QEC AI team</h2>
          <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-secondary">
            Get the archive, connect the configuration to your preferred cloud AI workflow, and turn the included roles and documents into a research process you can inspect and improve.
          </p>
          <a href={ITCH_URL} target="_blank" rel="noopener noreferrer" className="btn-cyan">
            Open QECTOR Master AI Suite v2 <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-5 text-xs text-muted-foreground">Canonical product page: id01t.itch.io/qector-master-ai-suite-v2</p>
        </div>
      </section>
    </>
  );
}
