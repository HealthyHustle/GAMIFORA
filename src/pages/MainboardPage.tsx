import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Bot,
  Flag,
  Lock,
  LogOut,
  Map as MapIcon,
  PartyPopper,
  Play,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react'
import { Avatar, Logo } from '../components/Avatar.tsx'
import { GameButton } from '../components/GameButton.tsx'
import { Parchment, ProgressBar, WoodBanner } from '../components/Panels.tsx'
import { AchievementList, HistoryList, ProfileDialog, rankTitle } from '../components/ProfileDialog.tsx'
import { useGame } from '../context/GameContext.tsx'
import { LEVELS, TOTAL_MAX_XP, getLevel, levelPath } from '../data/levels.ts'
import { currentLevel, nextPanel, passedCount, totalPoints } from '../lib/progress.ts'

export default function MainboardPage() {
  const { user, progress, logout } = useGame()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)

  const cur = currentLevel(progress)
  const passed = passedCount(progress)
  const total = totalPoints(progress)
  const panel = nextPanel(progress)
  const curDef = cur ? getLevel(cur) : undefined
  const hasAttempts = progress.history.length > 0

  const status = panel.allDone
    ? 'Penakluk GAMIFORA'
    : !hasAttempts
      ? 'Siap memulai petualangan'
      : `Sedang belajar · ${rankTitle(passed)}`

  const focusDef = panel.focus ? getLevel(panel.focus) : undefined
  const nextDef = panel.next ? getLevel(panel.next) : undefined

  const onLogout = () => {
    logout()
    navigate('/masuk', { replace: true })
  }

  return (
    <main className="screen screen--board">
      <header className="board-top">
        <Logo className="logo--mini" />
        <h1 className="board-top__title">Mainboard</h1>
        <span className="chip chip--gold chip--lg">
          <Star size={18} fill="currentColor" /> {total} poin
        </span>
      </header>

      <div className="board-grid">
        <Parchment className="board-card board-card--profile" aria-labelledby="h-profile">
          <div className="player">
            <Avatar className="player__avatar" animation="idle" />
            <div className="player__info">
              <h2 id="h-profile" className="player__name">{user?.name}</h2>
              <p className="muted player__email">{user?.email}</p>
              <span className="chip chip--leaf">Level aktif: {cur ?? 'Selesai'}</span>
            </div>
          </div>

          <div className="level-block">
            <div className="level-block__row">
              <span className="level-orb" aria-hidden="true">{cur ?? '★'}</span>
              <div className="level-block__bar">
                <div className="level-block__label">
                  <strong>XP</strong>
                  <span>{total} / {TOTAL_MAX_XP} XP</span>
                </div>
                <ProgressBar value={total} max={TOTAL_MAX_XP} label="Pengalaman (XP)" />
              </div>
            </div>
            <dl className="stat-grid stat-grid--3">
              <div><dt>Level selesai</dt><dd>{passed} / {LEVELS.length}</dd></div>
              <div><dt>Total poin</dt><dd>{total}</dd></div>
              <div><dt>Status belajar</dt><dd className="small">{status}</dd></div>
            </dl>
          </div>
        </Parchment>

        <Parchment className="board-card board-card--menu" aria-label="Menu navigasi">
          <WoodBanner>Menu Petualangan</WoodBanner>
          <nav className="menu-list">
            <GameButton
              block
              variant="gold"
              icon={<Bot size={20} />}
              onClick={() => navigate('/ai-learning')}
              id="menu-ai-learning"
              className="btn--ai-highlight"
            >
              FORA AI
            </GameButton>
            <GameButton block variant="gold" icon={<BookOpen size={20} />} onClick={() => navigate('/materi')} id="menu-materi">
              Materi Pembelajaran
            </GameButton>
            <GameButton block variant="green" icon={<MapIcon size={20} />} onClick={() => navigate('/level')} id="menu-level">
              Pilih Level
            </GameButton>
            <GameButton
              block
              variant="gold"
              icon={<Play size={20} fill="currentColor" />}
              onClick={() => navigate(cur ? levelPath(cur) : '/level')}
              id="menu-lanjutkan"
            >
              {cur ? `Lanjutkan Belajar (Level ${cur})` : 'Lanjutkan Belajar (ulangi level)'}
            </GameButton>
            <GameButton block variant="green" icon={<UserRound size={20} />} onClick={() => setProfileOpen(true)} id="menu-profil">
              Profil Pemain
            </GameButton>
            <GameButton block variant="wood" icon={<LogOut size={20} />} onClick={onLogout} id="menu-keluar">
              Keluar
            </GameButton>
          </nav>
        </Parchment>

        <Parchment className="board-card board-card--next" aria-labelledby="h-next">
          <h2 id="h-next" className="card-title"><Flag size={20} /> Level Selanjutnya</h2>

          {panel.allDone ? (
            <div className="next-done" role="status">
              <PartyPopper size={32} />
              <p><strong>Hebat! Kamu telah menaklukkan seluruh tantangan GAMIFORA!</strong></p>
              <p className="muted">Semua level sudah lulus. Kamu boleh mengulang level untuk berlatih lagi.</p>
              <GameButton variant="gold" onClick={() => navigate('/level')} id="btn-ulang-semua">Lihat Semua Level</GameButton>
            </div>
          ) : (
            <>
              <div className="next-row">
                <span className="next-row__label">Sedang dikerjakan</span>
                <strong>
                  {panel.nextUnlocked && focusDef
                    ? `Level ${focusDef.id}: ${focusDef.title} (lulus)`
                    : curDef && `Level ${curDef.id}: ${curDef.title}`}
                </strong>
                {curDef && !panel.nextUnlocked && (
                  <small>
                    Skor terbaik: {progress.levels[curDef.id].bestScore} / target {curDef.target} poin
                  </small>
                )}
              </div>

              {nextDef ? (
                <div className="next-row">
                  <span className="next-row__label">Level berikutnya</span>
                  <strong>Level {nextDef.id}: {nextDef.title}</strong>
                  <span className={`status-pill ${panel.nextUnlocked ? 'status-pill--open' : 'status-pill--locked'}`}>
                    {panel.nextUnlocked ? 'Terbuka' : (<><Lock size={13} /> Terkunci</>)}
                  </span>
                  <small>Target poin level ini: {nextDef.target}</small>
                </div>
              ) : (
                <div className="next-row">
                  <span className="next-row__label">Level berikutnya</span>
                  <strong>Ini level terakhir!</strong>
                </div>
              )}

              {panel.next && (
                <>
                  <GameButton
                    block
                    variant="gold"
                    size="lg"
                    disabled={!panel.nextUnlocked}
                    onClick={() => panel.next && navigate(levelPath(panel.next))}
                    aria-describedby="next-reason"
                    id="btn-lanjut-level"
                  >
                    Lanjut ke Level Selanjutnya
                  </GameButton>
                  <p id="next-reason" className={`next-reason ${panel.nextUnlocked ? 'is-ok' : ''}`} role="status">
                    {panel.nextUnlocked
                      ? `Level ${panel.next} sudah terbuka. Ayo lanjutkan!`
                      : panel.focus !== null
                        ? progress.levels[panel.focus].attempts === 0
                          ? `Selesaikan Level ${panel.focus} lebih dulu: butuh ${panel.remaining} poin lagi (target ${getLevel(panel.focus)!.target}).`
                          : `Butuh ${panel.remaining} poin lagi di Level ${panel.focus} untuk membuka Level ${panel.next}.`
                        : ''}
                  </p>
                </>
              )}
              {!panel.next && (
                <p className="next-reason" role="status">
                  Selesaikan Level 4 (butuh {panel.remaining} poin lagi) untuk menaklukkan seluruh tantangan.
                </p>
              )}
            </>
          )}
        </Parchment>

        <Parchment
          as="article"
          className="board-card board-card--ai"
          onClick={() => navigate('/ai-learning')}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate('/ai-learning')
            }
          }}
          aria-label="Pilih layanan FORA AI. Asisten pembelajaran berbasis Artificial Intelligence."
          id="card-ai-learning"
        >
          <div className="ai-service-card">
            <div className="ai-service-card__top">
              <span className="ai-service-card__badge">
                <Sparkles size={14} className="ai-service-card__spark" />
                <span>AI-Powered Learning Assistant</span>
              </span>
              <span className="ai-service-card__status-dot" title="Layanan AI Siap" />
            </div>

            <div className="ai-service-card__main">
              <div className="ai-service-card__icon-box" aria-hidden="true">
                <Bot size={34} strokeWidth={2.4} />
              </div>
              <div className="ai-service-card__content">
                <h2 className="ai-service-card__title">FORA AI</h2>
                <p className="ai-service-card__desc">
                  Asisten pembelajaran berbasis Artificial Intelligence yang membantu pengguna memahami dunia Informatika, pemrograman, teknologi digital, dan pengembangan komputasi secara interaktif.
                </p>
              </div>
            </div>

            <div className="ai-service-card__footer">
              <span className="ai-service-card__tag">Tanya materi pemrograman, konsep komputasi, atau algoritma kapan saja</span>
              <span className="ai-service-card__cta">
                <span>Mulai Belajar dengan FORA AI</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </span>
            </div>
          </div>
        </Parchment>

        <Parchment className="board-card board-card--history" aria-labelledby="h-history">
          <h2 id="h-history" className="card-title"><Star size={20} /> Poin &amp; Pencapaian</h2>
          <div className="points-box">
            <span className="points-box__num"><Star size={28} fill="currentColor" /> {total}</span>
            <span className="points-box__text">
              {panel.allDone
                ? 'Semua level sudah lulus!'
                : cur
                  ? `Butuh ${Math.max(0, (curDef?.target ?? 0) - progress.levels[cur].bestScore)} poin lagi di Level ${cur} untuk membuka level berikutnya.`
                  : ''}
            </span>
          </div>
          <h3 className="subhead">Riwayat Pencapaian</h3>
          <AchievementList compact />
          <h3 className="subhead">Riwayat Hasil Terakhir</h3>
          <HistoryList limit={4} />
        </Parchment>
      </div>

      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </main>
  )
}

