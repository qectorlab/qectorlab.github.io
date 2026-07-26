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
    desc: 'Decode a quantum error correction syndrome using any of 19 supported decoder types: UnionFind, FastUnionFind, Blossom, SparseBlossom, BPOSD, BatchedBp, LookupTable, Predecoded, Hybrid, Auto, SlidingWindow, Streaming, HybridCascade, NeuralPredecoder, GNNPredecoder, GNNBeliefMatcher.',
    required: ['check_to_qubits', 'syndrome'],
    optional: ['n_qubits', 'decoder_type', 'error_rate'],
    returns: 'correction (binary array matching n_qubits)',
  },
  {
    name: 'benchmark_decoder',
    desc: 'Run a performance latency benchmark for the selected decoder topology and return execution metrics.',
    required: ['check_to_qubits'],
    optional: ['n_qubits', 'n_samples', 'seed'],
    returns: 'latency percentiles, throughput, version, timestamp',
  },
  {
    name: 'get_decoder_info',
    desc: 'Report system version (v0.6.9), available decoder types, and compiled capabilities.',
    required: [],
    optional: [],
    returns: 'version ("0.6.9"), decoder_types, capabilities',
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
    "name": "decode_syndrome",
    "arguments": {
      "check_to_qubits": [[0, 1], [1, 2], [2, 3], [3, 4]],
      "n_qubits": 5,
      "syndrome": [0, 1, 0, 0],
      "decoder_type": "SparseBlossom"
    }
  }
}`;

const RESPONSE_EXAMPLE = `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{
      "type": "text",
      "text": "{\\n  \\"correction\\": [1, 1, 0, 0, 0]\\n}"
    }]
  }
}`;

export default function McpServer() {
  return (
    <>
      <SEO
        title="MCP Server · QECTOR Decoder v3"
        description="Model Context Protocol server for quantum error correction decoding. JSON-RPC 2.0 tools exposing 19 decoders including Union-Find, Blossom MWPM, BP-OSD, and GNN belief matchers to any MCP client."
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
            <h2 className="text-2xl font-bold mb-4">Operational & Hyperedge Guidance</h2>
            <ul className="space-y-3 text-secondary text-sm leading-relaxed">
              <li>
                <strong className="text-primary">Graph-like vs Hyperedge incidence.</strong>{' '}
                MCP <code className="text-cyan-300">decode_syndrome</code> validates that every qubit touches at most two checks (participation &le; 2). For graph-like codes (repetition, ring, Stim decomposed DEMs), all 19 decoders operate with 100% syndrome faithfulness.
              </li>
              <li>
                <strong className="text-primary">Surface Code / Hyperedge Workaround.</strong>{' '}
                For raw hyperedge check matrices (such as <code className="text-cyan-300">generate_surface_code_checks</code> where qubit participation &gt; 2), use the direct Python API (<code className="text-cyan-300">BlossomDecoder</code>, <code className="text-cyan-300">SparseBlossomDecoder</code>, <code className="text-cyan-300">BpOsdDecoder</code>, or <code className="text-cyan-300">AutoDecoder</code>) or decompose Stim circuit errors into a graph-like DEM via <code className="text-cyan-300">decompose_errors=True</code>.
              </li>
              <li>
                <strong className="text-primary">Syndrome Faithfulness &amp; Real Benchmark Sweep.</strong>{' '}
                Verified 100% syndrome-faithful across all tested distances d=3–19. Explore the raw trial data in the{' '}
                <a href="/json/benchmarks/mcp_sweep_v0.6.9.json" target="_blank" className="text-cyan-300 hover:underline">v0.6.9 MCP Sweep Dataset (JSON)</a>.
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
