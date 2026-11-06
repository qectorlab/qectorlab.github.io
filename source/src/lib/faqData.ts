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
    q: 'How do I try QECTOR commercially before paying?',
    a: 'Request the free 14-day commercial trial on this page: a Pro licence token arrives by e-mail within minutes, for up to 5 internal users. No card is needed and the token simply expires; there is nothing to cancel. One trial per e-mail address per year.'
  },
  {
    q: 'How is the licence delivered, and what does the token unlock?',
    a: 'By e-mail within minutes of payment (check spam, then write to admin@qector.store with your Stripe receipt). Everyone installs the same wheel: pip install --upgrade "qector-decoder-v3>=1.0,<2". Set QECTOR_LICENSE_KEY and QECTOR_LICENSE to the token. Every paid plan unlocks GPU (CUDA/OpenCL) batch decoding; Lab and Enterprise also raise the code-distance tier to 63. CPU decoding is never blocked, and distance caps are only enforced if you set QECTOR_ENFORCE=1. The token is verified offline against a public key in the package: no licence server, works air-gapped.'
  },
  {
    q: 'Do plans renew automatically, and how do I cancel?',
    a: 'Yes. Pro (monthly or annual), Team and Lab renew automatically until cancelled, and you get a reminder e-mail 14 days before each annual renewal. Cancel any time from your Stripe receipt or by writing to admin@qector.store; your licence stays valid until the end of the paid period. Pro Perpetual and the Pilot are one-time payments and never renew.'
  },
  {
    q: 'What is your refund policy?',
    a: '14-day money-back guarantee on your first payment of any plan: write to admin@qector.store with your Stripe receipt and we refund it in full and revoke the token. Renewals are not refunded pro rata. Duplicate purchases and charges made in error are always refunded. If a token never arrives or fails to verify, we reissue it at no cost. This does not limit non-waivable statutory rights.'
  },
  {
    q: 'How many seats does each plan cover, and what counts as production?',
    a: 'Pro: 1 named user. Team: up to 10. Lab: up to 25. Enterprise: unlimited. All paid plans grant production rights for internal use. The free trial and the 60-day Pilot are for evaluation (benchmarking, integration testing, threshold studies), not production. Pro Perpetual covers one named user for every 3.x release; a major version such as 4.0 is a new licence.'
  },
  {
    q: 'Is a hosted or customer-facing API covered?',
    a: 'No. Pro, Team and Lab cover internal use on your own infrastructure. As soon as QECTOR sits behind an API, product or service that anyone outside your organisation can reach, that is SaaS or redistribution and needs an Enterprise/OEM agreement. Internal endpoints used only by your own staff are fine. Unsure? Describe the deployment to admin@qector.store.'
  },
  {
    q: 'Can I redistribute QECTOR inside my product?',
    a: 'Only under an Enterprise/OEM agreement, which covers redistribution, SaaS hosting and hardware bundling. Write to admin@qector.store.'
  },
  {
    q: 'Do I need a licence for non-commercial research?',
    a: 'No. Personal, academic and other non-commercial use is free under the PolyForm Noncommercial License 1.0.0. Universities, public research organisations, charities and government institutions may also use it free, whatever the source of their funding (that is what PolyForm Noncommercial says). A company using QECTOR, including on a contract with a university, needs a paid plan. Academic institutions that want a paid plan anyway, for support or to pass commercial rights to an industry partner, get 40% off Team and Lab with an institutional e-mail.'
  },
  {
    q: 'What currency are prices in, and is tax included?',
    a: 'Prices are in US dollars and exclude tax. Applicable sales tax, GST/HST or VAT is calculated and added at checkout from your billing address. Businesses can enter a VAT/GST number at checkout.'
  },
  {
    q: 'Can we get a signed agreement, tax form or security questionnaire?',
    a: 'Yes. For a signed PDF agreement, vendor profile, W-8BEN or equivalent, or a security questionnaire, write to admin@qector.store with your Stripe invoice number. Enterprise agreements are always signed contracts.'
  },
];

