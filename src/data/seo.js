// Pure SEO data builders (no DOM, no import.meta.env) — used at build time by
// scripts/vite-seo-plugin.js (static <head>, sitemap) and at runtime by components/common/Seo.jsx
// (client-side route changes), so both always agree.

import { SITE_URL, company } from './company.js'
import { routes, notFound, routeByPath } from './routes.js'
import { serviceCopy } from './serviceCopy.js'

export const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
export const ROBOTS_NOINDEX = 'noindex, follow'

export const abs = (path = '/') => `${SITE_URL}${path === '/' ? '/' : path}`

const ids = {
  org: `${SITE_URL}/#organization`,
  site: `${SITE_URL}/#website`,
  producer: `${SITE_URL}/#producer`,
  logo: `${SITE_URL}/#logo`,
  image: `${SITE_URL}/#primaryimage`,
}

/** schema.org has no "FilmProduction" type, so the company is an Organization described by facts the client supplied. */
function organization() {
  const phone = company.contact.phoneHref.replace('tel:', '')
  return {
    '@type': 'Organization',
    '@id': ids.org,
    name: company.name,
    legalName: company.legalName,
    alternateName: company.alternateNames,
    url: `${SITE_URL}/`,
    description: company.description,
    slogan: company.tagline,
    logo: {
      '@type': 'ImageObject',
      '@id': ids.logo,
      url: abs(company.assets.logo),
      contentUrl: abs(company.assets.logo),
      width: company.assets.logoSize,
      height: company.assets.logoSize,
      caption: company.legalName,
    },
    image: { '@id': ids.image },
    email: company.contact.email,
    telephone: phone,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: phone,
      email: company.contact.email,
    },
    employee: { '@id': ids.producer },
    knowsAbout: serviceCopy.map((s) => s.title),
    ...(company.social.length ? { sameAs: company.social.map((s) => s.url) } : {}),
  }
}

const producer = () => ({
  '@type': 'Person',
  '@id': ids.producer,
  name: company.producer.name,
  jobTitle: company.producer.role,
  worksFor: { '@id': ids.org },
  url: abs('/about'),
})

const website = () => ({
  '@type': 'WebSite',
  '@id': ids.site,
  url: `${SITE_URL}/`,
  name: company.name,
  alternateName: company.alternateNames,
  description: company.description,
  inLanguage: 'en',
  publisher: { '@id': ids.org },
})

const primaryImage = () => ({
  '@type': 'ImageObject',
  '@id': ids.image,
  url: abs(company.assets.ogImage),
  contentUrl: abs(company.assets.ogImage),
  width: company.assets.ogImageWidth,
  height: company.assets.ogImageHeight,
  caption: company.assets.ogImageAlt,
})

/** Full @graph for one indexable route. */
export function buildJsonLd(path) {
  const route = routeByPath(path)
  if (!route) return null
  const url = abs(path)
  const home = path === '/'

  const page = {
    '@type': route.schemaType,
    '@id': `${url}#webpage`,
    url,
    name: route.title,
    description: route.description,
    inLanguage: 'en',
    isPartOf: { '@id': ids.site },
    about: { '@id': ids.org },
    primaryImageOfPage: { '@id': ids.image },
    ...(home ? {} : { breadcrumb: { '@id': `${url}#breadcrumb` } }),
  }
  if (path === '/about') page.mainEntity = { '@id': ids.org }
  if (path === '/contact') page.mainEntity = { '@id': ids.org }

  const graph = [organization(), producer(), website(), primaryImage(), page]

  if (!home) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
        { '@type': 'ListItem', position: 2, name: route.label, item: url },
      ],
    })
  }

  if (path === '/services') {
    graph.push({
      '@type': 'ItemList',
      '@id': `${url}#services`,
      name: `${company.name} services`,
      itemListElement: serviceCopy.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Service',
          '@id': `${url}#${s.slug}`,
          name: s.title,
          serviceType: s.title,
          description: `${s.short} ${s.long}`,
          url: `${url}#${s.slug}`,
          provider: { '@id': ids.org },
        },
      })),
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

/**
 * Everything a <head> needs for a path. `null` jsonLd / `noindex` for the 404 fallback.
 * Unknown paths get the not-found record (noindex, no canonical).
 */
export function getSeo(path = '/') {
  const route = routeByPath(path)
  if (!route) {
    return {
      path,
      title: notFound.title,
      description: notFound.description,
      robots: ROBOTS_NOINDEX,
      canonical: null,
      url: null,
      image: abs(company.assets.ogImage),
      imageAlt: company.assets.ogImageAlt,
      jsonLd: null,
    }
  }
  return {
    path,
    title: route.title,
    description: route.description,
    robots: ROBOTS_INDEX,
    canonical: abs(path),
    url: abs(path),
    image: abs(company.assets.ogImage),
    imageAlt: company.assets.ogImageAlt,
    jsonLd: buildJsonLd(path),
  }
}

export const indexableRoutes = routes
