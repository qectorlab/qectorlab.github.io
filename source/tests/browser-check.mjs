// Browser check of the built site: serve dist/ through the real security-header
// Worker, open every route in Chromium at a laptop and a phone size, and report
// anything that broke: script errors (including React hydration errors),
// static HTML that React rendered again instead of attaching to it,
// Content-Security-Policy violations, pages that never become interactive,
// content left invisible, pages wider than the screen, missing fonts.
//
// Usage: npm run check:browser        (needs `npx playwright install chromium` once)
//        node tests/browser-check.mjs <site-dir>   to test another build folder
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const repo = resolve(import.meta.dirname, '../..');
const dist = process.argv[2] ? resolve(process.argv[2]) : join(repo, 'source', 'dist');
const require = createRequire(join(repo, 'source', 'package.json'));
const { chromium } = require('playwright');
const { default: headersWorker } = await import(pathToFileURL(join(repo, 'workers/qector-headers/src/index.js')).href);

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json' };

function originResponse(pathname) {
  let file = join(dist, decodeURIComponent(pathname));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) return new Response(readFileSync(join(dist, '404.html')), { status: 404, headers: { 'content-type': MIME['.html'] } });
  return new Response(readFileSync(file), { status: 200, headers: { 'content-type': MIME[extname(file)] || 'application/octet-stream' } });
}

// The Worker calls fetch(request) for the origin: answer from dist/.
const realFetch = globalThis.fetch;
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'https://qector.store');
  globalThis.fetch = async () => originResponse(url.pathname);
  let response;
  try {
    response = await headersWorker.fetch(new Request(url, { method: 'GET' }));
  } finally {
    globalThis.fetch = realFetch;
  }
  const headers = {};
  response.headers.forEach((value, name) => {
    // Plain-HTTP localhost: these two would break or pin the test origin.
    if (name === 'strict-transport-security') return;
    headers[name] = name === 'content-security-policy' ? value.replace(' upgrade-insecure-requests;', '') : value;
  });
  res.writeHead(response.status, headers);
  res.end(Buffer.from(await response.arrayBuffer()));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;

function routeDirs(dir, base = '') {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory() || ['assets', 'images', 'og', 'source', 'workers', 'scripts', 'node_modules'].includes(name) || name.startsWith('.')) continue;
    if (existsSync(join(full, 'index.html'))) out.push(`${base}/${name}`);
    out.push(...routeDirs(full, `${base}/${name}`));
  }
  return out;
}
// CHECK_ROUTES=/contact,/blog limits the run to a few routes while working on them.
const only = process.env.CHECK_ROUTES ? process.env.CHECK_ROUTES.split(',') : null;
const routes = ['/', ...routeDirs(dist), '/__missing__'].filter((route) => !only || only.includes(route));

