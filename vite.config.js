import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { routes } from './src/data/routes.js'

/**
 * Emits robots.txt and (when VITE_SITE_URL is set) sitemap.xml at build time,
 * so the production domain is never hard-coded or guessed.
 */
function seoFiles() {
  let siteUrl = ''
  return {
    name: 'vks-seo-files',
    apply: 'build',
    configResolved(config) {
      siteUrl = (config.env.VITE_SITE_URL || '').trim().replace(/\/$/, '')
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /']
      if (siteUrl) {
        const today = new Date().toISOString().slice(0, 10)
        const urls = routes
          .map(
            (r) =>
              `  <url>\n    <loc>${siteUrl}${r.path === '/' ? '/' : r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${r.priority}</priority>\n  </url>`,
          )
          .join('\n')
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        })
        robots.push('', `Sitemap: ${siteUrl}/sitemap.xml`)
      } else {
        this.warn('VITE_SITE_URL is not set — sitemap.xml was not generated. See .env.example.')
      }
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots.join('\n') + '\n' })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoFiles()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
    rolldownOptions: {
      output: {
        // long-lived vendor chunks cache well across content updates
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/ },
            { name: 'gsap', test: /node_modules[\\/](gsap|@gsap)[\\/]/ },
          ],
        },
      },
    },
  },
})
