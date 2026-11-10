import { LEVELS, LEVEL_IDS, getLevel } from '../data/levels';
import { MATERIALS } from '../data/materials';
import type { HistoryEntry, LastResult, LevelId, LevelRecord, Progress } from '../types';

const emptyRecord = (): LevelRecord => ({ bestScore: 0, lastScore: 0, attempts: 0 });

export function createEmptyProgress(): Progress {
  return {
    version: 1,
    levels: { 1: emptyRecord(), 2: emptyRecord(), 3: emptyRecord(), 4: emptyRecord() },
    history: [],
    achievements: {},
    materialsRead: [],
    lastResult: null,
  };
}

export function sanitizeProgress(raw: unknown): Progress {
  const base = createEmptyProgress();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<Progress>;
  for (const id of LEVEL_IDS) {
    const def = getLevel(id)!;
    const rec = r.levels?.[id];
    if (rec && typeof rec === 'object') {
      const best = Number(rec.bestScore);
      const last = Number(rec.lastScore);
      const attempts = Number(rec.attempts);
      base.levels[id] = {
        bestScore: Number.isFinite(best) ? Math.min(def.maxScore, Math.max(0, Math.round(best))) : 0,
        lastScore: Number.isFinite(last) ? Math.min(def.maxScore, Math.max(0, Math.round(last))) : 0,
        attempts: Number.isFinite(attempts) ? Math.max(0, Math.floor(attempts)) : 0,
        passedAt: typeof rec.passedAt === 'string' ? rec.passedAt : undefined,
      };
    }
  }
  if (Array.isArray(r.history)) base.history = (r.history as HistoryEntry[]).filter((h) => h && getLevel(h.level)).slice(-100);
  if (r.achievements && typeof r.achievements === 'object') base.achievements = { ...r.achievements };
  if (Array.isArray(r.materialsRead)) {
    base.materialsRead = [...new Set(r.materialsRead.filter((n) => MATERIALS.some((m) => m.id === n)))];
  }
  base.lastResult = r.lastResult && getLevel(r.lastResult.level) ? (r.lastResult as LastResult) : null;
  return base;
}

export function totalPoints(p: Progress): number {
  return LEVEL_IDS.reduce((sum, id) => sum + p.levels[id].bestScore, 0);
}

export function isLevelPassed(p: Progress, id: LevelId): boolean {
  return p.levels[id].bestScore >= getLevel(id)!.target;
}

export function isLevelUnlocked(p: Progress, id: LevelId): boolean {
  for (const prev of LEVEL_IDS) {
    if (prev >= id) break;
    if (!isLevelPassed(p, prev)) return false;
  }
  return true;
}

export function passedCount(p: Progress): number {
  return LEVEL_IDS.filter((id) => isLevelPassed(p, id)).length;
}

export function allLevelsPassed(p: Progress): boolean {
  return passedCount(p) === LEVEL_IDS.length;
}

export function currentLevel(p: Progress): LevelId | null {
  return LEVEL_IDS.find((id) => !isLevelPassed(p, id)) ?? null;
}

export function pointsNeeded(p: Progress, id: LevelId): number {
  return Math.max(0, getLevel(id)!.target - p.levels[id].bestScore);
}

export type LevelStatus = 'locked' | 'open' | 'passed';

export function levelStatus(p: Progress, id: LevelId): LevelStatus {
  if (isLevelPassed(p, id)) return 'passed';
  return isLevelUnlocked(p, id) ? 'open' : 'locked';
}

export function lockedReason(p: Progress, id: LevelId): string {
  const prev = LEVEL_IDS.find((k) => !isLevelPassed(p, k) && k < id);
  if (!prev) return '';
  const need = pointsNeeded(p, prev);
  if (p.levels[prev].attempts === 0) return `Selesaikan Level ${prev} lebih dulu (target ${getLevel(prev)!.target} poin).`;
  return `Butuh ${need} poin lagi di Level ${prev} untuk membuka Level ${id}.`;
}

