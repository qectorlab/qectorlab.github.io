# QECTOR DNS-AID record templates

DNS-AID records are DNS records, not website files. Add them in Cloudflare DNS when SVCB/HTTPS record editing is available for the zone.

Canonical domain:

```text
qector.store
```

Required discovery names from the scanner:

```text
_index._agents.qector.store
_a2a._agents.qector.store
```

Suggested service endpoints:

```text
https://qector.store/.well-known/api-catalog
https://qector.store/openapi.json
https://qector.store/llms.txt
https://qector.store/.well-known/agent-skills/index.json
https://qector.store/.well-known/mcp/server-card.json
```

Example intent for an HTTPS/SVCB service-mode record:

```text
_index._agents.qector.store. 3600 IN HTTPS 1 qector.store. alpn="h2,h3" endpoint="https://qector.store/.well-known/api-catalog"
_a2a._agents.qector.store.   3600 IN HTTPS 1 qector.store. alpn="h2,h3" endpoint="https://qector.store/.well-known/mcp/server-card.json"
```

If Cloudflare does not expose custom DNS-AID endpoint parameters in the UI yet, keep this file as the source of truth and enable DNSSEC for the zone. DNSSEC is required for authenticated DNS discovery.
