import { useRef } from 'react'
import { Phone } from 'lucide-react'
import Seo from '../components/common/Seo'
import PageHero from '../components/common/PageHero'
import SectionHeading, { Eyebrow } from '../components/common/SectionHeading'
import AnimatedHeading from '../components/common/AnimatedHeading'
import Reveal from '../components/common/Reveal'
import GradientText from '../components/common/GradientText'
import PaintArtwork from '../components/common/PaintArtwork'
import ApertureMark from '../components/common/ApertureMark'
import DraftNote from '../components/common/DraftNote'
import ContactCTA from '../components/home/ContactCTA'
import { art } from '../data/artwork'
import { siteConfig } from '../data/siteConfig'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'

const principles = [
  { word: 'Vision', text: 'We begin by imagining what a story could become.', accent: 'text-cyan', grad: 'ocean' },
  { word: 'Craftsmanship', text: 'We believe the smallest details shape the strongest feelings.', accent: 'text-magenta', grad: 'aurora' },
  { word: 'Storytelling', text: 'We let emotion lead, and let every image serve the story.', accent: 'text-orange', grad: 'sunset' },
  { word: 'Collaboration', text: 'We create our best work together, with open minds and shared purpose.', accent: 'text-violet', grad: 'ocean' },
]

const feelings = [
  { label: 'Emotion', text: 'The feeling a scene leaves behind is what an audience remembers.' },
  { label: 'Imagery', text: 'Light, colour and composition speak before a single word is heard.' },
  { label: 'Story', text: 'Every visual choice should carry the story a little further.' },
]

function OurStory() {
  return (
    <section aria-labelledby="story-title" className="section-y relative">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              number="01"
              tone="text-orange"
              eyebrow="Our story"
              id="story-title"
              headingClassName="display-lg"
              lines={[
                'Creativity is',
                <>
                  where we <GradientText variant="sunset">begin.</GradientText>
                </>,
              ]}
            />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="text-[clamp(1.25rem,1.9vw,1.75rem)] font-medium leading-[1.5] text-soft">
              <span className="float-left mr-3 mt-1 font-display text-[4.6em] font-extrabold leading-[0.8] text-gradient [--grad:var(--grad-sunset)]">
                V
              </span>
              KS Film Production was created around a simple belief: every idea carries a story waiting to be seen. We approach
              each project as a canvas &mdash; a place where imagination, colour and craft meet.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <p className="text-lg leading-relaxed text-muted">
              Our work is guided by curiosity and care. We listen closely, explore boldly and shape every production around the
              emotion at its heart, so that what reaches the screen feels both vivid and true.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-14 border-l border-soft/15 pl-6 md:pl-10">
            <p className="serif-accent text-[clamp(1.9rem,3.4vw,3.2rem)] leading-[1.15] text-soft">
              &ldquo;Colour is how a story feels. Cinema is how it&rsquo;s <span className="text-gradient [--grad:var(--grad-aurora)]">remembered.</span>&rdquo;
            </p>
          </Reveal>
          <DraftNote className="mt-10">Editorial copy &mdash; pending client approval</DraftNote>
        </div>
      </div>
    </section>
  )
}

