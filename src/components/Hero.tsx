import { useState } from 'react';
import GradientCanvas, { type Palette } from '../webgl/GradientCanvas';
import { profile, heroMedia } from '../data/content';
import type { ReactNode } from 'react';
import './hero.css';

function MediaCard({ item, index }: { item: { src: string; alt: string }; index: number }): ReactNode {
  const [ok, setOk] = useState(true);

  if (!item.src || !ok) {
    return (
      <div className="hero-media-card" style={{ '--i': index } as React.CSSProperties}>
        <div className="hero-media-placeholder">
          <span className="hero-media-label">{item.alt || `Shot ${index + 1}`}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-media-card" style={{ '--i': index } as React.CSSProperties}>
      <img src={item.src} alt={item.alt} onError={() => setOk(false)} />
    </div>
  );
}

/**
 * Four tones of #27364E. Kept inside one colour family on purpose — the card
 * should read as that colour, slowly breathing, not as a rainbow gradient.
 */
const PALETTE: Palette = ['#1c2739', '#27364e', '#31455f', '#3a5271'];

export default function Hero() {

  return (
    <section className="hero">
      <div className="shell">
        <div className="hero-card">
          <GradientCanvas palette={PALETTE} className="hero-canvas" speed={1.5} grain={0.012} />

          <div className="hero-media">
            {heroMedia.map((item, i) => (
              <MediaCard key={i} item={item} index={i} />
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
