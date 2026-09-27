// Shared FAQ items for the Pricing page.
// Single source of truth: rendered visibly on /pricing (Pricing.tsx) and also
// serialized into the prerendered /pricing shell + FAQPage JSON-LD at build
// time (src/lib/prerenderData.ts). Keep both sides in sync by editing only here.
//
// Accuracy rule: these answers are the commercial representations buyers and
// procurement rely on, and they are indexed as FAQPage structured data. Every
// claim here must match actual package behaviour (see the licensing notice /
// QECTOR_SILENT documentation in the package reference) and the Stripe prices
// wired into Pricing.tsx. Do not describe behaviour the wheel does not have.

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'How is the license delivered, and does the package change once I have a token?',
    a: 'Automatically, by email, within minutes of payment: if nothing arrives within 10 minutes, check your spam folder, then email admin@qector.store with your Stripe receipt. Everyone installs the same wheel via pip install qector-decoder-v3==1.0.0; there is no separate commercial build and no feature gating. Set both QECTOR_LICENSE and QECTOR_LICENSE_KEY to the token so the import notice and v1.0.0 tier manager use the same credential. Set QECTOR_SILENT=1 if you also want quiet CI logs. The token verifies offline against a public key embedded in the package, so it works air-gapped and in CI with no license server and no phone-home. There is no hard stop: decoding runs either way. The token plus your Stripe receipt are what procurement and audit need.'
  },
  {
    q: 'What exactly happens when the 60-day evaluation expires?',
    a: 'The $499 evaluation is a flat, non-recurring 60-day license: it is not a subscription and it does not auto-renew. The token carries a 60-day expiry. After that date your commercial evaluation rights end and the licensing notice returns on import, but nothing is disabled, no code stops working, and your data and results remain yours. To continue commercial use you move to an annual tier. The $499 is 100% creditable toward any annual license purchased within 90 days of your evaluation start: buy Solo/Indie at $1,299/yr within that window and you pay $800, not $1,299. Email admin@qector.store with your Stripe invoice number and we invoice the difference.'
  },
  {
    q: 'How many seats does each tier cover, and what counts as production?',
    a: 'The $499 evaluation covers unlimited internal seats for 60 days, but it is scoped to evaluation and pilot work: benchmarking, integration testing, threshold studies, and architecture assessment. It does not grant production rights. Annual tiers grant production rights for internal use and are seat-counted: Solo/Indie $1,299/yr (1 named user), Startup/Growth $4,499/yr (up to 10), Professional $11,500/yr (up to 25), Enterprise & OEM custom pricing (unlimited seats and logical qubits, OEM bundling rights, dedicated support engineer, custom builds). A Solo/Indie perpetual license is also available at $3,299 one-time for v3.x (all v3.x patch/minor updates included; major version upgrades such as v4.0 are a new license).'
  },
  {
    q: 'Is a hosted or customer-facing API covered by an annual tier?',
    a: 'No. Annual tiers cover internal use: your own team, on your own infrastructure. The moment QECTOR sits behind an API, product, or service that anyone outside your organization can reach, that deployment is SaaS or redistribution and it requires an Enterprise/OEM agreement, regardless of which annual tier you hold. Internal hosted endpoints used only by your own employees are fine under an annual tier. If you are unsure which side of the line you are on, email admin@qector.store and describe the deployment.'
  },
  {
    q: 'Can I redistribute QECTOR inside my product?',
    a: 'No: standard tiers cover internal use only. Enterprise OEM licenses cover redistribution, SaaS hosting, and hardware bundling. Email admin@qector.store for a custom agreement.'
  },
  {
    q: 'Do I need a license for non-commercial research?',
    a: 'No. Non-commercial, academic, and personal use is free under the PolyForm Noncommercial License 1.0.0. Only commercial deployment requires a paid tier. The licensing notice on import is informational: it does not restrict non-commercial use, and QECTOR_SILENT=1 suppresses it.'
  },

  {
    q: 'What currency are prices in, and is tax included?',
    a: 'All prices are in US dollars (USD). Listed prices are exclusive of tax. Stripe calculates and adds any applicable sales tax, GST/HST, or VAT at checkout based on your billing location: Canadian, UK, and EU buyers should expect tax on top of the listed price. If your organization is tax-exempt or has a valid VAT/GST registration number, enter it at checkout, or email admin@qector.store with your Stripe invoice number for a corrected invoice.'
  },
  {
    q: 'What is your refund policy?',
    a: 'License tokens are delivered immediately on payment, so all sales are final and commercial licenses are non-refundable. That is precisely why the $499 60-day evaluation exists: it is the low-cost, fully creditable way to validate QECTOR against your own workloads before committing to an annual tier. If a token never arrives or fails to verify, that is a delivery fault rather than a refund matter: email admin@qector.store and we will reissue it. This policy does not limit non-waivable statutory rights where they apply. Full terms are on the refund policy page.'
  },
  {
    q: 'Can we get a signed corporate EULA or tax form?',
    a: 'Yes. If procurement requires a signed PDF agreement, vendor profile, W-8BEN or equivalent tax form, or a security questionnaire, email your request with your Stripe invoice number to admin@qector.store.'
  },
];

