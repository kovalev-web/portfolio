import { profile } from '../data/content';
import './hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="shell hero-grid">
        {/* Greeting and headline share one grid cell rather than taking a row
            each — otherwise the folder in column 3 would align itself to the
            greeting's row instead of to the text block as a whole. */}
        <div className="hero-text">
          <p className="hero-greeting reveal">{profile.greeting}</p>
          <h1 className="hero-title reveal reveal-lg">{profile.headline}</h1>
        </div>

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
