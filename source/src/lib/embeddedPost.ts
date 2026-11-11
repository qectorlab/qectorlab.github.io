import { createContext } from 'react';

/**
 * A blog article's Markdown that travels with the page.
 *
 * At build time the article is rendered into the page's HTML and the same
 * Markdown is embedded next to it as a JSON data block. The browser reads the
 * block before its first render, so BlogPost starts from the article instead
 * of an empty "loading" state and React can attach to the HTML as it is, with
 * no request. A post reached by navigating inside the site has no block and is
 * fetched as before.
 */
export interface EmbeddedPost {
  /** File name under /blog/, as in blogData.ts. */
  filename: string;
  /** The Markdown file, unmodified. */
  markdown: string;
}

/** id of the <script type="application/json"> element holding an EmbeddedPost. */
export const EMBEDDED_POST_ELEMENT_ID = 'qector-post';

export const EmbeddedPostContext = createContext<EmbeddedPost | null>(null);

/** Text for the data block: JSON with every "<" escaped, so no article text can end the element. */
export function serializeEmbeddedPost(post: EmbeddedPost): string {
  return JSON.stringify(post).replace(/</g, '\\u003c');
}

/** The post embedded in the current document, if there is a well-formed one. */
export function readEmbeddedPost(): EmbeddedPost | null {
  const text = document.getElementById(EMBEDDED_POST_ELEMENT_ID)?.textContent;
  if (!text) return null;
  try {
    const data: unknown = JSON.parse(text);
    if (typeof data !== 'object' || data === null) return null;
    const { filename, markdown } = data as Record<string, unknown>;
    return typeof filename === 'string' && typeof markdown === 'string' ? { filename, markdown } : null;
  } catch {
    return null;
  }
}
