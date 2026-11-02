import { useRef, useState } from 'react'
import { Play } from 'lucide-react'
import Dialog from './Dialog'
import PaintArtwork from './PaintArtwork'
import { YouTubePlayer } from './VideoModal'

function ProjectDetails({ project }) {
  const [playing, setPlaying] = useState(false)
  const titleId = `project-title-${project.id}`

  return (
    <div className="clear-both">
      <div className="grid gap-8 px-5 pb-8 pt-2 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-12 md:px-10 md:pb-12">
        <div className="relative overflow-hidden rounded-xl">
          <PaintArtwork
            image={project.poster}
            alt={project.isDemo ? `Abstract placeholder poster for ${project.title}` : `${project.title} poster`}
            sizes="(min-width: 768px) 420px, 92vw"
            className="aspect-[5/7] w-full object-cover"
          />
          {project.isDemo && (
            <span className="absolute left-3 top-3 rounded-full bg-yellow px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-obsidian">
              Demo
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <p className="eyebrow text-cyan">{project.category}</p>
          <h2 id={titleId} className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em]">
            {project.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-soft/75">{project.description}</p>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-soft/10 bg-soft/10 text-sm">
            <div className="bg-obsidian p-4">
              <dt className="eyebrow text-[0.62rem] text-muted">Production type</dt>
              <dd className="mt-2 font-semibold">{project.category}</dd>
            </div>
            <div className="bg-obsidian p-4">
              <dt className="eyebrow text-[0.62rem] text-muted">Status</dt>
              <dd className="mt-2 font-semibold">{project.isDemo ? 'Demo placeholder' : 'Featured'}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <h3 className="eyebrow text-soft/80">Trailer</h3>
            <div className="mt-4 overflow-hidden rounded-xl border border-soft/10">
              {project.youtubeId && !playing ? (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="group relative block aspect-video w-full overflow-hidden"
                  aria-label={`Play trailer: ${project.title}`}
                >
                  <PaintArtwork image={project.gallery[0]?.image} className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-16 place-items-center rounded-full bg-soft text-obsidian transition-transform duration-500 group-hover:scale-110">
                      <Play className="ml-1 size-6" fill="currentColor" aria-hidden="true" />
                    </span>
                  </span>
                </button>
              ) : project.youtubeId ? (
                <YouTubePlayer youtubeId={project.youtubeId} title={`${project.title} — trailer`} />
              ) : (
                <p className="bg-charcoal px-5 py-6 text-sm text-muted">
                  No trailer has been added for this project yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {project.gallery?.length > 0 && (
        <div className="border-t border-soft/10 px-5 py-8 md:px-10 md:py-10">
          <h3 className="eyebrow text-soft/80">Gallery</h3>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((g, i) => (
              <li key={i} className="overflow-hidden rounded-xl">
                <PaintArtwork image={g.image} alt={g.alt} sizes="(min-width: 640px) 45vw, 92vw" className="aspect-[7/4] w-full object-cover" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/** Project details dialog — no extra routes; opened from the featured productions grid. */
export default function ProjectModal({ project, onClose }) {
  // keep the last project rendered while the dialog animates out
  const last = useRef(project)
  if (project) last.current = project
  const shown = last.current

  return (
    <Dialog
      open={Boolean(project)}
      onClose={onClose}
      labelledBy={shown ? `project-title-${shown.id}` : undefined}
      panelClassName="max-w-5xl bg-obsidian sm:rounded-2xl sm:border sm:border-soft/10"
    >
      {shown && <ProjectDetails key={shown.id} project={shown} />}
    </Dialog>
  )
}
