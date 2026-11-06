import { routes } from './routes.js'
import { company, SITE_URL } from './company.js'

const env = import.meta.env

/**
 * Single source of truth for company details (see company.js — shared with the build-time SEO plugin).
 * Change contact information there — never hard-code it in components.
 */
export const siteConfig = {
  name: company.name,
  legalName: company.legalName,
  tagline: company.tagline,
  description: company.description,

  /** Production domain (https://www.vksflim.com), no trailing slash. */
  siteUrl: SITE_URL,

  producer: company.producer,

  contact: company.contact,

  /** Social profiles — edit in company.js. */
  social: company.social,

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
