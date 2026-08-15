# QECTOR Blog Upgrade Worklist

Status: complete; published to GitHub and verified live
Updated: 2026-08-15

## Sources Read

- `QectorDecoder_v3_Reference_Manual_v1.0.0.pdf`: all 57 pages, including appendices, evidence index, reproduction commands, limitations, and references.
- Private audience notes supplied for planning: read in full and used only for aggregate editorial planning. No names, profile URLs, counts, or individual details are reproduced or disclosed in site content.
- DOI record: `https://doi.org/10.5281/zenodo.21941046` and Zenodo API metadata. Published record title, version 1.0.0, publication date 2026-08-14, one PDF file.
- Repository: existing source tree, 10 source blog posts, deployed duplicate blog posts, blog metadata, React routes, prerender metadata, generated assets, and build configuration.

## Ground-Truth Editorial Rules

1. Treat `QectorDecoder_v3_Reference_Manual_v1.0.0.pdf` version 1.0.0 as normative for QECTOR-specific claims.
2. Keep the universal correctness contract explicit: `H c = s (mod 2)` for reachable syndromes.
3. Distinguish syndrome faithfulness from logical success: `c + e` is in `ker(H)` after a faithful decode; logical success requires `c + e` in `im(H^T)`.
4. State degeneracy and score logical observables/cosets, never raw correction equality alone.
5. Apply the structural guard: matching/Union-Find paths are for graphlike inputs; a qubit degree greater than 2 routes to BP-OSD.
6. Scope every exactness, near-optimality, bit-identity, and accuracy statement to the workload and tests named by the manual.
7. Do not publish withdrawn or unsupported latency, throughput, memory, VRAM, threshold, or hardware numbers as QECTOR facts. Explain the required methodology instead.
8. Preserve the manual's limitations: learned decoders are research-grade, Python streaming is not full circuit-level matching, network surfaces need deployment review, OpenCL is a source-build path, and GPU claims are tested-configuration claims.
9. Use the DOI as the canonical reference: `10.5281/zenodo.21941046`.
10. Avoid reproducing follower names, profile URLs, counts beyond the public aggregate already implied by the filename, or any personally identifying audience segmentation.

## Audience-Level Content Map

The connection export indicates interest across these broad, non-identifying groups:

- QEC, quantum information, algorithms, and mathematical foundations
- Quantum hardware, calibration, control, photonics, and measurement systems
- Rust/Python systems engineering, HPC, compilers, and performance work
- GPU, CUDA/OpenCL, reproducibility, testing, and benchmarking
- qLDPC, BP-OSD, machine learning, GNNs, and quantum-AI research
- Quantum software ecosystem integration, Stim/Sinter/PyMatching/Qiskit, and APIs
- Product, commercialization, procurement, workforce, and responsible technical communication
- Students, educators, science communicators, and technically curious readers

Content will serve these needs through practical explanations, worked examples, implementation contracts, evidence literacy, and deployment trade-offs without using individual audience data.

## Existing Post Audit

- Posts 1-10 cover the manual's main algorithm families, but frequently state withdrawn benchmark values as current facts.
- Several posts call Sparse Blossom universally exact, describe unverified internal SIMD/allocator details, or imply thresholds and production guarantees not made by the manual.
- Existing posts use figures the manual marks as excluded benchmark artifacts; only included structural figures may remain.
- Metadata dates and descriptions are stale and do not identify the Zenodo manual as the source of scope boundaries.
- The deployed root `blog/` copy and source `source/public/blog/` copy must remain identical.
- `source/src/lib/blogData.ts` and prerendered route metadata must list all 20 posts after the expansion.

## Planned Existing-Post Upgrades

Rewrite each current post around a clear reader promise, a worked mathematical or engineering example, a scoped claim box, limitations, and a DOI/evidence note:

1. QEC foundations and the syndrome-faithful contract
2. Exact Blossom/MWPM and path-flipping correctness
3. Sparse Blossom region growth, tight edges, and candidate escalation
4. UF-01 parity algebra, peeling, and graphlike eligibility
5. BP-OSD for hypergraphs and the residual GF(2) solve
6. Ambiguity clustering and the boundary between learned priors and proof
7. Space-time detectors, measurement faults, and streaming scope
8. Auto routing, cascade acceptance, and two-stage CSS feedforward
9. GPU batch decoding, deterministic state isolation, and tested bit identity
10. Evidence-first benchmarking and the v1.0.0 architecture map

