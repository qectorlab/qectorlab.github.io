# QECTOR Lab

Official GitHub Pages repository for QECTOR.

QECTOR is a source-available quantum error correction decoder platform for reproducible benchmarking, research, and commercial QEC workflow evaluation.

Official website: https://www.qector.store  
Official contact: admin@qector.store  
Decoder repository: https://github.com/qectorlab/qector-decoder

## Canonical repository

The canonical decoder repository is:

```text
https://github.com/qectorlab/qector-decoder
```

This website, repository metadata, and public install commands must all point to `qectorlab/qector-decoder`.

## Public pages

- Home: https://www.qector.store/
- Decoder: https://www.qector.store/decoder.html
- Installer: https://www.qector.store/installer.html
- Docs: https://www.qector.store/docs.html
- Benchmarks: https://www.qector.store/benchmarks.html
- Workbench: https://www.qector.store/workbench.html
- License: https://www.qector.store/license.html
- Pricing: https://www.qector.store/pricing.html
- Commercial: https://www.qector.store/commercial.html
- About: https://www.qector.store/about.html
- Contact: https://www.qector.store/contact.html

## Current public validation

- QECTOR Decoder v0.5.0
- 832 Python tests passed
- 87 Rust unit tests passed
- 0 skipped / 0 xfailed / 0 failed in the local validation report
- reference validation report build: git 729282f
- d=15 LER parity vs PyMatching on tested workloads
- 34.8% lower observed LER at d=5 with belief-matching in the selected 3,000-shot correlated workload
- CUDA/OpenCL bit-identical to CPU on tested batches
- PyMatching remains the latency leader for exact MWPM

The `729282f` value is the audited decoder report build reference. It is not meant to describe the latest website commit or the latest repository tip after documentation and packaging updates.

## Pricing position

QECTOR is positioned as a v0.5 Rust/Python QEC R&D platform, not a mature real-time hardware QEC stack.

Current public tiers:

- Non-commercial: Free
- Commercial Evaluation Pilot: $1,500 / 90 days
- Startup Commercial: $3,500 / year
- Professional / Lab: $15,000 / year
- Enterprise R&D: $35,000+ / year
- SaaS / Hosted API: Contact-only beta review
- OEM / Embedded: Contact-only partner validation
- Strategic Partnership: Custom, no public exclusive-price floor

## Website conversion fixes

The website directly addresses the main conversion gaps:

- Visible pricing on the landing page
- Links to benchmark evidence and reproduction workflow
- Docs hub for install, API, examples, benchmarks, and commercial evaluation
- About page with Guillaume Lessard / iD01t Productions identity
- Workbench positioned as planned reproducibility product, not shipped product
- Clear statement that QECTOR is not a fastest-PyMatching or real-time hardware claim
- Correct install command based on the actual live repository contents

## Installer status

The live decoder repository currently does **not** ship `install.py`. The website therefore documents the real source build path.

PowerShell:

```powershell
git clone https://github.com/qectorlab/qector-decoder.git
cd qector-decoder

py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip maturin

$env:PYO3_PYTHON = (Resolve-Path .\.venv\Scripts\python.exe).Path
.\.venv\Scripts\python.exe -m maturin develop --release --no-default-features

.\.venv\Scripts\python.exe -c "from qector_decoder_v3 import UnionFindDecoder; print('QECTOR OK')"
```

Git Bash:

```bash
git clone https://github.com/qectorlab/qector-decoder.git
cd qector-decoder

python -m venv .venv
source .venv/Scripts/activate
python -m pip install --upgrade pip maturin

export PYO3_PYTHON="$(pwd -W)/.venv/Scripts/python.exe"
python -m maturin develop --release --no-default-features

python -c "from qector_decoder_v3 import UnionFindDecoder; print('QECTOR OK')"
```

## License

QECTOR is source-available, not open-source.

Personal, academic, educational, and non-commercial research use is permitted under the source-available license.

Commercial use requires a paid commercial license.

## Contact

admin@qector.store

Copyright © 2026 Guillaume Lessard / iD01t Productions. All rights reserved.
