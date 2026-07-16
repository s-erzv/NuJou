import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { levels } from '../data';
import { useStore, XP } from '../store/useStore';
import { LockIcon, CheckIcon, ArrowIcon, BookIcon } from '../components/icons';
import ProgressRing from '../components/ProgressRing';
import { useReveal } from '../lib/useReveal';
import ShinyText from '../components/reactbits/ShinyText';
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

  // The first unlocked-but-not-yet-passed level = "current" focus.
  const currentId = levels.find((l) => isLevelUnlocked(l.id) && !progress[l.id]?.exam?.passed)?.id;

  return (
    <div ref={reveal} className="relative">
      {/* Soft background wash */}
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[380px]" />

      <div className="container-academic relative py-12">
        {/* Hero */}
        <section className="mb-10 text-center">
          <h1 className="animate-fade-in-up text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            <ShinyText>Belajar Menulis Akademik</ShinyText>
          </h1>
          <p className="animate-fade-in-up mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600" style={{ animationDelay: '120ms' }}>
            Dari nol sampai mahir menulis KTI, esai, paper, dan jurnal — pelan-pelan, satu level satu
            langkah. Lulus ujian untuk membuka level berikutnya.
          </p>

          {/* Stat cards */}
          <div className="animate-fade-in-up mx-auto mt-9 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: '240ms' }}>
            <StatCard>
              <ProgressRing value={pct} sublabel="Progres" size={120} />
              <p className="mt-3 text-sm font-semibold text-slate-500">
                {done} dari {total} level lulus
              </p>
            </StatCard>

            <StatCard>
              <div className="grid h-[120px] place-items-center">
                <div>
                  <p className="font-serif text-5xl font-bold text-sky-700">{currentXp}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-500">XP</p>
                </div>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-sky-50">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-700 transition-all duration-700" style={{ width: `${xpPct}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-400">dari {MAX_XP} XP</p>
            </StatCard>

            <StatCard>
              <div className="grid h-[120px] place-items-center">
                <div className="flex flex-wrap justify-center gap-2">
                  {levels.map((l) => {
                    const earned = Boolean(progress[l.id]?.exam?.passed);
                    return (
                      <span
                        key={l.id}
                        title={`Level ${l.id}: ${l.title}`}
                        className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ring-2 transition ${
                          earned
                            ? 'animate-pop bg-sky-600 text-white ring-sky-200'
                            : 'bg-slate-100 text-slate-300 ring-transparent'
                        }`}
                      >
                        {earned ? <CheckIcon className="h-4 w-4" /> : l.id}
                      </span>
                    );
                  })}
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-500">Lencana Kelulusan</p>
            </StatCard>
          </div>

          {done === total && (
            <p className="animate-pop mt-6 font-serif text-lg text-sky-700">
              Luar biasa! Kamu sudah menuntaskan seluruh roadmap NuJou.
            </p>
          )}
        </section>

        {/* Roadmap */}
        <section className="relative mx-auto max-w-3xl">
          <h2 className="reveal mb-6 text-center font-serif text-2xl font-bold text-slate-900">
            Peta Perjalanan Belajar
          </h2>

          {/* Animated timeline connector */}
          <div aria-hidden className="pointer-events-none absolute left-[27px] top-24 bottom-6 hidden w-1 rounded-full bg-sky-100 sm:block">
            <div
              className="w-full rounded-full bg-gradient-to-b from-sky-400 to-sky-700 transition-all duration-1000"
              style={{ height: `${(done / total) * 100}%` }}
            />
          </div>

          <ol className="space-y-5">
            {levels.map((level, idx) => {
              const unlocked = isLevelUnlocked(level.id);
              const passed = Boolean(progress[level.id]?.exam?.passed);
              const read = Boolean(progress[level.id]?.read);
              const isCurrent = level.id === currentId;

              return (
                <li key={level.id} className="reveal relative" style={{ transitionDelay: `${idx * 70}ms` }}>
                  <CardWrapper unlocked={unlocked} slug={level.slug} highlight={isCurrent}>
                    <div className="flex items-start gap-4">
                      {/* Node */}
                      <div
                        className={`relative grid h-14 w-14 shrink-0 place-items-center rounded-full text-lg font-bold ring-4 ring-white transition ${
                          passed
                            ? 'bg-gradient-to-br from-sky-500 to-sky-700 text-white'
                            : unlocked
                              ? 'bg-sky-100 text-sky-700'
                              : 'bg-slate-100 text-slate-400'
                        } ${isCurrent ? 'pulse-ring' : ''}`}
                      >
                        {passed ? <CheckIcon className="h-6 w-6" /> : level.id}
                      </div>

                      {/* Body */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-sky-500">
                            Level {level.id}
                          </span>
                          {passed && (
                            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">✓ Lulus</span>
                          )}
                          {isCurrent && (
                            <span className="rounded-full bg-sky-600 px-2 py-0.5 text-xs font-semibold text-white">Lanjutkan di sini</span>
                          )}
                          {!unlocked && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-400">
                              <LockIcon className="h-3 w-3" /> Terkunci
                            </span>
                          )}
                        </div>
                        <h3 className="mt-0.5 text-xl font-bold text-slate-900">{level.title}</h3>
                        <p className="text-slate-500">{level.subtitle}</p>

                        {unlocked ? (
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <BookIcon className="h-4 w-4" /> ~{level.estimatedMinutes} menit
                            </span>
                            <span className="text-slate-300">·</span>
                            <span>{level.sections.length} bagian materi</span>
                            {read && <span className="text-sky-600">· ✓ Sudah dibaca</span>}
                            <span className="ml-auto inline-flex items-center gap-1 font-semibold text-sky-700">
                              {passed ? 'Tinjau ulang' : 'Mulai belajar'}
                              <ArrowIcon className="h-4 w-4" />
                            </span>
                          </div>
                        ) : (
                          <p className="mt-3 text-sm italic text-slate-400">
                            Lulus Ujian Level {level.id - 1} dulu untuk membuka level ini.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardWrapper>
                </li>
              );
            })}
          </ol>
        </section>

        {done > 0 && (
          <div className="mt-12 text-center">
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

function StatCard({ children }: { children: ReactNode }) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="spotlight-host rounded-2xl border border-sky-100 bg-white/80 p-5 text-center shadow-card backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span className="spotlight-glow" aria-hidden />
      <div className="relative z-10 flex flex-col items-center">{children}</div>
    </div>
  );
}

function CardWrapper({
  unlocked,
  slug,
  highlight,
  children,
}: {
  unlocked: boolean;
  slug: string;
  highlight?: boolean;
  children: ReactNode;
}) {
  const { ref, onMouseMove } = useSpotlight<HTMLAnchorElement & HTMLDivElement>();
  const base =
    'spotlight-host block rounded-2xl border p-5 transition duration-300 ' +
    (unlocked
      ? `bg-white shadow-card hover:-translate-y-1 hover:shadow-lift ${
          highlight ? 'border-sky-300 ring-2 ring-sky-200' : 'border-sky-100'
        }`
      : 'cursor-not-allowed border-slate-100 bg-slate-50/60');

  const spotStyle = { '--spot-color': 'rgba(56, 189, 248, 0.22)' } as CSSProperties;

  if (unlocked) {
    return (
      <Link ref={ref} onMouseMove={onMouseMove} to={`/level/${slug}`} className={base} style={spotStyle}>
        <span className="spotlight-glow" aria-hidden />
        <div className="relative z-10">{children}</div>
      </Link>
    );
  }
  return (
    <div ref={ref} onMouseMove={onMouseMove} className={base} style={spotStyle} aria-disabled>
      <span className="spotlight-glow" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
