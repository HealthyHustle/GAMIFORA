import { useId } from 'react'

const FIREFLIES = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 90,
  delay: (i * 0.7) % 6,
  dur: 5 + ((i * 13) % 6),
  size: 4 + (i % 3) * 2,
}))

const LEAVES = Array.from({ length: 9 }, (_, i) => ({
  left: (i * 29 + 5) % 100,
  delay: (i * 1.9) % 14,
  dur: 14 + ((i * 7) % 10),
  size: 16 + (i % 4) * 7,
  hue: [96, 78, 62, 130, 48][i % 5],
}))

function Leaf({ hue }: { hue: number }) {
  const id = useId()
  return (
    <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 70% 55%)`} />
          <stop offset="1" stopColor={`hsl(${hue} 60% 30%)`} />
        </linearGradient>
      </defs>
      <path
        d="M4 36 C4 14 18 4 36 4 C36 24 24 36 4 36 Z"
        fill={`url(#${id})`}
        stroke="rgba(20,50,10,.6)"
        strokeWidth="1.5"
      />
      <path d="M6 34 C14 24 22 16 32 8" stroke="rgba(255,255,220,.55)" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export function ForestBackground({ bright = false }: { bright?: boolean }) {
  return (
    <div className={`forest-bg ${bright ? 'forest-bg--bright' : ''}`} aria-hidden="true">
      <div className="forest-bg__image" />
      <div className="forest-bg__rays" />
      <div className="forest-bg__vignette" />
      {FIREFLIES.map((f, i) => (
        <span
          key={i}
          className="firefly"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: f.size,
            height: f.size,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.dur}s`,
          }}
        />
      ))}
      {LEAVES.map((l, i) => (
        <span
          key={i}
          className="falling-leaf"
          style={{
            left: `${l.left}%`,
            width: l.size,
            height: l.size,
            animationDelay: `-${l.delay}s`,
            animationDuration: `${l.dur}s`,
          }}
        >
          <Leaf hue={l.hue} />
        </span>
      ))}
    </div>
  )
}

