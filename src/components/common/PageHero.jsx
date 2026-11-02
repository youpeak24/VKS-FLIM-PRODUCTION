import { useRef } from 'react'
import { motion } from 'motion/react'
import AnimatedHeading from './AnimatedHeading'
import PaintArtwork from './PaintArtwork'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Inner-page hero. Each page passes its own artwork, placement and entrance so that
 * every page shares the language but has its own composition.
 *
 * entrance: 'sweep' (clip from the right) | 'rise' (scale up from below) | 'bloom' (rotate + scale)
 */
export default function PageHero({
  eyebrow,
  lines,
  sub,
  image,
  artClassName = '',
  glow = 'rgb(255 120 31 / 0.16)',
  entrance = 'sweep',
  compact = false,
  children,
}) {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const from = {
          sweep: { clipPath: 'inset(0% 0% 0% 100%)', xPercent: 8 },
          rise: { clipPath: 'inset(100% 0% 0% 0%)', yPercent: 12, scale: 1.1 },
          bloom: { scale: 0.7, rotate: -18, autoAlpha: 0 },
        }[entrance]
        const to = {
          sweep: { clipPath: 'inset(0% 0% 0% 0%)', xPercent: 0 },
          rise: { clipPath: 'inset(0% 0% 0% 0%)', yPercent: 0, scale: 1 },
          bloom: { scale: 1, rotate: 0, autoAlpha: 1 },
        }[entrance]
        gsap.fromTo('[data-ph-art]', from, { ...to, duration: 2, ease: 'expo.inOut', delay: 0.15 })
        gsap.to('[data-ph-stage]', {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('[data-ph-glow]', { xPercent: 12, yPercent: -10, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      aria-labelledby="page-title"
      className={`relative isolate overflow-hidden ${compact ? 'pb-14 pt-32 sm:pb-20 sm:pt-40 md:pb-24 md:pt-48' : 'flex min-h-[100svh] w-full items-end pb-20 pt-36 sm:pt-40 md:pb-28'}`}
    >
      <div
        data-ph-glow
        aria-hidden="true"
        className="absolute -right-[10%] top-[5%] -z-30 h-[46rem] w-[46rem] rounded-full"
        style={{ background: `radial-gradient(closest-side, ${glow}, transparent)` }}
      />
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-30 opacity-50" />

      {image && (
        <div data-ph-stage aria-hidden="true" className={`pointer-events-none absolute -z-10 ${artClassName}`}>
          <div data-ph-art>
            <PaintArtwork image={image} priority sizes="(min-width: 1024px) 70vw, 120vw" className="h-auto w-full" />
          </div>
        </div>
      )}

      <div className="container-x relative w-full">
        <motion.p
          className="eyebrow flex items-center gap-4 text-soft/80"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
        >
          <span aria-hidden="true" className="h-px w-10 bg-aurora" />
          {eyebrow}
        </motion.p>
        <AnimatedHeading as="h1" id="page-title" immediate delay={0.35} stagger={0.1} className="display-hero mt-6 max-w-[64rem]" lines={lines} />
        {sub && (
          <motion.p
            className="lede mt-8 md:mt-10"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.95 }}
          >
            {sub}
          </motion.p>
        )}
        {children}
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-obsidian" />
    </section>
  )
}
