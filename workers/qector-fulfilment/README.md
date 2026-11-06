# qector-fulfilment 2.1

Stripe webhook → Ed25519 licence tokens for QECTOR Decoder v3. Tokens are
verified offline by the decoder (air-gapped; no licence server). Same KV
namespace (`LICENSES`), same secrets and same token format as 2.0; tokens
verify on decoder 1.0.0 and 1.0.1.

## Deploy

1. Use this folder's `src/index.js` **and** `wrangler.toml` (five routes,
   `LICENSES` KV binding `046bed4b69c04304b1fd273da0fb96da`, `EMAIL` binding,
   `TRIALS_ENABLED = "false"`).
2. `npm test` (Node 20+, no dependencies), then
   `npx wrangler deploy --config ./wrangler.toml`.
3. Check `https://qector.store/stripe/health` shows `"version":"2.1"` and
   `"key_matches_decoder":true`. If it is `false`, the Worker's signing key is
   not the decoder's production key: no token will be issued (events stay
   pending and Stripe retries) until the secret is fixed.

The Stripe webhook endpoint must send these events:
`checkout.session.completed`, `checkout.session.async_payment_succeeded`,
`invoice.paid`, `charge.refunded`, `charge.dispute.created`,
`customer.subscription.deleted`.

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
| Partial refund | Licence kept |
| Subscription cancelled | Not revoked: the token runs to its expiry (paid period + 14 days grace) |
| Signing key ≠ decoder key | Event fails and is retried; nothing is e-mailed |
| Unknown amount without metadata | Held for reconciliation (`POST /stripe/reconcile`) |

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
