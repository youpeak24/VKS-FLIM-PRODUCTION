// Plain data (no imports, no import.meta.env) — shared by the React app AND the build-time
// SEO plugin (vite.config.js), so the same facts feed the UI, <head>, JSON-LD and sitemap.

/** Production domain. Canonical, Open Graph, sitemap and JSON-LD URLs all derive from this. */
export const SITE_URL = 'https://www.vksflim.com'

export const company = {
  name: 'VKS Film Production',
  legalName: 'VKS FILM PRODUCTION',
  /** Other names people use when searching for the brand (incl. the domain's spelling). */
  alternateNames: ['VKS Films', 'VKS Flim'],
  tagline: 'Creating Magic on Screen',
  description:
    'VKS Film Production brings powerful ideas, captivating visuals and creative storytelling together to create unforgettable cinematic experiences.',

  producer: {
    name: 'S. Vijay Krishnan',
    role: 'Producer',
  },

  contact: {
    phoneDisplay: '+91 90876 15708',
    phoneHref: 'tel:+919087615708',
    email: 'vksfilm@mailproduction.com',
    whatsappNumber: '919087615708',
    whatsappMessage: "Hello VKS Film Production, I'd like to talk about a project.",
  },

  /**
   * Social profiles. Supplied handle: "@VKSFilm Production" — the platform and profile URL have NOT
   * been confirmed yet, so nothing is rendered. Add confirmed entries like:
   *   { label: 'Instagram', url: 'https://www.instagram.com/…', handle: '@…' }
   * They are shown in the UI and emitted as JSON-LD sameAs automatically.
   */
  social: [],

  assets: {
    /** 1200×630 social sharing image (public/og-image.jpg). */
    ogImage: '/og-image.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: 'VKS Film Production — Creating Magic on Screen. A burst of colour around a camera aperture.',
    /** Square brand mark used as the Organization logo (min. 112×112 for Google). */
    logo: '/2/android-chrome-512x512.png',
    logoSize: 512,
  },
}
