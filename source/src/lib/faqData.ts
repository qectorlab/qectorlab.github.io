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
    a: 'Automatically, by email, within minutes of payment — if nothing arrives within 10 minutes, check your spam folder, then email admin@qector.store with your Stripe receipt. Everyone installs the same wheel via pip install qector-decoder-v3; there is no separate commercial build and no feature gating. If QECTOR_LICENSE is not set, a licensing notice prints on import — this is expected and correct for non-commercial use. For commercial use, set QECTOR_LICENSE to your Ed25519 token and the notice stops; set QECTOR_SILENT=1 if you also want quiet CI logs. The token verifies offline against a public key embedded in the package, so it works air-gapped and in CI with no license server and no phone-home. There is no hard stop: decoding runs either way. The token plus your Stripe receipt are what procurement and audit need.'
  },
  {
    q: 'What exactly happens when the 60-day evaluation expires?',
    a: 'The $499 evaluation is a flat, non-recurring 60-day license — it is not a subscription and it does not auto-renew. The token carries a 60-day expiry. After that date your commercial evaluation rights end and the licensing notice returns on import, but nothing is disabled, no code stops working, and your data and results remain yours. To continue commercial use you move to an annual tier. The $499 is 100% creditable toward any annual license purchased within 90 days of your evaluation start: buy Solo/Indie at $1,299/yr within that window and you pay $800, not $1,299. Email admin@qector.store with your Stripe invoice number and we invoice the difference.'
  },
  {
    q: 'How many seats does each tier cover, and what counts as production?',
    a: 'The $499 evaluation covers unlimited internal seats for 60 days, but it is scoped to evaluation and pilot work — benchmarking, integration testing, threshold studies, and architecture assessment. It does not grant production rights. Annual tiers grant production rights for internal use and are seat-counted: Solo/Indie $1,299/yr (1 named user), Startup/Growth $4,499/yr (up to 10), Professional/Lab $11,500/yr (up to 25), Enterprise R&D from $28,000/yr (unlimited). A Solo/Indie perpetual license is also available at $3,299 one-time.'
  },
  {
    q: 'Is a hosted or customer-facing API covered by an annual tier?',
    a: 'No. Annual tiers cover internal use — your own team, on your own infrastructure. The moment QECTOR sits behind an API, product, or service that anyone outside your organization can reach, that is SaaS or redistribution and it requires an Enterprise/OEM agreement, regardless of which annual tier you hold. Internal hosted endpoints used only by your own employees are fine under an annual tier. If you are unsure which side of the line you are on, email admin@qector.store and describe the deployment.'
  },
  {
    q: 'Can I redistribute QECTOR inside my product?',
    a: 'No — standard tiers cover internal use only. Enterprise OEM licenses cover redistribution, SaaS hosting, and hardware bundling. Email admin@qector.store for a custom agreement.'
  },
  {
    q: 'Do I need a license for non-commercial research?',
    a: 'No. Non-commercial, academic, and personal use is free under the PolyForm Noncommercial License 1.0.0. Only commercial deployment requires a paid tier. The licensing notice on import is informational — it does not restrict non-commercial use, and QECTOR_SILENT=1 suppresses it.'
  },
  {
    q: 'What about academic discounts?',
    a: 'Accredited academic institutions receive 40% off any annual tier, worldwide. We verify by institutional email domain rather than a specific top-level domain — .edu, .ac.uk, .edu.au, .ca, .fr, .de, .ac.jp and equivalents all qualify. Email admin@qector.store from your institutional address and we will issue a discount code.'
  },
  {
    q: 'What currency are prices in, and is tax included?',
    a: 'All prices are in US dollars (USD). Listed prices are exclusive of tax. Stripe calculates and adds any applicable sales tax, GST/HST, or VAT at checkout based on your billing location — Canadian, UK, and EU buyers should expect tax on top of the listed price. If your organization is tax-exempt or has a valid VAT/GST registration number, enter it at checkout, or email admin@qector.store with your Stripe invoice number for a corrected invoice.'
  },
  {
    q: 'What is your refund policy?',
    a: 'License tokens are delivered immediately on payment, so all sales are final and commercial licenses are non-refundable. That is precisely why the $499 60-day evaluation exists: it is the low-cost, fully creditable way to validate QECTOR against your own workloads before committing to an annual tier. If a token never arrives or fails to verify, that is a delivery fault rather than a refund matter — email admin@qector.store and we will reissue it. This policy does not limit non-waivable statutory rights where they apply. Full terms are on the refund policy page.'
  },
  {
    q: 'Can we get a signed corporate EULA or tax form?',
    a: 'Yes. If procurement requires a signed PDF agreement, vendor profile, W-8/W-9, or a security questionnaire, email your request with your Stripe invoice number to admin@qector.store.'
  },
];
