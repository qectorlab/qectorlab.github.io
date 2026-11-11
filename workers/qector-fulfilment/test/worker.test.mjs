// Run: node --test test/   (Node 20+; no dependencies)
import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import worker, { tierFromSession, signLicenseV2, keyMatchesDecoder, TIERS, AMOUNT_TIERS } from "../src/index.js";

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
      QECTOR_EXPECTED_PUBLIC_KEY_B64: raw.toString("base64"),
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
  assert.match(sent[0].text, /qector-decoder-v3>=1\.0\.1,<2/);
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
  const refund = { id: "evt_refund", type: "charge.refunded", livemode: true, data: { object: { id: "ch_1", payment_intent: "pi_ref", refunded: true } } };
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
  assert.equal(body.version, "2.2");
  assert.equal(body.key_matches_decoder, true);
  assert.equal(body.signing_key, true);
  assert.ok(!JSON.stringify(body).includes("PRIVATE"));
});

test("plan names and e-mails carry no user or seat counts", async () => {
  for (const [name, info] of Object.entries(TIERS)) assert.doesNotMatch(info.label, /user|seat/i, name);
  const { env, sent } = await makeEnv();
  await worker.fetch(await stripeRequest(checkout("lab1", { metadata: { qector_tier: "lab" }, subscription: "sub_lab" })), env);
  for (const m of sent) assert.doesNotMatch(m.text + m.html + m.subject, /users|seat/i);
  assert.match(sent[0].text, /It prints Enterprise\./);
});

test("delayed payment: unpaid completion waits, async_payment_succeeded issues once", async () => {
  const { env, sent } = await makeEnv();
  const unpaid = checkout("ach1", { metadata: { qector_tier: "pro_annual" }, payment_status: "unpaid" });
  const first = await (await worker.fetch(await stripeRequest(unpaid), env)).json();
  assert.equal(first.issued, false);
  assert.equal(sent.length, 0);
  const paid = { ...unpaid, id: "evt_ach1_paid", type: "checkout.session.async_payment_succeeded", data: { object: { ...unpaid.data.object, payment_status: "paid" } } };
  const second = await (await worker.fetch(await stripeRequest(paid), env)).json();
  assert.equal(second.issued, true);
  assert.equal(decodeClaims(env.LICENSES.json("lic:cs_live_ach1").token).tier, "pro");
  assert.equal(sent.length, 2);
});

test("partial refund keeps the licence; full refund revokes", async () => {
  const { env } = await makeEnv();
  await worker.fetch(await stripeRequest(checkout("pr1", { metadata: { qector_tier: "pro_perpetual" }, payment_intent: "pi_pr1" })), env);
  const partial = { id: "evt_pr_partial", type: "charge.refunded", livemode: true, data: { object: { id: "ch_pr", payment_intent: "pi_pr1", refunded: false, amount_refunded: 500 } } };
  const p = await (await worker.fetch(await stripeRequest(partial), env)).json();
  assert.equal(p.revoked, false);
  assert.notEqual(env.LICENSES.json("lic:cs_live_pr1").revoked, true);
  assert.doesNotMatch(await (await worker.fetch(new Request("https://qector.store/stripe/revoked.txt"), env)).text(), /cs_live_pr1/);
  const full = { ...partial, id: "evt_pr_full", data: { object: { ...partial.data.object, refunded: true } } };
  assert.equal((await (await worker.fetch(await stripeRequest(full), env)).json()).revoked, true);
  assert.match(await (await worker.fetch(new Request("https://qector.store/stripe/revoked.txt"), env)).text(), /^cs_live_pr1$/m);
});

test("dispute revokes", async () => {
  const { env } = await makeEnv();
  await worker.fetch(await stripeRequest(checkout("dp1", { metadata: { qector_tier: "pro_monthly" }, payment_intent: "pi_dp1" })), env);
  const dispute = { id: "evt_dp", type: "charge.dispute.created", livemode: true, data: { object: { id: "dp_1", charge: "ch_dp", payment_intent: "pi_dp1" } } };
  assert.equal((await (await worker.fetch(await stripeRequest(dispute), env)).json()).revoked, true);
});

