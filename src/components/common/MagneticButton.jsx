import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'

/**
 * Subtle magnetic pull toward the pointer — fine pointers only, never with reduced motion.
 * gsap.quickTo keeps pointer tracking out of React state.
 */
export default function MagneticButton({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const el = ref.current
      const mm = gsap.matchMedia()
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.45)' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.45)' })
        const move = (e) => {
          const r = el.getBoundingClientRect()
          xTo((e.clientX - (r.left + r.width / 2)) * strength)
          yTo((e.clientY - (r.top + r.height / 2)) * strength)
        }
        const leave = () => {
          xTo(0)
          yTo(0)
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        return () => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
          gsap.set(el, { x: 0, y: 0 })
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <span ref={ref} className={`inline-flex ${className}`}>
      {children}
    </span>
  )
}
