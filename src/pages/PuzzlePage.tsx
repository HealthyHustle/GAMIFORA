import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronRight, Hand, Info, Lightbulb, RotateCcw, Save } from 'lucide-react';
import { FlowShape } from '../components/FlowShape';
import { GameButton } from '../components/GameButton';
import { GameDialog } from '../components/GameDialog';
import { PageHeader } from '../components/PageHeader';
import { Parchment, ProgressBar, Stars, WoodBanner } from '../components/Panels';
import { Avatar } from '../components/Avatar';
import { useGame } from '../context/GameContext';
import { getLevel, parseLevelId } from '../data/levels';
import { PUZZLES, SYMBOL_SHORT } from '../data/puzzles';
import type { PuzzleEdge, PuzzlePiece, SymbolType } from '../data/puzzles';
import { emptyPlacement, evaluatePuzzle, firstProblemSlot } from '../lib/puzzle';
import type { Placement, PuzzleEvaluation } from '../lib/puzzle';
import { shuffle } from '../lib/shuffle';
import type { LastResult } from '../types';

const TRAY_DIMS: Record<SymbolType, { w: number; h: number }> = {
  terminator: { w: 132, h: 44 },
  io: { w: 180, h: 56 },
  process: { w: 180, h: 56 },
  decision: { w: 200, h: 98 },
};

interface DragState {
  id: string;
  x: number;
  y: number;
  over: string | null;
}

function edgeState(e: PuzzleEdge, ev: PuzzleEvaluation | null, placement: Placement): 'idle' | 'ok' | 'bad' {
  if (!ev) return 'idle';
  if (ev.edgeCorrect[e.id]) return 'ok';
  return placement[e.from] && placement[e.to] ? 'bad' : 'idle';
}

