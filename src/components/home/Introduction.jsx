import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '../common/SectionHeading'
import Reveal from '../common/Reveal'
import PaintArtwork from '../common/PaintArtwork'
import GradientText from '../common/GradientText'
import DraftNote from '../common/DraftNote'
import { art } from '../../data/artwork'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'

/** Vertical film perforation strip. */
export function Perforations({ count = 14, className = '' }) {
  return (
    <div aria-hidden="true" className={`flex flex-col justify-between ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="block h-[0.55rem] w-[0.9rem] rounded-[2px] bg-soft/15" />
      ))}
    </div>
  )
}

export default function Introduction() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-intro-frame]',
          { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 24px 24px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 999px 999px 24px 24px)',
            duration: 1.6,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: '[data-intro-frame]', start: 'top 82%' },
          },
        )
        gsap.fromTo(
          '[data-intro-img]',
          { yPercent: -8, scale: 1.18 },
          {
            yPercent: 8,
            scale: 1.06,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
        gsap.fromTo(
          '[data-intro-ring]',
          { rotate: -8, x: -30, autoAlpha: 0 },
          { rotate: 0, x: 0, autoAlpha: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '[data-intro-frame]', start: 'top 75%' } },
        )
        const path = root.current.querySelector('[data-intro-trail]')
        if (path) {
          const len = path.getTotalLength()
          gsap.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              ease: 'none',
              scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center 40%', scrub: 0.8 },
            },
          )
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="intro-title" className="section-y relative isolate overflow-hidden bg-charcoal">
      {/* decorative colour trail guiding the eye from copy to frame */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full lg:block"
      >
        <defs>
          <linearGradient id="intro-trail" x1="0" x2="1">
            <stop offset="0" stopColor="#00D9FF" stopOpacity="0" />
            <stop offset=".35" stopColor="#00D9FF" />
            <stop offset=".7" stopColor="#8B4DFF" />
            <stop offset="1" stopColor="#FF168F" />
          </linearGradient>
        </defs>
        <path
          data-intro-trail
          d="M -20 760 C 260 820, 520 640, 700 700 S 960 860, 1060 560 S 1250 120, 1480 220"
          fill="none"
          stroke="url(#intro-trail)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="container-x grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 lg:pr-10">
          <SectionHeading
            number="01"
            eyebrow="The art of storytelling"
            id="intro-title"
            lines={[
              'Every frame',
              <>
                tells a <GradientText variant="ocean">story.</GradientText>
              </>,
            ]}
          />
          <Reveal className="mt-10 max-w-xl md:mt-12">
            <p className="text-[clamp(1.15rem,1.55vw,1.45rem)] leading-[1.6] text-soft/85">
              At VKS Film Production, we believe cinema is more than moving images. It is the art of transforming imagination into
              emotion, stories into experiences, and ideas into moments{' '}
              <span className="serif-accent text-[1.12em] text-cyan">worth remembering.</span>
            </p>
            <DraftNote className="mt-6">Editorial copy &mdash; pending client approval</DraftNote>
          </Reveal>
          <Reveal delay={0.15} className="mt-10">
            <Link
              to="/about"
              className="group inline-flex min-h-12 items-center gap-4 text-sm font-bold uppercase tracking-[0.22em] text-soft"
            >
              <span className="relative">
                Discover our story
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-aurora transition-transform duration-500 ease-cinema group-hover:scale-x-50" />
              </span>
              <span className="grid size-11 place-items-center rounded-full border border-soft/20 transition-all duration-500 ease-cinema group-hover:translate-x-1 group-hover:border-cyan group-hover:bg-cyan group-hover:text-obsidian">
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mx-auto w-full max-w-sm sm:max-w-md lg:col-span-5 lg:max-w-none">
          <div className="relative">
            <div
              data-intro-ring
              aria-hidden="true"
              className="grad-border absolute inset-0 translate-x-4 translate-y-4 rounded-t-[999px] rounded-b-3xl [--grad:var(--grad-ocean)] md:translate-x-6 md:translate-y-6"
            />
            <Perforations className="absolute -left-8 bottom-8 top-[30%] hidden md:flex" />
            <div data-intro-frame className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl bg-graphite">
              <PaintArtwork
                data-intro-img
                image={art.introFrame}
                sizes="(min-width: 1024px) 36vw, 90vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
            </div>
          </div>
          <p className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-muted">
            <span aria-hidden="true" className="text-cyan">
              Fig. 01
            </span>
            Liquid colour study
          </p>
        </div>
      </div>
    </section>
  )
}
