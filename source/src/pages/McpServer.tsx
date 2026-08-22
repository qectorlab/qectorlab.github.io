import { Link } from 'react-router';
import { SEO, JsonLd } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import CodeBlock from '../components/CodeBlock';

/**
 * MCP Server page.
 *
 * Documents the app-free library MCP server shipped in
 * mcp/mcp_server_library.py for qector-decoder-v3==1.0.0. The server exposes
 * exactly eight local stdio JSON-RPC 2.0 tools. Every tool name, signature,
 * and description below is read verbatim from TOOL_NAMES + _tool_schema() in
 * mcp/mcp_server_library.py: if a tool is added or renamed in the source,
 * this page must be updated with it.
 */

const TOOLS = [
  {
    name: 'list_code_families',
    desc: 'List the code families available in qector-decoder-v3 1.0.0 with their live availability and graphlike eligibility.',
    required: [],
    optional: [],
    returns: 'families map (generator, code_factory, available, description, single_decode), reference_manual DOI, qector_version "1.0.0"',
  },
  {
    name: 'list_decoders',
    desc: 'List the five stable decoder classes exposed by the wheel: union_find, fast_union_find, blossom, sparse_blossom, native_auto.',
    required: [],
    optional: [],
    returns: 'decoders map (class, status: "stable"), reference_manual DOI',
  },
  {
    name: 'get_license_info',
    desc: 'Read the live offline QECTOR license tier and feature gates from the installed wheel.',
    required: [],
    optional: [],
    returns: 'license info object, qector_version, reference_manual DOI',
  },
  {
    name: 'decode_syndrome',
    desc: 'Decode a binary syndrome against an explicit or family-derived parity-check matrix. Fails unless H c = s (mod 2) (Theorem 1).',
    required: ['syndrome'],
    optional: ['family', 'size', 'decoder_name', 'n_qubits'],
    returns: 'family, size, decoder, backend_used, qector_version, n_checks, n_qubits, syndrome, correction, hamming_weight, syndrome_valid, latency_us',
  },
  {
    name: 'decode_single',
    desc: 'Run one seeded code-capacity decode with Theorems 1 and 2 checks. Logical outcomes are coset-scored, not raw correction-equality.',
    required: [],
    optional: ['family', 'distance', 'decoder_name', 'error_rate', 'seed'],
    returns: 'family, distance, decoder, backend_used, qector_version, error_rate, seed, n_qubits, n_checks, error, syndrome, correction, error_weight, correction_weight, syndrome_valid, logical_failure, logical_scoring, latency_us',
  },
  {
    name: 'threshold_sweep',
    desc: 'Run a code-capacity LER sweep with Wilson 95% intervals and a hashed raw JSON artifact. Not comparable with circuit_level results.',
    required: [],
    optional: ['family', 'distances', 'error_rates', 'trials', 'seed', 'decoder_name', 'artifact_path'],
    returns: 'family, decoder, qector_version, results (per-point LER + Wilson interval), artifact (path, sha256, metadata), caveat',
  },
  {
    name: 'build_code_from_matrix',
    desc: 'Validate and build a binary (n_checks, n_qubits) parity-check matrix for arbitrary CSS/graph codes.',
    required: ['H_matrix'],
    optional: ['family', 'distance'],
    returns: 'family, distance, matrix_shape, rank, n_checks, n_qubits, logical_observables, graphlike, code_built, qector_version, reference_manual',
  },
  {
    name: 'compat_report',
    desc: 'Report live package compatibility and Provisional-surface boundaries (library stdio MCP vs upstream network/batch-GPU/OpenCL surfaces).',
    required: [],
    optional: [],
    returns: 'runtime_ok, qector_decoder_v3 (installed, version, expected), numpy, mcp_sdk, pymatching_compat, reference_manual, provisional_surfaces',
  },
];

const FAMILIES = [
  { name: 'repetition', desc: 'Open 1D chain parity-check code' },
  { name: 'ring', desc: 'Periodic ring code' },
  { name: 'surface_legacy', desc: 'Legacy toric weight-4 generator; NOT graphlike' },
  { name: 'rotated_surface', desc: 'Graphlike rotated surface code' },
  { name: 'unrotated_surface', desc: 'Graphlike square-lattice surface code' },
  { name: 'toric', desc: 'Graphlike toric code with periodic boundaries' },
  { name: 'heavy_hex', desc: 'Graphlike heavy-hex code' },
  { name: 'color_code', desc: 'Color code family exposed by the wheel' },
  { name: 'hypergraph_product', desc: 'CSS code from two parity-check matrices (requires build_code_from_matrix)' },
];

const DECODERS = [
  { name: 'union_find', type: 'Graphlike', desc: 'Standard cluster-growth Union-Find decoder.' },
  { name: 'fast_union_find', type: 'Graphlike', desc: 'Faster approximate Union-Find variant.' },
  { name: 'blossom', type: 'Universal', desc: 'Weight-optimal exact MWPM matching.' },
  { name: 'sparse_blossom', type: 'Graphlike', desc: 'Region-growing blossom variant for sparse error graphs.' },
  { name: 'native_auto', type: 'Auto', desc: 'Self-selecting heuristic selector (blossom for graphlike, BP-OSD for hypergraph-product).' },
];

