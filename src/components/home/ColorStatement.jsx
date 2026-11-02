import { useRef } from 'react'
import { art } from '../../data/artwork'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'

export default function ColorStatement() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const st = { trigger: root.current, start: 'top 90%', end: 'top 10%', scrub: 0.7 }
        gsap.fromTo(
          '[data-cm-wipe]',
          { clipPath: 'inset(16% 18% 16% 18% round 48px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: st },
        )
        gsap.fromTo('[data-cm-img]', { scale: 1.35, rotate: -3 }, { scale: 1.05, rotate: 0, ease: 'none', scrollTrigger: st })
        gsap.to('[data-cm-img]', {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.fromTo(
          '[data-cm-line]',
          { yPercent: 60, autoAlpha: 0, scale: 1.12, letterSpacing: '0.06em' },
          {
            yPercent: 0,
            autoAlpha: 1,
            scale: 1,
            letterSpacing: '-0.045em',
            duration: 1.6,
            stagger: 0.12,
            ease: 'expo.out',
            scrollTrigger: { trigger: root.current, start: 'top 45%' },
          },
        )
        gsap.fromTo(
          '[data-cm-sub]',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 1.2, delay: 0.5, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 45%' } },
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="cm-title" className="relative isolate grid min-h-[100svh] w-full place-items-center overflow-hidden bg-obsidian py-28 md:py-36">
      <div data-cm-wipe aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div data-cm-img className="absolute inset-0">
          <picture>
            <source media="(max-width: 767px)" srcSet={art.colorMomentPortrait.src} />
            <img
              src={art.colorMoment.src}
              srcSet={art.colorMoment.srcSet}
              sizes="100vw"
              width={art.colorMoment.width}
              height={art.colorMoment.height}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </picture>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgb(9_9_11/0.86)_0%,rgb(9_9_11/0.6)_50%,rgb(9_9_11/0.08)_100%)]" />
      </div>

      <div className="container-x w-full text-center">
        <h2 id="cm-title" className="display-giant">
          <span data-cm-line className="block">
            Imagination
          </span>{' '}
          <span data-cm-line className="block">
            has <span className="serif-accent text-[1.08em] lowercase">no limits.</span>
          </span>
        </h2>
        <p data-cm-sub className="mx-auto mt-8 max-w-md text-lg text-soft/85 md:mt-10 md:text-xl">
          Every great visual begins with a bold idea.
        </p>
      </div>
    </section>
  )
}
