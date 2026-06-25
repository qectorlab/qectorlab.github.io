# QECTOR Cloudflare + GitHub Pages setup

Canonical production domain: `qector.store`

## Repository state

The repository root must contain:

```text
CNAME
```

with this exact content:

```text
qector.store
```

Do not include `https://` or `www.` in the CNAME file.

## GitHub Pages settings

Repository: `qectorlab/qectorlab.github.io`

Settings → Pages:

```text
Source: Deploy from branch
Branch: main
Folder: / root
Custom domain: qector.store
```

For Cloudflare proxied DNS, keep GitHub Pages custom domain as `qector.store`.

## Cloudflare DNS

Recommended records:

```text
Type   Name   Target                    Proxy
CNAME  @      qectorlab.github.io        Proxied
CNAME  www    qector.store               Proxied
```

If Cloudflare does not allow CNAME flattening at root in your plan/UI, use Cloudflare's CNAME flattening or the Pages-compatible root configuration offered in the DNS screen.

## SSL/TLS

Cloudflare → SSL/TLS:

```text
Encryption mode: Full
Always Use HTTPS: On
Automatic HTTPS Rewrites: On
Minimum TLS version: TLS 1.2 or higher
```

Use Full (Strict) only after the origin certificate path is confirmed valid for GitHub Pages custom domain traffic.

## Redirect rule

Create a Cloudflare Redirect Rule:

```text
When incoming requests match:
Hostname equals www.qector.store

Then:
Static redirect
URL: https://qector.store${uri.path}${uri.query}
Status code: 301
Preserve query string: Yes
```

Goal: every `www.qector.store/*` URL becomes `qector.store/*`.

## Cache rule

Create a Cloudflare Cache Rule for static assets:

```text
When URI path starts with /assets/
Browser TTL: 1 year
Edge TTL: 1 month or longer
Cache eligibility: Eligible for cache
```

For HTML pages, keep a short TTL:

```text
When URI path ends with .html OR URI path equals /
Browser TTL: 10 minutes
Edge TTL: 10 minutes
```

## Security headers through Cloudflare

Use Cloudflare Transform Rules or Response Header Modification Rules for:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Cross-Origin-Opener-Policy: same-origin
Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
```

CSP must allow the contact form endpoint:

```text
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' https://api.web3forms.com; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.web3forms.com; upgrade-insecure-requests
```

## Final verification

Run:

```text
https://qector.store/
https://qector.store/sitemap.xml
https://qector.store/robots.txt
https://qector.store/llms.txt
https://qector.store/contact.html
```

Then test:

```text
https://www.qector.store/
```

Expected result: 301 redirect to `https://qector.store/`.
