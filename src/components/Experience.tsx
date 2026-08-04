import { useEffect, useRef, useState } from 'react';
import { experience } from '../data/content';
import './tags.css';
import './experience.css';

/** Gap left between the fixed header's bottom edge and an opened row. */
const ROW_GAP = 12;
/** Comfortably outlasts .exp-panel's 0.45s grid-template-rows transition. */
const SETTLE_MS = 520;
/** Snappier than the browser's own smooth scroll, which drags for short hops. */
const SCROLL_MS = 320;

/**
 * Eases the row's heading to just under the fixed header, then holds it there
 * until the accordion has finished rearranging.
 *
 * The holding is the point. Opening a row also collapses whichever row was open
 * before, and when that row is above this one, the collapse drags this one
 * upwards by the old panel's full height (~420px here) across the panel's 0.45s
 * transition. So a scroll aimed at a target measured at click time is aimed at
 * a position that stops being true one frame later: it arrives, and then the
 * still-collapsing layout keeps sliding the row out from under it.
 *
 * Hence no fixed destination. Each frame this re-reads where the row actually
 * is and corrects for the difference, absorbing the collapse while it happens —
 * the row rises under the header and stays pinned there as everything above it
 * rearranges. Same reason the loop outlives the ease: the layout is still
 * moving after the scrolling has stopped.
 *
 * Returns a cancel fn; a second click mid-flight has to stop the first loop
 * rather than leave two of them fighting over window.scrollY.
 */
function scrollRowUnderHeader(el: HTMLElement, duration: number) {
  const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
  const targetTop = headerH + ROW_GAP;
  const startTop = el.getBoundingClientRect().top;
  const start = performance.now();
  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

  let raf = 0;
  const cancel = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
    window.removeEventListener('keydown', cancel);
  };

  function step(now: number) {
    const elapsed = now - start;
    const t = duration > 0 ? Math.min(elapsed / duration, 1) : 1;
    // Where the row's top should be this frame, versus where the current
    // layout has actually put it.
    const wantTop = startTop + (targetTop - startTop) * easeOutQuart(t);
    const drift = el.getBoundingClientRect().top - wantTop;

    // `behavior: 'instant'` matters here — the page sets CSS
    // `scroll-behavior: smooth` globally, which a plain scroll call inherits
    // too. Without overriding it, every one of these per-frame nudges kicks
    // off its own smoothed hop, and they stack into a jittery scroll instead
    // of the single steady one this rAF loop is driving.
    if (Math.abs(drift) >= 0.5) window.scrollBy({ top: drift, behavior: 'instant' });

    if (elapsed < SETTLE_MS) raf = requestAnimationFrame(step);
    else cancel();
  }

  // Hand the page straight back if the reader starts scrolling themselves,
  // rather than fighting them for the rest of the settle window.
  window.addEventListener('wheel', cancel, { passive: true, once: true });
  window.addEventListener('touchstart', cancel, { passive: true, once: true });
  window.addEventListener('keydown', cancel, { once: true });
  raf = requestAnimationFrame(step);

  return cancel;
}

/**
 * Work history as a single-open accordion.
 *
 * Panels animate with `grid-template-rows: 0fr → 1fr` rather than a measured
 * pixel height — no ResizeObserver, no layout thrash, and it stays correct
 * when the text reflows at a different width.
 */
export default function Experience() {
  const [open, setOpen] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Pulls the row's heading up to just under the fixed header once it opens,
  // rather than leaving it wherever the click happened to land it — on a
  // phone, opening a row near the bottom of the viewport otherwise expands
  // the panel straight off the bottom edge, out of view.
  useEffect(() => {
    if (open === null) return;
    const el = itemRefs.current[open];
    if (!el) return;
    // Reduced motion still needs the correction pass (the row does have to end
    // up under the header), just without easing its way there.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return scrollRowUnderHeader(el, reduced ? 0 : SCROLL_MS);
  }, [open]);

  return (
    <section id="experience" className="experience">
      <div className="rail">
        <p className="kicker reveal">Work experience</p>

        <div className="exp-list" data-dim={hover !== null} onMouseLeave={() => setHover(null)}>
          {experience.map((job, i) => {
            const isOpen = open === i;
            const panelId = `exp-panel-${i}`;

            return (
              <div
                className="exp-item reveal"
                key={job.company + job.period}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-open={isOpen}
                data-active={hover === i}
                onMouseEnter={() => setHover(i)}
              >
                <h3 className="exp-heading">
                  <button
                    className="exp-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="exp-logo" data-initials={job.initials}>
                      {job.logo && (
                        <img
                          src={job.logo}
                          alt=""
                          loading="lazy"
                          // Missing file falls back to the initials underneath
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </span>

                    <span className="exp-text">
                      <span className="exp-company">{job.company}</span>
                      <span className="exp-role">{job.role}</span>
                    </span>

                    <span className="exp-period">{job.period}</span>

                    <span className="exp-toggle" aria-hidden="true">
                      <span />
                      <span />
                    </span>
                  </button>
                </h3>

                {/* `inert` rather than `hidden`: it keeps the panel in the
                    DOM so the 0fr→1fr transition can run, while still taking
                    the content out of the tab order and the a11y tree. */}
                <div className="exp-panel" id={panelId} role="region" inert={!isOpen}>
                  <div className="exp-panel-inner">
                    {job.summary && <p className="exp-summary">{job.summary}</p>}
                    <ul className="exp-bullets">
                      {job.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
