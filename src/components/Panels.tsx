import type { ReactNode } from 'react'

export function Parchment({
  children,
  className = '',
  as: Tag = 'section',
  ...rest
}: {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'article' | 'aside'
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={`parchment ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

export function WoodBanner({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`wood-banner ${className}`}>{children}</div>
}

export function ProgressBar({
  value,
  max,
  label,
  tone = 'leaf',
  className = '',
}: {
  value: number
  max: number
  label: string
  tone?: 'leaf' | 'gold'
  className?: string
}) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div
      className={`bar bar--${tone} ${className}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(value, max)}
    >
      <div className="bar__fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Stars({ filled, total = 3, className = '' }: { filled: number; total?: number; className?: string }) {
  return (
    <span className={`stars ${className}`} aria-label={`${filled} dari ${total} bintang`} role="img">
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={`stars__s ${i < filled ? 'is-on' : ''}`} aria-hidden="true">
          <path
            d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9z"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  )
}

