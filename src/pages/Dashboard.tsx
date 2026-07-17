import { Link } from 'react-router-dom';
import { levels } from '../data';
import { TIERS, tierOf } from '../data/tiers';
import { useStore, XP } from '../store/useStore';
import type { Level, LevelProgress } from '../types';
import { CheckIcon, LockIcon, BookIcon, ArrowIcon } from '../components/icons';
import ProgressRing from '../components/ProgressRing';
import { useReveal } from '../lib/useReveal';
import ClickSpark from '../components/reactbits/ClickSpark';
import { useSpotlight } from '../components/reactbits/useSpotlight';

const MAX_XP = levels.length * (XP.read + XP.quiz + XP.exam);

export default function Dashboard() {
  const progress = useStore((s) => s.progress);
  const isLevelUnlocked = useStore((s) => s.isLevelUnlocked);
  const completedCount = useStore((s) => s.completedCount);
  const xp = useStore((s) => s.xp);
  const resetAll = useStore((s) => s.resetAll);
  const reveal = useReveal<HTMLDivElement>();

  const total = levels.length;
  const done = completedCount();
  const pct = Math.round((done / total) * 100);
  const currentXp = xp();
  const xpPct = Math.round((currentXp / MAX_XP) * 100);
  const readCount = levels.filter((l) => progress[l.id]?.read).length;

  const currentLevel = levels.find((l) => isLevelUnlocked(l.id) && !progress[l.id]?.exam?.passed);
  const currentTier = currentLevel ? tierOf(currentLevel.id) : undefined;

  // Only render tiers that actually have levels written — the curriculum grows
  // over time, and an empty tier reads as a bug rather than a promise.
  const activeTiers = TIERS.map((tier) => ({
    tier,
    tierLevels: levels.filter((l) => l.id >= tier.from && l.id <= tier.to),
  })).filter(({ tierLevels }) => tierLevels.length > 0);

  return (
    <div ref={reveal} className="relative">
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[280px]" />

      <div className="container-academic relative py-10">
        {/* ---- Header + stats ---- */}
        <header className="mb-8">
          <h1 className="animate-fade-in-up font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Peta Belajar
          </h1>
          <p className="animate-fade-in-up mt-1 text-slate-600" style={{ animationDelay: '80ms' }}>
            {total} level, {activeTiers.length} tahap. Lulus ujian untuk membuka level berikutnya.
          </p>
        </header>

        <div className="animate-fade-in-up mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ animationDelay: '160ms' }}>
          <StatCard>
            <div className="flex items-center gap-4">
              <ProgressRing value={pct} sublabel="Lulus" size={78} />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {done}
                  <span className="text-base font-semibold text-slate-400">/{total}</span>
                </p>
                <p className="text-xs font-semibold text-slate-500">level lulus ujian</p>
              </div>
            </div>
          </StatCard>

          <StatCard>
            <p className="font-serif text-3xl font-bold text-sky-700">{currentXp}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-500">XP</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sky-50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-700 transition-all duration-700"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">dari {MAX_XP} XP</p>
          </StatCard>

          <StatCard>
            <p className="font-serif text-3xl font-bold text-slate-900">{readCount}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Materi dibaca</p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Membaca saja sudah dapat {XP.read} XP — ujian memberi {XP.exam}.
            </p>
          </StatCard>

          <StatCard>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tahap sekarang</p>
            <p className="mt-1 font-serif text-lg font-bold leading-tight text-slate-900">
              {currentTier?.name ?? 'Selesai semua'}
            </p>
            {currentTier && (
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{currentTier.blurb}</p>
            )}
          </StatCard>
        </div>

        {/* ---- Continue ---- */}
        {currentLevel ? (
          <section className="reveal mb-12">
            <div className="relative overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white p-6 shadow-lift">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-2xl font-bold text-white">
                  {currentLevel.id}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
                    Lanjutkan di sini
                  </p>
                  <h2 className="mt-0.5 font-serif text-xl font-bold text-slate-900">
                    {currentLevel.title}
                  </h2>
                  <p className="text-sm text-slate-500">{currentLevel.subtitle}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <BookIcon className="h-3.5 w-3.5" /> ~{currentLevel.estimatedMinutes} menit
                    </span>
                    <span className="text-slate-300">·</span>
                    <span>{currentLevel.sections.length} bagian</span>
                    {progress[currentLevel.id]?.read && (
                      <span className="font-semibold text-sky-600">· ✓ Sudah dibaca</span>
                    )}
                  </div>
                </div>
                <ClickSpark>
                  <Link to={`/level/${currentLevel.slug}`} className="btn-primary shrink-0">
                    {progress[currentLevel.id]?.read ? 'Lanjutkan' : 'Mulai belajar'}
                    <ArrowIcon className="h-4 w-4" />
                  </Link>
                </ClickSpark>
              </div>
            </div>
          </section>
        ) : (
          <section className="reveal mb-12 rounded-2xl border border-sky-200 bg-sky-50 p-6 text-center">
            <p className="font-serif text-lg font-bold text-sky-800">
              Luar biasa — kamu sudah menuntaskan seluruh roadmap NuJou.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Sekarang bagian yang sesungguhnya: menulis, terbitkan, ulangi.
            </p>
          </section>
        )}

        {/* ---- Tiers ---- */}
        <div className="space-y-10">
          {activeTiers.map(({ tier, tierLevels }) => {
            const tierDone = tierLevels.filter((l) => progress[l.id]?.exam?.passed).length;
            const tierPct = Math.round((tierDone / tierLevels.length) * 100);
            const tierUnlocked = tierLevels.some((l) => isLevelUnlocked(l.id));

            return (
              <section key={tier.id} className="reveal">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-slate-900">
                      {tier.name}
                      {!tierUnlocked && (
                        <LockIcon className="ml-2 inline h-4 w-4 align-baseline text-slate-300" />
                      )}
                    </h2>
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
                      isCurrent={level.id === currentLevel?.id}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {done > 0 && (
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
        )}
      </div>
    </div>
  );
}

function StatCard({ children }: { children: React.ReactNode }) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="spotlight-host rounded-2xl border border-sky-100 bg-white/80 p-4 shadow-card backdrop-blur"
    >
      <span className="spotlight-glow" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
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
          <h3
            className={`text-sm font-bold leading-snug ${
              unlocked ? 'text-slate-900' : 'text-slate-400'
            }`}
          >
            {level.title}
          </h3>
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
            <span className="ml-auto text-xs text-slate-400">~{level.estimatedMinutes}m</span>
          </>
        ) : (
          <p className="text-xs italic text-slate-400">Lulus Ujian Level {level.id - 1} dulu.</p>
        )}
      </div>
    </>
  );

  const base = `block rounded-2xl border p-4 transition duration-300 ${
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
    <Link to={`/level/${level.slug}`} className={base}>
      {body}
    </Link>
  );
}

function Chip({ active, children }: { active: boolean; children: React.ReactNode }) {
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
