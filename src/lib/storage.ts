import { createEmptyProgress, sanitizeProgress } from './progress';
import type { Progress, User } from '../types';

const NS = 'gamifora:v1';
const KEY_USERS = `${NS}:users`;
const KEY_SESSION = `${NS}:session`;
const keyProgress = (email: string) => `${NS}:progress:${email}`;

function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export interface UserRecord {
  name: string;
  email: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
}

export function loadUsers(): Record<string, UserRecord> {
  return read<Record<string, UserRecord>>(KEY_USERS) ?? {};
}

export function saveUser(record: UserRecord): void {
  const users = loadUsers();
  users[record.email] = record;
  write(KEY_USERS, users);
}

export function loadSession(): User | null {
  const email = read<string>(KEY_SESSION);
  if (!email) return null;
  const rec = loadUsers()[email];
  return rec ? { name: rec.name, email: rec.email } : null;
}

export function saveSession(email: string): void {
  write(KEY_SESSION, email);
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(KEY_SESSION);
  } catch {
  }
}

export function loadProgress(email: string): Progress {
  const raw = read<unknown>(keyProgress(email));
  return raw ? sanitizeProgress(raw) : createEmptyProgress();
}

export function saveProgress(email: string, progress: Progress): void {
  write(keyProgress(email), progress);
}

export function resetProgress(email: string): Progress {
  const fresh = createEmptyProgress();
  saveProgress(email, fresh);
  return fresh;
}
