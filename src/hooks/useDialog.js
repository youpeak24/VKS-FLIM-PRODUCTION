import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'

let locks = 0

/**
 * Accessible dialog behaviour: Escape to close, focus trap, body scroll lock
 * and focus restoration to the element that opened it.
 */
export function useDialog(open, onClose) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    const root = ref.current

    locks += 1
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.overflow = 'hidden'
    document.body.style.paddingRight = scrollbar ? `${scrollbar}px` : ''

    const focusFirst = () => {
      const target = root?.querySelector('[data-autofocus]') || root?.querySelector(FOCUSABLE) || root
      target?.focus({ preventScroll: true })
    }
    const raf = requestAnimationFrame(focusFirst)

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current?.()
        return
      }
      if (e.key !== 'Tab' || !root) return
      const items = [...root.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
      locks -= 1
      if (locks === 0) {
        document.documentElement.style.overflow = ''
        document.body.style.paddingRight = ''
      }
      if (previous && typeof previous.focus === 'function') previous.focus({ preventScroll: true })
    }
  }, [open])

  return ref
}
