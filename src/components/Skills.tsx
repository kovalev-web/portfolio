import { useEffect, useRef } from 'react';
import { skills } from '../data/content';
import './skills.css';

/**
 * Oversized type rows with a media tile that grows inline — width 0 → 12rem —
 * as each row scrolls through the middle of the viewport.
 *
 * The tile lives *between* two words rather than beside the row, so the line
 * physically opens up to make room for it.
 */
export default function Skills() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle('is-open', e.isIntersecting);
      },
      // Narrow band across the middle of the screen: rows open on the way in
      // and close on the way out, in both scroll directions.
      { rootMargin: '-35% 0px -35% 0px' },
    );

    root.querySelectorAll('.skill-media').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="skills" ref={rootRef}>
      <p className="kicker reveal">Skills &amp; services</p>

      <div className="skill-rows">
        {skills.map((s, i) => (
          <div
            className="skill-row reveal reveal-lg"
            key={s.before + s.after}
            style={{ '--d': `${i * 70}ms` } as React.CSSProperties}
          >
            <span>{s.before}</span>
            <span className="skill-media" aria-hidden="true">
              {/* Replace with <video muted loop playsInline src={s.media} /> */}
              <span className="skill-media-fill" />
            </span>
            <span>{s.after}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
