import path from "path"
import fs from "fs"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import { PRERENDER_ROUTE_MAP, buildJsonLdGraph, SITE_URL, type PrerenderRoute } from './src/lib/prerenderData'

// Escape text for use inside a double-quoted HTML attribute.
function escAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Replace the capture-group-safe way: replacer functions avoid $-reference pitfalls.
function setTag(html: string, re: RegExp, value: string): string {
  return html.replace(re, (_m, pre: string, post: string) => `${pre}${escAttr(value)}${post}`)
}

// Inject route-specific SEO + static content into a built HTML shell.
// Turns the empty SPA shell into a prerendered page: crawlers and no-JS
// agents get a real title, real meta tags, JSON-LD, and readable body text.
// React replaces the static body on mount (createRoot clears #root).
function applyRouteSeo(shell: string, route: PrerenderRoute): string {
  const url = `${SITE_URL}${route.path === '/' ? '/' : route.path}`
  let html = shell

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escAttr(route.title)}</title>`)
  html = setTag(html, /(<meta name="description" content=")[^"]*(")/, route.description)
  if (route.noindex) {
    html = html.replace(/(<meta name="robots" content=")[^"]*(")/, '$1noindex, follow$2')
  }
  html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, url)
  html = setTag(html, /(<meta property="og:title" content=")[^"]*(")/, route.title)
  html = setTag(html, /(<meta property="og:description" content=")[^"]*(")/, route.description)
  html = setTag(html, /(<meta property="og:url" content=")[^"]*(")/, url)
  html = setTag(html, /(<meta name="twitter:title" content=")[^"]*(")/, route.title)
  html = setTag(html, /(<meta name="twitter:description" content=")[^"]*(")/, route.description)

  // JSON-LD (escape </ inside the JSON so a stray "</script>" can never break out)
  const jsonLd = JSON.stringify(buildJsonLdGraph(route)).replace(/<\//g, '<\\/')
  html = html.replace(
    '</head>',
    `    <script type="application/ld+json">${jsonLd}</script>\n  </head>`
  )

  // Static, crawlable body content. React clears it on mount; no-JS agents keep it.
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${route.body}</div>\n    <noscript><p style="font-family:system-ui;padding:1rem;text-align:center;color:#94a3b8;">This page is fully interactive with JavaScript enabled. The text above is the static summary of ${escAttr(url)}.</p></noscript>`
  )

  return html
}

// https://vite.dev/config/
// Cloudflare Rocket Loader rewrites <script type="module"> to
// <script type="<random>-module">, breaking ESM and causing the browser to
// download files instead. The data-cfasync="false" attribute tells Cloudflare
// to skip Rocket Loader for that tag.
function cfRocketBypass(): import('vite').Plugin {
  return {
    name: 'cf-rocket-bypass',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(/(<script\s+type="module")/g, '$1 data-cfasync="false"')
    },
  }
}

// GitHub Pages SPA routing.
//
// Two problems, one plugin:
//
// 1. Unknown paths. GitHub Pages serves 404.html, which must be an exact copy of
//    index.html so the React router can take over. Generated here so it always
//    matches (same asset hashes, same attributes).
//
// 2. *Known* paths. Pages has no rewrite rule, so a direct hit on /pricing also
//    fell through to 404.html — the page rendered, but the response carried HTTP
//    404. That is invisible in a browser and very visible to Google (routes were
//    not indexable) and to Stripe (cancel_url / success_url both answered 404).
//    The `_redirects` file in this repo is Netlify/Cloudflare-Pages syntax and is
//    ignored by GitHub Pages, so it never addressed this.
//
//    Emitting dist/<route>/index.html for every real route makes each one a
//    genuine 200. Routes are parsed straight out of App.tsx rather than kept in a
//    second list here, so a new <Route> can never silently miss a directory.
function ghPagesSpaShell(): import('vite').Plugin {
  return {
    name: 'gh-pages-spa-shell',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      const shell = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

      // ── base index.html (route /) ──────────────────────────────────────────
      const homeMeta = PRERENDER_ROUTE_MAP['/']
      if (!homeMeta) this.error('gh-pages-spa-shell: Missing prerender data for "/".')
      fs.writeFileSync(path.join(dist, 'index.html'), applyRouteSeo(shell, homeMeta))

      // ── 404 unknown-path fallback (keep SEO-poor so it does not compete) ──
      const _404html = applyRouteSeo(shell, {
        path: '/404',
        title: 'Page Not Found · QECTOR',
        description: 'The requested page could not be found.',
        noindex: true,
        heading: '',
        body: '',
      })
      fs.writeFileSync(path.join(dist, '404.html'), _404html)

      // ── route shells: one dist/<path>/index.html per real route ────────────
      const app = fs.readFileSync(path.resolve(__dirname, 'src/App.tsx'), 'utf8')
      const routePaths = [...app.matchAll(/<Route\s+path="([^"]+)"/g)]
        .map((m) => m[1])
        .filter((p) => p !== '*' && p !== '/' && !p.includes(':'))

      if (routePaths.length === 0) {
        this.error('gh-pages-spa-shell: no routes parsed from src/App.tsx')
      }

      for (const routePath of routePaths) {
        const meta = PRERENDER_ROUTE_MAP[routePath]
        if (!meta) {
          // Adding a <Route> to App.tsx without adding its metadata to
          // prerenderData.ts is a build error — every route needs a shell.
          this.error(
            `gh-pages-spa-shell: Missing prerender data for "${routePath}". ` +
              `Add an entry to src/lib/prerenderData.ts`
          )
        }
        const dir = path.join(dist, routePath.replace(/^\//, ''))
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(path.join(dir, 'index.html'), applyRouteSeo(shell, meta))
      }
      console.log(
        `gh-pages-spa-shell: emitted prerendered 200-status shells for ${routePaths.length} routes`
      )
    },
  }
}

export default defineConfig(({ command }) => ({
  base: '/',
  // inspectAttr() tags every JSX element with source file/line data attributes.
  // Useful in the editor while developing, but it has no business shipping to
  // production: it bloats the bundle and leaks internal file paths into the
  // live HTML. Only include it when Vite is running the dev server.
  plugins: [...(command === 'serve' ? [inspectAttr()] : []), cfRocketBypass(), ghPagesSpaShell(), react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) return 'vendor-react';
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) return 'vendor-three';
          if (id.includes('node_modules/gsap')) return 'vendor-gsap';
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) return 'vendor-charts';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
