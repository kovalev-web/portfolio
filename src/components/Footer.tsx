import { profile } from '../data/content';
import ThemeToggle from './ThemeToggle';
import './footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner reveal">
        <p className="footer-meta">{profile.location} · Available for new projects</p>

        <nav className="footer-links" aria-label="Social">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </nav>

        <div className="footer-right">
          <ThemeToggle />

          <p className="footer-meta">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
