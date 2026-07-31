/**
 * PostHog — same project as fixlist.dev, so the two sites share one dashboard.
 * Filter by `$host` there to separate them; swapping `KEY` for a key from a
 * second PostHog project is the only change needed to split them apart.
 *
 * The key is a public write-only client key (that is what `phc_` means), so it
 * lives in the source rather than in an env var: a `VITE_` var ends up inlined
 * in the bundle anyway, and this way the build has nothing to configure in
 * Vercel.
 *
 * `api_host` points at our own domain — see the `/ingest` rewrites in
 * vercel.json. Requests to posthog.com are a standard blocklist entry, so a
 * first-party path is the difference between counting visitors and counting
 * the ones without an ad blocker. `ui_host` only tells the toolbar which
 * region's dashboard to open; the project is on EU cloud.
 */
const KEY = 'phc_ouJze8EtH2Dkt4PMzDSaKm7mVb7A5v5Hy3DD93T2g4bE';

export function initAnalytics() {
  // `npm run dev` and `vite preview` would otherwise post real events, and the
  // /ingest proxy is a Vercel rewrite that does not exist locally either.
  if (window.location.hostname === 'localhost') return;

  // Deferred and dynamically imported: the tracker is ~60 kB gzipped and
  // nothing on screen waits for it, so it stays out of the entry chunk and
  // loads after the first render instead of competing with it.
  void import('posthog-js').then(({ default: posthog }) => {
    posthog.init(KEY, {
      api_host: '/ingest',
      ui_host: 'https://eu.posthog.com',
      // Pins the behaviour PostHog shipped on this date, so a future
      // posthog-js upgrade cannot silently change what gets captured. Among
      // other things it is what makes pageviews follow `history.pushState`,
      // which is how this site's router navigates.
      defaults: '2026-05-30',
      person_profiles: 'identified_only',
      // Session replay is on. fixlist.dev disables the autostart and calls
      // `startSessionRecording` per route because it must keep customer
      // reports out of the recordings; this site has no such page, so the
      // default autostart is what we want. The one input here is the CV
      // password field, and `type="password"` is masked by the recorder
      // unconditionally.
    });
  });
}
