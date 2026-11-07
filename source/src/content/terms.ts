import type { LegalDoc } from '../lib/legal';

// Website and software terms of use, plus the refund policy, EN + FR.
// Commercial licences are governed by content/licenseAgreement.ts.

const UPDATED_EN = '6 November 2026';
const UPDATED_FR = '6 novembre 2026';

const SELLER_EN =
  'QECTOR software and licences are sold by **Guillaume Lessard**, sole proprietor trading as **iD01t Productions**, 288 boul. des Ormeaux, Longueuil, Québec, Canada J4L 1J4. Contact: [admin@qector.store](mailto:admin@qector.store).';
const SELLER_FR =
  'Le logiciel et les licences QECTOR sont vendus par **Guillaume Lessard**, entrepreneur individuel faisant affaire sous le nom **iD01t Productions**, 288, boul. des Ormeaux, Longueuil (Québec) Canada J4L 1J4. Contact : [admin@qector.store](mailto:admin@qector.store).';

export const termsEn: LegalDoc = {
  lang: 'en',
  path: '/terms',
  twin: '/fr/terms',
  title: 'Terms of Use',
  seoTitle: 'Terms of Use · QECTOR',
  description:
    'Terms of use for the QECTOR website and software: seller identity, software licences, acceptable use, warranty, liability, export control and Québec governing law.',
  badge: `Governing law: Québec, Canada · Updated ${UPDATED_EN}`,
  intro: 'These terms cover the website and the free use of QECTOR software. Paid plans are also governed by the [Commercial Licence Agreement](/license-agreement).',
  version: `Last updated ${UPDATED_EN}.`,
  sections: [
    {
      id: 'seller',
      heading: '1. Who you are dealing with',
      accent: true,
      paras: [
        SELLER_EN,
        'Prices are in US dollars, exclusive of tax; Stripe adds any sales tax, GST/QST or VAT at checkout and processes every payment. Subscriptions renew automatically until cancelled, and every plan has a [14-day money-back guarantee](/refund) on the first payment.',
      ],
    },
    {
      id: 'acceptance',
      heading: '2. Acceptance',
      paras: ['By using this website or QECTOR software you accept these terms. If you do not, do not use them.'],
    },
    {
      id: 'licences',
      heading: '3. Software licences',
      bullets: [
        '**Non-commercial use** (personal, academic, educational, public research, charities and government institutions, whatever their funding) is free under the [PolyForm Noncommercial License 1.0.0](/license).',
        '**Commercial use** requires a paid plan and is governed by the [Commercial Licence Agreement](/license-agreement), which prevails over these terms for paid plans.',
        'Third-party open-source components remain under their own licences.',
      ],
    },
    {
      id: 'use',
      heading: '4. Acceptable use',
      paras: ['You will not:'],
      bullets: [
        'bypass licence checks or use a licence token that was not issued to your organisation;',
        'attack, overload or probe this website or its licence service, except through coordinated disclosure under our [Security policy](/security);',
        'use QECTOR software or this website in breach of export control or sanctions law;',
        'present results produced with QECTOR as endorsed or certified by us without written permission.',
      ],
    },
    {
      id: 'content',
      heading: '5. Website content',
      paras: [
        'Text, graphics and the QECTOR name and logo belong to Guillaume Lessard. You may quote and link to this website with attribution. Validation artefacts and documentation may be republished with attribution. Published papers and datasets follow the licence stated on their DOI record.',
      ],
    },
    {
      id: 'warranty',
      heading: '6. No warranty',
      paras: [
        'The website and the free software are provided **"as is"**, without warranty of any kind, express or implied, including merchantability, fitness for a particular purpose and non-infringement, to the extent the law allows. QECTOR is simulation and research software validated by checking that each correction reproduces its syndrome; it is not a certified fault-tolerance stack.',
      ],
    },
    {
      id: 'liability',
      heading: '7. Limitation of liability',
      paras: [
        'To the extent the law allows, we are not liable for indirect, consequential or punitive damages, or for lost profits or data, arising from the website or free use of the software. For paid plans, the liability clause of the [Commercial Licence Agreement](/license-agreement#liability) applies. Nothing here limits liability for bodily or moral injury, or for intentional or gross fault.',
      ],
    },
    {
      id: 'termination',
      heading: '8. Termination',
      paras: [
        'We may suspend or end access to a licence for a material breach after written notice and a 15-day period to cure it. On termination, commercial use must stop and licence tokens must be deleted.',
      ],
    },
    {
      id: 'law',
      heading: '9. Governing law and language',
      paras: [
        'These terms are governed by the laws of Québec and the federal laws of Canada that apply there; the courts of the judicial district of Montréal have jurisdiction. Consumers keep the protection of the mandatory laws of their place of residence.',
        'A [French version](/fr/terms) of these terms is available. Where you have chosen to use the English version, you have expressly wished it to apply.',
      ],
    },
    {
      id: 'changes',
      heading: '10. Changes',
      paras: [
        'We may update these terms; the date above shows the current version. Changes that affect paid licences follow the notice rules of the [Commercial Licence Agreement](/license-agreement#changes) and never change a period already paid for.',
      ],
    },
  ],
};

