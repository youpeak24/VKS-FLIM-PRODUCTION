import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Mail, Phone, X } from 'lucide-react'
import { useDialog } from '../../hooks/useDialog'
import { siteConfig, whatsappHref } from '../../data/siteConfig'
import { art } from '../../data/artwork'
import PaintArtwork from '../common/PaintArtwork'
import BrandLogo from '../common/BrandLogo'
import WhatsAppIcon from '../common/WhatsAppIcon'

const EASE = [0.76, 0, 0.24, 1]

function Panel({ onClose }) {
  const ref = useDialog(true, onClose)
  const { contact } = siteConfig

  return (
    <motion.div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      tabIndex={-1}
      className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-obsidian outline-none lg:hidden"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.75, ease: EASE } }}
      exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.55, ease: EASE, delay: 0.1 } }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[34%] top-[6%] w-[90%] max-w-[34rem] opacity-70"
        initial={{ opacity: 0, rotate: -20, scale: 0.9 }}
        animate={{ opacity: 0.7, rotate: 0, scale: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 } }}
      >
        <PaintArtwork image={art.contactArt} sizes="90vw" />
      </motion.div>

      <div className="container-x relative flex items-center justify-between pt-[calc(env(safe-area-inset-top)+1.5rem)]">
        <BrandLogo size="md" />
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          className="grid size-12 place-items-center rounded-full border border-soft/20 bg-obsidian/70 backdrop-blur"
        >
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">Close menu</span>
        </button>
      </div>

      <nav aria-label="Mobile" className="container-x relative mt-12 flex-1">
        <ul className="space-y-1">
          {siteConfig.nav.map((link, i) => (
            <li key={link.path} className="overflow-hidden">
              <motion.div
                initial={{ y: '105%' }}
                animate={{ y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.07 } }}
                exit={{ y: '105%', transition: { duration: 0.35, ease: EASE } }}
              >
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-baseline gap-4 py-2 font-display text-[clamp(2.6rem,12vw,4.5rem)] font-bold uppercase leading-none tracking-[-0.03em] ${
                      isActive ? 'text-gradient' : 'text-soft'
                    }`
                  }
                  style={{ '--grad': 'var(--grad-aurora)' }}
                >
                  <span className="font-sans text-xs font-bold tracking-[0.2em] text-muted">0{i + 1}</span>
                  {link.label}
                </NavLink>
              </motion.div>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div
        className="container-x relative pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.6 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <div className="hairline" />
        <p className="eyebrow mt-6 text-muted">
          {siteConfig.producer.name} &middot; {siteConfig.producer.role}
        </p>
        <ul className="mt-4 grid gap-3 text-base">
          <li>
            <a href={contact.phoneHref} className="inline-flex min-h-11 items-center gap-3">
              <Phone className="size-4 text-cyan" aria-hidden="true" />
              {contact.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center gap-3 break-all">
              <Mail className="size-4 text-magenta" aria-hidden="true" />
              {contact.email}
            </a>
          </li>
          <li>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3">
              <WhatsAppIcon className="size-4 text-yellow" />
              WhatsApp
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  )
}

/** Full-screen mobile navigation with staggered entrance, Escape-to-close, focus trap and scroll lock. */
export default function MobileMenu({ open, onClose }) {
  return createPortal(<AnimatePresence>{open && <Panel onClose={onClose} />}</AnimatePresence>, document.body)
}
