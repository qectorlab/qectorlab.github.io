const SIGNATURE_TOLERANCE_SECONDS = 300;
const EVENT_TTL_SECONDS = 60 * 60 * 24 * 30;
const MAX_EMAIL_ATTEMPTS = 3;
const EMAIL_TIMEOUT_MS = 5000;

// These names are also written into the signed v2 token. PyPI 1.0.0 verifies
// the signature and expiry without requiring a network call.
const TIER_DURATION_DAYS = Object.freeze({
  evaluation: 60,
  commercial: 60,
  solo_annual: 366,
  solo_perpetual: null,
  startup: 366,
  professional: 366,
  enterprise: 366,
});

const SUPPORT_EMAIL = "admin@qector.store";
const DEFAULT_FROM = "QECTOR <licenses@qector.store>";

let cachedSigningKeyB64 = "";
let cachedSigningKeyPromise = null;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/stripe/webhook" && request.method === "POST") {
      return handleWebhook(request, env);
    }

    if (url.pathname === "/stripe/reconcile" && request.method === "POST") {
      return handleReconcile(request, env);
    }

    if (url.pathname === "/stripe/health" && request.method === "GET") {
      return handleHealth(env);
    }

    return json({ error: "not found" }, 404);
  },
};

async function handleReconcile(request, env) {
  if (!env.RECONCILE_TOKEN) {
    return json({ error: "reconciliation is not configured" }, 404);
  }

  const authorization = request.headers.get("authorization") || "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!timingSafeEqual(supplied, env.RECONCILE_TOKEN)) {
    return json({ error: "unauthorized" }, 401);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "valid JSON is required" }, 400);
  }
  const events = Array.isArray(body?.events) ? body.events : [];
  if (events.length === 0 || events.length > 20) {
    return json({ error: "events must contain between 1 and 20 items" }, 400);
  }

  const results = [];
  for (const event of events) {
    if (!event || !event.id || !event.type || event.livemode !== true) {
      results.push({ ok: false, error: "invalid live event" });
      continue;
    }

    const eventKey = `evt:${event.id}`;
    const previous = await readJson(env, eventKey);
    if (previous?.status === "completed") {
      results.push({ ok: true, duplicate: true, event_id: event.id });
      continue;
    }
    if (previous?.status === "processing") {
      const age = Date.now() - Date.parse(previous.updated_at || "");
      if (Number.isFinite(age) && age >= 0 && age < 5 * 60 * 1000) {
        results.push({ ok: false, event_id: event.id, error: "event is already being processed" });
        continue;
      }
    }

    await writeJson(env, eventKey, {
      status: "processing",
      event_id: event.id,
      event_type: event.type,
      updated_at: new Date().toISOString(),
    }, EVENT_TTL_SECONDS);

    try {
      const result = await processEvent(event, env);
      await writeJson(env, eventKey, {
        status: "completed",
        event_id: event.id,
        event_type: event.type,
        receipt_id: result.receipt_id || null,
        updated_at: new Date().toISOString(),
      }, EVENT_TTL_SECONDS);
      results.push({ ok: true, event_id: event.id, ...result });
    } catch (error) {
      const message = errorText(error);
      await writeJson(env, eventKey, {
        status: "pending",
        event_id: event.id,
        event_type: event.type,
        updated_at: new Date().toISOString(),
        last_error: message,
      }, EVENT_TTL_SECONDS);
      results.push({ ok: false, event_id: event.id, error: message });
    }
  }

  const ok = results.every((result) => result.ok);
  return json({ ok, results }, ok ? 200 : 502);
}

function handleHealth(env) {
  return json({
    ok: true,
    service: "qector-fulfilment",
    email_provider: emailProvider(env),
    live_mode: env.STRIPE_LIVEMODE !== "false",
  });
}

