import { useRef, useState } from 'react'
import { Play } from 'lucide-react'
import SectionHeading from '../common/SectionHeading'
import GradientText from '../common/GradientText'
import VideoModal from '../common/VideoModal'
import { art } from '../../data/artwork'
import { siteConfig } from '../../data/siteConfig'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'

const RING = 'PLAY SHOWREEL • PLAY SHOWREEL • PLAY SHOWREEL • '

function CropMarks() {
  const base = 'absolute size-6 border-soft/70 md:size-9'
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-4 md:inset-7">
      <span className={`${base} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${base} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${base} bottom-0 right-0 border-b-2 border-r-2`} />
    </span>
  )
}

export default function Showreel() {
  const root = useRef(null)
  const [open, setOpen] = useState(false)
  const id = siteConfig.showreelYoutubeId
  const title = `${siteConfig.name} — showreel`

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-reel-frame]',
          { scale: 0.84, borderRadius: '56px' },
          {
            scale: 1,
            borderRadius: '24px',
            ease: 'none',
            scrollTrigger: { trigger: '[data-reel-frame]', start: 'top bottom', end: 'center 55%', scrub: 0.6 },
          },
        )
        gsap.fromTo(
          '[data-reel-img]',
          { yPercent: -6, scale: 1.15 },
          {
            yPercent: 6,
            scale: 1.05,
            ease: 'none',
            scrollTrigger: { trigger: '[data-reel-frame]', start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="reel-title" className="section-y relative isolate overflow-hidden bg-obsidian">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[60rem] w-[80rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(139_77_255/0.12),transparent)]"
      />
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            number="04"
            tone="text-violet"
            eyebrow="Motion. Emotion. Magic."
            id="reel-title"
            lines={[
              'See the magic',
              <>
                in <GradientText variant="aurora">motion.</GradientText>
              </>,
            ]}
          />
          <p className="max-w-xs text-[0.98rem] leading-relaxed text-muted md:pb-3 md:text-right">
            Sound on, lights down. A glimpse of the stories, colours and moments we love to create.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label={id ? 'Play the showreel' : 'Showreel placeholder — video coming soon'}
          data-reel-frame
          className="group relative mt-14 block aspect-[4/5] w-full overflow-hidden rounded-3xl bg-graphite text-left sm:aspect-video md:mt-20"
        >
          <span data-reel-img className="absolute inset-0 block">
            <img
              src={art.showreelPoster.src}
              srcSet={art.showreelPoster.srcSet}
              sizes="(min-width: 1600px) 1472px, (min-width: 1400px) 90vw, 94vw"
              width={art.showreelPoster.width}
              height={art.showreelPoster.height}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[1600ms] ease-cinema group-hover:scale-105"
            />
          </span>
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/20 to-obsidian/40" />
          <CropMarks />

          <span aria-hidden="true" className="absolute left-7 top-7 hidden items-center gap-2.5 text-[0.68rem] font-bold uppercase tracking-[0.3em] text-soft/80 sm:flex md:left-12 md:top-12">
            <span className="animate-rec size-2 rounded-full bg-magenta" />
            Showreel
          </span>

          <span className="absolute inset-0 grid place-items-center">
            <span className="relative grid size-36 place-items-center md:size-48">
              <svg aria-hidden="true" viewBox="0 0 200 200" className="animate-spin-slow absolute inset-0 h-full w-full [animation-duration:24s]">
                <defs>
                  <path id="reel-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                </defs>
                <text fill="rgba(248,247,252,.85)" fontSize="11.5" fontWeight="700" letterSpacing="3.4" fontFamily="Manrope Variable, sans-serif">
                  <textPath href="#reel-ring">{RING}</textPath>
                </text>
              </svg>
              <span className="relative grid size-20 place-items-center rounded-full bg-soft text-obsidian transition-transform duration-700 ease-cinema group-hover:scale-110 md:size-24">
                <span aria-hidden="true" className="absolute inset-0 rounded-full bg-aurora opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <Play className="relative ml-1 size-7 transition-colors duration-500 group-hover:text-soft md:size-8" fill="currentColor" aria-hidden="true" />
              </span>
            </span>
          </span>

          <span className="absolute inset-x-7 bottom-7 flex items-end justify-between gap-4 md:inset-x-12 md:bottom-12">
            <span className="font-display text-[clamp(1.25rem,2.4vw,2rem)] font-bold uppercase leading-none">
              {siteConfig.name}
            </span>
            {!id && (
              <span className="shrink-0 rounded-full bg-yellow px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-obsidian">
                Coming soon
              </span>
            )}
          </span>
        </button>
      </div>

      <VideoModal open={open} onClose={() => setOpen(false)} youtubeId={id} title={title} />
    </section>
  )
}
