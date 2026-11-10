import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Lightbulb, Play, Sparkles } from 'lucide-react';
import { GameButton } from '../components/GameButton';
import { FlowShape, FlowSymbolLegend } from '../components/FlowShape';
import { PageHeader } from '../components/PageHeader';
import { Parchment, WoodBanner } from '../components/Panels';
import { Avatar } from '../components/Avatar';
import { useGame } from '../context/GameContext';
import { MATERIALS, getMaterial } from '../data/materials';
import type { Material } from '../data/materials';

export function MaterialIcon({ m, className = '' }: { m: Material; className?: string }) {
  if (m.image) return <img className={`mat-icon ${className}`} src={m.image} alt="" aria-hidden="true" draggable={false} />;
  return (
    <span className={`mat-icon mat-icon--drawn ${className}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        <rect x="3" y="3" width="58" height="58" rx="14" fill="#14b8a6" stroke="#0b4f48" strokeWidth="3" />
        <rect x="8" y="8" width="48" height="22" rx="10" fill="rgba(255,255,255,.2)" />
        <rect x="22" y="9" width="20" height="9" rx="4.5" fill="#fcd34d" stroke="#7a4b00" strokeWidth="1.6" />
        <path d="M32 18v4" stroke="#0b4f48" strokeWidth="2" />
        <path d="M24 22h18l-3 8H21z" fill="#7dd3fc" stroke="#0b4f48" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M32 30v4" stroke="#0b4f48" strokeWidth="2" />
        <path d="M32 34l9 7-9 7-9-7z" fill="#c4b5fd" stroke="#0b4f48" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M23 41h-6v10M41 41h6v10" stroke="#0b4f48" strokeWidth="2" fill="none" />
        <rect x="11" y="50" width="12" height="7" rx="2" fill="#bef264" stroke="#0b4f48" strokeWidth="1.6" />
        <rect x="41" y="50" width="12" height="7" rx="2" fill="#bef264" stroke="#0b4f48" strokeWidth="1.6" />
      </svg>
    </span>
  );
}

export default function MaterialsPage() {
  const { progress } = useGame();
  const navigate = useNavigate();
  const read = progress.materialsRead.length;

  return (
    <main className="screen">
      <PageHeader title="Materi Pembelajaran" subtitle="Pelajari materi berikut sebelum mengerjakan soal" backTo="/mainboard" backLabel="Mainboard" />
      <div className="screen__inner">
        <Parchment className="materials-card">
          <p className="materials-progress" role="status">
            <Sparkles size={18} /> {read} dari {MATERIALS.length} materi sudah dibaca
          </p>
          <ul className="material-list">
            {MATERIALS.map((m) => {
              const isRead = progress.materialsRead.includes(m.id);
              return (
                <li key={m.id}>
                  <Link to={`/materi/${m.id}`} className="material-item" style={{ ['--accent' as string]: m.accent }} id={`materi-${m.id}`}>
                    <MaterialIcon m={m} />
                    <span className="material-item__text">
                      <strong>{m.id}. {m.title}</strong>
                      <small>{m.short}</small>
                    </span>
                    {isRead && (
                      <span className="read-badge" aria-label="Sudah dibaca">
                        <Check size={16} strokeWidth={4} />
                      </span>
                    )}
                    <ChevronRight className="material-item__chev" size={22} />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="materials-actions">
            <GameButton size="lg" icon={<Play size={20} fill="currentColor" />} onClick={() => navigate('/level')} id="btn-mulai-kuis">
              Mulai Kuis
            </GameButton>
          </div>
        </Parchment>
      </div>
    </main>
  );
}

function Diagram({ m }: { m: Material }) {
  const d = m.diagram;
  if (d.type === 'flowsymbols') {
    return (
      <figure className="diagram">
        <FlowSymbolLegend />
        <figcaption>Simbol-simbol dasar flowchart.</figcaption>
      </figure>
    );
  }
  return (
    <figure className="diagram">
      <div className="chain">
        {d.items.map((it, i) => (
          <div className="chain__group" key={it.label}>
            <div className="chain__node">
              <span className="chain__emoji" aria-hidden="true">{it.emoji}</span>
              <span>{it.label}</span>
            </div>
            {i < d.items.length - 1 && <ChevronRight className="chain__arrow" size={26} strokeWidth={3} aria-hidden="true" />}
          </div>
        ))}
      </div>
      <figcaption>{d.caption}</figcaption>
    </figure>
  );
}

export function MaterialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { progress, readMaterial } = useGame();
  const m = getMaterial(Number(id));
  if (!m) return <Navigate to="/materi" replace />;

  const idx = MATERIALS.findIndex((x) => x.id === m.id);
  const prev = MATERIALS[idx - 1];
  const next = MATERIALS[idx + 1];
  const isRead = progress.materialsRead.includes(m.id);

  const go = (target: Material) => {
    readMaterial(m.id);
    navigate(`/materi/${target.id}`);
  };

  return (
    <main className="screen">
      <PageHeader title={`Materi ${m.id}`} subtitle={m.title} backTo="/materi" backLabel="Daftar Materi" />
      <div className="screen__inner">
        <Parchment className="material-detail" style={{ ['--accent' as string]: m.accent }}>
          <div className="material-hero">
            <MaterialIcon m={m} className="mat-icon--hero" />
            <div>
              <h2 className="display display--sm">{m.title}</h2>
              <p className="material-hero__intro">{m.intro}</p>
            </div>
          </div>

          <Diagram m={m} />

          {m.sections.map((s) => (
            <section key={s.heading} className="material-section">
              <h3>{s.heading}</h3>
              {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              )}
            </section>
          ))}

          <aside className="example-box">
            <h3><Lightbulb size={20} /> {m.example.title}</h3>
            {m.example.body.map((line) => <p key={line}>{line}</p>)}
            {m.id === 6 && (
              <div className="example-flow" aria-hidden="true">
                <FlowShape type="terminator" w={96} h={34} text="Mulai" />
                <FlowShape type="io" w={130} h={38} text="Masukkan bilangan" />
                <FlowShape type="decision" w={140} h={64} text="mod 2 = 0 ?" />
              </div>
            )}
          </aside>

          <aside className="summary-box">
            <WoodBanner>Rangkuman</WoodBanner>
            <ul>
              {m.summary.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </aside>

          <div className="material-actions">
            <GameButton
              variant={isRead ? 'green' : 'cream'}
              icon={<Check size={18} strokeWidth={4} />}
              onClick={() => readMaterial(m.id)}
              aria-pressed={isRead}
              id="btn-tandai-baca"
            >
              {isRead ? 'Sudah dibaca' : 'Tandai sudah dibaca'}
            </GameButton>
          </div>

          <nav className="material-nav" aria-label="Navigasi materi">
            {prev ? (
              <GameButton variant="wood" icon={<ChevronLeft size={20} />} onClick={() => go(prev)} id="btn-materi-prev">
                Sebelumnya
              </GameButton>
            ) : <span />}
            {next ? (
              <GameButton iconRight={<ChevronRight size={20} />} onClick={() => go(next)} id="btn-materi-next">
                Selanjutnya
              </GameButton>
            ) : (
              <GameButton
                icon={<Play size={18} fill="currentColor" />}
                onClick={() => {
                  readMaterial(m.id);
                  navigate('/level');
                }}
                id="btn-mulai-kuis-akhir"
              >
                Mulai Kuis
              </GameButton>
            )}
          </nav>
          {next && (
            <p className="muted center small">
              Sudah siap?{' '}
              <Link
                to="/level"
                className="text-link"
                onClick={() => readMaterial(m.id)}
              >
                Mulai Kuis
              </Link>
            </p>
          )}
        </Parchment>
        <Avatar className="material-mascot" animation="idle" />
      </div>
    </main>
  );
}
