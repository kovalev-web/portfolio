import { ArrowRight } from 'lucide-react';
import { onNavClick } from '../hooks/useRoute';
import './ai-products.css';

/**
 * Side AI products — a full-width gallery of one cover shot per project,
 * in three equal columns. Purely presentational for now: the shots are the
 * first frame of each project's folder, matching the old hero deck's order.
 */
const AI_PROJECTS = [
  { src: '/media/project-1/1.webp', alt: 'Screela — moodboard boards view' },
  { src: '/media/project-2/1.webp', alt: 'Crypto market dashboard — coin charts view' },
  { src: '/media/project-3/1.webp', alt: 'fixlist.dev — main view' },
];

export default function AIProducts() {
  return (
    <section id="ai-products" className="ai-products">
      <div className="shell">
        <div className="ai-title-row">
          <p className="ai-title">Side AI products</p>
          <a className="ai-arrow" href="/projects/fixlist" onClick={onNavClick} aria-label="Open fixlist case study">
            <ArrowRight size={18} strokeWidth={1.75} />
          </a>
        </div>
        <div className="ai-grid">
          {AI_PROJECTS.map((shot) => (
            <img
              key={shot.src}
              className="ai-shot reveal"
              src={shot.src}
              alt={shot.alt}
              width={1584}
              height={1680}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}