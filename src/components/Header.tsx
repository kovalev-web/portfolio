import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { profile } from '../data/content';
import { useTheme } from '../hooks/useTheme';
import { onNavClick } from '../hooks/useRoute';
import ThemeToggle from './ThemeToggle';
import './header.css';

// Rooted, not bare fragments: these sections only exist on the homepage, so
// from a case study the link has to go there first and then find the anchor.
const NAV = [
  { label: 'Projects', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  // About — parked along with the section itself in App.tsx; restore both together.
  // { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // The desktop pill: full width normally, shrinks to a circle once the page
  // has scrolled a bit. Clicking the circle expands it again, but that's a
  // peek, not a pin — the next bit of scrolling closes it right back up.
  // There's no button for the reverse; scrolling is the only way to collapse.
  const pillRef = useRef<HTMLElement>(null);
  const [pillWidth, setPillWidth] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const pastThresholdRef = useRef(false);
  const expandScrollYRef = useRef<number | null>(null);

  // scrollWidth still reports the pill's full content width even while it's
  // visually clipped down to a circle, so this is safe to call in either
  // state — nothing has to wait for an expanded frame to measure against.
  useLayoutEffect(() => {
    const measure = () => {
      if (pillRef.current) setPillWidth(pillRef.current.scrollWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Collapses past a scroll threshold, expands back near the top — edge-
  // triggered so it only fires on the crossing itself, not every scroll
  // tick. A manual peek (see the handle's onClick) rides along until the
  // page moves more than REPEEK_DELTA from where it was opened, then it's
  // closed back up — a couple of scroll ticks, not a held-open state.
  useEffect(() => {
    const THRESHOLD = 120;
    const REPEEK_DELTA = 60;

    const onScroll = () => {
      const y = window.scrollY;
      const past = y > THRESHOLD;

      if (past !== pastThresholdRef.current) {
        pastThresholdRef.current = past;
        expandScrollYRef.current = null;
        setCollapsed(past);
        return;
      }

      if (expandScrollYRef.current !== null && Math.abs(y - expandScrollYRef.current) > REPEEK_DELTA) {
        expandScrollYRef.current = null;
        setCollapsed(true);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Tapping outside the sheet closes it. Window-level capture-phase listeners
  // fire before any target handler, so preventDefault blocks the entire event
  // chain (touchstart → pointerdown → mouseup → click) before it reaches
  // page content under the backdrop.
  useEffect(() => {
    if (!open) return;

    const onTouchStart = (e: TouchEvent) => {
      if (sheetRef.current?.contains(e.target as Node) || toggleRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      setOpen(false);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (sheetRef.current?.contains(e.target as Node) || toggleRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    };

    window.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
    window.addEventListener('pointerdown', onPointerDown, { capture: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart, { capture: true });
      window.removeEventListener('pointerdown', onPointerDown, { capture: true });
    };
  }, [open]);

  return (
    <header className="site-header" data-menu-open={open}>
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
          <a className="logo" href="/" aria-label="Home" onClick={onNavClick}>
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

        <nav
          className="nav-pill"
          aria-label="Main"
          ref={pillRef}
          data-collapsed={collapsed}
          style={{ width: collapsed ? 46 : (pillWidth ?? undefined) }}
        >
          {/* Only exists while collapsed — expanding is a peek, not a mode,
              so there's nothing to click to reverse it once it's open. */}
          {collapsed && (
            <button
              type="button"
              className="nav-handle"
              onClick={() => {
                expandScrollYRef.current = window.scrollY;
                setCollapsed(false);
              }}
              aria-expanded={false}
              aria-label="Expand navigation"
            >
              <Menu size={18} />
            </button>
          )}

          <div className="nav-links" inert={collapsed || undefined}>
            {NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={onNavClick}>
                {item.label}
              </a>
            ))}
            <ThemeToggle />
          </div>
        </nav>
      </div>

      {/* Blurs the page behind the sheet. Not in sheetRef, so the existing
          outside-click handler already closes the menu when this is tapped. */}
      <div className="mobile-sheet-backdrop" data-open={open} aria-hidden="true" />

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
  );
}
