/**
 * Tiny dependency-free confetti burst. Draws on a temporary full-screen
 * canvas and cleans itself up when the animation finishes.
 */
export function burstConfetti(durationMs = 1800) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  const ratio = window.devicePixelRatio || 1;
  const resize = () => {
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
  };
  resize();
  ctx.scale(ratio, ratio);

  const W = window.innerWidth;
  const H = window.innerHeight;
  const colors = ['#3b7dc4', '#62a0e0', '#8bbced', '#aed3f2', '#f59e0b', '#fbbf24'];
  const N = 140;

  type P = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rot: number;
    vrot: number;
  };

  const parts: P[] = Array.from({ length: N }, () => ({
    x: W / 2 + (Math.random() - 0.5) * 120,
    y: H / 3,
    vx: (Math.random() - 0.5) * 12,
    vy: Math.random() * -12 - 4,
    size: Math.random() * 7 + 4,
    color: colors[(Math.random() * colors.length) | 0],
    rot: Math.random() * Math.PI,
    vrot: (Math.random() - 0.5) * 0.3,
  }));

  const gravity = 0.32;
  const start = performance.now();

  const frame = (now: number) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, W, H);
    parts.forEach((p) => {
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - elapsed / durationMs);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    if (elapsed < durationMs) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  };

  window.addEventListener('resize', resize, { once: true });
  requestAnimationFrame(frame);
}
