import { useEffect } from 'react';
import { useLocation } from 'react-router';

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  noindex?: boolean;
}

export function SEO({
  title = 'QECTOR · Production-Grade Quantum Error Correction Decoding for Python',
  description = 'QECTOR Decoder v3 - Production-grade Python library for quantum error correction decoding with exact MWPM parity to PyMatching and measurable Belief-Matching gains.',
  ogImage = 'https://qector.store/assets/logo.svg',
  noindex = false,
}: SEOProps) {
  const location = useLocation();
  const canonical = `https://qector.store${location.pathname === '/' ? '' : location.pathname}`;

  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const attr = selector.includes('property=') ? 'property' : 'name';
        const name = selector.match(/"([^"]+)"/)?.[1] || '';
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[name="robots"]', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonical);
    setMeta('meta[property="og:type"]', 'website');
    setMeta('meta[property="og:image"]', ogImage);
    setMeta('meta[property="og:site_name"]', 'QECTOR');
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', ogImage);
    setMeta('meta[name="twitter:site"]', '@DJiD01T');
    setMeta('meta[name="theme-color"]', '#24e7ff');

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [title, description, canonical, ogImage, noindex]);

  return null;
}

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  const scriptId = 'json-ld-data';
  useEffect(() => {
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [data]);

  return null;
}
