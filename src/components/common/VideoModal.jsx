import { Clapperboard } from 'lucide-react'
import Dialog from './Dialog'
import { youtubeEmbedUrl } from '../../lib/youtube'

/**
 * Inline YouTube player — mounted only after the visitor asks for it,
 * using the privacy-enhanced youtube-nocookie.com domain.
 * With no video ID a clearly labelled placeholder is shown instead of a broken player.
 */
export function YouTubePlayer({ youtubeId, title }) {
  if (!youtubeId) {
    return (
      <div className="relative grid aspect-video w-full place-items-center overflow-hidden bg-charcoal text-center">
        <div aria-hidden="true" className="absolute inset-0 bg-aurora opacity-[0.08]" />
        <div className="relative px-6">
          <Clapperboard className="mx-auto size-10 text-cyan" strokeWidth={1.4} aria-hidden="true" />
          <p className="mt-5 font-display text-2xl font-bold uppercase md:text-3xl">Video coming soon</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Placeholder &mdash; the official video has not been added yet. It will play here once it is published.
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="relative aspect-video w-full bg-black">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={youtubeEmbedUrl(youtubeId, { autoplay: true })}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  )
}

export default function VideoModal({ open, onClose, youtubeId, title }) {
  return (
    <Dialog open={open} onClose={onClose} label={title} panelClassName="max-w-6xl bg-obsidian sm:rounded-2xl sm:border sm:border-soft/10">
      <div className="clear-both px-3 pb-3 pt-2 sm:px-5 sm:pb-5">
        <p className="eyebrow px-1 pb-4 text-muted">{title}</p>
        <div className="overflow-hidden rounded-xl">
          <YouTubePlayer youtubeId={youtubeId} title={title} />
        </div>
      </div>
    </Dialog>
  )
}
