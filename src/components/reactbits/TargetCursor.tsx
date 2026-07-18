import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

// React Bits "TargetCursor": a custom cursor that snaps its four corner
// brackets around any `.cursor-target` element and idly spins otherwise.
// TypeScript port. Renders nothing (and leaves the native cursor alone) on
// touch/small screens and under reduced-motion.

const num = (v: string | number | undefined) => (typeof v === 'number' ? v : parseFloat(v ?? '0') || 0);

const getContainingBlock = (element: HTMLElement | null): HTMLElement | null => {
  let node = element?.parentElement ?? null;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.includes('transform') ||
      style.willChange.includes('perspective') ||
      style.willChange.includes('filter') ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const getContainingBlockOffset = (block: HTMLElement | null) => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};

interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  cursorColor?: string;
  cursorColorOnTarget?: string;
}

export default function TargetCursor({
  targetSelector = '.cursor-target',
  spinDuration = 3,
  cursorColor = '#3b7dc4',
  cursorColorOnTarget = '#8bbced',
}: TargetCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const containingBlockRef = useRef<HTMLElement | null>(null);
  const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(null);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef({ current: 0 });

  const disabled = useMemo(() => {
    if (typeof window === 'undefined') return true;
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const small = window.innerWidth <= 768;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return (touch && small) || reduced;
  }, []);

  const constants = useMemo(() => ({ borderWidth: 3, cornerSize: 12 }), []);

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    const { x: offsetX, y: offsetY } = getContainingBlockOffset(containingBlockRef.current);
    gsap.to(cursorRef.current, { x: x - offsetX, y: y - offsetY, duration: 0.1, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    if (disabled || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = 'none';

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll<HTMLElement>('.target-cursor-corner');
    containingBlockRef.current = getContainingBlock(cursor);
    const getOffset = () => getContainingBlockOffset(containingBlockRef.current);

    let activeTarget: HTMLElement | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

    const cleanupTarget = (target: HTMLElement) => {
      if (currentLeaveHandler) target.removeEventListener('mouseleave', currentLeaveHandler);
      currentLeaveHandler = null;
    };

    const initialOffset = getOffset();
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y,
    });

    const createSpin = () => {
      spinTl.current?.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };
    createSpin();

    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cornersRef.current) return;
      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;
      const cursorX = num(gsap.getProperty(cursor, 'x') as number);
      const cursorY = num(gsap.getProperty(cursor, 'y') as number);
      Array.from(cornersRef.current).forEach((corner, i) => {
        const currentX = num(gsap.getProperty(corner, 'x') as number);
        const currentY = num(gsap.getProperty(corner, 'y') as number);
        const targetX = targetCornerPositionsRef.current![i].x - cursorX;
        const targetY = targetCornerPositionsRef.current![i].y - cursorY;
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        const duration = strength >= 0.99 ? 0.2 : 0.05;
        gsap.to(corner, { x: finalX, y: finalY, duration, ease: 'power1.out', overwrite: 'auto' });
      });
    };
    tickerFnRef.current = tickerFn;

    const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const mouseDownHandler = () => {
      if (dotRef.current) gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursor, { scale: 0.9, duration: 0.2 });
    };
    const mouseUpHandler = () => {
      if (dotRef.current) gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    };
    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const enterHandler = (e: MouseEvent) => {
      let current = e.target as HTMLElement | null;
      let target: HTMLElement | null = null;
      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          target = current;
          break;
        }
        current = current.parentElement;
      }
      if (!target || !cornersRef.current) return;
      if (activeTarget === target) return;
      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner) => gsap.killTweensOf(corner, 'x,y'));
      gsap.killTweensOf(cursor, 'rotation');
      spinTl.current?.pause();
      gsap.set(cursor, { rotation: 0 });

      gsap.to(corners, { borderColor: cursorColorOnTarget, duration: 0.15, ease: 'power2.out' });
      if (dotRef.current)
        gsap.to(dotRef.current, { backgroundColor: cursorColorOnTarget, duration: 0.15 });

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const { x: offsetX, y: offsetY } = getOffset();
      const cursorX = num(gsap.getProperty(cursor, 'x') as number);
      const cursorY = num(gsap.getProperty(cursor, 'y') as number);

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
        {
          x: rect.right + borderWidth - cornerSize - offsetX,
          y: rect.bottom + borderWidth - cornerSize - offsetY,
        },
        { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
      ];

      if (tickerFnRef.current) gsap.ticker.add(tickerFnRef.current);
      gsap.to(activeStrengthRef.current, { current: 1, duration: 0.2, ease: 'power2.out' });
      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current![i].x - cursorX,
          y: targetCornerPositionsRef.current![i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out',
        });
      });

      const leaveHandler = () => {
        if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
        activeTarget = null;

        if (cornersRef.current) {
          const cs = Array.from(cornersRef.current);
          gsap.to(cs, { borderColor: cursorColor, duration: 0.15, ease: 'power2.out' });
          if (dotRef.current) gsap.to(dotRef.current, { backgroundColor: cursorColor, duration: 0.15 });
          gsap.killTweensOf(cs, 'x,y');
          const { cornerSize: sz } = constants;
          const positions = [
            { x: -sz * 1.5, y: -sz * 1.5 },
            { x: sz * 0.5, y: -sz * 1.5 },
            { x: sz * 0.5, y: sz * 0.5 },
            { x: -sz * 1.5, y: sz * 0.5 },
          ];
          const tl = gsap.timeline();
          cs.forEach((corner, index) => {
            tl.to(corner, { x: positions[index].x, y: positions[index].y, duration: 0.3, ease: 'power3.out' }, 0);
          });
        }

        resumeTimeout = setTimeout(() => {
          if (!activeTarget && spinTl.current) createSpin();
          resumeTimeout = null;
        }, 50);

        cleanupTarget(target!);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };
    window.addEventListener('mouseover', enterHandler, { passive: true });

    const resizeHandler = () => {
      containingBlockRef.current = getContainingBlock(cursor);
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      if (activeTarget) cleanupTarget(activeTarget);
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
    };
  }, [targetSelector, spinDuration, moveCursor, constants, disabled, cursorColor, cursorColorOnTarget]);

  if (disabled) return null;

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" style={{ backgroundColor: cursorColor }} />
      <div className="target-cursor-corner corner-tl" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-tr" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-br" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-bl" style={{ borderColor: cursorColor }} />
    </div>
  );
}
