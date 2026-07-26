import { profile } from '../data/content';
import './contact.css';

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="shell">
        {/* Flat --hero-blue, no shader — the card is the same surface as the
            hero, just without the gradient running on it. */}
        <div className="contact-card">
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
