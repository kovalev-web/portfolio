import { profile } from '../data/content';
import './hero.css';

export default function Hero() {
  const [lead, rest] = profile.headline.split('9 years');

  return (
    <section className="hero">
      <div className="shell hero-grid">
        <h1 className="hero-title reveal reveal-lg">
          {lead}
          <strong>9 years</strong>
          {rest}
        </h1>

        {/* Flat export, so the folder's blur comes baked in from Figma rather
            than rebuilt on the page. Nothing on it is text as far as a screen
            reader or a crawler is concerned — hence the spelled-out label.
            Keep it in step if the artwork's copy changes. */}
        <div
          className="hero-folder reveal"
          role="img"
          aria-label="Case files, 2016 to 2025: fintech, CRM, B2B, trading, SaaS — mostly under NDA"
        />
      </div>
    </section>
  );
}
