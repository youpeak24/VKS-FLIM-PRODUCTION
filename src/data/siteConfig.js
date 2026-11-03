import { routes } from './routes.js'

const env = import.meta.env

/**
 * Single source of truth for company details.
 * Change contact information here — never hard-code it in components.
 */
export const siteConfig = {
  name: 'VKS Film Production',
  legalName: 'VKS FILM PRODUCTION',
  tagline: 'Creating Magic on Screen',
  description:
    'VKS Film Production brings powerful ideas, captivating visuals and creative storytelling together to create unforgettable cinematic experiences.',

  /** Production domain — set VITE_SITE_URL once the client confirms it. */
  siteUrl: (env.VITE_SITE_URL || '').trim().replace(/\/$/, ''),

  producer: {
    name: 'S. Vijay Krishnan',
    role: 'Producer',
  },

  contact: {
    phoneDisplay: '+91 90876 15708',
    phoneHref: 'tel:+919087615708',
    email: 'vksfilm@mailproduction.com',
    whatsappNumber: '919087615708',
    whatsappMessage:
      "Hello VKS Film Production, I'd like to talk about a project.",
  },

  /**
   * Social profiles. Supplied handle: "@VKSFilm Production" — the platform and
   * profile URL have NOT been confirmed yet, so nothing is rendered.
   * Add confirmed entries like: { label: 'Instagram', url: 'https://www.instagram.com/…' }
   */
  social: [],

  /**
   * Showreel: YouTube video ID (the part after "v=" in a YouTube URL).
   * Empty = a clearly labelled placeholder is shown instead of a player.
   */
  showreelYoutubeId: '',

  /**
   * Contact form endpoint: the Vercel serverless function in api/contact.js, which emails the
   * owner via nodemailer. VITE_FORM_ENDPOINT can override it (see .env.example).
   */
  formEndpoint: (env.VITE_FORM_ENDPOINT || '/api/contact').trim(),

  /**
   * While true, small "draft / pending client review" notes appear next to
   * proposed services, editorial copy and legal drafts. Set to false only after
   * the client has approved all content.
   */
  showDraftNotices: true,

  legal: {
    lastUpdated: 'Draft — not yet published',
  },

  routes,
  nav: routes.filter((r) => r.nav),
}

export const whatsappHref = (message = siteConfig.contact.whatsappMessage) =>
  `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(message)}`

export const mailtoHref = (subject, body) => {
  const params = []
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
  if (body) params.push(`body=${encodeURIComponent(body)}`)
  return `mailto:${siteConfig.contact.email}${params.length ? `?${params.join('&')}` : ''}`
}
