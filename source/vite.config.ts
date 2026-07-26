import path from "path"
import fs from "fs"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

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
      const shell = fs.readFileSync(path.join(dist, 'index.html'))

      // Unknown-path fallback.
      fs.writeFileSync(path.join(dist, '404.html'), shell)

      const app = fs.readFileSync(path.resolve(__dirname, 'src/App.tsx'), 'utf8')
      const routes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)]
        .map((m) => m[1])
        .filter((p) => p !== '*' && p !== '/' && !p.includes(':'))

      if (routes.length === 0) {
        // Parsing App.tsx is the single source of truth; if the shape of that
        // file changes, fail loudly rather than shipping 404s again.
        this.error('gh-pages-spa-shell: no routes parsed from src/App.tsx')
      }

      for (const route of routes) {
        const dir = path.join(dist, route.replace(/^\//, ''))
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(path.join(dir, 'index.html'), shell)
      }
      console.log(`gh-pages-spa-shell: emitted 200-status shells for ${routes.length} routes`)
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
