import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import PricingTierCard from '../components/PricingTierCard';
import NeuralReveal from '../components/NeuralReveal';
import { FAQ_ITEMS_FR } from '../lib/faqData';
import CodeBlock from '../components/CodeBlock';
import { LINKS, PRICES, usdFr } from '../lib/pricing';
import { PYPI_INSTALL_SPEC } from '../lib/releases';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function PricingFR() {
  const addRef = useScrollReveal({ y: 40, duration: 800 });

  return (
    <>
      <SEO
        title="Tarifs · QECTOR"
        description={`Licences commerciales QECTOR Decoder v3. Pro dès ${usdFr(PRICES.proMonthly)}/mois, Labo ${usdFr(PRICES.lab)}/an, Entreprise et OEM dès ${usdFr(PRICES.enterpriseFrom)}/an. Satisfait ou remboursé ${PRICES.refundDays} jours. Prix en USD; taxes ajoutées au paiement s’il y a lieu.`}
        lang="fr"
        alternates={[
          { lang: 'en', href: 'https://qector.store/pricing/' },
          { lang: 'fr', href: 'https://qector.store/fr/pricing/' },
        ]}
      />

      {/* HERO */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/10 via-surface/30 to-void" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-void to-void pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-bold text-cyan-300 uppercase tracking-widest mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse-dot" />
            Licences commerciales claires et transparentes
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            <NeuralReveal text="Licenciez QECTOR pour la production" className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70" />
          </h1>
          <p className="text-secondary text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Gratuit pour la recherche académique et non commerciale. Pour un usage commercial, choisissez un forfait :
            licences vérifiées hors ligne, entièrement hors réseau, annulables en tout temps, satisfait ou remboursé {PRICES.refundDays} jours sur votre premier paiement.
          </p>
        </div>
      </section>

      <div className="px-6 pb-24 max-w-6xl mx-auto space-y-20 relative z-10">

        {/* 1. ASSURANCES */}
        <div ref={(el) => addRef(el, 0)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="card-surface py-6"><p className="text-cyan-300 font-bold">Hors réseau</p><p className="text-secondary text-sm mt-1">Jeton signé, vérifié hors ligne. Aucun serveur de licence, aucun appel réseau.</p></div>
          <div className="card-surface py-6"><p className="text-cyan-300 font-bold">Remboursé {PRICES.refundDays} jours</p><p className="text-secondary text-sm mt-1">Remboursement complet de votre premier paiement de tout forfait, sans question.</p></div>
          <div className="card-surface py-6"><p className="text-cyan-300 font-bold">Annulable en tout temps</p><p className="text-secondary text-sm mt-1">Votre licence reste valide jusqu’à la fin de la période payée.</p></div>
        </div>

        {/* 2. PLANS */}
        <div ref={(el) => addRef(el, 1)}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Forfaits commerciaux</h2>
            <p className="text-secondary text-lg mb-4">
              Droits de production pour l’usage interne de votre organisation. Les abonnements se renouvellent automatiquement jusqu’à annulation.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-400/30 rounded-full text-xs font-semibold text-blue-300">
              <GraduationCap size={14} className="shrink-0" aria-hidden="true" /> {PRICES.academicDiscountPct} % de rabais sur Labo pour les établissements d’enseignement. La recherche non commerciale est gratuite.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <PricingTierCard
              name="Pro"
              price={usdFr(PRICES.proMonthly)}
              period="/ mois"
              desc={`Ou ${usdFr(PRICES.proAnnual)}/an (2 mois offerts). Palier de licence Pro.`}
              featured
              featuredLabel="Le plus populaire"
              features={['Usage commercial interne', 'Toutes les familles de décodeurs', 'Lots CPU + GPU (CUDA/OpenCL)', 'Distances de code jusqu’à 19', 'Support courriel (2 jours ouvrables)']}
              ctaLabel="Acheter au mois"
              ctaHref={LINKS.proMonthly}
            />
            <PricingTierCard
              name="Labo"
              price={usdFr(PRICES.lab)}
              period="/ an"
              desc="Palier de licence Entreprise, pour les groupes de recherche et laboratoires."
              features={['Tout Pro', 'Distances de code jusqu’à 63', 'Support prioritaire avec SLA', 'Appel d’intégration de 2 h', 'Un rapport de validation (valeur 5 000 $)']}
              ctaLabel="Acheter Labo"
              ctaHref={LINKS.lab}
            />
            <PricingTierCard
              name="Entreprise & OEM"
              price={`${PRICES.enterpriseFrom / 1000} k$+`}
              period="/ an"
              desc="Redistribution, SaaS, OEM et conditions sur mesure."
              accent="gold"
              features={['Contrat signé, conditions sur mesure', 'SaaS et API offertes aux clients', 'OEM et regroupement matériel', 'Ingénieur de support attitré']}
              ctaLabel="Contacter l’équipe commerciale"
              ctaHref="/contact"
            />
          </div>

          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-secondary">
              Pro facturé à l’année : <a href={LINKS.proAnnual} className="text-cyan-400 hover:underline" rel="noopener">{usdFr(PRICES.proAnnual)} / an</a>.{' '}
              Vous préférez l’acheter définitivement ? <a href={LINKS.proPerpetual} className="text-cyan-400 hover:underline" rel="noopener"><strong>Pro Perpétuel : {usdFr(PRICES.proPerpetual)} paiement unique</strong></a>{' '}
              (toutes les versions 1.x, 12 mois de support).
            </p>
          </div>
        </div>

        {/* 3. ADDITIONAL SERVICES (Validation Sprint) */}
        <div ref={(el) => addRef(el, 2)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-surface border-gold-400/20 bg-gold-400/5">
            <h3 className="text-2xl font-bold text-gold-400 mb-2">QECTOR Validation Sprint</h3>
            <p className="text-sm text-gold-200/60 mb-4">3 750 $ paiement unique · Livraison en 10-20 jours</p>
            <p className="text-secondary text-sm mb-6">
              La voie rapide recommandée pour les équipes qui veulent une preuve immédiate et défendable de la valeur sur leur flux de travail.
              Nous exécutons jusqu’à 3 charges de référence standard avec QECTOR et livrons des lots d’artefacts reproductibles.
            </p>
            <ul className="text-secondary text-sm space-y-2 mb-8">
              <li className="flex gap-2"><span className="text-gold-400">✓</span> Inclut une licence Pilote de {PRICES.pilotDays} jours</li>
              <li className="flex gap-2"><span className="text-gold-400">✓</span> Analyse comparative vs PyMatching/Stim</li>
              <li className="flex gap-2"><span className="text-gold-400">✓</span> Appel de révision des résultats de 60 minutes</li>
            </ul>
            <Link to="/contact" className="btn-gold block text-center">Demander un sprint de validation</Link>
            <p className="text-xs text-gold-200/60 mt-6">
              Seulement la licence et un appel ? Le <a href={LINKS.pilot} className="text-gold-400 hover:underline" rel="noopener">Pilote de {PRICES.pilotDays} jours est à {usdFr(PRICES.pilot)}</a> :
              {' '}un appel d’intégration d’une heure et une note de validation écrite, crédités à 100 % sur Labo dans les 90 jours.
            </p>
          </div>

          <div className="card-surface bg-surface border-gridline">
            <h3 className="text-2xl font-bold mb-4">Activer votre licence</h3>
            <p className="text-secondary text-sm mb-6">
              Tout le monde installe la même wheel depuis PyPI : il n’existe pas de build commercial séparé.
              Votre jeton déverrouille les fonctionnalités payantes : décodage GPU (CUDA/OpenCL) par lots sur tous les forfaits payants, et distances de code jusqu’à 63 sur Labo et Entreprise.
              Le décodage CPU n’est jamais bloqué; les plafonds de distance ne s’appliquent que si QECTOR_ENFORCE=1.
            </p>
            <CodeBlock
              language="bash"
              className="mb-6"
              code={`pip install --upgrade "${PYPI_INSTALL_SPEC}"
export QECTOR_LICENSE_KEY="<votre-jeton>"
export QECTOR_LICENSE="<votre-jeton>"

# Vérifier hors ligne : affiche Pro ou Enterprise
python -c "import qector_decoder_v3 as q; print(q.get_license_info()['tier'])"`}
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Les jetons sont vérifiés hors ligne contre une clé publique embarquée dans le paquet : aucun serveur de licence, aucun appel maison, fonctionne complètement hors réseau.
            </p>
          </div>
        </div>

        {/* 4. COMPARISON AND WHY QECTOR */}
        <div ref={(el) => addRef(el, 3)}>
          <h2 className="text-3xl font-bold mb-8 text-center">Pourquoi licencier QECTOR ?</h2>
          <div className="card-surface bg-surface/50 border border-gridline">
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Comparaison de l’usage gratuit et sous licence">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gridline/50">
                    <th className="text-left py-4 px-6 text-cyan-300 font-semibold text-sm">Gratuit (source disponible)</th>
                    <th className="text-left py-4 px-6 text-gold-400 font-semibold text-sm">Licencié (commercial)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gridline/30">
                    <td className="py-4 px-6 text-secondary border-r border-gridline/30">Usage de recherche non commerciale seulement</td>
                    <td className="py-4 px-6 text-primary font-medium">Droits internes de R&D et de production</td>
                  </tr>
                  <tr className="border-b border-gridline/30">
                    <td className="py-4 px-6 text-secondary border-r border-gridline/30">Support communautaire (GitHub Issues)</td>
                    <td className="py-4 px-6 text-primary font-medium">Support courriel prioritaire et SLA</td>
                  </tr>
                  <tr className="border-b border-gridline/30">
                    <td className="py-4 px-6 text-secondary border-r border-gridline/30">QECTOR Workbench GUI (gratuit)</td>
                    <td className="py-4 px-6 text-primary font-medium">Harnais de reproduction d’artefacts de validation</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-secondary border-r border-gridline/30">Licence PolyForm Noncommercial</td>
                    <td className="py-4 px-6 text-primary font-medium">Contrat de licence commerciale écrit</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 5. FAQ */}
        <div ref={(el) => addRef(el, 4)} className="pt-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Foire aux questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {FAQ_ITEMS_FR.map((item, idx) => (
              <details key={idx} className="faq-item group bg-surface/30 border border-gridline/40 rounded-2xl hover:bg-surface/60 transition-colors">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-5 min-h-[44px] text-base font-bold text-cyan-300">
                  <h3 className="text-base font-bold">{item.q}</h3>
                  <span aria-hidden="true" className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="text-secondary text-sm leading-relaxed px-5 pb-5">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* 6. FINE PRINT & PROCUREMENT */}
        <div ref={(el) => addRef(el, 5)} className="border-t border-gridline/40 pt-12 text-center text-xs text-muted-foreground max-w-3xl mx-auto space-y-4">
          <p>
            <strong>Ce qui n’est pas inclus :</strong> sauf mention explicite, aucun palier n’inclut la redistribution, l’OEM, l’hébergement SaaS ni les droits de sous-licence. Contactez notre équipe commerciale pour des conditions sur mesure.
          </p>
          <p>
            <strong>Approvisionnement :</strong> tous les prix sont en USD; les taxes applicables sont ajoutées au paiement. Les forfaits mensuels et annuels se renouvellent automatiquement jusqu’à annulation, avec un rappel avant chaque renouvellement annuel.
            {' '}Satisfait ou remboursé {PRICES.refundDays} jours sur votre premier paiement de tout forfait. Les jetons sont envoyés par courriel en quelques minutes.
          </p>
          <p>
            En achetant, vous acceptez le <Link to="/fr/license-agreement" className="text-cyan-300 hover:underline">Contrat de licence commerciale</Link>.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4">
            <Link to="/fr/license-agreement" className="hover:text-cyan-300 transition-colors">Contrat de licence</Link>
            <Link to="/fr/refund" className="hover:text-cyan-300 transition-colors">Politique de remboursement</Link>
            <a href="https://billing.stripe.com/p/login/7sY9AVdwlgoyfse9bYeUU00" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">Gérer l’abonnement</a>
            <Link to="/contact" className="hover:text-cyan-300 transition-colors">Contacter l’ingénierie</Link>
          </div>
        </div>

      </div>
    </>
  );
}
