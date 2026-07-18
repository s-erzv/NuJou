import type { CSSProperties, ReactNode } from 'react';
import { useSpotlight } from './useSpotlight';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** rgba() color for the glow. */
  spotlightColor?: string;
}

/**
 * React Bits-style "Spotlight Card": a soft glow that follows the cursor,
 * revealed on hover. Use this for plain container cards; for anchors/Links
 * (which can't be wrapped without breaking navigation semantics), spread
 * `useSpotlight()` directly onto the element instead.
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(139, 188, 237, 0.28)',
}: SpotlightCardProps) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`spotlight-host ${className}`}
      style={{ '--spot-color': spotlightColor } as CSSProperties}
    >
      <span className="spotlight-glow" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
