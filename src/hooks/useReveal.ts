import { useEffect } from 'react';

/**
 * Adds `.is-visible` to every `.reveal` element once it enters the viewport.
 * One observer for the whole page rather than one per component.
 *
 * Pass `key` to re-scan — a route change swaps the whole page, and elements
 * mounted after the observer was built would otherwise never be observed and
 * sit at opacity 0 forever.
 */
export function useReveal(key?: unknown) {
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
      // The bottom inset must stay smaller than the last element's clearance
      // from the end of the document, or that element can never intersect and
      // stays at opacity 0 forever. A percentage cannot guarantee that — at
      // viewport heights above ~960px, -8% exceeded the footer's own bottom
      // padding and permanently hid it. A fixed inset is viewport-independent.
      { threshold: 0.15, rootMargin: '0px 0px -16px 0px' },
    );

    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
}
