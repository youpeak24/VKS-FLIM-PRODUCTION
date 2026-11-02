import { motion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1]

const lineVariants = {
  hidden: { y: '110%', rotate: 2 },
  show: ({ i, delay, stagger }) => ({
    y: '0%',
    rotate: 0,
    transition: { duration: 1.1, ease: EASE, delay: delay + i * stagger },
  }),
}

/**
 * Masked line-by-line headline reveal.
 * lines: array of strings / nodes, one per visual line.
 * immediate: animate on mount (heroes) instead of when scrolled into view.
 */
export default function AnimatedHeading({
  as = 'h2',
  lines,
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.085,
  immediate = false,
  id,
  tabIndex,
  style,
}) {
  const Tag = motion[as] ?? motion.h2
  const trigger = immediate
    ? { initial: 'hidden', animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '0px 0px -12% 0px' } }

  return (
    <Tag id={id} tabIndex={tabIndex} style={style} className={`outline-none ${className}`} {...trigger}>
      {lines.map((line, i) => (
        <span key={i} className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] pr-[0.08em] ${lineClassName}`}>
          <motion.span className="block origin-[0_100%] will-change-transform" variants={lineVariants} custom={{ i, delay, stagger }}>
            {line}
          </motion.span>
          {i < lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}
