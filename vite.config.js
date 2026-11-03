import { defineConfig, loadEnv } from 'vite'
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

/**
 * Serves api/contact.js during `npm run dev`, so the contact form works locally without
 * `vercel dev`. In production Vercel runs the same file as a serverless function.
 */
function devContactApi(env) {
  return {
    name: 'vks-dev-contact-api',
    apply: 'serve',
    configureServer(server) {
      for (const [key, value] of Object.entries(env)) process.env[key] ??= value

      server.middlewares.use('/api/contact', async (req, res) => {
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        try {
          req.body = JSON.parse(Buffer.concat(chunks).toString() || 'null')
        } catch {
          req.body = null
        }
        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (payload) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(payload))
        }
        try {
          const { default: handler } = await server.ssrLoadModule('/api/contact.js')
          await handler(req, res)
        } catch (err) {
          server.config.logger.error(String(err?.stack ?? err))
          if (!res.writableEnded) res.status(500).json({ ok: false, error: 'Server error.' })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), seoFiles(), devContactApi(loadEnv(mode, process.cwd(), ''))],
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
}))
