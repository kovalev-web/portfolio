import { useState } from 'react';
import { projects } from '../data/content';
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
        <p className="kicker reveal">Selected work</p>

        <div
          className="work-list"
          data-dim={hover !== null}
          onMouseMove={track}
          onMouseLeave={() => setHover(null)}
        >
          {projects.map((p, i) => (
            <a
              key={p.title}
              className="work-row reveal"
              href={p.href}
              onClick={onNavClick}
              // Dimming keys off this rather than `:hover`, so crossing the
              // ~22px margin between rows doesn't briefly fade the whole list.
              data-active={hover === i}
              // Reads the position off the enter event too, not just mousemove:
              // when a row scrolls under a still pointer this is the only event
              // that fires, and it already carries the coordinates.
              onMouseEnter={(e) => {
                setHover(i);
                track(e);
              }}
            >
              <span className="work-kicker">{p.kicker}</span>
              <span className="work-title">{p.title}</span>
            </a>
          ))}

          {/* Cursor-following preview. Replace the gradient with a real
              screenshot once /public/media is populated. */}
          <div
            className="work-preview"
            data-on={hover !== null && pos !== null}
            style={
              pos
                ? { transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)` }
                : undefined
            }
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
