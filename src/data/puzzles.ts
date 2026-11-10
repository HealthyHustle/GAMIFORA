export type SymbolType = 'terminator' | 'io' | 'process' | 'decision';
export type BranchLabel = 'YA' | 'TIDAK';

export const SYMBOL_NAMES: Record<SymbolType, string> = {
  terminator: 'Terminator (oval)',
  io: 'Input/Output (jajar genjang)',
  process: 'Proses (persegi panjang)',
  decision: 'Keputusan (belah ketupat)',
};

export const SYMBOL_SHORT: Record<SymbolType, string> = {
  terminator: 'Terminator',
  io: 'Input/Output',
  process: 'Proses',
  decision: 'Keputusan',
};

export interface PuzzlePiece {
  id: string;
  type: SymbolType;
  text: string;
  sub?: string;
}

export interface PuzzleSlot {
  id: string;
  num: number;
  x: number;
  y: number;
  w: number;
  h: number;
  type: SymbolType;
  answer: string;
  wrong: string;
  branch?: BranchLabel;
}

export interface PuzzleEdge {
  id: string;
  from: string;
  to: string;
  label?: BranchLabel;
  points: [number, number][];
  labelPos?: [number, number];
}

export interface SolutionEdge {
  from: string;
  to: string;
  label?: BranchLabel;
}

export interface PuzzleDef {
  level: 3 | 4;
  title: string;
  instruction: string;
  width: number;
  height: number;
  pieces: PuzzlePiece[];
  slots: PuzzleSlot[];
  edges: PuzzleEdge[];
  solution: SolutionEdge[];
  scoring: { perSlot: number; perEdge: number; completion: number };
  hints: [string, string];
  showTypeCaptions: boolean;
}

const WIDTH = 420;

const L3_PIECES: PuzzlePiece[] = [
  { id: 'start', type: 'terminator', text: 'Mulai' },
  { id: 'input', type: 'io', text: 'Masukkan bilangan' },
  { id: 'check', type: 'decision', text: 'Periksa: bilangan mod 2 = 0 ?' },
  { id: 'even', type: 'io', text: 'Tampilkan "Bilangan Genap"' },
  { id: 'odd', type: 'io', text: 'Tampilkan "Bilangan Ganjil"' },
  { id: 'end', type: 'terminator', text: 'Selesai' },
];

const L3_SLOTS: PuzzleSlot[] = [
  {
    id: 's1', num: 1, x: 135, y: 8, w: 150, h: 44, type: 'terminator', answer: 'start',
    wrong: 'Setiap flowchart berawal dari satu simbol terminator. Pikirkan potongan mana yang menandai awal program.',
  },
  {
    id: 's2', num: 2, x: 115, y: 78, w: 190, h: 50, type: 'io', answer: 'input',
    wrong: 'Sebelum bilangan dapat diperiksa, program perlu menerima datanya lebih dulu.',
  },
  {
    id: 's3', num: 3, x: 100, y: 152, w: 220, h: 106, type: 'decision', answer: 'check',
    wrong: 'Titik percabangan memerlukan sebuah pertanyaan yang jawabannya YA atau TIDAK.',
  },
  {
    id: 's4', num: 4, x: 10, y: 318, w: 180, h: 58, type: 'io', answer: 'even', branch: 'YA',
    wrong: 'Jalur YA dijalankan ketika kondisi terpenuhi (sisa bagi 2 sama dengan 0). Hasil apa yang cocok untuk kondisi itu?',
  },
  {
    id: 's5', num: 5, x: 230, y: 318, w: 180, h: 58, type: 'io', answer: 'odd', branch: 'TIDAK',
    wrong: 'Jalur TIDAK dijalankan ketika kondisi tidak terpenuhi. Periksa kembali hasil yang kamu letakkan di sini.',
  },
  {
    id: 's6', num: 6, x: 135, y: 420, w: 150, h: 44, type: 'terminator', answer: 'end',
    wrong: 'Kedua jalur harus bertemu di akhir program. Simbol penutup apa yang cocok?',
  },
];

const L3_EDGES: PuzzleEdge[] = [
  { id: 'e1', from: 's1', to: 's2', points: [[210, 52], [210, 78]] },
  { id: 'e2', from: 's2', to: 's3', points: [[210, 128], [210, 152]] },
  { id: 'e3', from: 's3', to: 's4', label: 'YA', points: [[100, 205], [100, 318]], labelPos: [74, 270] },
  { id: 'e4', from: 's3', to: 's5', label: 'TIDAK', points: [[320, 205], [320, 318]], labelPos: [352, 270] },
  { id: 'e5', from: 's4', to: 's6', points: [[100, 376], [100, 398], [210, 398], [210, 420]] },
  { id: 'e6', from: 's5', to: 's6', points: [[320, 376], [320, 398], [210, 398], [210, 420]] },
];

export const PUZZLE_LEVEL_3: PuzzleDef = {
  level: 3,
  title: 'Menentukan Bilangan Genap atau Ganjil',
  instruction:
    'Susun potongan flowchart berikut agar program dapat menentukan apakah sebuah bilangan termasuk genap atau ganjil.',
  width: WIDTH,
  height: 474,
  pieces: L3_PIECES,
  slots: L3_SLOTS,
  edges: L3_EDGES,
  solution: [
    { from: 'start', to: 'input' },
    { from: 'input', to: 'check' },
    { from: 'check', to: 'even', label: 'YA' },
    { from: 'check', to: 'odd', label: 'TIDAK' },
    { from: 'even', to: 'end' },
    { from: 'odd', to: 'end' },
  ],
  scoring: { perSlot: 10, perEdge: 5, completion: 30 },
  hints: [
    'Ingat pola algoritma: Input → Proses/Keputusan → Output. Flowchart selalu dimulai dengan "Mulai" dan ditutup dengan "Selesai".',
    'Belah ketupat menghasilkan dua jalur. Bilangan genap jika sisa bagi 2 sama dengan 0. Jalur manakah (YA atau TIDAK) yang cocok untuk kondisi tersebut?',
  ],
  showTypeCaptions: true,
};

