// Prerender route data: the single source of truth for the static HTML shells
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

import { FAQ_ITEMS, FAQ_ITEMS_FR } from './faqData';
import { blogPosts } from './blogData';
import { CLAUDE_PLUGIN_RELEASE, PYPI_RELEASES } from './releases';

export const SITE_URL = 'https://qector.store';
export const SITE_NAME = 'QECTOR';
export const OG_IMAGE = 'https://qector.store/images/og-banner.png';
export const DECODER_VERSION = '1.0.0';
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

const abs = (path: string) => `${SITE_URL}${path === '/' ? '/' : `${path}/`}`;

/* ---------- shared schema.org nodes ---------- */

const organizationNode = {
  '@type': 'Organization',
  '@id': 'https://qector.store/#organization',
  name: SITE_NAME,
  url: SITE_URL + '/',
  logo: `${SITE_URL}/images/logo.png`,
  email: 'admin@qector.store',
  foundingDate: '2023',
  founder: {
    '@type': 'Person',
    name: 'Guillaume Lessard',
    url: `${SITE_URL}/guillaume-lessard/`,
    identifier: '0009-0000-3465-3753',
  },
  location: {
    '@type': 'PostalAddress',
    addressLocality: 'Longueuil',
    addressRegion: 'QC',
    addressCountry: 'CA',
  },
  sameAs: [
    GITHUB_URL,
    PYPI_URL,
    'https://github.com/qectorlab',
    'https://orcid.org/0009-0000-3465-3753',
    'https://id01t.itch.io/',
    'https://www.linkedin.com/in/qector/',
  ],
};

