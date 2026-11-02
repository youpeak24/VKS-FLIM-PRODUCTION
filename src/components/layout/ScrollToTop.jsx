import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scroll handling for client-side routing.
 * - Top-of-page reset happens in App (after the exit transition, behind the curtain).
 * - Hash links (e.g. /services#cinematography) scroll to their target once it has mounted.
 */
export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation()
  const prevPath = useRef(pathname)

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    const samePage = prevPath.current === pathname
    prevPath.current = pathname
    if (!hash) return

    let raf = 0
    let tries = 0
    const seek = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        el.scrollIntoView({ behavior: reduce || !samePage ? 'auto' : 'smooth', block: 'start' })
      } else if (tries++ < 90) {
        raf = requestAnimationFrame(seek)
      }
    }
    const t = setTimeout(seek, samePage ? 0 : 950)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [key, pathname, hash])

  return null
}
