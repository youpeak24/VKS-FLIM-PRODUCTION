import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useDialog } from '../../hooks/useDialog'

const EASE = [0.22, 1, 0.36, 1]

function DialogPanel({ onClose, label, labelledBy, children, panelClassName }) {
  const ref = useDialog(true, onClose)
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
      transition={{ duration: 0.35 }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-obsidian/90 backdrop-blur-[6px]" onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`relative max-h-[100dvh] w-full overflow-y-auto overscroll-contain outline-none sm:max-h-[calc(100dvh-3rem)] ${panelClassName}`}
        initial={{ opacity: 0, y: 48, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.99 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          aria-label="Close"
          className="group sticky top-3 z-10 float-right mr-3 mt-3 grid size-12 place-items-center rounded-full border border-soft/20 bg-obsidian/80 text-soft backdrop-blur transition-colors hover:border-soft hover:bg-soft hover:text-obsidian"
        >
          <X className="size-5 transition-transform duration-500 ease-cinema group-hover:rotate-90" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  )
}

/** Accessible modal dialog rendered in a portal with enter/exit animation. */
export default function Dialog({ open, onClose, label, labelledBy, children, panelClassName = '' }) {
  if (typeof document === 'undefined') return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <DialogPanel onClose={onClose} label={label} labelledBy={labelledBy} panelClassName={panelClassName}>
          {children}
        </DialogPanel>
      )}
    </AnimatePresence>,
    document.body,
  )
}
