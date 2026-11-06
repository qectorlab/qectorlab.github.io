// Run: node --test test/   (Node 20+; no dependencies)
import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import worker, { tierFromSession, signLicenseV2, TIERS, AMOUNT_TIERS } from "../src/index.js";

const WEBHOOK_SECRET = "whsec_test_secret";

class MemoryKV {
  constructor() { this.map = new Map(); }
  async get(key) { return this.map.has(key) ? this.map.get(key) : null; }
  async put(key, value) { this.map.set(key, value); }
  json(key) { const v = this.map.get(key); return v ? JSON.parse(v) : null; }
}

async function makeEnv() {
  const { privateKey, publicKey } = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const pkcs8 = Buffer.from(await crypto.subtle.exportKey("pkcs8", privateKey));
  const pem = `-----BEGIN PRIVATE KEY-----\n${pkcs8.toString("base64")}\n-----END PRIVATE KEY-----\n`;
  const raw = Buffer.from(await crypto.subtle.exportKey("raw", publicKey));
  const sent = [];
  return {
    env: {
      LICENSES: new MemoryKV(),
      STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET,
      QECTOR_LICENSE_PRIVATE_KEY_B64: Buffer.from(pem).toString("base64"),
      EMAIL: { async send(message) { sent.push(message); return { messageId: `m${sent.length}` }; } },
    },
    sent,
    publicKey,
    publicRaw: raw,
  };
}

