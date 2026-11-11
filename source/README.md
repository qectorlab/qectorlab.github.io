# QECTOR - qectorlab.github.io

**Source of qector.store: QECTOR Decoder v3 (Python library, Rust core) and the free QECTOR Workbench GUI, under the qectorlab brand.**

**Release numbers are not repeated here: `src/lib/releases.ts` is the single source for the decoder, Workbench and plugin versions shown on the site.**

**Primary site: [qector.store](https://qector.store) for full details, licensing, commercial evaluation.**

**Created by Guillaume Lessard (ORCID 0009-0000-3465-3753) / iD01t Productions. qectorlab org for Workbench and branding; decoder repo maintained under founder account.**

## Quick Start
```bash
pip install qector-decoder-v3
# Free Workbench: https://qector.store/workbench/
```

## Key Claims + Evidence (all on GitHub)
- Stable 1.0 line: fifteen documented backend families; API stability tiers; Relay-BP, CS-OSD, LLR damping, ColourCodeDecoder, TwoStageDecoder, and AmbiguityClusterDecoder
- No universal benchmark figures are published on the site, because results depend on specific hardware, drivers, and workloads
- The package ships the benchmark harness (`qector bench` prints one honest, machine-conditional rate line) and `qector-doctor` (15-point environment diagnostic) so results can be reproduced on your own machines
- Validation reports, SHA-256 sealed artifact manifests, and claim-boundary documentation are published on GitHub and at https://qector.store/evidence
- BP-OSD for qLDPC; Hypergraph-safe Union-Find
- Full Stim + Sinter + PyMatching compatible; `sinter.collect()` needs no custom_decoders=

Reproducible artifacts: https://github.com/GuillaumeLessard/qector-decoder (validation + harness, full evidence)

## Commercial
Source-Available (PolyForm Noncommercial for non-comm). Commercial use requires license.
Free: Workbench GUI, public PyPI (non-comm), all artifacts.
See qector.store/commercial for tiers (Researcher/Academic, Commercial Deployment, Enterprise + Support). Contact for eval.

## Links
- Store: https://qector.store
- Decoder: https://github.com/GuillaumeLessard/qector-decoder
- Workbench (free): https://qector.store
- PyPI: https://pypi.org/project/qector-decoder-v3/
- ORCID: https://orcid.org/0009-0000-3465-3753
- Book: Mastering QEC on Google Play

Primary source of truth: decoder repo README. This bridge has quick-start, claims, links.

## Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript, built with Vite 7 |
| Routing | `react-router` v7, route-based code splitting per page |
| Styling | Tailwind CSS 3, `tailwindcss-animate`, `@tailwindcss/typography` |
| Icons | `lucide-react` |
| Fonts | Inter and JetBrains Mono, bundled (`@fontsource-variable/*`); no third-party font host |
| Motion | `useScrollReveal` (IntersectionObserver + Web Animations) and CSS; no animation library |
| Charts | Inline SVG |
| Blog | Markdown rendered with `react-markdown`, GFM, KaTeX |
| Static generation | Every route is rendered to HTML by React at build time (`react-dom/static`) and hydrated in the browser |
| SEO | Custom `SEO` / `JsonLd` helpers in `src/lib/seo.tsx`; per-route metadata in `src/lib/prerenderData.ts` |

## Getting started

```bash
npm ci
npm run dev         # local dev server with HMR
npm run typecheck   # tsc -b
npm run lint        # eslint
npm run build       # tsc -b, production bundle, then every route rendered to static HTML in dist/
npm run preview     # preview the production build locally
npm run check       # static, browser and accessibility checks of dist/ (needs `npx playwright install chromium` once)
npm run deploy      # commit dist/ to the gh-pages branch (add `-- --push` to publish)
```

Node 22 is what the audit workflow uses. The build type-checks first: a failing `tsc -b` fails the build. It needs no browser: Playwright is only used by the checks (`npm run check`) and by `npm run og`.

### How a page is built and loaded

1. `vite build` bundles the site and writes one HTML file per route (`dist/<route>/index.html`, plus `404.html`). Each has the route's `<head>` (title, description, canonical, Open Graph, JSON-LD, hreflang, and the `<link>` tags for the route's own chunk and stylesheet) and a short summary in `#root`. Routes come from `src/App.tsx` and the blog posts; a route without an entry in `src/lib/prerenderData.ts` is a build error. `npm run build:spa` stops here.
2. `scripts/prerender.mjs` bundles `src/entry-server.tsx` for Node (a Vite SSR build) and renders every route with React itself (`prerender` from `react-dom/static`, which waits for lazy routes) at the URL the browser will have (`/pricing/`). The result replaces the summary in `#root`, marked with that URL (`data-prerendered`). It prints how many routes it rendered, and fails if a page is left with a loading state, hidden content or a script.
3. In the browser, `src/main.tsx` attaches to that HTML with `hydrateRoot`. Nothing is rendered twice, and a lazy route's static HTML stays on screen while its chunk loads.