const L4_PIECES: PuzzlePiece[] = [
  { id: 'start', type: 'terminator', text: 'Mulai' },
  { id: 'input', type: 'io', text: 'Masukkan nilai 1, nilai 2, dan nilai 3' },
  { id: 'calc', type: 'process', text: 'Hitung rata-rata', sub: '= (nilai 1 + nilai 2 + nilai 3) / 3' },
  { id: 'check', type: 'decision', text: 'Periksa: rata-rata ≥ 75 ?' },
  { id: 'pass', type: 'io', text: 'Tampilkan "Lulus"' },
  { id: 'fail', type: 'io', text: 'Tampilkan "Belum Lulus"' },
  { id: 'end', type: 'terminator', text: 'Selesai' },
];

const L4_SLOTS: PuzzleSlot[] = [
  {
    id: 's1', num: 1, x: 135, y: 8, w: 150, h: 44, type: 'terminator', answer: 'start',
    wrong: 'Alur harus dimulai dari simbol yang menandai awal program.',
  },
  {
    id: 's2', num: 2, x: 105, y: 76, w: 210, h: 54, type: 'io', answer: 'input',
    wrong: 'Program perlu menerima ketiga nilai sebelum dapat menghitung apa pun.',
  },
  {
    id: 's3', num: 3, x: 105, y: 154, w: 210, h: 54, type: 'process', answer: 'calc',
    wrong: 'Setelah data masuk, lakukan perhitungan terlebih dahulu sebelum memeriksa kondisi.',
  },
  {
    id: 's4', num: 4, x: 100, y: 232, w: 220, h: 106, type: 'decision', answer: 'check',
    wrong: 'Hasil perhitungan harus diperiksa dengan sebuah pertanyaan yang jawabannya YA atau TIDAK.',
  },
  {
    id: 's5', num: 5, x: 10, y: 398, w: 180, h: 58, type: 'io', answer: 'pass', branch: 'YA',
    wrong: 'Jalur YA dijalankan ketika rata-rata memenuhi syarat minimal. Hasil apa yang cocok?',
  },
  {
    id: 's6', num: 6, x: 230, y: 398, w: 180, h: 58, type: 'io', answer: 'fail', branch: 'TIDAK',
    wrong: 'Jalur TIDAK dijalankan ketika rata-rata belum memenuhi syarat. Periksa kembali hasil di jalur ini.',
  },
  {
    id: 's7', num: 7, x: 135, y: 500, w: 150, h: 44, type: 'terminator', answer: 'end',
    wrong: 'Kedua jalur harus bertemu di akhir program. Simbol penutup apa yang cocok?',
  },
];

const L4_EDGES: PuzzleEdge[] = [
  { id: 'e1', from: 's1', to: 's2', points: [[210, 52], [210, 76]] },
  { id: 'e2', from: 's2', to: 's3', points: [[210, 130], [210, 154]] },
  { id: 'e3', from: 's3', to: 's4', points: [[210, 208], [210, 232]] },
  { id: 'e4', from: 's4', to: 's5', label: 'YA', points: [[100, 285], [100, 398]], labelPos: [74, 346] },
  { id: 'e5', from: 's4', to: 's6', label: 'TIDAK', points: [[320, 285], [320, 398]], labelPos: [352, 346] },
  { id: 'e6', from: 's5', to: 's7', points: [[100, 456], [100, 478], [210, 478], [210, 500]] },
  { id: 'e7', from: 's6', to: 's7', points: [[320, 456], [320, 478], [210, 478], [210, 500]] },
];

export const PUZZLE_LEVEL_4: PuzzleDef = {
  level: 4,
  title: 'Menghitung Rata-Rata Nilai',
  instruction: 'Susun flowchart untuk menghitung rata-rata tiga nilai dan menentukan apakah siswa lulus.',
  width: WIDTH,
  height: 550,
  pieces: L4_PIECES,
  slots: L4_SLOTS,
  edges: L4_EDGES,
  solution: [
    { from: 'start', to: 'input' },
    { from: 'input', to: 'calc' },
    { from: 'calc', to: 'check' },
    { from: 'check', to: 'pass', label: 'YA' },
    { from: 'check', to: 'fail', label: 'TIDAK' },
    { from: 'pass', to: 'end' },
    { from: 'fail', to: 'end' },
  ],
  scoring: { perSlot: 10, perEdge: 10, completion: 10 },
  hints: [
    'Urutan dasarnya: Mulai → Input → Proses → Keputusan → Output → Selesai. Rata-rata harus dihitung sebelum diperiksa.',
    'Syarat kelulusan adalah rata-rata minimal 75. Jalur YA dijalankan saat syarat terpenuhi, jalur TIDAK saat belum terpenuhi.',
  ],
  showTypeCaptions: false,
};

export const PUZZLES: Record<3 | 4, PuzzleDef> = {
  3: PUZZLE_LEVEL_3,
  4: PUZZLE_LEVEL_4,
};

export function puzzleMaxScore(def: PuzzleDef): number {
  const { perSlot, perEdge, completion } = def.scoring;
  return def.slots.length * perSlot + def.edges.length * perEdge + completion;
}
