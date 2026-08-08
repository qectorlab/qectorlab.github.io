import { useEffect, useRef } from 'react';

// Calendly inline embed.
//
// The vendor snippet is a bare <div> plus an external <script>, which does not
// survive React's render cycle: on route changes the script has already run and
// will not re-scan, leaving an empty box. So the script is loaded once and kept
// on the page, and the widget is initialised imperatively per mount via the
// global Calendly API when it is available.
//
// Note for _headers: the Content-Security-Policy must allow
// https://assets.calendly.com (script-src) and https://calendly.com
// (frame-src), or this renders as an empty container.

const CALENDLY_SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';

interface CalendlyAPI {
  initInlineWidget(opts: { url: string; parentElement: HTMLElement }): void;
}

declare global {
  interface Window {
    Calendly?: CalendlyAPI;
  }
}

export default function CalendlyWidget({
  url,
  minWidth = '320px',
  height = '700px',
}: {
  url: string;
  minWidth?: string;
  height?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const init = () => {
      if (!containerRef.current || !window.Calendly) return;
      // Guard against double-initialisation in StrictMode's double effect.
      if (containerRef.current.childElementCount > 0) return;
      window.Calendly.initInlineWidget({ url, parentElement: containerRef.current });
    };

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT}"]`);
    if (window.Calendly) {
      init();
    } else if (existing) {
      existing.addEventListener('load', init);
    } else {
      const script = document.createElement('script');
      script.src = CALENDLY_SCRIPT;
      script.async = true;
      script.addEventListener('load', init);
      document.body.appendChild(script);
    }

    return () => {
      existing?.removeEventListener('load', init);
      if (container) container.innerHTML = '';
    };
  }, [url]);

  return (
    <div
      ref={containerRef}
      className="calendly-inline-widget rounded-xl overflow-hidden border border-gridline"
      style={{ minWidth, height }}
      data-url={url}
    />
  );
}
