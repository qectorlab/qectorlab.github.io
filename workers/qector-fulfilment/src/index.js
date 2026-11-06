// qector-fulfilment — Stripe → Ed25519 licence tokens for QECTOR Decoder v3.
//
// 2.0 (2026-11-05): rewritten from the deployed bundle with the audit fixes
// and the 2026 price ladder.
//
//   * The tier comes from Checkout metadata first (`qector_tier`), then from a
//     price-id table, then from the PRE-TAX `amount_subtotal`. The old code read
//     `amount_total` (tax-inclusive, net of coupons) and mapped amounts to the
//     canonical tier "pro", which is not a product tier, so every Solo, Startup
//     or Professional sale without metadata got a 60-day evaluation token.
//   * Renewals take the tier recorded at checkout for that subscription
//     (`sub:<id>`), then subscription/price metadata; never a silent fallback
//     to "evaluation".
//   * Manually created invoices (credited upgrades) with `qector_tier` metadata
//     issue a licence.
//   * Refunds, disputes and cancellations revoke the licence's receipt id (the
//     token's `rid`, which the decoder's offline CRL matches) and publish it at
//     GET /stripe/revoked.txt.
//   * POST /stripe/trial issues a 14-day commercial trial token by e-mail, one
//     per address per 365 days, with per-IP limits and optional Turnstile.
//   * Customer e-mails no longer pin a superseded package version.
//
// 2.1 (2026-11-06): licence workflow hardening.
//
//   * Delayed payment methods: `checkout.session.async_payment_succeeded`
//     issues the licence (the first `completed` event arrives as "unpaid").
//   * Only a FULL refund revokes; a partial refund (tax fix, goodwill credit)
//     keeps the licence. Disputes still revoke.
//   * A cancelled subscription is NOT revoked: the token already expires at the
//     end of the paid period (+14 days grace), as the refund policy promises.
//   * Key guard: every token is verified against the decoder's embedded public
//     key before it is stored or e-mailed. A mismatched signing key fails the
//     event (Stripe retries) instead of mailing tokens that never verify.
//     /stripe/health reports `key_matches_decoder`.
//   * Customer e-mails pin >=1.0.1 (1.0.0 refused GPU for Pro) and plan names
//     carry no user counts.
//
// Token format is unchanged: v2.{base64url(JSON claims)}.{base64url(Ed25519 sig
// over the claims segment)}; claims = {email, exp?, rid, tier} with keys sorted.
// `tier` is always one the decoder understands (evaluation, pro, enterprise),
// so tokens verify on every released decoder (1.0.0 and later).

const SIGNATURE_TOLERANCE_SECONDS = 300;
const EVENT_TTL_SECONDS = 60 * 60 * 24 * 30;
const MAX_EMAIL_ATTEMPTS = 3;
const EMAIL_TIMEOUT_MS = 5000;
const DAY = 86400;

// Product tiers sold (plus legacy names still found in old payment links and
// tokens). `claim` is what goes into the token; `days` is the validity
// (null = perpetual). Recurring tiers get 14 days of grace past the period so a
// late renewal never locks a paying customer out.
export const TIERS = Object.freeze({
  trial: { claim: "pro", days: 14, label: "Commercial Trial (14 days)" },
  evaluation: { claim: "evaluation", days: 60, label: "Commercial Evaluation (60 days)" },
  pilot: { claim: "pro", days: 60, label: "Pilot (60 days)" },
  pro_monthly: { claim: "pro", days: 31 + 14, label: "Pro (monthly)" },
  pro_annual: { claim: "pro", days: 366 + 14, label: "Pro (annual)" },
  pro_perpetual: { claim: "pro", days: null, label: "Pro Perpetual (1.x)" },
  team: { claim: "pro", days: 366 + 14, label: "Team (annual)" },
  lab: { claim: "enterprise", days: 366 + 14, label: "Lab (annual)" },
  enterprise: { claim: "enterprise", days: 366 + 14, label: "Enterprise" },
  // Legacy names (pre-2026 links, renewals of existing subscriptions).
  commercial: { claim: "evaluation", days: 60, label: "Commercial Evaluation (60 days)" },
  solo_annual: { claim: "pro", days: 366 + 14, label: "Solo (annual)" },
  solo_perpetual: { claim: "pro", days: null, label: "Solo Perpetual" },
  startup: { claim: "pro", days: 366 + 14, label: "Startup (annual)" },
  // Legacy Professional ($11,500/yr) paid more than Lab: same entitlement.
  professional: { claim: "enterprise", days: 366 + 14, label: "Professional (annual)" },
});

// Pre-tax list prices (cents, USD) → product tier. Used only when a checkout
// carries no `qector_tier` metadata and its price id is not in PRICE_TIERS.
export const AMOUNT_TIERS = Object.freeze({
  7900: "pro_monthly",
  79000: "pro_annual",
  199000: "pro_perpetual",
  390000: "team",
  990000: "lab",
  150000: "pilot",
  49900: "evaluation",
  129900: "solo_annual",
  329900: "solo_perpetual",
  449900: "startup",
  1150000: "professional",
  2800000: "enterprise",
});

const SUPPORT_EMAIL = "admin@qector.store";
const DEFAULT_FROM = "QECTOR <licenses@qector.store>";
const SITE = "https://qector.store";
const TRIAL_PER_IP_PER_DAY = 3;
const TRIAL_COOLDOWN_SECONDS = 365 * DAY;

