export const APP_CONFIG = {
  version: '1.0.0',
  pypiPackage: 'qector-decoder-v3',
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined,
  ogImage: 'https://qector.store/images/og-banner.png',
}

// Calendly booking link. The query string carries the embed theme colours so
// the widget matches the site instead of rendering as a white slab; keep them
// in sync with the dark palette in index.css if that ever changes.
export const CALENDLY_URL =
  'https://calendly.com/qector-info/30min?background_color=0e0d0d&text_color=ffffff&primary_color=0e4088'
