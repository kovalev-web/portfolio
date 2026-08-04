import { Menu, Sun, Moon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/content';
import { useTheme } from '../hooks/useTheme';
import { onNavClick } from '../hooks/useRoute';
import ThemeToggle from './ThemeToggle';
import './header.css';

// Rooted, not bare fragments: these sections only exist on the homepage, so
// from a case study the link has to go there first and then find the anchor.
const NAV = [
  { label: 'Experience', href: '/#experience' },
  // About — parked along with the section itself in App.tsx; restore both together.
  // { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#work' },
  { label: 'Contact', href: '/#contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Lock scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const backdropRef = useRef<HTMLDivElement>(null);

  // Tapping on the backdrop closes the menu. Native listener so it fires
  // before React's synthetic delegation and stops the click from reaching
  // page content behind the backdrop.
  useEffect(() => {
    const el = backdropRef.current;
    if (!el || !open) return;

    const onBackdropClick = (e: MouseEvent) => {
      e.stopPropagation();
      setOpen(false);
    };

    el.addEventListener('click', onBackdropClick, true);
    return () => el.removeEventListener('click', onBackdropClick, true);
  }, [open]);

  return (
    <>
      <header className="site-header" data-menu-open={open}>
      <div className="shell header-inner">
        <div className="notch">
          <a className="logo" href="/" aria-label="Home" onClick={(e) => { onNavClick(e); setOpen(false); }}>
            <img className="logo-avatar" src={profile.avatar} alt="" width="46" height="46" />
            <span className="logo-text">
              Dmitrii
              <br />
              Kovalev
            </span>
          </a>

          <button
            ref={toggleRef}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="nav-pill" aria-label="Main">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={onNavClick}>
              {item.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>
      </div>

      <div id="mobile-nav" ref={sheetRef} className="mobile-sheet" data-open={open}>
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => {
              onNavClick(e);
              setOpen(false);
            }}
          >
            {item.label}
          </a>
        ))}
        <button
          className="mobile-theme-toggle"
          onClick={toggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <><Sun size={18} strokeWidth={2.5} /> Light</> : <><Moon size={18} strokeWidth={2.5} /> Dark</>}
        </button>
      </div>
    </header>
      <div ref={backdropRef} className="mobile-sheet-backdrop" data-open={open} aria-hidden="true" />
    </>
  );
}
