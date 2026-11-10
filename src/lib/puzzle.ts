import type { PuzzleDef, PuzzleSlot } from '../data/puzzles';
import { SYMBOL_SHORT } from '../data/puzzles';

export type Placement = Record<string, string | null>;

export interface PuzzleEvaluation {
  slotCorrect: Record<string, boolean>;
  edgeCorrect: Record<string, boolean>;
  filled: number;
  correctSlots: number;
  correctEdges: number;
  score: number;
  max: number;
  perfect: boolean;
  messages: string[];
}

export function emptyPlacement(def: PuzzleDef): Placement {
  return Object.fromEntries(def.slots.map((s) => [s.id, null]));
}

export function maxScore(def: PuzzleDef): number {
  const { perSlot, perEdge, completion } = def.scoring;
  return def.slots.length * perSlot + def.edges.length * perEdge + completion;
}

function pieceText(def: PuzzleDef, id: string): string {
  return def.pieces.find((p) => p.id === id)?.text ?? id;
}

export function evaluatePuzzle(def: PuzzleDef, placement: Placement): PuzzleEvaluation {
  const slotCorrect: Record<string, boolean> = {};
  const edgeCorrect: Record<string, boolean> = {};
  let filled = 0;
  let correctSlots = 0;

  for (const s of def.slots) {
    const placed = placement[s.id];
    if (placed) filled++;
    const ok = placed === s.answer;
    slotCorrect[s.id] = ok;
    if (ok) correctSlots++;
  }

  const solutionKey = new Set(def.solution.map((e) => `${e.from}>${e.to}>${e.label ?? ''}`));
  let correctEdges = 0;
  for (const e of def.edges) {
    const a = placement[e.from];
    const b = placement[e.to];
    const ok = !!a && !!b && solutionKey.has(`${a}>${b}>${e.label ?? ''}`);
    edgeCorrect[e.id] = ok;
    if (ok) correctEdges++;
  }

  const perfect = correctSlots === def.slots.length && correctEdges === def.edges.length;
  const { perSlot, perEdge, completion } = def.scoring;
  const score = correctSlots * perSlot + correctEdges * perEdge + (perfect ? completion : 0);

  return {
    slotCorrect,
    edgeCorrect,
    filled,
    correctSlots,
    correctEdges,
    score,
    max: maxScore(def),
    perfect,
    messages: perfect ? [] : buildMessages(def, placement, slotCorrect),
  };
}

function describeSlot(def: PuzzleDef, s: PuzzleSlot, placement: Placement): string | null {
  const placed = placement[s.id];
  if (!placed) return `Slot nomor ${s.num} masih kosong.`;
  if (placed === s.answer) return null;
  const piece = def.pieces.find((p) => p.id === placed);
  if (piece && piece.type !== s.type) {
    return `Slot nomor ${s.num}: potongan "${piece.text}" berbentuk ${SYMBOL_SHORT[piece.type]}, sedangkan slot ini membutuhkan simbol ${SYMBOL_SHORT[s.type]}.`;
  }
  return `Slot nomor ${s.num}: ${s.wrong}`;
}

function buildMessages(def: PuzzleDef, placement: Placement, slotCorrect: Record<string, boolean>): string[] {
  const out: string[] = [];

  const branches = def.slots.filter((s) => s.branch);
  const yes = branches.find((s) => s.branch === 'YA');
  const no = branches.find((s) => s.branch === 'TIDAK');
  if (yes && no && placement[yes.id] === no.answer && placement[no.id] === yes.answer) {
    out.push(
      `Jalur YA dan TIDAK tampak tertukar: "${pieceText(def, yes.answer)}" dan "${pieceText(def, no.answer)}" harus ada di jalur sebaliknya. Cek kembali kondisi pada simbol keputusan.`,
    );
  } else {
    for (const s of def.slots) {
      if (slotCorrect[s.id]) continue;
      const msg = describeSlot(def, s, placement);
      if (msg) out.push(msg);
    }
  }
  return out;
}

export function firstProblemSlot(def: PuzzleDef, placement: Placement): PuzzleSlot | null {
  return def.slots.find((s) => placement[s.id] !== s.answer) ?? null;
}
