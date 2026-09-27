import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';

export default function TermsFR() {
  return (
    <>
      <SEO title="Conditions générales · QECTOR" description="Conditions d’utilisation du site et du logiciel QECTOR." lang="fr" alternates={[
          { lang: 'en', href: 'https://qector.store/terms/' },
          { lang: 'fr', href: 'https://qector.store/fr/terms/' },
        ]} />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-gridline rounded-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            Droit applicable : Québec, Canada · Dernière mise à jour : juin 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"><NeuralReveal text="Conditions générales" className="text-4xl md:text-6xl font-extrabold" /></h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            En utilisant le logiciel QECTOR ou ce site web, vous acceptez ces conditions.
            Questions ? <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Seller identity block. Stripe and EU/UK distance-selling rules
              expect an identifiable seller and address before the first sale;
              omitting it is what turns a routine chargeback into a lost one. */}
          <div className="card-surface border-cyan-300/25">
            <h2 className="text-xl font-bold mb-4">Chez qui vous achetez</h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              Le logiciel QECTOR et les licences commerciales sont vendus par{' '}
              <strong className="text-primary">Guillaume Lessard</strong>, entrepreneur individuel, exploitant sous le nom
              iD01t Productions, Québec, Canada.
            </p>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              Adresse enregistrée : 2004 De Lorimier, Longueuil, Québec, Canada, J4K 3H7.
              <br />
              Contact : <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              Tous les prix sont affichés et facturés en <strong className="text-primary">dollars américains (USD)</strong>, hors taxes.
              Stripe traite tous les paiements et ajoute la taxe de vente, la TPS/TVH ou la TVA applicable au paiement selon votre adresse
              de facturation; les données de carte ne parviennent jamais aux systèmes de QECTOR. Les jetons de licence sont livrés instantanément par courriel et toutes les ventes
              sont finales : voir la <a href="/refund" className="text-cyan-300 hover:underline">politique de remboursement</a>.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Acceptation des conditions</h2>
            <p className="text-secondary text-sm leading-relaxed">
              En accédant au site web, au logiciel ou aux services de QECTOR, ou en les utilisant, vous acceptez d’être lié par ces conditions générales.
              Si vous n’acceptez pas, n’utilisez pas nos services.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Licence du logiciel</h2>
            <p className="text-secondary text-sm leading-relaxed">
              QECTOR Decoder v3 est concédé sous la licence PolyForm Noncommercial 1.0.0 pour l’usage non commercial.
              L’usage commercial exige un contrat de licence commerciale distinct. Voir la{' '}
              <a href="/license" className="text-cyan-300 hover:underline">page de licence</a> pour les détails.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Exclusion de garanties</h2>
            <p className="text-secondary text-sm leading-relaxed">
              LE LOGICIEL EST FOURNI « TEL QUEL », SANS GARANTIE D’AUCUNE SORTE, EXPRESSE OU IMPLICITE, Y COMPRIS, SANS S’Y LIMITER,
              LES GARANTIES DE QUALITÉ MARCHANDE, D’ADAPTATION À UN USAGE PARTICULIER ET DE NON-VIOLATION. QECTOR Decoder v3 est à source disponible (PolyForm Noncommercial pour l’usage communautaire / recherche; licence commerciale exigée pour l’usage commercial). C’est un logiciel validé par simulation, pas une pile de tolérance aux pannes de production.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Limitation de responsabilité</h2>
            <p className="text-secondary text-sm leading-relaxed">
              EN AUCUN CAS LES AUTEURS OU LES DÉTENTEURS DES DROITS D’AUTEUR NE SERONT RESPONSABLES DE TOUTE RÉCLAMATION, DE TOUT DOMMAGE OU DE TOUTE AUTRE RESPONSABILITÉ,
              QUE CE SOIT DANS LE CADRE D’UNE ACTION CONTRACTUELLE, DÉLICTUELLE OU AUTRE, DÉCOULANT DU LOGICIEL OU DE SON UTILISATION OU D’AUTRES RAPPORTS AVEC LE LOGICIEL, OU S’Y RAPPORTANT.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Droit applicable</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Ces conditions sont régies et interprétées conformément aux lois du Québec, Canada.
              Tout litige sera tranché devant les tribunaux de Montréal, Québec.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Modifications des conditions</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet immédiatement après leur publication.
              La poursuite de l’utilisation des services vaut acceptation des conditions modifiées.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Contact</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Des questions sur ces conditions ? Écrivez-nous à{' '}
              <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
