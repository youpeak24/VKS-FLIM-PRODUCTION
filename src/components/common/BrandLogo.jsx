import { siteConfig } from '../../data/siteConfig'

/**
 * Official logo slot.
 * Drop the client's supplied logo into src/assets/branding/ as logo.png / logo.svg / logo.webp
 * and it is used everywhere automatically, untouched (no recolouring or distortion).
 * Uses the supplied public/2 brand image when no dedicated logo asset is present.
 */
const files = import.meta.glob('../../assets/branding/logo.{svg,png,webp,avif,jpg}', {
  eager: true,
  import: 'default',
})
const officialLogo = Object.values(files)[0] || '/2/android-chrome-192x192.png' // 192px is plenty for a 48–96px logo (the 512px file is 6× heavier)

const heights = { sm: 'h-9', md: 'h-12', lg: 'h-20 md:h-24' }

export default function BrandLogo({ size = 'md', className = '' }) {
  if (officialLogo) {
    return (
      <img
        src={officialLogo}
        alt={siteConfig.legalName}
        width="192"
        height="192"
        decoding="async"
        className={`${heights[size]} w-auto object-contain ${className}`}
      />
    )
  }

  const large = size === 'lg'
  return (
    <span
      className={`inline-flex items-center gap-2.5 leading-none ${className}`}
      data-placeholder-logo="replace with official logo"
    >
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className={large ? 'size-12 md:size-14' : size === 'sm' ? 'size-8' : 'size-10'}
      >
        <defs>
          <linearGradient id={`bl-g-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFD13D" />
            <stop offset=".35" stopColor="#FF168F" />
            <stop offset=".7" stopColor="#8B4DFF" />
            <stop offset="1" stopColor="#00D9FF" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="17" fill="none" stroke={`url(#bl-g-${size})`} strokeWidth="3.2" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <circle
            key={a}
            cx={20 + Math.sin((a * Math.PI) / 180) * 8.5}
            cy={20 - Math.cos((a * Math.PI) / 180) * 8.5}
            r="2.6"
            fill={`url(#bl-g-${size})`}
          />
        ))}
      </svg>
      <span className="flex flex-col">
        <span
          className={`font-display font-extrabold tracking-[-0.02em] text-soft ${
            large ? 'text-[2.4rem] md:text-[2.9rem]' : size === 'sm' ? 'text-[1.3rem]' : 'text-[1.7rem]'
          }`}
        >
          VKS
        </span>
        <span
          className={`font-sans font-semibold uppercase text-muted ${
            large ? 'mt-1.5 text-[0.7rem] tracking-[0.42em]' : 'mt-1 text-[0.56rem] tracking-[0.36em]'
          }`}
        >
          Film Production
        </span>
      </span>
    </span>
  )
}
