import { useMemo, type CSSProperties } from 'react';

// React Bits "GradualBlur": a stack of masked backdrop-filter layers that fade
// a progressive blur in at one edge of its parent. TypeScript port, trimmed to
// the props we actually use (position, height, strength, divCount, curve).

type Position = 'top' | 'bottom' | 'left' | 'right';
type Curve = 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out';

interface GradualBlurProps {
  position?: Position;
  height?: string;
  strength?: number;
  divCount?: number;
  curve?: Curve;
  exponential?: boolean;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}

const CURVE_FUNCTIONS: Record<Curve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  'ease-in': (p) => p * p,
  'ease-out': (p) => 1 - Math.pow(1 - p, 2),
  'ease-in-out': (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const gradientDirection = (position: Position) =>
  ({ top: 'to top', bottom: 'to bottom', left: 'to left', right: 'to right' })[position];

export default function GradualBlur({
  position = 'bottom',
  height = '6rem',
  strength = 2,
  divCount = 5,
  curve = 'linear',
  exponential = false,
  opacity = 1,
  className = '',
  style,
}: GradualBlurProps) {
  const blurDivs = useMemo(() => {
    const divs = [];
    const increment = 100 / divCount;
    const curveFunc = CURVE_FUNCTIONS[curve] ?? CURVE_FUNCTIONS.linear;
    const direction = gradientDirection(position);

    for (let i = 1; i <= divCount; i++) {
      const progress = curveFunc(i / divCount);
      const blurValue = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * strength
        : 0.0625 * (progress * divCount + 1) * strength;

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const maskImage = `linear-gradient(${direction}, ${gradient})`;
      divs.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            maskImage,
            WebkitMaskImage: maskImage,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            opacity,
          }}
        />,
      );
    }
    return divs;
  }, [position, height, strength, divCount, curve, exponential, opacity]);

  const isVertical = position === 'top' || position === 'bottom';
  const containerStyle: CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 20,
    ...(isVertical
      ? { height, left: 0, right: 0, [position]: 0 }
      : { width: height, top: 0, bottom: 0, [position]: 0 }),
    ...style,
  };

  return (
    <div aria-hidden className={`pointer-events-none ${className}`} style={containerStyle}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>{blurDivs}</div>
    </div>
  );
}