async function handleWebhook(request, env) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    console.error("[qector] STRIPE_WEBHOOK_SECRET is not configured");
    return json({ error: "server misconfigured" }, 500);
  }
  if (!env.LICENSES) {
    console.error("[qector] LICENSES KV binding is not configured");
    return json({ error: "server misconfigured" }, 500);
  }

  const raw = await request.text();
  const signature = request.headers.get("stripe-signature") || "";
  let event;
  try {
    event = await verifyStripeSignature(raw, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.warn("[qector] signature rejected:", error instanceof Error ? error.message : String(error));
    return json({ error: "signature verification failed" }, 400);
  }

  if (!event.id || !event.type) {
    return json({ error: "event id and type are required" }, 400);
  }

  // The endpoint is live-only. Returning 400 prevents an accidentally sent
  // test event from being treated as a real entitlement.
  if (env.STRIPE_LIVEMODE !== "false" && event.livemode !== true) {
    return json({ error: "live endpoint received a non-live event" }, 400);
  }

  const eventKey = `evt:${event.id}`;
  const previous = await readJson(env, eventKey);
  if (previous?.status === "completed") {
    return json({ received: true, duplicate: true });
  }
  if (previous?.status === "processing") {
    const age = Date.now() - Date.parse(previous.updated_at || "");
    if (Number.isFinite(age) && age >= 0 && age < 5 * 60 * 1000) {
      // Stripe retries a non-2xx response. This avoids acknowledging a
      // concurrent request before the first request has persisted its result.
      return json({ error: "event is already being processed" }, 409);
    }
  }

  await writeJson(env, eventKey, {
    status: "processing",
    event_id: event.id,
    event_type: event.type,
    updated_at: new Date().toISOString(),
  }, EVENT_TTL_SECONDS);

  try {
    const result = await processEvent(event, env);
    await writeJson(env, eventKey, {
      status: "completed",
      event_id: event.id,
      event_type: event.type,
      receipt_id: result.receipt_id || null,
      updated_at: new Date().toISOString(),
    }, EVENT_TTL_SECONDS);
    return json({ received: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await writeJson(env, eventKey, {
      status: "pending",
      event_id: event.id,
      event_type: event.type,
      updated_at: new Date().toISOString(),
      last_error: message.slice(0, 300),
    }, EVENT_TTL_SECONDS);
    console.error("[qector] fulfilment failed:", message);
    return json({ error: "fulfilment pending", retryable: true }, 500);
  }
}

async function processEvent(event, env) {
  switch (event.type) {
    case "checkout.session.completed":
      return processCheckoutSession(event, env);
    case "invoice.paid":
      return processRenewalInvoice(event, env);
    case "charge.refunded":
    case "charge.dispute.created":
    case "customer.subscription.deleted":
      return revokeEntitlement(event, env);
    default:
      console.log("[qector] ignoring event type:", event.type);
      return { ignored: event.type };
  }
}

async function processCheckoutSession(event, env) {
  const session = event.data?.object || {};
  if (session.payment_status !== "paid") {
    console.log(`[qector] session ${session.id || "unknown"} is not paid (${session.payment_status || "unknown"})`);
    return { issued: false, reason: session.payment_status || "not_paid", receipt_id: session.id || null };
  }
  if (!session.id) {
    throw new Error("checkout session id is missing");
  }

  const existing = await readJson(env, `lic:${session.id}`);
  const email = normalizeEmail(pickEmail(session) || existing?.email);
  const tier = existing?.tier || tierFromMetadata(session.metadata);
  const token = existing?.token || await signLicenseV2(session.id, email, tier, env);
  const record = makeRecord(existing, {
    receipt_id: session.id,
    email,
    tier,
    token,
    amount_total: numberOrNull(session.amount_total),
    amount_subtotal: numberOrNull(session.amount_subtotal),
    amount_discount: numberOrNull(session.total_details?.amount_discount),
    currency: session.currency || "usd",
    event_id: event.id,
    payment_intent: stringOrNull(session.payment_intent),
    invoice: stringOrNull(session.invoice),
    payment_link: stringOrNull(session.payment_link),
    billing_url: stringOrNull(session.receipt_url),
  });

  await persistRecord(env, record);
  const delivered = await deliverCustomerEmails(record, session, env);
  console.log(`[qector] fulfilled receipt=${record.receipt_id} tier=${record.tier}`);
  return {
    issued: true,
    license_email: delivered.license_email_status,
    billing_email: delivered.billing_email_status,
    receipt_id: record.receipt_id,
  };
}

async function processRenewalInvoice(event, env) {
  const invoice = event.data?.object || {};
  if (invoice.billing_reason !== "subscription_cycle") {
    return { ignored: invoice.billing_reason || "invoice", receipt_id: invoice.id || null };
  }
  if (!invoice.id) {
    throw new Error("renewal invoice id is missing");
  }

  const existing = await readJson(env, `lic:${invoice.id}`);
  const email = normalizeEmail(invoice.customer_email || existing?.email);
  const tier = existing?.tier || tierFromMetadata(invoice.metadata) || "solo_annual";
  const token = existing?.token || await signLicenseV2(invoice.id, email, tier, env);
  const record = makeRecord(existing, {
    receipt_id: invoice.id,
    email,
    tier,
    token,
    amount_total: numberOrNull(invoice.amount_paid),
    amount_subtotal: numberOrNull(invoice.subtotal),
    amount_discount: numberOrNull(invoice.total_discount_amounts?.[0]?.amount),
    currency: invoice.currency || "usd",
    event_id: event.id,
    invoice: invoice.id,
    billing_url: stringOrNull(invoice.hosted_invoice_url),
  });

  await persistRecord(env, record);
  const delivered = await deliverCustomerEmails(record, invoice, env);
  return {
    issued: true,
    renewal: true,
    license_email: delivered.license_email_status,
    billing_email: delivered.billing_email_status,
    receipt_id: record.receipt_id,
  };
}

async function revokeEntitlement(event, env) {
  const object = event.data?.object || {};
  const identifiers = [object.id, object.payment_intent, object.charge, object.subscription]
    .filter((value) => typeof value === "string" && value.length > 0);
  if (identifiers.length === 0) {
    return { revoked: false };
  }

  for (const identifier of identifiers) {
    await writeJson(env, `revoked:${identifier}`, {
      reason: event.type,
      at: new Date().toISOString(),
    });
  }
  console.log(`[qector] revoked ${identifiers[0]} (${event.type})`);
  return { revoked: true, receipt_id: identifiers[0] };
}

function makeRecord(existing, values) {
  return {
    ...(existing || {}),
    ...values,
    issued_at: existing?.issued_at || new Date().toISOString(),
    license_email_status: existing?.license_email_status || "pending",
    billing_email_status: existing?.billing_email_status || "pending",
    license_email_attempts: Number(existing?.license_email_attempts || 0),
    billing_email_attempts: Number(existing?.billing_email_attempts || 0),
  };
}

async function persistRecord(env, record) {
  await writeJson(env, `lic:${record.receipt_id}`, record);

  if (record.payment_intent) {
    await writeJson(env, `pi:${record.payment_intent}`, { receipt_id: record.receipt_id });
  }
  if (record.invoice) {
    await writeJson(env, `invoice:${record.invoice}`, { receipt_id: record.receipt_id });
  }

  const mailKey = `bymail:${record.email}`;
  const prior = await readJson(env, mailKey);
  const receipts = Array.isArray(prior) ? prior : [];
  if (!receipts.includes(record.receipt_id)) receipts.push(record.receipt_id);
  await writeJson(env, mailKey, receipts);
}

async function deliverCustomerEmails(record, source, env) {
  const messages = buildCustomerMessages(record, source);
  const pending = messages.filter(({ kind }) => record[`${kind}_email_status`] !== "sent");
  if (pending.length === 0) return record;

  const results = await Promise.allSettled(
    pending.map(({ kind, message }) => sendWithRetry(message, `${kind}:${record.receipt_id}`, env))
  );
  const next = { ...record };
  const failures = [];

  results.forEach((result, index) => {
    const kind = pending[index].kind;
    const attemptsKey = `${kind}_email_attempts`;
    next[attemptsKey] = Number(next[attemptsKey] || 0) + (result.status === "fulfilled" ? result.value.attempts : MAX_EMAIL_ATTEMPTS);
    if (result.status === "fulfilled") {
      next[`${kind}_email_status`] = "sent";
      next[`${kind}_email_sent_at`] = new Date().toISOString();
      next[`${kind}_email_provider`] = result.value.provider;
      next[`${kind}_email_message_id`] = result.value.message_id || null;
      delete next[`${kind}_email_last_error`];
    } else {
      next[`${kind}_email_status`] = "pending";
      next[`${kind}_email_last_error`] = errorText(result.reason);
      failures.push(kind);
    }
  });

  // Persist each successful leg before reporting failure for the other leg.
  // A Stripe retry then sends only the missing message.
  await persistRecord(env, next);
  if (failures.length > 0) {
    throw new Error(`email delivery pending for: ${failures.join(", ")}`);
  }
  return next;
}

function buildCustomerMessages(record, source) {
  const licenseText = [
    "Your QECTOR Decoder v3 license is ready.",
    "",
    `Tier: ${record.tier}`,
    `Stripe reference: ${record.receipt_id}`,
    "",
    "License token:",
    "",
    record.token,
    "",
    "Install the live package:",
    "",
    "  python -m pip install --upgrade qector-decoder-v3==1.0.0",
    "",
    "Activate it in a shell:",
    `  export QECTOR_LICENSE=\"${record.token}\"`,
    `  export QECTOR_LICENSE_KEY=\"${record.token}\"`,
    "",
    "Windows PowerShell:",
    `  $env:QECTOR_LICENSE = \"${record.token}\"`,
    `  $env:QECTOR_LICENSE_KEY = \"${record.token}\"`,
    "",
    "Verify offline:",
    "  python -c \"import qector_decoder_v3 as q; print(q._is_license_active())\"",
    "",
    "The token is signed for this checkout email and is verified offline by qector-decoder-v3 1.0.0.",
    `Questions: ${SUPPORT_EMAIL}`,
  ].join("\n");

  const billing = billingSummary(record, source);
  const billingText = [
    "QECTOR payment confirmation",
    "",
    `Stripe reference: ${record.receipt_id}`,
    `Product tier: ${record.tier}`,
    `Amount paid: ${billing.total}`,
    billing.subtotal ? `Listed amount: ${billing.subtotal}` : null,
    billing.discount ? `Coupon discount: ${billing.discount}` : null,
    billing.url ? `Receipt or invoice: ${billing.url}` : null,
    "",
    "Your license delivery email contains the signed token and activation instructions.",
    `Support: ${SUPPORT_EMAIL}`,
  ].filter(Boolean).join("\n");

  return [
    {
      kind: "license",
      message: {
        to: record.email,
        subject: `Your QECTOR Decoder v3 license (${record.tier})`,
        text: licenseText,
        html: `<p>Your QECTOR Decoder v3 license is ready.</p><p><strong>Tier:</strong> ${escapeHtml(record.tier)}<br><strong>Stripe reference:</strong> ${escapeHtml(record.receipt_id)}</p><p><strong>License token:</strong></p><p><code>${escapeHtml(record.token)}</code></p><p>Install the live package with <code>python -m pip install --upgrade qector-decoder-v3==1.0.0</code>. Set both <code>QECTOR_LICENSE</code> and <code>QECTOR_LICENSE_KEY</code> to the token. The token verifies offline.</p><p>Questions: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>`,
      },
    },
    {
      kind: "billing",
      message: {
        to: record.email,
        subject: `QECTOR payment confirmation (${record.receipt_id})`,
        text: billingText,
        html: `<p>QECTOR payment confirmation</p><p><strong>Stripe reference:</strong> ${escapeHtml(record.receipt_id)}<br><strong>Product tier:</strong> ${escapeHtml(record.tier)}<br><strong>Amount paid:</strong> ${escapeHtml(billing.total)}</p>${billing.subtotal ? `<p><strong>Listed amount:</strong> ${escapeHtml(billing.subtotal)}<br><strong>Coupon discount:</strong> ${escapeHtml(billing.discount || "included")}</p>` : ""}${billing.url ? `<p><a href="${escapeHtml(billing.url)}">Open your Stripe receipt or invoice</a></p>` : ""}<p>Your separate license delivery email contains the signed token and activation instructions.</p><p>Support: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>`,
      },
    },
  ];
}

function billingSummary(record, source) {
  const currency = String(record.currency || source.currency || "usd").toUpperCase();
  const total = record.amount_total != null ? record.amount_total : numberOrNull(source.amount_total);
  const subtotal = record.amount_subtotal != null ? record.amount_subtotal : numberOrNull(source.amount_subtotal);
  const discount = record.amount_discount != null ? record.amount_discount : numberOrNull(source.total_details?.amount_discount);
  return {
    total: formatMoney(total, currency),
    subtotal: subtotal != null ? formatMoney(subtotal, currency) : null,
    discount: discount != null ? formatMoney(discount, currency) : null,
    url: record.billing_url || source.receipt_url || source.hosted_invoice_url || null,
  };
}

async function sendWithRetry(message, deliveryKey, env) {
  const providers = emailProviders(env);
  if (providers.length === 0) {
    throw new Error("no email provider configured");
  }

  let lastError;
  for (const provider of providers) {
    for (let attempt = 1; attempt <= MAX_EMAIL_ATTEMPTS; attempt += 1) {
      try {
        const result = provider === "cloudflare"
          ? await sendViaCloudflareEmail(message, deliveryKey, env)
          : await sendViaResend(message, deliveryKey, env);
        return { ...result, provider, attempts: attempt };
      } catch (error) {
        lastError = error;
        if (attempt < MAX_EMAIL_ATTEMPTS) await sleep(250 * 2 ** (attempt - 1));
      }
    }
  }
  throw lastError || new Error("email provider failed");
}

async function sendViaCloudflareEmail(message, deliveryKey, env) {
  const result = await env.EMAIL.send({
    ...message,
    from: env.LICENSE_FROM_EMAIL || DEFAULT_FROM,
    replyTo: SUPPORT_EMAIL,
    headers: { "X-QECTOR-Delivery-Key": deliveryKey },
  });
  return { message_id: result?.messageId || null };
}

async function sendViaResend(message, deliveryKey, env) {
  const response = await fetchWithTimeout("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": deliveryKey,
    },
    body: JSON.stringify({
      from: env.LICENSE_FROM_EMAIL || DEFAULT_FROM,
      to: [message.to],
      reply_to: SUPPORT_EMAIL,
      subject: message.subject,
      text: message.text,
      html: message.html,
      headers: { "X-QECTOR-Delivery-Key": deliveryKey },
    }),
  });
  if (!response.ok) {
    throw new Error(`Resend returned HTTP ${response.status}`);
  }
  const body = await response.json();
  return { message_id: body.id || null };
}

