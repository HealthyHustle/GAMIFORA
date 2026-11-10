import { loadUsers, saveSession, saveUser } from './storage';
import type { UserRecord } from './storage';
import type { User } from '../types';

export interface LoginInput {
  name: string;
  email: string;
  password: string;
}

export type FieldErrors = Partial<Record<keyof LoginInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateLogin(input: LoginInput): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.name.trim();
  if (!name) errors.name = 'Nama lengkap wajib diisi.';
  else if (name.length < 2) errors.name = 'Nama lengkap minimal 2 karakter.';
  else if (name.length > 40) errors.name = 'Nama lengkap maksimal 40 karakter.';

  const email = input.email.trim();
  if (!email) errors.email = 'Email wajib diisi.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Format email tidak valid. Contoh: nama@email.com';

  if (!input.password) errors.password = 'Password wajib diisi.';
  else if (input.password.length < 6) errors.password = 'Password minimal 6 karakter.';
  return errors;
}

function randomSalt(): string {
  const bytes = new Uint8Array(12);
  if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  if (window.crypto?.subtle) {
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 5381;
  for (const b of data) h = ((h << 5) + h + b) >>> 0;
  return `fallback-${h.toString(16)}`;
}

export type LoginResult =
  | { ok: true; user: User; isNew: boolean }
  | { ok: false; errors: FieldErrors; message: string };

export async function loginOrRegister(input: LoginInput): Promise<LoginResult> {
  const errors = validateLogin(input);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, message: 'Data belum lengkap atau belum valid. Periksa kolom yang ditandai.' };
  }
  const email = normalizeEmail(input.email);
  const name = input.name.trim().replace(/\s+/g, ' ');
  const existing = loadUsers()[email];

  if (existing) {
    const hash = await hashPassword(input.password, existing.salt);
    if (hash !== existing.passwordHash) {
      return {
        ok: false,
        errors: { password: 'Password tidak cocok dengan akun ini.' },
        message: 'Password salah untuk email tersebut.',
      };
    }
    const updated: UserRecord = { ...existing, name };
    saveUser(updated);
    saveSession(email);
    return { ok: true, user: { name, email }, isNew: false };
  }

  const salt = randomSalt();
  const record: UserRecord = {
    name,
    email,
    salt,
    passwordHash: await hashPassword(input.password, salt),
    createdAt: new Date().toISOString(),
  };
  saveUser(record);
  saveSession(email);
  return { ok: true, user: { name, email }, isNew: true };
}
