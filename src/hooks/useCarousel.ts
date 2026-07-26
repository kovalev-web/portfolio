import { useCallback, useEffect, useRef, useState } from 'react';

export function useCarousel(length: number, intervalMs = 4000) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  const go = useCallback((i: number) => {
    setIndex(((i % length) + length) % length);
    setPaused(true);
  }, [length]);

  const next = useCallback(() => {
    setIndex((i: number) => (i + 1) % length);
  }, [length]);

  useEffect(() => {
    if (paused || length < 2) return;

    timer.current = window.setInterval(next, intervalMs);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [paused, length, intervalMs, next]);

  const hoverProps = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
  };

  return { index, go, next, hoverProps };
}
