# QECTOR Fulfilment Worker

This Worker owns the live `qector.store/stripe/webhook` endpoint.

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
```

Configure one or both email providers:

- Cloudflare Email Service: onboard `qector.store`, then keep the `EMAIL` binding in `wrangler.toml`.
- Resend: set the Worker secret `RESEND_API_KEY` if Cloudflare Email Service is unavailable.

When both are configured, Cloudflare is tried first and Resend is used as the
fallback. Before a domain is onboarded, Cloudflare may accept only verified
account destinations, so Resend is required for arbitrary customer addresses.

Deploy from this directory:

```text
npm test
npx wrangler deploy
```
