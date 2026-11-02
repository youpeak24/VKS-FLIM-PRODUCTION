import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Play } from 'lucide-react'
import SectionHeading from '../common/SectionHeading'
import Reveal from '../common/Reveal'
import PaintArtwork from '../common/PaintArtwork'
import GradientText from '../common/GradientText'
import ProjectModal from '../common/ProjectModal'
import { projects } from '../../data/projects'

const EASE = [0.22, 1, 0.36, 1]

/** Editorial grid choreography (lg+). `wide` cards use a landscape still instead of the poster. */
const layout = [
  { cls: 'lg:col-span-7', aspect: 'aspect-[4/5] md:aspect-[16/11]', wide: true, sizes: '(min-width: 1024px) 56vw, (min-width: 768px) 46vw, 92vw' },
  { cls: 'lg:col-span-5', aspect: 'aspect-[4/5]', sizes: '(min-width: 1024px) 40vw, (min-width: 768px) 46vw, 92vw' },
  { cls: 'lg:col-span-4 lg:-mt-36', aspect: 'aspect-[4/5] lg:aspect-[3/4]', sizes: '(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw' },
  { cls: 'lg:col-span-4 lg:mt-16', aspect: 'aspect-[4/5]', sizes: '(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw' },
  { cls: 'lg:col-span-4 lg:mt-36', aspect: 'aspect-[4/5] lg:aspect-[3/4]', sizes: '(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw' },
  { cls: 'md:col-span-2 lg:col-span-12', aspect: 'aspect-[4/5] md:aspect-[21/9]', wide: true, sizes: '92vw' },
]

const accents = ['text-cyan', 'text-magenta', 'text-yellow', 'text-violet', 'text-orange', 'text-cyan']

function ProjectCard({ project, index, onOpen }) {
  const l = layout[index % layout.length]
  const image = l.wide ? project.gallery[0]?.image ?? project.poster : project.poster

  return (
    <li className={l.cls}>
      <article className="group relative">
        <motion.div
          className={`relative overflow-hidden rounded-2xl bg-graphite ${l.aspect}`}
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={{ duration: 1.3, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.25 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 1.8, ease: EASE }}
          >
            <PaintArtwork
              image={image}
              sizes={l.sizes}
              alt={project.isDemo ? '' : `${project.title} artwork`}
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-cinema group-hover:scale-[1.07]"
            />
          </motion.div>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/5 to-obsidian/30" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-aurora opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-70"
          />

          <div className="absolute inset-x-4 top-4 flex items-start justify-between md:inset-x-5 md:top-5">
            <span className="font-display text-sm font-bold tracking-wider text-soft/90">
              {String(index + 1).padStart(2, '0')}
              <span className="text-soft/40"> / {String(projects.length).padStart(2, '0')}</span>
            </span>
            <span className="flex gap-2">
              {project.youtubeId && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-obsidian/70 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] backdrop-blur">
                  <Play className="size-3" fill="currentColor" aria-hidden="true" /> Trailer
                </span>
              )}
              {project.isDemo && (
                <span className="rounded-full bg-yellow px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-obsidian">
                  Demo
                </span>
              )}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="absolute bottom-5 right-5 grid size-14 scale-75 place-items-center rounded-full bg-soft text-obsidian opacity-0 transition-all duration-500 ease-cinema group-hover:scale-100 group-hover:opacity-100 md:size-16"
          >
            <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
          </span>
        </motion.div>

        <div className="mt-6 max-w-xl">
          <p className={`eyebrow text-[0.68rem] ${accents[index % accents.length]}`}>{project.category}</p>
          <h3 className="mt-3 font-display text-[clamp(1.5rem,2.3vw,2.25rem)] font-bold uppercase leading-[1] tracking-[-0.02em]">
            <button
              type="button"
              onClick={() => onOpen(project)}
              aria-haspopup="dialog"
              className="text-left transition-transform duration-700 ease-cinema after:absolute after:inset-0 after:rounded-2xl group-hover:translate-x-2 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-cyan"
            >
              {project.title}
              <span className="sr-only">&mdash; view project details</span>
            </button>
          </h3>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{project.description}</p>
        </div>
      </article>
    </li>
  )
}

export default function FeaturedWorks() {
  const [active, setActive] = useState(null)
  const hasDemo = projects.some((p) => p.isDemo)

  return (
    <section id="work" aria-labelledby="work-title" className="section-y relative isolate overflow-hidden bg-obsidian">
      <div
        aria-hidden="true"
        className="absolute -right-1/4 top-0 -z-10 h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(closest-side,rgb(255_22_143/0.14),transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-1/4 bottom-0 -z-10 h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(closest-side,rgb(0_217_255/0.08),transparent)]"
      />

      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            className="lg:col-span-8"
            number="02"
            tone="text-magenta"
            eyebrow="Our creative world"
            id="work-title"
            tabIndex={-1}
            lines={[
              'Stories that',
              'deserve the',
              <>
                <GradientText variant="sunset">big screen.</GradientText>
              </>,
            ]}
          />
          <Reveal className="lg:col-span-4 lg:pb-3">
            <p className="text-[1.05rem] leading-relaxed text-muted">
              A window into the worlds we build &mdash; from first spark to final frame. Select a production to explore its story,
              stills and trailer.
            </p>
            {hasDemo && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-yellow/30 bg-yellow/[0.06] px-3 py-1 text-[0.72rem] font-semibold text-yellow/90">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-yellow" />
                Demo entries &mdash; client productions will replace these
              </p>
            )}
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-x-6 gap-y-16 md:mt-24 md:grid-cols-2 md:gap-x-8 lg:grid-cols-12 lg:gap-y-24">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={setActive} />
          ))}
        </ul>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  )
}
