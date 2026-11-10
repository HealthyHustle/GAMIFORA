export type LevelId = 1 | 2 | 3 | 4;

export interface User {
  name: string;
  email: string;
}

export interface LevelRecord {
  bestScore: number;
  lastScore: number;
  attempts: number;
  passedAt?: string;
}

export interface HistoryEntry {
  id: string;
  level: LevelId;
  score: number;
  max: number;
  passed: boolean;
  gained: number;
  attempt: number;
  at: string;
}

export interface LastResult {
  level: LevelId;
  score: number;
  max: number;
  passed: boolean;
  gained: number;
  totalAfter: number;
  attempt: number;
  at: string;
  newAchievements: string[];
  unlockedLevel: LevelId | null;
}

export interface Progress {
  version: 1;
  levels: Record<LevelId, LevelRecord>;
  history: HistoryEntry[];
  achievements: Record<string, string>;
  materialsRead: number[];
  lastResult: LastResult | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: string;
}

export interface AiLearningRequest {
  user_id: string;
  session_id: string;
  message: string;
}

export interface AiLearningResponse {
  success: boolean;
  reply: string;
}

