import { useEffect, useRef, useState } from 'react';
import GradientCanvas, { SURFACE_PALETTE } from '../webgl/GradientCanvas';
import { FRAG } from '../webgl/gradient.glsl';
import { useCarousel } from '../hooks/useCarousel';
import { profile, heroDeck, heroProjectStarts } from '../data/content';
import type { ReactNode } from 'react';
import './hero.css';

const ROTATE_MS = 3000;

/** Cards standing in the fan at rest. The rest of the deck waits off-stage. */
const SLOTS = 3;

function Shot({ shot, className }: { shot: { src: string; alt: string }; className: string }): ReactNode {
  const [ok, setOk] = useState(true);

  if (!shot.src || !ok) {
    return (
      <div className={`${className} hero-shot-placeholder`}>
        <span className="hero-media-label">{shot.alt || 'Shot'}</span>
      </div>
    );
  }

  return <img className={className} src={shot.src} alt={shot.alt} onError={() => setOk(false)} />;
}

/**
 * Which slot card `i` stands on. Every card in the deck is always mounted; all
 * that ever changes is this string, and hero.css turns it into a transform —
 * that's what lets a card physically travel from one slot to the next instead
 * of the images scrolling inside fixed boxes.
 *
 * The three front slots are pure geometry: `rel` is the card's distance from
 * the front of the deck. The card that was at the front is the one exception —
 * it peels away downwards instead of vanishing, which is what makes the step
 * read as a deck being dealt rather than three pictures being swapped. Reverse
 * travel falls out for free: stepping back, the old front card is at rel 1, so
 * it slides to the middle slot instead of exiting, and the card that left last
 * flies back in.
 *
 * Everything else parks in `hidden`, which hero.css gives `transition: none`.
 * Cards recycle from below the card round to the tail of the deck through that
 * state, so the wrap-around never draws a flight back across the stack.
 */
function slotOf(i: number, active: number, prev: number, length: number): string {
  const rel = (i - active + length) % length;
  if (rel < SLOTS) return String(rel);
  return ((i - prev + length) % length) === 0 ? 'out-front' : 'hidden';
}

export default function Hero() {
  const { index, go, hoverProps } = useCarousel(heroDeck.length, ROTATE_MS);

  // The previously-active card, read during render so each card can tell
  // whether it is leaving the front of the fan or the back of it. A ref rather
  // than state: bumping it must not schedule a render of its own, or the
  // outgoing card would be painted a second time already parked off-stage.
  const prevRef = useRef(index);
  const prev = prevRef.current;
  useEffect(() => {
    prevRef.current = index;
  }, [index]);

  const activeProject = heroDeck[index].project;

  // A pagination click can skip several cards at once, and animating that is
  // what the single-step shuffle can't absorb: cards travel backwards into the
  // tail of the fan while the new project's cards sweep forward out of it, and
  // the crossings read as stray extra slides. So a jump only animates the card
  // peeling off the front — the new fan is simply already standing behind it.
  // A ±1 change is a real step and keeps its full travel.
  const delta = (index - prev + heroDeck.length) % heroDeck.length;
  const jumped = index !== prev && delta !== 1 && delta !== heroDeck.length - 1;

  return (
    <section className="hero">
      <div className="shell">
        <div className="hero-card">
          <GradientCanvas palette={SURFACE_PALETTE} className="hero-canvas" speed={1.5} grain={0.012} frag={FRAG} />

          {/* Hovering the deck pauses the rotation too — the cards are click
              targets, and a card that drifts mid-aim defeats the point. Focus
              pauses for the same reason: tabbing onto a card shouldn't have it
              slide away before Enter lands. */}
          <div className="hero-media" data-jump={jumped ? 'true' : undefined} {...hoverProps}>
            {heroDeck.map((shot, i) => {
              const slot = slotOf(i, index, prev, heroDeck.length);
              // All three standing cards are click targets. 'hidden' and
              // 'out-front' ones are covered or mid-exit, so a click there
              // can't land on the thing the user meant.
              const standing = slot === '0' || slot === '1' || slot === '2';
              const front = slot === '0';
              // A back card brings itself forward. The front card is already
              // there, so `go(i)` on it would do nothing at all — the switch
              // it can make is the next card, which is the same single step
              // the rotation takes.
              const activate = () => go(front ? i + 1 : i);
              return (
                <div
                  className="hero-media-card"
                  key={i}
                  data-slot={slot}
                  data-project={shot.project}
                  aria-hidden={!standing}
                  role={standing ? 'button' : undefined}
                  tabIndex={standing ? 0 : undefined}
                  onClick={standing ? activate : undefined}
                  onKeyDown={
                    standing
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            activate();
                          }
                        }
                      : undefined
                  }
                  aria-label={
                    standing
                      ? front
                        ? 'Show the next shot'
                        : `Bring ${shot.alt || 'this shot'} to the front`
                      : undefined
                  }
                >
                  <Shot shot={shot} className="hero-shot" />
                </div>
              );
            })}
          </div>
          <div className="hero-dots" role="tablist" aria-label="Project carousel" {...hoverProps}>
            {heroProjectStarts.map((start, p) => (
              <button
                key={p}
                role="tab"
                className={`hero-dot${p === activeProject ? ' is-active' : ''}`}
                onClick={() => go(start)}
                aria-label={`Show project ${p + 1}`}
                aria-selected={p === activeProject}
              />
            ))}
          </div>

          {/* Copy sits in a notch carved out of the card's bottom-left */}
          <div className="hero-copy">
            <h1 className="hero-title reveal reveal-lg">{profile.headline}</h1>
          </div>
        </div>
      </div>
    </section>
  );
}
