import { profile } from '../data/content';
import GradientCanvas, { SURFACE_PALETTE } from '../webgl/GradientCanvas';
import { FRAG } from '../webgl/gradient.glsl';
import './contact.css';

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="shell">
        {/* Same shader and palette as the hero card — one surface, not a
            second unrelated gradient. --hero-blue stays as the flat
            fallback under it. */}
        <div className="contact-card on-media">
          <GradientCanvas palette={SURFACE_PALETTE} className="contact-canvas" speed={1.5} grain={0.012} frag={FRAG} />

          <div className="contact-body">
            <h2 className="contact-title reveal reveal-lg">
              Have a product
              <br />
              <strong>that needs design work?</strong>
            </h2>

            <div className="contact-actions reveal" style={{ '--d': '220ms' } as React.CSSProperties}>
              <a className="star-button" href={`mailto:${profile.email}`}>
                <span aria-hidden="true">✦</span>
                Let&apos;s talk
                <span aria-hidden="true">✦</span>
              </a>
              <p className="contact-mail">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
