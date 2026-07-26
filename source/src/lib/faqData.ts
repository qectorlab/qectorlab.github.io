// Shared FAQ items for the Pricing page.
// Single source of truth: rendered visibly on /pricing (Pricing.tsx) and also
// serialized into the prerendered /pricing shell + FAQPage JSON-LD at build
// time (src/lib/prerenderData.ts). Keep both sides in sync by editing only here.

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'How is the license delivered?',
    a: 'Automatically, by email, within minutes of payment. You receive an Ed25519-signed license token tied to your checkout email — set it as QECTOR_LICENSE and it verifies offline against a public key embedded in the package, so it works air-gapped and in CI with no license server and no phone-home. There are no software lockouts: your team keeps using the standard pip install qector-decoder-v3 package as-is, and the token plus your Stripe receipt are what procurement and audit need.'
  },
  {
    q: 'What happens after the 60-day evaluation expires?',
    a: 'The $499 evaluation is a flat, non-recurring 60-day window. If you need to extend or convert to an annual license, contact licensing@qector.store. The evaluation fee is 100% creditable toward any annual license.'
  },
  {
    q: 'Can I redistribute QECTOR inside my product?',
    a: 'No — standard tiers cover internal use only. Enterprise OEM licenses cover redistribution, SaaS hosting, and hardware bundling. Email licensing@qector.store for a custom agreement.'
  },
  {
    q: 'Do I need a license for non-commercial research?',
    a: 'No. Non-commercial, academic, and personal use is free under the PolyForm Noncommercial license. Only commercial deployment requires a paid tier.'
  },
  {
    q: 'What about academic discounts?',
    a: 'Yes — academic institutions receive 40% off any annual tier. Contact licensing@qector.store with your .edu domain to verify.'
  },
  {
    q: 'Can we get a signed corporate EULA or tax form?',
    a: 'Yes. If procurement requires a signed PDF agreement, vendor profile, or W-8/W-9, email your request with your Stripe invoice number to licensing@qector.store.'
  },
];
