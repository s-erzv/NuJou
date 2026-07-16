import type { CSSProperties, ReactNode } from 'react';

interface GlassSurfaceProps {
  children: ReactNode;
  className?: string;
  /** Corner radius in px. */
  radius?: number;
  /** Backdrop blur strength in px. */
  blur?: number;
  style?: CSSProperties;
}

/**
 * A React Bits-style "Glass Surface": a frosted glass panel with a soft
 * top sheen and subtle light border. Pure CSS (backdrop-filter) — no
 * extra dependencies, degrades gracefully where backdrop-filter isn't
 * supported (panel still reads fine as a translucent white card).
 */
export default function GlassSurface({
  children,
  className = '',
  radius = 20,
  blur = 18,
  style,
}: GlassSurfaceProps) {
  return (
    <div
      className={`glass-surface relative ${className}`}
      style={{
        borderRadius: radius,
        backdropFilter: `blur(${blur}px) saturate(160%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(160%)`,
        ...style,
      }}
    >
      <span className="glass-surface__sheen" aria-hidden style={{ borderRadius: radius }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
