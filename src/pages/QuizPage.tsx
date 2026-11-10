import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronRight, Info, Play, RotateCcw, Star, X } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { GameButton } from '../components/GameButton';
import { GameDialog } from '../components/GameDialog';
import { PageHeader } from '../components/PageHeader';
import { Parchment, ProgressBar, Stars, WoodBanner } from '../components/Panels';
import { useGame } from '../context/GameContext';
import { QUIZZES, QUIZ_RULES, POINTS_PER_QUESTION } from '../data/quizzes';
import type { OptionKey, QuizQuestion } from '../data/quizzes';
import { getLevel, parseLevelId } from '../data/levels';
import { shuffle } from '../lib/shuffle';
import type { LastResult } from '../types';

interface ShownOption {
  key: OptionKey;
  text: string;
}

interface Attempt {
  q: QuizQuestion;
  options: ShownOption[];
}

const LETTERS = ['A', 'B', 'C', 'D'] as const;

function buildAttempt(level: 1 | 2): Attempt[] {
  return shuffle(QUIZZES[level]).map((q) => ({
    q,
    options: shuffle(q.options.map((o) => ({ key: o.key, text: o.text }))),
  }));
}

type Phase = 'intro' | 'play' | 'result';

export default function QuizPage() {
  const { level: param } = useParams();
  const level = parseLevelId(param) as 1 | 2;
  const def = getLevel(level)!;
  const navigate = useNavigate();
  const { progress, submitResult } = useGame();

  const [phase, setPhase] = useState<Phase>('intro');
  const [attempt, setAttempt] = useState<Attempt[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [result, setResult] = useState<LastResult | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const committed = useRef(false);

  const rec = progress.levels[level];
  const total = attempt.length;
  const current = attempt[index];
  const answeredKey = current ? answers[current.q.id] : undefined;
  const isAnswered = answeredKey !== undefined;
  const correctCount = attempt.filter((a) => answers[a.q.id] === a.q.answer).length;
  const livePoints = correctCount * POINTS_PER_QUESTION;
  const isCorrect = isAnswered && answeredKey === current.q.answer;

  const start = () => {
    committed.current = false;
    setAttempt(buildAttempt(level));
    setAnswers({});
    setIndex(0);
    setResult(null);
    setPhase('play');
  };

  const choose = (key: OptionKey) => {
    if (!current || isAnswered) return;
    setAnswers((prev) => (prev[current.q.id] ? prev : { ...prev, [current.q.id]: key }));
  };

  const next = () => {
    if (!isAnswered) return;
    if (index < total - 1) {
      setIndex((i) => i + 1);
      return;
    }
    if (committed.current) return;
    committed.current = true;
    const res = submitResult(level, livePoints);
    setResult(res);
    setPhase('result');
  };

  const onBack = () => {
    if (phase === 'play') setLeaveOpen(true);
    else navigate('/level');
  };

  if (phase === 'intro') {
    return (
      <main className="screen">
        <PageHeader title={`Level ${level}`} subtitle={def.subject} backTo="/level" backLabel="Pilih Level" />
        <div className="screen__inner screen__inner--narrow">
          <Parchment className="quiz-intro">
            <WoodBanner>Level {level}: {def.title}</WoodBanner>
            <ul className="rule-list">
              <li><Check size={18} strokeWidth={4} /> 10 soal pilihan ganda, setiap soal punya 4 pilihan.</li>
              <li><Check size={18} strokeWidth={4} /> Setiap jawaban benar bernilai {POINTS_PER_QUESTION} poin (maksimum 100).</li>
              <li><Check size={18} strokeWidth={4} /> Urutan soal dan pilihan jawaban diacak setiap percobaan.</li>
              <li><Check size={18} strokeWidth={4} /> Setiap soal hanya dapat dijawab sekali per percobaan; kamu boleh mengulang level.</li>
            </ul>
            <div className={`target-banner ${level === 2 ? 'target-banner--strict' : ''}`} role="note">
              <Info size={22} />
              <div>
                <strong>Syarat lulus: {def.target} dari {def.maxScore} poin</strong>
                <span>{QUIZ_RULES[level]}</span>
              </div>
            </div>
            <p className="muted center">
              Skor terbaikmu: <strong>{rec.bestScore}</strong> / {def.maxScore} · Percobaan: {rec.attempts}
            </p>
            <div className="center-actions">
              <GameButton size="lg" icon={<Play size={20} fill="currentColor" />} onClick={start} id="btn-start-quiz">
                {rec.attempts > 0 ? 'Mulai Percobaan Baru' : 'Mulai Kuis'}
              </GameButton>
              <GameButton variant="wood" onClick={() => navigate('/materi')} id="btn-baca-materi">
                Baca Materi
              </GameButton>
            </div>
          </Parchment>
        </div>
      </main>
    );
  }

  if (phase === 'result' && result) {
    const stars = result.passed ? (result.score === result.max ? 3 : 2) : result.score >= result.max / 2 ? 1 : 0;
    return (
      <main className="screen">
        <PageHeader title={`Hasil Level ${level}`} subtitle={def.title} backTo="/mainboard" backLabel="Mainboard" />
        <div className="screen__inner screen__inner--narrow">
          <Parchment className="quiz-result">
            <WoodBanner>{result.passed ? 'Level Lulus!' : 'Belum Lulus'}</WoodBanner>
            <Stars filled={stars} className="stars--lg" />
            <p className="result-score">
              <span>{result.score}</span> / {result.max}
            </p>
            <p className="center">
              {correctCount} dari {total} jawaban benar · target lulus {def.target} poin
            </p>
            <p className={`result-note ${result.passed ? 'is-ok' : 'is-bad'}`} role="status">
              {result.passed
                ? `Kamu lulus! Level berikutnya ${result.unlockedLevel ? 'sudah terbuka' : 'menantimu'}.`
                : 'Terus berlatih! Selesaikan tantangan ini untuk membuka level berikutnya.'}
            </p>

            <h3 className="subhead">Ringkasan Jawaban</h3>
            <ol className="review">
              {attempt.map(({ q, options }) => {
                const chosen = answers[q.id];
                const ok = chosen === q.answer;
                const chosenText = options.find((o) => o.key === chosen)?.text;
                const rightText = options.find((o) => o.key === q.answer)?.text;
                return (
                  <li key={q.id} className={ok ? 'is-ok' : 'is-bad'}>
                    <span className="review__mark" aria-label={ok ? 'Benar' : 'Salah'}>
                      {ok ? <Check size={16} strokeWidth={4} /> : <X size={16} strokeWidth={4} />}
                    </span>
                    <div>
                      <p className="review__q">{q.text}</p>
                      <p className="review__a">Jawabanmu: {chosenText}</p>
                      {!ok && <p className="review__right">Jawaban benar: {rightText}</p>}
                    </div>
                    <strong>{ok ? `+${POINTS_PER_QUESTION}` : '0'}</strong>
                  </li>
                );
              })}
            </ol>

            <div className="center-actions">
              <GameButton size="lg" iconRight={<ChevronRight size={20} />} onClick={() => navigate(`/selamat/${level}`)} id="btn-ke-perayaan">
                Lanjut
              </GameButton>
              <GameButton variant="cream" icon={<RotateCcw size={18} />} onClick={start} id="btn-ulangi-kuis">
                Ulangi Level
              </GameButton>
            </div>
          </Parchment>
        </div>
      </main>
    );
  }

  const mood = isAnswered ? (isCorrect ? 'cheer' : 'wave') : 'wave';
  const bubble = !isAnswered ? 'Pilih jawaban yang menurutmu paling tepat!' : isCorrect ? 'Mantap, jawabanmu benar!' : 'Tidak apa-apa, baca penjelasannya ya!';

  return (
    <main className="screen screen--quiz">
      <PageHeader
        title={`Level ${level}`}
        subtitle={def.subject}
        backTo="/level"
        backLabel="Keluar"
        onBack={onBack}
        right={
          <span className="chip chip--leaf" aria-label={`Poin kuis ${livePoints}`}>
            <Star size={14} fill="currentColor" /> {livePoints}
          </span>
        }
        showPoints={false}
      />
      <div className="screen__inner screen__inner--narrow">
        <div className="quiz-progress">
          <ProgressBar value={index + (isAnswered ? 1 : 0)} max={total} label="Progres kuis" />
          <span className="quiz-progress__count" aria-live="polite">Soal {index + 1} / {total}</span>
        </div>

        <Parchment className="quiz-card">
          <h2 className="quiz-question" id="quiz-q">
            <span className="quiz-question__num">{index + 1}.</span> {current.q.text}
          </h2>

          <div className="options" role="group" aria-labelledby="quiz-q">
            {current.options.map((o, i) => {
              const picked = answeredKey === o.key;
              const right = isAnswered && o.key === current.q.answer;
              const wrong = picked && !right;
              return (
                <button
                  key={o.key}
                  type="button"
                  className={`option ${picked ? 'is-picked' : ''} ${right ? 'is-right' : ''} ${wrong ? 'is-wrong' : ''}`}
                  onClick={() => choose(o.key)}
                  disabled={isAnswered && !picked && !right}
                  aria-pressed={picked}
                  aria-disabled={isAnswered}
                  id={`opt-${i}`}
                >
                  <span className="option__letter">{LETTERS[i]}</span>
                  <span className="option__text">{o.text}</span>
                  {right && <Check className="option__mark" size={22} strokeWidth={4} aria-label="Jawaban benar" />}
                  {wrong && <X className="option__mark" size={22} strokeWidth={4} aria-label="Jawaban salah" />}
                </button>
              );
            })}
          </div>

          <div aria-live="polite">
            {isAnswered && (
              <div className={`feedback ${isCorrect ? 'feedback--ok' : 'feedback--bad'}`} id="feedback">
                <strong>{isCorrect ? `Benar! +${POINTS_PER_QUESTION} poin` : 'Belum tepat. +0 poin'}</strong>
                <p>{current.q.explanation}</p>
              </div>
            )}
          </div>

          <div className="quiz-actions">
            <GameButton
              size="lg"
              disabled={!isAnswered}
              iconRight={<ChevronRight size={20} />}
              onClick={next}
              id="btn-lanjut-soal"
            >
              {index < total - 1 ? 'Lanjut' : 'Lihat Hasil'}
            </GameButton>
          </div>
        </Parchment>

        <div className="quiz-mascot" aria-live="polite">
          <Avatar mood={mood} animation="idle" className="quiz-mascot__avatar" />
          <p className="quiz-mascot__bubble">{bubble}</p>
        </div>
      </div>

      <GameDialog id="leave-dialog" open={leaveOpen} onClose={() => setLeaveOpen(false)} title="Keluar dari kuis?">
        <p>Jawaban pada percobaan ini belum disimpan dan tidak akan memberi poin jika kamu keluar sekarang.</p>
        <div className="confirm-row">
          <GameButton variant="danger" onClick={() => navigate('/level')} id="btn-keluar-kuis">Ya, keluar</GameButton>
          <GameButton variant="green" onClick={() => setLeaveOpen(false)}>Lanjut mengerjakan</GameButton>
        </div>
      </GameDialog>
    </main>
  );
}
