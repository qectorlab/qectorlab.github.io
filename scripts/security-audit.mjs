const site = "https://qector.store";
const requiredDocumentHeaders = {
  "strict-transport-security": /max-age=31536000.*includeSubDomains/i,
  "content-security-policy": /default-src 'self'.*object-src 'none'.*frame-ancestors 'none'/i,
  "permissions-policy": /camera=\(\).*geolocation=\(\).*microphone=\(\)/i,
  "referrer-policy": /strict-origin-when-cross-origin/i,
  "x-content-type-options": /^nosniff$/i,
  "x-frame-options": /^DENY$/i,
  "x-xss-protection": /^1; mode=block$/i,
};

const requiredApiHeaders = {
  ...requiredDocumentHeaders,
  "content-security-policy": /default-src 'none'.*frame-ancestors 'none'/i,
  "referrer-policy": /^no-referrer$/i,
  "cache-control": /^no-store$/i,
  "x-robots-tag": /noindex.*nofollow/i,
};

const failures = [];

async function request(path, options = {}) {
  const url = path.startsWith("http://") || path.startsWith("https://") ? path : `${site}${path}`;
  const response = await fetch(url, {
    redirect: "manual",
    ...options,
  });
  return response;
}

function header(response, name) {
  return response.headers.get(name) || "";
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function assertHeaders(response, required, label) {
  for (const [name, pattern] of Object.entries(required)) {
    assert(pattern.test(header(response, name)), `${label}: missing or invalid ${name}`);
  }
  assert(!header(response, "access-control-allow-origin"), `${label}: wildcard CORS is exposed`);
}

const documentResponse = await request("/");
assert(documentResponse.status === 200, `home: expected 200, got ${documentResponse.status}`);
assertHeaders(documentResponse, requiredDocumentHeaders, "home");
assert(/max-age=0.*must-revalidate/i.test(header(documentResponse, "cache-control")), "home: HTML is cacheable for too long");

const wwwResponse = await request("https://www.qector.store/");
assert([301, 302, 307, 308].includes(wwwResponse.status), `www: expected redirect, got ${wwwResponse.status}`);
assert((header(wwwResponse, "location") || "").startsWith("https://qector.store/"), "www: redirect does not canonicalize to qector.store");
assertHeaders(wwwResponse, requiredDocumentHeaders, "www redirect");

const httpResponse = await fetch("http://qector.store/", { redirect: "manual" });
assert([301, 302, 307, 308].includes(httpResponse.status), `HTTP: expected HTTPS redirect, got ${httpResponse.status}`);
assert((header(httpResponse, "location") || "").startsWith("https://qector.store/"), "HTTP: redirect is not HTTPS");

const apiResponse = await request("/stripe/health");
assert(apiResponse.status === 200, `health: expected 200, got ${apiResponse.status}`);
assertHeaders(apiResponse, requiredApiHeaders, "health");
const health = await apiResponse.json();
assert(health.ok === true && health.live_mode === true, "health: live service did not report ok");

const videoResponse = await request("/videos/hero-lattice.mp4", { method: "HEAD" });
assert(videoResponse.status === 200, `video: expected 200, got ${videoResponse.status}`);
assert(/^video\/mp4/i.test(header(videoResponse, "content-type")), "video: incorrect content type");
assert(/immutable/i.test(header(videoResponse, "cache-control")), "video: missing immutable cache policy");
assertHeaders(videoResponse, requiredDocumentHeaders, "video");

const securityResponse = await request("/.well-known/security.txt", { method: "HEAD" });
assert(securityResponse.status === 200, `security.txt: expected 200, got ${securityResponse.status}`);
assert(/^text\/plain/i.test(header(securityResponse, "content-type")), "security.txt: incorrect content type");
assertHeaders(securityResponse, requiredDocumentHeaders, "security.txt");

for (const path of ["/openai/", "/master-ai-suite/", "/does-not-exist/"]) {
  const response = await request(path);
  assert(response.status === 404, `${path}: expected 404, got ${response.status}`);
  assertHeaders(response, requiredDocumentHeaders, path);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Production security audit passed: headers, redirects, API, video, security.txt, and removed routes.");
}
