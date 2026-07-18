import { useRef, type ReactNode, type MouseEvent, type CSSProperties } from 'react';
import './BorderGlow.css';

// React Bits "Magic Bento" / border-glow effect: a gradient ring lights up and
// follows the cursor around a card's border. Dependency-free.

interface BorderGlowProps {
  children: ReactNode;
  className?: string;
  /** Glow color (any CSS color). */
  color?: string;
  style?: CSSProperties;
}

export default function BorderGlow({
  children,
  className = '',
  color = 'rgba(59, 125, 196, 0.55)',
  style,
}: BorderGlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`border-glow ${className}`}
      style={{ ['--glow-color' as string]: color, ...style }}
    >
      <span className="border-glow__ring" aria-hidden />
      <div className="border-glow__content">{children}</div>
    </div>
  );
}
