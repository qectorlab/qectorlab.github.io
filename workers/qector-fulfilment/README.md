# qector-fulfilment 2.0

Stripe webhook → Ed25519 licence tokens for QECTOR Decoder v3, plus a 14-day
commercial trial endpoint. Replaces the deployed Worker: same KV namespace
(`LICENSES`), same secrets, same token format (verifies on decoder 1.0.0 and
1.0.1). **Two new routes** (`/stripe/trial`, `/stripe/revoked.txt`) are added in
`wrangler.toml`; without them the trial form on /pricing posts to GitHub Pages
and fails.

## Deploy (from your existing qector-fulfilment wrangler project)

1. Use this folder's `src/index.js` **and** `wrangler.toml` (five routes,
   `LICENSES` KV binding `046bed4b69c04304b1fd273da0fb96da`, `EMAIL` binding).
2. Optional new settings (`wrangler secret put` / `[vars]`):
   - `TRIALS_ENABLED` = `"false"` to switch trials off (on by default)
   - `TURNSTILE_SECRET` requires a Turnstile token on trials. Leave it unset:
     the site form does not send one yet, so setting it rejects every trial.
   - `TRIAL_ALLOWED_ORIGINS` (default `https://qector.store,https://www.qector.store`)
   - `PRICE_TIERS` = JSON `{"price_…":"team", …}` (belt and braces; every new
     Price and payment link already carries `qector_tier` metadata)
3. `npm test` (Node 20+, no dependencies) then `npx wrangler deploy`.
4. Check `https://qector.store/stripe/health` shows `"version":"2.0"`.

## What changed from the deployed bundle

| Area | Before | Now |
| --- | --- | --- |
| Tier without metadata | `amount_total` (tax-inclusive) → canonical `pro` → normalised to `evaluation`: Solo/Startup/Professional buyers got 60-day tokens | metadata → price-id table → pre-tax `amount_subtotal` → product tier; unknown amounts are held (event `pending`, Stripe retries) instead of mis-issued |
| Renewals | invoice metadata (empty) → `evaluation` 60-day token | tier recorded at checkout for the subscription, then subscription/price metadata, then price amount; otherwise held |
| Credited upgrades | `billing_reason: manual` ignored | issued when the invoice has `qector_tier` metadata |
| Revocation | keyed by charge/PI, never matched a token | resolves the receipt id (token `rid`), marks the record, publishes `GET /stripe/revoked.txt` |
| Trials | none | `POST /stripe/trial` {email, accept_terms}: 14-day Pro token by e-mail, once per address per 365 days, 3 per IP per day, honeypot, optional Turnstile, same answer whether or not a trial exists |
| E-mail | pinned `qector-decoder-v3==1.0.0`, private `_is_license_active()` | `"qector-decoder-v3>=1.0,<2"`, plan + expiry date, `get_license_info()['tier']` check |

## Tiers

| Product tier | Token `tier` | Validity |
| --- | --- | --- |
| trial | pro | 14 days |
| pilot, evaluation, commercial | pro / evaluation | 60 days |
| pro_monthly | pro | 45 days (31 + 14 grace) |
| pro_annual, team, solo_annual, startup | pro | 380 days (366 + 14 grace) |
| lab, enterprise, professional (legacy, priced above Lab) | enterprise | 380 days |
| pro_perpetual, solo_perpetual | pro | no expiry |

Customers with a decoder CRL can sync it: `curl -s https://qector.store/stripe/revoked.txt > ~/.qector/revoked.txt`.
