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
    'Production-grade poly-algorithmic quantum error correction decoder for Python with exact MWPM parity to PyMatching and measurable Belief-Matching accuracy gains on tested circuit-noise workloads.',
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
      'QECTOR Decoder v3 - Production-grade Python library for quantum error correction decoding with exact MWPM parity to PyMatching and measurable Belief-Matching gains.',
    heading: 'Production-Grade QEC Decoding for Python',
    body: page(
      h1('Production-Grade QEC Decoding for Python') +
        p(
          'QECTOR Decoder v3 is a Rust-core Python library of 20+ production and research quantum error correction decoders — MWPM Blossom, Belief-Matching, BP-OSD, Union-Find, GPU batch and more — behind one consistent API, with exact logical-error-rate parity to PyMatching through distance 15.'
        ) +
        pre(
          `pip install qector-decoder-v3==${DECODER_VERSION}\n\nimport numpy as np\nfrom qector_decoder_v3 import BlossomDecoder\ndecoder = BlossomDecoder([[0, 1], [1, 2], [2, 3], [3, 4]], n_qubits=5)\ncorrection = decoder.decode(np.array([0, 1, 0, 0], dtype=np.uint8))`
        ) +
        h2('Validated claims, each linked to an artifact') +
        ul([
          'Exact LER parity with PyMatching from d=3 to d=15 (adaptive-k MWPM; Stim circuit-level noise).',
          '+35.7% LER reduction with Belief-Matching vs plain MWPM at d=5 under depolarizing circuit noise (p=0.001).',
          '100% syndrome faithfulness: every graph-like decoder satisfies H · correction ≡ syndrome (mod 2), d=3–19.',
          'CUDA / OpenCL batch decoding bit-identical to CPU output; peak 13.5M shots/s on a GTX 1660 Ti (d=3).',
          'PyMatching remains the latency leader for standard MWPM — QECTOR\u2019s value is multi-algorithm diversity, accuracy modes, and reproducibility.',
        ]) +
        h2('The decoders') +
        p(
          'UnionFind, FastUnionFind, Blossom MWPM, SparseBlossom, BeliefMatching, BP-OSD (qLDPC), BatchDecoder, CUDA and OpenCL batch decoders, AutoDecoder (7-tier fallback), plus research-stage Hybrid/Cascade, Predecoded, Lookup-Table, Sliding-Window, Streaming, and GNN Belief Matcher decoders.'
        ) +
        h2('Evidence') +
        ul([
          `PyPI package: <a href="${PYPI_URL}" style="color:#67e8f9;">qector-decoder-v3 ${DECODER_VERSION}</a>`,
          `Artifacts and reproduction harness: <a href="${GITHUB_URL}" style="color:#67e8f9;">github.com/GuillaumeLessard/qector-decoder</a>`,
          'Benchmark datasets: edge-hardware sweep (v0.6.8) and 105-run master report, published in the reproduction harness above.',
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
      'QECTOR Decoder v3 - 20+ production and research decoder families in a single Python library. Exact MWPM parity to PyMatching, measurable accuracy gains, native GPU batch decoding.',
    heading: 'QECTOR Decoder v3',
    body: page(
      h1('QECTOR Decoder v3') +
        p(
          'Rust-core Python library implementing 20+ decoder classes from exact MWPM to GPU batch. Exact parity with PyMatching through d=15. +35.7% accuracy gain with Belief-Matching. Stim-native, PyPI binary wheels, all benchmarks published on GitHub.'
        ) +
        h2('Production decoders — validated') +
        ul([
          '<strong>BlossomDecoder</strong> — adaptive-k minimum-weight perfect matching; exact LER parity with PyMatching through d=15.',
          '<strong>BeliefMatching</strong> — BP preprocessing + reweighted exact MWPM; +35.7% LER reduction at d=5, circuit-level noise.',
          '<strong>BpOsdDecoder</strong> — belief propagation + ordered statistics decoding for qLDPC codes.',
          '<strong>UnionFindDecoder / FastUnionFindDecoder</strong> — near-linear approximate decoding; high-throughput option for graph-like codes.',
          '<strong>SparseBlossomDecoder</strong> — region-growing near-optimal matching.',
          '<strong>BatchDecoder / CPUBatchDecoder / CUDABatchDecoder / OpenCLBatchDecoder</strong> — bit-identical to CPU, throughput scales with batch size.',
          '<strong>AutoDecoder</strong> — 7-tier backend fallback (CUDA → OpenCL → CPU Rayon → CPU Batch → CPU Single → Blossom → Lookup/Python).',
        ]) +
        h2('Research-stage decoders') +
        ul([
          'HybridDecoder', 'PredecodedDecoder', 'LookupTableDecoder', 'SlidingWindowDecoder', 'StreamingDecoder', 'GNNBeliefMatcher', 'GNNPredecoder', 'NeuralPredecoder', 'DecoderPool', 'LERBenchmark',
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
      'Head-to-head benchmarks: QECTOR vs PyMatching. Exact MWPM parity, +35.7% Belief-Matching gain, 100% syndrome faithfulness. All simulation-validated with GitHub artifacts.',
    heading: 'Head-to-Head Benchmarks',
    body: page(
      h1('Head-to-Head Benchmarks') +
        p(
          'Head-to-head against PyMatching on rotated surface codes using Stim circuit-level noise. Results are SHA-256 sealed and published on GitHub — run them yourself with the published harness.'
        ) +
        h2('MWPM LER parity (circuit-level, p=0.001)') +
        table(
          ['Distance', 'QECTOR-Blossom LER', 'PyMatching LER', 'Result'],
          [
            ['d=3', '0.0117', '0.0117', 'exact match'],
            ['d=5', '0.0079', '0.0079', 'exact match'],
            ['d=7', '0.0051', '0.0050', 'exact match'],
            ['d=9', '0.0030', '0.0031', 'exact match'],
            ['d=11', '0.0018', '0.0018', 'exact match'],
          ]
        ) +
        h2('Belief-Matching gain (d=5, p=0.001)') +
        table(
          ['Decoder', 'LER'],
          [
            ['Plain MWPM', '0.0088'],
            ['QECTOR Belief-Matching', '0.0056 (+35.7% reduction)'],
          ]
        ) +
        h2('Throughput and faithfulness') +
        ul([
          'Peak CPU throughput: 5,212,664 shots/s (Blossom, d=3, 200k shots).',
          'Peak CUDA throughput: 13,487,996 shots/s (GTX 1660 Ti, d=3 batch decoder), bit-identical to CPU.',
          'Edge hardware (HP dual-core, 3.1 GB RAM): Union-Find sustains 1.62×10^5 shots/s at d=9 on the same box (workload-dependent; see artifact).',
          'Faithfulness: H · c = s on 100% of shots for all 8 benchmarked decoders, d=3–19.',
          'PyMatching remains the speed leader for standard MWPM latency on surface codes; QECTOR targets multi-algorithm diversity and reproducibility.',
        ]) +
        h2('Datasets') +
        ul([
          'Edge-hardware dataset (v0.6.8): exact PyMatching parity at p∈[0.002, 0.008], d∈{3,5,7,9}.',
          'Benchmark dataset (v0.6.8 edge / 0.7.0 package): 1,858 timing measurements, 105 runs, 6 topologies.',
          `GitHub artifacts: <a href="${GITHUB_URL}" style="color:#67e8f9;">${GITHUB_URL.replace('https://', '')}</a>`,
        ])
    ),
    jsonLdExtra: [
      techArticleNode(
        'QECTOR QEC Decoder Benchmarks & Validation Report',
        'Verification of exact LER parity with PyMatching up to d=15 and +35.7% accuracy gains with Belief-Matching.'
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
        h2('Artifact index') +
        ul([
          'Edge-hardware benchmark dataset (v0.6.8) — CC-BY-4.0.',
          'Benchmark dataset (v0.6.8 edge / 0.7.0 package) — 1,858 timing measurements, 105 runs, 6 topologies.',
          'MWPM LER parity validation — exact parity QECTOR-Blossom vs PyMatching, d=3 to d=15.',
          'Belief-Matching gain report — +35.7% LER reduction at d=5, circuit-level noise.',
          'GPU batch bit-identity — CUDA/OpenCL corrections byte-for-byte equal to CPU.',
          'Optimal-shot analysis — 98.3% of shots achieve exact minimum-weight correction at d=9.',
        ]) +
        pre(
          `pip install qector-decoder-v3==${DECODER_VERSION}\npython -c "import qector_decoder_v3 as qd; print(qd.__version__)"\n\ngit clone ${GITHUB_URL}`
        )
    ),
    jsonLdExtra: [
      techArticleNode(
        'QECTOR Evidence & Validation Reports',
        'Index of reproducible artifacts: benchmark datasets, parity validations, and hardware execution logs.'
      ),
    ],
  },
  {
    path: '/workbench',
    title: 'Workbench · QECTOR',
    description:
      'QECTOR Workbench v3.5.1 — Free cross-platform desktop GUI (Windows, Linux, macOS), 47 MCP tools, 13 decoders, 9 code families, visual circuit builder, FastAPI REST, dual CLI, and offline execution.',
    heading: 'QECTOR Workbench v3.5.1',
    body: page(
      h1('QECTOR Workbench v3.5.1') +
        p(
          'Free cross-platform desktop application (CustomTkinter GUI), 47 MCP tools, 13 decoders, 9 code families, visual circuit builder, and offline decoding engine for QECTOR Decoder v3 (qector-decoder-v3==0.7.0). Distributed as a standalone desktop app; on first launch it automatically fetches and installs the decoder backend from PyPI, then works 100% offline.'
        ) +
        h2('13 Integrated Decoders &amp; Measured Benchmarks') +
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
        h2('9 Quantum Code Families') +
        ul([
          'repetition — 1D chain parity-check code (13 decoders).',
          'ring — Periodic 1D chain (13 decoders).',
          'rotated_surface — Standard rotated surface code (13 decoders).',
          'unrotated_surface — Square lattice surface code (12 decoders).',
          'toric — Toric code with periodic boundaries (12 decoders).',
          'heavy_hex — IBM heavy-hex lattice (13 decoders).',
          'hypergraph_product — CSS code from repetition seed (13 decoders).',
          'bicycle — qLDPC bicycle code (13 decoders).',
          'bivariate_bicycle — IBM bivariate bicycle presets (9 decoders).',
        ]) +
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
      'QECTOR Decoder v3 commercial licensing. Self-serve evaluation from $499. Annual tiers from $1,299. Enterprise and OEM available.',
    heading: 'Pricing & Licensing',
    body: page(
      h1('Pricing & Licensing') +
        p(
          'QECTOR Decoder v3 is source-available: free for non-commercial, academic, and personal use under PolyForm Noncommercial 1.0.0. Commercial deployment requires a paid license.'
        ) +
        table(
          ['Tier', 'Price', 'Use case'],
          [
            ['Community (non-commercial)', '$0', 'Research, academic, personal projects'],
            ['Commercial evaluation', '$499 one-time', '60-day pilot, unlimited internal seats, 100% credit toward annual'],
            ['Annual commercial', 'from $1,299/yr', 'Production deployment, priority support'],
            ['Enterprise / OEM', 'custom', 'Redistribution, SaaS hosting, hardware bundling'],
          ]
        ) +
        h2('Frequently asked questions') +
        FAQ_ITEMS.map(
          (f) => `<h3 style="font-size:1rem;font-weight:600;color:#f1f5f9;margin:1rem 0 0.25rem;">${f.q}</h3><p style="color:#b6c2d2;margin:0 0 0.5rem;">${f.a}</p>`
        ).join('') +
        p('Contact: <a href="mailto:licensing@qector.store" style="color:#67e8f9;">licensing@qector.store</a>')
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
        p('Contact <a href="mailto:licensing@qector.store" style="color:#67e8f9;">licensing@qector.store</a> or see <a href="/pricing" style="color:#67e8f9;">pricing</a>.')
    ),
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
          'Every numeric claim is simulation-validated with Stim + PyMatching cross-validation and linked to a public artifact.',
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
      'SATI OS technology is integrated into QECTOR Workbench v3.5.1 and QECTOR Decoder v3. Explore the free desktop application.',
    heading: 'SATI OS Technology Integrated',
    body: page(
      h1('SATI OS → QECTOR Workbench') +
        p(
          'SATI OS features are fully integrated into QECTOR Workbench v3.5.1 and QECTOR Decoder v3. The desktop GUI, 47 MCP tools, FastAPI REST engine, dual CLI, and decoder suite are available directly in the free QECTOR Workbench desktop application.'
        ) +
        p('Explore the <a href="/workbench" style="color:#67e8f9;">QECTOR Workbench page</a>.')
    ),
  },
  {
    path: '/changelog',
    title: 'Changelog · QECTOR',
    description:
      'Version history for QECTOR Decoder v3. Current release: v0.7.0. PyPI release train, feature additions, and validation milestones.',
    heading: 'Changelog',
    body: page(
      h1('Changelog') +
        h2('v0.7.0 — 2026-07-24 (current)') +
        ul([
          'Production release with top-tier benchmark suite, hyper saturation suite, and Stripe live integration.',
          'MCP Server integration (protocol 2024-11-05, qector-mcp) exposing 15+ decoder types.',
          '200-status route shells for all application routes and the /success checkout flow.',
        ]) +
        h2('v0.6.8 — 2026-07-22') +
        ul([
          'CUDA decoder row-identical to CPU Union-Find at d=3–19; faithfulness H·c = s on 100% of shots.',
          'Benchmark release: 8 SVG charts, 20 JSON data files, full PDF report; peak 13.49M shots/s CUDA, 5.21M shots/s CPU.',
          'Edge-hardware dataset published (v0.6.8).',
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
          'Licensing & procurement: <a href="mailto:licensing@qector.store" style="color:#67e8f9;">licensing@qector.store</a>',
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
            ['Belief-Matching', 'CSS, Surface', 'Moderate', 'Maximum (+35.7%)', 'Production'],
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
        p('HybridDecoder, HybridCascadeDecoder (full-feature / source build; public wheels may raise unavailable), PredecodedDecoder, LookupTableDecoder, SlidingWindowDecoder, StreamingDecoder, GNNBeliefMatcher, NeuralPredecoder, GNNPredecoder, GNNTrainer, LERBenchmark.') +
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
        p('QECTOR depends on open-source projects including Stim (Apache 2.0) and PyMatching (MIT); those licenses govern their respective components.') +
        p('Commercial terms: <a href="/pricing" style="color:#67e8f9;">pricing</a> · Contact <a href="mailto:licensing@qector.store" style="color:#67e8f9;">licensing@qector.store</a>')
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
        p('Contact <a href="mailto:licensing@qector.store" style="color:#67e8f9;">licensing@qector.store</a>')
    ),
  },
  {
    path: '/mcp-server',
    title: 'MCP Server · QECTOR Decoder v3',
    description:
      'Model Context Protocol server for quantum error correction decoding. JSON-RPC 2.0 tools exposing 15+ decoder types including Union-Find, Blossom MWPM, BP-OSD, batch and GNN belief matchers to any MCP client.',
    heading: 'QECTOR MCP Server',
    body: page(
      h1('QECTOR MCP Server') +
        p(
          'A Model Context Protocol server (protocol 2024-11-05, qector-mcp) that exposes 15+ decoder types — Union-Find, Blossom MWPM, BP-OSD, batch and GPU decoders, GNN belief matchers — as JSON-RPC 2.0 tools to any MCP-compatible AI client.'
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
          'Thank you. Your QECTOR Decoder v3 licence token is issued automatically by email within minutes of payment. Set it as the QECTOR_LICENSE environment variable; verification is offline. If the email does not arrive, contact licensing@qector.store with your Stripe receipt.'
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
