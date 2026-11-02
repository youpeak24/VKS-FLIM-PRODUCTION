import { useRef } from 'react'
import { Phone } from 'lucide-react'
import { Eyebrow } from '../common/SectionHeading'
import AnimatedHeading from '../common/AnimatedHeading'
import Reveal from '../common/Reveal'
import PaintArtwork from '../common/PaintArtwork'
import GradientText from '../common/GradientText'
import PrimaryButton from '../common/PrimaryButton'
import { art } from '../../data/artwork'
import { siteConfig } from '../../data/siteConfig'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'

/**
 * Cinematic closing scene. Reused on About / Services with different copy.
 */
export default function ContactCTA({
  eyebrow = 'Have a story to tell?',
  lines = [
    'Let’s create',
    'something',
    <>
      <GradientText variant="spectrum" animate>
        unforgettable.
      </GradientText>
    </>,
  ],
  body = 'Every extraordinary production begins with a conversation. Let’s bring your next idea to life.',
  primaryLabel = 'Start a conversation',
  showProducer = true,
  number = '06',
}) {
  const root = useRef(null)
  const { producer, contact } = siteConfig

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-cta-art]',
          { scale: 1.25, rotate: -6, autoAlpha: 0.2 },
          {
            scale: 1,
            rotate: 0,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: 0.8 },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-obsidian py-[calc(var(--section-y)*1.25)]">
      <div data-cta-art aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <PaintArtwork image={art.ctaPaint} sizes="140vw" className="h-full w-full min-w-[60rem] object-cover" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_48%_55%_at_50%_50%,rgb(9_9_11/0.92),rgb(9_9_11/0.5)_70%,transparent)]"
      />

      <div className="container-x flex w-full flex-col items-center text-center">
        <Eyebrow number={number} tone="text-magenta" className="justify-center">
          {eyebrow}
        </Eyebrow>
        <AnimatedHeading id="cta-title" className="display-xl mt-8 w-full" style={{ fontSize: 'clamp(1.8rem, 5.6vw, 6.5rem)' }} lines={lines} />
        <Reveal className="mt-8 max-w-xl">
          <p className="text-lg leading-relaxed text-soft/80 md:text-xl">{body}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <PrimaryButton to="/contact">{primaryLabel}</PrimaryButton>
          <PrimaryButton href={contact.phoneHref} variant="ghost" icon={Phone}>
            Call the producer
          </PrimaryButton>
        </Reveal>

        {showProducer && (
          <Reveal delay={0.2} className="mt-14">
            <div className="inline-flex flex-col items-center gap-1 rounded-2xl border border-soft/10 bg-obsidian/60 px-8 py-5 backdrop-blur-sm sm:flex-row sm:gap-6">
              <span className="text-left">
                <span className="block font-display text-lg font-bold uppercase tracking-tight">{producer.name}</span>
                <span className="eyebrow block text-[0.62rem] text-muted">{producer.role}</span>
              </span>
              <span aria-hidden="true" className="hidden h-8 w-px bg-soft/15 sm:block" />
              <a href={contact.phoneHref} className="inline-flex min-h-11 items-center gap-2 font-semibold text-cyan hover:underline hover:underline-offset-4">
                <Phone className="size-4" aria-hidden="true" />
                {contact.phoneDisplay}
              </a>
            </div>
          </Reveal>
        )}
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-obsidian" />
    </section>
  )
}
