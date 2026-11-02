import AnimatedHeading from './AnimatedHeading'
import Reveal from './Reveal'

/** Eyebrow label: section number, hairline, label. */
export function Eyebrow({ number, children, className = '', tone = 'text-cyan' }) {
  return (
    <Reveal y={12} className={`flex items-center gap-4 ${className}`}>
      {number && <span className={`eyebrow ${tone}`}>{number}</span>}
      <span aria-hidden="true" className="h-px w-10 bg-soft/30" />
      <span className="eyebrow text-soft/80">{children}</span>
    </Reveal>
  )
}

export default function SectionHeading({
  number,
  eyebrow,
  lines,
  as = 'h2',
  className = '',
  headingClassName = 'display-xl',
  tone,
  id,
  tabIndex,
}) {
  return (
    <div className={className}>
      <Eyebrow number={number} tone={tone}>
        {eyebrow}
      </Eyebrow>
      <AnimatedHeading as={as} id={id} tabIndex={tabIndex} lines={lines} className={`mt-6 md:mt-8 ${headingClassName}`} />
    </div>
  )
}