Three pages differ. Blog posts carry their Markdown as a JSON data block (`<script type="application/json" id="qector-post">`, never executed, so the Content-Security-Policy is not involved): the browser starts from it instead of fetching the article, and still fetches when a post is opened by navigating inside the site. `/success` depends on its query string, so nothing is generated for it and the browser renders it (`CLIENT_RENDERED_ROUTES` in `vite.config.ts`). `404.html` contains the NotFound page, but it is served for every unknown URL, so the browser renders it again instead of attaching to it.

Hydration only works when the browser's first render produces exactly what the build produced. Code that runs during render must therefore give the same result in Node and in every browser: `window`, `document`, the clock, random numbers and locale-dependent formatting (`toLocaleDateString`) belong in effects and event handlers. `npm run check:browser` opens every route and fails on any hydration error and on static HTML that React had to render again.

## Project structure

```
src/
  components/       Shared UI building blocks
    Navigation.tsx  Site header, mobile menu, active-route highlighting
    Footer.tsx      Site footer, link groups, legal links
    Layout.tsx      Page shell: skip link, route-change focus management
    SectionHeader.tsx    Eyebrow + heading + description pattern
    MetricCard.tsx        Single validated number/claim (stat or note card)
    AlgorithmCard.tsx     Decoder / evidence-report card with badge + proof
    PricingTierCard.tsx   Pricing tier card (included/excluded features, CTA)
    EvidenceBlock.tsx     Citable evidence unit linking to GitHub artifacts
    ChangelogEntry.tsx    Single version/release entry
    TrustSignal.tsx        External-link pill (PyPI, GitHub, ORCID…)
    NeuralReveal.tsx       Decorative scramble-in text effect for headings
  pages/            One file per route (see Navigation.tsx for the route list)
  lib/
    seo.tsx         <SEO> and <JsonLd> helpers
    releases.ts     Release constants (versions, Python range, DOIs)
    prerenderData.ts  Per-route title, description and structured data
  hooks/            Shared hooks (useScrollReveal, usePyPIVersion)
```

### Shared component pattern

Cards, section headers, and evidence blocks are intentionally centralized in `components/*.tsx` so that every page - Home, Decoder, Evidence, Pricing, Docs - renders the same visual language instead of re-implementing card markup per page. When adding a new page, prefer reusing one of these over writing new markup; if none fit, extract a new shared component rather than duplicating.

## Accessibility

The site targets WCAG 2.1 AA. Notable patterns in place:

- Skip-to-content link and route-change focus management (`Layout.tsx`).
- Keyboard-operable tab groups (`role="tablist"`/`"tab"`/`"tabpanel"`, arrow-key navigation) - see the product switcher on `Pricing.tsx`.
- `NeuralReveal` (the scramble-in heading effect) exposes the final text via `aria-label` and hides the animated glyphs from assistive tech with `aria-hidden`; it also honors `prefers-reduced-motion` and skips the scramble entirely.
- Decorative SVGs and background video are `aria-hidden`; data-bearing SVG charts use `role="img"` with a text `aria-label` that states the actual values, and the underlying data is also present in an adjacent HTML table where applicable.
- Form fields use explicit `<label htmlFor>` / `id` pairing, not implicit/visual-only association.
- Included/excluded feature lists (pricing cards) are distinguished by icon *and* text, not color alone.

When adding new interactive UI, match these patterns: real semantics over ARIA when possible, decorative content hidden from AT, state changes (tabs, forms, filters) exposed via `aria-selected`/`aria-current`/`aria-live` as appropriate, and no information conveyed by color alone.

## Content & claims policy

No universal benchmark figures are published on the site, because results depend on specific hardware, drivers, and workloads; the `qector bench` harness and `qector-doctor` diagnostic ship with the package so results can be reproduced on your own machines. The official v1.0.0 reference manual (DOI 10.5281/zenodo.21941046) defines the decoder contracts, evidence anchors, limitations, and claim boundaries. Validation reports and SHA-256 sealed manifests are published on GitHub and linked from `Evidence.tsx`. Do not reintroduce published performance figures without a citable, hardware-specific artifact: the site's credibility depends on every public number being traceable to a citable artifact linked from `Evidence.tsx`.

## Deployment

The site is a static Vite build published to GitHub Pages from the `gh-pages` branch of `qectorlab/qectorlab.github.io`: `npm run build` writes `dist/`, and `npm run deploy` commits that folder to the branch (hashed files of the previous build are kept for one more deploy, so open tabs keep working). SEO and crawler files (`robots.txt`, `llms.txt`, `llms-full.txt`) and `.well-known` metadata live in `public/` and are copied as-is; `sitemap.xml` is generated from the routes at build time. Response headers come from the `qector-headers` Worker, which mirrors `public/_headers`.

## License

Site content and code are © Guillaume Lessard / iD01t Productions. The QECTOR Decoder itself is dual-licensed (PolyForm Noncommercial for community use, commercial licenses available) - see [`/license`](https://qector.store/license) on the live site for current terms.
