import { Lock } from 'lucide-react';
import { ndaWork } from '../data/content';
import './nda.css';

/**
 * Locked continuation of Selected work — shipped projects that can't get a
 * case page because they're covered by an NDA. Counted, not linked: there's
 * no destination behind these, so the tiles are plain `<li>`s, not buttons.
 */
export default function Nda() {
  return (
    <section id="nda" className="nda">
      <div className="rail">
        <p className="kicker reveal">Also under NDA</p>
        <p className="nda-intro reveal" style={{ '--d': '80ms' } as React.CSSProperties}>
          Not everything I&apos;ve shipped can be a case study — some of it lives behind an
          NDA instead.
        </p>

        <ul className="nda-grid">
          {ndaWork.map((item, i) => (
            <li
              className="nda-item reveal"
              key={item.label}
              style={{ '--d': `${i * 70}ms` } as React.CSSProperties}
            >
              <span className="nda-value-row">
                <span className="nda-value">{item.value}</span>
                <Lock size={22} strokeWidth={1.75} aria-hidden="true" className="nda-lock" />
              </span>
              <span className="nda-label kicker">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