function Philosophy() {
  const root = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // the frame opens from an aperture-like circle into a full cinematic window
        gsap.fromTo(
          '[data-phil-frame]',
          { clipPath: 'circle(28% at 50% 50%)' },
          {
            clipPath: 'circle(75% at 50% 50%)',
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'center 50%', scrub: 0.6 },
          },
        )
        gsap.fromTo(
          '[data-phil-img]',
          { scale: 1.3, rotate: 6 },
          { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="philosophy-title" className="section-y relative isolate overflow-hidden bg-charcoal">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-6">
          <div data-phil-frame className="relative aspect-[4/5] overflow-hidden rounded-[2rem] md:aspect-[5/6]">
            <PaintArtwork data-phil-img image={art.philosophyFrame} sizes="(min-width: 1024px) 46vw, 92vw" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <SectionHeading
            number="02"
            tone="text-magenta"
            eyebrow="Our philosophy"
            id="philosophy-title"
            headingClassName="display-lg"
            lines={[
              'Every story',
              'deserves to',
              <>
                be <GradientText variant="aurora">felt.</GradientText>
              </>,
            ]}
          />
          <Reveal className="mt-8">
            <p className="text-lg leading-relaxed text-muted">
              Cinema reaches people through feeling first. That is why we treat every frame as an emotional decision &mdash; how it
              is lit, how it moves, what it holds back.
            </p>
          </Reveal>
          <ul className="mt-10 divide-y divide-soft/10 border-y border-soft/10">
            {feelings.map((f, i) => (
              <Reveal as="li" key={f.label} delay={i * 0.08} className="grid grid-cols-[7.5rem_1fr] gap-4 py-5">
                <span className="eyebrow pt-1 text-soft">{f.label}</span>
                <span className="text-muted">{f.text}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Producer() {
  const { producer, contact } = siteConfig
  return (
    <section aria-labelledby="producer-title" className="section-y relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-20 opacity-40">
        <PaintArtwork image={art.producerFrame} sizes="100vw" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />
      </div>

      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow number="03" tone="text-cyan">
            Meet the producer
          </Eyebrow>
          <AnimatedHeading
            id="producer-title"
            className="mt-8 font-display text-[clamp(2.6rem,8vw,8rem)] font-bold uppercase leading-[0.88] tracking-[-0.045em]"
            lines={[
              <>
                <span className="text-muted">S.</span> Vijay
              </>,
              <>
                <GradientText variant="ocean" animate>
                  Krishnan
                </GradientText>
              </>,
            ]}
          />
          <Reveal className="mt-8 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-14 bg-aurora" />
            <span className="eyebrow text-soft">{producer.role}</span>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 max-w-xl">
            <p className="text-lg leading-relaxed text-soft/80">
              {producer.name} leads VKS Film Production, guiding each project from the first conversation to the final frame with a
              passion for meaningful, visually rich storytelling.
            </p>
            <a
              href={contact.phoneHref}
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full border border-soft/20 px-6 text-sm font-bold uppercase tracking-[0.18em] transition-colors hover:border-cyan hover:text-cyan"
            >
              <Phone className="size-4" aria-hidden="true" />
              {contact.phoneDisplay}
            </a>
            <DraftNote className="mt-8 flex">Producer introduction &mdash; to be confirmed by the client</DraftNote>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mx-auto w-full max-w-md lg:col-span-5">
          <div className="relative aspect-square">
            <ApertureMark
              idPrefix="producer-ap"
              className="h-full w-full"
              ringText={`${producer.name.toUpperCase()} • ${producer.role.toUpperCase()} • VKS FILM PRODUCTION • `}
              ringClassName="animate-spin-slower"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Principles() {
  return (
    <section aria-labelledby="principles-title" className="section-y relative bg-charcoal">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            className="lg:col-span-7"
            number="04"
            tone="text-yellow"
            eyebrow="Our creative principles"
            id="principles-title"
            headingClassName="display-lg"
            lines={['What guides', 'every frame.']}
          />
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <p className="text-muted">Not promises or metrics &mdash; simply the creative instincts we bring to every story.</p>
          </Reveal>
        </div>

        <ol className="mt-16 md:mt-20">
          {principles.map((p, i) => (
            <Reveal
              as="li"
              key={p.word}
              delay={0.05}
              className="group grid min-w-0 items-baseline gap-3 border-t border-soft/10 py-8 md:grid-cols-12 md:gap-8 md:py-12"
            >
              <span className={`eyebrow md:col-span-1 ${p.accent}`}>0{i + 1}</span>
              <h3 className="min-w-0 font-display text-[clamp(1.9rem,4.4vw,4rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em] md:col-span-6">
                <span
                  className="text-gradient [-webkit-text-fill-color:var(--color-soft)] group-hover:[-webkit-text-fill-color:transparent]"
                  style={{ '--grad': `var(--grad-${p.grad})` }}
                >
                  {p.word}
                </span>
              </h3>
              <p className="serif-accent text-[clamp(1.35rem,2vw,1.9rem)] leading-snug text-soft/80 md:col-span-5">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <Seo
        title="About Us"
        description="Discover the creative vision and passion behind VKS Film Production, and meet producer S. Vijay Krishnan."
        path="/about"
      />
      <PageHero
        eyebrow="Behind the vision"
        lines={[
          'A world of',
          'stories.',
          'A passion for',
          <>
            <GradientText variant="sunset" animate>
              cinema.
            </GradientText>
          </>,
        ]}
        sub="Discover the creative vision and passion behind VKS Film Production."
        image={art.aboutHero}
        glow="rgb(255 120 31 / 0.18)"
        entrance="sweep"
        artClassName="right-[-6vw] top-16 w-[120vw] opacity-80 md:right-[-22vw] md:w-[100vw] lg:right-[-8vw] lg:top-8 lg:w-[78vw] lg:opacity-100"
      />
      <OurStory />
      <Philosophy />
      <Producer />
      <Principles />
      <ContactCTA
        number="05"
        eyebrow="Your story starts here"
        lines={[
          'Great stories',
          'start with',
          <>
            <GradientText variant="sunset" animate>
              great ideas.
            </GradientText>
          </>,
        ]}
        body="Tell us about yours. We'd love to hear where your next production could go."
        primaryLabel="Contact us"
        showProducer={false}
      />
    </>
  )
}