export const termsFr: LegalDoc = {
  lang: 'fr',
  path: '/fr/terms',
  twin: '/terms',
  title: 'Conditions d’utilisation',
  seoTitle: 'Conditions d’utilisation · QECTOR',
  description:
    'Conditions d’utilisation du site et du logiciel QECTOR : identité du vendeur, licences, usage acceptable, garantie, responsabilité, contrôle des exportations et droit québécois.',
  badge: `Droit applicable : Québec, Canada · Mise à jour le ${UPDATED_FR}`,
  intro: 'Ces conditions visent le site web et l’usage gratuit du logiciel QECTOR. Les forfaits payants sont aussi régis par le [Contrat de licence commerciale](/fr/license-agreement).',
  version: `Dernière mise à jour : ${UPDATED_FR}.`,
  sections: [
    {
      id: 'seller',
      heading: '1. Votre vendeur',
      accent: true,
      paras: [
        SELLER_FR,
        'Les prix sont en dollars américains, taxes en sus; Stripe ajoute toute taxe de vente, TPS/TVQ ou TVA au paiement et traite chaque transaction. Les abonnements se renouvellent automatiquement jusqu’à leur résiliation, et chaque forfait comporte une [garantie de remboursement de 14 jours](/fr/refund) sur le premier paiement.',
      ],
    },
    {
      id: 'acceptance',
      heading: '2. Acceptation',
      paras: ['En utilisant ce site ou le logiciel QECTOR, vous acceptez ces conditions. Sinon, ne les utilisez pas.'],
    },
    {
      id: 'licences',
      heading: '3. Licences du logiciel',
      bullets: [
        '**L’usage non commercial** (personnel, universitaire, éducatif, recherche publique, organismes de bienfaisance et institutions gouvernementales, quel que soit leur financement) est gratuit sous la [licence PolyForm Noncommercial 1.0.0](/license).',
        '**L’usage commercial** exige un forfait payant et est régi par le [Contrat de licence commerciale](/fr/license-agreement), qui prévaut sur les présentes conditions pour les forfaits payants.',
        'Les composants libres de tiers restent régis par leurs propres licences.',
      ],
    },
    {
      id: 'use',
      heading: '4. Usage acceptable',
      paras: ['Vous vous engagez à ne pas :'],
      bullets: [
        'contourner les vérifications de licence ni utiliser un jeton de licence qui n’a pas été émis à votre organisation;',
        'attaquer, surcharger ou sonder ce site ou son service de licences, sauf par divulgation coordonnée selon notre [politique de sécurité](/security);',
        'utiliser le logiciel QECTOR ou ce site en violation des lois sur le contrôle des exportations ou les sanctions;',
        'présenter des résultats obtenus avec QECTOR comme approuvés ou certifiés par nous sans autorisation écrite.',
      ],
    },
    {
      id: 'content',
      heading: '5. Contenu du site',
      paras: [
        'Les textes, les images ainsi que le nom et le logo QECTOR appartiennent à Guillaume Lessard. Vous pouvez citer ce site et y faire des liens en indiquant la source. Les artefacts de validation et la documentation peuvent être republiés avec attribution. Les articles et jeux de données publiés suivent la licence indiquée sur leur notice DOI.',
      ],
    },
    {
      id: 'warranty',
      heading: '6. Absence de garantie',
      paras: [
        'Le site et le logiciel gratuit sont fournis **« tels quels »**, sans garantie expresse ou implicite, notamment de qualité marchande, d’adaptation à un usage particulier et d’absence de contrefaçon, dans la mesure permise par la loi. QECTOR est un logiciel de simulation et de recherche validé en vérifiant que chaque correction reproduit son syndrome; ce n’est pas une pile de tolérance aux fautes certifiée.',
      ],
    },
    {
      id: 'liability',
      heading: '7. Limitation de responsabilité',
      paras: [
        'Dans la mesure permise par la loi, nous ne sommes pas responsables des dommages indirects, consécutifs ou punitifs, ni des pertes de profits ou de données, découlant du site ou de l’usage gratuit du logiciel. Pour les forfaits payants, la clause de responsabilité du [Contrat de licence commerciale](/fr/license-agreement#liability) s’applique. Rien ici ne limite la responsabilité pour un préjudice corporel ou moral, ni pour une faute intentionnelle ou lourde.',
      ],
    },
    {
      id: 'termination',
      heading: '8. Résiliation',
      paras: [
        'Nous pouvons suspendre ou mettre fin à une licence en cas de manquement important, après un avis écrit et un délai de 15 jours pour y remédier. À la résiliation, l’usage commercial doit cesser et les jetons de licence doivent être supprimés.',
      ],
    },
    {
      id: 'law',
      heading: '9. Droit applicable et langue',
      paras: [
        'Les présentes conditions sont régies par les lois du Québec et les lois fédérales du Canada qui s’y appliquent; les tribunaux du district judiciaire de Montréal sont compétents. Les consommateurs conservent la protection des lois impératives de leur lieu de résidence.',
        'La présente version française est la version de référence; une [version anglaise](/terms) est aussi offerte.',
      ],
    },
    {
      id: 'changes',
      heading: '10. Modifications',
      paras: [
        'Nous pouvons mettre à jour ces conditions; la date ci-dessus indique la version en vigueur. Les modifications qui touchent les licences payantes suivent les règles de préavis du [Contrat de licence commerciale](/fr/license-agreement#changes) et ne modifient jamais une période déjà payée.',
      ],
    },
  ],
};

