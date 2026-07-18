import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './TrueFocus.css';

// React Bits "TrueFocus": words blur in and out while a bracketed frame slides
// to the one in focus. TypeScript port, reimplemented with a CSS-transitioned
// frame instead of the `motion` dependency.

interface TrueFocusProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

export default function TrueFocus({
  sentence = 'True Focus',
  manualMode = false,
  blurAmount = 5,
  borderColor = '#3b7dc4',
  glowColor = 'rgba(59, 125, 196, 0.5)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className = '',
}: TrueFocusProps) {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (manualMode) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % words.length),
      (animationDuration + pauseBetweenAnimations) * 1000,
    );
    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex == null || !wordRefs.current[currentIndex] || !containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();
    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length]);

  const frameStyle: CSSProperties = {
    transform: `translate(${focusRect.x}px, ${focusRect.y}px)`,
    width: focusRect.width,
    height: focusRect.height,
    transition: `transform ${animationDuration}s ease, width ${animationDuration}s ease, height ${animationDuration}s ease`,
    ['--border-color' as string]: borderColor,
    ['--glow-color' as string]: glowColor,
  };

  return (
    <div className={`focus-container ${className}`} ref={containerRef}>
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            className="focus-word"
            style={{
              filter: isActive ? 'blur(0px)' : `blur(${blurAmount}px)`,
              transition: `filter ${animationDuration}s ease`,
            }}
            onMouseEnter={() => {
              if (manualMode) {
                setLastActiveIndex(index);
                setCurrentIndex(index);
              }
            }}
            onMouseLeave={() => {
              if (manualMode && lastActiveIndex != null) setCurrentIndex(lastActiveIndex);
            }}
          >
            {word}
          </span>
        );
      })}
      <div className="focus-frame" style={frameStyle} aria-hidden>
        <span className="corner top-left" />
        <span className="corner top-right" />
        <span className="corner bottom-left" />
        <span className="corner bottom-right" />
      </div>
    </div>
  );
}
