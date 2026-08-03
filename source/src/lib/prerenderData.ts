// Prerender route data — the single source of truth for the static HTML shells
// emitted per route at build time (see ghPagesSpaShell in vite.config.ts).
//
// Why this exists: qector.store is a client-rendered SPA. Without prerendering,
// a non-JS fetch of any route returns an empty <div id="root"></div>, so
// crawlers, link previews, and AI agents see no content. At build time each
// route listed here gets its own dist/<route>/index.html with:
//   - a unique <title> and meta description
//   - canonical + Open Graph + Twitter tags pointing at the real URL
//   - JSON-LD structured data (WebPage + BreadcrumbList + page-specific nodes)
//   - a static, human-readable HTML summary inside <div id="root"> which React
//     replaces on mount (createRoot clears the container), so it is visible to
//     crawlers and no-JS browsers and invisible to users after hydration.
//
// Maintenance rule: adding a <Route> to App.tsx without adding a matching entry
// here fails the build loudly (the vite plugin errors out). Titles/descriptions
// should mirror the <SEO> props of the corresponding page component.

import { FAQ_ITEMS } from './faqData';

export const SITE_URL = 'https://qector.store';
export const SITE_NAME = 'QECTOR';
export const OG_IMAGE = 'https://qector.store/assets/og-image.png';
export const DECODER_VERSION = '0.7.0';
export const PYPI_URL = 'https://pypi.org/project/qector-decoder-v3/';
export const GITHUB_URL = 'https://github.com/GuillaumeLessard/qector-decoder';

export interface PrerenderRoute {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
  /** H1 used in the static body and BreadcrumbList. */
  heading: string;
  /** Static HTML injected into <div id="root"> for crawlers / no-JS agents. */
  body: string;
  /** Extra schema.org nodes appended to the page's JSON-LD @graph. */
  jsonLdExtra?: Record<string, unknown>[];
}

const abs = (path: string) => `${SITE_URL}${path === '/' ? '/' : path}`;

/* ---------- shared schema.org nodes ---------- */

const organizationNode = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL + '/',
  logo: `${SITE_URL}/assets/logo.svg`,
  sameAs: [GITHUB_URL, PYPI_URL],
};

const softwareNode = {
  '@type': 'SoftwareApplication',
  name: 'QECTOR Decoder v3',
  description:
    'Production-grade poly-algorithmic quantum error correction decoder for Python. Verified v0.7.0 benchmark set: peak 11.5M shots/s, 54/54 points with zero unfaithful corrections, 42/42 faithfulness cases.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Linux, macOS, Windows',
  programmingLanguage: 'Python',
  softwareVersion: DECODER_VERSION,
  url: SITE_URL + '/',
  downloadUrl: PYPI_URL,
  author: { '@type': 'Person', name: 'Guillaume Lessard', url: 'https://github.com/GuillaumeLessard' },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
};

const techArticleNode = (headline: string, description: string) => ({
  '@type': 'TechArticle',
  headline,
  description,
  author: { '@type': 'Person', name: 'Guillaume Lessard' },
  publisher: organizationNode,
});

/* ---------- static body helpers (inline styles: readable with or without CSS) ---------- */

const wrap = (inner: string) => `
<main id="prerendered" style="max-width:64rem;margin:0 auto;padding:7rem 1.5rem 4rem;font-family:Inter,system-ui,-apple-system,sans-serif;color:#e2e8f0;line-height:1.65;">
${inner}
</main>`;

const h1 = (text: string) =>
  `<h1 style="font-size:2.25rem;font-weight:800;letter-spacing:-0.02em;margin:0 0 1rem;color:#f1f5f9;">${text}</h1>`;

const p = (text: string) =>
  `<p style="font-size:1.05rem;color:#b6c2d2;margin:0 0 1.25rem;">${text}</p>`;

const h2 = (text: string) =>
  `<h2 style="font-size:1.3rem;font-weight:700;margin:1.75rem 0 0.75rem;color:#67e8f9;">${text}</h2>`;

const ul = (items: string[]) =>
  `<ul style="margin:0 0 1.25rem;padding-left:1.25rem;color:#b6c2d2;">${items.map((i) => `<li style="margin-bottom:0.4rem;">${i}</li>`).join('')}</ul>`;

const pre = (code: string) =>
  `<pre style="background:#0b1329;border:1px solid #1e2a45;border-radius:0.75rem;padding:1rem;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:0.85rem;color:#67e8f9;overflow-x:auto;margin:0 0 1.25rem;">${code}</pre>`;

const table = (head: string[], rows: string[][]) =>
  `<table style="width:100%;border-collapse:collapse;margin:0 0 1.25rem;font-size:0.9rem;"><thead><tr>${head
    .map((h) => `<th style="text-align:left;padding:0.5rem 0.75rem;border-bottom:1px solid #1e2a45;color:#67e8f9;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em;">${h}</th>`)
    .join('')}</tr></thead><tbody>${rows
    .map(
      (r) =>
        `<tr>${r.map((c) => `<td style="padding:0.5rem 0.75rem;border-bottom:1px solid #141d33;color:#b6c2d2;">${c}</td>`).join('')}</tr>`
    )
    .join('')}</tbody></table>`;

const NAV_LINKS: [string, string][] = [
  ['/', 'Home'],
  ['/decoder', 'Decoder'],
  ['/benchmarks', 'Benchmarks'],
  ['/evidence', 'Evidence'],
  ['/pricing', 'Pricing'],
  ['/installer', 'Install'],
  ['/docs', 'Docs'],
  ['/changelog', 'Changelog'],
  ['/contact', 'Contact'],
];

const nav = () =>
  `<nav style="margin-top:2.5rem;padding-top:1.25rem;border-top:1px solid #1e2a45;font-size:0.9rem;">${NAV_LINKS.map(
    ([href, label]) => `<a href="${href}" style="color:#67e8f9;margin-right:1rem;text-decoration:none;">${label}</a>`
  ).join('')}</nav>`;

const page = (inner: string) => wrap(inner + nav());

/* ---------- route definitions ---------- */