const API_SECURITY_HEADERS = {
  "cache-control": "no-store",
  "content-security-policy": "default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "origin-agent-cluster": "?1",
  "permissions-policy":
    "accelerometer=(), ambient-light-sensor=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(), document-domain=(), encrypted-media=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), xr-spatial-tracking=()",
  "referrer-policy": "no-referrer",
  "strict-transport-security": "max-age=31536000; includeSubDomains; preload",
  "x-content-type-options": "nosniff",
  "x-dns-prefetch-control": "off",
  "x-frame-options": "DENY",
  "x-permitted-cross-domain-policies": "none",
  "x-robots-tag": "noindex, nofollow, noarchive",
};

let cachedSigningKeyB64 = "";
let cachedSigningKeyPromise = null;
let cachedGmailAccessToken = "";
let cachedGmailExpiry = 0;
let cachedGmailPromise = null;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;
    if (url.pathname === "/stripe/webhook" && method === "POST") return handleWebhook(request, env);
    if (url.pathname === "/stripe/reconcile" && method === "POST") return handleReconcile(request, env);
    if (url.pathname === "/stripe/trial" && method === "POST") return handleTrial(request, env);
    if (url.pathname === "/stripe/revoked.txt" && (method === "GET" || method === "HEAD")) return handleRevokedList(env, method === "HEAD");
    if (url.pathname === "/stripe/health" && (method === "GET" || method === "HEAD")) return handleHealth(env, method === "HEAD");
    return json({ error: "not found" }, 404);
  },
};

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

async function handleReconcile(request, env) {
  if (!env.RECONCILE_TOKEN) return json({ error: "reconciliation is not configured" }, 404);
  const authorization = request.headers.get("authorization") || "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!timingSafeEqual(supplied, env.RECONCILE_TOKEN)) return json({ error: "unauthorized" }, 401);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "valid JSON is required" }, 400);
  }
  const events = Array.isArray(body?.events) ? body.events : [];
  if (events.length === 0 || events.length > 20) return json({ error: "events must contain between 1 and 20 items" }, 400);
  const results = [];
  for (const event of events) {
    if (!event || !event.id || !event.type || (liveMode(env) && event.livemode !== true)) {
      results.push({ ok: false, error: "invalid live event" });
      continue;
    }
    const outcome = await runEventOnce(event, env);
    results.push({ ok: outcome.ok, event_id: event.id, ...outcome.body });
  }
  const ok = results.every((r) => r.ok);
  return json({ ok, results }, ok ? 200 : 502);
}

async function handleHealth(env, head = false) {
  return json(
    {
      ok: true,
      service: "qector-fulfilment",
      version: "2.1",
      email_provider: emailProviders(env).join("+") || "unconfigured",
      live_mode: liveMode(env),
      signing_key: Boolean(env.QECTOR_LICENSE_PRIVATE_KEY_B64),
      key_matches_decoder: await keyMatchesDecoder(env),
      trials: Boolean(env.QECTOR_LICENSE_PRIVATE_KEY_B64) && env.TRIALS_ENABLED !== "false",
    },
    200,
    head,
  );
}

