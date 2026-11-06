import type { LegalDoc } from '../lib/legal';

// Commercial Licence Agreement for QECTOR Decoder v3. Versioned: the version in
// force on the date of purchase governs that paid term. Keep EN and FR in step.
// Drafted for review by a Québec lawyer; not legal advice.

export const AGREEMENT_VERSION = '2026-11';
export const AGREEMENT_EFFECTIVE_EN = '6 November 2026';
export const AGREEMENT_EFFECTIVE_FR = '6 novembre 2026';

export const licenseAgreementEn: LegalDoc = {
  lang: 'en',
  path: '/license-agreement',
  twin: '/fr/license-agreement',
  title: 'Commercial Licence Agreement',
  seoTitle: 'Commercial Licence Agreement · QECTOR Decoder v3',
  description:
    'The commercial licence agreement for QECTOR Decoder v3: internal commercial use, no seat counts, offline (air-gapped) licence verification, plans, renewals, refunds, liability and governing law.',
  badge: `Version ${AGREEMENT_VERSION} · Effective ${AGREEMENT_EFFECTIVE_EN} · Governing law: Québec`,
  intro:
    'These terms apply when your organisation buys any QECTOR plan. Non-commercial use stays free under the [PolyForm Noncommercial License 1.0.0](/license).',
  version: `Version ${AGREEMENT_VERSION}, effective ${AGREEMENT_EFFECTIVE_EN}. The version in force on the date of your purchase or renewal governs that paid term.`,
  sections: [
    {
      id: 'parties',
      heading: '1. Parties and acceptance',
      accent: true,
      paras: [
        'This agreement is between **Guillaume Lessard**, sole proprietor trading as **iD01t Productions**, 2004 De Lorimier, Longueuil, Québec, Canada, J4K 3H7 ("Licensor", "we"), and the organisation named at checkout ("Licensee", "you").',
        'You accept it by completing a purchase, by activating a licence token, or by using the Software commercially. The person who buys confirms they may bind the organisation. If you do not accept these terms, do not buy or use a paid plan. The [14-day money-back guarantee](/refund) applies.',
      ],
    },
    {
      id: 'definitions',
      heading: '2. Definitions',
      bullets: [
        '**Software:** the qector-decoder-v3 Python package and its compiled core, as published on PyPI and GitHub, with its documentation.',
        '**Plan:** the offer you bought (Pro, Pro Perpetual, Lab, Pilot or Enterprise), as described on the [Pricing page](/pricing) on the date of purchase.',
        '**Licence token:** the Ed25519-signed key we e-mail you, which the Software verifies offline.',
        '**Internal use:** use by your organisation, its employees and contractors working on its behalf, for its own purposes, including production.',
        '**Term:** the period you paid for (a month or a year for subscriptions, 60 days for the Pilot), or no end date for Pro Perpetual.',
      ],
    },
    {
      id: 'grant',
      heading: '3. Licence grant',
      paras: [
        'Subject to payment and to this agreement, we grant you a non-exclusive, non-transferable, worldwide licence to install and use the Software for Internal use during the Term, at the licence tier of your Plan.',
        '**There are no seat or user counts.** You may install the Software on any number of machines and let any number of your personnel use it, provided they use it for your organisation. A licence covers one buying organisation; affiliates need their own licence unless an Enterprise agreement says otherwise.',
      ],
    },
    {
      id: 'plans',
      heading: '4. What each plan includes',
      table: {
        head: ['Plan', 'Scope'],
        rows: [
          ['Pro', 'Pro licence tier (GPU batch decoding, code distance 19), Internal use including production, e-mail support, every release published during the Term.'],
          ['Pro Perpetual', 'Pro rights with no end date for **every 1.x release** of qector-decoder-v3, including patch and minor updates, plus 12 months of e-mail support. A new major version (2.0 and later) is a new licence.'],
          ['Lab', 'Enterprise licence tier (GPU batch decoding, code distance 63), priority support with response targets agreed at onboarding, one onboarding call and one Validation Report per year.'],
          ['Pilot', 'A 60-day evaluation licence at the Pro tier with an integration call, for benchmarking, integration testing and studies, **not production**. Creditable toward Lab within 90 days.'],
          ['Enterprise', 'Hosted, SaaS or OEM rights and named support only as set out in a separate signed agreement, which prevails over this one.'],
        ],
      },
    },
    {
      id: 'restrictions',
      heading: '5. Restrictions',
      paras: ['Unless a signed Enterprise agreement allows it, you may not:'],
      bullets: [
        'redistribute, sell, sublicense, rent or lend the Software or a licence token;',
        'embed the Software in a product you distribute to others (OEM), or offer its decoding to third parties as a hosted service, API or SaaS;',
        'share a licence token outside your organisation or publish it;',
        'remove, bypass or tamper with licence checks, notices or tier limits;',
        'reverse engineer the compiled core, except to the extent applicable law allows it despite this restriction.',
      ],
    },
    {
      id: 'tokens',
      heading: '6. Licence tokens and offline verification',
      paras: [
        'Licence tokens are verified **offline** by the Software against a public key it ships with. There is no licence server, no activation call and no telemetry: the Software works on air-gapped machines.',
        'Keep your token confidential. If it is lost, exposed or tied to the wrong address, e-mail us and we will reissue it at no cost. A token may expire a few days after your paid period ends, to absorb late renewals; that grace period gives no rights beyond your Term.',
        'If a payment is fully refunded or disputed, we revoke the token and list it at [qector.store/stripe/revoked.txt](https://qector.store/stripe/revoked.txt); you must then stop using it.',
      ],
    },
    {
      id: 'term',
      heading: '7. Term, renewal and cancellation',
      paras: [
        'Pro (monthly or annual) and Lab are subscriptions that **renew automatically** for the same period at the current price until cancelled. We e-mail a reminder 14 days before each annual renewal. You may cancel at any time in the [customer portal](https://billing.stripe.com/p/login/7sY9AVdwlgoyfse9bYeUU00) or by e-mail; your licence stays valid until the end of the period you paid for.',
        'The Pilot ends after 60 days and does not renew. Pro Perpetual has no end date for the 1.x releases it covers.',
      ],
    },
    {
      id: 'fees',
      heading: '8. Fees, taxes and refunds',
      paras: [
        'Prices are in US dollars, exclusive of tax. Stripe collects payment and any sales tax, GST/QST or VAT that applies to your billing address. Every plan has a **14-day money-back guarantee** on the first payment, as set out in the [Refund Policy](/refund). Renewal payments follow the same policy.',
        'Academic institutions that buy a paid plan receive 40% off Lab. Non-commercial academic use remains free under the PolyForm Noncommercial License.',
      ],
    },
    {
      id: 'support',
      heading: '9. Support and updates',
      paras: [
        'Support is by e-mail at [admin@qector.store](mailto:admin@qector.store), with a first response within 2 business days on Pro and Pro Perpetual. Lab gets priority support with response targets agreed at onboarding. Subscriptions include every release published during the Term; Pro Perpetual includes every 1.x release.',
        'We may change or remove features in new releases. Releases you already received keep working under your licence.',
      ],
    },
    {
      id: 'ownership',
      heading: '10. Ownership and third-party components',
      paras: [
        'The Software is licensed, not sold. We keep all rights not expressly granted, including copyright and trademarks. Open-source components bundled with the Software remain under their own licences, which this agreement does not limit.',
        'Your inputs and outputs (codes, syndromes, circuits, results) are yours. The Software sends none of them to us.',
      ],
    },
    {
      id: 'warranty',
      heading: '11. Warranty',
      paras: [
        'Your remedy if the Software does not suit you is the 14-day money-back guarantee. Apart from that, the Software is provided **"as is"**, without any other warranty, express or implied, including merchantability, fitness for a particular purpose and non-infringement, to the extent the law allows.',
        'The Software is a simulation and research decoding library, validated by checking that every correction reproduces its syndrome. It is not certified for safety-critical use. Nothing in this agreement excludes a warranty that applicable law, including the Québec Consumer Protection Act where it applies, does not allow to be excluded.',
      ],
    },
    {
      id: 'liability',
      heading: '12. Limitation of liability',
      paras: [
        'To the extent the law allows, our total liability under this agreement is limited to the fees you paid in the 12 months before the event giving rise to the claim, and we are not liable for indirect, consequential or punitive damages, or for lost profits, data or business.',
        'These limits do not apply to bodily or moral injury, or to damage caused by intentional or gross fault, which Québec law does not allow to be excluded.',
      ],
    },
    {
      id: 'export',
      heading: '13. Export control and sanctions',
      paras: [
        'You will comply with the export control and sanctions laws of Canada and of any other country that applies to you, and will not use or transfer the Software to a person or destination those laws prohibit.',
      ],
    },
    {
      id: 'termination',
      heading: '14. Termination',
      paras: [
        'We may terminate your licence for a material breach of this agreement, such as use outside its scope, after written notice and a 15-day period to cure it. On termination you must stop commercial use and delete your licence tokens. No refund is due for the elapsed Term after a termination for breach.',
      ],
    },
    {
      id: 'privacy',
      heading: '15. Personal information',
      paras: [
        'We collect only what is needed to sell and deliver your licence. See the [Privacy Policy](/privacy) for what we collect, why, where it is stored and your rights under Québec law.',
      ],
    },
    {
      id: 'changes',
      heading: '16. Changes to this agreement',
      paras: [
        'We may publish new versions of this agreement. A new version applies to new purchases and, after at least 30 days’ notice by e-mail, to renewals. It never changes the terms of a period you have already paid for. Earlier versions remain available on request.',
      ],
    },
    {
      id: 'law',
      heading: '17. Governing law, language and entire agreement',
      paras: [
        'This agreement is governed by the laws of Québec and the federal laws of Canada that apply there. The courts of the judicial district of Montréal have jurisdiction, without depriving a consumer of the protection of the mandatory laws or courts of their place of residence.',
        'A French version of this agreement is available at [qector.store/fr/license-agreement](/fr/license-agreement) and was provided before its English version. The parties have expressly wished this agreement and related documents to be drawn up in English. Les parties ont expressément souhaité que la présente convention et les documents qui s’y rattachent soient rédigés en anglais, après avoir pris connaissance de la version française.',
        'This agreement, the Plan description on the date of purchase and the Refund Policy are the entire agreement for paid plans. A signed Enterprise agreement prevails over them where they conflict. If a clause is unenforceable, the rest remains in force.',
      ],
    },
  ],
};

