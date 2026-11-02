import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Seo from '../components/common/Seo'
import PageHero from '../components/common/PageHero'
import SectionHeading from '../components/common/SectionHeading'
import AnimatedHeading from '../components/common/AnimatedHeading'
import Reveal from '../components/common/Reveal'
import GradientText from '../components/common/GradientText'
import PaintArtwork from '../components/common/PaintArtwork'
import PrimaryButton from '../components/common/PrimaryButton'
import DraftNote from '../components/common/DraftNote'
import { art } from '../data/artwork'
import { services, processSteps } from '../data/services'
import { accents } from '../data/accents'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'

/** Film-strip marquee of service names. */
function ServiceMarquee() {
  const items = [...services, ...services]
  return (
    <div aria-hidden="true" className="relative mt-16 overflow-hidden border-y border-soft/10 py-5 md:mt-24">
      <div className="animate-marquee flex w-max gap-10">
        {items.map((s, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl font-bold uppercase tracking-tight md:text-4xl">
            <span className={i % 2 ? 'text-outline text-soft/60' : 'text-soft'}>{s.title}</span>
            <span className={`size-2.5 rounded-full ${accents[s.accent].bg}`} />
          </span>
        ))}
      </div>
    </div>
  )
}

function ServiceBlock({ service, index }) {
  const a = accents[service.accent]
  const flip = index % 2 === 1

  return (
    <section
      id={service.slug}
      aria-labelledby={`${service.slug}-title`}
      data-svc
      className="relative scroll-mt-28 py-[calc(var(--section-y)*0.6)]"
    >
      <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className={`relative min-w-0 lg:col-span-7 ${flip ? 'lg:order-2 lg:col-start-6' : ''}`}>
          <span
            data-svc-outline
            aria-hidden="true"
            className={`absolute inset-0 rounded-[1.75rem] border ${a.border} opacity-60 ${flip ? '-translate-x-3 translate-y-3 md:-translate-x-5 md:translate-y-5' : 'translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5'}`}
          />
          <div data-svc-frame className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-graphite">
            <PaintArtwork
              data-svc-img
              image={service.image}
              sizes="(min-width: 1024px) 56vw, 92vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-obsidian/50 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 eyebrow text-[0.65rem] text-soft/80 md:bottom-7 md:left-7">
              Fig. {service.number} &mdash; {service.title}
            </span>
          </div>
        </div>

        <div className={`min-w-0 lg:col-span-5 ${flip ? 'lg:order-1' : 'lg:col-start-8'}`}>
          <span
            data-svc-number
            aria-hidden="true"
            className={`text-outline block font-display text-[clamp(4.5rem,10vw,9rem)] font-extrabold leading-[0.8] tracking-[-0.05em] ${a.text}`}
          >
            {service.number}
          </span>
          <AnimatedHeading
            id={`${service.slug}-title`}
            className="mt-6 font-display text-[clamp(1.75rem,2.9vw,2.95rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em]"
            lines={[service.title]}
          />
          <Reveal className="mt-6">
            <span aria-hidden="true" className={`block h-[3px] w-16 rounded-full ${a.bg}`} />
            <p className="mt-6 text-lg leading-relaxed text-soft/80">{service.short}</p>
            <p className="mt-4 leading-relaxed text-muted">{service.long}</p>
            <Link
              to={`/contact?inquiry=${service.slug}`}
              className={`group mt-8 inline-flex min-h-12 items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] ${a.text}`}
            >
              Discuss this service
              <ArrowRight className="size-4 transition-transform duration-500 ease-cinema group-hover:translate-x-1.5" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Process() {
  const root = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-process-line]',
          { scaleX: 0, scaleY: 0 },
          { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } },
        )
        gsap.fromTo(
          '[data-process-step]',
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.14, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } },
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const dots = ['bg-cyan', 'bg-magenta', 'bg-orange', 'bg-yellow']

  return (
    <section ref={root} aria-labelledby="process-title" className="section-y relative isolate overflow-hidden bg-charcoal">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            className="lg:col-span-7"
            number="07"
            tone="text-cyan"
            eyebrow="Creative process"
            id="process-title"
            headingClassName="display-lg"
            lines={[
              'From spark',
              <>
                to <GradientText variant="ocean">screen.</GradientText>
              </>,
            ]}
          />
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <p className="text-muted">A simple rhythm that keeps the vision clear at every stage.</p>
            <DraftNote className="mt-5">Proposed process &mdash; pending client review</DraftNote>
          </Reveal>
        </div>

        <ol className="relative mt-16 grid gap-10 md:mt-24 lg:grid-cols-4 lg:gap-8">
          <span aria-hidden="true" className="absolute left-[0.6rem] top-2 h-[calc(100%-1rem)] w-px bg-soft/10 lg:left-0 lg:top-[0.6rem] lg:h-px lg:w-full" />
          <span
            data-process-line
            aria-hidden="true"
            className="absolute left-[0.6rem] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-cyan via-magenta to-yellow lg:left-0 lg:top-[0.6rem] lg:h-px lg:w-full lg:origin-left lg:bg-gradient-to-r"
          />
          {processSteps.map((step, i) => (
            <li key={step.number} data-process-step className="relative min-w-0 pl-10 lg:pl-0 lg:pt-12">
              <span aria-hidden="true" className={`absolute left-0 top-1 size-5 rounded-full border-4 border-charcoal lg:top-0 ${dots[i]}`} />
              <span className="eyebrow text-muted">{step.number}</span>
              <h3 className="mt-3 font-display text-[clamp(1.4rem,1.9vw,2rem)] font-bold uppercase tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-2 text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function CanvasCTA() {
  const root = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-canvas-frame]',
          { clipPath: 'inset(10% 8% 10% 8% round 40px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 28px)',
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 25%', scrub: 0.6 },
          },
        )
        gsap.fromTo('[data-canvas-img]', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="canvas-title" className="section-y relative">
      <div className="container-x">
        <div data-canvas-frame className="relative isolate overflow-hidden rounded-[28px] px-6 py-20 sm:px-12 md:px-16 md:py-32 lg:px-24">
          <PaintArtwork data-canvas-img image={art.canvasFrame} sizes="94vw" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/95 via-obsidian/75 to-obsidian/20" />
          <AnimatedHeading
            id="canvas-title"
            className="display-xl max-w-3xl"
            lines={[
              'Your vision.',
              'Our creative',
              <>
                <GradientText variant="spectrum" animate>
                  canvas.
                </GradientText>
              </>,
            ]}
          />
          <Reveal className="mt-8 max-w-md">
            <p className="text-lg leading-relaxed text-soft/85">Bring the idea. We&rsquo;ll bring the colour, the craft and the cinema.</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <PrimaryButton to="/contact">Discuss your project</PrimaryButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default function Services() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray('[data-svc]').forEach((section) => {
          const frame = section.querySelector('[data-svc-frame]')
          const img = section.querySelector('[data-svc-img]')
          gsap.fromTo(
            frame,
            { clipPath: 'inset(12% 12% 12% 12% round 48px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 28px)',
              duration: 1.6,
              ease: 'expo.inOut',
              scrollTrigger: { trigger: section, start: 'top 78%' },
            },
          )
          gsap.fromTo(img, { scale: 1.25, yPercent: -6 }, { scale: 1.05, yPercent: 6, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } })
          gsap.fromTo(
            section.querySelector('[data-svc-number]'),
            { yPercent: 40, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 72%' } },
          )
          gsap.fromTo(
            section.querySelector('[data-svc-outline]'),
            { autoAlpha: 0, scale: 0.94 },
            { autoAlpha: 0.6, scale: 1, duration: 1.6, delay: 0.4, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 78%' } },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <Seo
        title="Services"
        description="Film production, creative direction, cinematography, post-production, promotional films and visual storytelling — explore the creative expertise of VKS Film Production."
        path="/services"
      />
      <PageHero
        eyebrow="Our creative expertise"
        lines={[
          'Every idea',
          'deserves',
          'the perfect',
          <>
            <GradientText variant="ocean" animate>
              execution.
            </GradientText>
          </>,
        ]}
        sub="Exploring the creative process from initial concept to cinematic presentation."
        image={art.servicesHero}
        glow="rgb(0 217 255 / 0.14)"
        entrance="rise"
        artClassName="right-[-14vw] top-14 w-[120vw] opacity-80 md:right-[-25vw] md:w-[100vw] lg:right-[-6vw] lg:top-0 lg:w-[74vw] lg:opacity-100"
      >
        <DraftNote className="mt-8">Proposed services &mdash; pending client confirmation</DraftNote>
      </PageHero>

      <ServiceMarquee />

      <div className="py-[calc(var(--section-y)*0.5)]">
        {services.map((s, i) => (
          <ServiceBlock key={s.slug} service={s} index={i} />
        ))}
      </div>

      <Process />
      <CanvasCTA />
    </div>
  )
}
