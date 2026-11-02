import { Eyebrow } from '../common/SectionHeading'
import AnimatedHeading from '../common/AnimatedHeading'
import Reveal from '../common/Reveal'
import PaintArtwork from '../common/PaintArtwork'
import GradientText from '../common/GradientText'
import { art } from '../../data/artwork'

const pillars = [
  {
    title: 'Creative Vision',
    text: 'Every story begins with an idea worth exploring.',
    image: art.pillars[0],
    accent: 'text-magenta',
    cls: 'lg:col-span-4 min-h-[24rem] lg:min-h-[28rem]',
  },
  {
    title: 'Visual Craft',
    text: 'Thoughtful framing, composition, and cinematic detail.',
    accent: 'text-cyan',
    cls: 'lg:col-span-3 min-h-[18rem]',
    mark: 'frame',
  },
  {
    title: 'Collaborative Spirit',
    text: 'Building meaningful work through shared creativity.',
    accent: 'text-yellow',
    cls: 'lg:col-span-3 min-h-[18rem]',
    mark: 'circles',
  },
  {
    title: 'Story-First Thinking',
    text: 'Keeping emotion and storytelling at the heart of every visual.',
    image: art.pillars[3],
    accent: 'text-violet',
    cls: 'lg:col-span-4 min-h-[24rem] lg:min-h-[28rem]',
  },
]

function Mark({ type, className }) {
  if (type === 'frame') {
    return (
      <svg aria-hidden="true" viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="6" y="14" width="52" height="36" rx="3" />
        <path d="M6 22h52M6 42h52" opacity=".5" />
        {[12, 22, 32, 42, 52].map((x) => (
          <rect key={x} x={x - 2} y="16.5" width="4" height="3" rx=".6" fill="currentColor" stroke="none" />
        ))}
        <circle cx="32" cy="32" r="6" />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="32" r="16" />
      <circle cx="40" cy="32" r="16" />
      <path d="M32 18.5v27" opacity=".5" />
    </svg>
  )
}

function Pillar({ p, i }) {
  const number = String(i + 1).padStart(2, '0')
  if (p.image) {
    return (
      <Reveal as="article" delay={i * 0.08} className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-3xl p-7 md:p-9 ${p.cls}`}>
        <PaintArtwork
          image={p.image}
          sizes="(min-width: 1024px) 34vw, (min-width: 768px) 46vw, 92vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[1400ms] ease-cinema group-hover:scale-110"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/0" />
        <span className={`eyebrow ${p.accent}`}>{number}</span>
        <h3 className="mt-4 font-display text-[clamp(1.6rem,2.4vw,2.3rem)] font-bold uppercase leading-[1] tracking-[-0.02em]">{p.title}</h3>
        <p className="mt-3 max-w-xs text-soft/80">{p.text}</p>
      </Reveal>
    )
  }
  return (
    <Reveal
      as="article"
      delay={i * 0.08}
      className={`group grad-border relative flex flex-col justify-between overflow-hidden rounded-3xl bg-graphite/50 p-7 [--grad:linear-gradient(140deg,rgb(248_247_252/0.14),rgb(248_247_252/0.02))] md:p-9 ${p.cls}`}
    >
      <div className="flex items-start justify-between">
        <span className={`eyebrow ${p.accent}`}>{number}</span>
        <Mark type={p.mark} className={`size-14 transition-transform duration-700 ease-cinema group-hover:rotate-12 group-hover:scale-110 ${p.accent}`} />
      </div>
      <div className="mt-10">
        <h3 className="font-display text-[clamp(1.45rem,2vw,2rem)] font-bold uppercase leading-[1.02] tracking-[-0.02em]">{p.title}</h3>
        <p className="mt-3 text-muted">{p.text}</p>
      </div>
    </Reveal>
  )
}

export default function WhyChooseUs() {
  return (
    <section aria-labelledby="why-title" className="section-y relative isolate overflow-hidden bg-charcoal">
      <div className="container-x">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          <div className="md:col-span-2 lg:col-span-5 lg:row-span-2 lg:pr-8">
            <div className="lg:sticky lg:top-32">
              <Eyebrow number="05" tone="text-yellow">
                Our creative philosophy
              </Eyebrow>
              <AnimatedHeading
                id="why-title"
                className="display-lg mt-6 md:mt-8"
                lines={[
                  'Passion in',
                  <>
                    <GradientText variant="sunset">every pixel.</GradientText>
                  </>,
                  'Purpose in',
                  <>
                    <GradientText variant="ocean">every frame.</GradientText>
                  </>,
                ]}
              />
              <Reveal className="mt-8 max-w-md">
                <p className="leading-relaxed text-muted">
                  Four ideas guide the way we think about cinema &mdash; not as rules, but as a shared creative instinct that shapes
                  every story we tell.
                </p>
              </Reveal>
            </div>
          </div>
          {pillars.map((p, i) => (
            <Pillar key={p.title} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
