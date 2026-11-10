import type { LevelId } from '../types';

export type LevelKind = 'kuis' | 'puzzle';

export interface LevelDef {
  id: LevelId;
  title: string;
  subject: string;
  kind: LevelKind;
  kindLabel: string;
  target: number;
  maxScore: number;
  description: string;
}

export const LEVELS: readonly LevelDef[] = [
  {
    id: 1,
    title: 'Penjelajah Informatika',
    subject: 'Dasar-Dasar Informatika',
    kind: 'kuis',
    kindLabel: 'Pilihan ganda',
    target: 80,
    maxScore: 100,
    description: '10 soal pilihan ganda tentang dasar informatika, perangkat, dan algoritma.',
  },
  {
    id: 2,
    title: 'Ahli Digital',
    subject: 'Perangkat Komputer, Internet, dan Keamanan Digital',
    kind: 'kuis',
    kindLabel: 'Pilihan ganda',
    target: 100,
    maxScore: 100,
    description: '10 soal pilihan ganda tentang perangkat, internet, dan keamanan digital.',
  },
  {
    id: 3,
    title: 'Perancang Logika',
    subject: 'Algoritma dan Flowchart',
    kind: 'puzzle',
    kindLabel: 'Puzzle flowchart (bagian 1)',
    target: 120,
    maxScore: 120,
    description: 'Susun flowchart untuk menentukan bilangan genap atau ganjil.',
  },
  {
    id: 4,
    title: 'Master Flowchart',
    subject: 'Logika, Percabangan, dan Algoritma',
    kind: 'puzzle',
    kindLabel: 'Puzzle flowchart (bagian 2)',
    target: 150,
    maxScore: 150,
    description: 'Susun flowchart untuk menghitung rata-rata nilai dan menentukan kelulusan.',
  },
] as const;

export const LEVEL_IDS: readonly LevelId[] = [1, 2, 3, 4];

export function getLevel(id: number): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function parseLevelId(raw: string | undefined): LevelId | null {
  const n = Number(raw);
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}

export const TOTAL_MAX_XP = LEVELS.reduce((sum, l) => sum + l.maxScore, 0);

export function levelPath(id: LevelId): string {
  const def = getLevel(id)!;
  return def.kind === 'kuis' ? `/kuis/${id}` : `/puzzle/${id}`;
}
