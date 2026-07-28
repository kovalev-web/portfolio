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

  const hashIndex = href.indexOf('#');
  const path = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const hash = hashIndex === -1 ? null : href.slice(hashIndex + 1);
  const targetPath = path || '/';

  // Same-page anchor (e.g. clicking "/#work" while already on "/") — that's
  // the browser's job, it scrolls straight there with no route change.
  // Cross-page anchor (that link from a case study) is a real path change:
  // pushState first, then find the target once the new page has rendered —
  // a plain anchor left the browser trying to scroll to an element that
  // doesn't exist yet, which just landed on "/" with no scroll at all.
  if (hash && targetPath === window.location.pathname) return;

  e.preventDefault();
  navigate(targetPath);

  if (hash) {
    // A macrotask, not requestAnimationFrame — this only needs to run after
    // React has committed the new route, not after a specific paint, and
    // rAF doesn't fire at all for a backgrounded/unfocused tab.
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView();
    }, 0);
  } else {
    window.scrollTo(0, 0);
  }
}
