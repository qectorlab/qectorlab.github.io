import assert from "node:assert/strict";
import { test } from "node:test";
import worker from "../src/index.js";

function originResponse(contentType = "text/html; charset=utf-8") {
  return new Response("origin", {
    headers: {
      "access-control-allow-origin": "*",
      "cache-control": "max-age=14400",
      "content-type": contentType,
    },
  });
}

test("hardens HTML responses and removes wildcard CORS", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => originResponse();
  try {
    const response = await worker.fetch(new Request("https://qector.store/"));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("access-control-allow-origin"), null);
    assert.equal(response.headers.get("cache-control"), "public, max-age=0, must-revalidate");
    assert.equal(response.headers.get("strict-transport-security"), "max-age=31536000; includeSubDomains; preload");
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
    assert.equal(response.headers.get("x-xss-protection"), "1; mode=block");
    assert.match(response.headers.get("content-security-policy"), /upgrade-insecure-requests/);
    assert.match(response.headers.get("content-security-policy"), /media-src 'self' blob:/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("keeps immutable caching for the hero video and protects its headers", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => originResponse("video/mp4");
  try {
    const response = await worker.fetch(new Request("https://qector.store/videos/hero-lattice.mp4"));
    assert.equal(response.headers.get("access-control-allow-origin"), null);
    assert.equal(response.headers.get("cache-control"), "public, max-age=31536000, immutable");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("does not cache or index the success page", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => originResponse();
  try {
    const response = await worker.fetch(new Request("https://qector.store/success/?session_id=cs_live_example"));
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
