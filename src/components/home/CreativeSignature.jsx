import { useRef } from 'react'
import { art } from '../../data/artwork'
import GradientText from '../common/GradientText'
import PaintArtwork from '../common/PaintArtwork'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'

export default function CreativeSignature() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-sig-trail]',
          { xPercent: -14, rotate: -4 },
          {
            xPercent: 8,
            rotate: 2,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%' } })
        tl.fromTo('[data-sig-line]', { yPercent: 105 }, { yPercent: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out' })
          .fromTo(
            '[data-sig-extra]',
            { clipPath: 'inset(0% 100% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' },
            0.45,
          )
          .fromTo('[data-sig-spark]', { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 1, ease: 'back.out(3)', stagger: 0.1 }, 1.4)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const line = 'block overflow-hidden pb-[0.1em] -mb-[0.1em]'

  return (
    <section ref={root} aria-label="Our signature" className="section-y relative isolate overflow-hidden bg-obsidian">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[-10%] top-1/2 -z-10 -translate-y-1/2 opacity-60">
        <div data-sig-trail>
          <PaintArtwork image={art.signatureTrail} sizes="120vw" className="w-full" />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_40%_50%,rgb(9_9_11/0.55),transparent)]" />

      <div className="container-x py-[clamp(2rem,6vw,6rem)]">
        <p className="font-display text-[clamp(1.9rem,8.6vw,7.6rem)] font-bold uppercase leading-[0.9] tracking-[-0.045em]">
          <span className={line}>
            <span data-sig-line className="block">
              We make
            </span>
          </span>{' '}
          <span className={`${line} lg:pl-[10vw]`}>
            <span data-sig-line className="block">
              the <span className="text-outline text-soft [-webkit-text-stroke-width:1.5px]">ordinary</span>
            </span>
          </span>{' '}
          <span className={`${line} relative lg:pl-[4vw]`}>
            <span data-sig-line className="block">
              <span data-sig-extra className="relative inline-block [filter:drop-shadow(0_6px_28px_rgb(9_9_11/0.7))]">
                <GradientText variant="spectrum" animate>
                  Extraordinary
                </GradientText>
                <span className="text-magenta">.</span>
              </span>
            </span>
          </span>
        </p>
        <div aria-hidden="true" className="relative mt-2 flex justify-end gap-3 pr-[6vw]">
          {['bg-yellow size-3', 'bg-cyan size-2', 'bg-magenta size-4'].map((c) => (
            <span key={c} data-sig-spark className={`rounded-full ${c}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
