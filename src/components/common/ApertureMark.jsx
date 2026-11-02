/**
 * Decorative camera-aperture mark: lens ring with focus ticks and an 8-blade iris.
 * Pure SVG, no raster cost. Pass className for size / animation hooks.
 */
const C = 200
const R0 = 46 // iris opening
const R1 = 128 // blade outer radius
const BLADES = 8

const pt = (r, a) => [C + r * Math.cos(a), C + r * Math.sin(a)]

const blades = Array.from({ length: BLADES }, (_, k) => {
  const a = (k / BLADES) * Math.PI * 2
  const b = ((k + 1) / BLADES) * Math.PI * 2
  const P = pt(R0, a)
  const Pn = pt(R0, b)
  const len = Math.hypot(Pn[0] - P[0], Pn[1] - P[1])
  const u = [(Pn[0] - P[0]) / len, (Pn[1] - P[1]) / len]
  // where the ray P + t·u meets the outer circle
  const px = P[0] - C
  const py = P[1] - C
  const bq = px * u[0] + py * u[1]
  const t = -bq + Math.sqrt(bq * bq - (px * px + py * py - R1 * R1))
  return { P: Pn, Q: [P[0] + u[0] * t, P[1] + u[1] * t] }
})

const f = (n) => n.toFixed(2)
const bladePaths = blades.map(({ P, Q }, k) => {
  const prev = blades[(k - 1 + BLADES) % BLADES]
  return `M${f(P[0])},${f(P[1])} L${f(Q[0])},${f(Q[1])} A${R1},${R1} 0 0 0 ${f(prev.Q[0])},${f(prev.Q[1])} Z`
})

const ticks = Array.from({ length: 120 }, (_, i) => {
  const a = (i / 120) * Math.PI * 2
  const long = i % 10 === 0
  const [x1, y1] = pt(long ? 160 : 166, a)
  const [x2, y2] = pt(172, a)
  return { x1, y1, x2, y2, long }
})

export default function ApertureMark({
  className = '',
  ringText = 'VKS FILM PRODUCTION • CREATING MAGIC ON SCREEN • ',
  irisClassName = '',
  ringClassName = '',
  idPrefix = 'ap',
}) {
  const g = `${idPrefix}-spectrum`
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={className} focusable="false">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD13D" />
          <stop offset=".3" stopColor="#FF168F" />
          <stop offset=".65" stopColor="#8B4DFF" />
          <stop offset="1" stopColor="#00D9FF" />
        </linearGradient>
        <radialGradient id={`${idPrefix}-blade`} cx="50%" cy="50%" r="50%">
          <stop offset="0.3" stopColor="#2a2a38" />
          <stop offset="1" stopColor="#0d0d13" />
        </radialGradient>
        <path id={`${idPrefix}-ring`} d={`M ${C},${C} m -186,0 a 186,186 0 1,1 372,0 a 186,186 0 1,1 -372,0`} />
      </defs>

      <g className={ringClassName} style={{ transformOrigin: '50% 50%', transformBox: 'fill-box' }}>
        <circle cx={C} cy={C} r="197" fill="none" stroke={`url(#${g})`} strokeWidth="1" opacity=".55" />
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={f(t.x1)}
            y1={f(t.y1)}
            x2={f(t.x2)}
            y2={f(t.y2)}
            stroke={t.long ? `url(#${g})` : 'rgba(248,247,252,.28)'}
            strokeWidth={t.long ? 1.6 : 0.8}
          />
        ))}
        <text fill="rgba(248,247,252,.62)" fontSize="10.5" letterSpacing="4.6" fontFamily="Manrope Variable, sans-serif" fontWeight="700">
          <textPath href={`#${idPrefix}-ring`}>{ringText.repeat(2)}</textPath>
        </text>
      </g>

      <circle cx={C} cy={C} r="146" fill="#0b0b10" stroke="rgba(248,247,252,.14)" strokeWidth="1" />
      <circle cx={C} cy={C} r="138" fill="none" stroke={`url(#${g})`} strokeWidth="2" opacity=".85" />

      <g className={irisClassName} style={{ transformOrigin: '50% 50%', transformBox: 'fill-box' }}>
        {bladePaths.map((d, k) => (
          <path key={k} d={d} fill={`url(#${idPrefix}-blade)`} stroke="rgba(248,247,252,.22)" strokeWidth="0.8" />
        ))}
        <circle cx={C} cy={C} r={R0 - 4} fill="#050507" />
        <circle cx={C - 14} cy={C - 16} r="9" fill="rgba(255,255,255,.16)" />
        <circle cx={C + 12} cy={C + 13} r="4" fill="rgba(0,217,255,.35)" />
      </g>
    </svg>
  )
}