async function handleRevokedList(env, head = false) {
  const list = (await readJson(env, "crl")) || [];
  const body = ["# QECTOR licence revocation list (receipt ids, one per line)", `# generated ${new Date().toISOString()}`, ...list].join("\n") + "\n";
  return new Response(head ? null : body, {
    status: 200,
    headers: { ...API_SECURITY_HEADERS, "cache-control": "public, max-age=300", "content-type": "text/plain; charset=utf-8" },
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
  let event;
  try {
    event = await verifyStripeSignature(raw, request.headers.get("stripe-signature") || "", env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.warn("[qector] signature rejected:", errorText(error));
    return json({ error: "signature verification failed" }, 400);
  }
  if (!event.id || !event.type) return json({ error: "event id and type are required" }, 400);
  if (liveMode(env) && event.livemode !== true) return json({ error: "live endpoint received a non-live event" }, 400);
  const outcome = await runEventOnce(event, env);
  if (outcome.busy) return json({ error: "event is already being processed" }, 409);
  if (!outcome.ok) return json({ error: "fulfilment pending", retryable: true }, 500);
  return json({ received: true, ...outcome.body });
}

// Idempotent event execution shared by the webhook and reconciliation.
async function runEventOnce(event, env) {
  const eventKey = `evt:${event.id}`;
  const previous = await readJson(env, eventKey);
  if (previous?.status === "completed") return { ok: true, body: { duplicate: true } };
  if (previous?.status === "processing") {
    const age = Date.now() - Date.parse(previous.updated_at || "");
    if (Number.isFinite(age) && age >= 0 && age < 5 * 60 * 1000) return { ok: false, busy: true, body: { error: "event is already being processed" } };
  }
  const stamp = { event_id: event.id, event_type: event.type };
  await writeJson(env, eventKey, { status: "processing", ...stamp, updated_at: nowIso() }, EVENT_TTL_SECONDS);
  try {
    const result = await processEvent(event, env);
    await writeJson(env, eventKey, { status: "completed", ...stamp, receipt_id: result.receipt_id || null, updated_at: nowIso() }, EVENT_TTL_SECONDS);
    return { ok: true, body: result };
  } catch (error) {
    const message = errorText(error);
    await writeJson(env, eventKey, { status: "pending", ...stamp, updated_at: nowIso(), last_error: message }, EVENT_TTL_SECONDS);
    console.error("[qector] fulfilment failed:", message);
    return { ok: false, body: { error: message } };
  }
}

async function handleTrial(request, env) {
  if (!env.LICENSES || !env.QECTOR_LICENSE_PRIVATE_KEY_B64 || env.TRIALS_ENABLED === "false") {
    return json({ error: "trials are not available right now" }, 503);
  }
  const origin = request.headers.get("origin") || "";
  if (origin && !allowedOrigin(origin, env)) return json({ error: "forbidden origin" }, 403);
  let body = {};
  try {
    const type = request.headers.get("content-type") || "";
    if (type.includes("application/json")) body = await request.json();
    else body = Object.fromEntries((await request.formData()).entries());
  } catch {
    return json({ error: "send a JSON or form body" }, 400);
  }
  // Honeypot field: real browsers leave it empty.
  if (body.website) return json({ ok: true, message: "Check your inbox for your trial token." }, 202, false, origin, env);
  if (body.accept_terms !== true && body.accept_terms !== "on" && body.accept_terms !== "true") {
    return json({ error: "please accept the licence terms" }, 400, false, origin, env);
  }
  let email;
  try {
    email = normalizeEmail(body.email);
  } catch {
    return json({ error: "a valid work e-mail is required" }, 400, false, origin, env);
  }
  if (env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(String(body["cf-turnstile-response"] || ""), request.headers.get("cf-connecting-ip") || "", env);
    if (!ok) return json({ error: "verification failed, please retry" }, 400, false, origin, env);
  }
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const ipKey = `trialip:${ip}:${new Date().toISOString().slice(0, 10)}`;
  const ipCount = Number((await env.LICENSES.get(ipKey)) || 0);
  if (ipCount >= TRIAL_PER_IP_PER_DAY) return json({ error: "too many trial requests today from this network" }, 429, false, origin, env);
  await env.LICENSES.put(ipKey, String(ipCount + 1), { expirationTtl: 2 * DAY });

  const emailKey = `trial:${email}`;
  const prior = await readJson(env, emailKey);
  // Same response either way, so the endpoint does not reveal who has a trial.
  const accepted = { ok: true, message: "Check your inbox for your trial token. It arrives within a few minutes." };
  if (prior) return json(accepted, 202, false, origin, env);

  const receiptId = `trial_${crypto.randomUUID().replace(/-/g, "")}`;
  const token = await signLicenseV2(receiptId, email, "trial", env);
  const record = makeRecord(null, {
    receipt_id: receiptId,
    email,
    product_tier: "trial",
    tier: TIERS.trial.claim,
    token,
    expires_at: expiryIso("trial"),
    amount_total: 0,
    currency: "usd",
    source: "trial",
  });
  await persistRecord(env, record);
  await writeJson(env, emailKey, { receipt_id: receiptId, at: nowIso() }, TRIAL_COOLDOWN_SECONDS);
  try {
    await deliverCustomerEmails(record, null, env, { billing: false });
  } catch (error) {
    // The record is kept; reconciliation or a support request can resend.
    console.error("[qector] trial e-mail failed:", errorText(error));
  }
  return json(accepted, 202, false, origin, env);
}

// ---------------------------------------------------------------------------
// Stripe events
// ---------------------------------------------------------------------------

async function processEvent(event, env) {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      return processCheckoutSession(event, env);
    case "invoice.paid":
      return processInvoice(event, env);
    case "charge.refunded":
      // Partial refunds (tax corrections, goodwill credits) keep the licence.
      if (event.data?.object?.refunded !== true) {
        return { revoked: false, reason: "partial_refund", charge: event.data?.object?.id || null };
      }
      return revokeEntitlement(event, env);
    case "charge.dispute.created":
      return revokeEntitlement(event, env);
    case "customer.subscription.deleted":
      return markSubscriptionEnded(event, env);
    default:
      return { ignored: event.type };
  }
}

async function processCheckoutSession(event, env) {
  const session = event.data?.object || {};
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    return { issued: false, reason: session.payment_status || "not_paid", receipt_id: session.id || null };
  }
  if (!session.id) throw new Error("checkout session id is missing");
  const existing = await readJson(env, `lic:${session.id}`);
  const email = normalizeEmail(pickEmail(session) || existing?.email);
  const productTier = existing?.product_tier || tierFromSession(session, env);
  const token = existing?.token || (await signLicenseV2(session.id, email, productTier, env));
  const record = makeRecord(existing, {
    receipt_id: session.id,
    email,
    product_tier: productTier,
    tier: TIERS[productTier].claim,
    token,
    expires_at: existing?.expires_at ?? expiryIso(productTier),
    amount_total: numberOrNull(session.amount_total),
    amount_subtotal: numberOrNull(session.amount_subtotal),
    amount_discount: numberOrNull(session.total_details?.amount_discount),
    currency: session.currency || "usd",
    event_id: event.id,
    payment_intent: stringOrNull(session.payment_intent),
    invoice: stringOrNull(session.invoice),
    subscription: stringOrNull(session.subscription),
    payment_link: stringOrNull(session.payment_link),
    billing_url: stringOrNull(session.receipt_url),
  });
  await persistRecord(env, record);
  const delivered = await deliverCustomerEmails(record, session, env);
  console.log(`[qector] fulfilled receipt=${record.receipt_id} tier=${productTier}`);
  return { issued: true, tier: productTier, license_email: delivered.license_email_status, billing_email: delivered.billing_email_status, receipt_id: record.receipt_id };
}

async function processInvoice(event, env) {
  const invoice = event.data?.object || {};
  const reason = invoice.billing_reason;
  // First subscription invoice: the checkout session already issued the token.
  if (reason === "subscription_create") return { ignored: reason, receipt_id: invoice.id || null };
  let productTier = null;
  if (reason === "subscription_cycle" || reason === "subscription_update") {
    productTier = await tierForSubscription(invoice, env);
    if (!productTier) throw new Error(`renewal ${invoice.id} has no recorded tier; set qector_tier on the subscription and reconcile`);
  } else if (reason === "manual") {
    productTier = tierFromMetadataOrNull(invoice.metadata);
    if (!productTier) return { ignored: "manual invoice without qector_tier metadata", receipt_id: invoice.id || null };
  } else {
    return { ignored: reason || "invoice", receipt_id: invoice.id || null };
  }
  if (!invoice.id) throw new Error("invoice id is missing");
  const existing = await readJson(env, `lic:${invoice.id}`);
  const email = normalizeEmail(invoice.customer_email || existing?.email);
  const token = existing?.token || (await signLicenseV2(invoice.id, email, productTier, env));
  const subscription = stringOrNull(invoice.subscription) || stringOrNull(invoice.parent?.subscription_details?.subscription);
  const record = makeRecord(existing, {
    receipt_id: invoice.id,
    email,
    product_tier: productTier,
    tier: TIERS[productTier].claim,
    token,
    expires_at: existing?.expires_at ?? expiryIso(productTier),
    amount_total: numberOrNull(invoice.amount_paid),
    amount_subtotal: numberOrNull(invoice.subtotal),
    currency: invoice.currency || "usd",
    event_id: event.id,
    invoice: invoice.id,
    payment_intent: stringOrNull(invoice.payment_intent),
    subscription,
    billing_url: stringOrNull(invoice.hosted_invoice_url),
  });
  await persistRecord(env, record);
  const delivered = await deliverCustomerEmails(record, invoice, env);
  return { issued: true, renewal: reason !== "manual", tier: productTier, license_email: delivered.license_email_status, billing_email: delivered.billing_email_status, receipt_id: record.receipt_id };
}

async function tierForSubscription(invoice, env) {
  const subscription = stringOrNull(invoice.subscription) || stringOrNull(invoice.parent?.subscription_details?.subscription);
  if (subscription) {
    const recorded = await readJson(env, `sub:${subscription}`);
    if (recorded?.product_tier && TIERS[recorded.product_tier]) return recorded.product_tier;
  }
  const fromMeta =
    tierFromMetadataOrNull(invoice.subscription_details?.metadata) ||
    tierFromMetadataOrNull(invoice.parent?.subscription_details?.metadata) ||
    tierFromMetadataOrNull(invoice.metadata);
  if (fromMeta) return fromMeta;
  for (const line of invoice.lines?.data || []) {
    const fromLine = tierFromMetadataOrNull(line.metadata) || tierFromMetadataOrNull(line.price?.metadata) || tierFromPriceId(line.price?.id || line.pricing?.price_details?.price, env);
    if (fromLine) return fromLine;
    const amount =
      numberOrNull(line.price?.unit_amount) ??
      numberOrNull(line.pricing?.unit_amount_decimal != null ? Number(line.pricing.unit_amount_decimal) : null) ??
      (Number(line.quantity || 1) === 1 ? numberOrNull(line.amount) : null);
    if (amount != null && AMOUNT_TIERS[amount]) return AMOUNT_TIERS[amount];
  }
  return null;
}

// Cancellation: no revocation. The token's `exp` already ends the licence after
// the paid period plus grace; renewals simply stop. Records are annotated so
// support can see the subscription ended.
async function markSubscriptionEnded(event, env) {
  const sub = event.data?.object?.id;
  if (typeof sub !== "string" || !sub) return { revoked: false, cancelled: false };
  const link = await readJson(env, `sub:${sub}`);
  const receipts = new Set([link?.receipt_id, ...(link?.receipts || [])].filter(Boolean));
  const at = nowIso();
  for (const receipt of receipts) {
    const record = await readJson(env, `lic:${receipt}`);
    if (record) await writeJson(env, `lic:${receipt}`, { ...record, subscription_ended_at: at });
  }
  console.log(`[qector] subscription ${sub} ended; licence runs to its expiry`);
  return { revoked: false, cancelled: true, subscription: sub, receipt_id: [...receipts][0] || null };
}

async function revokeEntitlement(event, env) {
  const object = event.data?.object || {};
  const identifiers = [object.id, object.payment_intent, object.charge, object.subscription, object.invoice].filter((v) => typeof v === "string" && v.length > 0);
  if (identifiers.length === 0) return { revoked: false };
  const receipts = new Set();
  for (const identifier of identifiers) {
    for (const prefix of ["pi:", "invoice:", "sub:"]) {
      const link = await readJson(env, `${prefix}${identifier}`);
      if (link?.receipt_id) receipts.add(link.receipt_id);
      for (const r of link?.receipts || []) receipts.add(r);
    }
    if ((await readJson(env, `lic:${identifier}`)) !== null) receipts.add(identifier);
  }
  const at = nowIso();
  for (const identifier of [...identifiers, ...receipts]) await writeJson(env, `revoked:${identifier}`, { reason: event.type, at });
  for (const receipt of receipts) {
    const record = await readJson(env, `lic:${receipt}`);
    if (record) await writeJson(env, `lic:${receipt}`, { ...record, revoked: true, revoked_at: at, revoked_reason: event.type });
  }
  if (receipts.size > 0) {
    const crl = (await readJson(env, "crl")) || [];
    for (const receipt of receipts) if (!crl.includes(receipt)) crl.push(receipt);
    await writeJson(env, "crl", crl);
  }
  const first = [...receipts][0] || identifiers[0];
  console.log(`[qector] revoked ${[...receipts].join(",") || identifiers[0]} (${event.type})`);
  return { revoked: receipts.size > 0, receipt_id: first, unmatched: receipts.size === 0 ? identifiers : undefined };
}

// ---------------------------------------------------------------------------
// Tier resolution
// ---------------------------------------------------------------------------

export function tierFromSession(session, env = {}) {
  const meta = tierFromMetadataOrNull(session?.metadata);
  if (meta) return meta;
  for (const item of session?.line_items?.data || []) {
    const fromPrice = tierFromMetadataOrNull(item.price?.metadata) || tierFromPriceId(item.price?.id, env);
    if (fromPrice) return fromPrice;
  }
  for (const field of ["amount_subtotal", "amount_total"]) {
    const amount = session?.[field];
    if (typeof amount === "number" && Number.isFinite(amount) && AMOUNT_TIERS[amount]) {
      console.log(`[qector] no tier metadata; ${field} ${amount} maps to ${AMOUNT_TIERS[amount]}`);
      return AMOUNT_TIERS[amount];
    }
  }
  // Refuse to guess: an unknown paid checkout is surfaced (500 → Stripe retries,
  // the event shows as pending) instead of silently issuing a 60-day token.
  throw new Error(`cannot determine the licence tier for ${session?.id || "session"} (subtotal ${session?.amount_subtotal}); add qector_tier metadata and reconcile`);
}

export function tierFromMetadataOrNull(metadata) {
  const raw = metadata?.qector_tier || metadata?.license_tier;
  if (!raw) return null;
  const tier = String(raw).trim().toLowerCase().replace(/[\s/-]+/g, "_");
  return Object.prototype.hasOwnProperty.call(TIERS, tier) ? tier : null;
}

// Live legacy recurring prices whose subscriptions carry no metadata. Renewals
// of these resolve here even when the invoice line omits the price amount
// (newer API versions expose only `pricing.price_details.price`).
const BUILTIN_PRICE_TIERS = Object.freeze({
  price_1TwkW3Rsa9cg9l8AsgJhqJPR: "solo_annual",
  price_1TyqegRsa9cg9l8ApRDrXvZa: "startup",
  price_1TyqehRsa9cg9l8Aicyt6SHx: "professional",
});

function tierFromPriceId(priceId, env) {
  if (!priceId) return null;
  if (env.PRICE_TIERS) {
    try {
      const tier = JSON.parse(env.PRICE_TIERS)[priceId];
      if (tier && TIERS[tier]) return tier;
    } catch {
      // fall through to the built-in table
    }
  }
  return BUILTIN_PRICE_TIERS[priceId] || null;
}

function expiryIso(productTier, nowMs = Date.now()) {
  const days = TIERS[productTier].days;
  return days == null ? null : new Date(nowMs + days * DAY * 1000).toISOString();
}

// ---------------------------------------------------------------------------
// Token signing (format unchanged since 1.0.0)
// ---------------------------------------------------------------------------

export async function signLicenseV2(receiptId, email, productTier, env, nowMs = Date.now()) {
  if (!TIERS[productTier]) throw new Error(`unknown product tier ${productTier}`);
  const claims = { email: normalizeEmail(email), rid: receiptId, tier: TIERS[productTier].claim };
  const days = TIERS[productTier].days;
  if (days != null) claims.exp = Math.floor(nowMs / 1000) + days * DAY;
  const ordered = {};
  for (const key of Object.keys(claims).sort()) ordered[key] = claims[key];
  const claimsB64 = b64url(new TextEncoder().encode(JSON.stringify(ordered)));
  const signature = await crypto.subtle.sign("Ed25519", await signingKey(env), new TextEncoder().encode(claimsB64));
  if (!(await crypto.subtle.verify("Ed25519", await decoderPublicKey(env), signature, new TextEncoder().encode(claimsB64)))) {
    throw new Error("signing key does not match the decoder's embedded public key; token not issued");
  }
  return `v2.${claimsB64}.${b64url(new Uint8Array(signature))}`;
}

// Public half of the production key embedded in qector-decoder-v3
// (license.rs PRODUCTION_PUBLIC_KEY / license.py PUBLIC_KEY_PEM). Overridable
// only for tests via QECTOR_EXPECTED_PUBLIC_KEY_B64.
const DECODER_PUBLIC_KEY_B64 = "Qh9t19EZ4KWZEYjY3EwHCUzUIehZBlovaMtrpLQXeGA=";
let cachedDecoderKey = null;
let cachedDecoderKeyB64 = "";
async function decoderPublicKey(env) {
  const b64 = String(env.QECTOR_EXPECTED_PUBLIC_KEY_B64 || DECODER_PUBLIC_KEY_B64);
  if (!cachedDecoderKey || cachedDecoderKeyB64 !== b64) {
    cachedDecoderKeyB64 = b64;
    cachedDecoderKey = crypto.subtle.importKey("raw", b64ToBytes(b64), { name: "Ed25519" }, false, ["verify"]);
  }
  return cachedDecoderKey;
}

export async function keyMatchesDecoder(env) {
  if (!env.QECTOR_LICENSE_PRIVATE_KEY_B64) return false;
  try {
    const probe = new TextEncoder().encode("qector-key-check");
    const sig = await crypto.subtle.sign("Ed25519", await signingKey(env), probe);
    return await crypto.subtle.verify("Ed25519", await decoderPublicKey(env), sig, probe);
  } catch {
    return false;
  }
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

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

function makeRecord(existing, values) {
  return {
    ...(existing || {}),
    ...values,
    issued_at: existing?.issued_at || nowIso(),
    license_email_status: existing?.license_email_status || "pending",
    billing_email_status: existing?.billing_email_status || "pending",
    license_email_attempts: Number(existing?.license_email_attempts || 0),
    billing_email_attempts: Number(existing?.billing_email_attempts || 0),
  };
}

async function persistRecord(env, record) {
  await writeJson(env, `lic:${record.receipt_id}`, record);
  if (record.payment_intent) await writeJson(env, `pi:${record.payment_intent}`, { receipt_id: record.receipt_id });
  if (record.invoice) await writeJson(env, `invoice:${record.invoice}`, { receipt_id: record.receipt_id });
  if (record.subscription) {
    const prior = (await readJson(env, `sub:${record.subscription}`)) || {};
    const receipts = Array.isArray(prior.receipts) ? prior.receipts : [];
    if (!receipts.includes(record.receipt_id)) receipts.push(record.receipt_id);
    await writeJson(env, `sub:${record.subscription}`, {
      product_tier: prior.product_tier || record.product_tier,
      receipt_id: record.receipt_id,
      receipts,
    });
  }
  const mailKey = `bymail:${record.email}`;
  const prior = await readJson(env, mailKey);
  const receipts = Array.isArray(prior) ? prior : [];
  if (!receipts.includes(record.receipt_id)) receipts.push(record.receipt_id);
  await writeJson(env, mailKey, receipts);
}

// ---------------------------------------------------------------------------
// E-mail
// ---------------------------------------------------------------------------

async function deliverCustomerEmails(record, source, env, { billing = true } = {}) {
  const messages = buildCustomerMessages(record, source).filter(({ kind }) => billing || kind === "license");
  if (!billing) record = { ...record, billing_email_status: "not_applicable" };
  const pending = messages.filter(({ kind }) => record[`${kind}_email_status`] !== "sent");
  if (pending.length === 0) return record;
  const results = await Promise.allSettled(pending.map(({ kind, message }) => sendWithRetry(message, `${kind}:${record.receipt_id}`, env)));
  const next = { ...record };
  const failures = [];
  results.forEach((result, index) => {
    const kind = pending[index].kind;
    next[`${kind}_email_attempts`] = Number(next[`${kind}_email_attempts`] || 0) + (result.status === "fulfilled" ? result.value.attempts : MAX_EMAIL_ATTEMPTS);
    if (result.status === "fulfilled") {
      next[`${kind}_email_status`] = "sent";
      next[`${kind}_email_sent_at`] = nowIso();
      next[`${kind}_email_provider`] = result.value.provider;
      next[`${kind}_email_message_id`] = result.value.message_id || null;
      delete next[`${kind}_email_last_error`];
    } else {
      next[`${kind}_email_status`] = "pending";
      next[`${kind}_email_last_error`] = errorText(result.reason);
      failures.push(kind);
    }
  });
  await persistRecord(env, next);
  if (failures.length > 0) throw new Error(`email delivery pending for: ${failures.join(", ")}`);
  return next;
}

export function buildCustomerMessages(record, source) {
  const tierInfo = TIERS[record.product_tier] || TIERS.evaluation;
  const validity = record.expires_at ? `Valid until: ${record.expires_at.slice(0, 10)} (UTC)` : "Valid for: every 1.x release of qector-decoder-v3 (perpetual)";
  const install = 'python -m pip install --upgrade "qector-decoder-v3>=1.0.1,<2"';
  const verify = `python -c "import qector_decoder_v3 as q; print(q.get_license_info()['tier'])"`;
  const expected = tierInfo.claim === "enterprise" ? "Enterprise" : "Pro";
  const licenseText = [
    "Your QECTOR Decoder v3 licence is ready.",
    "",
    `Plan: ${tierInfo.label}`,
    validity,
    `Reference: ${record.receipt_id}`,
    "",
    "Licence token:",
    "",
    record.token,
    "",
    "1. Install or upgrade:",
    `   ${install}`,
    "",
    "2. Activate (macOS / Linux):",
    `   export QECTOR_LICENSE_KEY="${record.token}"`,
    `   export QECTOR_LICENSE="${record.token}"`,
    "",
    "   Windows PowerShell:",
    `   $env:QECTOR_LICENSE_KEY = "${record.token}"`,
    `   $env:QECTOR_LICENSE = "${record.token}"`,
    "",
    "   Or save the token in ~/.qector/license.key (one line).",
    "",
    "3. Verify (offline, no network needed):",
    `   ${verify}`,
    `   It prints ${expected}.`,
    "",
    "Keep this token private: it is tied to this e-mail address.",
    "Manage your subscription, invoices and billing details: https://billing.stripe.com/p/login/7sY9AVdwlgoyfse9bYeUU00",
    `Terms: ${SITE}/license-agreement/   Questions: ${SUPPORT_EMAIL}`,
  ].join("\n");
  const licenseHtml =
    `<p>Your QECTOR Decoder v3 licence is ready.</p>` +
    `<p><strong>Plan:</strong> ${escapeHtml(tierInfo.label)}<br><strong>${escapeHtml(validity.split(":")[0])}:</strong> ${escapeHtml(validity.split(": ").slice(1).join(": "))}<br><strong>Reference:</strong> ${escapeHtml(record.receipt_id)}</p>` +
    `<p><strong>Licence token:</strong></p><p><code style="word-break:break-all">${escapeHtml(record.token)}</code></p>` +
    `<ol><li>Install or upgrade: <code>${escapeHtml(install)}</code></li>` +
    `<li>Set <code>QECTOR_LICENSE_KEY</code> and <code>QECTOR_LICENSE</code> to the token (or save it in <code>~/.qector/license.key</code>).</li>` +
    `<li>Verify offline: <code>${escapeHtml(verify)}</code> prints <strong>${expected}</strong>.</li></ol>` +
    `<p>Keep this token private: it is tied to this e-mail address.</p>` +
    `<p><a href="${SITE}/license-agreement/">Licence terms</a> · <a href="https://billing.stripe.com/p/login/7sY9AVdwlgoyfse9bYeUU00">Manage subscription</a> · Questions: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>`;
  const messages = [{ kind: "license", message: { to: record.email, subject: `Your QECTOR Decoder v3 licence (${tierInfo.label})`, text: licenseText, html: licenseHtml } }];
  if (source) {
    const billing = billingSummary(record, source);
    const lines = [
      "QECTOR payment confirmation",
      "",
      `Reference: ${record.receipt_id}`,
      `Plan: ${tierInfo.label}`,
      `Amount paid: ${billing.total}`,
      billing.subtotal ? `List price: ${billing.subtotal}` : null,
      billing.discount ? `Discount: ${billing.discount}` : null,
      billing.url ? `Receipt or invoice: ${billing.url}` : null,
      "",
      "Your licence token arrives in a separate e-mail.",
      `Refunds: ${SITE}/refund/   Support: ${SUPPORT_EMAIL}`,
    ].filter(Boolean);
    messages.push({
      kind: "billing",
      message: {
        to: record.email,
        subject: `QECTOR payment confirmation (${record.receipt_id})`,
        text: lines.join("\n"),
        html:
          `<p>QECTOR payment confirmation</p><p><strong>Reference:</strong> ${escapeHtml(record.receipt_id)}<br><strong>Plan:</strong> ${escapeHtml(tierInfo.label)}<br><strong>Amount paid:</strong> ${escapeHtml(billing.total)}</p>` +
          (billing.subtotal ? `<p><strong>List price:</strong> ${escapeHtml(billing.subtotal)}<br><strong>Discount:</strong> ${escapeHtml(billing.discount || "none")}</p>` : "") +
          (billing.url ? `<p><a href="${escapeHtml(billing.url)}">Open your Stripe receipt or invoice</a></p>` : "") +
          `<p>Your licence token arrives in a separate e-mail. <a href="${SITE}/refund/">Refund policy</a> · Support: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>`,
      },
    });
  }
  return messages;
}

function billingSummary(record, source) {
  const currency = String(record.currency || source.currency || "usd").toUpperCase();
  const total = record.amount_total != null ? record.amount_total : numberOrNull(source.amount_total);
  const subtotal = record.amount_subtotal != null ? record.amount_subtotal : numberOrNull(source.amount_subtotal);
  const discount = record.amount_discount != null ? record.amount_discount : numberOrNull(source.total_details?.amount_discount);
  return {
    total: formatMoney(total, currency),
    subtotal: subtotal != null ? formatMoney(subtotal, currency) : null,
    discount: discount ? formatMoney(discount, currency) : null,
    url: record.billing_url || source.receipt_url || source.hosted_invoice_url || null,
  };
}

async function sendWithRetry(message, deliveryKey, env) {
  const providers = emailProviders(env);
  if (providers.length === 0) throw new Error("no email provider configured");
  let lastError;
  for (const provider of providers) {
    for (let attempt = 1; attempt <= MAX_EMAIL_ATTEMPTS; attempt += 1) {
      try {
        let result;
        if (provider === "gmail") result = await sendViaGmail(message, deliveryKey, env);
        else if (provider === "cloudflare") result = await sendViaCloudflareEmail(message, deliveryKey, env);
        else result = await sendViaResend(message, deliveryKey, env);
        return { ...result, provider, attempts: attempt };
      } catch (error) {
        lastError = error;
        if (attempt < MAX_EMAIL_ATTEMPTS) await sleep(250 * 2 ** (attempt - 1));
      }
    }
  }
  throw lastError || new Error("email provider failed");
}

async function sendViaGmail(message, deliveryKey, env) {
  const accessToken = await getGmailAccessToken(env);
  const response = await fetchWithTimeout("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: buildGmailRaw(message, deliveryKey, env) }),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Gmail returned HTTP ${response.status} ${text.slice(0, 200)}`);
  }
  const body = await response.json();
  return { message_id: body.id || null };
}

function buildGmailRaw(message, deliveryKey, env) {
  const from = env.GMAIL_FROM_EMAIL || env.LICENSE_FROM_EMAIL || DEFAULT_FROM;
  const boundary = `qector_${deliveryKey.replace(/[^a-zA-Z0-9]/g, "_")}`;
  const headers = [
    `From: ${from}`,
    `To: ${message.to}`,
    `Reply-To: ${SUPPORT_EMAIL}`,
    `Subject: ${encodeHeader(message.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `X-QECTOR-Delivery-Key: ${deliveryKey}`,
  ].join("\r\n");
  const part = (type, text) => [`--${boundary}`, `Content-Type: ${type}; charset="UTF-8"`, "Content-Transfer-Encoding: base64", "", b64(new TextEncoder().encode(text))].join("\r\n");
  const raw = `${headers}\r\n\r\n${part("text/plain", message.text)}\r\n${part("text/html", message.html)}\r\n--${boundary}--`;
  return b64url(new TextEncoder().encode(raw));
}

async function getGmailAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedGmailAccessToken && cachedGmailExpiry - 60 > now) return cachedGmailAccessToken;
  if (cachedGmailPromise) return cachedGmailPromise;
  if (!env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REFRESH_TOKEN) throw new Error("gmail provider not configured");
  cachedGmailPromise = (async () => {
    const params = new URLSearchParams({ client_id: env.GMAIL_CLIENT_ID, client_secret: env.GMAIL_CLIENT_SECRET, refresh_token: env.GMAIL_REFRESH_TOKEN, grant_type: "refresh_token" });
    const response = await fetchWithTimeout("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: params.toString() });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Gmail token exchange failed HTTP ${response.status} ${text.slice(0, 200)}`);
    }
    const data = await response.json();
    if (!data.access_token) throw new Error("Gmail token response missing access_token");
    cachedGmailAccessToken = data.access_token;
    cachedGmailExpiry = Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600);
    return cachedGmailAccessToken;
  })();
  try {
    return await cachedGmailPromise;
  } finally {
    cachedGmailPromise = null;
  }
}