## Planned Ten New Posts

11. A hand-worked Steane `[[7,1,3]]` decode and logical cosets
12. Rotated surface code `d=3`: checks, boundaries, and graphlike structure
13. Detector error models: parsing, graph collapse, priors, and observables
14. Why weighted decoding matters and how `log((1-p)/p)` changes paths
15. Logical error rates: observables, Wilson intervals, and comparable noise models
16. Choosing a decoder: a structural decision guide for graphlike and qLDPC codes
17. Reproducible QEC benchmarks: hot/cold paths, metadata, hashes, and claims
18. Rust + PyO3 architecture: FFI buffers, GIL release, Rayon, and memory reuse
19. Shipping responsibly: API stability, wheels, licensing, and service hardening
20. A practical QECTOR integration path: Python, Stim/Sinter, PyMatching, and Qiskit

## Execution Steps

### Step 1: Establish the editorial contract

- Create this file with the completed analysis and status.
- Confirm no audience-identifying information is copied into public content.

### Step 2: Rewrite the existing ten posts

- Replace unsupported claims with manual-scoped wording.
- Remove excluded benchmark figures and unsupported numerical tables.
- Keep included structural figures only where they improve understanding.
- Add references to the manual and DOI, plus explicit limitations.
- Update both blog copies after the source version is reviewed.

### Step 3: Create ten new posts

- Add posts 11-20 in the source public directory.
- Mirror them into the deployed blog directory.
- Give each post a distinct audience entry point and a practical takeaway.

### Step 4: Wire discovery and SEO

- Add all 20 entries to `source/src/lib/blogData.ts`.
- Update blog page copy, descriptions, dates, static prerender route data, sitemap, and generated deployment output.
- Keep route IDs, filenames, canonical URLs, and Markdown image handling consistent.

### Step 5: Validate and close out

- Run lint and production build from `source/`.
- Confirm every metadata file has a matching Markdown file in both locations.
- Confirm all internal links, image references, route shells, sitemap URLs, and DOI references.
- Search for prohibited unsupported numeric claims and follower-identifying text.
- Update this file with commands, results, remaining limitations, and final status.

### Step 6: Remove non-portable benchmark artifacts

- Delete hardware-specific benchmark charts, screenshots, sample outputs, and stale benchmark artifacts.
- Keep only methodology, correctness contracts, and instructions for independently generated local evidence.
- Ensure social metadata uses the official QECTOR logo and no removed asset is referenced.
- Rebuild and replace the deployed static output so stale generated files cannot survive.

### Final Verification Record

- `npm run lint`: passed with zero errors.
- `npm run build`: passed locally; emitted 22 prerendered route shells plus the 404 fallback.
- `npm audit --omit=dev`: passed with 0 vulnerabilities after the React Router security update.
- Content integrity: 20 source posts and 20 deployed posts; all metadata filenames resolve in both copies.
- Benchmark cleanup: hardware-specific charts, screenshots, sample outputs, stale graph artifacts, and invalid helper artifacts removed. Methodology and correctness contracts remain.
- Branding: official `logo.svg` is used for favicon, navigation, footer, structured data, and manifest; official raster `og-image.png` is used for Open Graph/Twitter sharing.
- Privacy: no audience export, names, profile URLs, or individual connection details are present in public content.
- GitHub Pages: build status `built` for commit `1a2bb6b2c7ed21f6b04dada7a3e71be9046bfd16`, source `main:/`, custom domain `qector.store`.
- Live cache-busted checks: `https://qector.store/`, `/blog`, and `/assets/og-image.png` return the upgraded content/logo.
- Published commits: `1a2bb6b feat(site): rebuild content and remove benchmark artifacts`; `fa8405e docs: record final site verification`.

## Status Log

- [x] Read the full manual, DOI metadata, private audience notes, and repository audit.
- [x] Defined the claim boundary and aggregate audience map.
- [x] Created `todo2.md` before implementation.
- [x] Rewrite existing posts and synchronize both blog copies.
- [x] Create ten new posts and synchronize both blog copies.
- [x] Update metadata, prerender/SEO, sitemap, and deployed output (initial pass).
- [x] Remove non-portable benchmark artifacts and old invalid helper files.
- [x] Run final validation and record results.
