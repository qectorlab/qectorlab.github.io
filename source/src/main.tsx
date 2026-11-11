import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Self-hosted variable fonts (OFL): served from /assets with the rest of the build.
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App.tsx'
import { EmbeddedPostContext, readEmbeddedPost } from './lib/embeddedPost'

// Keep this tree the mirror image of the one in entry-server.tsx: the same
// providers in the same order, with BrowserRouter where the build has
// StaticRouter.
const app = (
  <StrictMode>
    <EmbeddedPostContext value={readEmbeddedPost()}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </EmbeddedPostContext>
  </StrictMode>
)

const container = document.getElementById('root')!

// The build renders each route to HTML with React and marks #root with the
// path it rendered (scripts/prerender.mjs). When that is the path we are on,
// React attaches to the HTML as it stands: nothing is rendered twice, the page
// keeps its scroll position, focus and selection, and a lazy route's static
// HTML stays on screen until its chunk arrives.
//
// Everything else is rendered here from scratch:
//   - 404.html, which GitHub Pages serves for every unknown URL: its HTML is
//     the NotFound page, not necessarily what this URL renders (a French
//     path, a route that only differs by letter case), so it carries no mark;
//   - a page served under another path than the one it was built for;
//   - an empty #root: the dev server, and /success/, which depends on its
//     query string;
//   - the summary shells of `npm run build:spa`.
const withoutTrailingSlash = (path: string) => path.replace(/\/+$/, '')
const prerenderedPath = container.getAttribute('data-prerendered')

if (prerenderedPath !== null && withoutTrailingSlash(prerenderedPath) === withoutTrailingSlash(window.location.pathname)) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
