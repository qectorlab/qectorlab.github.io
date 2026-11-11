import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import { PRICES, usdFr } from '../lib/pricing';
import { PYPI_INSTALL_SPEC } from '../lib/releases';

// French twin of /license. Same facts, same order; keep the two in sync.

const code = 'text-cyan-300 font-mono text-xs';

export default function LicenseFR() {
  return (
    <>
      <SEO
        title="Licence · QECTOR"
        description={`Conditions de licence de QECTOR Decoder v3 et procédure d’activation du jeton. PolyForm Noncommercial pour l’usage communautaire; forfaits commerciaux dès ${usdFr(PRICES.proMonthly)}/mois, vérifiés hors ligne.`}
        lang="fr"
        alternates={[
          { lang: 'en', href: 'https://qector.store/license/' },
          { lang: 'fr', href: 'https://qector.store/fr/license/' },
        ]}
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="eyebrow-pill mb-6">
            PolyForm Noncommercial 1.0.0 · Gratuit pour la recherche · Usage commercial sous licence · Mis à jour en novembre 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"><NeuralReveal text="Licence" className="text-4xl md:text-6xl font-extrabold" /></h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Le code source de QECTOR Decoder v3 est <span className="text-primary font-semibold">disponible</span>, mais son usage commercial n’est pas gratuit.
            Gratuit pour l’usage personnel, académique et la recherche non commerciale. L’usage commercial exige un forfait payant dès{' '}
            <span className="text-cyan-300 font-semibold">{usdFr(PRICES.proMonthly)}/mois</span>, avec une{' '}
            <span className="text-cyan-300 font-semibold">garantie de remboursement de {PRICES.refundDays} jours</span>. Le Workbench est gratuit.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/fr/pricing" className="btn-cyan">Voir les tarifs</Link>
            <a href="mailto:admin@qector.store" className="btn-outline">Nous écrire</a>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Licence communautaire</h2>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              QECTOR Decoder v3 est publié sous la <strong className="text-primary">PolyForm Noncommercial License 1.0.0</strong>.
              Vous pouvez utiliser, modifier et distribuer le logiciel gratuitement à des fins non commerciales.
            </p>
            <div className="p-4 bg-void rounded-xl">
              <h3 className="text-cyan-300 font-semibold text-sm mb-2">Permis (non commercial)</h3>
              <ul className="space-y-1 text-secondary text-sm">
                <li>• Recherche et apprentissage personnels</li>
                <li>• Recherche et enseignement universitaires</li>
                <li>• Usage par les universités, organismes de recherche publics, organismes de bienfaisance et institutions gouvernementales, quelle que soit leur source de financement</li>
                <li>• Projets libres non commerciaux</li>
                <li>• Publication de résultats de mesures (avec attribution)</li>
              </ul>
            </div>
            <div className="p-4 bg-void rounded-xl mt-4">
              <h3 className="text-gold-400 font-semibold text-sm mb-2">Exige une licence commerciale</h3>
              <ul className="space-y-1 text-secondary text-sm">
                <li>• Intégration dans un produit commercial</li>
                <li>• R-D commerciale interne</li>
                <li>• Travail d’une entreprise dans le cadre de contrats gouvernementaux, de défense ou universitaires</li>
                <li>• Redistribution dans des produits commerciaux</li>
                <li>• Usage en SaaS ou par API hébergée</li>
              </ul>
            </div>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Licence commerciale</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Chaque forfait payant est régi par le{' '}
              <Link to="/fr/license-agreement" className="text-cyan-300 hover:underline">Contrat de licence commerciale</Link>{' '}
              (<Link to="/license-agreement" hrefLang="en" className="text-cyan-300 hover:underline">English version</Link>).
              Toutes les licences commerciales comprennent le droit d’usage commercial (interne, sans nombre de postes), des ensembles
              d’artefacts reproductibles et l’examen prioritaire des bogues. La redistribution et les droits OEM ne sont pas inclus par défaut;
              écrivez à <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a> pour une licence OEM ou SaaS.
              Le détail des paliers est sur la page <Link to="/fr/pricing" className="text-cyan-300 hover:underline">Tarifs</Link>.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Licences perpétuelles</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Pro Perpétuel ({usdFr(PRICES.proPerpetual)}, paiement unique) : les mêmes droits que Pro, pour toutes les versions 1.x de
              qector-decoder-v3, y compris les correctifs et les mises à jour mineures; une nouvelle version majeure comme la 2.0 exige une nouvelle licence.
              Les licences achetées auparavant sous le nom Solo / Indie Perpétuel conservent leurs conditions d’origine.
            </p>
          </div>

          <div className="card-surface border-gold-400/25">
            <h2 className="text-xl font-bold mb-4">Ce que change une licence payante</h2>
            <ul className="space-y-2 text-secondary text-sm">
              <li>• Accorde l’usage commercial que PolyForm Noncommercial exclut, pour la durée achetée.</li>
              <li>• <strong className="text-primary">Usage interne seulement.</strong> La redistribution, la sous-licence, l’intégration OEM et les services SaaS ou API hébergées offerts à des clients sont exclus, sauf entente écrite Entreprise ou OEM.</li>
              <li>• S’active en réglant <code className={code}>QECTOR_LICENSE</code> et <code className={code}>QECTOR_LICENSE_KEY</code> à votre jeton Ed25519. La vérification se fait hors ligne, avec une clé publique intégrée au paquet : aucun serveur de licences, aucune communication sortante, fonctionne sur un réseau isolé.</li>
              <li>• <strong className="text-primary">Le paquet est identique avec ou sans licence.</strong> Sans jeton, un avis de licence s’affiche à l’importation (masquable avec <code className={code}>QECTOR_SILENT=1</code>). Le jeton masque l’avis et débloque les fonctions liées au palier : décodage GPU par lots (CUDA/OpenCL) sur tous les forfaits payants, et une distance de code maximale de 7 (Communauté), 19 (Pro) ou 63 (Labo, Entreprise). Le décodage CPU n’est jamais bloqué; les plafonds de distance ne s’appliquent que si <code className={code}>QECTOR_ENFORCE=1</code> est réglé.</li>
              <li>• Aucune garantie, indemnisation, exclusivité, marque de commerce ni licence de brevet n’est incluse par défaut.</li>
            </ul>
            <p className="text-secondary text-sm leading-relaxed mt-4">
              Les jetons sont livrés en quelques minutes, et chaque forfait est assorti d’une garantie de remboursement de {PRICES.refundDays} jours sur le premier paiement :
              voir la <Link to="/fr/refund" className="text-cyan-300 hover:underline">Politique de remboursement</Link>. Une licence remboursée prend fin au remboursement.
            </p>
          </div>

          <div className="card-surface border-cyan-300/25">
            <h2 className="text-xl font-bold mb-4">Activer votre licence</h2>
            <ol className="space-y-3 text-secondary text-sm leading-relaxed">
              <li><strong className="text-primary">1. Achat vérifié.</strong> Le service de livraison n’accepte qu’un événement de paiement Stripe signé et enregistre la référence Stripe, le courriel, le palier et le jeton dans un registre protégé.</li>
              <li><strong className="text-primary">2. Installer.</strong> <code className={code}>python -m pip install --upgrade "{PYPI_INSTALL_SPEC}"</code> depuis le projet PyPI officiel.</li>
              <li><strong className="text-primary">3. Régler les deux variables.</strong> Donnez à <code className={code}>QECTOR_LICENSE</code> et à <code className={code}>QECTOR_LICENSE_KEY</code> le même jeton, reçu par courriel. La première sert à l’avis d’importation, la seconde au moteur selon le palier.</li>
              <li><strong className="text-primary">4. Vérifier hors ligne.</strong> <code className={code}>python -c "import qector_decoder_v3 as q; print(q.get_license_info()['tier'])"</code> doit afficher votre palier payant (par exemple <code className="text-cyan-300">Pro</code>) et non <code className="text-cyan-300">Community</code>. Aucun serveur n’est contacté.</li>
              <li><strong className="text-primary">5. Conserver la preuve.</strong> Gardez le jeton avec la facture ou la confirmation Stripe. N’envoyez jamais le jeton dans une URL, un suivi de bogues, une messagerie ou un dépôt public.</li>
            </ol>
            <p className="text-secondary text-xs leading-relaxed mt-4">
              Courriel manquant ou jeton refusé? Écrivez à <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a> avec la référence Stripe.
              N’ouvrez pas un second paiement ni une contestation pendant que la livraison est corrigée.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Texte complet de la licence</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Le texte officiel de la PolyForm Noncommercial License 1.0.0 (en anglais) est publié à{' '}
              <a href="https://polyformproject.org/licenses/noncommercial/1.0.0" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline [overflow-wrap:anywhere]">
                polyformproject.org/licenses/noncommercial/1.0.0
              </a>{' '}
              et inclus tel quel dans chaque distribution (<code className={code}>LICENSE</code> dans la roue).
              Les résumés de cette page sont fournis à titre indicatif; en cas d’écart, le texte de la licence prévaut.
            </p>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-bold mb-4">Licences de tiers</h2>
            <p className="text-secondary text-sm leading-relaxed">
              QECTOR s’appuie sur plusieurs projets libres, dont Stim (Apache 2.0), PyMatching (Apache 2.0), NumPy (BSD) et NetworkX (BSD).
              Les attributions complètes sont incluses dans la distribution. Les noms de tiers sont des marques de leurs propriétaires respectifs;
              QECTOR n’est ni affilié à eux, ni commandité, ni approuvé par eux.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
