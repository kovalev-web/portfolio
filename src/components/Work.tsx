import { useState } from 'react';
import { projects } from '../data/content';
import './work.css';

/**
 * Selected work — a type-led list rather than a card grid.
 * Hovering a row slides the title and pulls a preview tile under the cursor.
 */
export default function Work() {
  const [hover, setHover] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section id="work" className="work">
      <div className="rail">
        <p className="kicker reveal">Selected work</p>

        <div
          className="work-list"
          data-dim={hover !== null}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          {projects.map((p, i) => (
            <a
              key={p.title}
              className="work-row reveal"
              href={p.href}
              // Dimming keys off this rather than `:hover`, so crossing the
              // ~22px margin between rows doesn't briefly fade the whole list.
              data-active={hover === i}
              onMouseEnter={() => setHover(i)}
            >
              <span className="work-kicker">{p.kicker}</span>
              <span className="work-title">{p.title}</span>
            </a>
          ))}

          {/* Cursor-following preview. Replace the gradient with a real
              screenshot once /public/media is populated. */}
          <div
            className="work-preview"
            data-on={hover !== null}
            style={{ transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