export const licenseAgreementFr: LegalDoc = {
  lang: 'fr',
  path: '/fr/license-agreement',
  twin: '/license-agreement',
  title: 'Contrat de licence commerciale',
  seoTitle: 'Contrat de licence commerciale · QECTOR Decoder v3',
  description:
    'Le contrat de licence commerciale de QECTOR Decoder v3 : usage commercial interne, aucun nombre de postes, vérification hors ligne (air-gapped), forfaits, renouvellements, remboursements, responsabilité et droit applicable.',
  badge: `Version ${AGREEMENT_VERSION} · En vigueur le ${AGREEMENT_EFFECTIVE_FR} · Droit applicable : Québec`,
  intro:
    'Ces conditions s’appliquent lorsque votre organisation achète un forfait QECTOR. L’usage non commercial reste gratuit sous la [licence PolyForm Noncommercial 1.0.0](/license).',
  version: `Version ${AGREEMENT_VERSION}, en vigueur le ${AGREEMENT_EFFECTIVE_FR}. La version en vigueur à la date de votre achat ou de votre renouvellement régit cette période payée.`,
  sections: [
    {
      id: 'parties',
      heading: '1. Parties et acceptation',
      accent: true,
      paras: [
        'Le présent contrat est conclu entre **Guillaume Lessard**, entrepreneur individuel faisant affaire sous le nom **iD01t Productions**, 2004 De Lorimier, Longueuil (Québec) Canada J4K 3H7 (le « Concédant », « nous »), et l’organisation nommée lors du paiement (le « Licencié », « vous »).',
        'Vous l’acceptez en effectuant un achat, en activant un jeton de licence ou en utilisant le Logiciel à des fins commerciales. La personne qui achète confirme qu’elle peut engager l’organisation. Si vous n’acceptez pas ces conditions, n’achetez pas et n’utilisez pas de forfait payant. La [garantie de remboursement de 14 jours](/fr/refund) s’applique.',
      ],
    },
    {
      id: 'definitions',
      heading: '2. Définitions',
      bullets: [
        '**Logiciel :** le paquet Python qector-decoder-v3 et son noyau compilé, tels que publiés sur PyPI et GitHub, avec leur documentation.',
        '**Forfait :** l’offre achetée (Pro, Pro Perpétuel, Labo, Pilote ou Entreprise), telle que décrite sur la [page Tarifs](/fr/pricing) à la date d’achat.',
        '**Jeton de licence :** la clé signée Ed25519 que nous vous envoyons par courriel et que le Logiciel vérifie hors ligne.',
        '**Usage interne :** l’utilisation par votre organisation, ses employés et les contractuels qui travaillent pour elle, à ses propres fins, y compris en production.',
        '**Durée :** la période payée (un mois ou un an pour les abonnements, 60 jours pour le Pilote), ou sans date de fin pour Pro Perpétuel.',
      ],
    },
    {
      id: 'grant',
      heading: '3. Octroi de licence',
      paras: [
        'Sous réserve du paiement et du présent contrat, nous vous accordons une licence non exclusive, non transférable et mondiale d’installer et d’utiliser le Logiciel pour un Usage interne pendant la Durée, au palier de licence de votre Forfait.',
        '**Il n’y a aucun nombre de postes ni d’utilisateurs.** Vous pouvez installer le Logiciel sur autant de machines que vous le souhaitez et le faire utiliser par autant de membres de votre personnel que nécessaire, pourvu que ce soit pour votre organisation. Une licence couvre une seule organisation acheteuse; les sociétés affiliées ont besoin de leur propre licence, sauf disposition contraire d’un contrat Entreprise.',
      ],
    },
    {
      id: 'plans',
      heading: '4. Contenu de chaque forfait',
      table: {
        head: ['Forfait', 'Portée'],
        rows: [
          ['Pro', 'Palier de licence Pro (décodage GPU par lots, distance de code 19), Usage interne y compris en production, support par courriel, toutes les versions publiées pendant la Durée.'],
          ['Pro Perpétuel', 'Les droits Pro sans date de fin pour **toutes les versions 1.x** de qector-decoder-v3, y compris les mises à jour correctives et mineures, et 12 mois de support par courriel. Une nouvelle version majeure (2.0 et suivantes) est une nouvelle licence.'],
          ['Labo', 'Palier de licence Entreprise (décodage GPU par lots, distance de code 63), support prioritaire avec des délais de réponse convenus à l’intégration, un appel d’intégration et un rapport de validation par année.'],
          ['Pilote', 'Une licence d’évaluation de 60 jours au palier Pro avec un appel d’intégration, pour les essais de performance, les tests d’intégration et les études, **pas pour la production**. Créditable sur Labo dans les 90 jours.'],
          ['Entreprise', 'Droits d’hébergement, SaaS ou OEM et support dédié uniquement selon un contrat signé distinct, qui prévaut sur le présent contrat.'],
        ],
      },
    },
    {
      id: 'restrictions',
      heading: '5. Restrictions',
      paras: ['Sauf si un contrat Entreprise signé le permet, vous ne pouvez pas :'],
      bullets: [
        'redistribuer, vendre, sous-licencier, louer ou prêter le Logiciel ou un jeton de licence;',
        'intégrer le Logiciel dans un produit distribué à des tiers (OEM), ni offrir son décodage à des tiers comme service hébergé, API ou SaaS;',
        'partager un jeton de licence hors de votre organisation ni le publier;',
        'retirer, contourner ou altérer les vérifications de licence, les avis ou les limites de palier;',
        'faire de l’ingénierie inverse du noyau compilé, sauf dans la mesure où la loi applicable le permet malgré cette restriction.',
      ],
    },
    {
      id: 'tokens',
      heading: '6. Jetons de licence et vérification hors ligne',
      paras: [
        'Les jetons de licence sont vérifiés **hors ligne** par le Logiciel au moyen d’une clé publique qu’il contient. Il n’y a ni serveur de licence, ni appel d’activation, ni télémétrie : le Logiciel fonctionne sur des machines isolées (air-gapped).',
        'Gardez votre jeton confidentiel. S’il est perdu, exposé ou associé à la mauvaise adresse, écrivez-nous et nous le réémettrons sans frais. Un jeton peut expirer quelques jours après la fin de la période payée, pour absorber les renouvellements tardifs; ce délai de grâce ne donne aucun droit au-delà de la Durée.',
        'Si un paiement est entièrement remboursé ou contesté, nous révoquons le jeton et l’inscrivons à [qector.store/stripe/revoked.txt](https://qector.store/stripe/revoked.txt); vous devez alors cesser de l’utiliser.',
      ],
    },
    {
      id: 'term',
      heading: '7. Durée, renouvellement et résiliation',
      paras: [
        'Pro (mensuel ou annuel) et Labo sont des abonnements qui **se renouvellent automatiquement** pour la même période au prix en vigueur jusqu’à leur résiliation. Nous envoyons un rappel 14 jours avant chaque renouvellement annuel. Vous pouvez résilier en tout temps dans le [portail client](https://billing.stripe.com/p/login/7sY9AVdwlgoyfse9bYeUU00) ou par courriel; votre licence reste valide jusqu’à la fin de la période payée.',
        'Le Pilote prend fin après 60 jours et ne se renouvelle pas. Pro Perpétuel n’a pas de date de fin pour les versions 1.x qu’il couvre.',
      ],
    },
    {
      id: 'fees',
      heading: '8. Prix, taxes et remboursements',
      paras: [
        'Les prix sont en dollars américains, taxes en sus. Stripe perçoit le paiement et toute taxe de vente, TPS/TVQ ou TVA applicable selon votre adresse de facturation. Chaque forfait comporte une **garantie de remboursement de 14 jours** sur le premier paiement, selon la [Politique de remboursement](/fr/refund). Les paiements de renouvellement suivent la même politique.',
        'Les établissements d’enseignement qui achètent un forfait payant obtiennent 40 % de rabais sur Labo. L’usage universitaire non commercial reste gratuit sous la licence PolyForm Noncommercial.',
      ],
    },
    {
      id: 'support',
      heading: '9. Support et mises à jour',
      paras: [
        'Le support se fait par courriel à [admin@qector.store](mailto:admin@qector.store), avec une première réponse en 2 jours ouvrables pour Pro et Pro Perpétuel. Labo bénéficie d’un support prioritaire avec des délais convenus à l’intégration. Les abonnements comprennent toutes les versions publiées pendant la Durée; Pro Perpétuel comprend toutes les versions 1.x.',
        'Nous pouvons modifier ou retirer des fonctionnalités dans les nouvelles versions. Les versions déjà reçues continuent de fonctionner sous votre licence.',
      ],
    },
    {
      id: 'ownership',
      heading: '10. Propriété et composants tiers',
      paras: [
        'Le Logiciel est concédé sous licence, non vendu. Nous conservons tous les droits qui ne sont pas expressément accordés, y compris le droit d’auteur et les marques. Les composants libres fournis avec le Logiciel restent régis par leurs propres licences, que le présent contrat ne limite pas.',
        'Vos données d’entrée et vos résultats (codes, syndromes, circuits, résultats) vous appartiennent. Le Logiciel ne nous en transmet aucun.',
      ],
    },
    {
      id: 'warranty',
      heading: '11. Garantie',
      paras: [
        'Si le Logiciel ne vous convient pas, votre recours est la garantie de remboursement de 14 jours. Pour le reste, le Logiciel est fourni **« tel quel »**, sans autre garantie expresse ou implicite, notamment de qualité marchande, d’adaptation à un usage particulier et d’absence de contrefaçon, dans la mesure permise par la loi.',
        'Le Logiciel est une bibliothèque de décodage pour la simulation et la recherche, validée en vérifiant que chaque correction reproduit son syndrome. Il n’est pas certifié pour un usage critique pour la sécurité. Rien dans le présent contrat n’exclut une garantie que la loi applicable, y compris la Loi sur la protection du consommateur du Québec lorsqu’elle s’applique, ne permet pas d’exclure.',
      ],
    },
    {
      id: 'liability',
      heading: '12. Limitation de responsabilité',
      paras: [
        'Dans la mesure permise par la loi, notre responsabilité totale en vertu du présent contrat est limitée aux sommes que vous avez payées au cours des 12 mois précédant l’événement à l’origine de la réclamation, et nous ne sommes pas responsables des dommages indirects, consécutifs ou punitifs, ni des pertes de profits, de données ou d’affaires.',
        'Ces limites ne s’appliquent pas au préjudice corporel ou moral, ni au préjudice causé par une faute intentionnelle ou lourde, que le droit québécois ne permet pas d’exclure.',
      ],
    },
    {
      id: 'export',
      heading: '13. Contrôle des exportations et sanctions',
      paras: [
        'Vous respecterez les lois sur le contrôle des exportations et les sanctions du Canada et de tout autre pays qui vous est applicable, et vous n’utiliserez ni ne transférerez le Logiciel vers une personne ou une destination que ces lois interdisent.',
      ],
    },
    {
      id: 'termination',
      heading: '14. Résiliation pour manquement',
      paras: [
        'Nous pouvons résilier votre licence en cas de manquement important au présent contrat, comme un usage hors de sa portée, après un avis écrit et un délai de 15 jours pour y remédier. À la résiliation, vous devez cesser l’usage commercial et supprimer vos jetons de licence. Aucun remboursement n’est dû pour la Durée écoulée après une résiliation pour manquement.',
      ],
    },
    {
      id: 'privacy',
      heading: '15. Renseignements personnels',
      paras: [
        'Nous ne recueillons que ce qui est nécessaire pour vendre et livrer votre licence. Consultez la [Politique de confidentialité](/fr/privacy) pour savoir ce que nous recueillons, pourquoi, où ces renseignements sont conservés et quels sont vos droits en vertu de la loi québécoise.',
      ],
    },
    {
      id: 'changes',
      heading: '16. Modifications du contrat',
      paras: [
        'Nous pouvons publier de nouvelles versions du présent contrat. Une nouvelle version s’applique aux nouveaux achats et, après un préavis d’au moins 30 jours par courriel, aux renouvellements. Elle ne modifie jamais les conditions d’une période déjà payée. Les versions antérieures sont disponibles sur demande.',
      ],
    },
    {
      id: 'law',
      heading: '17. Droit applicable, langue et intégralité',
      paras: [
        'Le présent contrat est régi par les lois du Québec et les lois fédérales du Canada qui s’y appliquent. Les tribunaux du district judiciaire de Montréal sont compétents, sans priver un consommateur de la protection des lois impératives ou des tribunaux de son lieu de résidence.',
        'La présente version française est la version de référence remise avant la version anglaise. Les parties peuvent convenir d’être liées par la [version anglaise](/license-agreement); dans ce cas, la clause de langue de cette version s’applique.',
        'Le présent contrat, la description du Forfait à la date d’achat et la Politique de remboursement constituent l’entente complète pour les forfaits payants. Un contrat Entreprise signé prévaut en cas de conflit. Si une clause est inapplicable, le reste demeure en vigueur.',
      ],
    },
  ],
};