test("cancelled subscription is not revoked: the token runs to its expiry", async () => {
  const { env } = await makeEnv();
  await worker.fetch(await stripeRequest(checkout("cx1", { metadata: { qector_tier: "pro_annual" }, subscription: "sub_cx1", payment_intent: "pi_cx1" })), env);
  const del = { id: "evt_cx_del", type: "customer.subscription.deleted", livemode: true, data: { object: { id: "sub_cx1" } } };
  const body = await (await worker.fetch(await stripeRequest(del), env)).json();
  assert.equal(body.revoked, false);
  assert.equal(body.cancelled, true);
  const rec = env.LICENSES.json("lic:cs_live_cx1");
  assert.notEqual(rec.revoked, true);
  assert.ok(rec.subscription_ended_at);
  assert.doesNotMatch(await (await worker.fetch(new Request("https://qector.store/stripe/revoked.txt"), env)).text(), /cs_live_cx1/);
});

test("key guard: a signing key that does not match the decoder issues nothing and stays retryable", async () => {
  const { env, sent } = await makeEnv();
  const other = await makeEnv();
  env.QECTOR_EXPECTED_PUBLIC_KEY_B64 = other.env.QECTOR_EXPECTED_PUBLIC_KEY_B64;
  assert.equal(await keyMatchesDecoder(env), false);
  const res = await worker.fetch(await stripeRequest(checkout("kg1", { metadata: { qector_tier: "lab" } })), env);
  assert.equal(res.status, 500);
  assert.equal(sent.length, 0);
  assert.equal(env.LICENSES.json("lic:cs_live_kg1"), null);
  assert.equal((await (await worker.fetch(new Request("https://qector.store/stripe/health"), env)).json()).key_matches_decoder, false);
});

test("production default: the embedded decoder key is the one checked", async () => {
  const { env } = await makeEnv();
  delete env.QECTOR_EXPECTED_PUBLIC_KEY_B64;
  assert.equal(await keyMatchesDecoder(env), false, "a random test key must not match the production decoder key");
});

test("legacy renewal without metadata resolves on the new invoice shape (pricing.price_details)", async () => {
  const { env, sent } = await makeEnv();
  const mk = (id, sub, price, amount) => ({
    id: `evt_${id}`, type: "invoice.paid", livemode: true,
    data: { object: { id: `in_${id}`, billing_reason: "subscription_cycle", customer_email: "ops@corp.com", amount_paid: amount, subtotal: amount,
      parent: { subscription_details: { subscription: sub, metadata: {} } },
      lines: { data: [{ amount, quantity: 1, metadata: {}, pricing: { price_details: { price } } }] } } },
  });
  const startup = await (await worker.fetch(await stripeRequest(mk("st", "sub_st", "price_1TyqegRsa9cg9l8ApRDrXvZa", 449900)), env)).json();
  assert.equal(startup.tier, "startup");
  const pro = await (await worker.fetch(await stripeRequest(mk("pf", "sub_pf", "price_1TyqehRsa9cg9l8Aicyt6SHx", 1150000)), env)).json();
  assert.equal(pro.tier, "professional");
  assert.equal(decodeClaims(env.LICENSES.json("lic:in_pf").token).tier, "enterprise");
  const byAmount = await (await worker.fetch(await stripeRequest(mk("am", "sub_am", "price_unknown", 129900)), env)).json();
  assert.equal(byAmount.tier, "solo_annual");
  assert.equal(sent.length, 6);
});

// ---------------------------------------------------------------------------
// 2.2: refunds and disputes on subscription payments, with the event shapes
// Stripe really sends. A subscription-mode Checkout Session has no
// PaymentIntent; from API 2025-03-31 a Charge has no `invoice` and an Invoice
// has no `payment_intent`.
// ---------------------------------------------------------------------------

const subCheckout = (n, extra = {}) =>
  checkout(`sub${n}`, {
    mode: "subscription", metadata: { qector_tier: "pro_annual" }, amount_subtotal: 79000, amount_total: 79000,
    payment_intent: null, subscription: `sub_${n}`, invoice: `in_first${n}`, customer: `cus_${n}`, ...extra,
  });