const browser = await chromium.launch();
const problems = [];
let fontsChecked = false;
for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport });
  // Third-party hosts are not reachable from the test machine and not under test.
  await context.route((url) => !url.href.startsWith(origin), (route) => route.abort());
  for (const route of routes) {
    const page = await context.newPage();
    const issues = [];
    await page.addInitScript(() => {
      window.__csp = [];
      document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} blocked ${e.blockedURI || 'inline'}`));
      // The static page as it arrived, before any script has run: the layout,
      // and the first element of every Suspense boundary React rendered at
      // build time (the lazy route, lazy blocks inside it). React must attach
      // to these elements; one that is gone later was rendered a second time.
      document.addEventListener('readystatechange', () => {
        if (document.readyState !== 'interactive' || window.__static) return;
        window.__static = [];
        const root = document.querySelector('#root[data-prerendered]');
        if (!root) return;
        window.__static.push(root.firstElementChild);
        const comments = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
        while (comments.nextNode()) {
          if (comments.currentNode.data !== '$') continue;
          let node = comments.currentNode.nextSibling;
          while (node && node.nodeType !== Node.ELEMENT_NODE && !(node.nodeType === Node.COMMENT_NODE && node.data === '/$')) node = node.nextSibling;
          if (node && node.nodeType === Node.ELEMENT_NODE) window.__static.push(node);
        }
      });
    });
    page.on('pageerror', (e) => issues.push(`uncaught: ${e.message}`));
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      const text = m.text();
      if (/Failed to load resource|net::ERR_|ERR_FAILED|Failed to fetch/.test(text)) return;
      issues.push(`console: ${text.slice(0, 160)}`);
    });
    try {
      const response = await page.goto(`${origin}${route === '/' ? '/' : `${route}/`}`, { waitUntil: 'load', timeout: 30000 });
      const expected = route === '/__missing__' ? 404 : 200;
      if (response.status() !== expected) issues.push(`HTTP ${response.status()}`);
      // The page is ready once React has rendered the route, or attached to
      // its static HTML: App sets <html data-app-ready> from inside the route's
      // Suspense boundary, so the route's own code has run. The footer alone
      // proves nothing any more, it is part of the static HTML. As before, no
      // route loader may be showing.
      await page.waitForFunction(() => document.documentElement.dataset.appReady === 'true' && document.querySelectorAll('#root').length === 1 && !document.querySelector('[data-page-loader]') && document.querySelector('#root footer'), null, { timeout: 8000 }).catch(() => issues.push('page never finished rendering'));
      // Interactive, not just painted: the menu control must respond.
      const control = viewport.width < 1024 ? 'button[aria-controls="mobile-menu"]' : 'nav[aria-label="Main"] button[aria-haspopup="true"]';
      const responded = await page.evaluate(async (selector) => {
        for (let attempt = 0; attempt < 30; attempt += 1) {
          const button = document.querySelector(selector);
          if (button) {
            button.click();
            await new Promise((r) => setTimeout(r, 60));
            if (button.getAttribute('aria-expanded') === 'true') {
              button.click();
              return true;
            }
          }
          await new Promise((r) => setTimeout(r, 150));
        }
        return false;
      }, control);
      if (!responded) issues.push('navigation menu does not respond to a click');
      // Scroll like a reader: real steps with pauses (the site's smooth
      // scrolling would otherwise animate past everything in one sweep).
      await page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = 'auto';
        for (let y = 0; y < document.body.scrollHeight; y += 350) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 110));
        }
      });
      await page.waitForTimeout(1600);
      // Reveal-on-scroll: a block may still be waiting off screen (on a slow
      // machine it can pass between two frames), which is harmless. What must
      // never happen is a block that stays invisible once it is on screen, so
      // each one that is still hidden is brought into view and given time.
      await page.evaluate(async () => {
        const isHidden = (el) => el.style.opacity === '0' || (el.matches('.card-surface, .prose') && getComputedStyle(el).opacity === '0');
        // Blocks clipped inside a collapsed "Show more" section are not expected to be visible yet.
        const candidates = [...document.querySelectorAll('main *')].filter((el) => !el.closest(".mobile-collapse[data-open='false'] .mobile-collapse__body") && isHidden(el));
        let stuck = 0;
        for (const el of candidates) {
          el.scrollIntoView({ block: 'center' });
          let shown = false;
          for (let i = 0; i < 40 && !shown; i += 1) {
            await new Promise((r) => setTimeout(r, 100));
            shown = !isHidden(el);
          }
          if (!shown) stuck += 1;
        }
        window.__stillHidden = stuck;
      });
      const state = await page.evaluate(() => ({
        csp: window.__csp,
        prerendered: (window.__static || []).length,
        rerendered: (window.__static || []).filter((el) => !el.isConnected).length,
        h1: document.querySelectorAll('h1').length,
        lang: document.documentElement.lang,
        hidden: window.__stillHidden,
        article: (() => { const a = document.querySelector('main article.prose'); return a ? getComputedStyle(a).opacity : null; })(),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        inter: document.fonts.check('16px "Inter Variable"'),
        mono: document.fonts.check('16px "JetBrains Mono Variable"'),
        bodyFont: getComputedStyle(document.body).fontFamily.split(',')[0],
      }));
      for (const v of new Set(state.csp)) issues.push(`CSP: ${v}`);
      // Hydration: every route arrives as static HTML and React attaches to
      // it. Two pages are rendered by the browser on purpose: /success (it
      // depends on its query string) and the 404 page (one file for every
      // unknown URL).
      const clientRendered = route === '/success' || route === '/__missing__';
      if (!clientRendered && state.prerendered === 0) issues.push('no static HTML marked for hydration (#root[data-prerendered])');
      if (state.rerendered > 0) issues.push(`${state.rerendered} of ${state.prerendered} static blocks were rendered again instead of hydrated`);
      if (state.h1 !== 1) issues.push(`${state.h1} <h1> elements`);
      const fr = route === '/fr' || route.startsWith('/fr/');
      if (state.lang !== (fr ? 'fr' : 'en')) issues.push(`lang="${state.lang}"`);
      if (state.hidden > 0) issues.push(`${state.hidden} element(s) stay invisible even when scrolled into view`);
      if (state.article !== null && state.article !== '1') issues.push(`article body opacity ${state.article}`);
      if (state.overflow > 1) issues.push(`page is ${state.overflow}px wider than the viewport`);
      if (!fontsChecked) {
        fontsChecked = true;
        if (!state.inter || !state.mono || !/Inter Variable/.test(state.bodyFont)) issues.push(`fonts: inter=${state.inter} mono=${state.mono} body=${state.bodyFont}`);
      }
    } catch (error) {
      issues.push(`navigation: ${error.message.split('\n')[0]}`);
    }
    for (const issue of issues) problems.push(`${viewport.width}px ${route}: ${issue}`);
    await page.close();
  }
  await context.close();
}
await browser.close();
server.close();

console.log(`browser check: ${routes.length} routes x 2 viewports, ${problems.length} problem(s)`);
for (const p of problems) console.log(`  ${p}`);
process.exitCode = problems.length ? 1 : 0;
