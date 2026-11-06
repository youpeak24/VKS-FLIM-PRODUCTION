# VKS Film Production — Website

Cinematic liquid-art website for **VKS FILM PRODUCTION** — _Creating Magic on Screen_.

React 19 · Vite 8 · Tailwind CSS 4 · React Router 7 · Motion for React · GSAP + ScrollTrigger · Lucide React

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

Node 20+ is recommended.

## Pages

| Route                   | Page               |
| ----------------------- | ------------------ |
| `/`                     | Home               |
| `/about`                | About Us           |
| `/services`             | Services           |
| `/contact`              | Contact Us         |
| `/privacy-policy`       | Privacy Policy     |
| `/terms-and-conditions` | Terms & Conditions |

The main navigation shows Home, About Us, Services and Contact. The legal pages are linked from the footer. The portfolio, galleries and trailers live on the Home page (project dialog and showreel), not on separate routes.

## Editing content

All content is static data. You don't need to touch any components to update it.

| What                                                          | Where                       |
| ------------------------------------------------------------- | --------------------------- |
| Company name, producer, phone, email, WhatsApp, social links, showreel video | `src/data/siteConfig.js` |
| Featured productions (posters, stills, trailers)              | `src/data/projects.js`      |
| Services, inquiry types, process steps                        | `src/data/services.js`      |
| Page titles, meta descriptions, routes (feeds `sitemap.xml`, JSON-LD, social tags) | `src/data/routes.js` |
| Domain, company facts, social profiles (also feed JSON-LD)    | `src/data/company.js`       |

### Official logo

Put the client's supplied logo file in `src/assets/branding/` and name it `logo.png`, `logo.svg` or `logo.webp`. It replaces the temporary typographic wordmark everywhere automatically, displayed unmodified. See `src/assets/branding/README.md`.

### Showreel and trailers

Set `showreelYoutubeId` in `siteConfig.js`, and `youtubeId` per project in `projects.js`. Use the ID only (the part after `v=`). Videos load from `youtube-nocookie.com` and only after the visitor presses play. With no ID, a clearly labelled "coming soon" placeholder is shown instead.

### Draft notices

`siteConfig.showDraftNotices` is `true` while content is pending client approval. It shows small yellow markers next to:

- proposed services and the proposed process
- editorial copy
- the producer introduction
- the legal drafts, including inline `[Review: …]` notes

Set it to `false` only after everything has been approved.

## Environment variables

Copy `.env.example` to `.env`. The variable is optional.

| Variable             | Purpose                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| `VITE_FORM_ENDPOINT` | Optional JSON form service, e.g. Formspree. Leave empty to use the mailto hand-off.                         |

## Contact form

- **Default (no backend):** the form validates input, then opens the visitor's own email app with the message prepared, addressed to the company email. The page says plainly that nothing has been sent yet and offers a "copy message" fallback. It never claims the message was sent.
- **Optional form service:** when `VITE_FORM_ENDPOINT` is set, the form sends JSON to that service. A success message appears only after the service returns an OK response. If you enable this, update the Privacy Policy section "Contact Form and Email Communications".
- **Spam prevention:** a hidden honeypot field (`company_website`) is already included. If you move to a server-backed integration, add server-side validation and rate limiting, and consider Cloudflare Turnstile or hCaptcha.
- Links to `/contact?inquiry=<service-slug>` preselect the inquiry type.

## Deployment

The site is a React SPA, but the build pre-generates one static HTML file per route (plus `404.html`), so any static host works. Host configuration for clean URLs, the apex -> `www` redirect and a true 404 is included:

| Host                         | File                                    |
| ---------------------------- | --------------------------------------- |
| Netlify                      | `public/_redirects`                     |
| Vercel                       | `vercel.json`                           |
| Apache / cPanel shared hosting | `public/.htaccess` (copied into `dist/`) |

For Nginx, use `try_files $uri $uri.html $uri/index.html =404;` with `error_page 404 /404.html;` (each route is a real static file, so unknown URLs return a true 404) and 301-redirect the bare `vksflim.com` to `www.vksflim.com`.

Steps:

1. Run `npm run build`.
3. Upload the contents of `dist/`.
4. Make sure HTTPS is enabled.

## SEO

The domain is fixed to `https://www.vksflim.com` (the `www` host is canonical; bare `vksflim.com` redirects to it) in `src/data/company.js`. Sitemap URLs must be on the same host as the sitemap, so change it only there.