const softwareNode = {
  '@type': 'SoftwareApplication',
  name: 'QECTOR Decoder v3',
  description:
    'Rust-core Python quantum error correction decoder with 17 concrete configurations plus 2 Workbench routing kinds, a syndrome-faithful contract, API stability tiers, and reproducible validation guidance.',
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
  publisher: { '@id': 'https://qector.store/#organization' },
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

const NAV_LINKS = [
  ['/', 'Platform'],
  ['/decoder', 'Decoder'],
  ['/claude-plugin', 'Claude Plugin'],
  ['/workbench', 'Workbench'],
  ['/mcp-server', 'MCP Server'],
  ['/evidence', 'Evidence'],
  ['/blog', 'Blog'],
  ['/pricing', 'Pricing'],
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
    title: 'QECTOR · Quantum Error Correction Decoding for Python',
    description:
      'QECTOR Decoder v3: Rust-core Python quantum error correction decoder with 17 configurations, a syndrome-faithful contract, and reproducible validation guidance.',
    heading: 'QEC Decoding for Python',
    body: page(
      h1('QEC Decoding for Python') +
        p(
          'QECTOR Decoder v3 is a Rust-core Python library with 17 concrete quantum error correction decoder configurations, from Blossom and Union-Find to BP-OSD, space-time, and optional batch paths. Workbench v1.0.7 lists 19 named kinds because it also includes the AutoDecoder and Auto Router orchestration entries. Version 1.0.0 defines API stability tiers, a qector CLI, and a qector-doctor diagnostic.'
        ) +
        pre(
          `pip install qector-decoder-v3==${DECODER_VERSION}\n\nimport numpy as np\nfrom qector_decoder_v3 import BlossomDecoder\ndecoder = BlossomDecoder([[0, 1], [1, 2], [2, 3], [3, 4]], n_qubits=5)\ncorrection = decoder.decode(np.array([0, 1, 0, 0], dtype=np.uint8))`
        ) +
        h2('v1.0.0: first stable release') +
        ul([
          'Semantic-versioning frozen; the public API is governed by documented stability tiers (Stable / Workload-sensitive / Experimental).',
          'Sinter entry points (qector_blossom, qector_belief, qector_unionfind, and more) and a qiskit-qec plugin registered: sinter.collect() works with no custom_decoders=.',
          'New decoder families: AmbiguityClusterDecoder, TwoStageDecoder, ColourCodeDecoder (opt-in cluster_bposd). Relay-BP schedules, CS-OSD(lambda, w) and LLR damping in BP-OSD.',
          'qector decode / qector bench / qector serve CLI and qector-doctor (15-check environment diagnostic).',
          'Hardware-specific benchmark data is not published here. The package and manual document how to perform a scoped local measurement with the required environment and artifact metadata.',
        ]) +
        h2('The decoders') +
        p(
          'UnionFind, FastUnionFind, Blossom MWPM, SparseBlossom, BP-OSD for qLDPC, batch decoders, AutoDecoder, space-time, streaming, two-stage, ambiguity-cluster, lookup-table, and learned research surfaces.'
        ) +
        h2('Evidence') +
        ul([
          `PyPI package: <a href="${PYPI_URL}" style="color:#67e8f9;">qector-decoder-v3 ${DECODER_VERSION}</a>`,
          `Artifacts and reproduction harness: <a href="${GITHUB_URL}" style="color:#67e8f9;">github.com/GuillaumeLessard/qector-decoder</a>`,
          '<a href="https://doi.org/10.5281/zenodo.21941046" style="color:#67e8f9;">Normative reference manual DOI 10.5281/zenodo.21941046</a>',
          '<a href="https://doi.org/10.5281/zenodo.21611214" style="color:#67e8f9;">v1.0.0 user manual DOI 10.5281/zenodo.21611214</a>',
          '<a href="https://doi.org/10.5281/zenodo.22046403" style="color:#67e8f9;">Verification and proof bundle DOI 10.5281/zenodo.22046403</a>',
          'Validation reports and SHA-256 sealed manifests, archived with the decoder source on GitHub.',
        ])
    ),
    jsonLdExtra: [
      { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL + '/' },
      softwareNode,
    ],
  },
  {
    path: '/decoder',
    title: 'QECTOR Decoder v3 · QEC Decoding for Python',
    description:
      'QECTOR Decoder v3: 17 decoder configurations in one Python library. Stable v1.0.0 with API tiers, Relay-BP, CS-OSD, Sinter/qiskit entry points, and qector bench.',
    heading: 'QECTOR Decoder v3',
    body: page(
      h1('QECTOR Decoder v3') +
        p(
          'Rust-core Python library implementing 17 decoder configurations from exact MWPM to GPU batch. v1.0.0 is the first stable release: API stability tiers, Relay-BP and CS-OSD in BP-OSD, Sinter/qiskit entry points, and the qector CLI. A reproducible benchmark harness (qector bench) ships in the package so you can measure on your own hardware. Stim-native, PyPI binary wheels, artifacts published on GitHub.'
        ) +
        h2('Production decoders (Stable)') +
        ul([
          '<strong>UnionFindDecoder / FastUnionFindDecoder</strong>: near-linear time approximate decoding for graph-like codes.',
          '<strong>BlossomDecoder</strong>: exact minimum-weight perfect matching reference decoder for surface codes.',
          '<strong>BatchDecoder / CPUBatchDecoder / CUDABatchDecoder / OpenCLBatchDecoder</strong>: native parallel CPU and CUDA/OpenCL batch pipelines; CUDA accepts edge_weights and precision="f64" in v1.0.0.',
        ]) +
        h2('Experimental &amp; research decoders') +
        ul([
          '<strong>BpOsdDecoder / BPOSDDecoder</strong>: belief propagation + ordered statistics decoding for qLDPC codes; v1.0.0 adds Relay-BP, CS-OSD(lambda, w) and LLR damping.',
          '<strong>BeliefMatching</strong>: BP preprocessing + reweighted exact MWPM for correlated noise (research path).',
          '<strong>SparseBlossomDecoder</strong>: region-growing near-optimal matching; zero-allocation hot path in v1.0.0 (experimental).',
          '<strong>AutoDecoder / HybridDecoder</strong>: adaptive fallback and routing between Union-Find and Blossom.',
          '<strong>ColourCodeDecoder / TwoStageDecoder / AmbiguityClusterDecoder / PredecodedDecoder</strong>: specialized research workflows, new families in v1.0.0.',
        ]) +
        h2('Technical specifications') +
        table(
          ['Key', 'Value'],
          [
            ['Languages', 'Rust core (PyO3) / Python 3.9-3.13 API'],
            ['Platforms', 'Linux x86_64, macOS ARM64, Windows x64 (15 binary wheels)'],
            ['GPU', 'CUDA/OpenCL optional and environment-dependent; check the installed release diagnostics'],
            ['QEC library', 'Stim / Sinter / PyMatching / qiskit-qec compatible'],
            ['Packaging', 'PyPI binary wheels (cp39-cp313, 3 platforms); no sdist'],
            ['License', 'PolyForm Noncommercial 1.0.0 (community) / Commercial'],
          ]
        ) +
        pre(`pip install qector-decoder-v3==${DECODER_VERSION}`)
    ),
    jsonLdExtra: [{ ...softwareNode, url: abs('/decoder') }],
  },
  {
    path: '/evidence',
    title: 'Evidence & Reports · QECTOR',
    description:
      'Six-record Zenodo evidence registry, validation reports, and SHA-256 sealed artifacts for the QECTOR quantum error correction decoder.',
    heading: 'Evidence & Reports',
    body: page(
      h1('Evidence & Reports') +
        p(
          'Public claims link to supporting artifacts where published: the six-record Zenodo evidence corpus, validation reports, and SHA-256 sealed manifests, all archived with the decoder source on GitHub.'
        ) +
        h2('Zenodo evidence registry') +
        table(
          ['DOI', 'Scope', 'Date', 'Access'],
          [
            ['<a href="https://doi.org/10.5281/zenodo.21611214" style="color:#67e8f9;">10.5281/zenodo.21611214</a>', 'User manual', '2026-08-06', 'open'],
            ['<a href="https://doi.org/10.5281/zenodo.21822738" style="color:#67e8f9;">10.5281/zenodo.21822738</a>', 'Restricted source custody', '2026-08-06', 'embargoed'],
            ['<a href="https://doi.org/10.5281/zenodo.21823755" style="color:#67e8f9;">10.5281/zenodo.21823755</a>', 'Full scientific verification &amp; validation report', '2026-08-06', 'open'],
            ['<a href="https://doi.org/10.5281/zenodo.21850315" style="color:#67e8f9;">10.5281/zenodo.21850315</a>', 'Technical monograph (multi-backend architecture)', '2026-08-08', 'open'],
            ['<a href="https://doi.org/10.5281/zenodo.21941046" style="color:#67e8f9;">10.5281/zenodo.21941046</a>', 'Normative reference manual v1.0.0', '2026-08-14', 'open'],
            ['<a href="https://doi.org/10.5281/zenodo.22046403" style="color:#67e8f9;">10.5281/zenodo.22046403</a>', 'Verification proof bundle', '2026-08-21', 'open'],
          ]
        ) +
        p(
          'Document deposits carry their own document-level publication licence; software licensing (PolyForm Noncommercial / commercial) is separate and governed by the <a href="/license" style="color:#67e8f9;">licence page</a>. The embargoed record is restricted source custody and is not part of the public evidence set.'
        ) +
        h2('Evidence artifacts') +
        ul([
          'Syndromic validation: decode runs verify H·c = s on every shot through the self-debugging harness.',
          'SHA-256 sealed artifact manifests archived on GitHub.',
        ]) +
        pre(
          `pip install qector-decoder-v3==${DECODER_VERSION}\npython -c "import qector_decoder_v3 as qd; print(qd.__version__)"\n\ngit clone ${GITHUB_URL}`
        )
    ),
    jsonLdExtra: [
      techArticleNode(
        'QECTOR Evidence & Validation Reports',
        'Complete six-record Zenodo evidence corpus, the official v1.0.0 reference manual (DOI 10.5281/zenodo.21941046), and SHA-256 sealed validation artifacts.'
      ),
    ],
  },
  {
    path: '/workbench',
    title: 'Workbench · QECTOR',
    description:
      'QECTOR Workbench desktop GUI and MCP releases: Windows v1.0.7 (x64) and Linux v1.0.7 (x64), each with an 85-tool MCP server and a qector-decoder-v3 1.0.0 backend.',
    heading: 'QECTOR Workbench',
    body: page(
      h1('QECTOR Workbench') +
        p(
          'QECTOR Workbench is a free desktop application and Model Context Protocol server. The live repositories publish Windows and Linux builds. Each build ships an 85-tool MCP server, a bundled qector-decoder-v3 1.0.0 backend, 19 named decoder kinds (17 concrete configurations plus AutoDecoder and Auto Router), and 10 code families.'
        ) +
        h2('Downloads') +
        ul([
          'Windows x64: <code>QectorWorkbench-Portable.exe</code> (<code>c53ca5f4fc49152f242a847d0ca11f147164dda426ae29ec170c451871b8ab13</code>): <a href="https://github.com/qectorlab/qector-decoder-workbench-windows/releases/tag/v1.0.7" style="color:#67e8f9;">live release notes</a>',
          'Linux x64: <code>QectorWorkbench-Portable</code> (<code>aa3949d25082165dc3b89115486e1ea4e210cd5254659da32185fe6a8e71a1c8</code>): <a href="https://github.com/qectorlab/qector-decoder-workbench-linux/releases/tag/v1.0.7" style="color:#67e8f9;">live release notes</a>',
          'Headless MCP server on every platform: <code>--mcp</code>; MCP protocol 2024-11-05 over stdio JSON-RPC 2.0.',
          'SHA-256 checksums for every released file are published in the release notes.',
        ]) +
        h2('Workspaces') +
        p(
          'The v1.0.7 releases document eight GUI tabs plus a live Console: Code Explorer, Decoder Lab, Benchmark, Batch &amp; Streaming, Hardware, Diagnostics, Documentation, Lab &amp; Personal Info, and Console. The Linux build adds a History tab. Use each release&apos;s manuals for platform-specific details.'
        ) +
        h2('10 Quantum Code Families') +
        p('The published Workbench releases cover 10 code families including qLDPC and colour codes:') +
        ul([
          'repetition: 1D chain parity-check code.',
          'ring: Periodic 1D chain.',
          'rotated_surface: Standard rotated surface code.',
          'unrotated_surface: Square lattice surface code.',
          'toric: Toric code with periodic boundaries.',
          'heavy_hex: heavy-hex lattice.',
          'hypergraph_product: CSS code from repetition seed.',
          'bicycle: qLDPC bicycle code.',
          'bivariate_bicycle: bivariate bicycle presets (qLDPC).',
          'color_code: triangular colour code.',
        ]) +
        h2('Local measurement') +
        p(
          'No hardware-specific measurement data is published on this site. If you run optional local tools, record the workload, environment, and raw artifact with the result.'
        ) +
        h2('Documentation &amp; reference') +
        ul([
          `User Manual &amp; Licensing: <a href="${SITE_URL}/manual/" style="color:#67e8f9;">${SITE_URL.replace('https://', '')}/manual/</a>`,
          `Architecture &amp; Technical Reference: <a href="${SITE_URL}/technical-reference/" style="color:#67e8f9;">${SITE_URL.replace('https://', '')}/technical-reference/</a>`,
        ])
    ),
    jsonLdExtra: [
      {
        '@type': 'SoftwareApplication',
        name: 'QECTOR Workbench',
        description:
          'Free desktop application and Model Context Protocol server for quantum error correction. Windows and Linux builds each provide an 85-tool MCP server, 19 named decoder kinds (17 concrete configurations plus 2 routing kinds), and 10 quantum code families.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Windows, Linux',
        softwareVersion: '1.0.7',
        url: SITE_URL + '/workbench/',
        downloadUrl: 'https://github.com/qectorlab/qector-decoder-workbench-windows/releases/download/v1.0.7/QectorWorkbench-Portable.exe',
        author: { '@type': 'Person', name: 'Guillaume Lessard', url: SITE_URL + '/guillaume-lessard/' },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      },
    ],
  },
  {
    path: '/pricing',
    title: 'Pricing · QECTOR',
    description:
      'QECTOR Decoder v3 commercial licensing. $499 60-day evaluation, fully creditable. Annual production tiers from $1,299/yr. Prices in USD, excluding tax.',
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
            ['Solo / Indie perpetual', '$3,299 one-time', '1 named user', 'Same rights as annual for v3.x (all v3.x patch/minor updates included; major version upgrades such as v4.0 are a new license)'],
            ['Startup / Growth', '$4,499 / yr', 'Up to 10', 'Production internal use, advanced BP-OSD/LDPC workflows'],
            ['Professional / Lab', '$11,500 / yr', 'Up to 25', 'Production internal use, SLA, validation report package credit'],
            ['Enterprise / OEM / SaaS', 'Custom', 'Custom', 'Redistribution, SaaS hosting, customer-facing APIs, hardware bundling'],
          ]
        ) +
        p(
          '<strong>Tax:</strong> prices are in USD and exclude tax; Stripe adds applicable sales tax, GST/HST, or VAT at checkout based on your billing location. <strong>Delivery:</strong> your license token is emailed within 10 minutes of payment: check your spam folder before contacting support. <strong>Refunds:</strong> tokens are delivered instantly, so all sales are final: see the <a href="/refund" style="color:#67e8f9;">refund policy</a>; the $499 evaluation is the creditable way to try before committing.'
        ) +
        h2('Activating your license') +
        p(
          'Everyone installs the same wheel: there is no separate commercial build and no feature gating. If <code>QECTOR_LICENSE</code> is unset a licensing notice prints on import, which is expected for non-commercial use. Set both <code>QECTOR_LICENSE</code> and <code>QECTOR_LICENSE_KEY</code> to the same token for the v1.0.0 import and tier checks; decoding runs either way, with no hard stop.'
        ) +
        pre(
          `# Commercial use: activate with the Ed25519 token from your licence email\nexport QECTOR_LICENSE="<your-token>"\nexport QECTOR_LICENSE_KEY="<your-token>"\n\n# Optional: suppress the licensing notice in CI logs\nexport QECTOR_SILENT=1\n\n# Verification is offline against a public key in the package.\n# No licence server, no phone-home, works air-gapped.`
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
    path: '/fr/pricing',
    title: 'Tarifs · QECTOR',
    description: 'Licences commerciales QECTOR Decoder v3. Évaluation de 60 jours à 499 $, entièrement créditable. Paliers annuels dès 1 299 $/an. Prix en USD, hors taxes.',
    heading: 'Tarification et licences',
    body: page(
      h1('Tarification et licences') +
        p(
          'QECTOR Decoder v3 est disponible en source : gratuit pour un usage non commercial, académique et personnel sous PolyForm Noncommercial 1.0.0. Le déploiement commercial exige une licence payante. Tous les prix sont en dollars américains (USD), hors taxes.'
        ) +
        h2('Paliers') +
        ul([
          'Évaluation commerciale de 60 jours : 499 $ paiement unique, sièges internes illimités, 100 % créditable vers un palier annuel.',
          'Solo / Indie : 1 299 $/an · Startup / Growth : 4 499 $/an · Professional : 11 500 $/an.',
          'Enterprise & OEM : sur mesure (tarification personnalisée).',
          'Rabais académique de 40 % disponible sur les paliers annuels.',
        ]) +
        p(
          'Voir <a href="/pricing" style="color:#67e8f9;">la version anglaise pour le détail complet</a>. Contact : <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>'
        )
    ),
    jsonLdExtra: [
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS_FR.map((f) => ({
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
          'Standard tiers cover internal use. Enterprise agreements cover redistribution, SaaS hosting, OEM integration, hardware bundling, and commercial benchmarking: with written contracts, SLAs, and procurement-friendly paperwork (W-8/W-9, vendor profiles, signed EULAs).'
        ) +
        ul([
          'Custom scope: seats, sites, subsidiaries, and redistribution rights.',
          'Priority support with response SLAs and integration guidance.',
          'Academic institutions: 40% discount on annual tiers.',
        ]) +
        p('Contact <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a> or see <a href="/pricing" style="color:#67e8f9;">pricing</a>.')
    ),
  },
  {
    path: '/guillaume-lessard',
    title: 'Guillaume Lessard · Founder of QECTOR and iD01t Productions',
    description:
      'Guillaume Lessard, founder of QECTOR and iD01t Productions: Rust/Python quantum error correction systems, ORCID 0009-0000-3465-3753, Longueuil, Québec.',
    heading: 'Guillaume Lessard',
    body: page(
      h1('Guillaume Lessard') +
        p(
          'Founder, software engineer, author and independent researcher, based in Longueuil, Québec. I design Rust/Python quantum error-correction systems, local MCP tooling, and release workflows where correctness claims are tied to declared workloads, reproducible artifacts, and public records. I build and support QECTOR independently from Longueuil.'
        ) +
        h2('Making sure you have the right Guillaume Lessard') +
        p(
          'It is a common Québécois name shared by several accomplished people: including a compiler engineer working on the Swift language and a real-estate executive. None of them are me, and I claim none of their work. The identifiers below are the ones I control.'
        ) +
        table(
          ['Identifier', 'Value'],
          [
            ['ORCID', `<a href="https://orcid.org/0009-0000-3465-3753" style="color:#67e8f9;">0009-0000-3465-3753</a>`],
            ['GitHub', `<a href="https://github.com/qectorlab" style="color:#67e8f9;">github.com/qectorlab</a>`],
            ['PyPI', `<a href="${PYPI_URL}" style="color:#67e8f9;">qector-decoder-v3</a>`],
            ['Studio', `iD01t Productions, Longueuil, Québec (founded 2023)`],
            ['itch.io', `<a href="https://id01t.itch.io/" style="color:#67e8f9;">id01t.itch.io</a>`],
            ['Email', `<a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>`],
          ]
        ) +
        h2('Background') +
        p(
          'My engineering philosophy is rooted in practical execution. Over the course of my career, I learned to build robust systems because I wanted to make things that worked in the real world. That has been the method ever since: pick the problem, learn what it requires, ship the result, publish the evidence. Over the last twenty years that has meant 167+ eBooks, 103 audiobooks, independently released desktop tools and games, and six albums plus twenty-three singles as DJ iD01T. iD01t Productions was founded in 2023 to put all of it under one roof; it is still one person.'
        ) +
        h2('Skills') +
        ul([
          'Systems and performance: Rust, PyO3 bindings, CUDA / OpenCL batch kernels, memory-layout and throughput tuning.',
          'Python engineering: Python 3.9-3.13, NumPy/SciPy, binary wheel packaging across manylinux/macOS/Windows, PyPI release engineering, release signing documentation.',
          'Quantum error correction: MWPM/Blossom matching, Union-Find, belief propagation with OSD for qLDPC, Stim/Sinter/PyMatching integration, reproducible benchmark design.',
          'Applications and desktop: CustomTkinter GUI, runtime bundling, PyInstaller / Inno Setup / .deb packaging, Model Context Protocol servers, offline-first architecture.',
          'Web and product: React, TypeScript, Vite, Tailwind, structured data and SEO, Stripe commerce integration.',
          'Writing and publishing: technical documentation, long-form instructional writing, audiobook production, electronic music production.',
        ]) +
        h2('Selected work') +
        ul([
           `<a href="/decoder" style="color:#67e8f9;">QECTOR Decoder v3</a>: Rust-core Python library, 17 concrete decoder configurations, first stable release v1.0.0.`,
           `<a href="/workbench/" style="color:#67e8f9;">QECTOR Workbench</a>: live Windows and Linux releases, each with an 85-tool MCP server and 19 named decoder kinds.`,
           '<a href="https://doi.org/10.5281/zenodo.21611214" style="color:#67e8f9;">v1.0.0 user manual DOI 10.5281/zenodo.21611214</a>; <a href="https://doi.org/10.5281/zenodo.21941046" style="color:#67e8f9;">normative manual DOI 10.5281/zenodo.21941046</a>; <a href="https://doi.org/10.5281/zenodo.22046403" style="color:#67e8f9;">verification/proof DOI 10.5281/zenodo.22046403</a>.',
          `<a href="/evidence" style="color:#67e8f9;">Evidence &amp; Provenance</a>: validation reports and SHA-256 sealed manifests on GitHub.`,
          'Mastering QEC and the QEC Academy instructional series.',
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
        jobTitle: 'Founder, Software Engineer and Independent Researcher',
        description:
          'Software engineer, author and independent researcher. Founder of iD01t Productions and author of the QECTOR Decoder v3 quantum error correction library.',
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
          'https://www.linkedin.com/in/qector/',
        ],
      },
    ],
  },
  {
    path: '/about',
    title: 'About QECTOR · Quantum Error Correction',
    description:
      'About QECTOR: Guillaume Lessard, iD01t Productions, QEC research background, ORCID, GitHub artifacts, mission and engineering philosophy.',
    heading: 'About QECTOR',
    body: page(
      h1('About QECTOR') +
        p(
          'QECTOR is built by Guillaume Lessard (ORCID 0009-0000-3465-3753) / iD01t Productions. The project focuses on one thing: an evidence-backed quantum error correction decoder for Python.'
        ) +
        ul([
          'No universal benchmark figures are published on this site, because results depend on specific hardware; validation reports and SHA-256 sealed manifests are published with the evidence. v1.0.0 (2026-08-06) is the first stable release of the decoder.',
        ]) +
        p('Contact: <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>')
    ),
  },

  {
    path: '/changelog',
    title: 'Changelog · QECTOR',
    description:
      'Version history for QECTOR Decoder v3. Current release: v1.0.0 (2026-08-06), the first stable release. PyPI release train.',
    heading: 'Changelog',
    body: page(
      h1('Changelog') +
        h2('v1.0.0: 2026-08-06 (current, first stable release)') +
        ul([
          'Semantic-versioning frozen; the public API is governed by documented stability tiers (Stable / Workload-sensitive / Experimental / Internal detail).',
          'Ecosystem entry points registered: five Sinter decoders (qector_blossom, qector_belief, qector_unionfind, and more) and a qiskit-qec plugin: sinter.collect() works without custom_decoders=.',
          'New decoder families: AmbiguityClusterDecoder, TwoStageDecoder, ColourCodeDecoder (opt-in method="cluster_bposd").',
          'Relay-BP layered serial BP schedule (bp_method="relay"), CS-OSD(lambda, w) with configurable osd_lambda, and LLR message damping in bposd.py.',
          'CUDABatchDecoder / OpenCLBatchDecoder accept edge_weights; precision="f64" for double-precision weighted growth.',
          'qector decode / qector bench / qector serve CLI plus qector-doctor (15-check environment diagnostic).',
          'pymatching submodule shim: from qector_decoder_v3.pymatching import Matching.',
          'SparseBlossomDecoder hot path is now zero-allocation (thread-local SbScratch); six Rust panic-to-abort paths removed.',
          'Licence hardening: v2 tokens carry tier + expiry; malformed tokens return False; unreadable key files report invalid.',
          '15 binary wheels (cp39-cp313, Windows amd64 / Linux x86_64 / macOS 11.0+ arm64). No sdist.',
          'Official QECTOR Decoder v3 reference manual v1.0.0 (DOI 10.5281/zenodo.21941046).',
        ]) +
         h2('Verified PyPI release dates (UTC)') +
         ul([
           'No v0.7.1 release appears in the public PyPI history; it is intentionally omitted.',
           'These are PyPI upload dates, not inferred development or local file dates.',
           ...PYPI_RELEASES.slice(1).map(({ version, releaseDate, label }) => `v${version}: ${releaseDate} · ${label}`),
         ]) +
         p('The canonical PyPI history contains the complete artifact record and remains the source of truth for package release dates.')
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
           '<a href="/claude-plugin" style="color:#67e8f9;">Claude Code Plugin</a>: v1.0.6 with 28 skills, 5 agents, four MCP servers, and explicit stable, research, and admin profiles.',
           '<a href="/workbench" style="color:#67e8f9;">Workbench</a>: free desktop GUI with an 85-tool MCP server and 19 named decoder kinds, v1.0.7 on Windows and Linux.',
          '<a href="/mcp-server" style="color:#67e8f9;">MCP Server</a>: app-free local library server exposing 8 local tools.',
          '<a href="/installer" style="color:#67e8f9;">Installation guide</a>: pip install on Linux, macOS, Windows.',
          '<a href="/manual" style="color:#67e8f9;">User manual</a>: configuration, decoder selection, benchmarking, troubleshooting.',
          '<a href="/technical-reference" style="color:#67e8f9;">Technical reference</a>: API parameters and module documentation.',
          `<a href="${PYPI_URL}" style="color:#67e8f9;">PyPI project page</a>: canonical package documentation.`,
          `<a href="${GITHUB_URL}" style="color:#67e8f9;">GitHub repository</a>: source, artifacts, validation harness.`,
        ]) +
        p('Stim, PyMatching, Sinter, and Qiskit compatible.')
    ),
  },
  {
    path: '/manual',
    title: 'User Manual · QECTOR',
    description:
      'Complete user manual for QECTOR Decoder v3. Installation, decoder selection, local measurements, and troubleshooting.',
    heading: 'User Manual',
    body: page(
      h1('User Manual') +
        p(
          'Complete manual for QECTOR Decoder v3: installation, license-token configuration, decoder selection by code family, optional ecosystem integration, local measurements, and troubleshooting.'
        ) +
        table(
          ['Decoder', 'Target code', 'Speed', 'Accuracy', 'Tier'],
          [
            ['Blossom (MWPM)', 'Graphlike CSS / surface', 'Workload-dependent', 'Minimum-weight matching objective', 'Stable'],
            ['Belief-Matching', 'Correlated-noise research', 'Workload-dependent', 'Evaluate locally', 'Research'],
            ['BP-OSD', 'qLDPC, LDPC', 'Workload-dependent', 'Evaluate locally', 'Research'],
            ['Union-Find', 'Large surface', 'Near-linear O(N)', 'Approximate', 'Stable'],
            ['GPU Batch', 'Supported batch workloads', 'Runtime-dependent', 'Validate locally', 'Workload-sensitive'],
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
          'API reference for qector_decoder_v3 1.0.0 package: stable and experimental decoders, utilities, and helper functions. v1.0.0 is the first stable release.'
        ) +
        h2('Stable decoders') +
        p('UnionFindDecoder, FastUnionFindDecoder, BlossomDecoder, SparseBlossomDecoder, BeliefMatching, BpOsdDecoder, BatchDecoder, CPUBatchDecoder, CUDABatchDecoder, OpenCLBatchDecoder, AutoDecoder (7-tier fallback), DecoderPool, get_decoder, clear_decoder_cache, decode_mmap, DecodeResult, decode_with_diagnostics, Workbench.') +
        h2('Experimental / research decoders') +
        p('HybridDecoder, HybridCascadeDecoder (full-feature / source build; public wheels may raise unavailable), PredecodedDecoder, ColourCodeDecoder, TwoStageDecoder, AmbiguityClusterDecoder, DecoderPool, LERBenchmark.') +
        h2('Utilities &amp; integration') +
        p('stim_compat.from_stim_detector_error_model, sinter_compat.qector_sinter_decoders (registered entry points), qiskit_plugin, pymatching shim (from qector_decoder_v3.pymatching import Matching), codes helpers, license.verify_license_token, run_mcp_server, qector decode / bench / serve CLI, qector-doctor.') +
        pre(
          `from qector_decoder_v3 import UnionFindDecoder, BlossomDecoder\nfrom qector_decoder_v3.stim_compat import from_stim_detector_error_model`
        )
    ),
  },
  {
    path: '/installer',
    title: 'Installation · QECTOR',
    description:
      'Install QECTOR Decoder v3 on Linux, macOS, or Windows. PyPI pip install with binary wheels, Python 3.9-3.13.',
    heading: 'Installation',
    body: page(
      h1('Installation') +
        p('QECTOR Decoder v3 is distributed through PyPI for Python 3.9+ on the platforms listed by the current release metadata. Check the exact wheel and dependency set before deployment.') +
        pre(
          `pip install qector-decoder-v3==${DECODER_VERSION}\n\n# Optional extras\npip install "qector-decoder-v3[stim]"   # Stim / Sinter / PyMatching / LDPC ecosystem\npip install "qector-decoder-v3[bench]"  # Local measurement tools\npip install "qector-decoder-v3[all]"    # Optional full environment\n\n# Verify\nqector-doctor\npython -c "import qector_decoder_v3 as qd; print(qd.__version__)"`
        ) +
        ul([
          'Linux, macOS, and Windows support is determined by the current PyPI wheel set.',
          'Optional Stim, measurement, and GPU dependencies are selected through documented extras.',
          'Run the installed diagnostic and inspect its backend-specific PASS / WARN / FAIL results before relying on optional paths.',
        ])
    ),
  },
  {
    path: '/license',
    title: 'License · QECTOR',
    description:
      'QECTOR Decoder v3 license terms and v1.0.0 token activation procedure. PolyForm Noncommercial for community use; written commercial licenses available.',
    heading: 'License',
    body: page(
      h1('License') +
        p(
          'QECTOR Decoder v3 is source-available under the PolyForm Noncommercial License 1.0.0: free for personal, academic, and non-commercial research use. Company use, funded institutional work, SaaS, OEM integration, redistribution, or commercial benchmarking requires a commercial license.'
        ) +
        h2('Commercial addendum: what a paid licence changes') +
        ul([
          'Grants the commercial use that PolyForm Noncommercial withholds, for the seats and term you purchased.',
          'Internal use only. Redistribution, sublicensing, OEM bundling, and customer-facing SaaS or hosted APIs are excluded unless a written Enterprise/OEM agreement grants them.',
          'Activated by setting <code>QECTOR_LICENSE</code> and <code>QECTOR_LICENSE_KEY</code> to your Ed25519 token; verification is offline, with no licence server and no phone-home.',
          'The package is byte-identical for licensed and unlicensed users. Without a token a licensing notice prints on import (suppressible with <code>QECTOR_SILENT=1</code>); no functionality is gated or disabled.',
          'No warranty, indemnification, exclusivity, trademark, or patent grant is included by default.',
         ]) +
         h2('License activation procedure') +
         ul([
           'Verify the purchase: the fulfillment worker accepts only a Stripe-signed live checkout event and records the reference, email, tier, and token in the protected fulfillment ledger.',
           'Install the official runtime: pip install --upgrade qector-decoder-v3==1.0.0 from the official PyPI project.',
           'Activate both variables: set QECTOR_LICENSE and QECTOR_LICENSE_KEY to the same token from the license email.',
           'Verify offline: python -c "import qector_decoder_v3 as q; print(q._is_license_active())" must print True; no license server or phone-home is involved.',
           'Keep the token with the Stripe invoice or payment confirmation. Never put it in a URL, issue tracker, chat, or public repository.',
         ]) +
         p('If either delivery email is missing or the token fails verification, contact <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a> with the Stripe reference. Do not open a duplicate checkout or dispute while delivery is being repaired.') +
         p('Full PolyForm Noncommercial License 1.0.0 text: <a href="https://polyformproject.org/licenses/noncommercial/1.0.0" style="color:#67e8f9;">polyformproject.org/licenses/noncommercial/1.0.0</a>: also bundled with the package distribution.') +
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
          'QECTOR collects the minimum data needed to operate: contact-form messages, licensing correspondence, and Stripe checkout records (processed by Stripe; card data never touches QECTOR servers). The decoder package performs no telemetry and no network calls: license verification is offline Ed25519 signature checking.'
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
          'Seller: Guillaume Lessard, sole proprietor, trading as iD01t Productions, 2004 De Lorimier, Longueuil, Québec, Canada, J4K 3H7. Contact: admin@qector.store. Prices are in US dollars and exclude tax. Payments are processed by Stripe. Governing law: Québec, Canada. Licence tokens are delivered instantly and all sales are final: see the <a href="/refund" style="color:#67e8f9;">refund policy</a>.'
        ) +
        p('Contact <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>')
    ),
  },
  {
    path: '/fr/terms',
    title: 'Conditions générales · QECTOR',
    description: "Conditions d'utilisation du site et du logiciel QECTOR Decoder v3 : licences, paiements Stripe, droit applicable au Québec.",
    noindex: true,
    heading: 'Conditions générales',
    body: page(
      h1('Conditions générales') +
        p(
          'En utilisant le logiciel QECTOR ou ce site web, vous acceptez ces conditions. Vendeur : Guillaume Lessard, entrepreneur individuel, exploitant sous le nom iD01t Productions, Québec, Canada. Tous les prix sont en dollars américains (USD), hors taxes. Les paiements sont traités par Stripe. Droit applicable : Québec, Canada. Les jetons de licence sont livrés instantanément et toutes les ventes sont finales : voir la <a href="/refund" style="color:#67e8f9;">politique de remboursement</a>.'
        ) +
        h2('Licence du logiciel') +
        p(
          'QECTOR Decoder v3 est concédé sous la licence PolyForm Noncommercial 1.0.0 pour l’usage non commercial. L’usage commercial exige un contrat de licence commerciale distinct. Voir la <a href="/license" style="color:#67e8f9;">page de licence</a>.'
        ) +
        h2('Exclusion de garanties') +
        p(
          'LE LOGICIEL EST FOURNI « TEL QUEL », SANS GARANTIE D’AUCUNE SORTE, EXPRESSE OU IMPLICITE. QECTOR Decoder v3 est un logiciel validé par simulation, pas une pile de tolérance aux pannes de production.'
        ) +
        h2('Limitation de responsabilité') +
        p(
          'EN AUCUN CAS LES AUTEURS OU LES DÉTENTEURS DES DROITS D’AUTEUR NE SERONT RESPONSABLES DE TOUTE RÉCLAMATION, DE TOUT DOMMAGE OU DE TOUTE AUTRE RESPONSABILITÉ DÉCOULANT DU LOGICIEL OU DE SON UTILISATION.'
        ) +
        p('Contact : <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>')
    ),
  },
  {
    path: '/refund',
    title: 'Refund Policy · QECTOR',
    description:
      'QECTOR Decoder v3 refund policy. Licence tokens are delivered instantly and are non-refundable; the $499 evaluation is the creditable way to try first.',
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
          'It is 100% creditable toward any annual tier purchased within 90 days of the evaluation start: $499 then Solo/Indie means you pay $800, not $1,299.',
          'To claim the credit, email your Stripe invoice number to admin@qector.store.',
        ]) +
        h2('Delivery problems are fixed, not refunded') +
        p(
          'If a token never arrives, is tied to the wrong email, or fails offline verification, that is a delivery fault on our side. Email admin@qector.store with your Stripe invoice number and we reissue it at no cost: please do not open a dispute. Tokens usually arrive in under 10 minutes; check your spam folder first.'
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
      'Model Context Protocol server for quantum error correction decoding. Local stdio JSON-RPC 2.0 tools exposing 8 verified library tools to any MCP client.',
    heading: 'QECTOR MCP Server',
    body: page(
      h1('QECTOR MCP Server') +
        p(
          'A Model Context Protocol server (MCP stdio, JSON-RPC 2.0, protocol 2024-11-05) exposing 8 verified library tools (list_code_families, list_decoders, get_license_info, decode_syndrome, decode_single, threshold_sweep, build_code_from_matrix, compat_report) for any MCP-compatible AI client. Runs on qector-decoder-v3==1.0.0 and mcp==1.26.0, and ships in the qector-claude-plugin repository.'
        ) +
        pre(`pip install qector-decoder-v3==${DECODER_VERSION} mcp==1.26.0\ngit clone https://github.com/GuillaumeLessard/qector-claude-plugin.git\npython qector-claude-plugin/mcp/mcp_server_library.py`)
    ),
    jsonLdExtra: [
      {
        '@type': 'SoftwareApplication',
        name: 'QECTOR MCP Server',
        description:
          'Model Context Protocol server (MCP stdio, JSON-RPC 2.0, protocol 2024-11-05) exposing 8 verified library tools for quantum error correction decoding. Runs on qector-decoder-v3==1.0.0 with mcp==1.26.0.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Linux, macOS, Windows',
        softwareVersion: '1.0.0',
        url: SITE_URL + '/mcp-server/',
        author: { '@type': 'Person', name: 'Guillaume Lessard', url: SITE_URL + '/guillaume-lessard/' },
      },
    ],
  },
  {
    path: '/claude-plugin',
    title: 'QECTOR Claude Plugin · Quantum Error Correction for Claude Code',
    description:
      'Official QECTOR Claude Code and Claude Desktop plugin v1.0.6. 28 skills, 5 agents, four MCP servers, and qector-decoder-v3 1.0.0 with local decoding.',
    heading: 'QECTOR Claude Plugin',
    body: page(
      h1('QECTOR Claude Plugin') +
        p(
          `Official QECTOR quantum error correction engineering plugin for Claude Code and Claude Desktop, version ${CLAUDE_PLUGIN_RELEASE.version} (published ${CLAUDE_PLUGIN_RELEASE.releaseDate}). Grounded in the QECTOR Decoder v3 reference manual (DOI 10.5281/zenodo.21941046) and the live qector-decoder-v3==1.0.0 Rust/PyO3 wheel. Local stdio transport keeps decoding inside the host environment; the plugin makes no license checks or telemetry calls.`
        ) +
        h2('28 Domain Skills') +
        p(
          'The plugin ships 28 skills. The seven flagship skills are qector-core (verified platform facts, 8 library MCP tools, 5 stable decoders, API grounding), qector-math-foundations (Theorems 1-16 executable ground truth over GF(2), fail-closed syndrome checking H c = s (mod 2), Wilson 95% CIs), qector-developer (Python SDK best practices, parity-check matrix generation, Sinter/Stim adapters, CI/CD testing), qector-researcher (literature review, threshold discovery, Monte Carlo noise simulation, reproducible export), qector-hardware-engineer (physical qubit mapping, heavy-hex/surface graph constraints, cryogenic error budgets), qector-educator (tutorial generation, conceptual explainers, interactive decoding walkthroughs), and qector-sysadmin (environment health diagnostics, resource bounds enforcement, runtime hygiene).'
        ) +
        h2('5 Specialized Agents') +
        ul([
          '<strong>qec-developer.md</strong>: Code integration, API design, performance tuning.',
          '<strong>qec-researcher.md</strong>: Academic research, paper reproduction, threshold sweeps.',
          '<strong>qec-validator.md</strong>: Formal mathematical verification and proof checking.',
          '<strong>qec-sysadmin.md</strong>: Operations, monitoring, incident response.',
          '<strong>qec-hardware-engineer.md</strong>: Physical qubit characterization, cryogenic systems.',
        ]) +
         h2('Four MCP Servers and Explicit Profiles') +
         p(
           'qector-library exposes 8 stable tools. qector-research exposes 29 provisional tools for methodology, DEM and circuit inspection, evidence, compatibility, and local measurements. qector-admin exposes 3 privileged tools and requires QECTOR_ADMIN_ENABLED=1 plus confirm=true. qector-desktop-mcp provides the safe Desktop profile with the 8 stable tools. All four servers run locally over stdio; the research and admin servers are opt in.'
         ) +
         h2('v1.0.6 Release Changes') +
         p(
           'The v1.0.6 release moves launchers from bin/ to scripts/ for Claude.ai marketplace compliance, adds a bin/ regression guard to every bundle, and makes qec-setup fall back to native diagnostics in sandboxed or remote environments. Python 3.9 through 3.13 is supported; interpreter pinning uses QECTOR_PYTHON.'
         ) +
         h2('Install with Claude Code') +
        pre(
          `claude plugin marketplace add GuillaumeLessard/qector-claude-plugin\nclaude plugin install qector@qector-tools`
        ) +
        h2('Local Plugin Directory Mode') +
        pre(
          `git clone https://github.com/GuillaumeLessard/qector-claude-plugin.git\ncd qector-claude-plugin\npip install -r requirements.txt\nclaude --plugin-dir .`
        )
    ),
    jsonLdExtra: [
      {
        '@type': 'SoftwareApplication',
        name: 'QECTOR Claude Plugin',
        description:
          'Official QECTOR plugin v1.0.6 for Claude Code and Claude Desktop. 28 skills, 5 agents, four MCP servers, and local decoding backed by qector-decoder-v3 1.0.0.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Linux, macOS, Windows',
        softwareVersion: '1.0.6',
        author: {
          '@type': 'Person',
          name: 'Guillaume Lessard',
          url: 'https://orcid.org/0009-0000-3465-3753',
        },
      },
    ],
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
          'Thank you. Your QECTOR Decoder v3 licence token is issued automatically by email within minutes of payment. Set it as both the QECTOR_LICENSE and QECTOR_LICENSE_KEY environment variables; verification is offline. If the email does not arrive, contact admin@qector.store with your Stripe receipt.'
      )
    ),
  },
  {
    path: '/blog',
    title: 'QEC Field Notes · QECTOR Blog',
    description: 'QECTOR field notes on quantum error correction, decoder algorithms, qLDPC, noise models, evidence, systems, and ecosystem integration.',
    heading: 'QECTOR Blog',
    body: page(
      h1('QECTOR Blog') +
         blogPosts.map(p => `<a href="/blog/${p.id}">${p.title}</a>`).join('<br/>')
    ),
    jsonLdExtra: [
      {
        '@type': 'Blog',
        name: 'QECTOR Blog',
        url: SITE_URL + '/blog/',
        description:
          'QECTOR field notes on quantum error correction, decoder algorithms, qLDPC, noise models, evidence, systems, and ecosystem integration.',
        blogPost: blogPosts.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          description: p.description,
          datePublished: '2026-08-09',
          image: OG_IMAGE,
          url: abs(`/blog/${p.id}`),
          author: { '@type': 'Person', name: 'Guillaume Lessard', url: `${SITE_URL}/guillaume-lessard/` },
        })),
      },
    ],
  },
  ...blogPosts.map((post) => ({
    path: `/blog/${post.id}`,
    title: `${post.title} · QECTOR Blog`,
    description: post.description,
    heading: post.title,
    body: page(
      h1(post.title) + p(post.description)
    ),
    jsonLdExtra: [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: '2026-08-09',
        dateModified: '2026-08-09',
        author: { '@type': 'Person', name: 'Guillaume Lessard', url: `${SITE_URL}/guillaume-lessard/` },
        publisher: { '@id': 'https://qector.store/#organization' },
        image: OG_IMAGE,
        url: abs(`/blog/${post.id}`),
        mainEntityOfPage: abs(`/blog/${post.id}`),
        isPartOf: { '@type': 'Blog', name: 'QECTOR Blog', url: SITE_URL + '/blog/' },
      },
    ],
  })),
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
      inLanguage: route.path.startsWith('/fr/') ? 'fr' : 'en',
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

  // Organization on every page so entities stay linked across the site.
  if (!route.jsonLdExtra?.some((n) => n['@type'] === 'Organization')) {
    graph.push(organizationNode);
  }

  if (route.jsonLdExtra) graph.push(...route.jsonLdExtra);

  return { '@context': 'https://schema.org', '@graph': graph };
}

