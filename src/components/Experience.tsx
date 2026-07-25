import { useState } from 'react';
import { experience } from '../data/content';
import './experience.css';

/**
 * Work history as a single-open accordion.
 *
 * Panels animate with `grid-template-rows: 0fr → 1fr` rather than a measured
 * pixel height — no ResizeObserver, no layout thrash, and it stays correct
 * when the text reflows at a different width.
 */
export default function Experience() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="experience" className="experience">
      <div className="rail">
        <p className="kicker reveal">Work experience</p>

        <div className="exp-list">
          {experience.map((job, i) => {
            const isOpen = open === i;
            const panelId = `exp-panel-${i}`;

            return (
              <div className="exp-item reveal" key={job.company + job.period} data-open={isOpen}>
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