async function stripeRequest(event, { secret = WEBHOOK_SECRET, t = Math.floor(Date.now() / 1000) } = {}) {
  const payload = JSON.stringify(event);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = Buffer.from(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${t}.${payload}`))).toString("hex");
  return new Request("https://qector.store/stripe/webhook", { method: "POST", headers: { "stripe-signature": `t=${t},v1=${mac}` }, body: payload });
}

function decodeClaims(token) {
  const [, claims] = token.split(".");
  return JSON.parse(Buffer.from(claims, "base64url").toString());
}

async function verifyToken(token, publicKey) {
  const [, claims, sig] = token.split(".");
  return crypto.subtle.verify("Ed25519", publicKey, Buffer.from(sig, "base64url"), new TextEncoder().encode(claims));
}

const checkout = (id, extra = {}) => ({
  id: `evt_${id}`, type: "checkout.session.completed", livemode: true,
  data: { object: { id: `cs_live_${id}`, payment_status: "paid", currency: "usd", customer_details: { email: "Buyer@Example.com" }, ...extra } },
});

test("tier resolution: metadata, then pre-tax subtotal; never a silent guess", () => {
  assert.equal(tierFromSession({ metadata: { qector_tier: "team" }, amount_subtotal: 1 }), "team");
  assert.equal(tierFromSession({ metadata: { license_tier: "Pro Annual" } }), "pro_annual");
  // $1,299 Solo with Québec tax: total 149,350 but subtotal is the list price.
  assert.equal(tierFromSession({ metadata: {}, amount_subtotal: 129900, amount_total: 149350 }), "solo_annual");
  // 100% coupon on Startup (the real live session shape): subtotal still identifies it.
  assert.equal(tierFromSession({ metadata: {}, amount_subtotal: 449900, amount_total: 0 }), "startup");
  assert.throws(() => tierFromSession({ id: "cs_x", metadata: {}, amount_subtotal: 12345, amount_total: 12345 }), /cannot determine/);
  for (const tier of Object.values(AMOUNT_TIERS)) assert.ok(TIERS[tier], tier);
});

test("every product tier signs a token the decoder understands", async () => {
  const { env, publicKey } = await makeEnv();
  const now = Date.UTC(2026, 10, 5) ;
  const rows = [];
  for (const [tier, info] of Object.entries(TIERS)) {
    const token = await signLicenseV2(`cs_${tier}`, "a@b.co", tier, env, now);
    assert.ok(await verifyToken(token, publicKey), tier);
    const claims = decodeClaims(token);
    assert.deepEqual(Object.keys(claims), info.days == null ? ["email", "rid", "tier"] : ["email", "exp", "rid", "tier"]);
    assert.ok(["evaluation", "pro", "enterprise"].includes(claims.tier), `${tier} claim ${claims.tier}`);
    if (info.days != null) assert.equal(claims.exp, Math.floor(now / 1000) + info.days * 86400);
    rows.push({ product_tier: tier, token });
  }
  const raw = Buffer.from(await crypto.subtle.exportKey("raw", publicKey)).toString("base64");
  if (process.env.QECTOR_WRITE_TOKENS) writeFileSync(new URL("./tokens.json", import.meta.url), JSON.stringify({ public_key_raw_b64: raw, now_unix: Math.floor(now / 1000), tokens: rows }, null, 1));
});

test("checkout → licence + billing e-mail; duplicate event is idempotent", async () => {
  const { env, sent, publicKey } = await makeEnv();
  const event = checkout("team1", { metadata: { qector_tier: "team" }, amount_subtotal: 390000, amount_total: 448000, subscription: "sub_1", payment_intent: "pi_1" });
  const res = await worker.fetch(await stripeRequest(event), env);
  assert.equal(res.status, 200, await res.clone().text());
  const body = await res.json();
  assert.equal(body.tier, "team");
  const record = env.LICENSES.json("lic:cs_live_team1");
  assert.equal(record.email, "buyer@example.com");
  assert.equal(decodeClaims(record.token).tier, "pro");
  assert.ok(await verifyToken(record.token, publicKey));
  assert.equal(env.LICENSES.json("sub:sub_1").product_tier, "team");
  assert.equal(sent.length, 2);
  assert.match(sent[0].text, /qector-decoder-v3>=1\.0,<2/);
  assert.doesNotMatch(sent[0].text, /==1\.0\.0/);
  assert.match(sent[0].text, /get_license_info/);
  const again = await worker.fetch(await stripeRequest(event), env);
  assert.equal((await again.json()).duplicate, true);
  assert.equal(sent.length, 2);
});

test("unknown amount without metadata is held for reconciliation, not mis-issued", async () => {
  const { env, sent } = await makeEnv();
  const res = await worker.fetch(await stripeRequest(checkout("odd", { metadata: {}, amount_subtotal: 12345, amount_total: 12345 })), env);
  assert.equal(res.status, 500);
  assert.equal(env.LICENSES.json("evt:evt_odd").status, "pending");
  assert.equal(env.LICENSES.json("lic:cs_live_odd"), null);
  assert.equal(sent.length, 0);
});

test("renewal keeps the purchased tier (Lab stays Enterprise, not a 60-day evaluation)", async () => {
  const { env } = await makeEnv();
  await worker.fetch(await stripeRequest(checkout("lab1", { metadata: { qector_tier: "lab" }, amount_subtotal: 990000, amount_total: 990000, subscription: "sub_lab" })), env);
  const renewal = { id: "evt_renew", type: "invoice.paid", livemode: true, data: { object: { id: "in_renew", billing_reason: "subscription_cycle", subscription: "sub_lab", customer_email: "buyer@example.com", amount_paid: 990000, currency: "usd", metadata: {} } } };
  const res = await worker.fetch(await stripeRequest(renewal), env);
  assert.equal(res.status, 200, await res.clone().text());
  const record = env.LICENSES.json("lic:in_renew");
  assert.equal(record.product_tier, "lab");
  assert.equal(decodeClaims(record.token).tier, "enterprise");
  const first = { ...renewal, id: "evt_first", data: { object: { ...renewal.data.object, id: "in_first", billing_reason: "subscription_create" } } };
  assert.equal((await (await worker.fetch(await stripeRequest(first), env)).json()).ignored, "subscription_create");
});

test("renewal of an unknown legacy subscription uses price metadata or is held", async () => {
  const { env } = await makeEnv();
  const viaPrice = { id: "evt_r2", type: "invoice.paid", livemode: true, data: { object: { id: "in_r2", billing_reason: "subscription_cycle", subscription: "sub_old", customer_email: "x@y.io", lines: { data: [{ price: { id: "price_x", unit_amount: 129900, metadata: {} } }] } } } };
  await worker.fetch(await stripeRequest(viaPrice), env);
  assert.equal(env.LICENSES.json("lic:in_r2").product_tier, "solo_annual");
  const unknown = { id: "evt_r3", type: "invoice.paid", livemode: true, data: { object: { id: "in_r3", billing_reason: "subscription_cycle", subscription: "sub_?", customer_email: "x@y.io" } } };
  assert.equal((await worker.fetch(await stripeRequest(unknown), env)).status, 500);
});

test("credited manual invoice with tier metadata issues a licence", async () => {
  const { env } = await makeEnv();
  const manual = { id: "evt_m", type: "invoice.paid", livemode: true, data: { object: { id: "in_credit", billing_reason: "manual", customer_email: "lab@uni.edu", amount_paid: 840000, currency: "usd", metadata: { qector_tier: "lab" } } } };
  await worker.fetch(await stripeRequest(manual), env);
  assert.equal(env.LICENSES.json("lic:in_credit").product_tier, "lab");
  const bare = { ...manual, id: "evt_m2", data: { object: { ...manual.data.object, id: "in_bare", metadata: {} } } };
  assert.match((await (await worker.fetch(await stripeRequest(bare), env)).json()).ignored, /without qector_tier/);
});

test("refund revokes the token's receipt id and publishes it in the CRL", async () => {
  const { env } = await makeEnv();
  await worker.fetch(await stripeRequest(checkout("ref1", { metadata: { qector_tier: "pro_annual" }, amount_subtotal: 79000, amount_total: 79000, payment_intent: "pi_ref" })), env);
  const refund = { id: "evt_refund", type: "charge.refunded", livemode: true, data: { object: { id: "ch_1", payment_intent: "pi_ref" } } };
  const res = await worker.fetch(await stripeRequest(refund), env);
  assert.equal((await res.json()).revoked, true);
  assert.equal(env.LICENSES.json("lic:cs_live_ref1").revoked, true);
  const crl = await (await worker.fetch(new Request("https://qector.store/stripe/revoked.txt"), env)).text();
  assert.match(crl, /^cs_live_ref1$/m);
});

test("webhook rejects bad signatures, stale timestamps and test-mode events", async () => {
  const { env } = await makeEnv();
  const event = checkout("sig", { metadata: { qector_tier: "pro_monthly" } });
  assert.equal((await worker.fetch(await stripeRequest(event, { secret: "wrong" }), env)).status, 400);
  assert.equal((await worker.fetch(await stripeRequest(event, { t: Math.floor(Date.now() / 1000) - 3600 }), env)).status, 400);
  assert.equal((await worker.fetch(await stripeRequest({ ...event, livemode: false }), env)).status, 400);
});

test("trial: one token per address per year, honeypot, terms, per-IP cap, no oracle", async () => {
  const { env, sent } = await makeEnv();
  const post = (body, ip = "203.0.113.7") =>
    worker.fetch(new Request("https://qector.store/stripe/trial", { method: "POST", headers: { "content-type": "application/json", origin: "https://qector.store", "cf-connecting-ip": ip }, body: JSON.stringify(body) }), env);
  assert.equal((await post({ email: "eng@corp.com" })).status, 400); // terms not accepted
  const first = await post({ email: "eng@corp.com", accept_terms: true });
  assert.equal(first.status, 202);
  assert.equal(first.headers.get("access-control-allow-origin"), "https://qector.store");
  assert.equal(sent.length, 1);
  assert.match(sent[0].subject, /Commercial Trial/);
  const token = sent[0].text.match(/v2\.[\w-]+\.[\w-]+/)[0];
  const claims = decodeClaims(token);
  assert.equal(claims.tier, "pro");
  assert.ok(claims.exp - Date.now() / 1000 < 14 * 86400 + 5);
  const again = await post({ email: "ENG@corp.com", accept_terms: true });
  assert.equal(again.status, 202);
  assert.deepEqual(await again.json(), await first.clone().json().catch(() => ({ ok: true, message: "Check your inbox for your trial token. It arrives within a few minutes." })));
  assert.equal(sent.length, 1, "no second token for the same address");
  assert.equal((await post({ email: "bot@x.io", accept_terms: true, website: "spam" })).status, 202);
  assert.equal(sent.length, 1, "honeypot sends nothing");
  // Per-IP cap: the IP above has used 3 slots (eng@, ENG@, honeypot does not count? it returns before) → fill up.
  await post({ email: "a1@x.io", accept_terms: true }, "198.51.100.1");
  await post({ email: "a2@x.io", accept_terms: true }, "198.51.100.1");
  await post({ email: "a3@x.io", accept_terms: true }, "198.51.100.1");
  assert.equal((await post({ email: "a4@x.io", accept_terms: true }, "198.51.100.1")).status, 429);
  const foreign = await worker.fetch(new Request("https://qector.store/stripe/trial", { method: "POST", headers: { "content-type": "application/json", origin: "https://evil.example" }, body: "{}" }), env);
  assert.equal(foreign.status, 403);
});

test("health reports configuration without secrets", async () => {
  const { env } = await makeEnv();
  const body = await (await worker.fetch(new Request("https://qector.store/stripe/health"), env)).json();
  assert.equal(body.version, "2.0");
  assert.equal(body.signing_key, true);
  assert.ok(!JSON.stringify(body).includes("PRIVATE"));
});
