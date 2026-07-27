import { useEffect, useState } from 'react';
import type { CaseBlock, CaseStudy as Case } from '../data/cases';
import { cases } from '../data/cases';
import { onNavClick } from '../hooks/useRoute';
import type { ReactNode } from 'react';
import './case-study.css';

/**
 * Falls back to a labelled placeholder the way the rest of the site does, so a
 * missing asset reads as "not here yet" instead of a broken-image icon.
 * `w`/`h` reserve the space before the file lands — a case page is mostly
 * images, and without a ratio the text jumps around as they load.
 */
function Shot({ src, alt, w, h }: { src: string; alt: string; w?: number; h?: number }): ReactNode {
  const [ok, setOk] = useState(true);
  // Capped at its own pixel width — stretching a screenshot past its native
  // resolution just upscales it, which reads as blur rather than "bigger".
  const ratio = w && h ? { aspectRatio: `${w} / ${h}`, maxWidth: `${w}px` } : undefined;

  if (!ok) {
    return (
      <div className="case-shot case-shot-missing" style={ratio}>
        <span className="kicker">{src.split('/').pop()}</span>
      </div>
    );
  }

  return (
    <img
      className="case-shot"
      src={src}
      alt={alt}
      width={w}
      height={h}
      style={ratio}
      loading="lazy"
      decoding="async"
      onError={() => setOk(false)}
    />
  );
}

function Block({ block }: { block: CaseBlock }): ReactNode {
  switch (block.type) {
    case 'meta':
      return (
        <dl className="case-meta reveal">
          {block.items.map((item) => (
            <div className="case-meta-item" key={item.label}>
              <dt className="kicker">{item.label}</dt>
              <dd className="case-meta-value">{item.value}</dd>
            </div>
          ))}
        </dl>
      );

    case 'lead':
      return <p className="case-lead reveal">{block.text}</p>;

    case 'text':
      return <p className="case-text reveal">{block.text}</p>;

    case 'eyebrow':
      return <p className="kicker case-eyebrow reveal">{block.text}</p>;

    case 'heading':
      return <h2 className="case-heading reveal">{block.text}</h2>;

    case 'goals':
      return (
        <ol className="case-goals reveal">
          {block.items.map((runs, i) => (
            <li key={i}>
              <span className="case-goals-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="case-goals-text">
                {runs.map((run, j) =>
                  run.bold ? <strong key={j}>{run.text}</strong> : <span key={j}>{run.text}</span>,
                )}
              </span>
            </li>
          ))}
        </ol>
      );

    case 'quote':
      return (
        <blockquote className="case-quote reveal">
          <p>{block.text}</p>
        </blockquote>
      );

    case 'image':
      return (
        <figure className="case-figure reveal">
          <Shot src={block.src} alt={block.alt} w={block.w} h={block.h} />
          {block.caption && <figcaption className="case-caption">{block.caption}</figcaption>}
        </figure>
      );

    case 'break':
      return <div className="case-break" aria-hidden="true" />;
  }
}

export default function CaseStudy({ study }: { study: Case }) {
  // The document outlives the route here — nothing else restores these, so a
  // case page would otherwise keep the homepage's title in the tab and in
  // anything that reads the page after a client-side navigation.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${study.title} — ${'Dmitrii Kovalev'}`;

    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') ?? '';
    meta?.setAttribute('content', study.description);

    return () => {
      document.title = prevTitle;
      meta?.setAttribute('content', prevDesc);
    };
  }, [study]);

  const others = cases.filter((c) => c.slug !== study.slug).slice(0, 3);

  return (
    <article className="case">
      <div className="rail">
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

        <header className="case-header">
          <p className="kicker reveal">{study.tag}</p>
          <h1 className="case-title reveal reveal-lg">{study.title}</h1>
        </header>

        {study.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>

      <nav className="rail case-next" aria-label="More work">
        <p className="kicker">More work</p>
        <ul>
          {others.map((c) => (
            <li key={c.slug}>
              <a href={`/projects/${c.slug}`} onClick={onNavClick}>
                <span className="case-next-kicker">{c.tag}</span>
                <span className="case-next-title">{c.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
