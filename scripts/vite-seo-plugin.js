/**
 * Build-time SEO for a client-rendered React app.
 *
 * Why: a plain SPA serves the SAME index.html for every URL, so crawlers and social scrapers that don't
 * run JavaScript (Bing, Facebook, WhatsApp, LinkedIn, X, most AI crawlers…) would see one title / one
 * description / one canonical for the whole site. This plugin post-processes the build so that every route
 * gets its own static HTML file containing:
 *
 *   • <title>, meta description, robots, canonical, Open Graph + Twitter tags
 *   • schema.org JSON-LD (@graph: Organization, Person, WebSite, WebPage, BreadcrumbList, Services…)
 *   • resource hints (route chunk modulepreload, font + hero-image preload) for faster LCP
 *   • a <noscript> fallback with the page's real heading, copy and internal links
 *
 * It also writes sitemap.xml (git-derived <lastmod>) and a 404.html (noindex) used for unknown URLs.
 * All text comes from src/data/*.js — the same data the React <Seo> component uses at runtime.
 *
 * The SEO block in index.html is delimited by <!--seo:start--> … <!--seo:end--> and the fallback body by
 * <!--seo:body-start--> … <!--seo:body-end-->.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { company } from '../src/data/company.js'
import { routes } from '../src/data/routes.js'
import { serviceCopy } from '../src/data/serviceCopy.js'
import { abs, getSeo } from '../src/data/seo.js'

const HEAD_RE = /<!--seo:start-->[\s\S]*?<!--seo:end-->/
const BODY_RE = /<!--seo:body-start-->[\s\S]*?<!--seo:body-end-->/

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
/** JSON for an inline <script>: neutralise "</script>" and HTML comment openers. */
const safeJson = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')

