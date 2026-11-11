// Static checks on the built site (dist/). Usage: npm run check:static
//  1. every inline script is covered by a hash in the Content-Security-Policy
//  2. no inline event-handler attributes (the policy blocks them)
//  3. every internal link, script, stylesheet and image resolves to a file
//  4. every hashed file in assets/ is reachable from some page
//  5. each page has a title, a description, one canonical URL (unless noindex) and valid JSON-LD
//  6. no third-party font or Stripe script hosts are referenced
//  7. every app page holds the page React rendered at build time (or, for a
//     page the browser renders, an empty #root and a <noscript> summary), with
//     no loading state and nothing hidden in it
//  8. JSON data blocks (the Markdown embedded in blog posts) parse and cannot
//     end their own <script> element
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '../..');
const dist = join(repo, 'source', 'dist');
const worker = readFileSync(join(repo, 'workers/qector-headers/src/index.js'), 'utf8');
const allowed = new Set([...worker.matchAll(/'sha256-([A-Za-z0-9+/=]+)'/g)].map((m) => m[1]));

const htmlFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith('.html')) htmlFiles.push(full);
  }
})(dist);

const problems = [];
const exists = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (clean === '' || clean === '/') return true;
  const file = join(dist, clean);
  return existsSync(file) && (statSync(file).isFile() || existsSync(join(file, 'index.html')));
};

const assets = readdirSync(join(dist, 'assets'));
const reachable = new Set();
const queue = [];
const scan = (text) => {
  for (const a of assets) if (!reachable.has(a) && text.includes(a)) { reachable.add(a); queue.push(a); }
};

let inlineScripts = 0;
let dataBlocks = 0;
let prerendered = 0;
let clientRendered = 0;
for (const file of htmlFiles) {
  const rel = file.slice(dist.length);
  const html = readFileSync(file, 'utf8');
  scan(html);
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(m[1])) continue;
    if (/application\/ld\+json/.test(m[1])) {
      try { JSON.parse(m[2]); } catch { problems.push(`${rel}: JSON-LD does not parse`); }
      continue;
    }
    // A JSON data block is never executed, so the policy does not apply to
    // it. Exactly this type, though: anything else is checked as a script.
    if (/\btype="application\/json"/.test(m[1])) {
      dataBlocks += 1;
      try { JSON.parse(m[2]); } catch { problems.push(`${rel}: JSON data block does not parse`); }
      if (m[2].includes('<')) problems.push(`${rel}: JSON data block contains an unescaped "<"`);
      continue;
    }
    inlineScripts += 1;
    const digest = createHash('sha256').update(m[2], 'utf8').digest('base64');
    if (!allowed.has(digest)) problems.push(`${rel}: inline script not covered by the policy (sha256-${digest})`);
  }
  const handlers = html.match(/<[^>]+\son[a-z]+="/g);
  if (handlers) problems.push(`${rel}: ${handlers.length} inline event handler(s)`);
  for (const m of html.matchAll(/\b(?:href|src)="(\/[^"]*)"/g)) {
    if (m[1].startsWith('//') || m[1].startsWith('/cdn-cgi/')) continue;
    if (!exists(m[1])) problems.push(`${rel}: broken internal reference ${m[1]}`);
  }
  // Case-insensitive: React writes the attribute as srcSet (and imageSrcSet).
  for (const m of html.matchAll(/\bsrcset="([^"]*)"/gi)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u.startsWith('/') && !exists(u)) problems.push(`${rel}: broken srcset entry ${u}`);
    }
  }
  if (!/<title>[^<]{5,}<\/title>/.test(html)) problems.push(`${rel}: missing title`);
  if (!/http-equiv="refresh"/.test(html) && !/<meta name="description" content="[^"]{20,}"/.test(html)) problems.push(`${rel}: missing description`);
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const canonicals = (html.match(/<link rel="canonical"/g) || []).length;
  if (!noindex && canonicals !== 1) problems.push(`${rel}: ${canonicals} canonical links`);
  for (const host of ['fonts.googleapis.com', 'fonts.gstatic.com', 'js.stripe.com']) if (html.includes(host)) problems.push(`${rel}: references ${host}`);

  // The app's pages: what is in #root. (Other HTML files, like the
  // /license.html redirect, have no #root.)
  const root = html.match(/<div id="root"([^>]*)>/);
  if (!root) continue;
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  if (/<div id="root"><\/div>/.test(markup)) {
    // Rendered by the browser (/success/): readers without JavaScript get the summary.
    clientRendered += 1;
    if (!/<noscript>\s*<main id="prerendered"/.test(markup)) problems.push(`${rel}: #root is empty and there is no <noscript> summary`);
  } else if (/<main id="prerendered"/.test(markup.replace(/<noscript>[\s\S]*?<\/noscript>/g, ''))) {
    problems.push(`${rel}: #root holds the summary shell, not the rendered page (run the full \`npm run build\`)`);
  } else {
    prerendered += 1;
    if (!/<main\b/.test(markup) || !/<footer\b/.test(markup) || !/<h1\b/.test(markup)) problems.push(`${rel}: #root has no <main>, <footer> or <h1>`);
    // 404.html answers every unknown URL, so it is the one page React does not attach to.
    if (!/data-prerendered="\/[^"]*"/.test(root[1]) && rel !== '/404.html') problems.push(`${rel}: #root is not marked for hydration (data-prerendered)`);
  }
  for (const [pattern, what] of [
    [/data-page-loader/, 'the route loading spinner'],
    [/reveal-pending/, 'a block hidden by reveal-pending'],
    [/style="[^"]*opacity:\s*0(?![.\d])/, 'an element with inline opacity 0'],
    [/<template\b/, 'a <template> (content React meant to stream in later)'],
    [/<!--\$[?!~]-->/, 'a Suspense boundary that did not finish rendering'],
  ]) if (pattern.test(markup)) problems.push(`${rel}: static HTML contains ${what}`);
}
while (queue.length) {
  const a = queue.pop();
  if (/\.(js|css)$/.test(a)) scan(readFileSync(join(dist, 'assets', a), 'utf8'));
}
const orphans = assets.filter((a) => !reachable.has(a));
if (orphans.length) problems.push(`assets/: ${orphans.length} file(s) not reachable from any page, e.g. ${orphans.slice(0, 3).join(', ')}`);

// sitemap entries must be real pages
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>https:\/\/qector\.store([^<]*)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) if (!exists(loc)) problems.push(`sitemap.xml: ${loc} has no page`);

const size = (re) => assets.filter((a) => re.test(a)).reduce((n, a) => n + statSync(join(dist, 'assets', a)).size, 0);
console.log(`static checks: ${htmlFiles.length} pages (${prerendered} rendered at build time, ${clientRendered} by the browser), ${inlineScripts} inline scripts, ${dataBlocks} JSON data blocks, ${assets.length} hashed files, ${locs.length} sitemap URLs`);
console.log(`  JS ${(size(/\.js$/) / 1e3).toFixed(0)} kB, CSS ${(size(/\.css$/) / 1e3).toFixed(0)} kB, fonts ${(size(/\.woff2$/) / 1e3).toFixed(0)} kB (uncompressed totals across all routes)`);
console.log(`  ${problems.length} problem(s)`);
for (const p of problems.slice(0, 40)) console.log(`  - ${p}`);
process.exitCode = problems.length ? 1 : 0;