// French FAQ items for the /fr/pricing page. Same commercial facts as
// FAQ_ITEMS above, translated to French. Not wired into the prerendered
// shells; update prerenderData.ts if that changes.
export const FAQ_ITEMS_FR: FaqItem[] = [
  {
    q: 'Comment la licence est-elle livrée, et le paquet change-t-il une fois que j’ai un jeton ?',
    a: 'Automatiquement, par courriel, dans les minutes qui suivent le paiement : si rien n’arrive dans les 10 minutes, vérifiez votre courrier indésirable, puis écrivez à admin@qector.store avec votre reçu Stripe. Tout le monde installe la même wheel via pip install qector-decoder-v3==1.0.0; il n’existe pas de build commercial séparé et aucune fonctionnalité n’est verrouillée. Définissez QECTOR_LICENSE et QECTOR_LICENSE_KEY au jeton pour que l’avis d’import et le gestionnaire de palier v1.0.0 utilisent le même jeton. Définissez QECTOR_SILENT=1 si vous voulez aussi des journaux CI silencieux. Le jeton se vérifie hors ligne contre une clé publique embarquée dans le paquet : il fonctionne hors réseau et en CI, sans serveur de licence ni appel maison. Il n’y a pas de blocage : le décodage fonctionne de toute façon. Le jeton et votre reçu Stripe sont ce dont les achats et l’audit ont besoin.'
  },
  {
    q: 'Que se passe-t-il exactement à l’expiration de l’évaluation de 60 jours ?',
    a: 'L’évaluation à 499 $ est une licence forfaitaire de 60 jours, non récurrente : ce n’est pas un abonnement et elle ne se renouvelle pas automatiquement. Le jeton porte une échéance de 60 jours. Après cette date, vos droits d’évaluation commerciale prennent fin et l’avis de licence réapparaît à l’import, mais rien n’est désactivé, aucun code ne cesse de fonctionner, et vos données et résultats restent à vous. Pour poursuivre un usage commercial, vous passez à un palier annuel. Les 499 $ sont crédités à 100 % vers toute licence annuelle achetée dans les 90 jours suivant le début de votre évaluation : achetez Solo/Indie à 1 299 $/an dans ce délai et vous payez 800 $, pas 1 299 $. Écrivez à admin@qector.store avec votre numéro de facture Stripe et nous facturons la différence.'
  },
  {
    q: 'Combien de sièges chaque palier couvre-t-il, et qu’est-ce qui compte comme production ?',
    a: 'L’évaluation à 499 $ couvre des sièges internes illimités pendant 60 jours, mais elle est limitée à l’évaluation et aux pilotes : tests de référence (benchmarks), tests d’intégration, études de seuil et évaluation d’architecture. Elle n’accorde pas de droits de production. Les paliers annuels accordent des droits de production pour usage interne et sont comptés par sièges : Solo/Indie 1 299 $/an (1 utilisateur nommé), Startup/Growth 4 499 $/an (jusqu’à 10), Professionnel 11 500 $/an (jusqu’à 25), Entreprise & OEM sur mesure (sièges et qubits logiques illimités, droits de regroupement OEM, ingénieur de support dédié, versions personnalisées). Une licence perpétuelle Solo/Indie est aussi disponible à 3 299 $ paiement unique pour v3.x (toutes les mises à jour mineures et correctives v3.x incluses; les montées de version majeure comme v4.0 sont une nouvelle licence).'
  },
  {
    q: 'Une API hébergée ou orientée client est-elle couverte par un palier annuel ?',
    a: 'Non. Les paliers annuels couvrent l’usage interne : votre propre équipe, sur votre propre infrastructure. Dès que QECTOR se trouve derrière une API, un produit ou un service accessible à quiconque hors de votre organisation, c’est du SaaS ou de la redistribution et cela exige un contrat Entreprise/OEM, quel que soit le palier annuel détenu. Les points d’accès hébergés internes utilisés uniquement par vos propres employés sont couverts par un palier annuel. En cas de doute, écrivez à admin@qector.store et décrivez le déploiement.'
  },
  {
    q: 'Puis-je redistribuer QECTOR dans mon produit ?',
    a: 'Non : les paliers standards couvrent l’usage interne seulement. Les licences Entreprise OEM couvrent la redistribution, l’hébergement SaaS et le regroupement matériel. Écrivez à admin@qector.store pour un contrat sur mesure.'
  },
  {
    q: 'Ai-je besoin d’une licence pour la recherche non commerciale ?',
    a: 'Non. L’usage non commercial, académique et personnel est gratuit sous la licence PolyForm Noncommercial 1.0.0. Seul le déploiement commercial exige un palier payant. L’avis de licence à l’import est informatif : il ne restreint pas l’usage non commercial, et QECTOR_SILENT=1 le désactive.'
  },
  {
    q: 'En quelle devise sont les prix, et la taxe est-elle incluse ?',
    a: 'Tous les prix sont en dollars américains (USD). Les prix affichés sont hors taxes. Stripe calcule et ajoute toute taxe de vente, TPS/TVH ou TVA applicable au paiement selon votre adresse de facturation : les acheteurs canadiens, britanniques et européens doivent s’attendre à une taxe en sus du prix affiché. Si votre organisation est exonérée ou possède un numéro d’enregistrement TPS/TVA valide, saisissez-le au paiement, ou écrivez à admin@qector.store avec votre numéro de facture Stripe pour une facture corrigée.'
  },
  {
    q: 'Quelle est votre politique de remboursement ?',
    a: 'Les jetons de licence sont livrés immédiatement au paiement : toutes les ventes sont donc finales et les licences commerciales ne sont pas remboursables. C’est précisément pourquoi l’évaluation à 499 $ pour 60 jours existe : c’est le moyen économique et entièrement créditable de valider QECTOR sur vos propres charges de travail avant de vous engager sur un palier annuel. Si un jeton n’arrive jamais ou ne se vérifie pas, c’est un défaut de livraison plutôt qu’un sujet de remboursement : écrivez à admin@qector.store et nous le réémettrons. Cette politique ne limite pas les droits statutaires non renonçables là où ils s’appliquent. Les conditions complètes sont sur la page de politique de remboursement.'
  },
  {
    q: 'Pouvons-nous obtenir un contrat EULA signé ou un formulaire fiscal ?',
    a: 'Oui. Si vos achats exigent un contrat PDF signé, un profil de fournisseur, un W-8BEN ou formulaire fiscal équivalent ou un questionnaire de sécurité, envoyez votre demande avec votre numéro de facture Stripe à admin@qector.store.'
  },
];
