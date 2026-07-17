import { useEffect, useState, type ReactNode } from 'react';
import { levels } from '../data';
import RoadmapPath from '../components/RoadmapPath';
import { useStore, XP } from '../store/useStore';
import { CheckIcon } from '../components/icons';
import ProgressRing from '../components/ProgressRing';
import { useReveal } from '../lib/useReveal';
import ShinyText from '../components/reactbits/ShinyText';
import { useSpotlight } from '../components/reactbits/useSpotlight';
import Prism from '../components/reactbits/Prism';

const MAX_XP = levels.length * (XP.read + XP.quiz + XP.exam);

export default function Dashboard() {
  const progress = useStore((s) => s.progress);
  const isLevelUnlocked = useStore((s) => s.isLevelUnlocked);
  const completedCount = useStore((s) => s.completedCount);
  const xp = useStore((s) => s.xp);
  const resetAll = useStore((s) => s.resetAll);
  const reveal = useReveal<HTMLDivElement>();
  const [motionOk, setMotionOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionOk(!mq.matches);
  }, []);

  const total = levels.length;
  const done = completedCount();
  const pct = Math.round((done / total) * 100);
  const currentXp = xp();
  const xpPct = Math.round((currentXp / MAX_XP) * 100);

  // The first unlocked-but-not-yet-passed level = "current" focus.
  const currentId = levels.find((l) => isLevelUnlocked(l.id) && !progress[l.id]?.exam?.passed)?.id;

  return (
    <div ref={reveal} className="relative">
      {/* Animated hero backdrop (Prism), falls back to a static glow under reduced-motion */}
      <div aria-hidden className="hero-prism pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
        {motionOk ? (
          <Prism
            height={3.2}
            baseWidth={5.5}
            animationType="rotate"
            glow={0.7}
            bloom={0.8}
            hueShift={0.9}
            colorFrequency={1}
            timeScale={0.35}
            scale={3.4}
          />
        ) : (
          <div className="hero-glow absolute inset-0" />
        )}
      </div>

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
        <section className="relative mx-auto max-w-3xl pb-16">
          <h2 className="reveal mb-6 text-center font-serif text-2xl font-bold text-slate-900">
            Peta Perjalanan Belajar
          </h2>
          <RoadmapPath
            levels={levels}
            progress={progress}
            isLevelUnlocked={isLevelUnlocked}
            currentId={currentId}
          />
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
