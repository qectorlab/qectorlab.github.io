// Single release registry — the one source of truth for every version,
// platform and evidence claim surfaced on the site (audit item A1/H1).
// Never hand-type a release version in a page: import it from here.

export interface WorkbenchRelease {
  id: 'windows' | 'linux' | 'macos';
  label: string;
  arch: string;
  version: string;
  releaseDate: string;
  backendVersion: string;
  mcpTools: number;
  decoderKinds: number;
  codeFamilies: number;
  releaseUrl: string;
  artifact: string;
  artifactUrl: string;
  artifactSha256: string;
}

export const PYPI_PACKAGE = 'qector-decoder-v3';
export const PYPI_VERSION = '1.0.0';
export const PYPI_URL = 'https://pypi.org/project/qector-decoder-v3/';
export const REFERENCE_MANUAL_DOI = '10.5281/zenodo.21941046';
export const REGISTRY_UPDATED_AT = '2026-09-10';

// Dates are PyPI upload dates (UTC), verified against the public JSON API on
// 2026-08-25. Do not infer a release date from a local commit or file time.
export const PYPI_RELEASES = [
  { version: '1.0.0', releaseDate: '2026-08-06', label: 'First stable release' },
  { version: '0.7.0', releaseDate: '2026-08-02', label: 'Published PyPI milestone' },
  { version: '0.6.9', releaseDate: '2026-07-26', label: 'Published PyPI milestone' },
  { version: '0.6.8', releaseDate: '2026-07-22', label: 'Published PyPI milestone' },
  { version: '0.6.6', releaseDate: '2026-07-12', label: 'Published PyPI milestone' },
  { version: '0.6.2', releaseDate: '2026-07-07', label: 'Published PyPI milestone' },
  { version: '0.6.1', releaseDate: '2026-07-05', label: 'Published PyPI milestone' },
  { version: '0.6.0', releaseDate: '2026-07-05', label: 'Published PyPI milestone' },
  { version: '0.5.9', releaseDate: '2026-07-05', label: 'Published PyPI milestone' },
  { version: '0.5.8', releaseDate: '2026-07-02', label: 'Published PyPI milestone' },
  { version: '0.5.7', releaseDate: '2026-07-02', label: 'Published PyPI milestone' },
  { version: '0.5.6', releaseDate: '2026-06-29', label: 'Published PyPI milestone' },
  { version: '0.5.5', releaseDate: '2026-06-28', label: 'Published PyPI milestone' },
  { version: '0.5.4', releaseDate: '2026-06-27', label: 'Published PyPI milestone' },
  { version: '0.5.3', releaseDate: '2026-06-25', label: 'Published PyPI milestone' },
  { version: '0.5.2', releaseDate: '2026-06-25', label: 'Published PyPI milestone' },
  { version: '0.5.1', releaseDate: '2026-06-24', label: 'Published PyPI milestone' },
  { version: '0.5.0', releaseDate: '2026-06-24', label: 'First recorded PyPI release' },
];

export const CLAUDE_PLUGIN_RELEASE = {
  version: '1.0.6',
  releaseDate: '2026-08-24',
  releaseUrl: 'https://github.com/GuillaumeLessard/qector-claude-plugin/releases/tag/v1.0.6',
};

// Verified against the public GitHub v1.0.7 release tags on 2026-09-10. macOS not ready yet.
export const WORKBENCH_RELEASES: WorkbenchRelease[] = [
  {
    id: 'windows',
    label: 'Windows',
    arch: 'x64',
    version: 'v1.0.7',
    releaseDate: '2026-09-04',
    backendVersion: PYPI_VERSION,
    mcpTools: 85,
    decoderKinds: 19,
    codeFamilies: 10,
    releaseUrl:
      'https://github.com/qectorlab/qector-decoder-workbench-windows/releases/tag/v1.0.7',
    artifact: 'QectorWorkbench-Portable.exe',
    artifactUrl:
      'https://github.com/qectorlab/qector-decoder-workbench-windows/releases/download/v1.0.7/QectorWorkbench-Portable.exe',
    artifactSha256: 'c53ca5f4fc49152f242a847d0ca11f147164dda426ae29ec170c451871b8ab13',
  },
  {
    id: 'linux',
    label: 'Linux',
    arch: 'x64',
    version: 'v1.0.7',
    releaseDate: '2026-09-04',
    backendVersion: PYPI_VERSION,
    mcpTools: 85,
    decoderKinds: 19,
    codeFamilies: 10,
    releaseUrl:
      'https://github.com/qectorlab/qector-decoder-workbench-linux/releases/tag/v1.0.7',
    artifact: 'QectorWorkbench-Portable',
    artifactUrl:
      'https://github.com/qectorlab/qector-decoder-workbench-linux/releases/download/v1.0.7/QectorWorkbench-Portable',
    artifactSha256: 'aa3949d25082165dc3b89115486e1ea4e210cd5254659da32185fe6a8e71a1c8',
  },
];

