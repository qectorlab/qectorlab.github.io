import path from "path"
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

export default defineConfig(({ command }) => ({
  base: '/',
  // inspectAttr() tags every JSX element with source file/line data attributes.
  // Useful in the editor while developing, but it has no business shipping to
  // production: it bloats the bundle and leaks internal file paths into the
  // live HTML. Only include it when Vite is running the dev server.
  plugins: [...(command === 'serve' ? [inspectAttr()] : []), cfRocketBypass(), react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
