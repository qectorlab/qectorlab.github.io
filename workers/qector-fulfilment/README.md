# QECTOR Fulfilment Worker

This Worker owns the live `qector.store/stripe/webhook` endpoint and the
protected reconciliation endpoint at `qector.store/stripe/reconcile`.

## Delivery contract

- Stripe signatures are verified against the raw request body.
- Live endpoints reject test-mode events.
- License tokens are deterministic per receipt and email. Existing tokens are reused.
- The license email and payment confirmation email have independent status fields in KV.
- A missing or failing email provider returns HTTP 500, leaving the event retryable.
- Resend idempotency keys and a KV outbox prevent routine duplicate messages.
- The token format is v2 and is accepted by the live `qector-decoder-v3==1.0.0` package.

## Required secrets

Set these on the Worker without committing values:

```text
QECTOR_LICENSE_PRIVATE_KEY_B64
STRIPE_WEBHOOK_SECRET
RECONCILE_TOKEN
```

Configure one email provider (Gmail is preferred for `admin@qector.store`):

- Gmail API (preferred, sends as `admin@qector.store`): create a Google Cloud OAuth 2.0 client (Desktop), enable the Gmail API, add `admin@qector.store` as a test user while the consent screen is in Testing, obtain a refresh token for `https://www.googleapis.com/auth/gmail.send`, then set Worker secrets `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN` and optionally `GMAIL_FROM_EMAIL` (defaults to `LICENSE_FROM_EMAIL`).
- Cloudflare Email Service: onboard `qector.store`, then keep the `EMAIL` binding in `wrangler.toml`.
- Resend: set the Worker secret `RESEND_API_KEY` if neither Gmail nor Cloudflare is available.

Provider order is Gmail → Cloudflare → Resend; the first configured provider is tried first and the next is used only if it fails. Before a domain is onboarded, Cloudflare may accept only verified account destinations, so Gmail or Resend is required for arbitrary customer addresses.

`GET qector.store/stripe/health` is a non-cached operational check. It reports
the configured provider names but never returns secret values. License tokens
are not exposed through a public GET lookup; delivery recovery uses the
protected reconciliation endpoint and support workflow.

Deploy from this directory:

```text
npm test
npx wrangler deploy
```
