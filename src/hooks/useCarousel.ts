import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Minimal auto-advancing carousel index.
 *
 * The reference site pulls in Swiper (~140kb) for two small sliders; this is
 * the ~40 lines of it we actually need. Pauses on hover/focus and honours
 * reduced-motion.
 */
export function useCarousel(length: number, intervalMs = 4000) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  const go = useCallback((i: number) => setIndex(((i % length) + length) % length), [length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % length), [length]);

  useEffect(() => {
    if (paused || length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    timer.current = window.setInterval(next, intervalMs);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [paused, length, intervalMs, next]);

  /** Spread onto the slider root to pause while the user is interacting. */
  const hoverProps = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
  };

  return { index, go, next, hoverProps };
}
