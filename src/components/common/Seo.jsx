import { useEffect } from 'react'
import { getSeo, ROBOTS_NOINDEX } from '../../data/seo'

function upsert(selector, create) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  return el
}

function setMeta(attr, key, content) {
  upsert(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute(attr, key)
    return m
  }).setAttribute('content', content)
}

function removeEl(selector) {
  document.head.querySelector(selector)?.remove()
}

/**
 * Keeps <head> in sync on client-side navigation. The same tags are already present in the static
 * HTML of every route (generated at build time by scripts/vite-seo-plugin.js), so crawlers and social
 * scrapers that do not run JavaScript see them too.
 *
 * Title, description and JSON-LD come from data/routes.js + data/seo.js by `path`.
 * Pass `noindex` for pages that must stay out of search results (e.g. the 404 page).
 */
export default function Seo({ path = '/', noindex = false }) {
  useEffect(() => {
    const seo = getSeo(noindex ? '/__not-found' : path)

    document.title = seo.title
    setMeta('name', 'description', seo.description)
    setMeta('name', 'robots', noindex ? ROBOTS_NOINDEX : seo.robots)

    setMeta('property', 'og:title', seo.title)
    setMeta('property', 'og:description', seo.description)
    setMeta('property', 'og:image', seo.image)
    setMeta('property', 'og:image:alt', seo.imageAlt)
    setMeta('name', 'twitter:title', seo.title)
    setMeta('name', 'twitter:description', seo.description)
    setMeta('name', 'twitter:image', seo.image)
    setMeta('name', 'twitter:image:alt', seo.imageAlt)

    if (seo.canonical) {
      setMeta('property', 'og:url', seo.url)
      upsert('link[rel="canonical"]', () => {
        const l = document.createElement('link')
        l.rel = 'canonical'
        return l
      }).href = seo.canonical
    } else {
      removeEl('link[rel="canonical"]')
      removeEl('meta[property="og:url"]')
    }

    if (seo.jsonLd) {
      upsert('script#ld-json', () => {
        const el = document.createElement('script')
        el.type = 'application/ld+json'
        el.id = 'ld-json'
        return el
      }).textContent = JSON.stringify(seo.jsonLd)
    } else {
      removeEl('script#ld-json')
    }
  }, [path, noindex])

  return null
}
