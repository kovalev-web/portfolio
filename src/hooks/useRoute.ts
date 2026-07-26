import { useEffect, useState } from 'react';

/**
 * The whole router. Two routes — the homepage and a case study — do not earn a
 * routing library in a project that otherwise ships React and nothing else.
 *
 * `popstate` only fires for back/forward, so `navigate` re-dispatches it after
 * pushing. That keeps one subscription for both directions instead of a
 * separate store.
 */
export function navigate(to: string) {
  if (to === window.location.pathname) return;
  window.history.pushState(null, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function useRoute() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  return path;
}

/**
 * Click handler for in-app links. Left as a real `href` in the markup so the
 * link is still copyable, openable in a new tab, and crawlable — the handler
 * only takes over the plain-left-click case.
 */
export function onNavClick(e: React.MouseEvent<HTMLAnchorElement>) {
  if (e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('/')) return;
  // Anchors like `/#work` are the browser's job — it has to land on the page
  // and find the target, which a pushState alone would not do.
  if (href.includes('#')) return;

  e.preventDefault();
  navigate(href);
}
