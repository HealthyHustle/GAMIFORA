import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Compass, Cpu, Lock, Puzzle, Workflow } from 'lucide-react';
import { GameButton } from '../components/GameButton';
import { PageHeader } from '../components/PageHeader';
import { Parchment, Stars } from '../components/Panels';
import { useGame } from '../context/GameContext';
import { LEVELS, levelPath } from '../data/levels';
import type { LevelDef } from '../data/levels';
import { levelStatus, lockedReason, pointsNeeded } from '../lib/progress';
import type { LevelId } from '../types';

const ICONS: Record<LevelId, typeof Compass> = { 1: Compass, 2: Cpu, 3: Puzzle, 4: Workflow };

function LevelCard({ def, onOpen }: { def: LevelDef; onOpen: (id: LevelId) => void }) {
  const { progress } = useGame();
  const status = levelStatus(progress, def.id);
  const rec = progress.levels[def.id];
  const Icon = ICONS[def.id];
  const ratio = rec.bestScore / def.maxScore;
  const stars = status === 'locked' ? 0 : rec.bestScore >= def.target ? (ratio >= 1 ? 3 : 2) : rec.attempts > 0 ? 1 : 0;
  const reason = lockedReason(progress, def.id);

  const cta =
    status === 'locked' ? 'Terkunci' : status === 'passed' ? 'Ulangi Level' : rec.attempts > 0 ? 'Coba Lagi' : 'Mainkan';

  return (
    <button
      type="button"
      className={`level-card level-card--${status} level-card--n${def.id}`}
      onClick={() => onOpen(def.id)}
      aria-disabled={status === 'locked'}
      aria-label={`Level ${def.id}: ${def.title}. ${status === 'locked' ? `Terkunci. ${reason}` : status === 'passed' ? 'Sudah lulus' : 'Terbuka'}`}
      id={`level-card-${def.id}`}
    >
      <span className="level-card__ribbon">LEVEL {def.id}</span>
      {status === 'passed' && (
        <span className="level-card__check" aria-hidden="true"><Check size={16} strokeWidth={4} /></span>
      )}
      <Stars filled={stars} className="level-card__stars" />
      <span className="level-card__icon" aria-hidden="true">
        {status === 'locked' ? <Lock size={44} strokeWidth={2.4} /> : <Icon size={44} strokeWidth={2.2} />}
      </span>
      <span className="level-card__title">{def.title}</span>
      <span className="level-card__subject">{def.subject}</span>
      <span className="level-card__kind">{def.kindLabel}</span>
      <span className="level-card__target">Target {def.target} poin</span>
      {status !== 'locked' && (
        <span className="level-card__best">Terbaik: {rec.bestScore}/{def.maxScore}</span>
      )}
      {status === 'locked' ? (
        <span className="level-card__reason">{reason}</span>
      ) : (
        <span className="level-card__cta">{cta}</span>
      )}
    </button>
  );
}

export default function LevelSelectPage() {
  const { progress } = useGame();
  const navigate = useNavigate();
  const location = useLocation();
  const [notice, setNotice] = useState<string>((location.state as { notice?: string } | null)?.notice ?? '');
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notice) noticeRef.current?.focus();
  }, [notice]);

  const open = (id: LevelId) => {
    const status = levelStatus(progress, id);
    if (status === 'locked') {
      setNotice(`Level ${id} masih terkunci. ${lockedReason(progress, id)}`);
      return;
    }
    navigate(levelPath(id));
  };

  const l1 = pointsNeeded(progress, 1);

  return (
    <main className="screen">
      <PageHeader
        title="Pilih Level"
        subtitle="Selesaikan level sebelumnya untuk membuka level berikutnya"
        backTo="/mainboard"
        backLabel="Mainboard"
      />
      <div className="screen__inner">
        {notice && (
          <div className="alert alert--warn" role="alert" tabIndex={-1} ref={noticeRef}>
            <Lock size={18} /> {notice}
            <button type="button" className="alert__close" onClick={() => setNotice('')} aria-label="Tutup pesan">×</button>
          </div>
        )}

        <ul className="level-grid" aria-label="Daftar level">
          {LEVELS.map((def) => (
            <li key={def.id}>
              <LevelCard def={def} onOpen={open} />
            </li>
          ))}
        </ul>

        <Parchment className="level-hint">
          <p>
            {progress.levels[1].attempts === 0
              ? `Mulai dari Level 1. Kamu butuh ${l1} poin untuk lulus dan membuka Level 2.`
              : 'Level dibuka berurutan. Skor terbaikmu di setiap level yang menentukan kelulusan.'}
          </p>
          <div className="level-hint__actions">
            <GameButton variant="wood" onClick={() => navigate('/mainboard')} id="btn-kembali-mainboard">
              Kembali ke Mainboard
            </GameButton>
          </div>
        </Parchment>
      </div>
    </main>
  );
}
