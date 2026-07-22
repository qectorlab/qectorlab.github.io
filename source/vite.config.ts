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

// GitHub Pages SPA routing: every 404 is served by 404.html, which must be
// an exact copy of index.html so the React router can take over.  We
// generate it here so it always matches (same hashes, same attributes).
function ghPagesSpaShell(): import('vite').Plugin {
  return {
    name: 'gh-pages-spa-shell',
    apply: 'build',
    closeBundle() {
      const src = path.resolve(__dirname, 'dist/index.html')
      const dest = path.resolve(__dirname, 'dist/404.html')
      fs.copyFileSync(src, dest)
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