export const PRERENDER_ROUTES: PrerenderRoute[] = [
  {
    path: '/',
    title: 'QECTOR · Production-Grade Quantum Error Correction Decoding for Python',
    description:
      'QECTOR Decoder v3 - Production-grade Python library for quantum error correction decoding. 16 decoder classes, verified v0.7.0 benchmark set: 54/54 points with zero unfaithful corrections, peak 11.5M shots/s.',
    heading: 'Production-Grade QEC Decoding for Python',
    body: page(
      h1('Production-Grade QEC Decoding for Python') +
        p(
          'QECTOR Decoder v3 is a Rust-core Python library of 16 production and research quantum error correction decoders — MWPM Blossom, Belief-Matching, BP-OSD, Union-Find, GPU batch and more — behind one consistent API, with a verified v0.7.0 benchmark set.'
        ) +
        pre(
          `pip install qector-decoder-v3==${DECODER_VERSION}\n\nimport numpy as np\nfrom qector_decoder_v3 import BlossomDecoder\ndecoder = BlossomDecoder([[0, 1], [1, 2], [2, 3], [3, 4]], n_qubits=5)\ncorrection = decoder.decode(np.array([0, 1, 0, 0], dtype=np.uint8))`
        ) +
        h2('Verified v0.7.0 benchmark set') +
        ul([
          'Peak 11,540,387 shots/s (FastUnionFind, 5-qubit repetition code, package MCP server).',
          '54/54 benchmark points with zero unfaithful corrections (repetition n=5–65, ring n=16–48).',
          '42/42 syndrome-faithfulness cases passed.',
          '13 MCP tools operational (MCP stdio, JSON-RPC 2.0).',
          'PyMatching is comparable and often slightly ahead on synchronized batch decoding — QECTOR\u2019s value is multi-algorithm diversity and reproducibility.',
        ]) +
        h2('The decoders') +
        p(
          'UnionFind, FastUnionFind, Blossom MWPM, SparseBlossom, BeliefMatching, BP-OSD (qLDPC), batch decoders (CPU / CUDA / OpenCL), AutoDecoder (7-tier fallback), plus colour-code, two-stage and ambiguity-cluster decoders.'
        ) +
        h2('Evidence') +
        ul([
          `PyPI package: <a href="${PYPI_URL}" style="color:#67e8f9;">qector-decoder-v3 ${DECODER_VERSION}</a>`,
          `Artifacts and reproduction harness: <a href="${GITHUB_URL}" style="color:#67e8f9;">github.com/GuillaumeLessard/qector-decoder</a>`,
          'Verified set (REPORT.md, summary.json, benchmarks.csv, VERIFIED_APPLE_TO_APPLE_REPORT.pdf) published at /benchmarks/v0.7.0/. Pre-v0.7.0 comparison tables are formally withdrawn.',
        ])
    ),
    jsonLdExtra: [
      { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL + '/' },
      organizationNode,
      softwareNode,
    ],
  },
  {
    path: '/decoder',
    title: 'QECTOR Decoder v3 · Production-Grade QEC Decoding for Python',
    description:
      'QECTOR Decoder v3 - 16 decoder classes in a single Python library. Verified v0.7.0 benchmark set: 54/54 points with zero unfaithful corrections, peak 11.5M shots/s, native GPU batch decoding.',
    heading: 'QECTOR Decoder v3',
    body: page(
      h1('QECTOR Decoder v3') +
        p(
          'Rust-core Python library implementing 16 decoder classes from exact MWPM to GPU batch. Verified v0.7.0 benchmark set: peak 11.5M shots/s, 54/54 points with zero unfaithful corrections, 42/42 faithfulness cases. Stim-native, PyPI binary wheels, artifacts published on GitHub.'
        ) +
        h2('Production decoders') +
        ul([
          '<strong>BlossomDecoder</strong> — exact minimum-weight perfect matching for graph-like codes.',
          '<strong>BeliefMatching</strong> — BP preprocessing + reweighted exact MWPM.',
          '<strong>BpOsdDecoder</strong> — belief propagation + ordered statistics decoding for qLDPC codes.',
          '<strong>UnionFindDecoder / FastUnionFindDecoder</strong> — near-linear approximate decoding; high-throughput option for graph-like codes.',
          '<strong>SparseBlossomDecoder</strong> — region-growing near-optimal matching.',
          '<strong>BatchDecoder / CPUBatchDecoder / CUDABatchDecoder / OpenCLBatchDecoder</strong> — native GPU batch pipelines.',
          '<strong>AutoDecoder</strong> — 7-tier backend fallback (CUDA → OpenCL → CPU Rayon → CPU Batch → CPU Single → Blossom → Lookup/Python).',
        ]) +
        h2('Research-stage decoders') +
        ul([
          'HybridDecoder', 'PredecodedDecoder', 'ColourCodeDecoder', 'TwoStageDecoder', 'AmbiguityClusterDecoder', 'DecoderPool', 'LERBenchmark',
        ]) +
        h2('Technical specifications') +
        table(
          ['Key', 'Value'],
          [
            ['Languages', 'Rust core (PyO3) / Python 3.9–3.13 API'],
            ['Platforms', 'Linux x86_64, macOS ARM64/x86_64, Windows x64'],
            ['GPU', 'CUDA 11.8+ / OpenCL 2.0+ (optional)'],
            ['QEC library', 'Stim / Sinter / PyMatching compatible'],
            ['Packaging', 'PyPI binary wheels (manylinux, macOS, Windows) + sdist'],
            ['License', 'PolyForm Noncommercial 1.0.0 (community) / Commercial'],
          ]
        ) +
        pre(`pip install qector-decoder-v3==${DECODER_VERSION}`)
    ),
    jsonLdExtra: [{ ...softwareNode, url: abs('/decoder') }],
  },
  {
    path: '/benchmarks',
    title: 'Benchmarks · QECTOR',
    description:
      'Verified v0.7.0 benchmark set: peak 11.5M shots/s, 54/54 points with zero unfaithful corrections, 42/42 faithfulness cases, 13 MCP tools. Four reproducible artifacts, apple-to-apple vs PyMatching.',
    heading: 'Verified v0.7.0 Benchmarks',
    body: page(
      h1('Verified v0.7.0 Benchmarks') +
        p(
          'One set, four artifacts, fully reproducible. Measured with the qector-decoder-v3 0.7.0 package MCP server on Linux (glibc 2.35, Python 3.12.13) at 2026-08-02T05:59:13Z. Published as benchmarks.csv, REPORT.md, summary.json, and VERIFIED_APPLE_TO_APPLE_REPORT.pdf.'
        ) +
        h2('Headline numbers') +
        ul([
          'Peak throughput: 11,540,387 shots/s (FastUnionFind, 5-qubit repetition code, 8,000 samples).',
          '54/54 benchmark points with zero unfaithful corrections (repetition n=5–65, ring n=16–48).',
          '42/42 syndrome-faithfulness cases passed.',
          '13 MCP tools operational (MCP stdio, JSON-RPC 2.0).',
        ]) +
        h2('vs PyMatching — verified apple-to-apple') +
        p(
          'Synchronized CPU batch comparison: QECTOR is comparable to PyMatching; PyMatching is often slightly ahead on the synchronized batch. No speedup multiplier is claimed. The verified report is published as VERIFIED_APPLE_TO_APPLE_REPORT.pdf.'
        ) +
        h2('Withdrawn tables') +
        p(
          'Four pre-v0.7.0 comparison tables published in earlier documentation (MWPM parity vs PyMatching at d=13/15, Belief-Matching LER gain at d=5/7, GPU bit-identity, native memory profile) are formally withdrawn. Do not cite them; no benchmark figures are published for this release beyond the verified set.'
        ) +
        h2('Run it yourself') +
        pre(
          `pip install "qector-decoder-v3==${DECODER_VERSION}[bench]"\nqector benchmark --verify\npython -m qector.validate`
        ) +
        ul([
          `GitHub artifacts: <a href="${GITHUB_URL}" style="color:#67e8f9;">${GITHUB_URL.replace('https://', '')}</a>`,
          'Artifacts also published at /benchmarks/v0.7.0/ (REPORT.md, summary.json, benchmarks.csv, PDF).',
        ])
    ),
    jsonLdExtra: [
      techArticleNode(
        'QECTOR Verified v0.7.0 Benchmark Set',
        'Peak 11.5M shots/s (FastUnionFind, 5-qubit repetition code), 54/54 points with zero unfaithful corrections, 42/42 faithfulness cases, 13 MCP tools; apple-to-apple vs PyMatching with no speedup multiplier claimed.'
      ),
    ],
  },
  {
    path: '/evidence',
    title: 'Evidence & Reports · QECTOR',
    description:
      'Validation reports, reproducible artifacts, and evidence bundles for QECTOR quantum error correction decoder. SHA-256 sealed on GitHub.',
    heading: 'Evidence & Reports',
    body: page(
      h1('Evidence & Reports') +
        p(
          'Every public claim is backed by a verifiable artifact: validation reports, benchmark data, SHA-256 manifests, and IBM hardware job IDs — archived with the decoder source on GitHub.'
        ) +
        h2('Verified v0.7.0 artifact set') +
        ul([
          'REPORT.md — v0.7.0 self-benchmark report (Linux glibc 2.35, Python 3.12.13): 13 MCP tools, 54 benchmark points, 0 unfaithful, 42/42 faithfulness cases.',
          'summary.json — machine-readable benchmark summary (timestamp 2026-08-02T05:59:13Z).',
          'benchmarks.csv — full 54-row sweep: repetition n=5–65 and ring n=16–48, six decoder kinds.',
          'VERIFIED_APPLE_TO_APPLE_REPORT.pdf — synchronized vs PyMatching: comparable, PyMatching often slightly ahead on the batch; no speedup multiplier claimed.',
          'Pre-v0.7.0 comparison tables (MWPM parity, Belief-Matching gain, GPU bit-identity, optimal-shot analysis) are formally withdrawn — do not cite them.',
        ]) +
        pre(
          `pip install qector-decoder-v3==${DECODER_VERSION}\npython -c "import qector_decoder_v3 as qd; print(qd.__version__)"\n\ngit clone ${GITHUB_URL}`
        )
    ),
    jsonLdExtra: [
      techArticleNode(
        'QECTOR Evidence & Validation Reports',
        'Verified v0.7.0 artifact set: REPORT.md, summary.json, benchmarks.csv, and the apple-to-apple PyMatching PDF. Pre-v0.7.0 comparison tables formally withdrawn.'
      ),
    ],
  },
  {
    path: '/workbench',
    title: 'Workbench · QECTOR',
    description:
      'QECTOR Workbench v0.5.2 — free desktop GUI and MCP server for QECTOR Decoder v3. Windows portable exe and Linux .deb, 56 MCP tools, 16 decoders, 10 code families. Self-contained: no system Python, pip, or internet required.',
    heading: 'QECTOR Workbench v0.5.2',
    body: page(
      h1('QECTOR Workbench v0.5.2') +
        p(
          'Free desktop application (CustomTkinter GUI) and Model Context Protocol server for QECTOR Decoder v3: 56 MCP tools, 16 decoders, 10 code families including qLDPC and colour codes, and a visual circuit builder. Ships as a portable Windows x64 executable and native Linux x64 Debian packages, each fully self-contained — it bundles its own Python runtime, the scientific stack, and the qector_decoder_v3 0.7.0 wheel, so no system Python, pip, internet connection, or update check is required. No macOS build is currently published.'
        ) +
        h2('Downloads') +
        ul([
          'Windows x64 — portable <code>QectorWorkbench-Portable.exe</code>, no installer and no admin rights: <a href="https://github.com/qectorlab/qector-decoder-workbench-windows/releases/latest" style="color:#67e8f9;">github.com/qectorlab/qector-decoder-workbench-windows</a>',
          'Linux x64 — Debian packages for Ubuntu/Debian/Mint and antiX/MX: <a href="https://github.com/qectorlab/qector-decoder-workbench-linux/releases/latest" style="color:#67e8f9;">github.com/qectorlab/qector-decoder-workbench-linux</a>',
          'Headless MCP server on either platform: <code>--mcp</code> (56-tool stdio JSON-RPC 2.0, no display needed).',
          'Linux baseline glibc 2.31: Ubuntu 20.04+, Debian 11+, Mint 20+, antiX 21+ / MX 21+, Fedora 32+, openSUSE Leap 15.3+.',
          'SHA-256 checksums for every released file are published in the release notes.',
        ]) +
        h2('Modules') +
        p(
          'Eight modules ship in v0.5.2: Code Explorer (build and inspect codes, Tanner graph and parity-check matrix views, decoder recommendation), Decoder Lab (interactive decode runs with syndrome-validity and logical-failure reporting), Benchmark (throughput and latency percentiles with JSON export and session comparison), Batch &amp; Streaming (batch decoding and sliding-window streaming, with cpu / cpu_parallel / cuda / opencl backend probing), Hardware, Diagnostics, Documentation, and Console.'
        ) +
        h2('Measured Benchmarks (13 of 16 decoders)') +
        table(
          ['Decoder Kind', 'Throughput', 'p50 Latency', 'LER (d=5)', 'Compatibility'],
          [
            ['hybrid_cascade', '362,845 decodes/s', '2.60 µs', '0.10', 'Graphlike'],
            ['fast_union_find', '349,895 decodes/s', '2.40 µs', '0.10', 'Graphlike'],
            ['lookup_table', '337,610 decodes/s', '2.40 µs', '0.10', 'Small (<20 checks)'],
            ['union_find', '295,508 decodes/s', '2.40 µs', '0.10', 'Graphlike'],
            ['blossom', '261,917 decodes/s', '2.90 µs', '0.08', 'Universal (PyMatching Parity)'],
            ['sparse_blossom', '146,757 decodes/s', '4.05 µs', '0.08', 'Graphlike'],
            ['hybrid', '138,812 decodes/s', '4.10 µs', '0.08', 'Graphlike'],
            ['predecoded', '82,850 decodes/s', '12.00 µs', '0.08', 'Graphlike'],
            ['auto', '61,125 decodes/s', '13.60 µs', '0.10', 'Graphlike'],
            ['bp_osd', '26,162 decodes/s', '34.75 µs', '0.10', 'Universal / qLDPC'],
            ['gnn_belief_matching', '6,520 decodes/s', '147.15 µs', '0.08', 'Graphlike'],
            ['belief_matching', '1,001 decodes/s', '988.05 µs', '0.02 (Best)', 'Universal'],
            ['auto_router', '40 decodes/s', '25.45 ms', '0.08', 'Universal Policy Router'],
          ]
        ) +
        h2('10 Quantum Code Families') +
        p('Workbench v0.5.2 covers 10 code families including qLDPC and colour codes:') +
        ul([
          'repetition — 1D chain parity-check code.',
          'ring — Periodic 1D chain.',
          'rotated_surface — Standard rotated surface code.',
          'unrotated_surface — Square lattice surface code.',
          'toric — Toric code with periodic boundaries.',
          'heavy_hex — IBM heavy-hex lattice.',
          'hypergraph_product — CSS code from repetition seed.',
          'bicycle — qLDPC bicycle code.',
          'bivariate_bicycle — IBM bivariate bicycle presets (qLDPC).',
          'color_code — triangular colour code.',
        ]) +
        h2('Benchmark policy') +
        p(
          'No benchmark figures are published for this release beyond the verified v0.7.0 set at /benchmarks (REPORT.md, summary.json, benchmarks.csv, VERIFIED_APPLE_TO_APPLE_REPORT.pdf). The Workbench ships a benchmark harness so you can measure on your own hardware.'
        ) +
        h2('Documentation &amp; reference') +
        ul([
          `User Manual &amp; Licensing — <a href="${SITE_URL}/manual" style="color:#67e8f9;">${SITE_URL.replace('https://', '')}/manual</a>`,
          `Performance Benchmarks — <a href="${SITE_URL}/benchmarks" style="color:#67e8f9;">${SITE_URL.replace('https://', '')}/benchmarks</a>`,
          `Architecture &amp; Technical Reference — <a href="${SITE_URL}/technical-reference" style="color:#67e8f9;">${SITE_URL.replace('https://', '')}/technical-reference</a>`,
        ])
    ),
  },
  {
    path: '/pricing',
    title: 'Pricing · QECTOR',
    description:
      'QECTOR Decoder v3 commercial licensing. $499 one-time 60-day evaluation, fully creditable. Annual production tiers $1,299 to $28,000+. Enterprise and OEM available. Prices in USD.',
    heading: 'Pricing & Licensing',
    body: page(
      h1('Pricing & Licensing') +
        p(
          'QECTOR Decoder v3 is source-available: free for non-commercial, academic, and personal use under PolyForm Noncommercial 1.0.0. Commercial deployment requires a paid license. All prices are in US dollars (USD) and exclude tax.'
        ) +
        table(
          ['Tier', 'Price (USD)', 'Seats', 'Use case'],
          [
            ['Community (non-commercial)', '$0', 'Unlimited', 'Research, academic, personal projects'],
            ['Commercial evaluation', '$499 one-time', 'Unlimited internal', '60-day evaluation and pilot work. Not production. 100% creditable toward an annual tier bought within 90 days'],
            ['Solo / Indie commercial', '$1,299 / yr', '1 named user', 'Production internal use, priority email support'],
            ['Solo / Indie perpetual', '$3,299 one-time', '1 named user', 'Same rights as annual for the major version purchased, patch updates included'],
            ['Startup / Growth', '$4,499 / yr', 'Up to 10', 'Production internal use, advanced BP-OSD/LDPC workflows'],
            ['Professional / Lab', '$11,500 / yr', 'Up to 25', 'Production internal use, SLA, validation report package credit'],
            ['Enterprise R&amp;D', 'from $28,000 / yr', 'Unlimited', 'Dedicated support engineer, custom builds, Rust source access on request'],
            ['Enterprise / OEM / SaaS', 'Custom', 'Custom', 'Redistribution, SaaS hosting, customer-facing APIs, hardware bundling'],
          ]
        ) +
        p(
          '<strong>Tax:</strong> prices are in USD and exclude tax; Stripe adds applicable sales tax, GST/HST, or VAT at checkout based on your billing location. <strong>Delivery:</strong> your license token is emailed within 10 minutes of payment — check your spam folder before contacting support. <strong>Refunds:</strong> tokens are delivered instantly, so all sales are final — see the <a href="/refund" style="color:#67e8f9;">refund policy</a>; the $499 evaluation is the creditable way to try before committing.'
        ) +
        h2('Activating your license') +
        p(
          'Everyone installs the same wheel — there is no separate commercial build and no feature gating. If <code>QECTOR_LICENSE</code> is unset a licensing notice prints on import, which is expected for non-commercial use. Setting the token stops the notice; decoding runs either way, with no hard stop.'
        ) +
        pre(
          `# Commercial use: activate with the Ed25519 token from your licence email\nexport QECTOR_LICENSE="<your-token>"\n\n# Optional: suppress the licensing notice in CI logs\nexport QECTOR_SILENT=1\n\n# Verification is offline against a public key in the package.\n# No licence server, no phone-home, works air-gapped.`
        ) +
        h2('Frequently asked questions') +
        FAQ_ITEMS.map(
          (f) => `<h3 style="font-size:1rem;font-weight:600;color:#f1f5f9;margin:1rem 0 0.25rem;">${f.q}</h3><p style="color:#b6c2d2;margin:0 0 0.5rem;">${f.a}</p>`
        ).join('') +
        p('Contact: <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>')
    ),
    jsonLdExtra: [
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  },
  {
    path: '/commercial',
    title: 'Enterprise Licensing · QECTOR',
    description:
      'Enterprise and OEM licenses for QECTOR Decoder v3. Custom agreements for redistribution, SaaS hosting, and hardware bundling.',
    heading: 'Enterprise & OEM Licensing',
    body: page(
      h1('Enterprise & OEM Licensing') +
        p(
          'Standard tiers cover internal use. Enterprise agreements cover redistribution, SaaS hosting, OEM integration, hardware bundling, and commercial benchmarking — with written contracts, SLAs, and procurement-friendly paperwork (W-8/W-9, vendor profiles, signed EULAs).'
        ) +
        ul([
          'Custom scope: seats, sites, subsidiaries, and redistribution rights.',
          'Priority support with response SLAs and integration guidance.',
          'IBM Quantum hardware evaluation pathway under commercial pilot.',
          'Academic institutions: 40% discount on annual tiers.',
        ]) +
        p('Contact <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a> or see <a href="/pricing" style="color:#67e8f9;">pricing</a>.')
    ),
  },
  {
    path: '/guillaume-lessard',
    title: 'Guillaume Lessard · Founder of QECTOR and iD01t Productions',
    description:
      'Guillaume Lessard, self-taught developer, author, and independent researcher in Longueuil, Québec. Founder of iD01t Productions and author of the QECTOR Decoder v3 quantum error correction library. ORCID 0009-0000-3465-3753.',
    heading: 'Guillaume Lessard',
    body: page(
      h1('Guillaume Lessard') +
        p(
          'Founder, developer, author and independent researcher, based in Longueuil, Québec. I build QECTOR: I left formal schooling at sixteen and taught myself to write software, and a bit over two decades later I write Rust decoders for quantum error correction, publish the benchmarks behind every claim, and ship the whole thing myself.'
        ) +
        h2('Making sure you have the right Guillaume Lessard') +
        p(
          'It is a common Québécois name shared by several accomplished people — including a compiler engineer working on the Swift language and a real-estate executive. None of them are me, and I claim none of their work. The identifiers below are the ones I control.'
        ) +
        table(
          ['Identifier', 'Value'],
          [
            ['ORCID', `<a href="https://orcid.org/0009-0000-3465-3753" style="color:#67e8f9;">0009-0000-3465-3753</a>`],
            ['GitHub', `<a href="https://github.com/qectorlab" style="color:#67e8f9;">github.com/qectorlab</a>`],
            ['PyPI', `<a href="${PYPI_URL}" style="color:#67e8f9;">qector-decoder-v3</a>`],
            ['Studio', `<a href="https://id01t.store/" style="color:#67e8f9;">iD01t Productions</a>, Longueuil, Québec (founded 2023)`],
            ['itch.io', `<a href="https://id01t.itch.io/" style="color:#67e8f9;">id01t.itch.io</a>`],
            ['Email', `<a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>`],
          ]
        ) +
        h2('Background') +
        p(
          'No degree. I left school at sixteen and learned to program because I wanted to make things that worked. That has been the method ever since: pick the problem, learn what it requires, ship the result, publish the evidence. Over the last twenty years that has meant 167+ eBooks, 103 audiobooks, independently released desktop tools and games, and six albums plus twenty-three singles as DJ iD01T across 2024–2025. iD01t Productions was founded in 2023 to put all of it under one roof; it is still one person.'
        ) +
        h2('Skills') +
        ul([
          'Systems and performance — Rust, PyO3 bindings, CUDA / OpenCL batch kernels, memory-layout and throughput tuning.',
          'Python engineering — Python 3.9–3.13, NumPy/SciPy, binary wheel packaging across manylinux/macOS/Windows, PyPI release engineering, sigstore attestation.',
          'Quantum error correction — MWPM/Blossom matching, Union-Find, belief propagation with OSD for qLDPC, Stim/Sinter/PyMatching integration, reproducible benchmark design.',
          'Applications and desktop — CustomTkinter GUI, self-contained runtime bundling, PyInstaller / Inno Setup / .deb packaging, Model Context Protocol servers, offline-first architecture.',
          'Web and product — React, TypeScript, Vite, Tailwind, structured data and SEO, Stripe commerce integration.',
          'Writing and publishing — technical documentation, long-form instructional writing, audiobook production, electronic music production.',
        ]) +
        h2('Selected work') +
        ul([
          `<a href="/decoder" style="color:#67e8f9;">QECTOR Decoder v3</a> — Rust-core Python library, 20+ decoder families, exact MWPM parity with PyMatching d=3–15.`,
          `<a href="/workbench" style="color:#67e8f9;">QECTOR Workbench v0.5.2</a> — free desktop GUI and 56-tool MCP server for Windows and Linux.`,
          `<a href="/benchmarks" style="color:#67e8f9;">Published benchmark corpus</a> — 1,858 timing measurements across 6 topologies.`,
          'Mastering QEC and the QEC Academy instructional series; SATI CODEX and the LCL-832/833 corpora, signed through ORCID and Zenodo.',
        ]) +
        p('Book a 30-minute call: <a href="https://calendly.com/qector-info/30min" style="color:#67e8f9;">calendly.com/qector-info/30min</a> · <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>')
    ),
    jsonLdExtra: [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/guillaume-lessard#person`,
        name: 'Guillaume Lessard',
        givenName: 'Guillaume',
        familyName: 'Lessard',
        identifier: '0009-0000-3465-3753',
        jobTitle: 'Founder, Developer and Independent Researcher',
        description:
          'Self-taught developer, author and independent researcher. Founder of iD01t Productions and author of the QECTOR Decoder v3 quantum error correction library.',
        image: `${SITE_URL}/assets/g.png`,
        url: `${SITE_URL}/guillaume-lessard`,
        email: 'admin@qector.store',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '2004 De Lorimier',
          addressLocality: 'Longueuil',
          addressRegion: 'QC',
          postalCode: 'J4K 3H7',
          addressCountry: 'CA',
        },
        worksFor: {
          '@type': 'Organization',
          name: 'iD01t Productions',
          url: 'https://id01t.store/',
          foundingDate: '2023',
        },
        knowsAbout: [
          'Quantum error correction',
          'Minimum-weight perfect matching decoders',
          'Belief propagation and OSD decoding',
          'Rust',
          'Python',
          'GPU batch computing',
          'Technical writing',
        ],
        sameAs: [
          'https://orcid.org/0009-0000-3465-3753',
          'https://github.com/GuillaumeLessard',
          'https://github.com/qectorlab',
          PYPI_URL,
          'https://id01t.itch.io/',
          'https://id01t.store/',
          'https://www.linkedin.com/in/qector/',
        ],
      },
    ],
  },
  {
    path: '/about',
    title: 'About · QECTOR',
    description:
      'About QECTOR: Guillaume Lessard, iD01t Productions, QEC research background, ORCID, GitHub artifacts, mission and engineering philosophy.',
    heading: 'About QECTOR',
    body: page(
      h1('About QECTOR') +
        p(
          'QECTOR is built by Guillaume Lessard (ORCID 0009-0000-3465-3753) / iD01t Productions. The project focuses on one thing: a production-grade, honestly-benchmarked quantum error correction decoder for Python.'
        ) +
        ul([
          'Every published number is part of the verified v0.7.0 artifact set and linked to a public artifact; pre-v0.7.0 comparison tables are formally withdrawn.',
          'IBM Quantum hardware runs are real but limited in scope; job IDs are published with the evidence.',
          'SATI CODEX / LCL-833 theoretical work is research context — the shipping product is the decoder and its workbench.',
        ]) +
        p('Contact: <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>')
    ),
  },
  {
    path: '/sati-os',
    title: 'SATI OS · Technology Integrated into QECTOR Workbench',
    description:
      'SATI OS technology is integrated into QECTOR Workbench v0.5.2 and QECTOR Decoder v3. Explore the free desktop application.',
    heading: 'SATI OS Technology Integrated',
    body: page(
      h1('SATI OS → QECTOR Workbench') +
        p(
          'SATI OS features are fully integrated into QECTOR Workbench v0.5.2 and QECTOR Decoder v3. The desktop GUI, 56-tool MCP server, 16 decoders, and 10 code families are available directly in the free QECTOR Workbench desktop application for Windows x64 and Linux x64.'
        ) +
        p('Explore the <a href="/workbench" style="color:#67e8f9;">QECTOR Workbench page</a>.')
    ),
  },
  {
    path: '/changelog',
    title: 'Changelog · QECTOR',
    description:
      'Version history for QECTOR Decoder v3. Current release: v0.7.0 with the verified benchmark set; pre-v0.7.0 comparison tables formally withdrawn. PyPI release train.',
    heading: 'Changelog',
    body: page(
      h1('Changelog') +
        h2('v0.7.0 — 2026-07-24 (current)') +
        ul([
          'Production release with benchmark suite, hyper saturation suite, and Stripe live integration.',
          'MCP Server integration (MCP stdio, JSON-RPC 2.0) exposing 13 verified tools.',
          '200-status route shells for all application routes and the /success checkout flow.',
          'Verified benchmark set published: 54/54 points with zero unfaithful corrections, 42/42 faithfulness cases, peak 11.5M shots/s. Pre-v0.7.0 comparison tables formally withdrawn.',
        ]) +
        h2('v0.6.8 — 2026-07-22') +
        ul([
          'CUDA decoder row-identical to CPU Union-Find at d=3–19; faithfulness H·c = s on 100% of shots.',
          'Benchmark release: SVG charts, JSON data files, full PDF report; peak 13.49M shots/s CUDA, 5.21M shots/s CPU — withdrawn with the v0.7.0 verified set, do not cite.',
          'Edge-hardware dataset published (v0.6.8) — withdrawn, do not cite.',
        ]) +
        h2('Earlier') +
        p('v0.5.x release train: GPU batch decoder, Belief-Matching configurable BP iterations, BP-OSD for qLDPC, sigstore-attested wheels, initial public PyPI release. Full history on the PyPI project page.')
    ),
  },
  {
    path: '/contact',
    title: 'Contact · QECTOR',
    description:
      'Contact QECTOR · commercial inquiries, technical support schedules, and evaluation requests.',
    heading: 'Contact',
    body: page(
      h1('Contact') +
        ul([
          'General & support: <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>',
          'Licensing & procurement: <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>',
          `Decoder artifacts & issues: <a href="${GITHUB_URL}" style="color:#67e8f9;">github.com/GuillaumeLessard/qector-decoder</a>`,
        ]) +
        p('Typical response time: 1 business day for licensing, 2 business days for evaluation support.')
    ),
  },
  {
    path: '/docs',
    title: 'Documentation · QECTOR',
    description:
      'Documentation hub for QECTOR quantum error correction decoder. API reference, user manual, installation guides, and validation reports.',
    heading: 'Documentation',
    body: page(
      h1('Documentation Hub') +
        ul([
          '<a href="/installer" style="color:#67e8f9;">Installation guide</a> — pip install on Linux, macOS, Windows.',
          '<a href="/manual" style="color:#67e8f9;">User manual</a> — configuration, decoder selection, benchmarking, troubleshooting.',
          '<a href="/technical-reference" style="color:#67e8f9;">Technical reference</a> — API parameters and module documentation.',
          `<a href="${PYPI_URL}" style="color:#67e8f9;">PyPI project page</a> — canonical package documentation.`,
          `<a href="${GITHUB_URL}" style="color:#67e8f9;">GitHub repository</a> — source, artifacts, validation harness.`,
        ]) +
        p('Stim, PyMatching, Sinter, and Qiskit compatible.')
    ),
  },
  {
    path: '/manual',
    title: 'User Manual · QECTOR',
    description:
      'Complete user manual for QECTOR Decoder v3. Installation, configuration, decoder selection, benchmarking, and troubleshooting.',
    heading: 'User Manual',
    body: page(
      h1('User Manual') +
        p(
          'Complete manual for QECTOR Decoder v3: installation, license-token configuration (QECTOR_LICENSE, offline Ed25519 verification), decoder selection by code family, Stim/Sinter integration, batch and GPU decoding, and troubleshooting.'
        ) +
        table(
          ['Decoder', 'Target code', 'Speed', 'Accuracy', 'Tier'],
          [
            ['Blossom (MWPM)', 'CSS, Surface', 'Fast (UF pre-match)', 'Exact optimal', 'Production'],
            ['Belief-Matching', 'CSS, Surface', 'Moderate', 'High', 'Production'],
            ['BP-OSD', 'qLDPC, LDPC', 'Moderate', 'Optimal for qLDPC', 'Production'],
            ['Union-Find', 'Large surface', 'Near-linear O(N)', 'Approximate', 'Production'],
            ['GPU Batch', 'Any (batch)', 'High throughput', 'Identical to CPU', 'Production'],
            ['Hybrid / Cascade', 'Degenerate, mixed', 'Iterative', 'High', 'Research'],
            ['GNN Belief Matcher', 'Surface, research', 'Slow (offline)', 'Neural-enhanced', 'Research'],
          ]
        )
    ),
  },
  {
    path: '/technical-reference',
    title: 'Technical Reference · QECTOR',
    description:
      'API reference, decoder parameters, and technical documentation for QECTOR quantum error correction decoder.',
    heading: 'Technical Reference',
    body: page(
      h1('Technical Reference') +
        p(
          'API reference for qector_decoder_v3 0.7.0 package: stable and experimental decoders, utilities, and helper functions.'
        ) +
        h2('Stable decoders') +
        p('UnionFindDecoder, FastUnionFindDecoder, BlossomDecoder, SparseBlossomDecoder, BeliefMatching, BpOsdDecoder, BatchDecoder, CPUBatchDecoder, CUDABatchDecoder, OpenCLBatchDecoder, AutoDecoder (7-tier fallback), DecoderPool, get_decoder, clear_decoder_cache, decode_mmap, DecodeResult, decode_with_diagnostics, Workbench.') +
        h2('Experimental / research decoders') +
        p('HybridDecoder, HybridCascadeDecoder (full-feature / source build; public wheels may raise unavailable), PredecodedDecoder, ColourCodeDecoder, TwoStageDecoder, AmbiguityClusterDecoder, DecoderPool, LERBenchmark.') +
        h2('Utilities &amp; integration') +
        p('stim_compat.from_stim_detector_error_model, sinter_compat.qector_sinter_decoders, codes helpers, license.verify_license_token, run_mcp_server.') +
        pre(
          `from qector_decoder_v3 import UnionFindDecoder, BlossomDecoder\nfrom qector_decoder_v3.stim_compat import from_stim_detector_error_model`
        )
    ),
  },
  {
    path: '/installer',
    title: 'Installation · QECTOR',
    description:
      'Install QECTOR Decoder v3 on Linux, macOS, or Windows. PyPI pip install with binary wheels, Python 3.9–3.13.',
    heading: 'Installation',
    body: page(
      h1('Installation') +
        p('QECTOR Decoder v3 ships as a Rust-compiled Python wheel for Python 3.9–3.13 on Linux x86_64, macOS (ARM64/x86_64), and Windows x64.') +
        pre(
          `pip install qector-decoder-v3==${DECODER_VERSION}\n\n# Optional extras\npip install "qector-decoder-v3[stim]"   # Stim / Sinter / PyMatching / LDPC\npip install "qector-decoder-v3[bench]"  # Benchmark harness\npip install "qector-decoder-v3[all]"    # Full environment\n\n# Verify\npython -c "import qector_decoder_v3 as qd; print(qd.__version__)"`
        ) +
        ul([
          'Linux: manylinux2014 wheels (Ubuntu 20.04+, Debian 11+, RHEL 8+).',
          'macOS: universal2 wheels, macOS 12+.',
          'Windows: 10/11 x64 wheels; GPU batch requires NVIDIA CUDA 11.8+.',
        ])
    ),
  },
  {
    path: '/license',
    title: 'License · QECTOR',
    description:
      'QECTOR Decoder v3 is licensed under PolyForm Noncommercial License 1.0.0. Commercial licenses available.',
    heading: 'License',
    body: page(
      h1('License') +
        p(
          'QECTOR Decoder v3 is source-available under the PolyForm Noncommercial License 1.0.0: free for personal, academic, and non-commercial research use. Company use, funded institutional work, SaaS, OEM integration, redistribution, or commercial benchmarking requires a commercial license.'
        ) +
        h2('Commercial addendum — what a paid licence changes') +
        ul([
          'Grants the commercial use that PolyForm Noncommercial withholds, for the seats and term you purchased.',
          'Internal use only. Redistribution, sublicensing, OEM bundling, and customer-facing SaaS or hosted APIs are excluded unless a written Enterprise/OEM agreement grants them.',
          'Activated by setting <code>QECTOR_LICENSE</code> to your Ed25519 token; verification is offline, with no licence server and no phone-home.',
          'The package is byte-identical for licensed and unlicensed users. Without a token a licensing notice prints on import (suppressible with <code>QECTOR_SILENT=1</code>); no functionality is gated or disabled.',
          'No warranty, indemnification, exclusivity, trademark, or patent grant is included by default.',
        ]) +
        p('Full PolyForm Noncommercial License 1.0.0 text: <a href="https://polyformproject.org/licenses/noncommercial/1.0.0/" style="color:#67e8f9;">polyformproject.org/licenses/noncommercial/1.0.0</a> — also bundled with the package distribution.') +
        p('QECTOR depends on open-source projects including Stim (Apache 2.0) and PyMatching (MIT); those licenses govern their respective components.') +
        p('Commercial terms: <a href="/pricing" style="color:#67e8f9;">pricing</a> · <a href="/refund" style="color:#67e8f9;">refund policy</a> · Contact <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>')
    ),
  },
  {
    path: '/privacy',
    title: 'Privacy Policy · QECTOR',
    description: 'Privacy policy for QECTOR website and services.',
    noindex: true,
    heading: 'Privacy Policy',
    body: page(
      h1('Privacy Policy') +
        p(
          'QECTOR collects the minimum data needed to operate: contact-form messages, licensing correspondence, and Stripe checkout records (processed by Stripe; card data never touches QECTOR servers). The decoder package performs no telemetry and no network calls — license verification is offline Ed25519 signature checking.'
        ) +
        p('Questions: <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>')
    ),
  },
  {
    path: '/terms',
    title: 'Terms of Service · QECTOR',
    description: 'Terms of service for QECTOR website and software.',
    noindex: true,
    heading: 'Terms of Service',
    body: page(
      h1('Terms of Service') +
        p(
          'Use of the QECTOR website and software is governed by the PolyForm Noncommercial License 1.0.0 for community use, or by a written commercial license agreement for paid tiers. Benchmarks and validation artifacts may be republished with attribution. No warranty is provided; see the license for the full terms.'
        ) +
        p(
          'Seller: Guillaume Lessard, sole proprietor, trading as iD01t Productions, 2004 De Lorimier, Longueuil, Québec, Canada, J4K 3H7. Contact: admin@qector.store. Prices are in US dollars and exclude tax. Payments are processed by Stripe. Governing law: Québec, Canada. Licence tokens are delivered instantly and all sales are final — see the <a href="/refund" style="color:#67e8f9;">refund policy</a>.'
        ) +
        p('Contact <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>')
    ),
  },
  {
    path: '/refund',
    title: 'Refund Policy · QECTOR',
    description:
      'QECTOR Decoder v3 refund policy. Licence tokens are delivered instantly and are non-refundable; the $499 60-day evaluation is the creditable way to evaluate before committing.',
    heading: 'Refund Policy',
    body: page(
      h1('Refund Policy') +
        p(
          'QECTOR commercial licences are digital goods: an Ed25519-signed token issued and emailed within minutes of payment. Because the licensed rights and the token are delivered in full and immediately, commercial licences are non-refundable and all sales are final. This applies to the Commercial Evaluation Licence, all annual tiers, and the perpetual licence.'
        ) +
        h2('Evaluate first') +
        ul([
          'The $499 Commercial Evaluation Licence is a flat, non-recurring 60-day licence with unlimited internal seats, for benchmarking and pilot work.',
          'It does not auto-renew and is not a subscription.',
          'It is 100% creditable toward any annual tier purchased within 90 days of the evaluation start — $499 then Solo/Indie means you pay $800, not $1,299.',
          'To claim the credit, email your Stripe invoice number to admin@qector.store.',
        ]) +
        h2('Delivery problems are fixed, not refunded') +
        p(
          'If a token never arrives, is tied to the wrong email, or fails offline verification, that is a delivery fault on our side. Email admin@qector.store with your Stripe invoice number and we reissue it at no cost — please do not open a dispute. Tokens usually arrive in under 10 minutes; check your spam folder first.'
        ) +
        h2('Exceptions') +
        ul([
          'Duplicate purchases of the same tier for the same organisation, and charges made in obvious error, are refunded in full on request within 30 days.',
          'Annual licences are term licences that do not auto-renew, so there is nothing to cancel; stopping use partway through a term does not generate a partial refund.',
          'Nothing in this policy waives non-waivable statutory consumer rights where they apply.',
        ]) +
        h2('Currency, tax, and seller') +
        p(
          'All prices are quoted and charged in US dollars (USD), exclusive of tax; Stripe adds applicable sales tax, GST/HST, or VAT at checkout. Licences are sold by Guillaume Lessard, sole proprietor, trading as iD01t Productions, 2004 De Lorimier, Longueuil, Québec, Canada, J4K 3H7. Payments are processed by Stripe and card details never reach QECTOR systems.'
        ) +
        p('Refund and billing questions: <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a> · See also <a href="/terms" style="color:#67e8f9;">terms</a> and <a href="/license" style="color:#67e8f9;">licence</a>.')
    ),
  },
  {
    path: '/mcp-server',
    title: 'MCP Server · QECTOR Decoder v3',
    description:
      'Model Context Protocol server for quantum error correction decoding. JSON-RPC 2.0 tools exposing 13 verified tools across 16 decoder types to any MCP client.',
    heading: 'QECTOR MCP Server',
    body: page(
      h1('QECTOR MCP Server') +
        p(
          'A Model Context Protocol server (MCP stdio, JSON-RPC 2.0) exposing 13 verified tools across 16 decoder types — decode_syndrome, batch_decode, decode_hyperedge, decode_syndrome_blossom, batch_decode_blossom, decode_syndrome_cascade, benchmark_decoder, run_ler_benchmark, get_decoder_info, get_backend_health, clear_decoder_cache, get_server_env, recommend_decoder — to any MCP-compatible AI client. Verified in the v0.7.0 benchmark set: 42/42 faithfulness cases, 54/54 points with zero unfaithful corrections.'
        ) +
        pre(`pip install qector-decoder-v3==${DECODER_VERSION}\n# then register the qector-mcp server with your MCP client`)
    ),
  },
  {
    path: '/success',
    title: 'Purchase complete · QECTOR',
    description:
      'Your QECTOR Decoder v3 licence is being issued. Activation instructions and your Stripe reference.',
    noindex: true,
    heading: 'Purchase complete',
    body: page(
      h1('Purchase complete') +
        p(
          'Thank you. Your QECTOR Decoder v3 licence token is issued automatically by email within minutes of payment. Set it as the QECTOR_LICENSE environment variable; verification is offline. If the email does not arrive, contact admin@qector.store with your Stripe receipt.'
        )
    ),
  },
];

export const PRERENDER_ROUTE_MAP: Record<string, PrerenderRoute> = Object.fromEntries(
  PRERENDER_ROUTES.map((r) => [r.path, r])
);

/* ---------- JSON-LD graph builder ---------- */

export function buildJsonLdGraph(route: PrerenderRoute): Record<string, unknown> {
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebPage',
      '@id': `${abs(route.path)}#webpage`,
      url: abs(route.path),
      name: route.title,
      description: route.description,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL + '/' },
      ...(route.noindex ? {} : {}),
    },
  ];

  if (route.path !== '/') {
    const homeName = 'Home';
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeName, item: SITE_URL + '/' },
        { '@type': 'ListItem', position: 2, name: route.heading, item: abs(route.path) },
      ],
    });
  }

  if (route.jsonLdExtra) graph.push(...route.jsonLdExtra);

  return { '@context': 'https://schema.org', '@graph': graph };
}
