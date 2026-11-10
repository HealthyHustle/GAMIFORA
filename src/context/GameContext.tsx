import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { loginOrRegister } from '../lib/auth';
import type { LoginInput, LoginResult } from '../lib/auth';
import { applyResult, markMaterialRead, syncReadingAchievement } from '../lib/progress';
import type { SubmitExtra } from '../lib/progress';
import { clearSession, loadProgress, loadSession, resetProgress, saveProgress } from '../lib/storage';
import type { LastResult, LevelId, Progress, User } from '../types';
import { createEmptyProgress } from '../lib/progress';

interface GameContextValue {
  user: User | null;
  progress: Progress;
  login: (input: LoginInput) => Promise<LoginResult>;
  logout: () => void;
  readMaterial: (id: number) => void;
  submitResult: (level: LevelId, score: number, extra?: SubmitExtra) => LastResult;
  restartAll: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadSession());
  const [progress, setProgress] = useState<Progress>(() => {
    const u = loadSession();
    return u ? loadProgress(u.email) : createEmptyProgress();
  });
  const progressRef = useRef(progress);
  const userRef = useRef(user);

  const commit = useCallback((next: Progress) => {
    progressRef.current = next;
    if (userRef.current) saveProgress(userRef.current.email, next);
    setProgress(next);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const res = await loginOrRegister(input);
    if (res.ok) {
      userRef.current = res.user;
      setUser(res.user);
      const p = loadProgress(res.user.email);
      progressRef.current = p;
      setProgress(p);
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    userRef.current = null;
    setUser(null);
    const empty = createEmptyProgress();
    progressRef.current = empty;
    setProgress(empty);
  }, []);

  const readMaterial = useCallback(
    (id: number) => {
      const next = syncReadingAchievement(markMaterialRead(progressRef.current, id));
      if (next !== progressRef.current) commit(next);
    },
    [commit],
  );

  const submitResult = useCallback(
    (level: LevelId, score: number, extra?: SubmitExtra) => {
      const { progress: next, result } = applyResult(progressRef.current, level, score, extra);
      commit(next);
      return result;
    },
    [commit],
  );

  const restartAll = useCallback(() => {
    if (!userRef.current) return;
    const fresh = resetProgress(userRef.current.email);
    progressRef.current = fresh;
    setProgress(fresh);
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({ user, progress, login, logout, readMaterial, submitResult, restartAll }),
    [user, progress, login, logout, readMaterial, submitResult, restartAll],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame harus dipakai di dalam GameProvider');
  return ctx;
}
