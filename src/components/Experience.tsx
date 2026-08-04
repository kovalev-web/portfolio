import { useEffect, useRef, useState } from 'react';
import { experience } from '../data/content';
import './tags.css';
import './experience.css';

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

  // Scrolls the row's heading to just under the fixed header once it opens,
  // rather than wherever the click happened to land it — on a phone, opening
  // a row near the bottom of the viewport otherwise expands the panel
  // straight off the bottom edge, out of view.
  //
  // Switching straight from one open row to another animates two panels at
  // once (the old one collapsing, the new one expanding) — scrolling before
  // either settles targets a position that's still moving, so this waits out
  // the 0.45s panel transition (see .exp-panel) before scrolling at all.
  useEffect(() => {
    if (open === null) return;
    const id = window.setTimeout(() => {
      itemRefs.current[open]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 460);
    return () => window.clearTimeout(id);
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
