import { motion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1]

/** Gentle fade-and-rise group entrance when scrolled into view. */
export default function Reveal({ as = 'div', children, delay = 0, y = 28, className = '', amount, ...rest }) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px', amount }}
      transition={{ duration: 0.95, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
