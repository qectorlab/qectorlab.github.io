# QECTOR Store Website

Official GitHub Pages repository for QECTOR Decoder 3 website.

QECTOR is a source-available Rust/Python quantum error correction decoder platform for reproducible benchmarking, research, and commercial QEC workflow evaluation.

Official website: https://qector.store  
Canonical decoder repository: https://github.com/GuillaumeLessard/qector-decoder  
PyPI package: https://pypi.org/project/qector-decoder-v3/  
Zenodo DOI: https://doi.org/10.5281/zenodo.20825980

## Canonical domain

Production canonical domain:

```text
https://qector.store
```

Repository `CNAME` must contain exactly:

```text
qector.store
```

`www.qector.store` should be redirected to `qector.store` through Cloudflare.

## Canonical public install

```bash
pip install qector-decoder-v3
python -c "from qector_decoder_v3 import UnionFindDecoder, BlossomDecoder; print('QECTOR OK')"
```

Do not make source-build commands the primary public website install path. Source builds are secondary and should be presented only for local development, licensed source review, or special environments.

## Public pages

- Home: https://qector.store/
- Decoder: https://qector.store/decoder.html
- Installer: https://qector.store/installer.html
- Docs: https://qector.store/docs.html
- Technical reference: https://qector.store/technical-reference.html
- Benchmarks: https://qector.store/benchmarks.html
- Workbench: https://qector.store/workbench.html
- License: https://qector.store/license.html
- Pricing: https://qector.store/pricing.html
- Commercial: https://qector.store/commercial.html
- About: https://qector.store/about.html
- Contact: https://qector.store/contact.html

## Current public release state

- QECTOR Decoder v0.5.3
- PyPI package: qector-decoder-v3
- Canonical source-available repository: GuillaumeLessard/qector-decoder
- DOI / provenance record: 10.5281/zenodo.20825980
- Public install command: pip install qector-decoder-v3
- Independent validation: 86/87 checks passing on v0.5.2 baseline; all five API failures closed in v0.5.3, post-fix 33/33 PASS + 1 SKIP
- All 30 decoder × code combinations produce 100% syndrome-valid corrections on tested combinations
- `pymatching_compat` bit-identical to PyMatching 2.4.0 on tested workloads
- CUDA batch output 100% CPU-agreeing across tested batch sizes on GTX 1660 Ti
- PyMatching remains an important baseline for exact MWPM workloads
- QECTOR is not marketed as production SaaS, OEM-ready embedded QEC, or real-time hardware QEC by default

## SEO and trust requirements

Every public page should keep these aligned:

- Version: v0.5.3
- Website: https://qector.store
- Repository: https://github.com/GuillaumeLessard/qector-decoder
- PyPI: https://pypi.org/project/qector-decoder-v3/
- DOI: https://doi.org/10.5281/zenodo.20825980
- Author / owner: Guillaume Lessard / iD01t Productions
- Install command: pip install qector-decoder-v3

## Cloudflare deployment

See `CLOUDFLARE_GITHUB_PAGES.md` for DNS, SSL/TLS, redirect, cache, Worker, Markdown negotiation, Link headers, Web Bot Auth, agent discovery, and DNS-AID notes.

## Pricing position

QECTOR is positioned as a v0.5.x Rust/Python QEC R&D platform, not a mature real-time hardware QEC stack.

Current public tiers:

- Non-commercial: Free
- Commercial Evaluation Pilot: $1,500 / 90 days
- Startup Commercial: $3,500 / year
- Professional / Lab: $15,000 / year
- Enterprise R&D: $35,000+ / year
- SaaS / Hosted API: contact-only review
- OEM / Embedded: contact-only partner validation
- Strategic Partnership: custom, no public exclusive-price floor

## License

QECTOR is source-available, not open-source.

Personal, academic, educational, and non-commercial research use is permitted under the source-available license.
