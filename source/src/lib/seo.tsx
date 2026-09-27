import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { APP_CONFIG } from './config';

interface AlternateLink {
  /** BCP 47 language tag, e.g. 'en' or 'fr'. */
  lang: string;
  href: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  noindex?: boolean;
  /** Page language; sets <html lang> and og:locale. Defaults to 'en'. */
  lang?: string;
  /** hreflang alternate links for translated page pairs. */
  alternates?: AlternateLink[];
}

const OG_LOCALE: Record<string, string> = { en: 'en_US', fr: 'fr_FR' };

export function SEO({
  title = 'QECTOR · Quantum Error Correction Decoding for Python',
  description = 'QECTOR Decoder v3 - Rust-core Python quantum error correction decoder. v1.0.0 first stable release with API stability tiers, a qector CLI, and a reproducible benchmark harness (qector bench) for measuring on your own hardware.',
  ogImage = APP_CONFIG.ogImage,
  noindex = false,
  lang = 'en',
  alternates,
}: SEOProps) {
  const location = useLocation();
  const canonical = `https://qector.store${location.pathname === '/' ? '/' : `${location.pathname.replace(/\/$/, '')}/`}`;

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang;

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
    setMeta('meta[property="og:locale"]', OG_LOCALE[lang] ?? 'en_US');
    setMeta('meta[property="og:image"]', ogImage);
    setMeta('meta[property="og:image:alt"]', 'QECTOR official logo');
    setMeta('meta[property="og:site_name"]', 'QECTOR');
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', ogImage);
    setMeta('meta[name="twitter:image:alt"]', 'QECTOR official logo');
    setMeta('meta[name="twitter:site"]', '@DJiD01T');
    setMeta('meta[name="theme-color"]', '#24e7ff');

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;

    // hreflang alternates: remove stale ones, then add the current set.
    document
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((el) => el.remove());
    const added: HTMLLinkElement[] = [];
    for (const alt of alternates ?? []) {
      const altLink = document.createElement('link');
      altLink.rel = 'alternate';
      altLink.hreflang = alt.lang;
      altLink.href = alt.href;
      document.head.appendChild(altLink);
      added.push(altLink);
    }

    return () => {
      added.forEach((el) => el.remove());
    };
  }, [title, description, canonical, ogImage, noindex, lang, alternates]);

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
