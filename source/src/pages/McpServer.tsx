import { Link } from 'react-router';
import { SEO, JsonLd } from '../lib/seo';
import CodeBlock from '../components/CodeBlock';

/**
 * MCP Server page.
 *
 * Documents the JSON-RPC 2.0 MCP server shipped in the native extension
 * (src/mcp_server.rs, server name "qector-mcp", protocol 2024-11-05). Every
 * tool listed here is read from the actual `tools/list` payload -- if a tool is
 * added or renamed in the Rust source, this page must be updated with it.
 */

const TOOLS = [
  {
    name: 'decode_syndrome',
    desc: 'Decode a single syndrome with the Union-Find decoder. Fastest path; graphlike (matching) codes.',
    required: ['check_to_qubits', 'syndrome'],
    optional: ['n_qubits'],
    returns: 'correction, n_qubits, n_checks',
  },
  {
    name: 'decode_syndrome_blossom',
    desc: 'Decode with the exact Blossom (MWPM) decoder. Weight-optimal matching, with a GF(2) safety net that guarantees H·correction == syndrome on any code, including hypergraphs.',
    required: ['check_to_qubits', 'syndrome'],
    optional: ['n_qubits'],
    returns: 'correction, n_qubits, n_checks',
  },
  {
    name: 'batch_decode_blossom',
    desc: 'Batch-decode many syndromes with Blossom across all cores (Rayon-parallel, GIL released).',
    required: ['check_to_qubits', 'syndromes_flat', 'batch_size'],
    optional: ['n_qubits'],
    returns: 'corrections_flat, n_qubits, n_checks, batch_size',
  },
  {
    name: 'decode_syndrome_cascade',
    desc: 'Hybrid cascade: a fast Union-Find pre-filter that escalates only hard or high-weight syndromes to Blossom. Returns pre-filter/escalation counters so you can tune the trade-off.',
    required: ['check_to_qubits', 'syndrome'],
    optional: ['n_qubits', 'max_accept_weight'],
    returns: 'correction, prefilter_hits, escalations, n_qubits, n_checks',
  },
  {
    name: 'benchmark_decoder',
    desc: 'Run a latency benchmark and return mean / p50 / p99 microseconds plus throughput.',
    required: ['check_to_qubits'],
    optional: ['n_qubits', 'n_samples', 'seed'],
    returns: 'latency percentiles, throughput, version, timestamp',
  },
  {
    name: 'run_ler_benchmark',
    desc: 'Run the logical-error-rate benchmark across code distances and families (rotated surface, toric, unrotated, color).',
    required: [],
    optional: [],
    returns: 'per-config LER results as JSON',
  },
  {
    name: 'get_decoder_info',
    desc: 'Report version, available decoder types and compiled capabilities (CUDA, OpenCL, gRPC, metrics).',
    required: [],
    optional: [],
    returns: 'version, decoder_types, capabilities',
  },
];

const CLIENT_CONFIG = `{
  "mcpServers": {
    "qector": {
      "command": "python",
      "args": ["-m", "qector_decoder_v3.mcp"]
    }
  }
}`;

const CALL_EXAMPLE = `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "decode_syndrome_cascade",
    "arguments": {
      "check_to_qubits": [[0, 1], [1, 2], [2, 3], [3, 4]],
      "n_qubits": 5,
      "syndrome": [1, 1, 0, 0]
    }
  }
}`;

const RESPONSE_EXAMPLE = `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{
      "type": "text",
      "text": "{\\n  \\"correction\\": [0, 1, 0, 0, 0],\\n  \\"prefilter_hits\\": 1,\\n  \\"escalations\\": 0,\\n  \\"n_qubits\\": 5,\\n  \\"n_checks\\": 4\\n}"
    }]
  }
}`;

