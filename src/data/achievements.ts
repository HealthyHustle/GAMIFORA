export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  { id: 'first_try', title: 'Langkah Pertama', description: 'Menyelesaikan satu tantangan pertama.', emoji: '👣' },
  { id: 'bookworm', title: 'Kutu Buku Hutan', description: 'Membaca keenam materi pembelajaran.', emoji: '📚' },
  { id: 'lvl1', title: 'Penjelajah Informatika', description: 'Lulus Level 1.', emoji: '🧭' },
  { id: 'lvl2', title: 'Ahli Digital', description: 'Lulus Level 2.', emoji: '🛡️' },
  { id: 'lvl3', title: 'Perancang Logika', description: 'Lulus Level 3.', emoji: '🧩' },
  { id: 'lvl4', title: 'Master Flowchart', description: 'Lulus Level 4.', emoji: '🏆' },
  { id: 'perfect', title: 'Skor Sempurna', description: 'Meraih skor maksimum pada sebuah level.', emoji: '🌟' },
  { id: 'no_hint', title: 'Mandiri', description: 'Menyelesaikan puzzle sempurna tanpa petunjuk.', emoji: '💪' },
  { id: 'champion', title: 'Penakluk GAMIFORA', description: 'Menaklukkan seluruh tantangan.', emoji: '👑' },
];

export function getAchievement(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
