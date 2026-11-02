import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Mail, Phone } from 'lucide-react'
import { siteConfig, whatsappHref } from '../../data/siteConfig'
import { art } from '../../data/artwork'
import BrandLogo from '../common/BrandLogo'
import PaintArtwork from '../common/PaintArtwork'
import GradientText from '../common/GradientText'
import AnimatedHeading from '../common/AnimatedHeading'
import WhatsAppIcon from '../common/WhatsAppIcon'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'

const legal = siteConfig.routes.filter((r) => !r.nav)

function FooterHeading({ children }) {
  return <h2 className="eyebrow text-[0.68rem] text-muted">{children}</h2>
}

const linkCls =
  'relative inline-flex min-h-10 items-center text-soft/85 transition-colors duration-300 hover:text-soft after:absolute after:bottom-2 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-soft/60 after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100'

export default function Footer() {
  const ref = useRef(null)
  const { contact } = siteConfig
  const year = new Date().getFullYear()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-footer-art]',
          { yPercent: 25, scale: 1.08 },
          {
            yPercent: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    document.getElementById('main')?.focus({ preventScroll: true })
  }

  return (
    <footer ref={ref} className="relative isolate overflow-hidden border-t border-soft/[0.06] bg-obsidian">
      <div data-footer-art aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 opacity-55">
        <PaintArtwork image={art.footerFlow} sizes="100vw" className="w-full min-w-[44rem] object-cover sm:min-w-[56rem]" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/70 to-obsidian/30" />
      </div>

      <div className="container-x pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[var(--section-y)]">
        <AnimatedHeading
          as="p"
          className="display-giant"
          style={{ fontSize: 'clamp(2.05rem, 7.4vw, 9rem)' }}
          lines={[
            <>
              Creating <GradientText variant="spectrum" animate>Magic</GradientText>
            </>,
            <>
              on screen<span className="text-magenta">.</span>
            </>,
          ]}
        />

        <div className="hairline mt-16 md:mt-24" />

        <div className="mt-12 grid grid-flow-row-dense grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12 md:gap-8">
          <div className="col-span-2 md:col-span-5">
            <BrandLogo size="md" />
            <p className="mt-6 max-w-sm text-[0.98rem] leading-relaxed text-muted">
              {siteConfig.legalName} &mdash; {siteConfig.tagline.toLowerCase()}. Where powerful ideas, captivating visuals and creative
              storytelling come together.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-2">
            <FooterHeading>Explore</FooterHeading>
            <ul className="mt-4">
              {siteConfig.nav.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-3">
            <FooterHeading>Get in touch</FooterHeading>
            <ul className="mt-4 space-y-1">
              <li>
                <a href={contact.phoneHref} className={`${linkCls} gap-3`}>
                  <Phone className="size-4 text-cyan" aria-hidden="true" />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className={`${linkCls} gap-3 break-all`}>
                  <Mail className="size-4 shrink-0 text-magenta" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={`${linkCls} gap-3`}>
                  <WhatsAppIcon className="size-4 text-yellow" />
                  WhatsApp
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              {siteConfig.social.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    {s.label}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <FooterHeading>Legal</FooterHeading>
            <ul className="mt-4">
              {legal.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-soft/10 pt-8 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            &copy; {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={toTop}
            className="group inline-flex min-h-11 items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-soft"
          >
            Back to top
            <span className="grid size-10 place-items-center rounded-full border border-soft/20 transition-colors duration-300 group-hover:border-soft group-hover:bg-soft group-hover:text-obsidian">
              <ArrowUp className="size-4 transition-transform duration-500 ease-cinema group-hover:-translate-y-0.5" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}
