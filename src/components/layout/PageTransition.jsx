import { motion } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const EASE = [0.76, 0, 0.24, 1]

/**
 * Route transition: a charcoal curtain with a spectrum edge rises over the old page,
 * then lifts off the new one. Reduced motion: a short cross-fade only.
 */
export default function PageTransition({ children }) {
  const reduce = useReducedMotion()

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, delay: reduce ? 0 : 0.2 } }}
        exit={{ opacity: reduce ? 0 : 1, transition: { duration: reduce ? 0.2 : 0.5 } }}
      >
        {children}
      </motion.div>

      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[90] bg-charcoal"
          initial={{ y: '0%' }}
          animate={{ y: '-100%', transition: { duration: 0.75, ease: EASE, delay: 0.05 } }}
          exit={{ y: ['100%', '0%'], transition: { duration: 0.5, ease: EASE } }}
        >
          <div className="absolute inset-x-0 top-0 h-[3px] bg-spectrum" />
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-spectrum" />
        </motion.div>
      )}
    </>
  )
}
