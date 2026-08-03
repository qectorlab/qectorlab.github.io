import { SEO } from '../lib/seo';

export default function Terms() {
  return (
    <>
      <SEO title="Terms of Service · QECTOR" description="Terms of service for QECTOR website and software." />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-gridline rounded-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            Governing Law: Québec, Canada · Last updated June 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">Terms of Service</h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            By using QECTOR software or this website, you agree to these terms.
            Questions? <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Seller identity block. Stripe and EU/UK distance-selling rules
              expect an identifiable seller and address before the first sale;
              omitting it is what turns a routine chargeback into a lost one. */}
          <div className="card-surface border-cyan-300/25">
            <h2 className="text-xl font-bold mb-4">Who You Are Buying From</h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              QECTOR software and commercial licenses are sold by{' '}
              <strong className="text-primary">Guillaume Lessard</strong>, sole proprietor, trading as
              iD01t Productions, Québec, Canada.
            </p>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              Registered address: 2004 De Lorimier, Longueuil, Québec, Canada, J4K 3H7.
              <br />
              Contact: <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              All prices are quoted and charged in <strong className="text-primary">US dollars (USD)</strong>, exclusive of tax.
              Stripe processes all payments and adds applicable sales tax, GST/HST, or VAT at checkout based on your billing
              location; card details never reach QECTOR systems. License tokens are delivered instantly by email and all sales
              are final — see the <a href="/refund" className="text-cyan-300 hover:underline">Refund Policy</a>.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Acceptance of Terms</h2>
            <p className="text-secondary text-sm leading-relaxed">
              By accessing or using the QECTOR website, software, or services, you agree to be bound by these Terms of Service.
              If you do not agree, do not use our services.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Software License</h2>
            <p className="text-secondary text-sm leading-relaxed">
              QECTOR Decoder v3 is licensed under the PolyForm Noncommercial License 1.0.0 for non-commercial use.
              Commercial use requires a separate commercial license agreement. See the{' '}
              <a href="/license" className="text-cyan-300 hover:underline">License page</a> for details.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Disclaimer of Warranties</h2>
            <p className="text-secondary text-sm leading-relaxed">
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
              TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. QECTOR Decoder v3 is Source Available (PolyForm Noncommercial for community / research use; commercial license required for commercial use). It is simulation-validated software, not a production fault-tolerance stack.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Limitation of Liability</h2>
            <p className="text-secondary text-sm leading-relaxed">
              IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
              WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
              SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Governing Law</h2>
            <p className="text-secondary text-sm leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of Québec, Canada.
              Any disputes shall be resolved in the courts of Montréal, Québec.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Changes to Terms</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
              Continued use of the services constitutes acceptance of the modified terms.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Contact</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Questions about these terms? Contact us at{' '}
              <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