function emailProvider(env) {
  return emailProviders(env).join("+") || "unconfigured";
}

function emailProviders(env) {
  const providers = [];
  if (env.EMAIL && typeof env.EMAIL.send === "function") providers.push("cloudflare");
  if (env.RESEND_API_KEY) providers.push("resend");
  return providers;
}

async function verifyStripeSignature(payload, header, secret) {
  const values = parseSignatureHeader(header);
  const timestamp = Number(values.t);
  if (!Number.isFinite(timestamp) || Math.abs(Math.floor(Date.now() / 1000) - timestamp) > SIGNATURE_TOLERANCE_SECONDS) {
    throw new Error("timestamp outside tolerance");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expected = toHex(new Uint8Array(mac));
  if (!values.v1.some((candidate) => timingSafeEqual(expected, candidate))) {
    throw new Error("signature mismatch");
  }
  return JSON.parse(payload);
}

function parseSignatureHeader(header) {
  const values = { t: "", v1: [] };
  for (const item of header.split(",")) {
    const separator = item.indexOf("=");
    if (separator <= 0) continue;
    const name = item.slice(0, separator).trim();
    const value = item.slice(separator + 1).trim();
    if (name === "t") values.t = value;
    if (name === "v1") values.v1.push(value);
  }
  if (!values.t || values.v1.length === 0) throw new Error("malformed stripe-signature header");
  return values;
}

async function signLicenseV2(receiptId, email, tier, env, nowMs = Date.now()) {
  const cleanEmail = normalizeEmail(email);
  const normalizedTier = normalizeTier(tier);
  const claims = { email: cleanEmail, rid: receiptId, tier: normalizedTier };
  const days = TIER_DURATION_DAYS[normalizedTier];
  if (days != null) claims.exp = Math.floor(nowMs / 1000) + days * 86400;
  const ordered = {};
  for (const key of Object.keys(claims).sort()) ordered[key] = claims[key];
  const claimsB64 = b64url(new TextEncoder().encode(JSON.stringify(ordered)));
  const signature = await crypto.subtle.sign("Ed25519", await signingKey(env), new TextEncoder().encode(claimsB64));
  return `v2.${claimsB64}.${b64url(new Uint8Array(signature))}`;
}

async function signingKey(env) {
  const encoded = String(env.QECTOR_LICENSE_PRIVATE_KEY_B64 || "");
  if (!encoded) throw new Error("QECTOR_LICENSE_PRIVATE_KEY_B64 is not configured");
  if (!cachedSigningKeyPromise || cachedSigningKeyB64 !== encoded) {
    cachedSigningKeyB64 = encoded;
    cachedSigningKeyPromise = (async () => {
      const pem = new TextDecoder().decode(b64ToBytes(encoded));
      const der = b64ToBytes(pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, "").replace(/\s+/g, ""));
      return crypto.subtle.importKey("pkcs8", der, { name: "Ed25519" }, false, ["sign"]);
    })().catch((error) => {
      cachedSigningKeyPromise = null;
      cachedSigningKeyB64 = "";
      throw error;
    });
  }
  return cachedSigningKeyPromise;
}

