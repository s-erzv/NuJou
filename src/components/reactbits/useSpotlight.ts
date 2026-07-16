import { useCallback, useRef } from 'react';
import type { MouseEvent } from 'react';

/**
 * Powers the React Bits-style "Spotlight Card" effect: a radial glow that
 * follows the cursor within a container. Returns a ref + mouse handler to
 * spread onto any element (div, a, Link) — pair with a `.spotlight-glow`
 * child span and the `.spotlight-host` class (see index.css).
 */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  const onMouseMove = useCallback((e: MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }, []);

  return { ref, onMouseMove };
}
