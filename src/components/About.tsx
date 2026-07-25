import { profile } from '../data/content';
import './about.css';

export default function About() {
  return (
    <section id="about" className="about">
      <div className="rail about-grid">
        <div className="about-media reveal" aria-hidden="true">
          {/* Swap for <video autoPlay muted loop playsInline poster="…"> or a
              portrait once assets land in /public/media. */}
          <div className="about-media-fill" />
        </div>

        <div className="about-text">
          <p className="kicker reveal">About</p>
          <p className="about-bio reveal" style={{ '--d': '120ms' } as React.CSSProperties}>
            {profile.bio}
          </p>

          <a
            className="star-button reveal"
            style={{ '--d': '240ms' } as React.CSSProperties}
            href="#contact"
          >
            <span aria-hidden="true">✦</span>
            Get in touch
            <span aria-hidden="true">✦</span>
          </a>
        </div>
      </div>
    </section>
  );
}
