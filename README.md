# QECTOR Website

Live site: [qector.store](https://qector.store)

This repository contains the static GitHub Pages deployment and the Vite/React source for QECTOR Decoder v3. The QECTOR Decoder v3 Reference Manual v1.0.0 is the normative source for decoder contracts and claim boundaries:

- DOI: [10.5281/zenodo.21941046](https://doi.org/10.5281/zenodo.21941046)
- Decoder repository: [github.com/GuillaumeLessard/qector-decoder](https://github.com/GuillaumeLessard/qector-decoder)
- Python package: [qector-decoder-v3 on PyPI](https://pypi.org/project/qector-decoder-v3/)

## Repository Layout

- `source/`: React, TypeScript, content, public assets, and build configuration.
- Root static files: the latest production build served by GitHub Pages.

## Local Development

```text
cd source
npm ci
npm run lint
npm run build
npm run dev
```

The build emits prerendered route shells for crawlers and direct GitHub Pages requests. The root static output is synchronized from `source/dist/` before deployment.

## Content and Evidence Policy

The site publishes no hardware-specific benchmark data, charts, screenshots, latency, throughput, VRAM, or threshold results. It publishes decoder contracts, methodology, limitations, and links to reproducible workflows so measurements can be generated on the target workload and machine.

Logical results must be scored in observable/coset space, not by raw correction-vector equality. Graphlike eligibility is structural; hyperedges route to BP-OSD. The public blog contains 20 scoped field notes across QEC foundations, decoder algorithms, qLDPC, noise models, evidence, systems, deployment, and ecosystem integration.

## Branding

The supplied QECTOR logo is `images/logo.png` and is copied to `source/public/images/logo.png` for the build. It is used by the header, footer, favicon, manifest, structured data, and Open Graph/Twitter metadata. No personal connection or audience export is included in the public site.

## License

Website content and code are copyright Guillaume Lessard / iD01t Productions. QECTOR Decoder licensing is described at [qector.store/license](https://qector.store/license) and [qector.store/commercial](https://qector.store/commercial).
