const grads = {
  aurora: 'var(--grad-aurora)',
  sunset: 'var(--grad-sunset)',
  ocean: 'var(--grad-ocean)',
  spectrum: 'var(--grad-spectrum)',
}

/** Multicolour gradient text. `animate` slowly pans the gradient (disabled for reduced motion). */
export default function GradientText({ children, variant = 'aurora', animate = false, className = '', as: Tag = 'span' }) {
  return (
    <Tag className={`text-gradient ${animate ? 'animate-gradient' : ''} ${className}`} style={{ '--grad': grads[variant] }}>
      {children}
    </Tag>
  )
}
