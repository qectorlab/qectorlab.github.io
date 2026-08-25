/**
 * Cloudflare Worker: security headers for qector.store
 *
 * GitHub Pages ignores _headers (Netlify/Cloudflare Pages syntax), so
 * scanners see Grade F. This Worker proxies the origin and injects the
 * exact policy already declared in source/public/_headers and _headers.
 * Route qector.store/* is less specific than qector.store/stripe/*, so
 * the fulfilment Worker still owns /stripe/*.
 */

const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "X-DNS-Prefetch-Control": "off",
  "X-Download-Options": "noopen",
  "Origin-Agent-Cluster": "?1",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "accelerometer=(), ambient-light-sensor=(), autoplay=(self), camera=(), clipboard-read=(), clipboard-write=(self), document-domain=(), encrypted-media=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(self), usb=(), xr-spatial-tracking=()",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "Cross-Origin-Resource-Policy": "same-origin",
  "X-Permitted-Cross-Domain-Policies": "none",
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    "script-src 'self' 'sha256-mDfvlEEbZ+pOz33Aj7pRtcA8xcbmfe1wOO1NaObDVDs=' https://js.stripe.com https://assets.calendly.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com",
    "img-src 'self' data: https://files.stripe.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://api.stripe.com https://js.stripe.com https://api.calendly.com https://calendly.com https://pypi.org",
    "frame-src https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com https://calendly.com",
    "frame-ancestors 'none'",
    "form-action 'self' https://buy.stripe.com https://checkout.stripe.com https://billing.stripe.com",
    "media-src 'self' blob:",
  ].join("; "),
};

const OVERWRITE = new Set([
  "Strict-Transport-Security",
  "X-Frame-Options",
  "X-Content-Type-Options",
  "X-XSS-Protection",
  "X-DNS-Prefetch-Control",
  "X-Download-Options",
  "Origin-Agent-Cluster",
  "Referrer-Policy",
  "Permissions-Policy",
  "Cross-Origin-Opener-Policy",
  "Cross-Origin-Resource-Policy",
  "X-Permitted-Cross-Domain-Policies",
  "Content-Security-Policy",
]);

const CORS_HEADERS = [
  "access-control-allow-credentials",
  "access-control-allow-headers",
  "access-control-allow-methods",
  "access-control-allow-origin",
  "access-control-expose-headers",
];

export default {
  async fetch(request) {
    // Let /stripe/* be handled by qector-fulfilment — this Worker is a fallback for /*
    // If the request was already matched to the fulfilment Worker, this fetch won't be called.
    // For safety, passthrough any /stripe/* that reaches here (should not happen).
    const url = new URL(request.url);
    if (url.pathname.startsWith("/stripe/")) {
      return fetch(request);
    }

    const response = await fetch(request);
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      if (OVERWRITE.has(name) || !headers.has(name)) headers.set(name, value);
    }
    for (const name of CORS_HEADERS) headers.delete(name);

    if (url.pathname === "/success" || url.pathname.startsWith("/success/")) {
      headers.set("Cache-Control", "no-store");
      headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    } else if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/videos/")) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
