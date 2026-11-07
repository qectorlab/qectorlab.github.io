import path from "path"
import fs from "fs"
import { execFileSync } from "child_process"
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
  const url = `${SITE_URL}${route.path === '/' ? '/' : `${route.path}/`}`
  let html = shell

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escAttr(route.title)}</title>`)

  // The hero image is only on Home: do not make every other page download it.
  if (route.path !== '/') html = html.replace(/\s*<link rel="preload" as="image"[^>]*hero-bg[^>]*>/, '')
  html = setTag(html, /(<meta name="description" content=")[^"]*(")/, route.description)
  if (route.noindex) {
    html = html.replace(/(<meta name="robots" content=")[^"]*(")/, '$1noindex, follow$2')
  }
  html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, url)
  // noindex pages (thank-you, 404) declare no canonical URL.
  if (route.noindex) html = html.replace(/\s*<link rel="canonical"[^>]*>/, '')
  html = setTag(html, /(<meta property="og:title" content=")[^"]*(")/, route.title)
  html = setTag(html, /(<meta property="og:description" content=")[^"]*(")/, route.description)
  html = setTag(html, /(<meta property="og:url" content=")[^"]*(")/, url)
  html = setTag(html, /(<meta name="twitter:title" content=")[^"]*(")/, route.title)
  html = setTag(html, /(<meta name="twitter:description" content=")[^"]*(")/, route.description)

  // HTML language: French routes get lang="fr" so screen readers, spell
  // checkers, and crawlers see the correct language in the prerendered shell.
  const isFr = route.path === '/fr' || route.path.startsWith('/fr/')
  const htmlLang = isFr ? 'fr' : 'en'
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${htmlLang}"`)

  // hreflang alternates: French pages link their English twin and vice versa.
  const pricingAlts: [string, string][] = [['en','https://qector.store/pricing/'],['fr','https://qector.store/fr/pricing/'],['x-default','https://qector.store/pricing/']]
  const alternates: [string, string][] =
    route.alternates ?? (route.path === '/pricing' || route.path === '/fr/pricing' ? pricingAlts : [])

  // og:locale follows the route language. og:locale:alternate is only kept
  // when a translated twin really exists (otherwise it promises a page that
  // is not there).
  const ogLocale = isFr ? 'fr_FR' : 'en_US'
  const ogLocaleAlt = isFr ? 'en_US' : 'fr_FR'
  html = setTag(html, /(<meta property="og:locale" content=")[^"]*(")/, ogLocale)
  if (alternates.length > 0) {
    html = setTag(html, /(<meta property="og:locale:alternate" content=")[^"]*(")/, ogLocaleAlt)
  } else {
    html = html.replace(/\s*<meta property="og:locale:alternate" content="[^"]*"\s*\/?>/, '')
  }

  // Per-page share card (scripts/og-images.mjs) when one exists.
  const ogSlug = route.path === '/' ? 'home' : route.path.replace(/^\//, '').replace(/\//g, '--')
  if (fs.existsSync(path.resolve(__dirname, `public/og/${ogSlug}.jpg`))) {
    const img = `${SITE_URL}/og/${ogSlug}.jpg`
    html = setTag(html, /(<meta property="og:image" content=")[^"]*(")/, img)
    html = setTag(html, /(<meta name="twitter:image" content=")[^"]*(")/, img)
    html = setTag(html, /(<meta property="og:image:secure_url" content=")[^"]*(")/, img)
    html = html.replace(/(<meta property="og:image:type" content=")[^"]*(")/, '$1image/jpeg$2')
  }

  // og:image:alt and twitter:image:alt per language, kept in sync.
  const ogImgAlt = isFr
    ? 'QECTOR Decoder v3 : décodeur Python de correction d\u2019erreur quantique'
    : 'QECTOR Decoder v3 - Rust-core Python quantum error correction decoder'
  html = setTag(html, /(<meta property="og:image:alt" content=")[^"]*(")/, ogImgAlt)
  html = setTag(html, /(<meta name="twitter:image:alt" content=")[^"]*(")/, ogImgAlt)
  if (fs.existsSync(path.resolve(__dirname, `public/og/${ogSlug}.jpg`))) {
    html = setTag(html, /(<meta property="og:image:alt" content=")[^"]*(")/, route.title)
    html = setTag(html, /(<meta name="twitter:image:alt" content=")[^"]*(")/, route.title)
  }

  // Blog posts are articles: og:type=article plus author and section.
  if (route.path.startsWith('/blog/') && route.path !== '/blog') {
    html = setTag(html, /(<meta property="og:type" content=")[^"]*(")/, 'article')
    const published = (route as PrerenderRoute & { published?: string }).published
    const dateMeta = published ? `    <meta property="article:published_time" content="${published}" />\n` : ''
    html = html.replace('</head>', `${dateMeta}    <meta property="article:author" content="Guillaume Lessard" />\n    <meta property="article:section" content="Quantum Error Correction" />\n  </head>`)
  }

  for (const [lang, href] of alternates) {
    html = html.replace(
      '</head>',
      `    <link rel="alternate" hreflang="${lang}" href="${href}" />\n  </head>`
    )
  }

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

// KaTeX ships ttf and woff fonts that are never used (only woff2 is loaded
// by its CSS). Drop them from the bundle to cut emitted asset weight.
function dropUnusedKatexFonts(): import('vite').Plugin {
  return {
    name: 'drop-unused-katex-fonts',
    apply: 'build',
    generateBundle(_options, bundle) {
      for (const key of Object.keys(bundle)) {
        if (/KaTeX.*\.(ttf|woff)$/.test(key)) {
          delete bundle[key]
        }
      }
    },
  }
}


// ── sitemap.xml generated from the real routes ─────────────────────────────
// lastmod is the last git commit date of the files that make up the page
// (its component, its content file, its blog markdown), not the build date,
// so search engines can trust it.
const SITEMAP_PRIORITY: Record<string, [string, string]> = {
  '/': ['weekly', '1.0'], '/decoder': ['weekly', '0.9'], '/claude-plugin': ['weekly', '0.8'], '/pricing': ['monthly', '0.8'],
  '/evidence': ['monthly', '0.8'], '/workbench': ['monthly', '0.8'], '/blog': ['weekly', '0.8'], '/compare': ['monthly', '0.7'],
  '/commercial': ['monthly', '0.7'], '/about': ['monthly', '0.7'], '/guillaume-lessard': ['monthly', '0.7'],
  '/mcp-server': ['monthly', '0.6'], '/changelog': ['weekly', '0.6'], '/security': ['monthly', '0.6'],
}

function gitDate(files: string[]): string {
  const existing = files.filter((f) => fs.existsSync(f))
  if (existing.length === 0) return new Date().toISOString().slice(0, 10)
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...existing], { cwd: __dirname, encoding: 'utf8' }).trim()
    return out || new Date().toISOString().slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

function routeSourceFiles(routePath: string, app: string): string[] {
  const files: string[] = []
  const route = app.match(new RegExp(`<Route\\s+path="${routePath.replace(/[/-]/g, (c) => `\\${c}`)}"\\s+element=\\{<(\\w+)`))
  if (route) {
    const imp = app.match(new RegExp(`const ${route[1]} = lazy\\(\\(\\) => import\\('\\./pages/(\\w+)'\\)\\)`))
    const name = imp ? imp[1] : route[1]
    files.push(path.resolve(__dirname, `src/pages/${name}.tsx`))
  }
  if (routePath.startsWith('/blog/')) {
    const meta = PRERENDER_ROUTE_MAP[routePath] as PrerenderRoute & { sourceFile?: string }
    if (meta?.sourceFile) files.push(path.resolve(__dirname, meta.sourceFile))
    files.push(path.resolve(__dirname, 'src/pages/BlogPost.tsx'))
  }
  if (/license-agreement/.test(routePath)) files.push(path.resolve(__dirname, 'src/content/licenseAgreement.ts'))
  if (/privacy/.test(routePath)) files.push(path.resolve(__dirname, 'src/content/privacy.ts'))
  if (/terms|refund/.test(routePath)) files.push(path.resolve(__dirname, 'src/content/terms.ts'))
  return files
}

function buildSitemap(routePaths: string[], app: string): string {
  const urls = ['/', ...routePaths]
    .filter((r) => r !== '/success' && !PRERENDER_ROUTE_MAP[r]?.noindex)
    .map((r) => {
      const loc = `${SITE_URL}${r === '/' ? '/' : `${r}/`}`
      const [freq, prio] = SITEMAP_PRIORITY[r] ?? (r.startsWith('/blog/') ? ['monthly', '0.6'] : r.startsWith('/fr/') ? ['monthly', '0.4'] : ['monthly', '0.5'])
      const alts = (PRERENDER_ROUTE_MAP[r]?.alternates ?? (r === '/pricing' || r === '/fr/pricing'
        ? [['en', `${SITE_URL}/pricing/`], ['fr', `${SITE_URL}/fr/pricing/`], ['x-default', `${SITE_URL}/pricing/`]]
        : [])) as [string, string][]
      const altXml = alts.map(([l, h]) => `\n    <xhtml:link rel="alternate" hreflang="${l}" href="${h}" />`).join('')
      return `  <url><loc>${loc}</loc><lastmod>${gitDate(routeSourceFiles(r, app))}</lastmod><changefreq>${freq}</changefreq><priority>${prio}</priority>${altXml}${alts.length ? '\n  ' : ''}</url>`
    })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
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
//    fell through to 404.html - the page rendered, but the response carried HTTP
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
    writeBundle() {
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
      }).replace(/<link rel="canonical"[^>]*>\n?/, '')
      fs.writeFileSync(path.join(dist, '404.html'), _404html)

      // ── route shells: one dist/<path>/index.html per real route ────────────
      const app = fs.readFileSync(path.resolve(__dirname, 'src/App.tsx'), 'utf8')
      const declaredRoutePaths = [...app.matchAll(/<Route\s+path="([^"]+)"/g)]
        .map((m) => m[1])
        .filter((p) => p !== '*' && p !== '/' && !p.includes(':'))
      const dynamicBlogPaths = Object.keys(PRERENDER_ROUTE_MAP).filter(
        (p) => p.startsWith('/blog/') && p !== '/blog'
      )
      const routePaths = [...new Set([...declaredRoutePaths, ...dynamicBlogPaths])]

      if (routePaths.length === 0) {
        this.error('gh-pages-spa-shell: no routes parsed from src/App.tsx')
      }

      for (const routePath of routePaths) {
        const meta = PRERENDER_ROUTE_MAP[routePath]
        if (!meta) {
          // Adding a <Route> to App.tsx without adding its metadata to
          // prerenderData.ts is a build error - every route needs a shell.
          this.error(
            `gh-pages-spa-shell: Missing prerender data for "${routePath}". ` +
              `Add an entry to src/lib/prerenderData.ts`
          )
        }
        const dir = path.join(dist, routePath.replace(/^\//, ''))
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(path.join(dir, 'index.html'), applyRouteSeo(shell, meta))
      }
      fs.writeFileSync(path.join(dist, 'sitemap.xml'), buildSitemap(routePaths, app))
      console.log(
        `gh-pages-spa-shell: emitted prerendered 200-status shells for ${routePaths.length} routes and sitemap.xml`
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
  plugins: [...(command === 'serve' ? [inspectAttr()] : []), cfRocketBypass(), ghPagesSpaShell(), dropUnusedKatexFonts(), react()],
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
          if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/lucide-react')) return 'vendor-ui';
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) return 'vendor-charts';
          // Markdown/KaTeX and other libraries are left to Rollup's own
          // splitting so they load only on the routes that use them (blog
          // posts), instead of being preloaded on every page.
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
