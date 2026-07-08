# QECTOR - qectorlab.github.io

**Useful static bridge for QECTOR Decoder v3 (high-performance library) and Qector Workbench (free GUI) under the qectorlab brand.**

**Primary site: [qector.store](https://qector.store) for full details, licensing, commercial evaluation.**

**Created by Guillaume Lessard (ORCID 0009-0000-3465-3753) / iD01t Productions. qectorlab org for Workbench and branding; decoder repo maintained under founder account.**

## Quick Start
```bash
pip install qector-decoder-v3
# Free GUI
# https://github.com/qectorlab/qector-decoder-workbench/releases/tag/v3.4.0
```

## Key Claims + Evidence (all on GitHub)
- Exact MWPM parity with PyMatching through d=15
- +35.7% LER reduction with Belief-Matching at d=5
- GPU batch (CUDA/OpenCL) bit-identical to CPU
- BP-OSD for qLDPC
- Hypergraph-safe Union-Find (recent releases)
- Full Stim + Sinter + PyMatching compatible

Reproducible artifacts: https://github.com/GuillaumeLessard/qector-decoder (e.g. stim_ler_d13_d15.json, full harness)

## Commercial
Source-Available (PolyForm Noncommercial for non-comm). Commercial use requires license.
Free: Workbench GUI, public PyPI (non-comm), all artifacts.
See qector.store/commercial for tiers (Researcher/Academic, Commercial Deployment, Enterprise + Support). Contact for eval.

## Links
- Store: https://qector.store
- Decoder: https://github.com/GuillaumeLessard/qector-decoder
- Workbench (free): https://github.com/qectorlab/qector-decoder-workbench
- PyPI: https://pypi.org/project/qector-decoder-v3/
- ORCID: https://orcid.org/0009-0000-3465-3753
- Book: Mastering QEC on Google Play

Primary source of truth: decoder repo README. This bridge has quick-start, claims, links.

## Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript, built with Vite 7 |
| Routing | `react-router` v7, route-based code splitting per page |
| Styling | Tailwind CSS 3, `tailwindcss-animate` |
| UI primitives | shadcn/ui on top of Radix UI |
| Motion | GSAP + ScrollTrigger for section reveals |
| 3D / visuals | `three`, `@react-three/fiber`, `@react-three/drei` (where used) |
| Charts | Inline SVG for benchmark visuals; `recharts` available |
| SEO | Custom `SEO` / `JsonLd` helpers in `src/lib/seo.tsx` (per-page title, description, structured data) |

## Getting started

```bash
npm install
npm run dev        # local dev server with HMR
npm run build       # type-check (tsc -b) + production build to dist/
npm run preview     # preview the production build locally
npm run lint         # eslint
```

Node 18+ is recommended. The production build type-checks the whole project before bundling - a failing `tsc -b` will fail the build.

## Project structure

```
src/
  components/       Shared UI building blocks
    ui/             shadcn/ui primitives (button, card, dialog, etc.)
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
    utils.ts        Class-name and misc utilities
  hooks/            Shared hooks (e.g. use-mobile)
```

### Shared component pattern

Cards, section headers, and evidence blocks are intentionally centralized (`components/*.tsx`, not `ui/*`) so that every page - Home, Decoder, Benchmarks, Evidence, Pricing, Evidence reports - renders the same visual language instead of re-implementing card markup per page. When adding a new page, prefer reusing one of these over writing new markup; if none fit, extract a new shared component rather than duplicating.

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

Numbers used across the site (exact MWPM parity to d=15, +35.7% Belief-Matching LER reduction, 98.3% optimal shots at d=9, 832/832 tests) are simulation-validated with reproducible artifacts in the decoder repository. Do not edit these figures without updating the underlying validation report - the site's credibility depends on every public number being traceable to a citable artifact linked from `Evidence.tsx` / `Benchmarks.tsx`.

## Deployment

The site is a static Vite build deployed to GitHub Pages from `qectorlab/qectorlab.github.io`. `npm run build` outputs to `dist/`; the deployed site is served from that output. SEO/crawler files (`robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`) and `.well-known` metadata live in `public/` and are copied as-is.

## License

Site content and code are © Guillaume Lessard / iD01t Productions. The QECTOR Decoder itself is dual-licensed (PolyForm Noncommercial for community use, commercial licenses available) - see [`/license`](https://qector.store/license) on the live site for current terms.
