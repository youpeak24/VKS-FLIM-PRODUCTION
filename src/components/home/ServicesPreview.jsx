import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import SectionHeading from '../common/SectionHeading'
import Reveal from '../common/Reveal'
import GradientText from '../common/GradientText'
import PrimaryButton from '../common/PrimaryButton'
import DraftNote from '../common/DraftNote'
import { services } from '../../data/services'
import { accents } from '../../data/accents'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'

export default function ServicesPreview() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray('[data-svc-row]').forEach((row) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%' } })
          tl.fromTo(row.querySelector('[data-svc-line]'), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut' })
            .fromTo(row.querySelector('[data-svc-num]'), { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out' }, 0.2)
            .fromTo(row.querySelector('[data-svc-copy]'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out' }, 0.3)
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="services-title" className="section-y relative isolate overflow-hidden bg-charcoal">
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 opacity-50" />
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            className="lg:col-span-8"
            number="03"
            tone="text-orange"
            eyebrow="What we do"
            id="services-title"
            lines={[
              'From the first',
              'idea to the',
              <>
                <GradientText variant="aurora">final frame.</GradientText>
              </>,
            ]}
          />
          <Reveal className="lg:col-span-4 lg:pb-3">
            <p className="text-[1.05rem] leading-relaxed text-muted">
              Every production is a journey. These are the creative disciplines that shape it, from concept to the finished
              cut.
            </p>
            <DraftNote className="mt-5">Proposed services &mdash; pending client confirmation</DraftNote>
          </Reveal>
        </div>

        <ul className="mt-16 md:mt-24">
          {services.map((s, i) => {
            const a = accents[s.accent]
            const flip = i % 2 === 1
            const Arrow = flip ? ArrowUpLeft : ArrowUpRight
            return (
              <li key={s.slug} data-svc-row className="group relative">
                <span
                  data-svc-line
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-px bg-soft/12 ${flip ? 'origin-left md:origin-right' : 'origin-left'}`}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 origin-bottom scale-y-0 opacity-0 transition-[transform,opacity] duration-700 ease-cinema group-hover:scale-y-100 group-hover:opacity-100"
                  style={{ background: `linear-gradient(${flip ? '270deg' : '90deg'}, ${a.glow}, transparent 70%)` }}
                />
                <Link
                  to={`/services#${s.slug}`}
                  className={`flex flex-wrap items-center gap-x-5 gap-y-3 py-8 md:flex-nowrap md:gap-x-10 md:py-12 ${
                    flip ? 'md:flex-row-reverse md:text-right' : ''
                  }`}
                >
                  <span className="order-1 shrink-0 overflow-hidden md:w-[clamp(7rem,13vw,12rem)]">
                    <span
                      data-svc-num
                      aria-hidden="true"
                      className={`text-outline block font-display text-[clamp(2.6rem,6vw,6.5rem)] font-extrabold leading-none tracking-[-0.04em] transition-colors duration-500 ${a.text} group-hover:[-webkit-text-fill-color:currentColor]`}
                    >
                      {s.number}
                    </span>
                  </span>

                  <span data-svc-copy className="order-3 block min-w-0 basis-full md:order-2 md:flex-1 md:basis-auto">
                    <span
                      className={`block font-display text-[clamp(1.45rem,3vw,3rem)] font-bold uppercase leading-[1.02] tracking-[-0.02em] transition-transform duration-700 ease-cinema ${
                        flip ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className={`mt-3 hidden max-w-md text-[0.98rem] leading-relaxed text-muted sm:block ${flip ? 'md:ml-auto' : ''}`}>
                      {s.short}
                    </span>
                  </span>

                  <span className="order-2 ml-auto flex shrink-0 md:order-3 md:ml-0">
                    <span
                      className={`grid size-12 place-items-center rounded-full border border-soft/20 transition-all duration-500 ease-cinema group-hover:border-transparent group-hover:text-obsidian md:size-16 ${
                        flip ? 'group-hover:-rotate-45' : 'group-hover:rotate-45'
                      } ${a.text} ${a.hoverBg}`}
                    >
                      <Arrow className="size-5 text-current group-hover:text-obsidian" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="sr-only">&mdash; learn more about {s.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        <div aria-hidden="true" className="h-px bg-soft/12" />

        <Reveal className="mt-14 md:mt-20">
          <PrimaryButton to="/services">Explore all services</PrimaryButton>
        </Reveal>
      </div>
    </section>
  )
}
