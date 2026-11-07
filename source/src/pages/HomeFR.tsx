import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import CodeBlock from '../components/CodeBlock';
import { PRICES, usdFr } from '../lib/pricing';

// Page d'accueil en français. Les pages produit détaillées restent en anglais;
// les pages commerciales et juridiques ont toutes leur version française.

const PRODUITS = [
  { titre: 'QECTOR Decoder v3', texte: 'La bibliothèque Python à noyau Rust : Union-Find, MWPM exact (Blossom), BP-OSD et Relay-BP pour les codes qLDPC, décodage par lots CPU et GPU, intégration Stim et Sinter.', lien: '/fr/decoder', libelle: 'Le décodeur' },
  { titre: 'Plugiciel Claude', texte: 'Un serveur MCP isolé du réseau (air-gapped) qui apporte le décodage vérifié dans Claude Code et Claude Desktop, avec schémas validés et versions signées.', lien: '/claude-plugin', libelle: 'Le plugiciel (anglais)' },
  { titre: 'Workbench', texte: 'L’application de bureau gratuite pour Windows et Linux : constructeur de circuits, familles de codes et décodeurs, sans installation de Python.', lien: '/workbench', libelle: 'Le Workbench (anglais)' },
];

const GARANTIES = [
  ['Chaque correction est vérifiée', 'Chaque résultat satisfait H·c = s (mod 2) : la correction reproduit le syndrome.'],
  ['Licences hors ligne', 'Jetons Ed25519 vérifiés localement. Aucun serveur de licence, aucune télémétrie : fonctionne sur des machines isolées.'],
  ['Versions vérifiables', '18 wheels construites dans GitHub Actions, avec provenance Sigstore et attestations PyPI, testées sur chaque système avant publication.'],
  ['Aucun nombre de postes', 'Une licence couvre l’usage interne de votre organisation, sur autant de machines et par autant de personnes que nécessaire.'],
];

export default function HomeFR() {
  return (
    <>
      <SEO
        title="QECTOR · Décodage de correction d’erreurs quantiques pour Python"
        description={`QECTOR Decoder v3 : décodeurs QEC à noyau Rust pour Python (Union-Find, MWPM, BP-OSD, Relay-BP, GPU). Gratuit pour la recherche non commerciale; licences commerciales dès ${usdFr(PRICES.proMonthly)}/mois, vérifiées hors ligne.`}
        lang="fr"
        alternates={[
          { lang: 'en', href: 'https://qector.store/' },
          { lang: 'fr', href: 'https://qector.store/fr/' },
          { lang: 'x-default', href: 'https://qector.store/' },
        ]}
      />

      <section className="relative pt-36 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding max-w-4xl mx-auto">
          <div className="eyebrow-pill mb-6">v1.0.1 · 18 wheels vérifiées</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-400">Décodage QEC</span> pour Python
          </h1>
          <p className="text-secondary text-lg md:text-xl leading-relaxed mb-4">
            Une seule bibliothèque pour plusieurs familles de décodeurs sur la même matrice de contrôle : Union-Find, MWPM exact,
            BP-OSD et Relay-BP pour les codes qLDPC, sur CPU et GPU, avec Stim et Sinter.{' '}
            <span className="text-primary font-semibold">Chaque correction est vérifiée contre son syndrome</span>, et les licences
            commerciales se vérifient hors ligne.
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            Gratuit pour la recherche universitaire et non commerciale. Forfaits commerciaux dès {usdFr(PRICES.proMonthly)}/mois,
            avec garantie de remboursement de {PRICES.refundDays} jours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link to="/fr/pricing" className="btn-gold px-8 py-4">Voir les forfaits →</Link>
            <Link to="/fr/decoder" className="btn-cyan px-8 py-4">Découvrir le décodeur</Link>
          </div>
          <div className="max-w-2xl mx-auto text-left">
            <CodeBlock language="bash" filename="Démarrage rapide" code={`pip install qector-decoder-v3==1.0.1\npython -c "from qector_decoder_v3 import BlossomDecoder; print('QECTOR OK')"`} />
          </div>
        </div>
      </section>

      <section className="section-padding pb-16">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-6">
          {GARANTIES.map(([t, d]) => (
            <div key={t} className="card-surface">
              <h2 className="text-lg font-bold mb-2">{t}</h2>
              <p className="text-secondary text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Les produits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PRODUITS.map((p) => (
              <div key={p.titre} className="card-surface flex flex-col">
                <h3 className="text-lg font-bold mb-2">{p.titre}</h3>
                <p className="text-secondary text-sm leading-relaxed flex-1">{p.texte}</p>
                <Link to={p.lien} hrefLang={p.lien.startsWith('/fr') ? undefined : 'en'} className="text-cyan-300 text-sm mt-4 hover:underline">{p.libelle} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto card-surface">
          <h2 className="text-xl font-bold mb-4">En français</h2>
          <ul className="space-y-2 text-secondary text-sm list-disc pl-5">
            <li><Link to="/fr/decoder" className="text-cyan-300 hover:underline">Le décodeur</Link> et sa <Link to="/fr/license" className="text-cyan-300 hover:underline">licence</Link> (usage gratuit, usage commercial, activation).</li>
            <li><Link to="/fr/pricing" className="text-cyan-300 hover:underline">Tarifs et forfaits</Link> : Pro, Labo, Pilote et Entreprise.</li>
            <li><Link to="/fr/license-agreement" className="text-cyan-300 hover:underline">Contrat de licence commerciale</Link>, version 2026-11.</li>
            <li><Link to="/fr/privacy" className="text-cyan-300 hover:underline">Politique de confidentialité</Link> (Loi 25).</li>
            <li><Link to="/fr/terms" className="text-cyan-300 hover:underline">Conditions d’utilisation</Link> et <Link to="/fr/refund" className="text-cyan-300 hover:underline">politique de remboursement</Link>.</li>
          </ul>
          <p className="text-secondary text-sm mt-4">
            La documentation technique est en anglais. Pour toute question, écrivez-nous en français à{' '}
            <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a>.
          </p>
        </div>
      </section>
    </>
  );
}
