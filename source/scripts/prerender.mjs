#!/usr/bin/env node
// Static generation, run after `vite build` (see "build" in package.json).
//
// `vite build` leaves one HTML file per route with the right <head> and a
// short summary in #root (ghPagesSpaShell in vite.config.ts), and the list of
// those pages in node_modules/.ssg/pages.json. This step puts the real page
// in #root:
//   1. bundle src/entry-server.tsx for Node (a Vite SSR build);
//   2. render every page with React itself (`prerender` from react-dom/static,
//      which waits for lazy routes), at the URL the browser will have;
//   3. write that HTML into the page's #root and mark it with the URL, so the
//      browser attaches to it with hydrateRoot instead of rendering it again
//      (src/main.tsx).
// Blog posts also get their Markdown as a JSON data block, the state the
// browser needs to render the same article without fetching it.
//
// No browser is involved. Usage: node scripts/prerender.mjs

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

const root = resolve(import.meta.dirname, '..');
const ssgDir = join(root, 'node_modules', '.ssg');
const manifestFile = join(ssgDir, 'pages.json');
const serverDir = join(ssgDir, 'server');

function fail(message) {
  console.error(`prerender: ${message}`);
  process.exit(1);
}

if (!existsSync(manifestFile)) fail('no page list found. Run `vite build` first (`npm run build` does both).');
const { outDir, buildYear, pages } = JSON.parse(readFileSync(manifestFile, 'utf8'));
if (!existsSync(join(outDir, 'index.html'))) fail(`${relative(root, outDir)}/ has no index.html. Run \`vite build\` first.`);

// ── 1. The server bundle ─────────────────────────────────────────────────────
// Same vite.config.ts as the client build. The copyright year is the one the
// client bundle was built with, so both print the same footer.
const started = Date.now();
await build({
  root,
  logLevel: 'warn',
  define: { __BUILD_YEAR__: JSON.stringify(buildYear) },
  build: { ssr: 'src/entry-server.tsx', outDir: serverDir, emptyOutDir: true, copyPublicDir: false },
});
const { render, serializeEmbeddedPost, EMBEDDED_POST_ELEMENT_ID } = await import(pathToFileURL(join(serverDir, 'entry-server.js')).href);

// ── 2. Render ────────────────────────────────────────────────────────────────
// What a finished page never contains. Each of these would ship a broken page
// (a loading state, hidden text) or one the Content-Security-Policy breaks
// (React reveals streamed content with inline scripts), so they stop the build.
const FORBIDDEN = [
  [/<script\b/i, 'a <script> element'],
  [/<link\b/i, 'a <link> element'],
  [/<template\b/i, 'a <template> element (content React meant to stream in later)'],
  [/<!--\$[?!~]-->/, 'a Suspense boundary that did not finish rendering'],
  [/data-page-loader/, 'the route loading spinner'],
  [/reveal-pending/, 'a block hidden by the reveal-on-scroll class'],
  [/style="[^"]*opacity:\s*0(?![.\d])/, 'an element with inline opacity 0'],
];

function problemsIn(html, post) {
  const problems = FORBIDDEN.filter(([pattern]) => pattern.test(html)).map(([, what]) => `contains ${what}`);
  if (!/<main\b/.test(html) || !/<footer\b/.test(html)) problems.push('has no <main> or no <footer>: the layout did not render');
  if (!/<h1\b/.test(html)) problems.push('has no <h1>');
  if (post && !/<article\b/.test(html)) problems.push(`has no <article>: ${post.filename} was not rendered`);
  return problems;
}

// React writes resource hints ahead of a fragment: <link rel="preload"> for the
// first images it meets (the logo). Inside #root they would be stray nodes in
// front of the tree React attaches to, and the images they name are in the
// HTML a few bytes later anyway, so they are dropped.
const withoutResourceHints = (html) => html.replace(/^(?:<link rel="preload"[^>]*>)+/, '');

// ── 3. Write ─────────────────────────────────────────────────────────────────
const dataBlock = new RegExp(`\\s*<script type="application/json" id="${EMBEDDED_POST_ELEMENT_ID}">[\\s\\S]*?</script>`);

// The shell has exactly one #root, directly followed by the <noscript> note.
// Everything between its tags is replaced, whether that is the summary of a
// fresh `vite build` or the page written by an earlier run of this script.
function fill(shell, html, page, post) {
  const clean = shell.replace(dataBlock, '');
  const open = [...clean.matchAll(/<div id="root"[^>]*>/g)];
  const close = clean.lastIndexOf('</div>', clean.lastIndexOf('<noscript>'));
  if (open.length !== 1 || close < open[0].index) throw new Error('cannot find #root followed by <noscript> in the shell');
  const mark = page.mode === 'hydrate' ? ` data-prerendered="${page.url}"` : '';
  const data = post ? `\n    <script type="application/json" id="${EMBEDDED_POST_ELEMENT_ID}">${serializeEmbeddedPost(post)}</script>` : '';
  return `${clean.slice(0, open[0].index)}<div id="root"${mark}>${html}</div>${data}${clean.slice(close + '</div>'.length)}`;
}

const failures = [];
let rendered = 0;
for (const page of pages) {
  if (page.mode === 'client') continue;
  try {
    const post = page.post ? { filename: page.post.filename, markdown: readFileSync(page.post.source, 'utf8') } : undefined;
    const html = withoutResourceHints(await render(page.url, { post }));
    const problems = problemsIn(html, post);
    if (problems.length > 0) throw new Error(problems.join('; '));
    const file = join(outDir, page.file);
    writeFileSync(file, fill(readFileSync(file, 'utf8'), html, page, post));
    rendered += 1;
  } catch (error) {
    failures.push(`${page.url} (${page.file}): ${error instanceof Error ? error.message : String(error)}`);
  }
}

const total = pages.filter((page) => page.mode !== 'client').length;
const left = pages.filter((page) => page.mode === 'client').map((page) => page.url);
console.log(
  `prerender: rendered ${rendered}/${total} routes to static HTML (404.html included) in ${((Date.now() - started) / 1000).toFixed(1)} s` +
    (left.length > 0 ? `; left to the browser: ${left.join(', ')}` : ''),
);
if (failures.length > 0) {
  console.error(`prerender: ${failures.length} route(s) failed, their files still hold the summary shell:\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
