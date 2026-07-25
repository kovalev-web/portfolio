import { useEffect, useState } from 'react';

/**
 * True while the page is scrolled to the very top.
 *
 * Used for exactly one thing: showing the header notch's concave fillets.
 * Those fillets bridge the notch to the hero card's edges, so they are only
 * geometrically meaningful at scroll 0 — the header is fixed while the card
 * scrolls away beneath it, which would leave them hanging over the card as
 * stray black beaks. (The reference has the same floating corners; they just
 * happen to be hidden behind its nav pill, which sits right beside the logo.
 * Ours sits far right, so they'd be fully exposed.)
 *
 * Nothing else keys off this — the avatar and name never move or resize.
 */
export function useAtTop() {
  const [atTop, setAtTop] = useState(() => window.scrollY <= 0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setAtTop(window.scrollY <= 0);
        raf = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return atTop;
}