const CLIENT_CONFIG = `{
  "mcpServers": {
    "qector": {
      "command": "python",
      "args": ["\${CLAUDE_PLUGIN_ROOT}/mcp/mcp_server_library.py"]
    }
  }
}`;

const CALL_EXAMPLE = `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "decode_single",
    "arguments": {
      "family": "rotated_surface",
      "distance": 5,
      "decoder_name": "blossom",
      "error_rate": 0.05,
      "seed": 42
    }
  }
}`;

const RESPONSE_EXAMPLE = `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{
      "type": "text",
      "text": "{\\n  \\"family\\": \\"rotated_surface\\",\\n  \\"distance\\": 5,\\n  \\"decoder\\": \\"blossom\\",\\n  \\"syndrome_valid\\": true,\\n  \\"logical_scoring\\": \\"logical-observable matrix (Theorem 2)\\",\\n  \\"logical_failure\\": false\\n}"
    }]
  }
}`;

export default function McpServer() {
  return (
    <>
      <SEO
        title="Library MCP Server · QECTOR Decoder v3 v1.0.0"
        description="App-free Model Context Protocol server for quantum error correction decoding. 8 verified local stdio JSON-RPC 2.0 tools across 9 code families and 5 stable decoders. Ships as a local library; no Workbench or GUI required."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'QECTOR Library MCP Server',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Windows, macOS, Linux',
          description:
            'Local stdio Model Context Protocol server exposing 8 verified QEC decoding tools. Syndromes never leave the machine.',
        }}
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            Local stdio · JSON-RPC 2.0 · Protocol 2024-11-05 · qector-decoder-v3 1.0.0
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="Library MCP Server" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            The app-free, library-only MCP server: eight verified tools covering Union-Find, exact
            Blossom MWPM, SparseBlossom, and the auto router, with syndrome validation against
            <code className="text-cyan-300"> H c = s (mod 2) </code> and coset-scored logical outcomes.
            Runs on <code className="text-cyan-300">qector-decoder-v3==1.0.0</code> with
            <code className="text-cyan-300">mcp==1.26.0</code>; no Workbench or GUI needed. Ships in the
            <code className="text-cyan-300">qector-claude-plugin</code> repository.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/installer" className="btn-cyan">Install</Link>
            <Link to="/docs" className="btn-outline">Documentation</Link>
            <Link to="/workbench" className="btn-outline">Workbench vs library</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-4xl mx-auto space-y-10">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                t: 'Deterministic, not generated',
                d: 'The assistant calls a decoder; it does not invent a correction. Results are reproducible and syndrome-faithful.',
              },
              {
                t: 'Runs locally',
                d: 'Local stdio JSON-RPC. No syndromes leave the machine, no network call, no telemetry. The protocol is local stdio only.',
              },
              {
                t: 'App-free',
                d: 'Runs on the published qector-decoder-v3==1.0.0 wheel and ships in the qector-claude-plugin repository. No QECTOR Workbench, no GUI, no desktop application required.',
              },
            ].map((c) => (
              <div key={c.t} className="card-surface">
                <h3 className="text-cyan-300 font-semibold text-sm mb-2">{c.t}</h3>
                <p className="text-secondary text-sm leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="card-surface border border-cyan-800/60 bg-gradient-to-r from-cyan-950/40 via-surface to-cyan-950/20 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-400 text-slate-950 mb-2">
                CLAUDE PLUGIN
              </span>
              <h3 className="text-lg font-bold text-slate-100 mb-1">
                Looking for the full Claude Code Plugin?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Includes 28 domain skills, 5 specialized agents, 13 slash commands, and 37 MCP tools (8 library + 29 benchmark) alongside this local MCP server. For the largest surface, Workbench v1.0.2 ships an 85-tool MCP server on Windows, Linux, and macOS.
              </p>
            </div>
            <Link
              to="/claude-plugin"
              className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs font-mono transition-all whitespace-nowrap shadow-lg shadow-cyan-400/20"
            >
              Explore Claude Plugin →
            </Link>
          </div>

          <div className="card-surface">
            <h2 className="text-2xl font-bold mb-3">Connect a client</h2>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              The server speaks JSON-RPC 2.0 over local stdio and identifies itself as
              <code className="text-cyan-300"> qector-decoder-v3-mcp </code>. Add it to Claude Code,
              Claude Desktop, or any MCP client:
            </p>
            <CodeBlock language="json" code={CLIENT_CONFIG} />
            <p className="text-muted-foreground text-xs mt-3">
              In Claude Code, root <code className="text-cyan-300">.mcp.json</code> already references
              this server via <code className="text-cyan-300">${'${CLAUDE_PLUGIN_ROOT}'}</code>. Validate with
              <code className="text-cyan-300"> claude plugin validate "&lt;PLUGIN_ROOT&gt;" --strict </code>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">8 Tools</h2>
            <p className="text-secondary text-sm mb-6">
              Returned verbatim by <code className="text-cyan-300">tools/list</code>. The schema is
              enforced as fail-closed JSON; malformed or resource-exceeding input returns an MCP
              <code className="text-cyan-300"> isError </code> result without leaking tracebacks.
            </p>
            <div className="space-y-4">
              {TOOLS.map((t) => (
                <div key={t.name} className="card-surface">
                  <div className="flex flex-wrap items-baseline gap-3 mb-2">
                    <code className="text-cyan-300 font-semibold text-base">{t.name}</code>
                  </div>
                  <p className="text-secondary text-sm leading-relaxed mb-3">{t.desc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-muted-foreground uppercase tracking-wider mb-1">Required</div>
                      <div className="text-secondary">
                        {t.required.length ? t.required.map((r) => (
                          <code key={r} className="text-cyan-300 mr-2">{r}</code>
                        )) : <span className="text-muted-foreground">none</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground uppercase tracking-wider mb-1">Optional</div>
                      <div className="text-secondary">
                        {t.optional.length ? t.optional.map((r) => (
                          <code key={r} className="text-muted-foreground mr-2">{r}</code>
                        )) : <span className="text-muted-foreground">none</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground uppercase tracking-wider mb-1">Returns</div>
                      <div className="text-secondary">{t.returns}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface">
            <h2 className="text-2xl font-bold mb-3">Code families &amp; decoders</h2>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              Nine code families (graphlike eligible where marked; non-graphlike inputs route to
              BP-OSD or require <code className="text-cyan-300"> build_code_from_matrix </code>)
              and five stable decoders. No universal benchmark figures are published on the site —
              run the shipped harness to measure your own hardware.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FAMILIES.map((f) => (
                <div key={f.name} className="p-4 bg-void border border-gridline rounded-xl">
                  <span className="text-cyan-300 font-mono font-bold">{f.name}</span>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">→ {f.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gridline text-cyan-300 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-2 px-3">Decoder</th>
                    <th className="py-2 px-3">Compatibility</th>
                    <th className="py-2 px-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gridline/50">
                  {DECODERS.map((d) => (
                    <tr key={d.name} className="hover:bg-surface/30 transition-colors">
                      <td className="py-2 px-3 font-mono font-semibold text-primary">{d.name}</td>
                      <td className="py-2 px-3 text-muted-foreground text-xs">{d.type}</td>
                      <td className="py-2 px-3 text-secondary text-xs">{d.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface">
            <h2 className="text-2xl font-bold mb-3">Example call</h2>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              <code className="text-cyan-300"> decode_single </code> runs one seeded code-capacity decode
              with Theorems 1 and 2 enforcement, then returns syndrome_valid and logical_scoring fields.
            </p>
            <CodeBlock language="json" code={CALL_EXAMPLE} />
            <p className="text-secondary text-sm mt-5 mb-3">Response:</p>
            <CodeBlock language="json" code={RESPONSE_EXAMPLE} />
            <p className="text-muted-foreground text-xs mt-3">
              Tool results are returned as MCP text content containing the JSON payload, per the
              2024-11-05 content convention. The <code className="text-cyan-300"> H c = s (mod 2) </code>
              check is enforced before any logical scoring; a failed check raises an MCP error instead of returning a result.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-2xl font-bold mb-4">Operational guidance</h2>
            <ul className="space-y-3 text-secondary text-sm leading-relaxed">
              <li>
                <strong className="text-primary">Local only.</strong> The supported transport is local stdio. Network surfaces (REST/gRPC/metrics/SSE) and batch-GPU paths are Provisional and require separate deployment review — they are not part of this public library contract.
              </li>
              <li>
                <strong className="text-primary">Graphlike guard.</strong> Exact Blossom and SparseBlossom decoders require graphlike check structures (qubit participation ≤ 2). For hyperedge matrices such as <code className="text-cyan-300"> generate_surface_code_checks </code>, use <code className="text-cyan-300"> build_code_from_matrix </code> or decompose via the documented direct-wheel APIs.
              </li>
              <li>
                <strong className="text-primary">LER is coset-scored.</strong> Logical outcomes use the logical coset, never raw correction-vector equality. Wilson 95% intervals and a <code className="text-cyan-300"> code_capacity </code> tag are included; do not compare with <code className="text-cyan-300"> circuit_level </code> results.
              </li>
              <li>
                <strong className="text-primary">Artifacts stay local.</strong> <code className="text-cyan-300"> threshold_sweep </code> writes a hashed raw JSON artifact with required metadata. Generated artifacts belong outside the plugin and must not be uploaded to external services.
              </li>
              <li>
                <strong className="text-primary">Licensing.</strong> See <Link to="/pricing" className="text-cyan-300">Pricing</Link> for license-key installation and tier information returned by <code className="text-cyan-300"> get_license_info </code>.
              </li>
            </ul>
          </div>

          <div className="text-center pt-2">
            <Link to="/pricing" className="btn-cyan">View licensing</Link>
          </div>

        </div>
      </section>
    </>
  );
}