`npm run build` post-processes the SPA (`scripts/vite-seo-plugin.js`) so every route is its own static HTML file
(`dist/about/index.html`, …) containing its own title, description, canonical, Open Graph / Twitter tags,
schema.org JSON-LD, preload hints and a crawlable `<noscript>` fallback. It also writes `sitemap.xml`
(`lastmod` comes from git history) and `404.html` (`noindex`). `public/robots.txt` and `public/llms.txt` are static.
At runtime `src/components/common/Seo.jsx` keeps `<head>` in sync on client-side navigation from the same data.

- Change titles / descriptions in `src/data/routes.js` (titles ≤ ~60 chars, descriptions ≤ ~155).
- Adding a page: add it to `src/data/routes.js`, add the `<Route>` in `App.jsx`, render `<Seo path="/new-page" />`.
- Add confirmed social profiles to `social` in `src/data/company.js` — they become JSON-LD `sameAs` automatically.
- After launch: verify the domain in Google Search Console, submit the sitemap, request indexing of the 4 main
  pages, and check Rich Results / Schema validator on the home page.

## Artwork

All paint, fluid and liquid artwork is **original procedural artwork** generated by `scripts/generate-artwork.py` in the brand palette. It is not stock photography and not client work. To regenerate it (requires Python 3, numpy and Pillow):

```bash
python scripts/generate-artwork.py            # everything
python scripts/generate-artwork.py hero cta   # only matching recipes
```

## Pre-launch checklist

- [ ] Add the official logo to `src/assets/branding/`.
- [ ] Replace all six demo productions in `src/data/projects.js` with real posters, stills, titles, descriptions and trailers, then set `isDemo: false`.
- [ ] Add the showreel YouTube ID.
- [ ] Confirm the service list, service descriptions and creative process.
- [ ] Approve the editorial copy (Home introduction, About story and philosophy, producer introduction).
- [ ] Add a producer portrait, if one will be supplied. Until then the producer section is typographic by design.
- [ ] Confirm the social platform and URL for "@VKSFilm Production", then add it to `siteConfig.social`.
- [ ] Confirm the email address `vksfilm@mailproduction.com` is correct and monitored.
- [ ] Have the Privacy Policy and Terms & Conditions reviewed. Resolve every `[Review: …]` note: legal entity, address, hosting provider, governing law, retention period.
- [ ] Replace `public/og-image.jpg` with an approved social preview image that uses the official logo.
- [ ] Submit `https://www.vksflim.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools (see the SEO section).
- [ ] Set `showDraftNotices: false`.

## Project structure

```
src/
  assets/        branding/ (logo slot), artwork/, services/, project-posters/
  components/
    layout/      Header, MobileMenu, Footer, PageTransition, ScrollToTop
    common/      AnimatedHeading, Reveal, SectionHeading, GradientText, PaintArtwork,
                 PrimaryButton, MagneticButton, Dialog, VideoModal, ProjectModal,
                 PageHero, LegalLayout, ApertureMark, BrandLogo, Seo, DraftNote
    home/        Hero, Introduction, FeaturedWorks, ColorStatement, ServicesPreview,
                 Showreel, WhyChooseUs, CreativeSignature, ContactCTA
    contact/     ContactForm
  pages/         Home, About, Services, Contact, PrivacyPolicy, TermsConditions
  data/          siteConfig, routes, projects, services, artwork, accents
  hooks/         useReducedMotion, useDialog
  lib/           gsap (plugin registration), youtube
  styles/        index.css (design tokens and utilities)
```

## Motion and accessibility notes

- Component reveals use Motion. Scroll scenes (parallax, wipes, masks) use GSAP ScrollTrigger inside `gsap.matchMedia`, so they are skipped entirely when the visitor prefers reduced motion. Every animation is reverted on unmount.
- Dialogs and the mobile menu trap focus, close on Escape, lock page scroll and return focus to the element that opened them.
- There is a skip link, visible focus styles, labelled form fields with linked error messages, and decorative artwork is hidden from assistive technology.
- Fonts (Syne, Manrope, Instrument Serif) are self-hosted through Fontsource, so no requests go to third-party font servers.
#   V K S - F L I M - P R O D U C T I O N  
 #   V K S - F L I M - P R O D U C T I O N  
 