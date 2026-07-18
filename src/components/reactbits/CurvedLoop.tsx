import { useId } from 'react';
import './CurvedLoop.css';

// React Bits-style "Curved Loop": a marquee of text riding a gently curved SVG
// path, scrolling forever. Pure CSS animation on the textPath offset, so it's
// cheap and honors reduced-motion.

interface CurvedLoopProps {
  text?: string;
  className?: string;
  color?: string;
  /** Seconds per loop; lower is faster. */
  speed?: number;
}

export default function CurvedLoop({
  text = 'Master the Craft of Writing',
  className = '',
  color = '#8bbced',
  speed = 18,
}: CurvedLoopProps) {
  const id = useId().replace(/:/g, '');
  const pathId = `curved-loop-${id}`;
  // Repeat the phrase so the marquee has no visible gap as it wraps.
  const phrase = ` ${text} ✦ `.repeat(8);

  return (
    <div aria-hidden className={`curved-loop ${className}`}>
      <svg viewBox="0 0 1200 180" className="curved-loop__svg">
        <defs>
          <path id={pathId} d="M -100 140 Q 300 20 600 90 T 1300 60" fill="none" />
        </defs>
        <text fill={color} className="curved-loop__text">
          <textPath href={`#${pathId}`} startOffset="0%">
            {phrase}
            <animate
              attributeName="startOffset"
              from="0%"
              to="-50%"
              dur={`${speed}s`}
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>
    </div>
  );
}
