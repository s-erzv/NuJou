import { useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getLevel, levels } from '../data';
import { useStore } from '../store/useStore';
import type { Assessment as AssessmentType } from '../types';
import { CheckIcon, ArrowIcon } from '../components/icons';
import { burstConfetti } from '../lib/confetti';
import ClickSpark from '../components/reactbits/ClickSpark';

export default function Assessment({ kind }: { kind: 'quiz' | 'exam' }) {
  const { slug } = useParams();
  const level = slug ? getLevel(slug) : undefined;

  const isLevelUnlocked = useStore((s) => s.isLevelUnlocked);
  const recordResult = useStore((s) => s.recordResult);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [outcome, setOutcome] = useState<{ score: number; total: number; passed: boolean } | null>(
    null,
  );

  const assessment: AssessmentType | undefined = level
    ? kind === 'quiz'
      ? level.quiz
      : level.exam
    : undefined;

  const total = assessment?.questions.length ?? 0;
  const answeredCount = Object.keys(answers).length;

  const nextLevel = useMemo(
    () => (level ? levels.find((l) => l.id === level.id + 1) : undefined),
    [level],
  );

  // Edge cases
  if (!level || !assessment) return <Navigate to="/404" replace />;
  if (!isLevelUnlocked(level.id)) return <Navigate to="/" replace />;

  const passPct = Math.round(assessment.passRatio * 100);

  const handleSubmit = () => {
    let score = 0;
    for (const q of assessment.questions) {
      if (answers[q.id] === q.answer) score += 1;
    }
    const result = recordResult(level.id, kind, score, total, assessment.passRatio);
    setOutcome({ score, total, passed: result.passed });
    setSubmitted(true);
    window.scrollTo(0, 0);
    if (result.passed) burstConfetti();
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setOutcome(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container-academic py-10">
      <Link
        to={`/level/${level.slug}`}
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:underline"
      >
        ← Kembali ke materi
      </Link>

      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
            Level {level.id} · {kind === 'quiz' ? 'Kuis' : 'Ujian'}
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-slate-900">{assessment.title}</h1>
          <p className="mt-2 text-slate-600">
            {total} soal · syarat lulus {passPct}%
            {kind === 'exam' && ' · kelulusan membuka level berikutnya'}
          </p>
        </header>

        {/* Live answered-progress */}
        {!submitted && (
          <div className="mb-8">
            <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
              <span>Terjawab {answeredCount}/{total}</span>
              <span>{Math.round((answeredCount / total) * 100)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-sky-50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-700 transition-all duration-300"
                style={{ width: `${(answeredCount / total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Result banner */}
        {submitted && outcome && (
          <div
            className={`animate-pop mb-8 rounded-2xl border p-6 shadow-card ${
              outcome.passed
                ? 'border-sky-200 bg-gradient-to-br from-sky-50 to-white'
                : 'border-amber-200 bg-amber-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`grid h-12 w-12 place-items-center rounded-full ${
                  outcome.passed ? 'bg-sky-600 text-white' : 'bg-amber-400 text-white'
                }`}
              >
                {outcome.passed ? <CheckIcon className="h-6 w-6" /> : '!'}
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  {outcome.passed ? 'Selamat, Anda Lulus!' : 'Belum Lulus'}
                </h2>
                <p className="text-slate-600">
                  Skor Anda: {outcome.score}/{outcome.total} (
                  {Math.round((outcome.score / outcome.total) * 100)}%)
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {!outcome.passed && (
                <button onClick={reset} className="btn-primary">
                  Coba Lagi
                </button>
              )}
              {outcome.passed && kind === 'exam' && nextLevel && (
                <Link to={`/level/${nextLevel.slug}`} className="btn-primary">
                  Lanjut ke Level {nextLevel.id} <ArrowIcon className="h-4 w-4" />
                </Link>
              )}
              {outcome.passed && kind === 'exam' && !nextLevel && (
                <Link to="/" className="btn-primary">
                  Selesai — Kembali ke Roadmap
                </Link>
              )}
              {outcome.passed && kind === 'quiz' && (
                <Link to={`/level/${level.slug}/exam`} className="btn-primary">
                  Lanjut ke Ujian <ArrowIcon className="h-4 w-4" />
                </Link>
              )}
              <Link to={`/level/${level.slug}`} className="btn-ghost">
                Tinjau Materi
              </Link>
            </div>
          </div>
        )}

        {/* Questions */}
        <ol className="space-y-6">
          {assessment.questions.map((q, qi) => {
            const chosen = answers[q.id];
            return (
              <li
                key={q.id}
                className="rounded-xl border border-sky-100 bg-white p-5 shadow-card"
              >
                <p className="font-semibold text-slate-900">
                  <span className="mr-2 text-sky-600">{qi + 1}.</span>
                  {q.question}
                </p>
                <div className="mt-4 space-y-2">
                  {q.options.map((opt, oi) => {
                    const isChosen = chosen === oi;
                    const isCorrect = q.answer === oi;
                    let style =
                      'border-slate-200 hover:border-sky-300 hover:bg-sky-50/40';
                    if (submitted) {
                      if (isCorrect) style = 'border-sky-400 bg-sky-50';
                      else if (isChosen) style = 'border-amber-400 bg-amber-50';
                      else style = 'border-slate-200 opacity-70';
                    } else if (isChosen) {
                      style = 'border-sky-500 bg-sky-50';
                    }

                    return (
                      <label
                        key={oi}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${style} ${
                          submitted ? 'cursor-default' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          className="h-4 w-4 accent-sky-600"
                          checked={isChosen ?? false}
                          disabled={submitted}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                        />
                        <span className="text-slate-700">{opt}</span>
                        {submitted && isCorrect && (
                          <CheckIcon className="ml-auto h-5 w-5 text-sky-600" />
                        )}
                      </label>
                    );
                  })}
                </div>

                {submitted && (
                  <p className="mt-3 rounded-md bg-slate-50 px-4 py-2 text-sm text-slate-600">
                    <span className="font-semibold text-slate-700">Penjelasan: </span>
                    {q.explanation}
                  </p>
                )}
              </li>
            );
          })}
        </ol>

        {/* Submit */}
        {!submitted && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Terjawab {answeredCount}/{total}
            </p>
            <ClickSpark>
              <button
                onClick={handleSubmit}
                disabled={answeredCount < total}
                className="btn-primary"
              >
                Kumpulkan Jawaban
              </button>
            </ClickSpark>
          </div>
        )}
      </div>
    </div>
  );
}
