export async function fetchLatestQectorVersion(): Promise<string> {
  try {
    const res = await fetch('https://pypi.org/rss/project/qector-decoder-v3/releases.xml');
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');
    const firstTitle = doc.querySelector('item title')?.textContent || '';
    const match = firstTitle.match(/qector-decoder-v3\s+([\d.]+)/);
    return match ? match[1] : '0.6.2';
  } catch (e) {
    console.error('Failed to fetch PyPI RSS for qector-decoder-v3', e);
    return '0.6.2';
  }
}