const refundOf = (id, object) => ({ id: `evt_rf_${id}`, type: "charge.refunded", livemode: true, data: { object: { id: `ch_${id}`, refunded: true, ...object } } });
const nowSeconds = () => Math.floor(Date.now() / 1000);
const crlText = async (env) => (await worker.fetch(new Request("https://qector.store/stripe/revoked.txt"), env)).text();

test("refund of a first subscription payment revokes through the customer index", async () => {
  const { env } = await makeEnv();
  await worker.fetch(await stripeRequest(subCheckout(1)), env);
  assert.deepEqual(env.LICENSES.json("cus:cus_1"), ["cs_live_sub1"]);
  const res = await worker.fetch(await stripeRequest(refundOf("a", { payment_intent: "pi_a", customer: "cus_1", amount: 79000, currency: "usd", created: nowSeconds() })), env);
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.revoked, true);
  assert.equal(body.matched_by, "customer");
  assert.equal(env.LICENSES.json("lic:cs_live_sub1").revoked, true);
  assert.match(await crlText(env), /^cs_live_sub1$/m);
});

test("refund of a renewal revokes that renewal, not the earlier licence", async () => {
  const { env } = await makeEnv();
  await worker.fetch(await stripeRequest(subCheckout(2)), env);
  // The first licence was issued a billing period ago.
  const first = env.LICENSES.json("lic:cs_live_sub2");
  await env.LICENSES.put("lic:cs_live_sub2", JSON.stringify({ ...first, issued_at: new Date(Date.now() - 366 * 86400 * 1000).toISOString() }));
  const renewal = { id: "evt_in2", type: "invoice.paid", livemode: true, data: { object: { id: "in_renew2", billing_reason: "subscription_cycle", customer: "cus_2", customer_email: "buyer@example.com", currency: "usd", amount_paid: 79000, subtotal: 79000, parent: { subscription_details: { subscription: "sub_2" } } } } };
  assert.equal((await (await worker.fetch(await stripeRequest(renewal), env)).json()).issued, true);
  assert.deepEqual(env.LICENSES.json("cus:cus_2").sort(), ["cs_live_sub2", "in_renew2"]);
  const body = await (await worker.fetch(await stripeRequest(refundOf("b", { payment_intent: "pi_b", customer: "cus_2", amount: 79000, currency: "usd", created: nowSeconds() })), env)).json();
  assert.equal(body.revoked, true);
  assert.equal(body.receipt_id, "in_renew2");
  assert.notEqual(env.LICENSES.json("lic:cs_live_sub2").revoked, true);
});

test("dispute of a subscription payment revokes once invoice_payment.paid has linked it", async () => {
  const { env } = await makeEnv();
  await worker.fetch(await stripeRequest(subCheckout(3)), env);
  const linked = { id: "evt_ip3", type: "invoice_payment.paid", livemode: true, data: { object: { id: "inpay_3", object: "invoice_payment", invoice: "in_first3", status: "paid", payment: { type: "payment_intent", payment_intent: "pi_c" } } } };
  assert.equal((await (await worker.fetch(await stripeRequest(linked), env)).json()).linked, true);
  const dispute = { id: "evt_dp3", type: "charge.dispute.created", livemode: true, data: { object: { id: "dp_3", charge: "ch_c", payment_intent: "pi_c" } } };
  const body = await (await worker.fetch(await stripeRequest(dispute), env)).json();
  assert.equal(body.revoked, true);
  assert.equal(body.matched_by, "link");
  assert.match(await crlText(env), /^cs_live_sub3$/m);
});

