// Structured legal documents (licence agreement, privacy, terms, refund) in
// English and French. One source renders both the React page
// (components/LegalPage.tsx) and the prerendered static HTML (legalToHtml),
// so crawlers, no-JS readers and the live page always show the same text.
//
// Inline markup inside strings: **bold**, `code` and [text](url). Nothing else.

export type Lang = 'en' | 'fr';

export interface LegalSection {
  id: string;
  heading: string;
  paras?: string[];
  bullets?: string[];
  /** Optional two-column table: [label, value] rows. */
  table?: { head: [string, string]; rows: [string, string][] };
  /** Highlighted card (seller identity, key promise). */
  accent?: boolean;
}

export interface LegalDoc {
  lang: Lang;
  path: string;
  /** Path of the other-language twin. */
  twin: string;
  title: string;
  seoTitle: string;
  description: string;
  badge: string;
  intro: string;
  /** Version label shown at the top, e.g. "Version 2026-11 · Effective 6 November 2026". */
  version?: string;
  sections: LegalSection[];
}

const SITE = 'https://qector.store';

export function absUrl(path: string): string {
  return `${SITE}${path === '/' ? '/' : `${path}/`}`;
}

/** hreflang alternates for a doc and its twin (English is x-default). */
export function alternatesFor(doc: LegalDoc): { lang: string; href: string }[] {
  const en = doc.lang === 'en' ? doc.path : doc.twin;
  const fr = doc.lang === 'fr' ? doc.path : doc.twin;
  return [
    { lang: 'en', href: absUrl(en) },
    { lang: 'fr', href: absUrl(fr) },
    { lang: 'x-default', href: absUrl(en) },
  ];
}

export interface InlineToken {
  kind: 'text' | 'bold' | 'link' | 'code';
  text: string;
  href?: string;
}

/** Tokenise the tiny inline markup (**bold**, [text](url)). */
export function tokenize(src: string): InlineToken[] {
  const out: InlineToken[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) out.push({ kind: 'text', text: src.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ kind: 'bold', text: m[1] });
    else if (m[4] !== undefined) out.push({ kind: 'code', text: m[4] });
    else out.push({ kind: 'link', text: m[2], href: m[3] });
    last = re.lastIndex;
  }
  if (last < src.length) out.push({ kind: 'text', text: src.slice(last) });
  return out;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function inlineHtml(src: string): string {
  return tokenize(src)
    .map((t) =>
      t.kind === 'bold'
        ? `<strong>${esc(t.text)}</strong>`
        : t.kind === 'code'
          ? `<code>${esc(t.text)}</code>`
        : t.kind === 'link'
          ? `<a href="${esc(t.href ?? '#')}">${esc(t.text)}</a>`
          : esc(t.text),
    )
    .join('');
}

/** Static HTML for prerendered shells (readable without JavaScript). */
export function legalToHtml(doc: LegalDoc): string {
  const parts: string[] = [];
  parts.push(`<main style="max-width:48rem;margin:0 auto;padding:2rem 1rem;font-family:system-ui,sans-serif;color:#e2e8f0;line-height:1.6;">`);
  parts.push(`<h1>${esc(doc.title)}</h1>`);
  if (doc.version) parts.push(`<p><em>${esc(doc.version)}</em></p>`);
  parts.push(`<p>${inlineHtml(doc.intro)}</p>`);
  parts.push(`<nav><ul>${doc.sections.map((s) => `<li><a href="#${s.id}">${esc(s.heading)}</a></li>`).join('')}</ul></nav>`);
  for (const s of doc.sections) {
    parts.push(`<section id="${s.id}"><h2>${esc(s.heading)}</h2>`);
    for (const p of s.paras ?? []) parts.push(`<p>${inlineHtml(p)}</p>`);
    if (s.bullets?.length) parts.push(`<ul>${s.bullets.map((b) => `<li>${inlineHtml(b)}</li>`).join('')}</ul>`);
    if (s.table) {
      parts.push(
        `<table><thead><tr><th>${esc(s.table.head[0])}</th><th>${esc(s.table.head[1])}</th></tr></thead><tbody>` +
          s.table.rows.map(([a, b]) => `<tr><td>${inlineHtml(a)}</td><td>${inlineHtml(b)}</td></tr>`).join('') +
          `</tbody></table>`,
      );
    }
    parts.push(`</section>`);
  }
  const twinLabel = doc.lang === 'en' ? 'Version française' : 'English version';
  parts.push(`<p><a href="${doc.twin}/" hreflang="${doc.lang === 'en' ? 'fr' : 'en'}">${twinLabel}</a></p>`);
  parts.push(`</main>`);
  return parts.join('\n');
}