async function sendViaCloudflareEmail(message, deliveryKey, env) {
  const result = await env.EMAIL.send({ ...message, from: env.LICENSE_FROM_EMAIL || DEFAULT_FROM, replyTo: SUPPORT_EMAIL, headers: { "X-QECTOR-Delivery-Key": deliveryKey } });
  return { message_id: result?.messageId || null };
}

async function sendViaResend(message, deliveryKey, env) {
  const response = await fetchWithTimeout("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": deliveryKey },
    body: JSON.stringify({ from: env.LICENSE_FROM_EMAIL || DEFAULT_FROM, to: [message.to], reply_to: SUPPORT_EMAIL, subject: message.subject, text: message.text, html: message.html, headers: { "X-QECTOR-Delivery-Key": deliveryKey } }),
  });
  if (!response.ok) throw new Error(`Resend returned HTTP ${response.status}`);
  const body = await response.json();
  return { message_id: body.id || null };
}

function emailProviders(env) {
  const providers = [];
  if (env.GMAIL_CLIENT_ID && env.GMAIL_CLIENT_SECRET && env.GMAIL_REFRESH_TOKEN) providers.push("gmail");
  if (env.EMAIL && typeof env.EMAIL.send === "function") providers.push("cloudflare");
  if (env.RESEND_API_KEY) providers.push("resend");
  return providers;
}

