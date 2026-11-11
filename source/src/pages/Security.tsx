import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import CodeBlock from '../components/CodeBlock';
import { CLAUDE_PLUGIN_RELEASE, PYPI_URL, PYPI_VERSION, PYPI_WHEELS } from '../lib/releases';

// Trust & Security: the vendor pack a procurement or security team asks for,
// published so they do not have to ask. Claims link to a verifiable artefact
// (release assets, attestations, policies) wherever one exists; do not write
// "every claim" unless each bullet really carries a link.

const DECODER_RELEASE = `https://github.com/GuillaumeLessard/qector-decoder/releases/tag/v${PYPI_VERSION}`;
const PLUGIN_RELEASE = CLAUDE_PLUGIN_RELEASE.releaseUrl;
const PLUGIN_SIGNING_KEY = 'kYwkMApz4zMgQmJsOya1UZuByvnuikzlxQkQiA8NOJg=';
const DECODER_LICENCE_KEY = 'MCowBQYDK2VwAyEAQh9t19EZ4KWZEYjY3EwHCUzUIehZBlovaMtrpLQXeGA=';

function Card({ title, children, accent }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`card-surface ${accent ? 'border-cyan-300/25' : ''}`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="text-secondary text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

const ext = { target: '_blank', rel: 'noopener noreferrer', className: 'text-cyan-300 hover:underline [overflow-wrap:anywhere]' } as const;

export default function Security() {
  return (
    <>
      <SEO
        title="Security & Trust · QECTOR"
        description="QECTOR security and procurement pack: no telemetry by default, offline licence verification, Sigstore provenance on every wheel, signed releases, SBOM, vulnerability disclosure and data handling."
      />

      <section className="relative py-24 md:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex flex-wrap justify-center items-center gap-2 px-3 py-1.5 bg-surface border border-gridline rounded-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            No telemetry by default · Offline licensing · Signed releases
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="Security & Trust" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Everything a security or procurement review needs, published. Where a claim can be checked, this page links to the artefact or gives the command to check it yourself.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <Card title="At a glance" accent>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <strong className="text-primary">No telemetry by default.</strong> The decoder, plugin and Workbench run locally and send no telemetry, usage data, syndromes, matrices or circuits to QECTOR. The only exception is optional usage-based billing, which exists only under a signed Enterprise agreement and is switched off with <code className="font-mono text-cyan-200">QECTOR_OFFLINE=1</code>. See the{' '}
                <Link to="/privacy" className="text-cyan-300 hover:underline">Privacy Policy</Link>.
              </li>
              <li><strong className="text-primary">Air-gapped licensing.</strong> Licence tokens are Ed25519 signatures verified offline against a key in the package. No licence server, no activation call.</li>
              <li><strong className="text-primary">Verified builds.</strong> All {PYPI_WHEELS} decoder wheels are built in GitHub Actions, carry Sigstore build provenance and PEP 740 attestations, and are published with Trusted Publishing (no API token).</li>
              <li><strong className="text-primary">Tested before release.</strong> Each wheel is installed on its own OS and checked against the syndrome before publishing; the receipts ship as <code className="font-mono text-cyan-200">platform-proof.json</code> in the <a href={DECODER_RELEASE} {...ext}>GitHub release</a>.</li>
              <li><strong className="text-primary">Dependency gate.</strong> Releases are blocked while a RustSec advisory or licence-policy violation is open.</li>
            </ul>
          </Card>

          <Card title="Verify a decoder wheel">
            <p>
              Download from <a href={PYPI_URL} {...ext}>PyPI</a> or the <a href={DECODER_RELEASE} {...ext}>v{PYPI_VERSION} GitHub release</a>, then check its checksum and provenance with the GitHub CLI:
            </p>
            <CodeBlock
              language="bash"
              filename="verify"
              code={`sha256sum -c SHA256SUMS --ignore-missing
gh attestation verify qector_decoder_v3-${PYPI_VERSION}-*.whl \\
  --repo GuillaumeLessard/qector-decoder`}
            />
            <p>PyPI also shows each file&apos;s attestations under &quot;Verified details&quot;.</p>
          </Card>

          <Card title="Verify the Claude plugin">
            <p>
              The <a href={PLUGIN_RELEASE} {...ext}>plugin v{CLAUDE_PLUGIN_RELEASE.version} release</a> ships <code className="font-mono text-cyan-200">SHA256SUMS</code>, an Ed25519 signature over it, an SPDX 2.3 SBOM, a release manifest and provenance. Verify with the release-signing public key:
            </p>
            <CodeBlock
              language="bash"
              filename="verify"
              code={`sha256sum -c SHA256SUMS
python scripts/sign_release.py --verify . \\
  --pubkey ${PLUGIN_SIGNING_KEY}`}
            />
            <p>Every Python dependency of the plugin is pinned by SHA-256 in <code className="font-mono text-cyan-200">requirements.lock</code> and installed with <code className="font-mono text-cyan-200">--require-hashes</code>.</p>
          </Card>

          <Card title="Public keys">
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Public keys">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gridline"><th className="py-2 pr-4 text-primary">Key</th><th className="py-2 text-primary">Value</th></tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gridline/50 align-top">
                    <td className="py-2 pr-4 text-primary">Plugin release signing (Ed25519, raw base64)</td>
                    <td className="py-2 font-mono text-xs break-all">{PLUGIN_SIGNING_KEY}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-2 pr-4 text-primary">Decoder licence verification (Ed25519, SPKI DER base64)</td>
                    <td className="py-2 font-mono text-xs break-all">{DECODER_LICENCE_KEY}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>The licence key is embedded in the package; it only verifies tokens and cannot issue them.</p>
          </Card>

          <Card title="Data handling">
            <p>
              We hold only purchase and licence records (organisation, e-mail, plan, receipt, token) and support messages. Card data stays with Stripe. Details, providers and retention are in the{' '}
              <Link to="/privacy" className="text-cyan-300 hover:underline">Privacy Policy</Link>, written for Québec&apos;s Law 25.
            </p>
            <p>
              Revoked licences are published at{' '}
              <a href="https://qector.store/stripe/revoked.txt" {...ext}>qector.store/stripe/revoked.txt</a>; air-gapped sites can copy it to <code className="font-mono text-cyan-200">~/.qector/revoked.txt</code>.
            </p>
          </Card>

          <Card title="Report a vulnerability">
            <p>
              E-mail <a href="mailto:admin@qector.store?subject=%5BSECURITY%5D%20QECTOR%20disclosure" className="text-cyan-300 hover:underline">admin@qector.store</a> with the subject <code className="font-mono text-cyan-200">[SECURITY] QECTOR disclosure</code>. Include the component, version, platform, reproduction steps and impact. Please do not publish details before a fix is available.
            </p>
            <p>
              We acknowledge reports within 5 business days and coordinate disclosure with you. Supported versions: decoder 1.0.x and Claude plugin 2.0.x. Full policy:{' '}
              <a href="https://github.com/GuillaumeLessard/qector-decoder/blob/main/SECURITY.md" {...ext}>decoder SECURITY.md</a>,{' '}
              <a href="https://github.com/GuillaumeLessard/qector-claude-plugin/blob/main/SECURITY.md" {...ext}>plugin SECURITY.md</a>, and{' '}
              <a href="/.well-known/security.txt" className="text-cyan-300 hover:underline">security.txt</a>.
            </p>
          </Card>

          <Card title="Procurement">
            <ul className="space-y-2 list-disc pl-5">
              <li><strong className="text-primary">Seller:</strong> Guillaume Lessard, sole proprietor trading as iD01t Productions, 288 boul. des Ormeaux, Longueuil, Québec, Canada J4L 1J4.</li>
              <li><strong className="text-primary">Contract:</strong> the <Link to="/license-agreement" className="text-cyan-300 hover:underline">Commercial Licence Agreement</Link> (<Link to="/fr/license-agreement" className="text-cyan-300 hover:underline">français</Link>); Enterprise deals use a signed agreement.</li>
              <li><strong className="text-primary">Payment:</strong> card or invoice through Stripe, in USD; tax numbers accepted at checkout.</li>
              <li><strong className="text-primary">On request:</strong> W-8BEN for US customers, completed security questionnaires, and a call with the developer. Write to <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>.</li>
            </ul>
          </Card>
        </div>
      </section>
    </>
  );
}
