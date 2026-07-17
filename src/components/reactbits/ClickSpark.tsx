import { useRef, type MouseEvent, type ReactNode } from 'react';

interface ClickSparkProps {
  children: ReactNode;
  className?: string;
  color?: string;
  sparkCount?: number;
}

/**
 * React Bits-style "Click Spark": a tiny particle burst radiating from the
 * click point. Implemented with plain DOM nodes + a CSS keyframe (see
 * .click-spark-dot in index.css) so it works on buttons and links alike
 * without pulling in a canvas/animation library.
 */
export default function ClickSpark({
  children,
  className = '',
  color = '#3e4183',
  sparkCount = 8,
}: ClickSparkProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  const spark = (e: MouseEvent<HTMLDivElement>) => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = host.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount;
      const dot = document.createElement('span');
      dot.className = 'click-spark-dot';
      dot.style.setProperty('--dx', `${Math.cos(angle) * 28}px`);
      dot.style.setProperty('--dy', `${Math.sin(angle) * 28}px`);
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      dot.style.background = color;
      host.appendChild(dot);
      dot.addEventListener('animationend', () => dot.remove());
    }
  };

  return (
    <div ref={hostRef} onClickCapture={spark} className={`relative inline-block ${className}`}>
      {children}
    </div>
  );
}
