import { useState } from 'react'
import { Award, RotateCcw, Star } from 'lucide-react'
import { Avatar } from './Avatar'
import { GameDialog } from './GameDialog'
import { GameButton } from './GameButton'
import { ProgressBar } from './Panels'
import { ACHIEVEMENTS } from '../data/achievements'
import { LEVELS, TOTAL_MAX_XP } from '../data/levels'
import { currentLevel, passedCount, totalPoints } from '../lib/progress'
import { useGame } from '../context/GameContext'

export function rankTitle(passed: number): string {
  return ['Penjelajah Pemula', 'Penjelajah Informatika', 'Ahli Digital', 'Perancang Logika', 'Master Flowchart'][passed] ?? 'Penjelajah'
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

export function AchievementList({ compact = false }: { compact?: boolean }) {
  const { progress } = useGame()
  const earned = ACHIEVEMENTS.filter((a) => progress.achievements[a.id])
  if (earned.length === 0) {
    return <p className="muted">Belum ada pencapaian. Selesaikan tantangan pertamamu!</p>
  }
  return (
    <ul className={`achievements ${compact ? 'achievements--compact' : ''}`}>
      {earned.map((a) => (
        <li key={a.id} className="achievement">
          <span className="achievement__emoji" aria-hidden="true">{a.emoji}</span>
          <span className="achievement__text">
            <strong>{a.title}</strong>
            <small>{a.description}</small>
          </span>
          <span className="achievement__date">{formatDate(progress.achievements[a.id])}</span>
        </li>
      ))}
    </ul>
  )
}

export function HistoryList({ limit = 5 }: { limit?: number }) {
  const { progress } = useGame()
  const items = [...progress.history].reverse().slice(0, limit)
  if (items.length === 0) return <p className="muted">Belum ada riwayat hasil.</p>
  return (
    <ul className="history">
      {items.map((h) => (
        <li key={h.id} className={h.passed ? 'is-pass' : 'is-fail'}>
          <span>Level {h.level} · percobaan {h.attempt}</span>
          <strong>{h.score}/{h.max}</strong>
          <span className="history__badge">{h.passed ? 'Lulus' : 'Belum lulus'}</span>
        </li>
      ))}
    </ul>
  )
}

export function ProfileDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, progress, restartAll } = useGame()
  const [confirmReset, setConfirmReset] = useState(false)
  if (!user) return null
  const cur = currentLevel(progress)
  const passed = passedCount(progress)
  const total = totalPoints(progress)

  return (
    <GameDialog
      id="profile-dialog"
      open={open}
      onClose={() => {
        setConfirmReset(false)
        onClose()
      }}
      title="Profil Pemain"
    >
      <div className="profile">
        <Avatar className="profile__avatar" animation="idle" />
        <div className="profile__info">
          <h3 className="profile__name">{user.name}</h3>
          <p className="muted profile__email">{user.email}</p>
          <p className="profile__rank">
            <Award size={16} /> {rankTitle(passed)}
          </p>
        </div>
      </div>

      <dl className="stat-grid">
        <div><dt>Level aktif</dt><dd>{cur ? `Level ${cur}` : 'Selesai semua'}</dd></div>
        <div><dt>Level lulus</dt><dd>{passed} / {LEVELS.length}</dd></div>
        <div><dt>Total poin</dt><dd><Star size={14} fill="currentColor" /> {total}</dd></div>
        <div><dt>Materi dibaca</dt><dd>{progress.materialsRead.length} / 6</dd></div>
      </dl>

      <ProgressBar value={total} max={TOTAL_MAX_XP} label="Progres XP" />
      <p className="muted small">{total} / {TOTAL_MAX_XP} XP</p>

      <h3 className="subhead">Pencapaian</h3>
      <AchievementList compact />
      <h3 className="subhead">Riwayat Hasil</h3>
      <HistoryList limit={5} />

      <div className="profile__danger">
        {!confirmReset ? (
          <GameButton variant="cream" size="sm" icon={<RotateCcw size={16} />} onClick={() => setConfirmReset(true)}>
            Mulai dari awal
          </GameButton>
        ) : (
          <div className="confirm-row" role="alertdialog" aria-label="Konfirmasi hapus progres">
            <span>Hapus semua poin dan progres akunmu?</span>
            <GameButton
              variant="danger"
              size="sm"
              onClick={() => {
                restartAll()
                setConfirmReset(false)
                onClose()
              }}
            >
              Ya, hapus
            </GameButton>
            <GameButton variant="cream" size="sm" onClick={() => setConfirmReset(false)}>
              Batal
            </GameButton>
          </div>
        )}
      </div>
    </GameDialog>
  )
}