export const refundEn: LegalDoc = {
  lang: 'en',
  path: '/refund',
  twin: '/fr/refund',
  title: 'Refund Policy',
  seoTitle: 'Refund Policy · QECTOR',
  description:
    'QECTOR Decoder v3 refund policy: 14-day money-back guarantee on the first payment of any plan, cancel renewals at any time, delivery problems fixed free.',
  badge: `All prices in USD · Instant digital delivery · Updated ${UPDATED_EN}`,
  intro:
    'Every plan has a 14-day money-back guarantee on the first payment. Subscriptions renew automatically and you can cancel at any time. See [Pricing](/pricing).',
  sections: [
    {
      id: 'guarantee',
      heading: '14-day money-back guarantee',
      accent: true,
      paras: [
        'If QECTOR is not right for you, e-mail [admin@qector.store](mailto:admin@qector.store) with your Stripe receipt within 14 days of your **first payment** of any plan (Pro monthly or annual, Pro Perpetual, Lab or the Pilot). We refund it in full, no questions asked, and revoke the licence token.',
      ],
      bullets: [
        'One guarantee per organisation; it applies to the first purchase, not to later renewals.',
        'Refunds go back to the original payment method through Stripe, usually within 5 to 10 business days.',
        'Once refunded, the licence ends and the token must no longer be used.',
      ],
    },
    {
      id: 'renewals',
      heading: 'Renewals and cancelling',
      paras: [
        'Pro (monthly or annual) and Lab are subscriptions and **renew automatically** until cancelled. We e-mail a reminder 14 days before each annual renewal. Cancel at any time in the [customer portal](https://billing.stripe.com/p/login/7sY9AVdwlgoyfse9bYeUU00) (sign in with your billing e-mail) or by e-mailing admin@qector.store; your licence stays valid until the end of the period you paid for.',
        'Renewal payments are not refunded pro rata. If a renewal went through that you meant to cancel and you have not used the renewed term, write to us within 7 days and we will refund it. Pro Perpetual and the Pilot are one-time payments and never renew.',
      ],
    },
    {
      id: 'delivery',
      heading: 'Delivery problems: we fix them',
      paras: [
        'If your token never arrives, arrives corrupted, is tied to the wrong e-mail or fails offline verification, that is a delivery fault on our side. Do not open a dispute: e-mail [admin@qector.store](mailto:admin@qector.store) with your Stripe receipt and we will reissue or correct it at no cost, with no time limit.',
        'Tokens are e-mailed within minutes of payment, usually under 10 minutes. If it has been longer, check your spam folder first.',
      ],
    },
    {
      id: 'duplicates',
      heading: 'Duplicate and mistaken charges',
      paras: ['Accidental duplicate purchases of the same plan for the same organisation, and charges made in obvious error, are always refunded in full. E-mail admin@qector.store with both receipts within 30 days of the charge.'],
    },
    {
      id: 'statutory',
      heading: 'Statutory rights',
      paras: ['Nothing in this policy limits rights that cannot be waived under the consumer protection law that applies to you, including the Québec Consumer Protection Act where it applies.'],
    },
    {
      id: 'tax',
      heading: 'Currency and tax',
      paras: ['All prices are quoted and charged in **US dollars (USD)**, exclusive of tax. Any sales tax, GST/QST or VAT is calculated at checkout from your billing address and refunded with the price. Businesses can enter a tax number at checkout.'],
    },
    {
      id: 'seller',
      heading: 'Seller and contact',
      paras: [SELLER_EN, 'Typical response time is 1 business day. See also the [Commercial Licence Agreement](/license-agreement) and [Terms](/terms).'],
    },
  ],
};

