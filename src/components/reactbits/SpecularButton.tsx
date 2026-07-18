import { useRef, type ReactNode, type MouseEvent } from 'react';
import './SpecularButton.css';

// React Bits-style "Specular Button": a soft specular highlight tracks the
// cursor across the button surface. Dependency-free (CSS custom props + a
// pointer handler). Renders a <button> or, when `as="span"`, a span so it can
// live inside a router <Link>.

interface SpecularButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'span';
  type?: 'button' | 'submit';
}

export default function SpecularButton({
  children,
  className = '',
  onClick,
  as = 'button',
  type = 'button',
}: SpecularButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spec-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--spec-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const content = (
    <>
      <span className="specular-sheen" aria-hidden />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (as === 'span') {
    return (
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        onMouseMove={onMove}
        className={`specular-button ${className}`}
      >
        {content}
      </span>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      onMouseMove={onMove}
      className={`specular-button ${className}`}
    >
      {content}
    </button>
  );
}