export default function PuzzlePage() {
  const { level: param } = useParams();
  const level = parseLevelId(param) as 3 | 4;
  const def = PUZZLES[level];
  const levelDef = getLevel(level)!;
  const navigate = useNavigate();
  const { progress, submitResult } = useGame();

  const pieceMap = useMemo(() => new Map<string, PuzzlePiece>(def.pieces.map((p) => [p.id, p])), [def.pieces]);
  const [order, setOrder] = useState(() => shuffle(def.pieces.map((p) => p.id)));
  const [placement, setPlacement] = useState<Placement>(() => emptyPlacement(def));
  const [selected, setSelectedState] = useState<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [evalResult, setEvalResult] = useState<PuzzleEvaluation | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintList, setHintList] = useState<string[]>([]);
  const [hintSlot, setHintSlot] = useState<string | null>(null);
  const [justPlaced, setJustPlaced] = useState<string | null>(null);
  const [done, setDone] = useState<{ res: LastResult; ev: PuzzleEvaluation } | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const committed = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const placedTimer = useRef<number | undefined>(undefined);

  const rec = progress.levels[level];
  const setSelected = (v: string | null) => {
    selectedRef.current = v;
    setSelectedState(v);
  };

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / def.width));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [def.width]);

  useEffect(() => () => window.clearTimeout(placedTimer.current), []);

  const touched = useCallback(() => {
    setEvalResult(null);
    setHintSlot(null);
  }, []);

  const place = useCallback(
    (pieceId: string, slotId: string) => {
      setPlacement((prev) => {
        const origin = Object.keys(prev).find((k) => prev[k] === pieceId) ?? null;
        if (origin === slotId) return prev;
        const occupant = prev[slotId];
        const next = { ...prev, [slotId]: pieceId };
        if (origin) next[origin] = occupant;
        return next;
      });
      touched();
      setJustPlaced(slotId);
      window.clearTimeout(placedTimer.current);
      placedTimer.current = window.setTimeout(() => setJustPlaced(null), 800);
    },
    [touched],
  );

  const toTray = useCallback(
    (pieceId: string) => {
      setPlacement((prev) => {
        const origin = Object.keys(prev).find((k) => prev[k] === pieceId);
        return origin ? { ...prev, [origin]: null } : prev;
      });
      touched();
    },
    [touched],
  );

  const tapPiece = (pieceId: string, slotId: string | null) => {
    if (done) return;
    const sel = selectedRef.current;
    if (sel && sel !== pieceId && slotId) {
      place(sel, slotId);
      setSelected(null);
    } else {
      setSelected(sel === pieceId ? null : pieceId);
    }
  };

  const tapSlot = (slotId: string) => {
    if (done) return;
    const sel = selectedRef.current;
    if (sel) {
      place(sel, slotId);
      setSelected(null);
    }
  };

  const tapTray = () => {
    const sel = selectedRef.current;
    if (sel) {
      toTray(sel);
      setSelected(null);
    }
  };

  const startDrag = (e: ReactPointerEvent, pieceId: string, fromSlot: string | null) => {
    if (done) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const sx = e.clientX;
    const sy = e.clientY;
    let moved = false;

    const hit = (x: number, y: number) => document.elementFromPoint(x, y) as HTMLElement | null;

    const move = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
      moved = true;
      const over = hit(ev.clientX, ev.clientY)?.closest<HTMLElement>('[data-slot]')?.dataset.slot ?? null;
      setDrag({ id: pieceId, x: ev.clientX, y: ev.clientY, over });
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!moved) {
        tapPiece(pieceId, fromSlot);
        return;
      }
      setDrag(null);
      setSelected(null);
      if (ev.type === 'pointercancel') return;
      const el = hit(ev.clientX, ev.clientY);
      const slotId = el?.closest<HTMLElement>('[data-slot]')?.dataset.slot;
      if (slotId) place(pieceId, slotId);
      else if (el?.closest('[data-tray]')) toTray(pieceId);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const finish = (ev: PuzzleEvaluation) => {
    if (committed.current) return;
    committed.current = true;
    const res = submitResult(level, ev.score, { hintsUsed });
    setDone({ res, ev });
  };

  const check = () => {
    if (done) return;
    const ev = evaluatePuzzle(def, placement);
    setEvalResult(ev);
    setSelected(null);
    if (ev.perfect) finish(ev);
  };

  const endAttempt = () => {
    finish(evaluatePuzzle(def, placement));
  };

  const askHint = () => {
    if (hintsUsed >= 3 || done) return;
    let text: string;
    if (hintsUsed === 0) text = def.hints[0];
    else if (hintsUsed === 1) text = def.hints[1];
    else {
      const s = firstProblemSlot(def, placement);
      if (s) {
        text = placement[s.id]
          ? `Perhatikan slot nomor ${s.num} (berkedip): potongan di sana belum tepat. Coba tukar dengan potongan lain.`
          : `Perhatikan slot nomor ${s.num} (berkedip): slot itu masih kosong.`;
        setHintSlot(s.id);
        window.setTimeout(() => setHintSlot((cur) => (cur === s.id ? null : cur)), 5000);
      } else {
        text = 'Susunanmu sudah benar semua. Tekan "Periksa Jawaban"!';
      }
    }
    setHintsUsed((n) => n + 1);
    setHintList((l) => [...l, text]);
  };

  const reset = () => {
    committed.current = false;
    setPlacement(emptyPlacement(def));
    setOrder(shuffle(def.pieces.map((p) => p.id)));
    setSelected(null);
    setEvalResult(null);
    setHintsUsed(0);
    setHintList([]);
    setHintSlot(null);
    setDone(null);
    setJustPlaced(null);
  };

  const filled = Object.values(placement).filter(Boolean).length;
  const placedIds = new Set(Object.values(placement).filter(Boolean) as string[]);
  const trayIds = order.filter((id) => !placedIds.has(id));

  const slotClass = (slotId: string) => {
    const filledHere = !!placement[slotId];
    const parts = ['slot'];
    if (!filledHere) parts.push('slot--empty');
    if (drag?.over === slotId) parts.push('slot--over');
    if (selected && !drag) parts.push('slot--targetable');
    if (justPlaced === slotId) parts.push('slot--placed');
    if (hintSlot === slotId) parts.push('slot--hint');
    if (evalResult) parts.push(evalResult.slotCorrect[slotId] ? 'slot--ok' : 'slot--bad');
    return parts.join(' ');
  };

  const pieceNode = (id: string, dims: { w: number; h: number }, fromSlot: string | null) => {
    const p = pieceMap.get(id)!;
    return (
      <div
        key={id}
        className={`piece ${selected === id ? 'is-selected' : ''} ${drag?.id === id ? 'is-dragging' : ''}`}
        data-piece={id}
        role="button"
        tabIndex={0}
        aria-pressed={selected === id}
        aria-label={`Potongan ${p.text} (${SYMBOL_SHORT[p.type]})`}
        style={{ width: dims.w, height: dims.h }}
        onPointerDown={(e) => startDrag(e, id, fromSlot)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tapPiece(id, fromSlot);
          }
        }}
      >
        <FlowShape type={p.type} w={dims.w} h={dims.h} text={p.text} sub={p.sub} />
      </div>
    );
  };

  const onBack = () => (filled > 0 && !done ? setLeaveOpen(true) : navigate('/level'));
  const dragPiece = drag ? pieceMap.get(drag.id) : null;
  const strict = level === 3 ? 'Target lulus: 120 dari 120 poin (susunan harus sempurna).' : 'Target lulus: 150 dari 150 poin (susunan harus sempurna).';

  return (
    <main className="screen screen--puzzle">
      <PageHeader
        title={`Level ${level}`}
        subtitle={`Menyusun Flowchart (Bagian ${level - 2})`}
        backTo="/level"
        backLabel="Keluar"
        onBack={onBack}
      />

      <div className="screen__inner puzzle-layout">
        <Parchment className="puzzle-info">
          <h2 className="puzzle-title">{def.title}</h2>
          <p>{def.instruction}</p>
          <p className="puzzle-howto">
            <Hand size={16} /> Seret potongan ke slot bernomor, atau ketuk potongan lalu ketuk slot tujuan.
          </p>
          <div className="target-banner target-banner--strict" role="note">
            <Info size={20} />
            <div>
              <strong>{strict}</strong>
              <span>Skor terbaikmu: {rec.bestScore} / {levelDef.maxScore}</span>
            </div>
          </div>
          <div className="puzzle-progress">
            <ProgressBar value={filled} max={def.slots.length} label="Progres menyusun flowchart" />
            <span aria-live="polite">{filled} / {def.slots.length} slot terisi</span>
          </div>
        </Parchment>

        <Parchment className="puzzle-tray-card" aria-labelledby="tray-title">
          <WoodBanner className="wood-banner--sm"><span id="tray-title">Potongan Puzzle</span></WoodBanner>
          <div className="tray" data-tray onClick={(e) => { if (!(e.target as HTMLElement).closest('[data-piece]')) tapTray(); }}>
            {trayIds.length === 0 ? (
              <p className="tray__empty">Semua potongan sudah dipasang. Tekan <strong>Periksa Jawaban</strong>!</p>
            ) : (
              trayIds.map((id) => pieceNode(id, TRAY_DIMS[pieceMap.get(id)!.type], null))
            )}
          </div>
        </Parchment>

        <Parchment className="puzzle-board-card" aria-labelledby="board-title">
          <WoodBanner className="wood-banner--sm"><span id="board-title">Area Menyusun Flowchart</span></WoodBanner>
          <div className="board-wrap" ref={wrapRef} style={{ height: def.height * scale }}>
            <div className="board" style={{ width: def.width, height: def.height, transform: `scale(${scale})` }}>
              <svg className="board__edges" width={def.width} height={def.height} viewBox={`0 0 ${def.width} ${def.height}`} aria-hidden="true">
                <defs>
                  {(['idle', 'ok', 'bad'] as const).map((k) => (
                    <marker key={k} id={`arrow-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M0 0 L10 5 L0 10 z" className={`edge-head edge-head--${k}`} />
                    </marker>
                  ))}
                </defs>
                {def.edges.map((e) => {
                  const st = edgeState(e, evalResult, placement);
                  return (
                    <g key={e.id}>
                      <polyline
                        className={`edge edge--${st}`}
                        points={e.points.map((p) => p.join(',')).join(' ')}
                        fill="none"
                        markerEnd={`url(#arrow-${st})`}
                      />
                      {e.label && e.labelPos && (
                        <g transform={`translate(${e.labelPos[0]} ${e.labelPos[1]})`}>
                          <rect x={e.label === 'YA' ? -17 : -26} y={-11} width={e.label === 'YA' ? 34 : 52} height={22} rx={11} className="edge-label__bg" />
                          <text textAnchor="middle" dominantBaseline="central" className="edge-label__text">{e.label}</text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {def.slots.map((s) => {
                const pid = placement[s.id];
                return (
                  <div
                    key={s.id}
                    className={slotClass(s.id)}
                    data-slot={s.id}
                    style={{ left: s.x, top: s.y, width: s.w, height: s.h }}
                    role={pid ? undefined : 'button'}
                    tabIndex={pid ? undefined : 0}
                    aria-label={pid ? undefined : `Slot nomor ${s.num}${def.showTypeCaptions ? `, ${SYMBOL_SHORT[s.type]}` : ''}, kosong`}
                    onClick={(e) => {
                      if (!(e.target as HTMLElement).closest('[data-piece]')) tapSlot(s.id);
                    }}
                    onKeyDown={(e) => {
                      if (!pid && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        tapSlot(s.id);
                      }
                    }}
                  >
                    {pid ? (
                      pieceNode(pid, { w: s.w, h: s.h }, s.id)
                    ) : (
                      <>
                        <FlowShape type={s.type} w={s.w} h={s.h} ghost />
                        {def.showTypeCaptions && <span className="slot__cap">{SYMBOL_SHORT[s.type]}</span>}
                      </>
                    )}
                    <span className="slot__num" aria-hidden="true">{s.num}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Parchment>

        <Parchment className="puzzle-controls" aria-label="Kontrol puzzle">
          <div className="control-row">
            <GameButton size="lg" icon={<Check size={20} strokeWidth={4} />} onClick={check} disabled={!!done || filled === 0} id="btn-periksa">
              Periksa Jawaban
            </GameButton>
            <GameButton variant="green" icon={<Lightbulb size={18} />} onClick={askHint} disabled={hintsUsed >= 3 || !!done} id="btn-petunjuk">
              Petunjuk ({Math.min(hintsUsed, 3)}/3)
            </GameButton>
            <GameButton variant="wood" icon={<RotateCcw size={18} />} onClick={reset} id="btn-ulangi-puzzle">
              Ulangi Puzzle
            </GameButton>
          </div>

          <div aria-live="polite" className="puzzle-feedback">
            {evalResult && !evalResult.perfect && (
              <div className="feedback feedback--bad" id="puzzle-feedback">
                <strong>
                  Belum tepat, {evalResult.correctSlots} dari {def.slots.length} simbol di tempat yang benar, {evalResult.correctEdges} dari {def.edges.length} alur benar.
                </strong>
                <ul>
                  {evalResult.messages.slice(0, 3).map((m) => <li key={m}>{m}</li>)}
                </ul>
                {evalResult.messages.length > 3 && <p className="small">…dan {evalResult.messages.length - 3} catatan lain. Perbaiki yang di atas dulu!</p>}
                <p className="small">Skor sementara: {evalResult.score} / {evalResult.max}</p>
                <GameButton variant="cream" size="sm" icon={<Save size={16} />} onClick={endAttempt} id="btn-akhiri">
                  Akhiri &amp; simpan skor ini
                </GameButton>
              </div>
            )}
            {hintList.length > 0 && (
              <div className="hint-box">
                <strong><Lightbulb size={16} /> Petunjuk</strong>
                <ol>
                  {hintList.map((h, i) => <li key={i}>{h}</li>)}
                </ol>
              </div>
            )}
          </div>
        </Parchment>
      </div>

      {drag && dragPiece && (
        <div className="drag-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          <FlowShape type={dragPiece.type} w={TRAY_DIMS[dragPiece.type].w} h={TRAY_DIMS[dragPiece.type].h} text={dragPiece.text} sub={dragPiece.sub} />
        </div>
      )}

      <GameDialog id="puzzle-result" open={!!done} onClose={() => undefined} persistent title={done?.res.passed ? 'Puzzle Selesai!' : 'Hasil Percobaan'}>
        {done && (
          <div className="puzzle-result">
            <Avatar mood={done.res.passed ? 'jump' : 'cheer'} animation={done.res.passed ? 'jump' : 'idle'} className="puzzle-result__avatar" />
            <Stars filled={done.res.passed ? (done.ev.perfect ? 3 : 2) : done.ev.score >= done.ev.max / 2 ? 1 : 0} className="stars--lg" />
            <table className="score-table">
              <tbody>
                <tr><th>Penempatan simbol</th><td>{done.ev.correctSlots} / {def.slots.length} × {def.scoring.perSlot}</td><td>{done.ev.correctSlots * def.scoring.perSlot}</td></tr>
                <tr><th>Ketepatan alur</th><td>{done.ev.correctEdges} / {def.edges.length} × {def.scoring.perEdge}</td><td>{done.ev.correctEdges * def.scoring.perEdge}</td></tr>
                <tr><th>Bonus penyelesaian</th><td>{done.ev.perfect ? 'Selesai sempurna' : 'Belum sempurna'}</td><td>{done.ev.perfect ? def.scoring.completion : 0}</td></tr>
                <tr className="score-table__total"><th>Total skor</th><td /><td>{done.ev.score} / {done.ev.max}</td></tr>
              </tbody>
            </table>
            <p className="muted center small">Petunjuk dipakai: {hintsUsed}</p>
            <p className={`result-note ${done.res.passed ? 'is-ok' : 'is-bad'}`} role="status">
              {done.res.passed
                ? 'Flowchart-mu benar! Level ini dinyatakan lulus.'
                : 'Terus berlatih! Selesaikan tantangan ini untuk membuka level berikutnya.'}
            </p>
            <div className="center-actions">
              <GameButton size="lg" iconRight={<ChevronRight size={20} />} onClick={() => navigate(`/selamat/${level}`)} id="btn-ke-perayaan">
                Lanjut
              </GameButton>
              {!done.res.passed && (
                <GameButton variant="cream" icon={<RotateCcw size={18} />} onClick={reset}>
                  Ulangi Puzzle
                </GameButton>
              )}
            </div>
          </div>
        )}
      </GameDialog>

      <GameDialog id="leave-dialog" open={leaveOpen} onClose={() => setLeaveOpen(false)} title="Keluar dari puzzle?">
        <p>Susunan flowchart yang belum diperiksa tidak akan disimpan dan tidak memberi poin.</p>
        <div className="confirm-row">
          <GameButton variant="danger" onClick={() => navigate('/level')} id="btn-keluar-puzzle">Ya, keluar</GameButton>
          <GameButton variant="green" onClick={() => setLeaveOpen(false)}>Lanjut menyusun</GameButton>
        </div>
      </GameDialog>
    </main>
  );
}