export const refundFr: LegalDoc = {
  lang: 'fr',
  path: '/fr/refund',
  twin: '/refund',
  title: 'Politique de remboursement',
  seoTitle: 'Politique de remboursement · QECTOR',
  description:
    'Politique de remboursement de QECTOR Decoder v3 : garantie de remboursement de 14 jours sur le premier paiement de tout forfait, résiliation des renouvellements en tout temps, problèmes de livraison corrigés sans frais.',
  badge: `Prix en USD · Livraison numérique immédiate · Mise à jour le ${UPDATED_FR}`,
  intro:
    'Chaque forfait comporte une garantie de remboursement de 14 jours sur le premier paiement. Les abonnements se renouvellent automatiquement et peuvent être résiliés en tout temps. Voir les [Tarifs](/fr/pricing).',
  sections: [
    {
      id: 'guarantee',
      heading: 'Garantie de remboursement de 14 jours',
      accent: true,
      paras: [
        'Si QECTOR ne vous convient pas, écrivez à [admin@qector.store](mailto:admin@qector.store) avec votre reçu Stripe dans les 14 jours suivant votre **premier paiement** de tout forfait (Pro mensuel ou annuel, Pro Perpétuel, Labo ou Pilote). Nous le remboursons en entier, sans poser de questions, et révoquons le jeton de licence.',
      ],
      bullets: [
        'Une garantie par organisation; elle s’applique au premier achat, pas aux renouvellements.',
        'Le remboursement est versé au moyen de paiement d’origine par Stripe, habituellement en 5 à 10 jours ouvrables.',
        'Une fois remboursée, la licence prend fin et le jeton ne doit plus être utilisé.',
      ],
    },
    {
      id: 'renewals',
      heading: 'Renouvellements et résiliation',
      paras: [
        'Pro (mensuel ou annuel) et Labo sont des abonnements qui **se renouvellent automatiquement** jusqu’à leur résiliation. Nous envoyons un rappel 14 jours avant chaque renouvellement annuel. Résiliez en tout temps dans le [portail client](https://billing.stripe.com/p/login/7sY9AVdwlgoyfse9bYeUU00) (connexion avec votre courriel de facturation) ou en écrivant à admin@qector.store; votre licence reste valide jusqu’à la fin de la période payée.',
        'Les paiements de renouvellement ne sont pas remboursés au prorata. Si un renouvellement que vous vouliez annuler a été prélevé et que vous n’avez pas utilisé la nouvelle période, écrivez-nous dans les 7 jours et nous le rembourserons. Pro Perpétuel et le Pilote sont des paiements uniques qui ne se renouvellent jamais.',
      ],
    },
    {
      id: 'delivery',
      heading: 'Problèmes de livraison : nous les corrigeons',
      paras: [
        'Si votre jeton n’arrive pas, arrive corrompu, est associé au mauvais courriel ou échoue à la vérification hors ligne, c’est une erreur de livraison de notre part. N’ouvrez pas de contestation : écrivez à [admin@qector.store](mailto:admin@qector.store) avec votre reçu Stripe et nous le réémettrons ou le corrigerons sans frais, sans limite de temps.',
        'Les jetons sont envoyés quelques minutes après le paiement, habituellement en moins de 10 minutes. Sinon, vérifiez d’abord vos courriels indésirables.',
      ],
    },
    {
      id: 'duplicates',
      heading: 'Paiements en double ou erronés',
      paras: ['Les achats en double du même forfait pour la même organisation et les paiements manifestement erronés sont toujours remboursés en entier. Écrivez à admin@qector.store avec les deux reçus dans les 30 jours suivant le paiement.'],
    },
    {
      id: 'statutory',
      heading: 'Droits prévus par la loi',
      paras: ['Rien dans cette politique ne limite les droits auxquels on ne peut renoncer en vertu de la loi de protection du consommateur qui vous est applicable, y compris la Loi sur la protection du consommateur du Québec lorsqu’elle s’applique.'],
    },
    {
      id: 'tax',
      heading: 'Devise et taxes',
      paras: ['Tous les prix sont affichés et facturés en **dollars américains (USD)**, taxes en sus. Toute taxe de vente, TPS/TVQ ou TVA est calculée au paiement selon votre adresse de facturation et remboursée avec le prix. Les entreprises peuvent saisir un numéro de taxe au paiement.'],
    },
    {
      id: 'seller',
      heading: 'Vendeur et contact',
      paras: [SELLER_FR, 'Délai de réponse habituel : 1 jour ouvrable. Voir aussi le [Contrat de licence commerciale](/fr/license-agreement) et les [Conditions](/fr/terms).'],
    },
  ],
};
