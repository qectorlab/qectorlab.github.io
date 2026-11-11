import { APP_CONFIG } from './config';

const CACHE_KEY = 'qector-pypi-version';
const CACHE_MS = 60 * 60 * 1000;
let pending: Promise<string> | null = null;

function readCache(): string | null {
  try {
    const cached = JSON.parse(window.sessionStorage.getItem(CACHE_KEY) || 'null') as { version?: unknown; at?: unknown } | null;
    if (cached && typeof cached.version === 'string' && typeof cached.at === 'number' && Date.now() - cached.at < CACHE_MS) return cached.version;
  } catch {
    // Storage unavailable or unreadable: fall through to the network.
  }
  return null;
}

async function lookup(): Promise<string> {
  try {
    const res = await fetch(`https://pypi.org/pypi/${APP_CONFIG.pypiPackage}/json`);
    if (!res.ok) return APP_CONFIG.version;
    const version: unknown = (await res.json())?.info?.version;
    if (typeof version !== 'string' || !/^\d+(\.\d+)+/.test(version)) return APP_CONFIG.version;
    try {
      window.sessionStorage.setItem(CACHE_KEY, JSON.stringify({ version, at: Date.now() }));
    } catch {
      // Not cached; the next page asks again.
    }
    return version;
  } catch {
    return APP_CONFIG.version;
  }
}

/**
 * Latest published version of the package, or the built-in one if PyPI is
 * unreachable. Asked at most once an hour per browser session: the footer on
 * every page uses it.
 */
export function fetchLatestQectorVersion(): Promise<string> {
  const cached = readCache();
  if (cached) return Promise.resolve(cached);
  pending ??= lookup().finally(() => {
    pending = null;
  });
  return pending;
}
