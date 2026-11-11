// Accessibility check of the built site with axe-core (WCAG 2.1 A and AA, plus
// best practices): every route, laptop and phone size, after scrolling so
// lazily revealed content is included.
//
// Usage: npm run check:a11y          (needs `npx playwright install chromium` once)
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const dist = process.argv[2] ? resolve(process.argv[2]) : resolve(import.meta.dirname, '../dist');
const verbose = process.argv.includes('--verbose');

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.md': 'text/markdown; charset=utf-8' };
const server = createServer((req, res) => {
  let file = join(dist, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) { res.writeHead(404, { 'content-type': MIME['.html'] }).end(readFileSync(join(dist, '404.html'))); return; }
  res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;

function routeDirs(dir, base = '') {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory() || ['assets', 'images', 'og'].includes(name) || name.startsWith('.')) continue;
    if (existsSync(join(full, 'index.html'))) out.push(`${base}/${name}`);
    out.push(...routeDirs(full, `${base}/${name}`));
  }
  return out;
}
const routes = ['/', ...routeDirs(dist), '/__missing__'];

const browser = await chromium.launch();
const byRule = new Map();
let pagesWithIssues = 0;
for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport });
  await context.route((url) => !url.href.startsWith(origin), (route) => route.abort());
  for (const route of routes) {
    const page = await context.newPage();
    try {
      await page.goto(`${origin}${route === '/' ? '/' : `${route}/`}`, { waitUntil: 'load', timeout: 30000 });
      await page.waitForFunction(() => document.querySelector('#root footer') && !document.querySelector('[data-page-loader]'), null, { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(600);
      await page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = 'auto';
        for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(900);
      await page.evaluate(axeSource);
      const violations = await page.evaluate(async () => {
        const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } });
        return result.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map((n) => ({ target: n.target.join(' '), html: n.html.slice(0, 160), summary: (n.failureSummary || '').split('\n').slice(1, 2).join(' ').trim().slice(0, 200) })) }));
      });
      if (violations.length) pagesWithIssues += 1;
      for (const v of violations) {
        const entry = byRule.get(v.id) ?? { impact: v.impact, help: v.help, count: 0, pages: new Set(), examples: [] };
        entry.count += v.nodes.length;
        entry.pages.add(`${viewport.width}px ${route}`);
        for (const n of v.nodes) if (entry.examples.length < (verbose ? 12 : 4) && !entry.examples.some((e) => e.html === n.html)) entry.examples.push({ ...n, page: `${viewport.width}px ${route}` });
        byRule.set(v.id, entry);
      }
    } catch (error) {
      console.log(`  could not check ${route}: ${error.message.split('\n')[0]}`);
    }
    await page.close();
  }
  await context.close();
}
await browser.close();
server.close();

const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
const rules = [...byRule.entries()].sort((a, b) => (order[a[1].impact] ?? 9) - (order[b[1].impact] ?? 9) || b[1].count - a[1].count);
console.log(`accessibility check: ${routes.length} routes x 2 viewports, ${rules.length} rule(s) violated on ${pagesWithIssues} page view(s)`);
for (const [id, r] of rules) {
  console.log(`\n[${r.impact}] ${id}: ${r.help} — ${r.count} element(s) on ${r.pages.size} page view(s)`);
  for (const e of r.examples) console.log(`    ${e.page}: ${e.html}\n      ${e.summary}`);
}
process.exitCode = rules.some(([, r]) => r.impact === 'critical' || r.impact === 'serious') ? 1 : 0;
