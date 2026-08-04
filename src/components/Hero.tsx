import { profile } from '../data/content';
import './hero.css';

export default function Hero() {
  const [lead, rest] = profile.headline.split('9 years');

  return (
    <section className="hero">
      <div className="shell">
        <h1 className="hero-title reveal reveal-lg">
          {lead}
          <strong>9 years</strong>
          {rest}
        </h1>
      </div>
    </section>
  );
}
