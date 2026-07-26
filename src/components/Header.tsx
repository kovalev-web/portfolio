import { useEffect, useState } from 'react';
import { profile } from '../data/content';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from './ThemeToggle';
import './header.css';

const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  // Lock scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="top-line" aria-hidden="true" />
      <div className="right-corner" aria-hidden="true" />
      <div className="shell header-inner">
        {/*
          The logo sits in a notch cut out of the hero card: `.notch` fills
          with the page background and the two ::before/::after fillets carve
          the concave corners. Always visible — same as the reference whose
          SVG corners never disappear.
        */}
        <div className="notch">
          <a className="logo" href="/" aria-label="Home">
            <img className="logo-avatar" src={profile.avatar} alt="" width="46" height="46" />
            <span className="logo-text">
              Dmitrii
              <br />
              Kovalev
            </span>
          </a>

          <button
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>

        <nav className="nav-pill" aria-label="Main">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>
      </div>

      <div id="mobile-nav" className="mobile-sheet" data-open={open}>
        {NAV.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <button
          className="mobile-theme-toggle"
          onClick={toggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? '☀︎ Light' : '☾ Dark'}
        </button>
      </div>
    </header>
  );
}
