import { useEffect, useRef, useState } from 'react';
import { experience } from '../data/content';
import './tags.css';
import './experience.css';

/** Gap left between the fixed header's bottom edge and an opened row. */
const ROW_GAP = 12;

/**
 * Scrolls an opening row's heading to just under the fixed header, in one go.
 *
 * The awkward part is that opening a row also collapses whichever row was open
 * before, so when that row sits above this one, this one is about to rise by
 * the outgoing panel's full height (~420px here) over the panel's 0.45s
 * transition. A target measured naively is therefore a target that stops being
 * true one frame later.
 *
 * This used to be handled by a rAF loop that re-measured the row every frame
 * and corrected the difference. It was accurate and it shook itself apart on
 * mobile Chrome: three forced layouts a frame (getBoundingClientRect, scrollBy,
 * and the main-thread grid-template-rows animation), fighting the browser's own
 * scroll anchoring — which compensates for the very same collapse, so both
 * corrections landed and then had to be undone — and nudging the address bar,
 * whose show/hide moved the viewport the loop was measuring against.
 *
 * So: predict instead of chase. The outgoing panel's height is knowable right
 * now, before it animates, which makes the row's final position knowable too —
 * one native smooth scroll, run on the browser's own scroller, no per-frame JS
 * and nothing for the browser to fight with.
 */
function scrollRowUnderHeader(row: HTMLElement, collapseAbove: number) {
  const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
  const rowTop = row.getBoundingClientRect().top;

  const target = window.scrollY + rowTop - headerH - ROW_GAP - collapseAbove;
  // The document is about to grow by the opening panel, but it hasn't yet, so
  // clamp to what is scrollable right now rather than overshooting into space
  // that doesn't exist until the transition runs.
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  // The options object's `behavior` beats the stylesheet's `scroll-behavior`,
  // so reduced motion has to be honoured here rather than left to base.css.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.scrollTo({
    top: Math.max(0, Math.min(target, maxScroll)),
    behavior: reduced ? 'auto' : 'smooth',
  });
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
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** Which row is collapsing, so its height can be subtracted before it goes. */
  const closing = useRef<number | null>(null);

  // Pulls the row's heading up to just under the fixed header once it opens,
  // rather than leaving it wherever the click happened to land it — on a
  // phone, opening a row near the bottom of the viewport otherwise expands
  // the panel straight off the bottom edge, out of view.
  useEffect(() => {
    const outgoing = closing.current;
    closing.current = open;
    if (open === null) return;
    const row = itemRefs.current[open];
    if (!row) return;

    // Only a row above this one moves it when it collapses; one below shrinks
    // away from it and changes nothing. Rows render in document order, so the
    // index settles that without measuring anything.
    let collapseAbove = 0;
    if (outgoing !== null && outgoing < open) {
      // scrollHeight of the inner box, not the panel's own height: this runs
      // right after React flipped data-open, and forcing layout here reports
      // the grid track at its *new* size, so the panel measures as already
      // collapsed. The content height it is about to give up doesn't move.
      const inner = itemRefs.current[outgoing]?.querySelector<HTMLElement>('.exp-panel-inner');
      collapseAbove = inner?.scrollHeight ?? 0;
    }

    scrollRowUnderHeader(row, collapseAbove);
  }, [open]);

  return (
    <section id="experience" className="experience">
      <div className="rail">
        <p className="kicker reveal">Work experience</p>

        <div className="exp-list">
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
