import { siteConfig } from '../../data/siteConfig'

/** Visible marker for proposed / unapproved content. Hidden once siteConfig.showDraftNotices is false. */
export default function DraftNote({ children = 'Proposed content — pending client review', className = '' }) {
  if (!siteConfig.showDraftNotices) return null
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full border border-yellow/30 bg-yellow/[0.06] px-3 py-1 text-[0.7rem] font-semibold leading-snug tracking-wide text-yellow/90 ${className}`}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-yellow" />
      {children}
    </p>
  )
}
