const MARKDOWN_HOME = `# QECTOR Decoder 3

QECTOR Decoder 3 is a Python and Rust quantum error correction decoder package for QEC experiments, decoder validation, BP-OSD and LDPC workflows, and artifact-backed evaluation.

## Public install

\`\`\`bash
pip install qector-decoder-v3
python -c "from qector_decoder_v3 import UnionFindDecoder, BlossomDecoder; print('QECTOR OK')"
\`\`\`

## Official links

- Website: https://qector.store/
- Install guide: https://qector.store/installer.html
- Documentation: https://qector.store/docs.html
- Benchmarks: https://qector.store/benchmarks.html
- Contact: https://qector.store/contact.html
- PyPI: https://pypi.org/project/qector-decoder-v3/
- GitHub: https://github.com/GuillaumeLessard/qector-decoder
- DOI: https://doi.org/10.5281/zenodo.20825980

## Boundaries

Commercial use requires written permission. Benchmark claims should stay tied to public artifacts and local reproduction.
`;

const LINK_HEADER = [
  '</llms.txt>; rel="alternate"; type="text/plain"',
  '</llms-full.txt>; rel="alternate"; type="text/plain"',
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  '</docs.html>; rel="service-doc"; type="text/html"',
  '</auth.md>; rel="authorization"; type="text/markdown"',
  '</.well-known/mcp/server-card.json>; rel="mcp-server-card"; type="application/json"',
  '</.well-known/agent-skills/index.json>; rel="agent-skills"; type="application/json"'
].join(', ');

const CONTENT_TYPES = new Map([
  ['/.well-known/api-catalog', 'application/linkset+json; charset=utf-8'],
  ['/.well-known/oauth-protected-resource', 'application/json; charset=utf-8'],
  ['/.well-known/oauth-authorization-server', 'application/json; charset=utf-8'],
  ['/.well-known/openid-configuration', 'application/json; charset=utf-8'],
  ['/.well-known/ucp', 'application/json; charset=utf-8'],
  ['/auth.md', 'text/markdown; charset=utf-8'],
  ['/llms.txt', 'text/plain; charset=utf-8'],
  ['/llms-full.txt', 'text/plain; charset=utf-8']
]);

function securityHeaders(headers) {
  headers.set('Link', LINK_HEADER);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  return headers;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const accept = request.headers.get('accept') || '';

    if ((url.pathname === '/' || url.pathname === '/index.html') && accept.includes('text/markdown')) {
      const headers = securityHeaders(new Headers({
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
        'x-markdown-tokens': String(MARKDOWN_HOME.split(/\s+/).filter(Boolean).length)
      }));
      return new Response(MARKDOWN_HOME, { status: 200, headers });
    }

    const response = await fetch(request);
    const headers = securityHeaders(new Headers(response.headers));

    const forcedType = CONTENT_TYPES.get(url.pathname);
    if (forcedType) headers.set('Content-Type', forcedType);

    if (url.pathname.startsWith('/assets/')) {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
