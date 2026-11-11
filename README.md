# QECTOR Website

Live site: [qector.store](https://qector.store)

This repository contains the Vite/React source of the site, the two Cloudflare Workers that sit in front of it, and the production audit. The QECTOR Decoder v3 Reference Manual v1.0.0 is the normative source for decoder contracts and claim boundaries:

- DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)
- Decoder repository: [github.com/GuillaumeLessard/qector-decoder](https://github.com/GuillaumeLessard/qector-decoder)
- Python package: [qector-decoder-v3 on PyPI](https://pypi.org/project/qector-decoder-v3/)

## Repository Layout

- `source/`: React, TypeScript, content, public assets, and build configuration.
- `workers/qector-fulfilment/`: Stripe webhook that signs and e-mails licence tokens (`qector.store/stripe/*`).
- `workers/qector-headers/`: adds the security headers and cache policy to every response.
- `scripts/security-audit.mjs`: checks the live headers, redirects and licence service (run nightly by `.github/workflows/security-audit.yml`).
- `gh-pages` branch: the built site, written by `npm run deploy`. Nothing is built or edited there by hand.

## Local Development

```text
cd source
npm ci
npx playwright install chromium   # once: the build prerenders every page
npm run dev
npm run lint
npm run build                     # type-check, bundle, prerender to dist/
```

## Deployment

```text
cd source
npm run build
npm run deploy             # commits dist/ to the local gh-pages branch
npm run deploy -- --push   # pushes it; GitHub Pages publishes within minutes
```

GitHub Pages serves the `gh-pages` branch, so only the built site is public on qector.store. The Workers are deployed separately with `npx wrangler deploy` from their own folders (see each folder's notes); deploy the site before `qector-headers` when both change, because the Worker's Content-Security-Policy is written for the current build.

## Content and Evidence Policy

The site publishes no hardware-specific benchmark data, charts, screenshots, latency, throughput, VRAM, or threshold results. It publishes decoder contracts, methodology, limitations, and links to reproducible workflows so measurements can be generated on the target workload and machine.

Logical results must be scored in observable/coset space, not by raw correction-vector equality. Graphlike eligibility is structural; hyperedges route to BP-OSD. The public blog contains 20 scoped field notes across QEC foundations, decoder algorithms, qLDPC, noise models, evidence, systems, deployment, and ecosystem integration.

## Branding

The supplied QECTOR logo is `source/public/images/logo.png`. It is used by the header, footer, favicon, manifest, structured data, and Open Graph/Twitter metadata. No personal connection or audience export is included in the public site.

## License

Website content and code are copyright Guillaume Lessard / iD01t Productions. QECTOR Decoder licensing is described at [qector.store/license](https://qector.store/license) and [qector.store/commercial](https://qector.store/commercial).