export default function McpServer() {
  return (
    <>
      <SEO
        title="MCP Server · QECTOR Decoder v3"
        description="Model Context Protocol server for quantum error correction decoding. Seven JSON-RPC tools exposing Union-Find, Blossom MWPM, hybrid cascade decoding and benchmarks to any MCP client."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'QECTOR MCP Server',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Windows, macOS, Linux',
          description:
            'Model Context Protocol server exposing production quantum error correction decoders over JSON-RPC 2.0.',
        }}
      />

      {/* HERO */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            JSON-RPC 2.0 · Protocol 2024-11-05 · Ships in the native extension
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            MCP Server
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Give any MCP-capable assistant direct access to production quantum error
            correction. Seven tools covering Union-Find, exact Blossom MWPM, hybrid
            cascade decoding and benchmarking — decoding runs in native Rust, not in
            the model.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/installer" className="btn-cyan">Install</Link>
            <Link to="/docs" className="btn-outline">Documentation</Link>
            <Link to="/pricing" className="btn-outline">Licensing</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* WHY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                t: 'Deterministic, not generated',
                d: 'The assistant calls a decoder; it does not invent a correction. Results are reproducible and syndrome-faithful.',
              },
              {
                t: 'Native speed',
                d: 'Rust core with Rayon parallelism and the GIL released on batch paths. Batch decoding scales across every core.',
              },
              {
                t: 'Runs locally',
                d: 'stdio JSON-RPC. No syndromes leave the machine, no network call, no telemetry.',
              },
            ].map((c) => (
              <div key={c.t} className="card-surface">
                <h3 className="text-cyan-300 font-semibold text-sm mb-2">{c.t}</h3>
                <p className="text-secondary text-sm leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>

          {/* CONFIG */}
          <div className="card-surface">
            <h2 className="text-2xl font-bold mb-3">Connect a client</h2>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              The server speaks JSON-RPC 2.0 over stdio and identifies itself as{' '}
              <code className="text-cyan-300">qector-mcp</code>. Add it to any MCP client
              configuration:
            </p>
            <CodeBlock language="json" code={CLIENT_CONFIG} />
            <p className="text-muted-foreground text-xs mt-3">
              Requires the package installed in the target Python environment:{' '}
              <code className="text-cyan-300">pip install qector-decoder-v3</code>
            </p>
          </div>

          {/* TOOLS */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Tools</h2>
            <p className="text-secondary text-sm mb-6">
              Seven tools, returned verbatim by <code className="text-cyan-300">tools/list</code>.
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

          {/* CALL */}
          <div className="card-surface">
            <h2 className="text-2xl font-bold mb-3">Example call</h2>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              The cascade decoder runs Union-Find first and escalates only what it cannot
              cheaply resolve, reporting how often each path was taken.
            </p>
            <CodeBlock language="json" code={CALL_EXAMPLE} />
            <p className="text-secondary text-sm mt-5 mb-3">Response:</p>
            <CodeBlock language="json" code={RESPONSE_EXAMPLE} />
            <p className="text-muted-foreground text-xs mt-3">
              Tool results are returned as MCP text content containing the JSON payload,
              per the 2024-11-05 content convention.
            </p>
          </div>

          {/* NOTES */}
          <div className="card-surface">
            <h2 className="text-2xl font-bold mb-4">Operational notes</h2>
            <ul className="space-y-3 text-secondary text-sm leading-relaxed">
              <li>
                <strong className="text-primary">Code format.</strong>{' '}
                <code className="text-cyan-300">check_to_qubits</code> is a list of checks,
                each the list of qubit indices it measures. Union-Find requires every qubit
                to touch at most two checks; codes with genuine hyperedges are rejected with
                a clear error rather than decoded incorrectly — use the Blossom or cascade
                tool for those.
              </li>
              <li>
                <strong className="text-primary">Syndrome faithfulness.</strong> Blossom and
                the cascade fall back to an exact GF(2) solve when matching cannot reproduce
                the syndrome, so a returned correction always satisfies{' '}
                <code className="text-cyan-300">H · correction == syndrome (mod 2)</code>{' '}
                for any reachable syndrome.
              </li>
              <li>
                <strong className="text-primary">Batching.</strong> Prefer{' '}
                <code className="text-cyan-300">batch_decode_blossom</code> over repeated
                single calls — it decodes across all cores with the GIL released, so
                throughput scales with core count instead of round-trips.
              </li>
              <li>
                <strong className="text-primary">Licensing.</strong> Academic and personal
                use is free. Commercial use requires a licence — see{' '}
                <Link to="/pricing" className="text-cyan-300">Pricing</Link>.
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
