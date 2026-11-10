import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Star } from 'lucide-react'
import { Logo } from './Avatar.tsx'
import { totalPoints } from '../lib/progress.ts'
import { useGame } from '../context/GameContext.tsx'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backTo: string
  backLabel?: string
  onBack?: () => void
  right?: ReactNode
  showPoints?: boolean
}

export function PageHeader({
  title,
  subtitle,
  backTo,
  backLabel = 'Kembali',
  onBack,
  right,
  showPoints = true,
}: PageHeaderProps) {
  const { progress } = useGame()
  const content = (
    <>
      <ArrowLeft size={22} strokeWidth={3} />
      <span className="page-header__back-label">{backLabel}</span>
    </>
  )

  return (
    <header className="page-header">
      {onBack ? (
        <button type="button" className="page-header__back" onClick={onBack} aria-label={backLabel}>
          {content}
        </button>
      ) : (
        <Link to={backTo} className="page-header__back" aria-label={backLabel}>
          {content}
        </Link>
      )}
      <div className="page-header__title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="page-header__right">
        {right}
        {showPoints && (
          <span className="chip chip--gold" aria-label={`Total poin ${totalPoints(progress)}`}>
            <Star size={16} fill="currentColor" /> {totalPoints(progress)}
          </span>
        )}
        <Logo className="logo--mini" />
      </div>
    </header>
  )
}

