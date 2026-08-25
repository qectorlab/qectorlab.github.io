import assert from "node:assert/strict";
import { test } from "node:test";
import { webcrypto } from "node:crypto";
import worker from "../src/index.js";

if (!globalThis.crypto) globalThis.crypto = webcrypto;

class MemoryKV {
  constructor() {
    this.values = new Map();
  }

  async get(key) {
    return this.values.get(key) ?? null;
  }

  async put(key, value) {
    this.values.set(key, value);
  }

  async delete(key) {
    this.values.delete(key);
  }
}

async function fixture() {
  const keyPair = await crypto.subtle.generateKey(
    { name: "Ed25519", namedCurve: "Ed25519" },
    true,
    ["sign", "verify"],
  );
  const pkcs8 = new Uint8Array(await crypto.subtle.exportKey("pkcs8", keyPair.privateKey));
  const privateKey = Buffer.from(pkcs8).toString("base64");
  const kv = new MemoryKV();
  const messages = [];
  const env = {
    LICENSES: kv,
    QECTOR_LICENSE_PRIVATE_KEY_B64: Buffer.from(
      `-----BEGIN PRIVATE KEY-----\n${Buffer.from(pkcs8).toString("base64")}\n-----END PRIVATE KEY-----`,
    ).toString("base64"),
    STRIPE_WEBHOOK_SECRET: "whsec_test_secret",
    STRIPE_LIVEMODE: "true",
    LICENSE_TOKEN_VERSION: "v2",
    LICENSE_FROM_EMAIL: "QECTOR <licenses@example.test>",
    EMAIL: {
      async send(message) {
        messages.push(message);
        return { messageId: `msg_${messages.length}` };
      },
    },
  };
  return { env, kv, messages, keyPair, privateKey };
}

async function signedRequest(event, secret) {
  const body = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1000);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${body}`));
  const signature = Buffer.from(mac).toString("hex");
  return new Request("https://qector.store/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": `t=${timestamp},v1=${signature}` },
    body,
  });
}

function eventFor(id = "cs_live_test") {
  return {
    id: "evt_live_test",
    livemode: true,
    type: "checkout.session.completed",
    data: {
      object: {
        id,
        payment_status: "paid",
        customer_details: { email: "buyer@example.com" },
        metadata: { qector_tier: "evaluation" },
        amount_subtotal: 49900,
        amount_total: 0,
        currency: "usd",
        total_details: { amount_discount: 49900 },
      },
    },
  };
}

test("fulfills a sale with two independently tracked emails", async () => {
  const { env, kv, messages, keyPair } = await fixture();
  const event = eventFor();
  const response = await worker.fetch(await signedRequest(event, env.STRIPE_WEBHOOK_SECRET), env);
  assert.equal(response.status, 200);
  assert.equal(messages.length, 2);

  const record = JSON.parse(kv.values.get("lic:cs_live_test"));
  assert.equal(record.license_email_status, "sent");
  assert.equal(record.billing_email_status, "sent");
  assert.match(record.token, /^v2\.[^.]+\.[^.]+$/);

  const claimsPart = record.token.split(".")[1];
  const signaturePart = record.token.split(".")[2];
  const claims = JSON.parse(Buffer.from(claimsPart, "base64url").toString("utf8"));
  const signature = Buffer.from(signaturePart, "base64url");
  assert.equal(
    await crypto.subtle.verify("Ed25519", keyPair.publicKey, signature, new TextEncoder().encode(claimsPart)),
    true,
  );
  assert.equal(claims.email, "buyer@example.com");

  const duplicate = await worker.fetch(await signedRequest(event, env.STRIPE_WEBHOOK_SECRET), env);
  assert.equal(duplicate.status, 200);
  assert.equal((await duplicate.json()).duplicate, true);
  assert.equal(messages.length, 2);
});

test("does not acknowledge an unconfigured provider and retries only pending work", async () => {
  const { env, kv, messages } = await fixture();
  delete env.EMAIL;
  const event = eventFor("cs_live_pending");
  const first = await worker.fetch(await signedRequest(event, env.STRIPE_WEBHOOK_SECRET), env);
  assert.equal(first.status, 500);
  assert.equal(messages.length, 0);

  const pending = JSON.parse(kv.values.get("lic:cs_live_pending"));
  assert.equal(pending.license_email_status, "pending");
  assert.equal(pending.billing_email_status, "pending");

  env.EMAIL = {
    async send(message) {
      messages.push(message);
      return { messageId: `retry_${messages.length}` };
    },
  };
  const retry = await worker.fetch(await signedRequest(event, env.STRIPE_WEBHOOK_SECRET), env);
  assert.equal(retry.status, 200);
  assert.equal(messages.length, 2);
});

test("falls back to Resend when the Cloudflare destination is not allowed", async () => {
  const { env, messages } = await fixture();
  let cloudflareAttempts = 0;
  env.EMAIL = {
    async send() {
      cloudflareAttempts += 1;
      throw new Error("destination address is not a verified address");
    },
  };
  env.RESEND_API_KEY = "test_resend_key";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers["Idempotency-Key"].includes(":"), true);
    return new Response(JSON.stringify({ id: `re_${messages.length + 1}` }), { status: 200 });
  };
  try {
    const response = await worker.fetch(
      await signedRequest(eventFor("cs_live_resend_fallback"), env.STRIPE_WEBHOOK_SECRET),
      env,
    );
    assert.equal(response.status, 200);
    assert.equal(cloudflareAttempts, 6);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects unsigned or stale webhook requests", async () => {
  const { env } = await fixture();
  const unsigned = await worker.fetch(new Request("https://qector.store/stripe/webhook", {
    method: "POST",
    body: JSON.stringify(eventFor("cs_unsigned")),
  }), env);
  assert.equal(unsigned.status, 400);
});
