import { APP_CONFIG } from './config';

export async function fetchLatestQectorVersion(): Promise<string> {
  try {
    const res = await fetch('https://pypi.org/rss/project/qector-decoder-v3/releases.xml');
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');
    const firstTitle = doc.querySelector('item title')?.textContent || '';
    const match = firstTitle.match(/qector-decoder-v3\s+([\d.]+)/);
    return match ? match[1] : APP_CONFIG.version;
  } catch {
    return APP_CONFIG.version;
  }
}
