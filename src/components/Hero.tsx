import { useEffect, useState } from 'react';
import GradientCanvas, { SURFACE_PALETTE, SURFACE_PALETTE_LIGHT } from '../webgl/GradientCanvas';
import { FRAG, FRAG_LIGHT } from '../webgl/gradient.glsl';
import { useTheme } from '../hooks/useTheme';
import { useCarousel } from '../hooks/useCarousel';
import { profile, heroProjects } from '../data/content';
import type { ReactNode } from 'react';
import './hero.css';

/** Must match the transform transition duration in hero.css. */
const TRANSITION_MS = 900;
const ROTATE_MS = 4500;

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

export default function Hero() {
  const { theme } = useTheme();
  const { index, go, hoverProps } = useCarousel(heroProjects.length, ROTATE_MS);

  // `settled` is the project actually painted at rest. It trails `index` by
  // one transition — that's what keeps the outgoing shot on screen for the
  // full slide instead of it popping away the instant the carousel advances.
  const [settled, setSettled] = useState(index);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (index === settled) return;

    setIncoming(index);
    setArmed(false);

    // Two rAFs, not one: the browser needs a committed paint of the "parked"
    // start position before `.is-shifting` lands, or the transition has
    // nothing to animate from and the shot just snaps to its end state.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setArmed(true));
    });

    const t = window.setTimeout(() => {
      setSettled(index);
      setIncoming(null);
      setArmed(false);
    }, TRANSITION_MS);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(t);
    };
  }, [index, settled]);

  const shots = heroProjects[settled];
  const incomingShots = incoming !== null ? heroProjects[incoming] : null;

  return (
    <section className="hero">
      <div className="shell">
        <div className="hero-card">
          <GradientCanvas palette={theme === 'dark' ? SURFACE_PALETTE : SURFACE_PALETTE_LIGHT} className="hero-canvas" speed={1.5} grain={0.012} frag={theme === 'dark' ? FRAG : FRAG_LIGHT} />

          <div className="hero-media" {...hoverProps}>
            {shots.map((shot, i) => (
              <div className="hero-media-card" key={i}>
                {/* Both layers need an explicit, distinctly-namespaced key —
                    React only reconciles a mix of keyed and unkeyed siblings
                    by position, which briefly mismatched instances here and
                    left a shot stuck off-screen after the slide finished. */}
                {incomingShots && (
                  <Shot
                    key={`out-${settled}`}
                    shot={shot}
                    className={`hero-shot hero-shot-out${armed ? ' is-shifting' : ''}`}
                  />
                )}
                <Shot
                  key={`in-${incoming ?? settled}`}
                  shot={(incomingShots ?? shots)[i]}
                  className={incomingShots ? `hero-shot hero-shot-in${armed ? ' is-shifting' : ''}` : 'hero-shot'}
                />
              </div>
            ))}
          </div>
          <div className="hero-dots" role="tablist" aria-label="Project carousel">
            {heroProjects.map((_, i) => (
              <button
                key={i}
                role="tab"
                className={`hero-dot${i === (incoming ?? settled) ? ' is-active' : ''}`}
                onClick={() => go(i)}
                aria-label={`Show project ${i + 1}`}
                aria-selected={i === (incoming ?? settled)}
              />
            ))}
          </div>

          {/* Copy sits in a notch carved out of the card's bottom-left */}
          <div className="hero-copy">
            <h1 className="hero-title reveal reveal-lg">{profile.headline}</h1>

            <a
              className="scroll-cue reveal"
              style={{ '--d': '350ms' } as React.CSSProperties}
              href="#work"
              aria-label="Scroll to work"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 4v15m0 0 6-6m-6 6-6-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
