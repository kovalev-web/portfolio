import { onNavClick } from '../hooks/useRoute';
import './case-study.css';

/**
 * Shares the case page's stylesheet rather than owning one — it is the same
 * rail, the same header clearance, and two elements.
 */
export default function NotFound() {
  return (
    <main className="case">
      <div className="rail">
        <p className="kicker">404</p>
        <h1 className="case-title">This page doesn’t exist</h1>
        <p className="case-text">
          The link may be out of date, or the case study may have moved.
        </p>
        <a className="case-back kicker" href="/" onClick={onNavClick}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19 12H5M5 12l7-7M5 12l7 7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to work
        </a>
      </div>
    </main>
  );
}