function pickEmail(object) {
  return object.customer_email || object.customer_details?.email || object.metadata?.customer_email || "";
}

function tierFromMetadata(metadata) {
  return normalizeTier(metadata?.license_tier || metadata?.qector_tier || "evaluation");
}

function normalizeTier(value) {
  const raw = String(value || "evaluation").trim().toLowerCase().replace(/[\s/-]+/g, "_");
  return Object.prototype.hasOwnProperty.call(TIER_DURATION_DAYS, raw) ? raw : "evaluation";
}

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("customer email is missing or invalid");
  }
  return email;
}

async function readJson(env, key) {
  const value = await env.LICENSES.get(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function writeJson(env, key, value, expirationTtl) {
  const options = expirationTtl ? { expirationTtl } : undefined;
  await env.LICENSES.put(key, JSON.stringify(value), options);
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("email request timeout"), EMAIL_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stringOrNull(value) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function numberOrNull(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function formatMoney(cents, currency) {
  if (cents == null) return "not available";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
  } catch {
    return `${currency} ${(cents / 100).toFixed(2)}`;
  }
}

function errorText(error) {
  return (error instanceof Error ? error.message : String(error)).slice(0, 300);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

function b64ToBytes(value) {
  const binary = atob(String(value).replace(/\s+/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function b64url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function toHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

export {
  handleWebhook,
  normalizeEmail,
  signLicenseV2,
  verifyStripeSignature,
};
