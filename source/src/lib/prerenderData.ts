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
import { LINKS, PRICES, usd, usdFr } from './pricing';
import { blogPosts } from './blogData';
import { CLAUDE_PLUGIN_RELEASE, PYPI_RELEASES } from './releases';
import { alternatesFor, legalToHtml, type LegalDoc } from './legal';
import { licenseAgreementEn, licenseAgreementFr } from '../content/licenseAgreement';
import { privacyEn, privacyFr } from '../content/privacy';
import { termsEn, termsFr, refundEn, refundFr } from '../content/terms';

/** Every legal document, EN and FR. Each becomes an indexable route whose
 *  static body is the full text (same source as the React page). */
export const LEGAL_DOCS: LegalDoc[] = [
  licenseAgreementEn, licenseAgreementFr, privacyEn, privacyFr, termsEn, termsFr, refundEn, refundFr,
];

function legalRoute(doc: LegalDoc): PrerenderRoute {
  return {
    path: doc.path,
    title: doc.seoTitle,
    description: doc.description,
    heading: doc.title,
    body: legalToHtml(doc),
    alternates: alternatesFor(doc).map((a) => [a.lang, a.href] as [string, string]),
  };
}

export const SITE_URL = 'https://qector.store';
export const SITE_NAME = 'QECTOR';
export const OG_IMAGE = 'https://qector.store/images/og-banner.png';
export const DECODER_VERSION = '1.0.1';
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
  /** hreflang alternates [lang, absolute URL] for translated page pairs. */
  alternates?: [string, string][];
  /** Source file whose git date is the page's sitemap lastmod (blog markdown). */
  sourceFile?: string;
  /** ISO publication date for articles (article:published_time). */
  published?: string;
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
  foundingDate: '2012',
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
    alternates: [['en', 'https://qector.store/'], ['fr', 'https://qector.store/fr/'], ['x-default', 'https://qector.store/']],
    title: 'QECTOR · Quantum Error Correction Decoding for Python',
    description:
      'QECTOR Decoder v3: Rust-core Python quantum error correction decoder with 17 configurations, a syndrome-faithful contract, and reproducible validation guidance.',
    heading: 'QEC Decoding for Python',
    body: page(
      h1('QEC Decoding for Python') +
        p(
          'QECTOR Decoder v3 is a Rust-core Python library with 17 concrete quantum error correction decoder configurations, from Blossom and Union-Find to BP-OSD, space-time, and optional batch paths. Workbench v1.0.7 lists 19 named kinds because it also includes the AutoDecoder and Auto Router orchestration entries. Version 1.0.0 defined API stability tiers, a qector CLI, and a qector-doctor diagnostic; 1.0.1 (2026-11-06) is the current release, with 18 wheels for Python 3.9-3.14 and signed build provenance.'
        ) +
        pre(
          `pip install qector-decoder-v3==${DECODER_VERSION}\n\nimport numpy as np\nfrom qector_decoder_v3 import BlossomDecoder\ndecoder = BlossomDecoder([[0, 1], [1, 2], [2, 3], [3, 4]], n_qubits=5)\ncorrection = decoder.decode(np.array([0, 1, 0, 0], dtype=np.uint8))`
        ) +
        h2('v1.0.0: first stable release') +
        ul([
          'Semantic-versioning frozen; the public API is governed by documented stability tiers (Stable / Workload-sensitive / Experimental).',
          'Sinter decoders (qector_blossom, qector_belief, qector_unionfind, and more; pass custom_decoders=qector_sinter_decoders()) and a qiskit-qec plugin.',
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
      'QECTOR Decoder v3: 17 decoder configurations in one Python library. Stable v1.0.1 (18 wheels, Python 3.9-3.14) with API tiers, Relay-BP, CS-OSD, Sinter/qiskit entry points, and qector bench.',
    heading: 'QECTOR Decoder v3',
    body: page(
      h1('QECTOR Decoder v3') +
        p(
          'Rust-core Python library implementing 17 decoder configurations from exact MWPM to GPU batch. v1.0.1 is the current stable release: API stability tiers, Relay-BP and CS-OSD in BP-OSD, Sinter/qiskit entry points, and the qector CLI. A reproducible benchmark harness (qector bench) ships in the package so you can measure on your own hardware. Stim-native, PyPI binary wheels, artifacts published on GitHub.'
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
            ['Languages', 'Rust core (PyO3) / Python 3.9-3.14 API'],
            ['Platforms', 'Linux x86_64, macOS ARM64, Windows x64 (18 binary wheels, Python 3.9-3.14)'],
            ['GPU', 'CUDA/OpenCL optional and environment-dependent; check the installed release diagnostics'],
            ['QEC library', 'Stim / Sinter / PyMatching / qiskit-qec compatible'],
            ['Packaging', 'PyPI binary wheels (18: cp39 to cp314 on Linux x86_64, Windows x64 and macOS arm64), each with Sigstore provenance; no sdist'],
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
      `QECTOR Decoder v3 commercial licensing, verified offline (air-gapped). Pro from ${usd(PRICES.proMonthly)}/month, Lab ${usd(PRICES.lab)}/yr, Enterprise from ${usd(PRICES.enterpriseFrom)}/yr. ${PRICES.refundDays}-day money-back. Prices in USD; tax added at checkout.`,
    heading: 'Pricing & Licensing',
    body: page(
      h1('Pricing & Licensing') +
        p(
          'QECTOR Decoder v3 is source-available: free for non-commercial, academic, and personal use under PolyForm Noncommercial 1.0.0. Commercial deployment requires a paid license. All prices are in US dollars (USD) and exclude tax.'
        ) +
        table(
          ['Tier', 'Price (USD)', 'Licence tier', 'Use case'],
          [
            ['Community (non-commercial)', '$0', 'Community', 'Research, academic, personal projects'],
            ['Pro', `${usd(PRICES.proMonthly)} / mo or ${usd(PRICES.proAnnual)} / yr`, 'Pro (distance 19)', `Production internal use, GPU batch decoding, email support. <a href="${LINKS.proMonthly}" style="color:#67e8f9;">Buy monthly</a> · <a href="${LINKS.proAnnual}" style="color:#67e8f9;">Buy annual</a>`],
            ['Pro Perpetual', `${usd(PRICES.proPerpetual)} one-time`, 'Pro (distance 19)', `Pro rights for every 1.x release of qector-decoder-v3; a new major version such as 2.0 is a new licence. <a href="${LINKS.proPerpetual}" style="color:#67e8f9;">Buy</a>`],
            ['Lab', `${usd(PRICES.lab)} / yr`, 'Enterprise (distance 63)', `Everything in Pro, code distances up to 63, priority support with SLA, onboarding call, one Validation Report. <a href="${LINKS.lab}" style="color:#67e8f9;">Buy Lab</a>`],
            ['Pilot', `${usd(PRICES.pilot)} one-time`, 'Pro, 60 days', `${PRICES.pilotDays}-day evaluation with an integration call, creditable toward Lab. <a href="${LINKS.pilot}" style="color:#67e8f9;">Buy Pilot</a>`],
            ['Enterprise / OEM / SaaS', `From ${usd(PRICES.enterpriseFrom)} / yr`, 'Enterprise', 'Redistribution, SaaS hosting, customer-facing APIs, hardware bundling'],
          ]
        ) +
        p(
          `<strong>Tax:</strong> prices are in USD and exclude tax; applicable sales tax, GST/HST or VAT is added at checkout from your billing address. <strong>Delivery:</strong> your licence token is e-mailed within minutes of payment: check your spam folder before contacting support. <strong>Renewals:</strong> Pro and Lab renew automatically until cancelled; cancel any time. <strong>Refunds:</strong> ${PRICES.refundDays}-day money-back guarantee on the first payment of every plan: see the <a href="/refund" style="color:#67e8f9;">refund policy</a>. <strong>Air-gapped:</strong> licence tokens are verified offline, with no licence server and no network call. <strong>Academic:</strong> universities, public research organisations and government institutions may use QECTOR free under PolyForm Noncommercial whatever their funding; academic institutions that want a paid plan get ${PRICES.academicDiscountPct}% off Lab.`
        ) +
        h2('Activating your license') +
        p(
          'Everyone installs the same wheel: <code>pip install --upgrade "qector-decoder-v3&gt;=1.0,&lt;2"</code>. If <code>QECTOR_LICENSE</code> is unset a licensing notice prints on import, which is expected for non-commercial use. Set both <code>QECTOR_LICENSE</code> and <code>QECTOR_LICENSE_KEY</code> to the same token. Every paid plan unlocks GPU (CUDA/OpenCL) batch decoding; CPU decoding is never blocked, and distance caps apply only with <code>QECTOR_ENFORCE=1</code>.'
        ) +
        pre(
          `# Commercial use: activate with the Ed25519 token from your licence email\nexport QECTOR_LICENSE="<your-token>"\nexport QECTOR_LICENSE_KEY="<your-token>"\n\n# Optional: suppress the licensing notice in CI logs\nexport QECTOR_SILENT=1\n\n# Verification is offline against a public key in the package.\n# No licence server, no phone-home, works air-gapped.\npython -c "import qector_decoder_v3 as q; print(q.get_license_info()['tier'])"`
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
    description: `Licences commerciales QECTOR Decoder v3, vérifiées hors ligne (hors réseau). Pro dès ${usdFr(PRICES.proMonthly)}/mois, Labo ${usdFr(PRICES.lab)}/an. Garantie de remboursement de ${PRICES.refundDays} jours. Prix en USD, taxes ajoutées au paiement.`,
    heading: 'Tarification et licences',
    body: page(
      h1('Tarification et licences') +
        p(
          'QECTOR Decoder v3 est disponible en source : gratuit pour un usage non commercial, académique et personnel sous PolyForm Noncommercial 1.0.0. Le déploiement commercial exige une licence payante. Tous les prix sont en dollars américains (USD), hors taxes.'
        ) +
        h2('Paliers') +
        ul([
          `Pro : ${usdFr(PRICES.proMonthly)}/mois ou ${usdFr(PRICES.proAnnual)}/an (palier Pro, distance 19, décodage GPU) · Pro Perpétuel : ${usdFr(PRICES.proPerpetual)} paiement unique.`,
          `Labo : ${usdFr(PRICES.lab)}/an (palier Entreprise, distances jusqu’à 63, support avec SLA).`,
          `Pilote de ${PRICES.pilotDays} jours : ${usdFr(PRICES.pilot)} paiement unique · Entreprise et OEM : dès ${usdFr(PRICES.enterpriseFrom)}/an.`,
          `Abonnements renouvelés automatiquement, annulables en tout temps. Garantie satisfait ou remboursé de ${PRICES.refundDays} jours sur le premier paiement.`,
          `Universités, organismes de recherche publics et institutions gouvernementales : usage gratuit sous PolyForm Noncommercial, quel que soit le financement. Rabais académique de ${PRICES.academicDiscountPct} % sur Labo pour les établissements qui veulent un forfait payant.`,
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
    title: 'Enterprise & OEM Licensing · QECTOR',
    description:
      'Enterprise and OEM licences for QECTOR Decoder v3: hosted and SaaS rights, OEM and hardware bundling, named support and a signed agreement, from $25,000 a year. Air-gapped licensing.',
    heading: 'Enterprise & OEM Licensing',
    body: page(
      h1('Enterprise & OEM Licensing') +
        p(
          'Standard tiers cover internal use. Enterprise agreements cover redistribution, SaaS hosting, OEM integration, hardware bundling, and commercial benchmarking: with written contracts, SLAs, and procurement-friendly paperwork (W-8/W-9, vendor profiles, signed EULAs).'
        ) +
        ul([
          'Custom scope: subsidiaries, deployments and redistribution rights.',
          'Priority support with response SLAs and integration guidance.',
          'Academic institutions: 40% discount on Lab.',
        ]) +
        p('Contact <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a> or see <a href="/pricing" style="color:#67e8f9;">pricing</a>.')
    ),
  },
  {
    path: '/guillaume-lessard',
    title: 'Guillaume Lessard · Founder and Lead Engineer, QECTOR',
    description:
      'Guillaume Lessard, founder and lead engineer of QECTOR: Rust and Python quantum error correction decoders, verifiable releases and offline licensing. Longueuil, Québec. ORCID 0009-0000-3465-3753.',
    heading: 'Guillaume Lessard',
    body: page(
      h1('Guillaume Lessard') +
        p('Founder and lead engineer of QECTOR. I build quantum error correction decoders in Rust and Python, and the release and licensing infrastructure that lets teams trust them. Based in Longueuil, Québec. ORCID 0009-0000-3465-3753.')
    ),
    jsonLdExtra: [
      {
        '@type': 'Person',
        '@id': 'https://qector.store/guillaume-lessard#person',
        name: 'Guillaume Lessard',
        identifier: '0009-0000-3465-3753',
        jobTitle: 'Founder and Lead Engineer, QECTOR',
        image: 'https://qector.store/assets/g.png',
        url: 'https://qector.store/guillaume-lessard/',
        email: 'admin@qector.store',
        address: { '@type': 'PostalAddress', addressLocality: 'Longueuil', addressRegion: 'QC', addressCountry: 'CA' },
        worksFor: { '@type': 'Organization', name: 'iD01t Productions', foundingDate: '2012' },
        knowsAbout: ['Quantum error correction', 'Minimum-weight perfect matching', 'Belief propagation and OSD decoding', 'qLDPC codes', 'Rust', 'Python'],
        sameAs: ['https://orcid.org/0009-0000-3465-3753', 'https://github.com/GuillaumeLessard', 'https://github.com/qectorlab', 'https://pypi.org/project/qector-decoder-v3/', 'https://www.linkedin.com/in/qector/', 'https://id01t.itch.io/'],
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
          'No universal benchmark figures are published on this site, because results depend on specific hardware; validation reports and SHA-256 sealed manifests are published with the evidence. v1.0.0 (2026-08-06) was the first stable release of the decoder; v1.0.1 (2026-11-06) is current.',
        ]) +
        p('Contact: <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>')
    ),
  },

  {
    path: '/changelog',
    title: 'Changelog · QECTOR',
    description:
      'Version history for QECTOR Decoder v3. Current release: v1.0.1 (2026-11-06). First stable release: v1.0.0 (2026-08-06). PyPI release train.',
    heading: 'Changelog',
    body: page(
      h1('Changelog') +
        h2('v1.0.1: 2026-11-06 (current)') +
        ul([
          'Code families corrected: rotated and unrotated surface, heavy-hex and colour codes build at their labelled distance; Union-Find peeling and GPU kernel parity fixed.',
          '18 binary wheels: CPython 3.9-3.14 on Windows x64, Linux x86_64 (manylinux_2_17) and macOS 11+ arm64, each installed and checked on its own OS before release.',
          'Signed build provenance (Sigstore) for every wheel plus PyPI attestations; Trusted Publishing with no API token.',
          'Every paid licence token (Pro or Enterprise) unlocks GPU batch decoding; licence metadata is the SPDX expression PolyForm-Noncommercial-1.0.0.',
          'QECTOR_OFFLINE=1 keeps the native core offline; nine advisories in optional network dependencies fixed.',
        ]) +
        h2('v1.0.0: 2026-08-06 (first stable release)') +
        ul([
          'Semantic-versioning frozen; the public API is governed by documented stability tiers (Stable / Workload-sensitive / Experimental / Internal detail).',
          'Ecosystem entry points registered: five Sinter decoders (qector_blossom, qector_belief, qector_unionfind, and more) and a qiskit-qec plugin.',
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
           '<a href="/claude-plugin" style="color:#67e8f9;">Claude Code Plugin</a>: v2.0.1 with an air-gapped qector-secure MCP server (12 schema-validated tools), 28 skills and 5 agents.',
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
          'API reference for the qector_decoder_v3 1.0.1 package: stable and experimental decoders, utilities, and helper functions.'
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
      'Install QECTOR Decoder v3 on Linux, macOS, or Windows. PyPI pip install with binary wheels, Python 3.9-3.14.',
    heading: 'Installation',
    body: page(
      h1('Installation') +
        p('QECTOR Decoder v3 is distributed through PyPI for Python 3.9-3.14 on the platforms listed by the current release metadata. Check the exact wheel and dependency set before deployment.') +
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
      'QECTOR Decoder v3 license terms and token activation procedure. PolyForm Noncommercial for community use; written commercial licenses available.',
    heading: 'License',
    body: page(
      h1('License') +
        p(
          'QECTOR Decoder v3 is source-available under the PolyForm Noncommercial License 1.0.0: free for personal, academic, and non-commercial research use. Universities, public research organisations, charities and government institutions may use it free whatever their funding source. Company use (including company work done under a research contract), SaaS, OEM integration, redistribution, or commercial benchmarking requires a commercial license.'
        ) +
        h2('Commercial addendum: what a paid licence changes') +
        ul([
          'Grants your organisation the internal commercial use that PolyForm Noncommercial withholds, for the term you purchased.',
          'Internal use only. Redistribution, sublicensing, OEM bundling, and customer-facing SaaS or hosted APIs are excluded unless a written Enterprise/OEM agreement grants them.',
          'Activated by setting <code>QECTOR_LICENSE</code> and <code>QECTOR_LICENSE_KEY</code> to your Ed25519 token; verification is offline, with no licence server and no phone-home.',
          'The same package serves licensed and unlicensed users. Without a token a licensing notice prints on import (suppressible with <code>QECTOR_SILENT=1</code>). A paid token unlocks GPU (CUDA/OpenCL) batch decoding and the tier code-distance limit; CPU decoding is never blocked, and distance caps apply only with <code>QECTOR_ENFORCE=1</code>.',
          'No warranty, indemnification, exclusivity, trademark, or patent grant is included by default.',
         ]) +
         h2('License activation procedure') +
         ul([
           'Verify the purchase: the fulfillment worker accepts only a Stripe-signed live checkout event and records the reference, email, tier, and token in the protected fulfillment ledger.',
           'Install the official runtime: pip install --upgrade "qector-decoder-v3&gt;=1.0,&lt;2" from the official PyPI project.',
           'Activate both variables: set QECTOR_LICENSE and QECTOR_LICENSE_KEY to the same token from the license email.',
           'Verify offline: python -c "import qector_decoder_v3 as q; print(q.get_license_info()[\'tier\'])" must print your paid tier (Pro or Enterprise), not Community; no license server or phone-home is involved.',
           'Keep the token with the Stripe invoice or payment confirmation. Never put it in a URL, issue tracker, chat, or public repository.',
         ]) +
         p('If either delivery email is missing or the token fails verification, contact <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a> with the Stripe reference. Do not open a duplicate checkout or dispute while delivery is being repaired.') +
         p('Full PolyForm Noncommercial License 1.0.0 text: <a href="https://polyformproject.org/licenses/noncommercial/1.0.0" style="color:#67e8f9;">polyformproject.org/licenses/noncommercial/1.0.0</a>: also bundled with the package distribution.') +
        p('QECTOR depends on open-source projects including Stim (Apache 2.0) and PyMatching (MIT); those licenses govern their respective components.') +
        p('Commercial terms: <a href="/pricing" style="color:#67e8f9;">pricing</a> · <a href="/refund" style="color:#67e8f9;">refund policy</a> · Contact <a href="mailto:admin@qector.store" style="color:#67e8f9;">admin@qector.store</a>')
    ),
  },
  ...LEGAL_DOCS.map(legalRoute),
  {
    path: '/getting-started',
    title: 'Getting Started · QECTOR Decoder v3',
    description: 'A 15-minute tutorial for QECTOR Decoder v3: install, a first checked decode, a Stim surface-code circuit, qLDPC decoding with BP-OSD, and Sinter. Every snippet is tested against version 1.0.1.',
    heading: 'Getting Started',
    body: page(h1('Getting Started') + p('Install qector-decoder-v3, decode a repetition code and check H·c = s, decode a Stim surface-code circuit, decode a bivariate bicycle qLDPC code with BP-OSD, and run Sinter. Every snippet was run against 1.0.1.')),
    jsonLdExtra: [{ '@type': 'HowTo', name: 'Getting started with QECTOR Decoder v3', totalTime: 'PT15M', step: ['Install and check', 'Your first decode, checked', 'Decode a Stim circuit', 'qLDPC with BP-OSD', 'Scale up with Sinter'].map((name, i) => ({ '@type': 'HowToStep', position: i + 1, name, url: `${SITE_URL}/getting-started/` })) }],
  },
  {
    path: '/use-cases',
    title: 'Use Cases · QECTOR',
    description: 'How quantum hardware teams, qLDPC researchers, universities and Claude users use QECTOR Decoder v3: weighted circuit decoding, GPU batches, BP-OSD for qLDPC, free academic use and offline licensing.',
    heading: 'Use Cases',
    body: page(h1('Use Cases') + p('Quantum hardware teams, qLDPC code researchers, universities and public labs, and teams working with Claude: what each gets from QECTOR and which plan fits.')),
  },
  {
    path: '/status',
    title: 'Status · QECTOR',
    description: "Live status of QECTOR's licence fulfilment, package index and revocation list. Installed software never depends on these: licences verify offline.",
    heading: 'Status',
    body: page(h1('Status') + p('Live checks of licence fulfilment, the PyPI package index and the revocation list. Licences verify offline, so installed software never depends on them.')),
  },
  {
    path: '/fr',
    title: 'QECTOR · Décodage de correction d’erreurs quantiques pour Python',
    description:
      'QECTOR Decoder v3 : décodeurs QEC à noyau Rust pour Python (Union-Find, MWPM, BP-OSD, Relay-BP, GPU). Gratuit pour la recherche non commerciale; licences commerciales dès 79 $ US/mois, vérifiées hors ligne.',
    heading: 'Décodage QEC pour Python',
    alternates: [['en', 'https://qector.store/'], ['fr', 'https://qector.store/fr/'], ['x-default', 'https://qector.store/']],
    body: page(h1('Décodage QEC pour Python') + p('Une seule bibliothèque pour plusieurs familles de décodeurs : Union-Find, MWPM exact, BP-OSD et Relay-BP, sur CPU et GPU, avec Stim et Sinter. Chaque correction est vérifiée contre son syndrome; les licences commerciales se vérifient hors ligne.')),
  },
  {
    path: '/security',
    title: 'Security & Trust · QECTOR',
    description:
      'QECTOR security and procurement pack: no telemetry, offline licence verification, Sigstore provenance on every wheel, signed releases, SBOM, vulnerability disclosure and data handling.',
    heading: 'Security & Trust',
    body: page(
      h1('Security & Trust') +
        ul([
          'No telemetry: the decoder, plugin and Workbench send nothing to QECTOR.',
          'Air-gapped licensing: Ed25519 licence tokens verified offline; no licence server.',
          'All 18 decoder wheels built in GitHub Actions with Sigstore provenance and PEP 740 attestations, published by Trusted Publishing.',
          'Each wheel tested on its own OS before release; receipts in platform-proof.json.',
          'Plugin releases signed (Ed25519 over SHA256SUMS) with an SPDX SBOM; dependencies pinned by SHA-256.',
          'Vulnerability reports: admin@qector.store, subject [SECURITY] QECTOR disclosure; acknowledged within 5 business days.',
        ])
    ),
  },
  {
    path: '/compare',
    title: 'QECTOR vs PyMatching, ldpc and fusion-blossom · Feature Comparison',
    description:
      'An honest feature comparison of QECTOR Decoder v3 with PyMatching, ldpc and fusion-blossom: decoder families, qLDPC support, GPU, Stim and Sinter, licences and support. No speed claims.',
    heading: 'How QECTOR Compares',
    body: page(
      h1('How QECTOR Compares') +
        p('PyMatching, ldpc and fusion-blossom are excellent open-source decoders. QECTOR offers many decoder families, qLDPC decoding and GPU batch decoding behind one API, with every correction checked against its syndrome. Features and licences only; no speed claims.')
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
          'A Model Context Protocol server (MCP stdio, JSON-RPC 2.0, protocol 2024-11-05) exposing 8 verified library tools (list_code_families, list_decoders, get_license_info, decode_syndrome, decode_single, threshold_sweep, build_code_from_matrix, compat_report) for any MCP-compatible AI client. Runs on qector-decoder-v3 1.0.x and mcp>=1.30,<3, and ships in the qector-claude-plugin repository.'
        ) +
        pre(`pip install qector-decoder-v3==${DECODER_VERSION} "mcp>=1.30,<3"\ngit clone https://github.com/GuillaumeLessard/qector-claude-plugin.git\npython qector-claude-plugin/mcp/mcp_server_library.py`)
    ),
    jsonLdExtra: [
      {
        '@type': 'SoftwareApplication',
        name: 'QECTOR MCP Server',
        description:
          'Model Context Protocol server (MCP stdio, JSON-RPC 2.0, protocol 2024-11-05) exposing 8 verified library tools for quantum error correction decoding. Runs on qector-decoder-v3 1.0.x with mcp>=1.30,<3.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Linux, macOS, Windows',
        softwareVersion: DECODER_VERSION,
        url: SITE_URL + '/mcp-server/',
        author: { '@type': 'Person', name: 'Guillaume Lessard', url: SITE_URL + '/guillaume-lessard/' },
      },
    ],
  },
  {
    path: '/claude-plugin',
    title: 'QECTOR Claude Plugin · Quantum Error Correction for Claude Code',
    description:
      'Official QECTOR Claude Code and Claude Desktop plugin v2.0.1: air-gapped qector-secure MCP server (12 schema-validated tools), 28 skills and 5 agents on qector-decoder-v3 1.0.1.',
    heading: 'QECTOR Claude Plugin',
    body: page(
      h1('QECTOR Claude Plugin') +
        p(
          `Official QECTOR quantum error correction engineering plugin for Claude Code and Claude Desktop, version ${CLAUDE_PLUGIN_RELEASE.version} (published ${CLAUDE_PLUGIN_RELEASE.releaseDate}). Grounded in the QECTOR Decoder v3 reference manual (DOI 10.5281/zenodo.21941046) and the live qector-decoder-v3 1.0.x Rust/PyO3 wheel. Local stdio transport keeps decoding inside the host environment; the plugin makes no license checks or telemetry calls.`
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
         h2('Four Plugin MCP Servers, Plus a Desktop Profile') +
         p(
           'qector-secure (the default) exposes 12 tools: the 8 stable library tools plus airgap_status, integrity_check, schema_catalog and audit_log_status; it refuses network access and validates every message against JSON Schema. qector-library exposes the 8 stable tools on their own. qector-research exposes 29 provisional tools for methodology, DEM and circuit inspection, evidence, compatibility, and local measurements. qector-admin exposes 3 privileged tools and requires QECTOR_ADMIN_ENABLED=1 plus confirm=true. The separate Claude Desktop adapter, qector-desktop-mcp, provides a safe profile with the 8 stable tools. Every server runs locally over stdio; the research and admin servers are opt in.'
         ) +
         h2('v2.0.1 Release') +
         p(
           'Runs on qector-decoder-v3 1.0.1. The default qector-secure server is air-gapped and integrity-checked and validates every request and response against JSON Schema 2020-12. Every dependency is pinned by SHA-256 for Python 3.10-3.13 on Linux, Windows and macOS; release archives are signed and ship with an SBOM and provenance. Interpreter pinning uses QECTOR_PYTHON.'
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
          'Official QECTOR plugin v2.0.1 for Claude Code and Claude Desktop: air-gapped qector-secure MCP server, 28 skills, 5 agents, local decoding on qector-decoder-v3 1.0.1.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Linux, macOS, Windows',
        softwareVersion: CLAUDE_PLUGIN_RELEASE.version,
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
    sourceFile: `public/blog/${post.filename}`,
    published: '2026-08-09',
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

