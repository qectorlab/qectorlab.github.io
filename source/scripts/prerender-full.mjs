#!/usr/bin/env node
// Full-content prerender, run after `vite build`.
//
// The build already writes one HTML shell per route with a short static
// summary (see ghPagesSpaShell in vite.config.ts). This step replaces that
// summary with the page as React actually renders it (navigation, full body,
// footer, legal links), so crawlers, link previews, AI indexers and no-JS
// readers see the real page. React's createRoot clears #root on mount, so
// the live experience is unchanged.
//
// Usage: node scripts/prerender-full.mjs [distDir]
// Needs Playwright with Chromium. Without it, the step is skipped with a
// warning and the summary shells stay in place.

import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const dist = resolve(process.argv[2] || 'dist');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.warn('prerender-full: Playwright is not installed; keeping summary shells.');
  process.exit(0);
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
};

// Serve the ORIGINAL shells while rendering: keep them in memory so pages
// rendered later never load an already-rewritten file.
const originals = new Map();

function routeDirs(dir, base = '') {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory() || name === 'assets') continue;
    const rel = `${base}/${name}`;
    if (existsSync(join(full, 'index.html'))) out.push(rel);
    out.push(...routeDirs(full, rel));
  }
  return out;
}

const routes = ['/', ...routeDirs(dist)];
for (const r of routes) {
  const file = r === '/' ? join(dist, 'index.html') : join(dist, r, 'index.html');
  originals.set(file, readFileSync(file, 'utf8'));
}
// The 404 page is rendered too: an unknown path loads 404.html, exactly as
// GitHub Pages serves it, so its static body matches the live one (no shift).
const NOT_FOUND = join(dist, '404.html');
const MISSING_ROUTE = '/__qector-missing__';
if (existsSync(NOT_FOUND)) {
  originals.set(NOT_FOUND, readFileSync(NOT_FOUND, 'utf8'));
  routes.push(MISSING_ROUTE);
}

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let path = decodeURIComponent(url.pathname);
  let file = join(dist, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    if (!extname(path) && originals.has(NOT_FOUND)) {
      res.writeHead(404, { 'content-type': MIME['.html'] });
      res.end(originals.get(NOT_FOUND));
      return;
    }
    res.writeHead(404).end();
    return;
  }
  const body = originals.get(file) ?? readFileSync(file);
  res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
  res.end(body);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;

// Clean the captured DOM: drop things that only make sense live, and undo
// mid-animation inline styles so no text is captured invisible.
const CLEAN = () => {
  const root = document.getElementById('root');
  root.querySelectorAll('script, canvas, iframe, noscript, [data-prerender-skip]').forEach((n) => n.remove());
  // Scramble-reveal headings: store the real text, never a mid-animation frame.
  root.querySelectorAll('[data-reveal-text]').forEach((el) => { el.textContent = el.getAttribute('data-reveal-text'); });
  root.querySelectorAll('[style]').forEach((el) => {
    const st = el.style;
    if (st.opacity !== '') st.removeProperty('opacity');
    if (st.visibility === 'hidden') st.removeProperty('visibility');
    if (st.transform) st.removeProperty('transform');
    if (st.filter && /blur/.test(st.filter)) st.removeProperty('filter');
    if (!el.getAttribute('style')) el.removeAttribute('style');
  });
  root.querySelectorAll('[inert]').forEach((el) => el.removeAttribute('inert'));
  return root.innerHTML;
};

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: true });
let ok = 0;
const failed = [];

for (const route of routes) {
  const page = await context.newPage();
  // Pages with live checks (Status) read this flag and keep their neutral
  // "Checking…" state, so no build-machine result is ever baked into HTML.
  await page.addInitScript(() => { window.__PRERENDER__ = true; });
  const url = `${origin}${route === '/' ? '/' : `${route}/`}`;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('#root footer', { timeout: 15000 });
    // Let lazy sections and fetched markdown (blog posts) settle.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
    const html = await page.evaluate(CLEAN);
    if (html.length < 2000) throw new Error(`rendered body too small (${html.length} bytes)`);
    const file = route === MISSING_ROUTE ? NOT_FOUND : route === '/' ? join(dist, 'index.html') : join(dist, route, 'index.html');
    const shell = originals.get(file);
    const start = shell.indexOf('<div id="root">');
    const end = shell.indexOf('<noscript>', start);
    if (start < 0 || end < 0) throw new Error('could not find #root in shell');
    const out = `${shell.slice(0, start)}<div id="root">${html}</div>\n    ${shell.slice(end)}`;
    writeFileSync(file, out);
    ok += 1;
  } catch (error) {
    failed.push(`${route}: ${error.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();
console.log(`prerender-full: rendered ${ok}/${routes.length} routes`);
if (failed.length) {
  console.error(`prerender-full: kept summary shells for:\n  ${failed.join('\n  ')}`);
  process.exitCode = 1;
}
