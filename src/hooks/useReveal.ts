import { useEffect } from 'react';

/**
 * Adds `.is-visible` to every `.reveal` element once it enters the viewport.
 * One observer for the whole page rather than one per component.
 *
 * Re-scans on mount only; call `rescan()` if you ever add nodes dynamically.
 */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target); // reveal once, then stop watching
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );

    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