// ---------------------------------------------------------------------------
// Verification helpers
// ---------------------------------------------------------------------------

export async function verifyStripeSignature(payload, header, secret, nowSeconds = Math.floor(Date.now() / 1000)) {
  const values = parseSignatureHeader(header);
  const timestamp = Number(values.t);
  if (!Number.isFinite(timestamp) || Math.abs(nowSeconds - timestamp) > SIGNATURE_TOLERANCE_SECONDS) throw new Error("timestamp outside tolerance");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expected = toHex(new Uint8Array(mac));
  if (!values.v1.some((candidate) => timingSafeEqual(expected, candidate))) throw new Error("signature mismatch");
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

async function verifyTurnstile(token, ip, env) {
  if (!token) return false;
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const response = await fetchWithTimeout("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

function allowedOrigin(origin, env) {
  const allowed = String(env.TRIAL_ALLOWED_ORIGINS || "https://qector.store,https://www.qector.store").split(",").map((s) => s.trim());
  return allowed.includes(origin);
}

// ---------------------------------------------------------------------------
// Small utilities
// ---------------------------------------------------------------------------

function liveMode(env) {
  return env.STRIPE_LIVEMODE !== "false";
}

function pickEmail(object) {
  return object.customer_details?.email || object.customer_email || object.metadata?.customer_email || "";
}

export function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("customer email is missing or invalid");
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
  await env.LICENSES.put(key, JSON.stringify(value), expirationTtl ? { expirationTtl } : undefined);
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("request timeout"), EMAIL_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const nowIso = () => new Date().toISOString();
const stringOrNull = (v) => (typeof v === "string" && v.length > 0 ? v : null);
const numberOrNull = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);

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
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function encodeHeader(value) {
  return /^[\x20-\x7e]*$/.test(value) ? value : `=?UTF-8?B?${b64(new TextEncoder().encode(value))}?=`;
}

function b64ToBytes(value) {
  const binary = atob(String(value).replace(/\s+/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function b64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function b64url(bytes) {
  return b64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function toHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let i = 0; i < left.length; i += 1) difference |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return difference === 0;
}

function json(value, status = 200, head = false, origin = "", env = {}) {
  const headers = { ...API_SECURITY_HEADERS, "content-type": "application/json; charset=utf-8" };
  if (origin && allowedOrigin(origin, env)) {
    headers["access-control-allow-origin"] = origin;
    headers.vary = "Origin";
  }
  return new Response(head ? null : JSON.stringify(value), { status, headers });
}
