#!/usr/bin/env node
// Per-page Open Graph images (1200x630 JPEG) from each built page's own title
// and description. Writes public/og/<slug>.jpg; the build then points each
// page's og:image / twitter:image at its card (vite.config.ts).
//
// Usage: npx vite build && node scripts/og-images.mjs   (then build again)

import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const out = join(root, 'public', 'og');
mkdirSync(out, { recursive: true });
const logo = `data:image/png;base64,${readFileSync(join(root, 'public/images/logo.png')).toString('base64')}`;
const inter = `data:font/woff2;base64,${readFileSync(join(root, 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')).toString('base64')}`;

export function slugFor(route) {
  return route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '--');
}

function routes(dir, base = '') {
  const res = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (name === 'assets' || name === 'og' || !statSync(full).isDirectory()) continue;
    if (existsSync(join(full, 'index.html'))) res.push(`${base}/${name}`);
    res.push(...routes(full, `${base}/${name}`));
  }
  return res;
}

const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function section(route) {
  if (route.startsWith('/blog/')) return 'QECTOR Blog';
  if (route.startsWith('/fr/')) return 'QECTOR · Français';
  if (/license|terms|privacy|refund|security/.test(route)) return 'QECTOR · Legal & Trust';
  return 'QECTOR';
}

function card(title, description, label) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:"Inter Variable";font-weight:100 900;src:url(${inter}) format("woff2-variations")}
  *{box-sizing:border-box;margin:0}
  body{width:1200px;height:630px;font-family:"Inter Variable",Inter,"Segoe UI",system-ui,sans-serif;color:#e6edf6;
    background:radial-gradient(900px 500px at 85% 15%,rgba(36,231,255,.18),transparent 60%),linear-gradient(135deg,#050b14 0%,#0b1626 60%,#071019 100%);
    padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between}
  .top{display:flex;align-items:center;gap:18px;font-size:26px;font-weight:600;color:#7dd3fc;letter-spacing:.02em}
  .top img{width:64px;height:64px;border-radius:14px}
  h1{font-size:${title.length > 60 ? 54 : 64}px;line-height:1.08;font-weight:800;letter-spacing:-.02em;max-width:1000px}
  p{margin-top:22px;font-size:27px;line-height:1.4;color:#a9b8cc;max-width:1000px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .foot{display:flex;justify-content:space-between;align-items:center;font-size:24px;color:#7dd3fc}
  .bar{height:6px;width:180px;border-radius:3px;background:linear-gradient(90deg,#24e7ff,#f5c451)}
  </style></head><body>
  <div class="top"><img src="${logo}" alt="">${esc(label)}</div>
  <div><h1>${esc(title)}</h1><p>${esc(description)}</p></div>
  <div class="foot"><span>qector.store</span><span class="bar"></span></div>
  </body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
let n = 0;
for (const route of ['/', ...routes(dist)]) {
  const file = route === '/' ? join(dist, 'index.html') : join(dist, route, 'index.html');
  const html = readFileSync(file, 'utf8');
  if (/name="robots" content="noindex/.test(html)) continue;
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'QECTOR').replace(/\s*·\s*QECTOR.*$/, '').replace(/\s*·\s*Feature Comparison$/, '');
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  await page.setContent(card(title || 'QECTOR', description, section(route)), { waitUntil: 'load' });
  await page.screenshot({ path: join(out, `${slugFor(route)}.jpg`), type: 'jpeg', quality: 86 });
  n += 1;
}
await browser.close();
console.log(`og-images: wrote ${n} cards to public/og/`);
