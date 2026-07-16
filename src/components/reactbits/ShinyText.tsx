import type { ElementType, ReactNode } from 'react';

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
  /** Element to render as; defaults to span so it can sit inside any heading. */
  as?: ElementType;
  /** Animation duration override, e.g. '2.5s'. */
  speed?: string;
}

/**
 * React Bits-style "Shiny Text": a light sheen sweeps across gradient-clipped
 * text on a loop. Pure CSS background-position animation — no dependencies.
 */
export default function ShinyText({
  children,
  className = '',
  as: Tag = 'span',
  speed,
}: ShinyTextProps) {
  return (
    <Tag className={`shiny-text ${className}`} style={speed ? { animationDuration: speed } : undefined}>
      {children}
    </Tag>
  );
}
