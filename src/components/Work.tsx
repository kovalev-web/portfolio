import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { visibleProjects as projects } from '../data/content';
import { onNavClick } from '../hooks/useRoute';
import './work.css';

/**
 * Selected work — a type-led list rather than a card grid.
 * Hovering a row slides the title and pulls a preview tile under the cursor.
 */
export default function Work() {
  const [hover, setHover] = useState<number | null>(null);

  // Null until the pointer's location is actually known — not {0, 0}. The
  // preview is `position: fixed` at the origin, and a row can go from
  // un-hovered to hovered without the pointer ever moving: scroll with the
  // cursor parked over the list and the rows travel under it, which fires
  // mouseenter but never mousemove. Seeded with zeroes, that painted the tile
  // in the top-left corner of the viewport until the pointer was moved.
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const track = (e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section id="work" className="work">
      <div className="rail">
        <p className="kicker reveal">Commercial work</p>

        <div className="work-list" onMouseMove={track} onMouseLeave={() => setHover(null)}>
          {projects.map((p, i) => (
            <a
              key={p.title}
              className="work-row reveal"
              href={p.href}
              onClick={onNavClick}
              // Reads the position off the enter event too, not just mousemove:
              // when a row scrolls under a still pointer this is the only event
              // that fires, and it already carries the coordinates.
              onMouseEnter={(e) => {
                setHover(i);
                track(e);
              }}
            >
              <span className="work-text">
                <span className="work-title">{p.title}</span>
                <span className="work-kicker">{p.kicker}</span>
              </span>
              <span className="work-arrow" aria-hidden="true">
                <ArrowRight size={18} strokeWidth={1.75} />
              </span>
            </a>
          ))}

          {/* Cursor-following preview: the hovered project's cover. */}
          <div
            className="work-preview"
            data-on={hover !== null && pos !== null}
            style={
              pos
                ? { transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)` }
                : undefined
            }
            aria-hidden="true"
          >
            {projects.map((p, i) => (
              <img
                key={p.href}
                className="work-preview-shot"
                data-active={hover === i}
                src={p.cover}
                alt=""
                width={900}
                height={584}
                decoding="async"
                // Low, not lazy: lazy would never fire for a tile that is
                // `position: fixed` at zero opacity, but these must not race the
                // hero for bandwidth either.
                fetchPriority="low"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
