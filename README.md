# QECTOR · qectorlab.github.io

**Live site: [https://qector.store](https://qector.store)**

QECTOR Decoder v3: production-grade, simulation-validated quantum error correction decoder library (Rust + Python). Exact MWPM parity with PyMatching through d=15. +35.7% LER reduction with Belief-Matching at d=5. GPU batch (CUDA/OpenCL) bit-identical to CPU. BP-OSD for qLDPC. Free professional Workbench GUI.

**Important licensing**: QECTOR Decoder v3 is **Source-Available (not free)** for commercial use. The Workbench GUI app is free for everyone. See /pricing and /commercial on the site.

This repo serves the static GitHub Pages site (CNAME qector.store). Source in `source/`.

## Quick Start
```bash
pip install qector-decoder-v3
# Free GUI (recommended for most)
# https://github.com/qectorlab/qector-decoder-workbench/releases/tag/v3.4.0
```

Reproducible claims and artifacts: https://github.com/GuillaumeLessard/qector-decoder

## Verified Claims (see /benchmarks and GitHub artifacts)
- Exact MWPM parity d=3 to d=15 vs PyMatching
- Belief-Matching: -35.7% LER at d=5 (circuit noise)
- 98.3% optimal shots at d=9
- GPU batch: native, bit-identical output
- Full Stim / Sinter / PyMatching / Qiskit compatible

All numbers backed by public SHA-256 artifacts, seeds, and harness in the decoder repo.

## Key Pages on Site
- / : Homepage with Validation Report table + interactive simulator
- /changelog : Version history (PyPI RSS powered)
- /benchmarks : Full tables + Methodology & Reproducibility + direct repro commands + artifact links
- /pricing : Transparent tiers, honesty register, Source-Available language
- /commercial : Evaluation pilots, free vs licensed split, tiers (Researcher/Academic/Commercial/Enterprise)
- /decoder , /workbench , /sati-os , /sati-codex , /evidence , /about

## Branding & Scope
- qectorlab brand for the Workbench + site
- Decoder core maintained at https://github.com/GuillaumeLessard/qector-decoder
- Creator: Guillaume Lessard (ORCID 0009-0000-3465-3753) / iD01t Productions
- Related: SATI CODEX (LCL-833 / LCL-832), "Mastering QEC" book

## Local Development (source/)
```bash
cd source
npm install
npm run dev
npm run build   # outputs to source/dist
```

## Deploy
GitHub Actions (`.github/workflows/deploy.yml`) builds `source/` on push to main and deploys `source/dist` via Pages.

## Files of Note
- CNAME, _redirects, 404.html (SPA support), sitemap.xml, robots.txt, llms*.txt, ai.txt
- source/ : full Vite + React 19 + TS + Tailwind app
- root published files: current live snapshot (CI keeps in sync on deploy)

Primary source of truth for code + validation: the qector-decoder repo. This site presents it professionally.

Created by Guillaume Lessard. All rights and research under iD01t Productions.