function headBlock(seo, hints = '') {
  const lines = [
    '<!--seo:start-->',
    `<title>${escText(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<meta name="robots" content="${esc(seo.robots)}" />`,
    seo.canonical ? `<link rel="canonical" href="${esc(seo.canonical)}" />` : '',
    `<meta property="og:site_name" content="${esc(company.name)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="en_US" />',
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    seo.url ? `<meta property="og:url" content="${esc(seo.url)}" />` : '',
    `<meta property="og:image" content="${esc(seo.image)}" />`,
    `<meta property="og:image:secure_url" content="${esc(seo.image)}" />`,
    '<meta property="og:image:type" content="image/jpeg" />',
    `<meta property="og:image:width" content="${company.assets.ogImageWidth}" />`,
    `<meta property="og:image:height" content="${company.assets.ogImageHeight}" />`,
    `<meta property="og:image:alt" content="${esc(seo.imageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:image" content="${esc(seo.image)}" />`,
    `<meta name="twitter:image:alt" content="${esc(seo.imageAlt)}" />`,
    seo.jsonLd ? `<script type="application/ld+json" id="ld-json">${safeJson(seo.jsonLd)}</script>` : '',
    hints,
    '<!--seo:end-->',
  ]
  return lines.filter(Boolean).join('\n    ')
}

/** Crawlable fallback shown only when JavaScript is off — real heading, copy and internal links. */
function bodyBlock(route) {
  const { contact, producer } = company
  const nav = routes
    .filter((r) => r.nav)
    .map((r) => `<a style="color:#00D9FF" href="${r.path}">${escText(r.label)}</a>`)
    .join(' · ')
  const legal = routes
    .filter((r) => !r.nav)
    .map((r) => `<a style="color:#00D9FF" href="${r.path}">${escText(r.label)}</a>`)
    .join(' · ')

  const parts = []
  if (route) {
    parts.push(`<h1>${escText(route.h1)}</h1>`, `<p>${escText(route.intro)}</p>`)
    if (route.path === '/' || route.path === '/services') {
      parts.push(
        `<h2>${route.path === '/' ? 'What we do' : 'Our services'}</h2>`,
        '<ul>' +
          serviceCopy
            .map((s) => `<li><strong>${escText(s.title)}</strong> — ${escText(s.short)}</li>`)
            .join('') +
          '</ul>',
      )
    }
  } else {
    parts.push('<h1>Page not found</h1>', '<p>The page you were looking for isn’t part of this production.</p>')
  }

  return [
    '<!--seo:body-start-->',
    '<noscript>',
    '<div style="font-family:system-ui,sans-serif;color:#F8F7FC;background:#09090B;padding:2rem;line-height:1.6">',
    `<p><strong>${escText(company.name)}</strong> — ${escText(company.tagline)}</p>`,
    `<nav aria-label="Primary">${nav}</nav>`,
    '<main>',
    ...parts,
    '</main>',
    `<p>Contact ${escText(producer.name)}, ${escText(producer.role)}: <a style="color:#00D9FF" href="${esc(contact.phoneHref)}">${escText(contact.phoneDisplay)}</a> · <a style="color:#00D9FF" href="mailto:${esc(contact.email)}">${escText(contact.email)}</a></p>`,
    `<p>${legal}</p>`,
    '<p>Please enable JavaScript for the full experience.</p>',
    '</div>',
    '</noscript>',
    '<!--seo:body-end-->',
  ].join('\n    ')
}

const normalise = (p) => (p ?? '').replace(/\\/g, '/')

/** Asset file names (e.g. "hero-burst.webp") → hashed output path. */
function indexAssets(bundle) {
  const map = new Map()
  for (const item of Object.values(bundle)) {
    if (item.type !== 'asset') continue
    const names = item.names?.length ? item.names : item.name ? [item.name] : []
    for (const n of names) map.set(n.split('/').pop(), item.fileName)
  }
  return map
}

function resourceHints(route, bundle, assets, html) {
  const out = []
  const has = (file) => html.includes(`/${file}`)

  // 1) Route chunk (+ its static shared chunks) so the page renders without a request waterfall.
  const pageFile = route?.sources?.[0]
  if (pageFile) {
    const chunks = Object.values(bundle).filter((c) => c.type === 'chunk')
    const byName = new Map(chunks.map((c) => [c.fileName, c]))
    const entry = chunks.find((c) => normalise(c.facadeModuleId).endsWith(`/${pageFile}`))
    if (entry) {
      const seen = new Set()
      const walk = (c) => {
        if (!c || seen.has(c.fileName)) return
        seen.add(c.fileName)
        c.imports?.forEach((i) => walk(byName.get(i)))
      }
      walk(entry)
      for (const f of seen) {
        if (!has(f)) out.push(`<link rel="modulepreload" crossorigin href="/${f}" />`)
      }
    }
  }

  // 2) Self-hosted variable fonts used by every page (latin subset only).
  for (const name of ['syne-latin-wght-normal.woff2', 'manrope-latin-wght-normal.woff2']) {
    const file = assets.get(name)
    if (file) out.push(`<link rel="preload" as="font" type="font/woff2" crossorigin href="/${file}" />`)
  }

  // 3) Home hero artwork — mirrors the <picture> in Hero.jsx so the right file is fetched early.
  if (route?.path === '/') {
    const mobile = assets.get('hero-burst-mobile.webp')
    const small = assets.get('hero-burst-800.webp')
    const large = assets.get('hero-burst.webp')
    if (mobile) out.push(`<link rel="preload" as="image" type="image/webp" fetchpriority="high" media="(max-width: 767px)" href="/${mobile}" />`)
    if (small && large) {
      out.push(
        `<link rel="preload" as="image" type="image/webp" fetchpriority="high" media="(min-width: 768px)" imagesrcset="/${small} 800w, /${large} 1500w" imagesizes="(min-width: 1024px) 58vw, 90vw" />`,
      )
    }
  }
  return out.join('\n    ')
}

/** Last commit date touching the given paths (YYYY-MM-DD); falls back to today when git is unavailable. */
function lastmod(sources) {
  const today = new Date().toISOString().slice(0, 10)
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...sources], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return out || today
  } catch {
    return today
  }
}

function sitemapXml() {
  const urls = routes
    .map((r) => {
      const image =
        r.path === '/'
          ? `\n    <image:image>\n      <image:loc>${abs(company.assets.ogImage)}</image:loc>\n      <image:title>${escText(company.name)}</image:title>\n    </image:image>`
          : ''
      return `  <url>\n    <loc>${abs(r.path)}</loc>\n    <lastmod>${lastmod(r.sources)}</lastmod>\n    <priority>${r.priority}</priority>${image}\n  </url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`
}

export function seoPlugin() {
  return {
    name: 'vks-seo',

    // Dev + build: put the home-page SEO block into index.html (the build then replaces it per route).
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(HEAD_RE, () => headBlock(getSeo('/'))).replace(BODY_RE, () => bodyBlock(routes[0]))
      },
    },

    // Dev server: serve the same sitemap.xml that the build emits, so /sitemap.xml is reachable locally too.
    configureServer(server) {
      server.middlewares.use('/sitemap.xml', (_req, res) => {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8')
        res.end(sitemapXml())
      })
    },

    // Build only: runs after every file is on disk, so hashed asset names are known.
    writeBundle(options, bundle) {
      const outDir = options.dir ?? 'dist'
      const template = readFileSync(join(outDir, 'index.html'), 'utf8')
      const assets = indexAssets(bundle)

      const write = (file, content) => {
        const target = join(outDir, file)
        mkdirSync(dirname(target), { recursive: true })
        writeFileSync(target, content)
      }

      const render = (route, seo) =>
        template
          .replace(HEAD_RE, () => headBlock(seo, resourceHints(route, bundle, assets, template)))
          .replace(BODY_RE, () => bodyBlock(route))

      for (const route of routes) {
        write(route.path === '/' ? 'index.html' : `${route.path.slice(1)}/index.html`, render(route, getSeo(route.path)))
      }
      // Served by the host (with a 404 status) for any unknown URL; React Router then renders <NotFound />.
      write('404.html', render(null, getSeo('/__not-found')))

      write('sitemap.xml', sitemapXml())

      // Vercel preview deployments (*.vercel.app) must never be indexed — they would duplicate the real site.
      // Production keeps the static public/robots.txt.
      if (process.env.VERCEL_ENV === 'preview') {
        write('robots.txt', 'User-agent: *\nDisallow: /\n')
      }
    },
  }
}
