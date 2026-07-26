import { useCallback, useEffect, useRef, useState } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Live, not read-once: the setting can be toggled while the page is open, and
 * a carousel that only checked it at mount would keep spinning until reload.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(REDUCED_MOTION).matches);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION);
    const sync = () => setReduced(mq.matches);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return reduced;
}

export function useCarousel(length: number, intervalMs = 4000) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  // Content that advances on its own is the thing this setting asks us to
  // stop, so the rotation halts outright rather than just losing its slide.
  // `go` still works — the deck stays reachable through the pagination.
  const reducedMotion = usePrefersReducedMotion();

  // Bumped on every manual jump purely to restart the interval below, so a
  // click doesn't get cut short by whatever was left of the previous tick.
  const [nudge, setNudge] = useState(0);

  const go = useCallback((i: number) => {
    setIndex(((i % length) + length) % length);
    setNudge((n) => n + 1);
  }, [length]);

  const next = useCallback(() => {
    setIndex((i: number) => (i + 1) % length);
  }, [length]);

  useEffect(() => {
    if (paused || reducedMotion || length < 2) return;

    timer.current = window.setInterval(next, intervalMs);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [paused, reducedMotion, length, intervalMs, next, nudge]);

  const hoverProps = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
  };

  return { index, go, next, hoverProps };
}
