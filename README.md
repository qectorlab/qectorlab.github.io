# QECTOR Lab

Official GitHub Pages repository for QECTOR.

QECTOR is a source-available quantum error correction decoder platform for reproducible benchmarking, research, and commercial QEC workflow evaluation.

Official website: https://www.qector.store  
Official contact: admin@qector.store  
Decoder repository: https://github.com/qectorlab/qector-decoder

## Public pages

- Home: https://www.qector.store/
- Decoder: https://www.qector.store/decoder.html
- Installer: https://www.qector.store/installer.html
- Benchmarks: https://www.qector.store/benchmarks.html
- Workbench: https://www.qector.store/workbench.html
- License: https://www.qector.store/license.html
- Pricing: https://www.qector.store/pricing.html
- Commercial: https://www.qector.store/commercial.html
- Contact: https://www.qector.store/contact.html

## Current public validation

- 832 tests collected
- 829 passed / 2 skipped / 1 xfailed
- git 729282f
- d=15 LER parity vs PyMatching on tested workloads
- 33.7% lower observed LER at d=5 with belief-matching in the headline run
- CUDA/OpenCL bit-identical to CPU on tested batches
- PyMatching remains the latency leader for exact MWPM

## Installer status

The website documents the robust AIO installer for the decoder repository:

```bash
git clone https://github.com/qectorlab/qector-decoder.git
cd qector-decoder

python install.py --install-rust
```

The installer handles missing Rust, Python version mismatch, thin checkout repair, Git Bash linker path cleanup, prebuilt wheel fallback, dev dependency installation, and pytest execution through the virtual environment.

Verified Windows Git Bash path:

- Python 3.11 selected automatically for the bundled cp311 wheel
- `.venv` created successfully
- QECTOR Decoder v3 0.4.0 installed from the compatible Windows wheel
- dev and benchmark dependencies installed
- pytest discovered 832 tests

## License

QECTOR is source-available, not open-source.

Personal, academic, educational, and non-commercial research use is permitted under the source-available license.

Commercial use requires a paid commercial license.

## Contact

admin@qector.store

Copyright © 2026 Guillaume Lessard / iD01t Productions. All rights reserved.