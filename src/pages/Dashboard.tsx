import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { levels } from '../data';
import { PATHS, tiersOfPath, type LearningPath } from '../data/paths';
import { useStore, XP } from '../store/useStore';
import type { Level, LevelProgress } from '../types';
import { CheckIcon, LockIcon, BookIcon, ArrowIcon } from '../components/icons';
import ProgressRing from '../components/ProgressRing';
import { useReveal } from '../lib/useReveal';
import ClickSpark from '../components/reactbits/ClickSpark';
import SpecularButton from '../components/reactbits/SpecularButton';
import BorderGlow from '../components/reactbits/BorderGlow';
import GridScan from '../components/reactbits/GridScan';

const levelById = (id: number) => levels.find((l) => l.id === id);

export default function Dashboard() {
  const [params, setParams] = useSearchParams();
  const progress = useStore((s) => s.progress);
  const isLevelUnlocked = useStore((s) => s.isLevelUnlocked);
  const resetAll = useStore((s) => s.resetAll);
  const reveal = useReveal<HTMLDivElement>();

  const requested = params.get('path');
  const activePath = PATHS.find((p) => p.id === requested) ?? PATHS[0];

  return (
    <div ref={reveal} className="relative">
      {/* Grid-scan backdrop behind the header */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[260px] overflow-hidden">
        <GridScan cell={44} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white" />
      </div>

      <div className="container-academic relative py-10">
        <header className="mb-6">
          <h1 className="animate-fade-in-up font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Peta Belajar
          </h1>
          <p className="animate-fade-in-up mt-1 text-slate-600" style={{ animationDelay: '80ms' }}>
            Pilih jalurmu. Tiap jalur bisa dibuka sendiri — no need to finish the academic track
            first.
          </p>
        </header>

        {/* Path tabs — line-indicator nav */}
        <nav className="mb-10 flex flex-wrap gap-1 border-b border-sky-100">
          {PATHS.map((path) => {
            const active = path.id === activePath.id;
            return (
              <button
                key={path.id}
                onClick={() => setParams(path.id === PATHS[0].id ? {} : { path: path.id })}
                className={`cursor-target relative -mb-px px-4 py-2.5 text-sm font-semibold transition ${
                  active ? 'text-sky-700' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {path.name}
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full transition-all ${
                    active ? 'bg-sky-600' : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <PathView
          key={activePath.id}
          path={activePath}
          progress={progress}
          isLevelUnlocked={isLevelUnlocked}
        />

        <div className="mt-14 text-center">
          <button
            onClick={() => {
              if (confirm('Reset semua progres belajar? Tindakan ini tidak dapat dibatalkan.')) resetAll();
            }}
            className="text-sm font-semibold text-slate-400 underline-offset-4 hover:text-slate-600 hover:underline"
          >
            Reset progres
          </button>
        </div>
      </div>
    </div>
  );
}

function PathView({
  path,
  progress,
  isLevelUnlocked,
}: {
  path: LearningPath;
  progress: Record<number, LevelProgress>;
  isLevelUnlocked: (id: number) => boolean;
}) {
  const pathLevels = path.levelIds.map(levelById).filter((l): l is Level => Boolean(l));
  const passed = pathLevels.filter((l) => progress[l.id]?.exam?.passed).length;
  const pct = pathLevels.length ? Math.round((passed / pathLevels.length) * 100) : 0;
  const maxXp = pathLevels.length * (XP.read + XP.quiz + XP.exam);
  const pathXp = pathLevels.reduce((sum, l) => {
    const p = progress[l.id];
    if (!p) return sum;
    return sum + (p.read ? XP.read : 0) + (p.quiz?.passed ? XP.quiz : 0) + (p.exam?.passed ? XP.exam : 0);
  }, 0);

  const current = pathLevels.find((l) => isLevelUnlocked(l.id) && !progress[l.id]?.exam?.passed);
  const tiers = tiersOfPath(path.id);

  return (
    <>
      {/* Path summary + continue */}
      <section className="reveal mb-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <BorderGlow className="rounded-2xl">
          <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">{path.tagline}</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900">{path.name}</h2>
            <p className="mt-2 max-w-xl leading-relaxed text-slate-600">{path.description}</p>
            {current ? (
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-xl font-bold text-white">
                  {current.id}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
                    Lanjutkan di sini
                  </p>
                  <p className="font-serif text-lg font-bold text-slate-900">{current.title}</p>
                  <p className="text-sm text-slate-500">{current.subtitle}</p>
                </div>
                <ClickSpark>
                  <Link to={`/level/${current.slug}`}>
                    <SpecularButton as="span" className="btn-primary shrink-0">
                      {progress[current.id]?.read ? 'Lanjutkan' : 'Mulai'} <ArrowIcon className="h-4 w-4" />
                    </SpecularButton>
                  </Link>
                </ClickSpark>
              </div>
            ) : (
              <p className="mt-5 font-serif text-lg font-bold text-sky-700">
                Jalur ini sudah kamu tuntaskan. Keren. ✦
              </p>
            )}
          </div>
        </BorderGlow>

        <div className="flex items-center gap-5 rounded-2xl border border-sky-100 bg-white/80 p-6 shadow-card backdrop-blur">
          <ProgressRing value={pct} sublabel="Selesai" size={92} />
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {passed}
              <span className="text-base font-semibold text-slate-400">/{pathLevels.length}</span>
            </p>
            <p className="text-xs font-semibold text-slate-500">level lulus ujian</p>
            <p className="mt-2 text-xs font-semibold text-sky-600">
              {pathXp}
              <span className="text-slate-400"> / {maxXp} XP</span>
            </p>
          </div>
        </div>
      </section>

      {/* Tiers within the path */}
      <div className="space-y-10">
        {tiers.map((tier) => {
          const tierLevels = pathLevels.filter((l) => l.id >= tier.from && l.id <= tier.to);
          const tierDone = tierLevels.filter((l) => progress[l.id]?.exam?.passed).length;
          const tierPct = tierLevels.length ? Math.round((tierDone / tierLevels.length) * 100) : 0;
          return (
            <section key={tier.id} className="reveal">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">{tier.name}</h3>
                  <p className="text-sm text-slate-500">{tier.blurb}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700">
                    {tierDone}
                    <span className="font-semibold text-slate-400">/{tierLevels.length}</span>
                  </p>
                  <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-700 transition-all duration-700"
                      style={{ width: `${tierPct}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tierLevels.map((level) => (
                  <LevelCard
                    key={level.id}
                    level={level}
                    progress={progress[level.id]}
                    unlocked={isLevelUnlocked(level.id)}
                    isCurrent={level.id === current?.id}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function LevelCard({
  level,
  progress,
  unlocked,
  isCurrent,
}: {
  level: Level;
  progress: LevelProgress | undefined;
  unlocked: boolean;
  isCurrent: boolean;
}) {
  const passed = Boolean(progress?.exam?.passed);
  const quizPassed = Boolean(progress?.quiz?.passed);
  const read = Boolean(progress?.read);

  const body = (
    <>
      <div className="flex items-start gap-3">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold transition ${
            passed
              ? 'bg-gradient-to-br from-sky-500 to-sky-700 text-white'
              : unlocked
                ? 'bg-sky-100 text-sky-700'
                : 'bg-slate-100 text-slate-400'
          } ${isCurrent ? 'pulse-ring' : ''}`}
        >
          {passed ? <CheckIcon className="h-5 w-5" /> : unlocked ? level.id : <LockIcon className="h-4 w-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className={`text-sm font-bold leading-snug ${unlocked ? 'text-slate-900' : 'text-slate-400'}`}>
            {level.title}
          </h4>
          <p className={`mt-0.5 text-xs leading-snug ${unlocked ? 'text-slate-500' : 'text-slate-300'}`}>
            {level.subtitle}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {unlocked ? (
          <>
            <Chip active={read}>Baca</Chip>
            <Chip active={quizPassed}>Kuis</Chip>
            <Chip active={passed}>Ujian</Chip>
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-400">
              <BookIcon className="h-3 w-3" />~{level.estimatedMinutes}m
            </span>
          </>
        ) : (
          <p className="text-xs italic text-slate-400">Lulus level sebelumnya di jalur ini dulu.</p>
        )}
      </div>
    </>
  );

  const base = `block h-full rounded-2xl border p-4 transition duration-300 ${
    unlocked
      ? `bg-white shadow-card hover:-translate-y-0.5 hover:shadow-lift ${
          isCurrent ? 'border-sky-300 ring-2 ring-sky-200' : 'border-sky-100'
        }`
      : 'cursor-not-allowed border-slate-100 bg-slate-50/60'
  }`;

  if (!unlocked) {
    return (
      <div className={base} aria-disabled>
        {body}
      </div>
    );
  }
  return (
    <BorderGlow className="cursor-target rounded-2xl">
      <Link to={`/level/${level.slug}`} className={base}>
        {body}
      </Link>
    </BorderGlow>
  );
}

function Chip({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        active ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-400'
      }`}
    >
      {active ? '✓ ' : ''}
      {children}
    </span>
  );
}