// French FAQ items for the /fr/pricing page. Same commercial facts as
// FAQ_ITEMS above, translated to French. Not wired into the prerendered
// shells; update prerenderData.ts if that changes.
export const FAQ_ITEMS_FR: FaqItem[] = [
  {
    q: 'Comment essayer QECTOR commercialement avant de payer ?',
    a: 'Demandez l’essai commercial gratuit de 14 jours sur cette page : un jeton de licence Pro arrive par courriel en quelques minutes, pour jusqu’à 5 utilisateurs internes. Aucune carte n’est requise et le jeton expire de lui-même : rien à annuler. Un essai par adresse courriel par année.'
  },
  {
    q: 'Comment la licence est-elle livrée, et que déverrouille le jeton ?',
    a: 'Par courriel dans les minutes qui suivent le paiement (vérifiez le courrier indésirable, puis écrivez à admin@qector.store avec votre reçu Stripe). Tout le monde installe la même wheel : pip install --upgrade "qector-decoder-v3>=1.0,<2". Définissez QECTOR_LICENSE_KEY et QECTOR_LICENSE au jeton. Chaque forfait payant déverrouille le décodage GPU (CUDA/OpenCL) par lots; Labo et Entreprise portent aussi le palier de distance à 63. Le décodage CPU n’est jamais bloqué, et les plafonds de distance ne s’appliquent que si QECTOR_ENFORCE=1. Le jeton se vérifie hors ligne contre une clé publique incluse dans le paquet : aucun serveur de licence, fonctionne hors réseau.'
  },
  {
    q: 'Les forfaits se renouvellent-ils automatiquement, et comment annuler ?',
    a: 'Oui. Pro (mensuel ou annuel), Équipe et Labo se renouvellent automatiquement jusqu’à annulation, avec un courriel de rappel 14 jours avant chaque renouvellement annuel. Annulez en tout temps depuis votre reçu Stripe ou en écrivant à admin@qector.store; votre licence reste valide jusqu’à la fin de la période payée. Pro Perpétuel et le Pilote sont des paiements uniques et ne se renouvellent jamais.'
  },
  {
    q: 'Quelle est votre politique de remboursement ?',
    a: 'Garantie satisfait ou remboursé de 14 jours sur votre premier paiement de tout forfait : écrivez à admin@qector.store avec votre reçu Stripe et nous remboursons en entier et révoquons le jeton. Les renouvellements ne sont pas remboursés au prorata. Les achats en double et les frais faits par erreur sont toujours remboursés. Si un jeton n’arrive pas ou ne se vérifie pas, nous le réémettons sans frais. Cela ne limite pas les droits légaux auxquels on ne peut renoncer.'
  },
  {
    q: 'Combien de sièges chaque forfait couvre-t-il, et qu’est-ce que la production ?',
    a: 'Pro : 1 utilisateur nommé. Équipe : jusqu’à 10. Labo : jusqu’à 25. Entreprise : illimité. Tous les forfaits payants accordent des droits de production pour usage interne. L’essai gratuit et le Pilote de 60 jours servent à l’évaluation (benchmarks, tests d’intégration, études de seuil), pas à la production. Pro Perpétuel couvre un utilisateur nommé pour toutes les versions 3.x; une version majeure comme 4.0 est une nouvelle licence.'
  },
  {
    q: 'Une API hébergée ou offerte aux clients est-elle couverte ?',
    a: 'Non. Pro, Équipe et Labo couvrent l’usage interne sur votre propre infrastructure. Dès que QECTOR se trouve derrière une API, un produit ou un service accessible hors de votre organisation, c’est du SaaS ou de la redistribution, ce qui exige un contrat Entreprise/OEM. Les points d’accès internes réservés à votre personnel sont couverts. En cas de doute, décrivez le déploiement à admin@qector.store.'
  },
  {
    q: 'Puis-je redistribuer QECTOR dans mon produit ?',
    a: 'Seulement avec un contrat Entreprise/OEM, qui couvre la redistribution, l’hébergement SaaS et le regroupement matériel. Écrivez à admin@qector.store.'
  },
  {
    q: 'Ai-je besoin d’une licence pour la recherche non commerciale ?',
    a: 'Non. L’usage personnel, académique et non commercial est gratuit sous la licence PolyForm Noncommercial 1.0.0. Les universités, organismes de recherche publics, organismes de bienfaisance et institutions gouvernementales peuvent aussi l’utiliser gratuitement, quelle que soit la source de leur financement (c’est ce que prévoit PolyForm Noncommercial). Une entreprise qui utilise QECTOR, y compris dans un contrat avec une université, doit avoir un forfait payant. Les établissements d’enseignement qui veulent tout de même un forfait payant, pour le soutien ou pour transmettre des droits commerciaux à un partenaire industriel, obtiennent 40 % de rabais sur Équipe et Labo avec un courriel institutionnel.'
  },
  {
    q: 'En quelle devise sont les prix, et la taxe est-elle incluse ?',
    a: 'Les prix sont en dollars américains, hors taxes. La taxe de vente, TPS/TVH ou TVA applicable est calculée et ajoutée au paiement selon votre adresse de facturation. Les entreprises peuvent saisir un numéro de TPS/TVA au paiement.'
  },
  {
    q: 'Pouvons-nous obtenir un contrat signé, un formulaire fiscal ou un questionnaire de sécurité ?',
    a: 'Oui. Pour un contrat PDF signé, un profil de fournisseur, un W-8BEN ou équivalent, ou un questionnaire de sécurité, écrivez à admin@qector.store avec votre numéro de facture Stripe. Les contrats Entreprise sont toujours signés.'
  },
];