export const WORKBENCH_VERSION_SUMMARY = WORKBENCH_RELEASES.map(
  (r) => `${r.label} ${r.version}`
).join(' · ');

// Canonical seller record — used by Terms, Refund, Privacy, Commercial and
// all structured data (audit item L1). One record, no exceptions.
export const SELLER_RECORD = {
  name: 'Guillaume Lessard',
  tradingAs: 'iD01t Productions',
  street: '2004 De Lorimier',
  city: 'Longueuil',
  region: 'Québec',
  country: 'Canada',
  postalCode: 'J4K 3H7',
  email: 'admin@qector.store',
};

export const SELLER_ADDRESS_LINE = `${SELLER_RECORD.street}, ${SELLER_RECORD.city}, ${SELLER_RECORD.region}, ${SELLER_RECORD.country}, ${SELLER_RECORD.postalCode}`;

// Six-record Zenodo evidence corpus, each verified live on 2026-08-21 via
// zenodo.org/api/records/<id> (audit items H4/H6/A5).
export type ZenodoKind =
  | 'manual'
  | 'restricted-source-custody'
  | 'verification-validation'
  | 'technical-monograph'
  | 'normative-manual'
  | 'certification-bundle';

export interface ZenodoRecord {
  id: number;
  doi: string;
  url: string;
  title: string;
  kind: ZenodoKind;
  kindLabel: string;
  date: string;
  access: 'open' | 'embargoed';
}

export const ZENODO_RECORDS: ZenodoRecord[] = [
  {
    id: 21611214,
    doi: '10.5281/zenodo.21611214',
    url: 'https://doi.org/10.5281/zenodo.21611214',
    title: 'QECTOR Decoder v3 (v1.0.0) - User Manual',
    kind: 'manual',
    kindLabel: 'User manual',
    date: '2026-08-06',
    access: 'open',
  },
  {
    id: 21822738,
    doi: '10.5281/zenodo.21822738',
    url: 'https://doi.org/10.5281/zenodo.21822738',
    title: 'QECTOR Decoder v3',
    kind: 'restricted-source-custody',
    kindLabel: 'Restricted source custody',
    date: '2026-08-06',
    access: 'embargoed',
  },
  {
    id: 21823755,
    doi: '10.5281/zenodo.21823755',
    url: 'https://doi.org/10.5281/zenodo.21823755',
    title: 'QECTOR Decoder v3 (1.0.0) - Full Scientific Verification & Validation Report',
    kind: 'verification-validation',
    kindLabel: 'V&V report',
    date: '2026-08-06',
    access: 'open',
  },
  {
    id: 21850315,
    doi: '10.5281/zenodo.21850315',
    url: 'https://doi.org/10.5281/zenodo.21850315',
    title:
      'qector-decoder-v3: A High-Performance, Multi-Backend Software Architecture for Quantum Error Correction',
    kind: 'technical-monograph',
    kindLabel: 'Technical monograph',
    date: '2026-08-08',
    access: 'open',
  },
  {
    id: 21941046,
    doi: '10.5281/zenodo.21941046',
    url: 'https://doi.org/10.5281/zenodo.21941046',
    title:
      'QECTOR Decoder v3: Syndrome-Faithful Decoding - Foundations, Algorithms, and Architecture of a Fifteen-Backend Quantum Error Correction Engine',
    kind: 'normative-manual',
    kindLabel: 'Normative reference manual',
    date: '2026-08-14',
    access: 'open',
  },
  {
    id: 22046403,
    doi: '10.5281/zenodo.22046403',
    url: 'https://doi.org/10.5281/zenodo.22046403',
    title:
      'QECTOR-Decoder-v3: High-Performance Compiled Rust Quantum Error Correction Engine & Verification Proof Suite',
    kind: 'certification-bundle',
    kindLabel: 'Certification / proof bundle',
    date: '2026-08-21',
    access: 'open',
  },
];