export interface NextPanel {
  focus: LevelId | null;
  next: LevelId | null;
  nextUnlocked: boolean;
  remaining: number;
  allDone: boolean;
}

export function nextPanel(p: Progress): NextPanel {
  const cur = currentLevel(p);
  if (cur === null) return { focus: null, next: null, nextUnlocked: false, remaining: 0, allDone: true };
  if (cur === 1 || p.levels[cur].attempts > 0) {
    const next = cur < 4 ? ((cur + 1) as LevelId) : null;
    return { focus: cur, next, nextUnlocked: false, remaining: pointsNeeded(p, cur), allDone: false };
  }
  return { focus: (cur - 1) as LevelId, next: cur, nextUnlocked: true, remaining: 0, allDone: false };
}

export function markMaterialRead(p: Progress, materialId: number): Progress {
  if (p.materialsRead.includes(materialId)) return p;
  return { ...p, materialsRead: [...p.materialsRead, materialId] };
}

export interface SubmitExtra {
  hintsUsed?: number;
}

export class LevelLockedError extends Error {
  level: LevelId;
  constructor(level: LevelId) {
    super(`Level ${level} masih terkunci.`);
    this.level = level;
  }
}

export function applyResult(
  p: Progress,
  level: LevelId,
  rawScore: number,
  extra: SubmitExtra = {},
  now: Date = new Date(),
): { progress: Progress; result: LastResult } {
  if (!isLevelUnlocked(p, level)) throw new LevelLockedError(level);
  const def = getLevel(level)!;
  const score = Math.min(def.maxScore, Math.max(0, Math.round(rawScore)));
  const prev = p.levels[level];
  const wasUnlockedBefore = LEVEL_IDS.map((id) => isLevelUnlocked(p, id));
  const at = now.toISOString();
  const newBest = Math.max(prev.bestScore, score);
  const gained = newBest - prev.bestScore;
  const passedNow = newBest >= def.target;

  const record: LevelRecord = {
    bestScore: newBest,
    lastScore: score,
    attempts: prev.attempts + 1,
    passedAt: prev.passedAt ?? (passedNow ? at : undefined),
  };

  const entry: HistoryEntry = {
    id: `${at}-${level}`,
    level,
    score,
    max: def.maxScore,
    passed: score >= def.target,
    gained,
    attempt: record.attempts,
    at,
  };

  let next: Progress = {
    ...p,
    levels: { ...p.levels, [level]: record },
    history: [...p.history, entry].slice(-100),
  };

  const earned = new Set(Object.keys(next.achievements));
  const newOnes: string[] = [];
  const grant = (id: string, cond: boolean) => {
    if (cond && !earned.has(id)) {
      earned.add(id);
      newOnes.push(id);
    }
  };
  grant('first_try', true);
  grant(`lvl${level}`, passedNow);
  grant('perfect', score === def.maxScore);
  grant('no_hint', def.kind === 'puzzle' && score === def.maxScore && (extra.hintsUsed ?? 0) === 0);
  grant('bookworm', next.materialsRead.length >= MATERIALS.length);
  grant('champion', allLevelsPassed(next));
  const achievements = { ...next.achievements };
  for (const id of newOnes) achievements[id] = at;
  next = { ...next, achievements };

  const unlockedLevel =
    LEVEL_IDS.find((id) => !wasUnlockedBefore[id - 1] && isLevelUnlocked(next, id)) ?? null;

  const result: LastResult = {
    level,
    score,
    max: def.maxScore,
    passed: score >= def.target,
    gained,
    totalAfter: totalPoints(next),
    attempt: record.attempts,
    at,
    newAchievements: newOnes,
    unlockedLevel,
  };
  next = { ...next, lastResult: result };
  return { progress: next, result };
}

export function syncReadingAchievement(p: Progress, now: Date = new Date()): Progress {
  if (p.materialsRead.length >= MATERIALS.length && !p.achievements.bookworm) {
    return { ...p, achievements: { ...p.achievements, bookworm: now.toISOString() } };
  }
  return p;
}

export const TOTAL_LEVELS = LEVELS.length;
