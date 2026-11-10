import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, UserRound } from 'lucide-react'
import { Avatar, Logo } from '../components/Avatar.tsx'
import { GameButton } from '../components/GameButton.tsx'
import { Parchment } from '../components/Panels.tsx'
import { ProfileDialog } from '../components/ProfileDialog.tsx'
import { useGame } from '../context/GameContext.tsx'
import { currentLevel, totalPoints } from '../lib/progress.ts'

export default function WelcomePage() {
  const { user, progress } = useGame()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const cur = currentLevel(progress)
  const firstName = user?.name.split(' ')[0] ?? 'Petualang'

  return (
    <main className="screen screen--welcome">
      <Logo className="logo--xl" />

      <div className="welcome__stage">
        <div className="welcome__stones" aria-hidden="true" />
        <Avatar className="welcome__avatar" cycle />
      </div>

      <Parchment className="welcome__panel">
        <p className="welcome__greeting">Halo, {firstName}!</p>
        <h1 className="welcome__tagline">Belajar, Bermain, dan Taklukkan Tantangan!</h1>
        <p className="muted welcome__meta">
          {cur ? `Level aktif: Level ${cur}` : 'Semua level sudah kamu taklukkan!'} · Total poin: {totalPoints(progress)}
        </p>
        <div className="welcome__actions">
          <GameButton size="lg" icon={<Play size={20} fill="currentColor" />} onClick={() => navigate('/mainboard')} id="btn-mulai">
            Mulai Petualangan
          </GameButton>
          <GameButton variant="green" size="lg" icon={<UserRound size={20} />} onClick={() => setProfileOpen(true)} id="btn-profil-welcome">
            Lihat Profil
          </GameButton>
        </div>
      </Parchment>

      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </main>
  )
}

