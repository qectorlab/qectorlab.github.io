// Single source of truth for QECTOR prices and Stripe payment links (2026-11).
//
// Every price shown on the site (EN + FR pricing pages, FAQ, prerendered
// shells, llms.txt) must come from here, and every link must be a payment link
// whose Stripe metadata carries the matching `qector_tier`: that metadata is
// what the fulfilment Worker reads to sign the right licence token.
//
// Stripe objects (live mode, created 2026-11-05):
//   Pro monthly    price_1UYdUvRsa9cg9l8A4MDcaeDE  plink_1UYdWKRsa9cg9l8A219X1yAP
//   Pro annual     price_1UYdV8Rsa9cg9l8ANWDyXlxw  plink_1UYdWLRsa9cg9l8ATNfKqeBn
//   Pro Perpetual  price_1UYdVRRsa9cg9l8AzM7e7L2W  plink_1UYdWMRsa9cg9l8AKJlBf8iC
//   Team           price_1UYdVSRsa9cg9l8AZIIaF5fG  plink_1UYdWNRsa9cg9l8AVcC957pt
//   Lab            price_1UYdVTRsa9cg9l8Aju8DgqqX  plink_1UYdWORsa9cg9l8AZRqb0yGb
//   Pilot          price_1UYdVURsa9cg9l8ApDmXQ3kU  plink_1UYdWORsa9cg9l8AhcVwSUkz

export const TRIAL_ENDPOINT = '/stripe/trial';

export const LINKS = {
  proMonthly: 'https://buy.stripe.com/5kQcN7eAp3BM5RE5ZMeUU0g',
  proAnnual: 'https://buy.stripe.com/8x228teAp6NY6VI87UeUU0h',
  proPerpetual: 'https://buy.stripe.com/dRm00l0Jzfku4NA0FseUU0i',
  team: 'https://buy.stripe.com/aFafZjcsh6NY1Bobk6eUU0j',
  lab: 'https://buy.stripe.com/aFa7sN9g5fku0xk5ZMeUU0k',
  pilot: 'https://buy.stripe.com/14AeVf9g5b4e0xkdseeUU0l',
} as const;

export const PRICES = {
  proMonthly: 79,
  proAnnual: 790,
  proPerpetual: 1990,
  team: 3900,
  lab: 9900,
  pilot: 1500,
  enterpriseFrom: 25000,
  validationSprint: 3750,
  trialDays: 14,
  pilotDays: 60,
  refundDays: 14,
  academicDiscountPct: 40,
} as const;

export const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
export const usdFr = (n: number) => `${n.toLocaleString('fr-CA').replace(/[\u00a0\u202f]/g, ' ')} $`;
