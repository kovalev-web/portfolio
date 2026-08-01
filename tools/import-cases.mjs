/**
 * Reads the old site's hand-written case-study pages and regenerates
 * `src/data/cases.imported.ts`. Machine-transferred on purpose: the prose is the work
 * product, and retyping seven pages of it is how sentences quietly change.
 *
 *   node tools/import-cases.mjs [path-to-old-site/projects]
 *
 * Kept because the old pages are still the origin of this copy — if one of them
 * is edited, this is how the change gets across without a diff by eye. It is a
 * one-way import; edits made in `cases.imported.ts` will be overwritten.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(HERE, '../../current-site/projects');
const SLUGS = [
  'trade-scope',
  'brokerage-crm',
  'control-panel',
  'my-path',
  'flowforge',
  'irev-website',
  'organix',
];

const strip = (s) =>
  s
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');

const decode = (s) => strip(s).trim();

/**
 * Same as `decode` but keeps the edges: the space that separates a bold
 * lead-in from the sentence after it lives at a run boundary, and trimming
 * every run welds them into "Management:Centralizes".
 */
const decodeLoose = strip;

/** Keeps <strong> as a marker so the renderer can bold the lead-in. */
const decodeRich = (s) => {
  const parts = [];
  const re = /<strong>([\s\S]*?)<\/strong>/g;
  let last = 0;
  let m;
  while ((m = re.exec(s))) {
    if (m.index > last) parts.push({ b: false, t: decodeLoose(s.slice(last, m.index)) });
    parts.push({ b: true, t: decodeLoose(m[1]) });
    last = m.index + m[0].length;
  }
  if (last < s.length) parts.push({ b: false, t: decodeLoose(s.slice(last)) });

  const kept = parts.filter((p) => p.t.trim());
  // Only the outer edges of the whole item get trimmed.
  if (kept.length) {
    kept[0].t = kept[0].t.replace(/^\s+/, '');
    kept[kept.length - 1].t = kept[kept.length - 1].t.replace(/\s+$/, '');
  }
  return kept;
};

const BLOCK = new RegExp(
  [
    '<span class="proj-tag">([\\s\\S]*?)<\\/span>',
    '<h1 class="proj-title">([\\s\\S]*?)<\\/h1>',
    '<p class="proj-description">([\\s\\S]*?)<\\/p>',
    // Ends at the last item's close + the strip's own close — the first pair
    // of consecutive `</div>`s. Matching three ran past the whole page.
    '<div class="proj-meta">([\\s\\S]*?)<\\/div>\\s*<\\/div>',
    '<p class="proj-lead">([\\s\\S]*?)<\\/p>',
    '<p class="proj-text">([\\s\\S]*?)<\\/p>',
    '<span class="proj-section-eyebrow">([\\s\\S]*?)<\\/span>',
    '<h2 class="proj-section-title">([\\s\\S]*?)<\\/h2>',
    '<ol class="proj-goals">([\\s\\S]*?)<\\/ol>',
    '<div class="proj-quote">([\\s\\S]*?)<\\/div>',
    '<p class="proj-caption">([\\s\\S]*?)<\\/p>',
    '<div class="proj-img">([\\s\\S]*?)<div class="proj-img-placeholder"',
    '(<div class="proj-spacer">)',
  ].join('|'),
  'g',
);

