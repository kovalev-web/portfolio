import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { cases, type CaseBlock, type CaseStudy } from './src/data/cases';
import { profile } from './src/data/content';

const ORIGIN = 'https://www.fraimye.com';

/** Absolute — several crawlers refuse to resolve a relative og:image. */
const OG_IMAGE = `${ORIGIN}/og.png`;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * The two markers `index.html` leaves for this plugin. Replacing a whole
 * fenced block beats rewriting individual tags with regexes: the built HTML
 * keeps the source's multi-line attribute formatting, which is exactly what an
 * attribute-level regex trips over.
 */
const fence = (name: string) =>
  new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`);

function caseMeta(study: CaseStudy) {
  const url = `${ORIGIN}/projects/${study.slug}`;
  // The name belongs in the title: a preview card is often the first thing a
  // recruiter sees, and "Brokerage CRM" alone does not say whose it is.
  const title = `${study.title} — ${profile.name}`;
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(study.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(study.description)}" />`,
    // Still the site-wide card. The covers are .webp, which LinkedIn does not
    // reliably render, so a per-case card needs a real 1200x630 png first.
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(`${study.title} — case study by ${profile.name}`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ');
}

/**
 * Text-only mirror of the page for readers that never run the bundle: link
 * unfurlers looking past the og tags, ATS parsers, and crawlers with JS off.
 * `<noscript>` rather than markup inside `#root` — React mounts with
 * `createRoot`, which wipes the container, so anything placed there would
 * flash on screen for the length of a bundle download and buy nothing.
 */
function caseBody(study: CaseStudy) {
  const out: string[] = [
    `<p>${esc(study.tag)}</p>`,
    `<h1>${esc(study.title)}</h1>`,
    `<p>${esc(study.description)}</p>`,
  ];

  for (const block of study.blocks as CaseBlock[]) {
    switch (block.type) {
      case 'meta':
        out.push(
          `<ul>${block.items.map((i) => `<li>${esc(i.label)}: ${esc(i.value)}</li>`).join('')}</ul>`,
        );
        break;
      case 'lead':
      case 'text':
        out.push(`<p>${esc(block.text)}</p>`);
        break;
      case 'eyebrow':
        out.push(`<p><strong>${esc(block.text)}</strong></p>`);
        break;
      case 'heading':
        out.push(`<h2>${esc(block.text)}</h2>`);
        break;
      case 'goals':
        out.push(
          `<ul>${block.items
            .map((runs) => `<li>${runs.map((r) => esc(r.text)).join('')}</li>`)
            .join('')}</ul>`,
        );
        break;
      case 'options':
        out.push(
          `<ul>${block.items
            .map((o) => `<li><strong>${esc(o.label)}</strong> — ${esc(o.verdict)}</li>`)
            .join('')}</ul>`,
        );
        break;
      case 'metrics':
        out.push(
          `<ul>${block.items
            .map((m) => `<li>${esc(m.value)} — ${esc(m.label)}</li>`)
            .join('')}</ul>`,
        );
        break;
      case 'cards':
        out.push(
          `<ul>${block.items
            .map((c) => `<li><strong>${esc(c.title)}</strong> ${esc(c.text)}</li>`)
            .join('')}</ul>`,
        );
        break;
      case 'quote':
        out.push(`<blockquote>${esc(block.text)}</blockquote>`);
        break;
      case 'image':
      case 'image-row':
        // The caption is prose worth indexing; the file is not, and a reader
        // that cannot run JS should not be made to fetch a dozen of them.
        if (block.caption) out.push(`<p>${esc(block.caption)}</p>`);
        break;
      case 'break':
        break;
    }
  }

  out.push(`<p><a href="/">${esc(profile.name)} — all work</a></p>`);
  return `<noscript>\n      <article>\n        ${out.join('\n        ')}\n      </article>\n    </noscript>`;
}

/** Same for the homepage, plus the links a crawler needs to reach the cases. */
function homeBody() {
  const links = cases
    .map((c) => `<li><a href="/projects/${c.slug}">${esc(c.title)}</a> — ${esc(c.description)}</li>`)
    .join('\n          ');
  return [
    '<noscript>',
    '      <article>',
    `        <h1>${esc(profile.name)} — ${esc(profile.role)}</h1>`,
    `        <p>${esc(profile.headline)}</p>`,
    `        <p>${esc(profile.bio)}</p>`,
    '        <h2>Selected work</h2>',
    `        <ul>\n          ${links}\n        </ul>`,
    '        <h2>Contact</h2>',
    `        <p><a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a></p>`,
    `        <ul>${profile.socials
      .map((s) => `<li><a href="${esc(s.href)}">${esc(s.label)}</a></li>`)
      .join('')}</ul>`,
    '      </article>',
    '    </noscript>',
  ].join('\n');
}

/**
 * Writes one real HTML file per case study next to the SPA shell. Vercel serves
 * a matching file before it consults the rewrites, so `/projects/<slug>` picks
 * up its own tags while an unknown slug still falls through to the SPA and its
 * 404 view. The bundle is untouched — the page still boots and renders the case
 * client-side; this only fixes what arrives before the JS does.
 */
function prerender(): Plugin {
  return {
    name: 'prerender-case-meta',
    apply: 'build',
    async closeBundle() {
      const dist = resolve(__dirname, 'dist');
      const shell = await readFile(resolve(dist, 'index.html'), 'utf8');

      await writeFile(
        resolve(dist, 'index.html'),
        shell.replace(fence('page-body'), homeBody()),
        'utf8',
      );

      for (const study of cases) {
        const html = shell
          .replace(fence('page-meta'), caseMeta(study))
          .replace(fence('page-body'), caseBody(study));
        const file = resolve(dist, 'projects', study.slug, 'index.html');
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file, html, 'utf8');
      }

      this.info(`prerendered ${cases.length} case pages`);
    },
  };
}

export default defineConfig({
  plugins: [react(), prerender()],
  server: { port: 5173 },
});
