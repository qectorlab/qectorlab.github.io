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
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "accelerometer=(), ambient-light-sensor=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(self), document-domain=(), encrypted-media=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(self), usb=(), xr-spatial-tracking=()",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "Cross-Origin-Resource-Policy": "same-origin",
  "X-Permitted-Cross-Domain-Policies": "none",
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
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

// Do not override these if origin already set them correctly (e.g. Cache-Control for assets).
const OVERWRITE = new Set([
  "Strict-Transport-Security",
  "X-Frame-Options",
  "X-Content-Type-Options",
  "X-XSS-Protection",
  "Referrer-Policy",
  "Permissions-Policy",
  "Cross-Origin-Opener-Policy",
  "Cross-Origin-Resource-Policy",
  "X-Permitted-Cross-Domain-Policies",
  "Content-Security-Policy",
]);

export default {
  async fetch(request, env, ctx) {
    // Let /stripe/* be handled by qector-fulfilment — this Worker is a fallback for /*
    // If the request was already matched to the fulfilment Worker, this fetch won't be called.
    // For safety, passthrough any /stripe/* that reaches here (should not happen).
    const url = new URL(request.url);
    if (url.pathname.startsWith("/stripe/")) {
      return fetch(request);
    }

    let response = await fetch(request);
    // Clone response to mutate headers
    response = new Response(response.body, response);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      if (OVERWRITE.has(name) || !response.headers.has(name)) {
        response.headers.set(name, value);
      }
    }
    // Ensure nosniff etc. are not stripped by GitHub Pages cache
    return response;
  },
};
