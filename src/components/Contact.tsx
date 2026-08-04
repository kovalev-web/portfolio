import { profile } from '../data/content';
import './contact.css';

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="shell">
        <div className="contact-card">
          <div className="contact-body">
            <h2 className="contact-title reveal reveal-lg">
              Have a product
              <br />
              that needs design work?
            </h2>

            <div className="contact-footer reveal" style={{ '--d': '220ms' } as React.CSSProperties}>
              <nav className="contact-links" aria-label="Social">
                {profile.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </nav>

              <p className="contact-copy">
                © {new Date().getFullYear()} {profile.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
