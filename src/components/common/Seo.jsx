import { useEffect } from 'react'
import { siteConfig } from '../../data/siteConfig'

function upsert(selector, create) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  return el
}

function setMeta(attr, key, content) {
  const el = upsert(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute(attr, key)
    return m
  })
  el.setAttribute('content', content)
}

function removeEl(selector) {
  document.head.querySelector(selector)?.remove()
}

/**
 * Per-route title, description, Open Graph, canonical and JSON-LD.
 * Canonical / og:url / absolute image URLs are only emitted once VITE_SITE_URL is configured.
 */
export default function Seo({ title, description, path = '/', noindex = false, jsonLd }) {
  useEffect(() => {
    const full = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} | ${siteConfig.tagline}`
    const base = siteConfig.siteUrl
    document.title = full

    setMeta('name', 'description', description)
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', `${base}/og-image.jpg`)
    setMeta('name', 'twitter:title', full)
    setMeta('name', 'twitter:description', description)

    if (base) {
      const url = `${base}${path}`
      setMeta('property', 'og:url', url)
      upsert('link[rel="canonical"]', () => {
        const l = document.createElement('link')
        l.rel = 'canonical'
        return l
      }).href = url
    }

    if (noindex) setMeta('name', 'robots', 'noindex, follow')
    else removeEl('meta[name="robots"]')

    if (jsonLd) {
      const s = upsert('script#ld-json', () => {
        const el = document.createElement('script')
        el.type = 'application/ld+json'
        el.id = 'ld-json'
        return el
      })
      s.textContent = JSON.stringify(jsonLd)
    }
    return () => {
      if (jsonLd) removeEl('script#ld-json')
    }
  }, [title, description, path, noindex, jsonLd])

  return null
}

/**
 * schema.org has no "FilmProduction" type, so the company is described as an Organization
 * using only facts supplied by the client.
 */
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.legalName,
  slogan: siteConfig.tagline,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phoneHref.replace('tel:', ''),
  ...(siteConfig.siteUrl ? { url: siteConfig.siteUrl } : {}),
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: siteConfig.contact.phoneHref.replace('tel:', ''),
    email: siteConfig.contact.email,
  },
  employee: {
    '@type': 'Person',
    name: siteConfig.producer.name,
    jobTitle: siteConfig.producer.role,
  },
}