function parse(slug) {
  const html = readFileSync(join(SRC, slug, 'index.html'), 'utf8');
  const body = html.slice(html.indexOf('class="proj-back"'));

  const head = {
    docTitle: decode((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || ''),
    description: (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '',
    cover: ((html.match(/<meta property="og:image" content="([^"]*)"/) || [])[1] || '')
      .replace('https://www.fraimye.com/', ''),
  };

  const blocks = [];
  let tag = '';
  let title = '';
  let m;
  BLOCK.lastIndex = 0;

  while ((m = BLOCK.exec(body))) {
    const [, gTag, gTitle, gDesc, gMeta, gLead, gText, gEyebrow, gH2, gGoals, gQuote, gCaption, gImg, gSpacer] = m;

    if (gTag !== undefined) tag = decode(gTag);
    else if (gTitle !== undefined) title = decode(gTitle);
    else if (gDesc !== undefined) blocks.push({ type: 'lead', text: decode(gDesc) });
    else if (gMeta !== undefined) {
      const items = [...gMeta.matchAll(
        /<span class="proj-meta-label">([\s\S]*?)<\/span>\s*<span class="proj-meta-value">([\s\S]*?)<\/span>/g,
      )].map((x) => ({ label: decode(x[1]), value: decode(x[2]) }));
      if (items.length) blocks.push({ type: 'meta', items });
    } else if (gLead !== undefined) blocks.push({ type: 'lead', text: decode(gLead) });
    else if (gText !== undefined) blocks.push({ type: 'text', text: decode(gText) });
    else if (gEyebrow !== undefined) blocks.push({ type: 'eyebrow', text: decode(gEyebrow) });
    else if (gH2 !== undefined) blocks.push({ type: 'heading', text: decode(gH2) });
    else if (gGoals !== undefined) {
      const items = [...gGoals.matchAll(/<span class="proj-goals-text">([\s\S]*?)<\/span>/g)].map((x) =>
        decodeRich(x[1]),
      );
      blocks.push({ type: 'goals', items });
    } else if (gQuote !== undefined) blocks.push({ type: 'quote', text: decode(gQuote) });
    else if (gCaption !== undefined) {
      const prev = blocks[blocks.length - 1];
      if (prev && prev.type === 'image') prev.caption = decode(gCaption);
      else blocks.push({ type: 'text', text: decode(gCaption) });
    } else if (gImg !== undefined) {
      const src = (gImg.match(/src="([^"]*)"/) || [])[1];
      if (src) {
        blocks.push({
          type: 'image',
          src: `/media/cases/${slug}/${src.split('/').pop()}`,
          alt: decode((gImg.match(/alt="([^"]*)"/) || [])[1] || ''),
          w: Number((gImg.match(/width="(\d+)"/) || [])[1]) || undefined,
          h: Number((gImg.match(/height="(\d+)"/) || [])[1]) || undefined,
        });
      }
    } else if (gSpacer !== undefined) {
      if (blocks.length) blocks.push({ type: 'break' });
    }
  }

  return { slug, tag, title, ...head, blocks };
}

const cases = SLUGS.map(parse);

// ---- report ----
for (const c of cases) {
  const counts = {};
  for (const b of c.blocks) counts[b.type] = (counts[b.type] || 0) + 1;
  console.log(
    c.slug.padEnd(15),
    String(c.blocks.length).padStart(3),
    'blocks |',
    Object.entries(counts).map(([k, v]) => `${k}:${v}`).join(' '),
  );
  const noCaption = c.blocks.filter((b) => b.type === 'image' && !b.caption).length;
  if (noCaption) console.log(' '.repeat(15), `  (${noCaption} image(s) without caption)`);
}

// ---- emit cases.imported.ts ----
const q = (s) => JSON.stringify(s);

const block = (b) => {
  switch (b.type) {
    case 'meta':
      return `{ type: 'meta', items: [${b.items.map((i) => `{ label: ${q(i.label)}, value: ${q(i.value)} }`).join(', ')}] }`;
    case 'goals':
      return `{ type: 'goals', items: [\n${b.items
        .map((run) => `      [${run.map((p) => `{ text: ${q(p.t)}${p.b ? ', bold: true' : ''} }`).join(', ')}],`)
        .join('\n')}\n    ] }`;
    case 'image':
      return `{ type: 'image', src: ${q(b.src)}, alt: ${q(b.alt)}${b.w ? `, w: ${b.w}` : ''}${
        b.h ? `, h: ${b.h}` : ''
      }${b.caption ? `, caption: ${q(b.caption)}` : ''} }`;
    case 'break':
      return `{ type: 'break' }`;
    default:
      return `{ type: '${b.type}', text: ${q(b.text)} }`;
  }
};

const ts = `/**
 * Case-study content, carried over from the previous site's hand-written
 * project pages. GENERATED by \`tools/import-cases.mjs\` — edits here are
 * overwritten on the next run; the prose is the work product, so it is
 * transferred verbatim rather
 * than retyped.
 *
 * Hand-written cases do NOT belong here — put them in their own file and add
 * them to the list in \`cases.ts\`, which is what the site actually reads.
 */
import type { CaseStudy } from './case-types';

export const importedCases: CaseStudy[] = [
${cases
  .map(
    (c) => `  {
    slug: ${q(c.slug)},
    tag: ${q(c.tag)},
    title: ${q(c.title)},
    description: ${q(c.description)},
    cover: ${q(`/media/covers/${c.slug}.webp`)},
    blocks: [
${c.blocks.map((b) => `      ${block(b)},`).join('\n')}
    ],
  },`,
  )
  .join('\n')}
];
`;

writeFileSync(resolve(HERE, '../src/data/cases.imported.ts'), ts);
console.log('\nwrote src/data/cases.imported.ts');
