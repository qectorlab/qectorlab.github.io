import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

const staticRoot = document.getElementById('root')!

if (staticRoot.childElementCount === 0) {
  createRoot(staticRoot).render(app)
} else {
  // The page arrived fully prerendered (scripts/prerender-full.mjs). Render the
  // live app off-screen and swap it in only once the route's code has loaded,
  // so visitors never see the prerendered page flash to a loading spinner.
  const live = document.createElement('div')
  live.setAttribute('aria-hidden', 'true')
  live.style.cssText = 'position:absolute;top:0;left:0;width:100%;visibility:hidden;pointer-events:none;'
  staticRoot.after(live)

  let swapped = false
  const swap = () => {
    if (swapped) return
    swapped = true
    observer.disconnect()
    staticRoot.remove()
    live.removeAttribute('style')
    live.removeAttribute('aria-hidden')
    live.id = 'root'
  }
  const ready = () => live.querySelector('footer') !== null && live.querySelector('[data-page-loader]') === null
  const observer = new MutationObserver(() => {
    if (ready()) requestAnimationFrame(swap)
  })
  observer.observe(live, { childList: true, subtree: true })
  window.setTimeout(swap, 4000)
  createRoot(live).render(app)
}

