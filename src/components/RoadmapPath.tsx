import { Link } from 'react-router-dom';
import type { Level, LevelProgress } from '../types';
import { CheckIcon, LockIcon, BookIcon, ArrowIcon } from './icons';

interface RoadmapPathProps {
  levels: Level[];
  progress: Record<number, LevelProgress>;
  isLevelUnlocked: (levelId: number) => boolean;
  currentId: number | undefined;
}

const ROW_HEIGHT = 168;
const AMPLITUDE = 30;

function buildPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function NodeCircle({
  passed,
  current,
  locked,
  label,
}: {
  passed: boolean;
  current: boolean;
  locked?: boolean;
  label: number;
}) {
  return (
    <div
      className={`grid h-16 w-16 place-items-center rounded-full text-lg font-bold ring-4 ring-white transition ${
        passed
          ? 'bg-gradient-to-br from-moss-500 to-moss-700 text-white'
          : locked
            ? 'bg-slate-100 text-slate-400'
            : 'bg-sky-100 text-sky-700'
      } ${current ? 'pulse-ring' : ''}`}
    >
      {passed ? <CheckIcon className="h-6 w-6" /> : locked ? <LockIcon className="h-5 w-5" /> : label}
    </div>
  );
}

function CurrentLevelCard({ level, read }: { level: Level; read: boolean }) {
  return (
    <div className="w-64 rounded-2xl border border-sky-200 bg-white p-4 text-left shadow-lift sm:w-72">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-600 px-2 py-0.5 text-xs font-semibold text-white">
          Lanjutkan di sini
        </span>
        <span className="margin-note text-base">yuk, lanjut! ✎</span>
      </div>
      <h3 className="mt-2 text-lg font-bold text-slate-900">{level.title}</h3>
      <p className="text-sm text-slate-500">{level.subtitle}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <BookIcon className="h-3.5 w-3.5" /> ~{level.estimatedMinutes} menit
        </span>
        <span className="text-slate-300">·</span>
        <span>{level.sections.length} bagian materi</span>
        {read && <span className="text-sky-600">· ✓ Sudah dibaca</span>}
      </div>
      <Link
        to={`/level/${level.slug}`}
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:underline"
      >
        Mulai belajar <ArrowIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function RoadmapPath({ levels, progress, isLevelUnlocked, currentId }: RoadmapPathProps) {
  const passedCount = levels.filter((l) => progress[l.id]?.exam?.passed).length;

  const nodePoints = levels.map((_level, idx) => ({
    x: 50 + Math.sin(idx * 1.1) * AMPLITUDE,
    y: idx * ROW_HEIGHT + ROW_HEIGHT / 2,
  }));

  const totalHeight = levels.length * ROW_HEIGHT;
  const solidPath = buildPath(nodePoints.slice(0, passedCount + 1));
  const dashedPath = buildPath(nodePoints.slice(passedCount));
  const currentIdx = levels.findIndex((l) => l.id === currentId);

  return (
    <div
      className="relative mx-auto max-w-2xl"
      style={{ height: totalHeight + (currentIdx >= 0 ? 190 : 30) }}
    >
      <svg
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{ height: totalHeight }}
        viewBox={`0 0 100 ${totalHeight}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={dashedPath} fill="none" stroke="#c4c5e3" strokeWidth="1.2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        <path d={solidPath} fill="none" stroke="#587b43" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </svg>

      {levels.map((level, idx) => {
        const passed = Boolean(progress[level.id]?.exam?.passed);
        const unlocked = isLevelUnlocked(level.id);
        const isCurrent = level.id === currentId;
        const point = nodePoints[idx];

        return (
          <div
            key={level.id}
            className="reveal absolute -translate-x-1/2"
            style={{ left: `${point.x}%`, top: point.y - 32, transitionDelay: `${idx * 70}ms` }}
          >
            {unlocked ? (
              <Link to={`/level/${level.slug}`} className="group flex flex-col items-center gap-2">
                <NodeCircle passed={passed} current={isCurrent} label={level.id} />
                <span className="max-w-[6.5rem] text-center text-xs font-semibold leading-tight text-slate-500 group-hover:text-sky-700">
                  {level.title}
                </span>
              </Link>
            ) : (
              <div
                className="flex cursor-not-allowed flex-col items-center gap-2"
                title={`Lulus Ujian Level ${level.id - 1} dulu untuk membuka level ini.`}
              >
                <NodeCircle passed={false} current={false} locked label={level.id} />
                <span className="max-w-[6.5rem] text-center text-xs font-semibold leading-tight text-slate-300">
                  {level.title}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {currentIdx >= 0 && (
        <div
          className="reveal absolute left-1/2 -translate-x-1/2"
          style={{ top: nodePoints[currentIdx].y + 60 }}
        >
          <CurrentLevelCard
            level={levels[currentIdx]}
            read={Boolean(progress[levels[currentIdx].id]?.read)}
          />
        </div>
      )}
    </div>
  );
}
