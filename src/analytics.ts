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

/**
 * My own visits. Loading any page with `?noph=1` sets this flag; `?noph=0`
 * clears it. It has to be a client-side switch: the `phc_` key is public and
 * shared with every visitor, so there is nothing to exclude on server, and
 * PostHog's "internal and test users" setting only hides rows in the UI —
 * events and replays are still ingested.
 *
 * localStorage, so it survives across visits, but it is per browser profile
 * and per device: set it once on each, and again after clearing site data.
 */
const OPT_OUT = 'ph_opt_out';

export function initAnalytics() {
  // `npm run dev` and `vite preview` would otherwise post real events, and the
  // /ingest proxy is a Vercel rewrite that does not exist locally either.
  if (window.location.hostname === 'localhost') return;

  const noph = new URLSearchParams(window.location.search).get('noph');
  if (noph === '1') localStorage.setItem(OPT_OUT, '1');
  if (noph === '0') localStorage.removeItem(OPT_OUT);
  // Checked before the import below, so an opted-out browser does not even
  // download the tracker.
  if (localStorage.getItem(OPT_OUT)) return;

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
