import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AppLayout } from './components/AppLayout';
import { GameProvider, useGame } from './context/GameContext';
import { getLevel, parseLevelId } from './data/levels';
import type { LevelKind } from './data/levels';
import { isLevelUnlocked, lockedReason } from './lib/progress';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import MainboardPage from './pages/MainboardPage';
import MaterialsPage, { MaterialDetailPage } from './pages/MaterialsPage';
import LevelSelectPage from './pages/LevelSelectPage';
import QuizPage from './pages/QuizPage';
import PuzzlePage from './pages/PuzzlePage';
import CelebrationPage from './pages/CelebrationPage';
import AiLearningPage from './pages/AiLearningPage';

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useGame();
  if (!user) return <Navigate to="/masuk" replace />;
  return children;
}

function LevelGate({ kind, children }: { kind: LevelKind; children: ReactNode }) {
  const { progress } = useGame();
  const { level } = useParams();
  const id = parseLevelId(level);
  const def = id ? getLevel(id) : undefined;
  if (!id || !def || def.kind !== kind) {
    return <Navigate to="/level" replace state={{ notice: 'Level tidak ditemukan.' }} />;
  }
  if (!isLevelUnlocked(progress, id)) {
    return (
      <Navigate
        to="/level"
        replace
        state={{ notice: `Level ${id} masih terkunci. ${lockedReason(progress, id)}` }}
      />
    );
  }
  return children;
}

function CelebrationGate({ children }: { children: ReactNode }) {
  const { progress } = useGame();
  const { level } = useParams();
  const id = parseLevelId(level);
  if (!id || progress.lastResult?.level !== id) return <Navigate to="/mainboard" replace />;
  return children;
}

function Home() {
  const { user } = useGame();
  return <Navigate to={user ? '/selamat-datang' : '/masuk'} replace />;
}

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/masuk" element={<LoginPage />} />
            <Route path="/selamat-datang" element={<RequireAuth><WelcomePage /></RequireAuth>} />
            <Route path="/mainboard" element={<RequireAuth><MainboardPage /></RequireAuth>} />
            <Route path="/ai-learning" element={<RequireAuth><AiLearningPage /></RequireAuth>} />
            <Route path="/materi" element={<RequireAuth><MaterialsPage /></RequireAuth>} />
            <Route path="/materi/:id" element={<RequireAuth><MaterialDetailPage /></RequireAuth>} />
            <Route path="/level" element={<RequireAuth><LevelSelectPage /></RequireAuth>} />
            <Route
              path="/kuis/:level"
              element={<RequireAuth><LevelGate kind="kuis"><QuizPage /></LevelGate></RequireAuth>}
            />
            <Route
              path="/puzzle/:level"
              element={<RequireAuth><LevelGate kind="puzzle"><PuzzlePage /></LevelGate></RequireAuth>}
            />
            <Route
              path="/selamat/:level"
              element={<RequireAuth><CelebrationGate><CelebrationPage /></CelebrationGate></RequireAuth>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}
