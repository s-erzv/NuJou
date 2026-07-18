import { useRef, useState } from 'react';
import './OptionWheel.css';

// React Bits-style "Option Wheel": a radial wheel of options that spins and
// lands on one at random. Dependency-free (CSS transform + one transition).
// Honors reduced-motion by snapping instead of spinning.

interface OptionWheelProps {
  options: string[];
  onSelect?: (option: string, index: number) => void;
  spinLabel?: string;
  className?: string;
}

export default function OptionWheel({
  options,
  onSelect,
  spinLabel = 'Putar',
  className = '',
}: OptionWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const seg = 360 / options.length;

  const spin = () => {
    if (spinning) return;
    const target = Math.floor(Math.random() * options.length);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Land the chosen segment under the top pointer. Add full turns for flourish.
    const turns = reduced ? 0 : 4;
    const dest = turns * 360 + (360 - target * seg - seg / 2);
    // Continue from current rotation modulo, so it always spins forward.
    const base = Math.ceil(rotation / 360) * 360;
    setSpinning(true);
    setSelected(null);
    setRotation(base + dest);
    window.setTimeout(
      () => {
        setSelected(target);
        setSpinning(false);
        onSelect?.(options[target], target);
      },
      reduced ? 0 : 3200,
    );
  };

  return (
    <div className={`option-wheel ${className}`}>
      <div className="option-wheel__stage">
        <span className="option-wheel__pointer" aria-hidden />
        <div
          ref={wheelRef}
          className="option-wheel__disc"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {options.map((opt, i) => (
            <div
              key={opt}
              className={`option-wheel__seg ${selected === i ? 'is-selected' : ''}`}
              style={{
                transform: `rotate(${i * seg}deg)`,
                background: i % 2 === 0 ? 'rgba(139,188,237,0.22)' : 'rgba(139,188,237,0.10)',
              }}
            >
              <span className="option-wheel__label" style={{ transform: `rotate(${seg / 2}deg)` }}>
                {i + 1}
              </span>
            </div>
          ))}
          <div className="option-wheel__hub" />
        </div>
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className="cursor-target btn-primary mt-4 px-5 py-2 text-sm disabled:opacity-60"
      >
        {spinning ? 'Memutar…' : spinLabel}
      </button>

      <p className="mt-6 min-h-[1.5rem] max-w-xs text-center text-sm font-medium text-slate-400">
        {spinning ? 'Mencari tantangan...' : 'Klik tombol di atas untuk memulai.'}
      </p>
    </div>
  );
}
