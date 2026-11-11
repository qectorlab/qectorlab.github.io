import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import CodeBlock from './CodeBlock';

// IMPORTANT: We need KaTeX CSS to render math formulas correctly
import 'katex/dist/katex.min.css';

// The Markdown and KaTeX renderer of a blog article. It is by far the largest
// piece of code on the site, so it lives in its own chunk: BlogPost loads it
// lazily and the rest of the post (header, navigation) does not wait for it.

/**
 * Extract plain text from React children, recursively flattening
 * any nested elements. Strips KaTeX/math markup so that the slug
 * matches the hand-authored TOC anchors in each blog post.
 */
function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (!children) return '';
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (typeof children === 'object' && 'props' in children) {
    return extractText((children as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  }
  return '';
}

/** The part of a Markdown syntax-tree node this file reads. */
interface TreeNode {
  type?: string;
  tagName?: string;
  value?: string;
  children?: TreeNode[];
}

const treeText = (node: TreeNode): string => (node.type === 'text' ? (node.value ?? '') : (node.children ?? []).map(treeText).join(''));

/** Column headings of a table node, e.g. "Decoder, Target code, Speed". */
function tableHeadings(node: TreeNode | undefined): string {
  const cells: string[] = [];
  const walk = (n: TreeNode) => {
    if (n.tagName === 'th') cells.push(treeText(n).trim());
    else (n.children ?? []).forEach(walk);
  };
  if (node) walk(node);
  return cells.filter(Boolean).join(', ').slice(0, 90);
}

/**
 * Slugify text using the same algorithm as github-slugger / rehype-slug:
 * lowercase, strip non-alphanumeric (except hyphens and spaces), collapse
 * whitespace to single hyphens, trim leading/trailing hyphens.
 *
 * Additionally strips LaTeX commands ($...$, \\mathrm{}, \\equiv, etc.)
 * before slugifying so that headings containing math produce the same
 * anchors the TOC links expect.
 */
function slugify(text: string): string {
  return text
    .replace(/\$[^$]*\$/g, '')           // strip inline math $...$
    .replace(/\\[a-zA-Z]+\{[^}]*\}/g, '') // strip \command{...}
    .replace(/[\\{}]/g, '')               // strip remaining backslashes/braces
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')             // strip non-word chars except spaces/hyphens
    .replace(/\s+/g, '-')                 // spaces to hyphens
    .replace(/-+/g, '-')                  // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '');             // trim leading/trailing hyphens
}

/**
 * Factory for heading components (h1..h6) that auto-generate id attributes
 * from the heading text. This replaces rehype-slug which produces
 * unpredictable IDs when headings contain KaTeX math.
 */
function makeHeading(Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  return function HeadingWithId({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    const text = extractText(children);
    const id = props.id || slugify(text);
    return <Tag {...props} id={id}>{children}</Tag>;
  };
}

const components: Partial<Components> = {
  h1: makeHeading('h1'),
  h2: makeHeading('h2'),
  h3: makeHeading('h3'),
  h4: makeHeading('h4'),
  h5: makeHeading('h5'),
  h6: makeHeading('h6'),
  table: (props) => {
    const { node, ...rest } = props;
    // The scroll region is named after the table's own column headings, so
    // two tables in one post are distinguishable landmarks.
    const headings = tableHeadings(node);
    return (
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={headings ? `Table: ${headings}` : 'Table'}>
        <table {...rest} />
      </div>
    );
  },
  pre: (props) => {
    const { children } = props;
    const codeEl = React.Children.toArray(children)[0];
    let code = '';
    let language = 'text';
    if (React.isValidElement(codeEl)) {
      const codeProps = codeEl.props as { className?: string; children?: React.ReactNode };
      const match = /language-([\w-]+)/.exec(codeProps.className || '');
      if (match) language = match[1];
      code = extractText(codeProps.children).replace(/\n$/, '');
    }
    return <CodeBlock code={code} language={language} className="not-prose" />;
  },
  img: (props) => {
    const sized = props.width != null && props.height != null;
    return (
      <img
        {...props}
        className={
          sized
            ? 'rounded-xl border border-slate-800 shadow-xl max-w-full h-auto'
            : 'rounded-xl border border-slate-800 shadow-xl max-w-full h-auto aspect-video object-cover'
        }
        loading="lazy"
      />
    );
  },
};

const remarkPlugins = [remarkGfm, remarkMath];
// Raw HTML in a post is not interpreted: no post uses any, and leaving the
// HTML parser out keeps about 150 kB off every blog page.
const rehypePlugins = [rehypeKatex];

export default function MarkdownArticle({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={components}>
      {content}
    </ReactMarkdown>
  );
}
