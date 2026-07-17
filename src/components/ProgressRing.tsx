import { useEffect, useState } from 'react';

interface Props {
  /** 0–100 */
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

/** Animated circular progress ring drawn with SVG. */
export default function ProgressRing({
  value,
  size = 132,
  stroke = 10,
  label,
  sublabel,
}: Props) {
  const [display, setDisplay] = useState(0);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (display / 100) * c;

  // Animate from 0 to value on mount / change.
  useEffect(() => {
    const id = requestAnimationFrame(() => setDisplay(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped]);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7679b7" />
            <stop offset="100%" stopColor="#30326a" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e1e2f1" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-serif text-3xl font-bold text-slate-900">{label ?? `${Math.round(clamped)}%`}</span>
        {sublabel && <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">{sublabel}</span>}
      </div>
    </div>
  );
}
