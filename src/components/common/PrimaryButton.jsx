import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import MagneticButton from './MagneticButton'

const variants = {
  primary: {
    root: 'bg-soft text-obsidian hover:text-soft focus-visible:text-soft',
    fill: 'bg-aurora',
    icon: 'bg-obsidian text-soft',
  },
  ghost: {
    root: 'grad-border text-soft hover:text-obsidian focus-visible:text-obsidian',
    fill: 'bg-soft',
    icon: 'bg-soft/10 text-soft group-hover:bg-obsidian group-focus-visible:bg-obsidian',
  },
}

/**
 * Pill CTA. Renders a router Link (`to`), an anchor (`href`) or a button.
 * Hover: gradient fill rises and the arrow swaps — CSS transitions only.
 */
export default function PrimaryButton({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  icon: Icon = ArrowUpRight,
  size = 'md',
  magnetic = true,
  className = '',
  type = 'button',
  ...rest
}) {
  const v = variants[variant]
  const sizing =
    size === 'sm' ? 'min-h-12 pl-6 pr-2 gap-4 text-[0.74rem]' : 'min-h-14 pl-7 pr-2 gap-5 text-[0.76rem]'
  const iconSize = size === 'sm' ? 'size-9' : 'size-10'

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 translate-y-[101%] rounded-[inherit] transition-transform duration-500 ease-cinema group-hover:translate-y-0 group-focus-visible:translate-y-0 ${v.fill}`}
      />
      <span className="relative">{children}</span>
      <span
        aria-hidden="true"
        className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full transition-colors duration-500 ${iconSize} ${v.icon}`}
      >
        <Icon className="size-4 transition-transform duration-500 ease-cinema group-hover:translate-x-5 group-hover:-translate-y-5" strokeWidth={2.2} />
        <Icon
          className="absolute size-4 -translate-x-5 translate-y-5 transition-transform duration-500 ease-cinema group-hover:translate-x-0 group-hover:translate-y-0"
          strokeWidth={2.2}
        />
      </span>
    </>
  )

  const cls = `group relative isolate inline-flex items-center justify-between overflow-hidden rounded-full font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-500 ${sizing} ${v.root} ${className}`

  let el
  if (to) {
    el = (
      <Link to={to} onClick={onClick} className={cls} {...rest}>
        {inner}
      </Link>
    )
  } else if (href) {
    const external = /^https?:/.test(href)
    el = (
      <a href={href} onClick={onClick} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {inner}
      </a>
    )
  } else {
    el = (
      <button type={type} onClick={onClick} className={cls} {...rest}>
        {inner}
      </button>
    )
  }

  return magnetic ? <MagneticButton>{el}</MagneticButton> : el
}
