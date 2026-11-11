// Server entry: renders one route to HTML at build time.
//
// scripts/prerender.mjs bundles this file with Vite (an SSR build) and calls
// render() once per route. The tree below must stay the mirror image of the
// one in main.tsx (same providers, same order), with StaticRouter standing in
// for BrowserRouter: the browser attaches to this HTML with hydrateRoot, which
// only works when both sides render the same thing.

// This module runs in Node at build time and is never loaded by the dev
// server, so the Fast Refresh rule about exports does not apply to it.
/* eslint-disable react-refresh/only-export-components */
import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import App from './App';
import { EmbeddedPostContext, EMBEDDED_POST_ELEMENT_ID, serializeEmbeddedPost, type EmbeddedPost } from './lib/embeddedPost';

export { EMBEDDED_POST_ELEMENT_ID, serializeEmbeddedPost };

export interface RenderOptions {
  /** Blog routes: the article's Markdown, read from public/blog/ by the build. */
  post?: EmbeddedPost;
}

/**
 * HTML of the whole app at `url`, as the browser will have it (`/pricing/`,
 * trailing slash included). Resolves once every lazy route and Suspense
 * boundary has rendered; a render error rejects instead of leaving a loading
 * state in the page.
 */
export async function render(url: string, { post }: RenderOptions = {}): Promise<string> {
  const errors: unknown[] = [];
  const { prelude } = await prerender(
    <StrictMode>
      <EmbeddedPostContext value={post ?? null}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </EmbeddedPostContext>
    </StrictMode>,
    {
      // Nothing is streamed, so every Suspense boundary is written where it
      // belongs. With the default (12.8 kB) React moves larger boundaries to
      // the end of the document and reveals them with an inline script, which
      // the Content-Security-Policy would block.
      progressiveChunkSize: Number.POSITIVE_INFINITY,
      onError(error) {
        errors.push(error);
      },
    },
  );
  const html = await new Response(prelude).text();
  if (errors.length > 0) throw errors[0];
  return html;
}
