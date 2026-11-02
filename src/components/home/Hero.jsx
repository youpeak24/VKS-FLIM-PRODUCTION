import { useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import AnimatedHeading from '../common/AnimatedHeading'
import ApertureMark from '../common/ApertureMark'
import GradientText from '../common/GradientText'
import PrimaryButton from '../common/PrimaryButton'
import { art } from '../../data/artwork'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'

const EASE = [0.22, 1, 0.36, 1]

// Fixed positions keep particles deterministic between renders.
const particles = [
  { l: '8%', t: '22%', s: 5, c: 'bg-cyan', d: 9, dl: 0 },
  { l: '18%', t: '78%', s: 4, c: 'bg-magenta', d: 11, dl: 1.2 },
  { l: '34%', t: '12%', s: 3, c: 'bg-yellow', d: 8, dl: 0.4 },
  { l: '46%', t: '86%', s: 6, c: 'bg-violet', d: 12, dl: 2 },
  { l: '57%', t: '18%', s: 4, c: 'bg-orange', d: 10, dl: 0.8 },
  { l: '64%', t: '70%', s: 3, c: 'bg-cyan', d: 9, dl: 1.6 },
  { l: '74%', t: '9%', s: 5, c: 'bg-magenta', d: 13, dl: 0.2 },
  { l: '86%', t: '88%', s: 4, c: 'bg-yellow', d: 10, dl: 2.4 },
  { l: '93%', t: '34%', s: 3, c: 'bg-blue', d: 8, dl: 1 },
  { l: '27%', t: '46%', s: 2, c: 'bg-soft', d: 14, dl: 3 },
]

function MagicWord() {
  return (
    <span className="relative inline-block">
      <GradientText variant="spectrum" animate>
        Magic.
      </GradientText>
      <svg
        aria-hidden="true"
        viewBox="0 0 400 24"
        preserveAspectRatio="none"
        className="absolute -bottom-[0.04em] left-[1%] h-[0.13em] w-[94%] overflow-visible"
      >
        <defs>
          <linearGradient id="magic-stroke" x1="0" x2="1">
            <stop offset="0" stopColor="#FFD13D" />
            <stop offset=".4" stopColor="#FF168F" />
            <stop offset=".75" stopColor="#8B4DFF" />
            <stop offset="1" stopColor="#00D9FF" />
          </linearGradient>
        </defs>
        <motion.path
          d="M4 14 C 80 4, 160 20, 240 10 S 360 6, 396 12"
          fill="none"
          stroke="url(#magic-stroke)"
          strokeWidth="9"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.3, ease: EASE, delay: 1.35 }}
        />
      </svg>
      {[
        ['right-[-0.18em] top-[0.12em] size-[0.09em] bg-magenta', 1.75],
        ['right-[-0.32em] top-[0.32em] size-[0.05em] bg-cyan', 1.85],
        ['right-[-0.08em] top-[-0.02em] size-[0.04em] bg-yellow', 1.95],
      ].map(([cls, d]) => (
        <motion.span
          key={cls}
          aria-hidden="true"
          className={`absolute rounded-full ${cls}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 14, delay: d }}
        />
      ))}
    </span>
  )
}

export default function Hero() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // entrance
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        tl.fromTo('[data-hero-art]', { scale: 0.78, rotate: -14, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 2.4 }, 0.05)
          .fromTo('[data-hero-aperture]', { scale: 0.55, rotate: -60, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 2.2 }, 0.2)
          .fromTo('.hero-iris', { rotate: -140, scale: 1.25 }, { rotate: 0, scale: 1, duration: 2.6 }, 0.25)
          .fromTo('[data-hero-particle]', { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 1.2, stagger: 0.06 }, 0.9)
          .add(() => {
            // slow, continuous drift once the entrance settles
            gsap.to('[data-hero-art]', { rotate: 7, duration: 16, ease: 'sine.inOut', yoyo: true, repeat: -1 })
          })

        // scroll depth
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 }
        gsap.to('[data-hero-stage]', { yPercent: 16, scale: 1.08, ease: 'none', scrollTrigger: st })
        gsap.to('[data-hero-copy]', { yPercent: -12, autoAlpha: 0.15, ease: 'none', scrollTrigger: st })
        gsap.to('.hero-iris-scroll', { rotate: 120, ease: 'none', scrollTrigger: st })
      })

      // pointer parallax — fine pointers only
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine) and (min-width: 1024px)`, () => {
        const xTo = gsap.quickTo('[data-hero-depth]', 'x', { duration: 1.4, ease: 'power3.out' })
        const yTo = gsap.quickTo('[data-hero-depth]', 'y', { duration: 1.4, ease: 'power3.out' })
        const move = (e) => {
          xTo((e.clientX / window.innerWidth - 0.5) * -36)
          yTo((e.clientY / window.innerHeight - 0.5) * -28)
        }
        window.addEventListener('pointermove', move, { passive: true })
        return () => window.removeEventListener('pointermove', move)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const scrollToWork = () => {
    const target = document.getElementById('work')
    if (!target) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    document.getElementById('work-title')?.focus({ preventScroll: true })
  }

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-[radial-gradient(60%_55%_at_78%_45%,rgb(139_77_255/0.16),transparent_70%),radial-gradient(40%_40%_at_10%_90%,rgb(0_217_255/0.08),transparent_70%)]"
      />
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-30 opacity-60" />

      {/* artwork stage */}
      <div
        data-hero-stage
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 right-[-38vw] top-10 w-[110vw] [mask-image:linear-gradient(to_bottom,#000_48%,transparent_84%)] sm:right-[-18vw] sm:top-10 sm:w-[86vw] lg:right-[-5vw] lg:top-1/2 lg:w-[min(94vh,58vw)] lg:-translate-y-1/2 lg:[mask-image:linear-gradient(to_right,transparent_0%,#000_32%)]"
      >
        <div data-hero-depth className="relative aspect-square">
          <div data-hero-art className="absolute inset-0">
            <picture>
              <source media="(max-width: 767px)" srcSet={art.heroBurstMobile.src} />
              <img
                src={art.heroBurst.src}
                srcSet={art.heroBurst.srcSet}
                sizes="(min-width: 1024px) 58vw, 90vw"
                width={art.heroBurst.width}
                height={art.heroBurst.height}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </picture>
          </div>
          <div data-hero-aperture className="absolute inset-[32.5%]">
            <div className="hero-iris-scroll h-full w-full">
              <ApertureMark idPrefix="hero-ap" className="h-full w-full" ringClassName="animate-spin-slow" irisClassName="hero-iris" />
            </div>
          </div>
        </div>
      </div>

      {/* particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {particles.map((p, i) => (
          <span
            key={i}
            data-hero-particle
            className="animate-float absolute rounded-full opacity-70"
            style={{ left: p.l, top: p.t, '--float-dur': `${p.d}s`, '--float-delay': `${p.dl}s` }}
          >
            <span className={`block rounded-full ${p.c}`} style={{ width: p.s, height: p.s }} />
          </span>
        ))}
      </div>

      <div className="container-x flex min-h-[100svh] w-full flex-col justify-end pb-24 pt-[min(88vw,22rem)] sm:pt-[min(55vw,28rem)] lg:justify-center lg:pb-20 lg:pt-32">
        <div data-hero-copy className="w-full max-w-[64rem]">
          <motion.p
            className="eyebrow flex items-center gap-4 text-soft/80"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          >
            <span aria-hidden="true" className="h-px w-10 bg-aurora" />
            Welcome to VKS Film Production
          </motion.p>

          <AnimatedHeading
            as="h1"
            id="hero-title"
            immediate
            delay={0.4}
            stagger={0.1}
            className="display-hero mt-8 md:mt-10"
            lines={["We don’t just", 'make films.', 'We create', <MagicWord key="m" />]}
          />

          <motion.p
            className="lede mt-7 md:mt-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.05 }}
          >
            Where powerful ideas, captivating visuals, and creative storytelling come together to create unforgettable cinematic
            experiences.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.2 }}
          >
            <PrimaryButton onClick={scrollToWork} icon={ArrowDown}>
              Explore our work
            </PrimaryButton>
            <PrimaryButton to="/contact" variant="ghost" icon={ArrowUpRight}>
              Let&rsquo;s create together
            </PrimaryButton>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 right-[var(--gutter)] hidden items-center gap-4 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <span className="eyebrow text-[0.65rem] text-muted [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative block h-16 w-px overflow-hidden bg-soft/15">
          <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-aurora" />
        </span>
      </motion.div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-charcoal" />
    </section>
  )
}
