import { motion } from 'motion/react'
import { siteConfig } from '../../data/siteConfig'

const EASE = [0.22, 1, 0.36, 1]

/** Inline marker for wording that needs client / legal review. Hidden once drafts are approved. */
export function Review({ children }) {
  if (!siteConfig.showDraftNotices) return null
  return (
    <span className="mx-0.5 rounded bg-yellow/10 px-1.5 py-0.5 text-[0.85em] font-semibold text-yellow">[Review: {children}]</span>
  )
}

/**
 * Restrained, highly readable layout shared by the legal pages.
 * sections: [{ id, title, content }]
 */
export default function LegalLayout({ eyebrow, title, intro, sections }) {
  return (
    <article className="relative pb-[var(--section-y)] pt-36 md:pt-44">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(50%_60%_at_20%_0%,rgb(139_77_255/0.12),transparent)]" />
      <div className="container-x">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="max-w-4xl"
        >
          <p className="eyebrow flex items-center gap-4 text-soft/70">
            <span aria-hidden="true" className="h-px w-10 bg-aurora" />
            {eyebrow}
          </p>
          <h1 id="page-title" className="display-xl mt-6">
            {title}
          </h1>
          <p className="mt-6 text-sm text-muted">
            Last updated: <span className="text-soft">{siteConfig.legal.lastUpdated}</span>
          </p>
          {siteConfig.showDraftNotices && (
            <div role="note" className="mt-8 rounded-2xl border border-yellow/30 bg-yellow/[0.06] p-5 text-sm leading-relaxed text-soft/85">
              <strong className="text-yellow">Draft for client review.</strong> This page is a draft prepared alongside the website.
              It is not legal advice and must be reviewed and approved by {siteConfig.name} (and ideally a qualified legal adviser)
              before publication.
            </div>
          )}
          {intro && <p className="lede mt-10 max-w-3xl">{intro}</p>}
        </motion.header>

        <div className="mt-16 grid gap-12 border-t border-soft/10 pt-12 lg:grid-cols-12 lg:gap-16 md:mt-20">
          <nav aria-label="On this page" className="lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow text-[0.65rem] text-muted">On this page</p>
              <ol className="mt-4 space-y-1 text-sm">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex min-h-9 items-baseline gap-3 text-soft/70 transition-colors hover:text-soft">
                      <span className="w-5 shrink-0 text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="legal-prose max-w-[46rem] lg:col-span-8 lg:col-start-5">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 border-b border-soft/10 py-10 first:pt-0 last:border-0">
                <h2 id={`${s.id}-h`}>
                  <span className="mr-3 font-sans text-sm font-bold text-cyan">{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </h2>
                {s.content}
              </section>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
