import GradientCanvas, { type Palette } from '../webgl/GradientCanvas';
import Grain from './Grain';
import { profile } from '../data/content';
import './contact.css';

/** Warmer than the hero so the two shader cards don't read as duplicates. */
const PALETTE: Palette = ['#120a2e', '#3c33c9', '#b32b52', '#c96a34'];

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="shell">
        <div className="contact-card on-media">
          <div className="contact-bg" aria-hidden="true">
            <GradientCanvas palette={PALETTE} speed={0.6} grain={0.02} className="contact-canvas" />
            <Grain opacity={0.09} />
            {/* Scrim: keeps the headline and CTA legible wherever the gradient
                happens to drift bright. */}
            <div className="contact-scrim" />
          </div>

          <div className="contact-body">
            <h2 className="contact-title reveal reveal-lg">
              Got a product that needs
              <br />
              <strong>real design work?</strong>
            </h2>

            <div className="contact-actions reveal" style={{ '--d': '220ms' } as React.CSSProperties}>
              <a className="star-button" href={`mailto:${profile.email}`}>
                <span aria-hidden="true">✦</span>
                Let&apos;s talk
                <span aria-hidden="true">✦</span>
              </a>
              <p className="contact-mail">
                Or reach out at <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