test("older API versions: the PaymentIntent on the first invoice links the dispute", async () => {
  const { env } = await makeEnv();
  await worker.fetch(await stripeRequest(subCheckout(4)), env);
  const firstInvoice = { id: "evt_in4", type: "invoice.paid", livemode: true, data: { object: { id: "in_first4", billing_reason: "subscription_create", subscription: "sub_4", payment_intent: "pi_d", charge: "ch_d", customer_email: "buyer@example.com" } } };
  assert.equal((await (await worker.fetch(await stripeRequest(firstInvoice), env)).json()).ignored, "subscription_create");
  const dispute = { id: "evt_dp4", type: "charge.dispute.created", livemode: true, data: { object: { id: "dp_4", charge: "ch_d", payment_intent: "pi_d" } } };
  assert.equal((await (await worker.fetch(await stripeRequest(dispute), env)).json()).revoked, true);
});

test("an unmatched refund or dispute is held, and succeeds on retry once the link exists", async () => {
  const { env } = await makeEnv();
  await worker.fetch(await stripeRequest(subCheckout(5)), env);
  const dispute = { id: "evt_dp5", type: "charge.dispute.created", livemode: true, data: { object: { id: "dp_5", charge: "ch_e", payment_intent: "pi_e" } } };
  const held = await worker.fetch(await stripeRequest(dispute), env);
  assert.equal(held.status, 500);
  assert.equal((await held.json()).retryable, true);
  assert.equal(env.LICENSES.json("evt:evt_dp5").status, "pending");
  assert.match(env.LICENSES.json("evt:evt_dp5").last_error, /matches no licence/);
  assert.doesNotMatch(await crlText(env), /cs_live_sub5/);
  // The link arrives late; Stripe's retry of the same event now revokes.
  await worker.fetch(await stripeRequest({ id: "evt_ip5", type: "invoice_payment.paid", livemode: true, data: { object: { id: "inpay_5", invoice: "in_first5", payment: { type: "payment_intent", payment_intent: "pi_e" } } } }), env);
  const retried = await worker.fetch(await stripeRequest(dispute), env);
  assert.equal(retried.status, 200);
  assert.equal((await retried.json()).revoked, true);
  // A refund for a customer with no licence at all is held too, never acknowledged.
  const stranger = await worker.fetch(await stripeRequest(refundOf("z", { payment_intent: "pi_z", customer: "cus_unknown", amount: 79000, currency: "usd", created: nowSeconds() })), env);
  assert.equal(stranger.status, 500);
});

test("the customer match never guesses between two licences, and ignores other amounts", async () => {
  const { env } = await makeEnv();
  await worker.fetch(await stripeRequest(subCheckout(6)), env);
  await worker.fetch(await stripeRequest(subCheckout("6b", { customer: "cus_6" })), env);
  const refund = refundOf("f", { payment_intent: "pi_f", customer: "cus_6", amount: 79000, currency: "usd", created: nowSeconds() });
  const res = await worker.fetch(await stripeRequest(refund), env);
  assert.equal(res.status, 500);
  assert.match(env.LICENSES.json("evt:evt_rf_f").last_error, /fits 2 licences/);
  assert.doesNotMatch(await crlText(env), /cs_live_sub6/);
  // Wrong amount or currency: not this licence.
  const other = await makeEnv();
  await worker.fetch(await stripeRequest(subCheckout(7)), other.env);
  assert.equal((await worker.fetch(await stripeRequest(refundOf("g", { payment_intent: "pi_g", customer: "cus_7", amount: 7900, currency: "usd", created: nowSeconds() })), other.env)).status, 500);
  assert.equal((await worker.fetch(await stripeRequest(refundOf("h", { payment_intent: "pi_h", customer: "cus_7", amount: 79000, currency: "eur", created: nowSeconds() })), other.env)).status, 500);
  assert.notEqual(other.env.LICENSES.json("lic:cs_live_sub7").revoked, true);
});

test("the amount fallback is USD only", () => {
  assert.equal(tierFromSession({ metadata: {}, currency: "usd", amount_subtotal: 7900 }), "pro_monthly");
  assert.throws(() => tierFromSession({ id: "cs_eur", metadata: {}, currency: "eur", amount_subtotal: 7900, amount_total: 7900 }), /cannot determine/);
  assert.equal(tierFromSession({ metadata: { qector_tier: "pro_monthly" }, currency: "eur", amount_subtotal: 7300 }), "pro_monthly");
});
