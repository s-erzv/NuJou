import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

// Ported from React Bits (https://reactbits.dev) — originally from
// https://codepen.io/JuanFuentes/full/rgXKGQ. TypeScript port, dependency-free.
// Characters flex their variable-font width/weight toward the cursor.

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance: number, maxDist: number, minVal: number, maxVal: number) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

function debounce<Args extends unknown[]>(fn: (...a: Args) => void, delay: number) {
  let t: ReturnType<typeof setTimeout>;
  return (...a: Args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), delay);
  };
}

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  textColor?: string;
  className?: string;
  minFontSize?: number;
}

export default function TextPressure({
  text = 'Compressa',
  fontFamily = 'Roboto Flex',
  fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap',
  width = true,
  weight = true,
  italic = true,
  textColor = '#0f172a',
  className = '',
  minFontSize = 24,
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const chars = text.split('');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    if (containerRef.current) {
      const { left, top, width: w, height: h } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + w / 2;
      mouseRef.current.y = top + h / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current) return;
    const { width: containerW } = containerRef.current.getBoundingClientRect();
    setFontSize(Math.max(containerW / (chars.length / 2), minFontSize));
  }, [chars.length, minFontSize]);

  useEffect(() => {
    const debounced = debounce(setSize, 100);
    debounced();
    window.addEventListener('resize', debounced);
    return () => window.removeEventListener('resize', debounced);
  }, [setSize]);

  useEffect(() => {
    // Respect reduced motion: keep the type static at a neutral weight/width.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId: number;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach((span) => {
          if (!span) return;
          const rect = span.getBoundingClientRect();
          const charCenter = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
          const d = dist(mouseRef.current, charCenter);

          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : '0';

          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
        });
      }
      rafId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic]);

  const styleElement = useMemo(
    () => (
      <style>{`@import url('${fontUrl}'); .text-pressure-title { color: ${textColor}; }`}</style>
    ),
    [fontUrl, textColor],
  );

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {styleElement}
      <h1
        ref={titleRef}
        className={`text-pressure-title flex justify-between ${className}`}
        style={{
          fontFamily,
          fontSize,
          lineHeight: 1,
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontWeight: 100,
          width: '100%',
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            style={{ display: 'inline-block', color: textColor }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}
