# qector-fulfilment 2.2

Stripe webhook → Ed25519 licence tokens for QECTOR Decoder v3. Tokens are
verified offline by the decoder (air-gapped; no licence server). Same KV
namespace (`LICENSES`), same secrets and same token format as 2.0 and 2.1;
tokens verify on decoder 1.0.0 and 1.0.1.

## Deploy

1. Use this folder's `src/index.js` **and** `wrangler.toml` (five routes,
   `LICENSES` KV binding `046bed4b69c04304b1fd273da0fb96da`, `EMAIL` binding,
   `TRIALS_ENABLED = "false"`).
2. `npm test` (Node 20+, no dependencies), then
   `npx wrangler deploy --config ./wrangler.toml`.
3. Check `https://qector.store/stripe/health` shows `"version":"2.2"` and
   `"key_matches_decoder":true`. If it is `false`, the Worker's signing key is
   not the decoder's production key: no token will be issued (events stay
   pending and Stripe retries) until the secret is fixed.

The Stripe webhook endpoint must send these events:
`checkout.session.completed`, `checkout.session.async_payment_succeeded`,
`invoice.paid`, `invoice_payment.paid`, `charge.refunded`,
`charge.dispute.created`, `customer.subscription.deleted`.

`invoice_payment.paid` is new in 2.2: add it to the endpoint in the Stripe
Dashboard. It is the only event that ties a subscription payment's
PaymentIntent to its invoice, which is what lets a chargeback on a
subscription payment find its licence.

Optional settings: `PRICE_TIERS` = JSON `{"price_…":"lab", …}` (every live
payment link already carries `qector_tier` metadata), and the dormant trial
settings `TURNSTILE_SECRET` / `TRIAL_ALLOWED_ORIGINS` (trials are off).

## Behaviour

| Event | Result |
| --- | --- |
| Checkout paid (card) | Licence token + receipt e-mailed; idempotent per event |
| Checkout with a delayed method (bank debit) | Nothing on the "unpaid" completion; licence on `async_payment_succeeded` |
| Renewal (`invoice.paid`) | New token with the tier recorded at checkout, then subscription metadata, price id (built-in table for the live legacy prices) or price amount; unknown tiers are held, never guessed |
| Full refund or dispute | Receipt id revoked and published at `GET /stripe/revoked.txt` |
| Refund or dispute that matches no licence | Event fails and is retried for three days; nothing is acknowledged silently |
| Partial refund | Licence kept |
| Subscription cancelled | Not revoked: the token runs to its expiry (paid period + 14 days grace) |
| Signing key ≠ decoder key | Event fails and is retried; nothing is e-mailed |
| Unknown amount without metadata | Held for reconciliation (`POST /stripe/reconcile`) |

## How a refund or dispute finds its licence

1. Direct links written at issue time: PaymentIntent (one-time payments),
   invoice, subscription, or the receipt id itself.
2. `alias:<PaymentIntent|Charge>` → invoice, written by `invoice_payment.paid`
   (and by `invoice.paid` on API versions before 2025-03-31).
3. Refunds only: the Charge's customer. Licences are indexed by customer at
   issue time (`cus:<customer>`); exactly one unrevoked licence with the
   charged amount and currency, issued within three days of the charge, is
   revoked. Two candidates are never guessed between.
4. Otherwise the event fails with `matches no licence`. Stripe retries it, so a
   link that arrives late still revokes. To settle one by hand, send a
   `charge.refunded` event whose object `id` is the receipt id to
   `POST /stripe/reconcile`. A refund of a payment that was not for a licence
   needs no action: it stops retrying after three days.

Licences issued by 2.1 or earlier have no customer index. Subscriptions gain
one at their next renewal; until then a refund of such a payment is held
(step 4) rather than missed.

## Security notes

- `RECONCILE_TOKEN` can issue or revoke any licence: `/stripe/reconcile`
  accepts event bodies as given, without a Stripe signature. Treat it like the
  signing key, keep it out of shells and CI logs, and rotate it after use by
  anyone else.
- `GET /stripe/health` and `GET /stripe/revoked.txt` are public by design.

## Tiers

Licences cover the buying organisation's internal use; there are no seat counts.

| Product tier | Token `tier` | Validity |
| --- | --- | --- |
| pilot | pro | 60 days |
| pro_monthly | pro | 45 days (31 + 14 grace) |
| pro_annual | pro | 380 days (366 + 14 grace) |
| pro_perpetual | pro | no expiry |
| lab, enterprise | enterprise | 380 days |
| Legacy: evaluation, commercial | evaluation (decoder maps to Pro) | 60 days |
| Legacy: team, solo_annual, startup | pro | 380 days |
| Legacy: professional (priced above Lab) | enterprise | 380 days |
| Legacy: solo_perpetual | pro | no expiry |
| trial (endpoint disabled) | pro | 14 days |

Air-gapped installs can apply revocations by copying
`https://qector.store/stripe/revoked.txt` to `~/.qector/revoked.txt`.
