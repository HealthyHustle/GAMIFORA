import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Home, RotateCcw, Star, Lock, Unlock } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { GameButton } from '../components/GameButton';
import { Parchment, Stars } from '../components/Panels';
import { useGame } from '../context/GameContext';
import { getAchievement } from '../data/achievements';
import { getLevel, levelPath, parseLevelId } from '../data/levels';
import { allLevelsPassed, isLevelUnlocked, totalPoints } from '../lib/progress';
import type { LevelId } from '../types';

const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 41 + 9) % 100,
  delay: (i * 0.37) % 4,
  dur: 3.2 + ((i * 11) % 30) / 10,
  size: 14 + (i % 5) * 5,
  kind: i % 3,
  rot: (i * 47) % 360,
}));

function ConfettiSvg({ kind }: { kind: number }) {
  if (kind === 0)
    return (
      <svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9z" fill="#ffd23f" stroke="#b36b00" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    );
  if (kind === 1)
    return (
      <svg viewBox="0 0 40 40"><path d="M4 36 C4 14 18 4 36 4 C36 24 24 36 4 36 Z" fill="#8bc34a" stroke="#33691e" strokeWidth="2" /></svg>
    );
  return <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="6" fill="#fff2a8" stroke="#f5a623" strokeWidth="2" /></svg>;
}

export default function CelebrationPage() {
  const { level: param } = useParams();
  const level = parseLevelId(param) as LevelId;
  const def = getLevel(level)!;
  const navigate = useNavigate();
  const { user, progress } = useGame();
  const res = progress.lastResult!;

  const nextId = level < 4 ? ((level + 1) as LevelId) : null;
  const nextDef = nextId ? getLevel(nextId) : undefined;
  const nextOpen = nextId ? isLevelUnlocked(progress, nextId) : false;
  const everything = allLevelsPassed(progress);
  const passed = res.passed;

  return (
    <main className="screen screen--celebration">
      {passed && (
        <div className="confetti" aria-hidden="true">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              style={{
                left: `${c.left}%`,
                width: c.size,
                height: c.size,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.dur}s`,
                ['--rot' as string]: `${c.rot}deg`,
              }}
            >
              <ConfettiSvg kind={c.kind} />
            </span>
          ))}
        </div>
      )}

      <div className="celebration__stage">
        <div className="celebration__glow" aria-hidden="true" />
        <Avatar
          mood={passed ? 'jump' : 'cheer'}
          animation={passed ? 'jump' : 'idle'}
          className="celebration__avatar"
          alt={passed ? 'Maskot melompat kegirangan' : 'Maskot menyemangati'}
        />
      </div>

      <Parchment className="celebration__panel">
        <div className="celebration__banner">
          <h1 className={`celebration__title ${passed ? '' : 'celebration__title--soft'}`}>
            {passed ? 'SELAMAT!' : 'Tetap Semangat!'}
          </h1>
        </div>
        <p className="celebration__sub">
          {passed ? 'Kamu berhasil menyelesaikan tantangan!' : 'Hampir berhasil, kamu pasti bisa!'}
        </p>
        <Stars filled={passed ? (res.score === res.max ? 3 : 2) : res.score >= res.max / 2 ? 1 : 0} className="stars--lg" />

        <dl className="info-grid">
          <div><dt>Nama pemain</dt><dd>{user?.name}</dd></div>
          <div><dt>Level</dt><dd>Level {level}: {def.title}</dd></div>
          <div><dt>Skor percobaan ini</dt><dd>{res.score} / {res.max}</dd></div>
          <div><dt>Poin diperoleh</dt><dd className="gain"><Star size={16} fill="currentColor" /> +{res.gained}</dd></div>
          <div><dt>Total poin</dt><dd>{totalPoints(progress)}</dd></div>
          <div>
            <dt>Status kelulusan</dt>
            <dd className={passed ? 'is-ok' : 'is-bad'}>{passed ? 'LULUS' : `Belum lulus (target ${def.target})`}</dd>
          </div>
        </dl>

        <p className="next-status" role="status">
          {nextDef ? (
            nextOpen ? (
              <><Unlock size={16} /> Level {nextDef.id}: {nextDef.title} sudah terbuka!</>
            ) : (
              <><Lock size={16} /> Level {nextDef.id}: {nextDef.title} masih terkunci.</>
            )
          ) : (
            <>Ini adalah level terakhir.</>
          )}
        </p>

        {res.passed && res.gained === 0 && (
          <p className="muted center small">Skor ini tidak melebihi skor terbaikmu, jadi poin tidak ditambahkan lagi.</p>
        )}

        {res.newAchievements.length > 0 && (
          <div className="new-achievements">
            <strong>Pencapaian baru!</strong>
            <ul>
              {res.newAchievements.map((id: string) => {
                const a = getAchievement(id);
                return a ? <li key={id}><span aria-hidden="true">{a.emoji}</span> {a.title}</li> : null;
              })}
            </ul>
          </div>
        )}

        <p className={`result-note ${everything ? 'is-ok' : passed ? 'is-ok' : 'is-bad'}`}>
          {everything
            ? 'Hebat! Kamu telah menaklukkan seluruh tantangan GAMIFORA!'
            : passed
              ? 'Kembali ke Mainboard untuk melanjutkan petualanganmu.'
              : 'Terus berlatih! Selesaikan tantangan ini untuk membuka level berikutnya.'}
        </p>

        <div className="celebration__actions">
          <GameButton size="lg" icon={<Home size={20} />} onClick={() => navigate('/mainboard')} id="btn-ke-mainboard">
            Kembali ke Mainboard
          </GameButton>
          {nextId && nextOpen && (
            <GameButton variant="green" size="lg" iconRight={<ArrowRight size={20} />} onClick={() => navigate(levelPath(nextId))} id="btn-lanjut-level-selanjutnya">
              Lanjut ke Level Selanjutnya
            </GameButton>
          )}
          <GameButton variant="wood" icon={<RotateCcw size={18} />} onClick={() => navigate(levelPath(level))} id="btn-ulangi-level">
            Ulangi Level
          </GameButton>
        </div>
      </Parchment>
    </main>
  );
}
