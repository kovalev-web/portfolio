import { useRef, useState } from 'react';
import './cv.css';

const PASSWORD = 'allright';

export default function Cv() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);

  const check = () => {
    const value = inputRef.current?.value ?? '';
    if (value === PASSWORD) {
      const a = document.createElement('a');
      a.href = '/dmitrii_kovalev.pdf';
      a.download = 'dmitrii_kovalev.pdf';
      a.click();
    } else {
      if (inputRef.current) inputRef.current.value = '';
      setError(false);
      requestAnimationFrame(() => setError(true));
    }
  };

  return (
    <main className="cv-gate">
      <div className="cv-gate-inner">
        <span className="cv-gate-label">Dmitrii Kovalev — CV.pdf</span>
        <div
          className={`cv-gate-row${error ? ' error' : ''}`}
          onAnimationEnd={() => setError(false)}
        >
          <input
            ref={inputRef}
            type="password"
            className="cv-gate-input"
            placeholder="password to download"
            autoComplete="off"
            onKeyDown={(e) => e.key === 'Enter' && check()}
          />
          <button className="cv-gate-submit" onClick={check} aria-label="Download CV">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v13M6 11l6 6 6-6M3 21h18"
              />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
