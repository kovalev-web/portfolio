/**
 * fixlist.dev — hand-written case, narrative product-storytelling voice.
 * Drafted in Russian, translated to English to match the rest of the site.
 *
 * Nine shots: img-1 through img-7, plus img-process-1 and img-process-2 (the
 * waiting screen split in half, see the image-row block). That's the full set.
 * Sections 05 and 06 deliberately run on prose and the metrics tiles instead of
 * more screenshots: the raw audit reports live on fixlist.dev, and reproducing
 * them here as pictures would be a retelling, which is the one thing this case
 * argues against.
 */
import type { CaseStudy } from './case-types';

const SHOT = '/media/cases/fixlist';

export const fixlist: CaseStudy = {
  slug: 'fixlist',
  tag: 'AI Product · Self-initiated',
  title: 'fixlist.dev',
  description:
    'Product design case study on a paid AI audit for landing pages, built around a single problem: proving it is not just talking.',
  cover: '/media/covers/fixlist.webp',
  blocks: [
    {
      type: 'image',
      src: `${SHOT}/img-1.webp`,
      alt: 'The fixlist.dev landing page: the promise, a URL field offering a free preview with no email and no card, and the three-step how-it-works section',
      w: 1180,
      h: 1273,
    },
    {
      type: 'image',
      src: `${SHOT}/img-process-1.webp`,
      alt: 'Waiting screen with three steps: loading the page in a real browser, capturing it screen by screen, grading it against the rubric',
      w: 1180,
      h: 579,
      caption:
        'Three lines on a waiting screen, and they hold the whole order of work: a real browser first, then capture screen by screen, and only at the end a verdict.',
    },
    { type: 'break' },

    {
      type: 'heading',
      size: 'lg',
      text: 'An AI audit for landing pages. Why user trust mattered more than a perfect first screen',
    },

    { type: 'eyebrow', text: '01 · The problem' },
    { type: 'heading', text: 'Why should I believe you' },
    {
      type: 'cards',
      items: [
        {
          title: 'Any chat can do this',
          text: 'Generate a landing page audit for free: paste a link and get back a page of confident advice without paying a cent.',
        },
        {
          title: 'There is exactly one condition',
          text: 'A $9 product exists only if the user believes this is not the same thing. Not prettier. Not longer. Different in kind.',
        },
        {
          title: 'Hence the real brief',
          text: 'It was never about a legible report, it was about trust: why should I believe you. Everything below answers that.',
        },
      ],
    },
    { type: 'break' },

    { type: 'eyebrow', text: '02 · Process' },
    { type: 'heading', text: 'Order of operations as the only real product difference' },
    {
      type: 'text',
      text: 'A chat never sees the page. At best it reads raw HTML: no render, no real contrast, no lazily loaded sections. It cannot tell grey text on white from black, because colour simply does not exist for it. Hence the inverted order of work: gather the evidence first, judge second.',
    },
    {
      type: 'image',
      src: `${SHOT}/img-2.webp`,
      alt: 'Pipeline diagram: evidence gathering on the left, grading and the report on the right',
      w: 1180,
      h: 999,
      caption:
        'Evidence first: a real Chromium at 1440×900 walks the page screen by screen, up to twenty slices, alongside a DOM digest and PageSpeed metrics. Only then does the model grade it, and every finding it returns is pinned to a number on one of those screenshots.',
    },
    {
      type: 'heading',
      text: 'The rubric: 30 criteria, one category at a time',
    },
    {
      type: 'text',
      text: 'Trust, readability, call to action, hierarchy, first impression, mobile, SEO. Each criterion is written so it can be scored independently of the others and so it rests on something physically visible in the screenshot.',
    },
    {
      type: 'text',
      text: 'This is not a prompt, it is a formalised checklist. The model walks fixed points instead of associating freely, and that is the whole difference between an audit and an opinion. The rubric became the core asset of the product, designed as a design artefact rather than a line in a config.',
    },
    {
      type: 'text',
      text: 'The consequence for the interface is simple: every finding lands as a number on a specific place on the page. Not just a weak headline, but a marked-up screenshot showing which one.',
    },
    {
      type: 'image',
      src: `${SHOT}/img-3.webp`,
      alt: 'Two finding cards next to their numbers on the marked-up screenshot',
      w: 1180,
      h: 988,
    },
    { type: 'break' },

    { type: 'eyebrow', text: '03 · The fork' },
    { type: 'heading', text: 'Where to cut the free tier' },
    {
      type: 'text',
      text: "The single biggest decision in the project: the line between free and paid isn't about monetisation, it's about what actually convinces the user. The trade-off: the preview shows the real depth before payment, so some people leave with the free value, but nobody feels tricked, and the product proves itself instead of promising.",
    },
    {
      type: 'options',
      items: [
        { label: 'Show everything, charge for the export', verdict: 'rejected' },
        { label: 'Show the problems without explanations, blur the detail', verdict: 'rejected' },
        { label: 'Cut by depth, not by quality', verdict: 'chosen' },
      ],
    },
    {
      type: 'image',
      src: `${SHOT}/img-4.webp`,
      alt: 'The free report: score, verdict, category ratings, and performance metrics',
      w: 1180,
      h: 843,
    },
    { type: 'break' },

    { type: 'eyebrow', text: '04 · The report' },
    { type: 'heading', text: 'The report is not written for a human' },
    {
      type: 'text',
      text: 'The report has a second reader, a coding agent, and it shapes the product more than the human does. The target user already works in Claude Code or Cursor. They do not need a list of advice to translate into tasks by hand. They need a file they can hand to an agent whole. So the .md is assembled by rules that differ from a report written for a human:',
    },
    {
      type: 'goals',
      items: [
        [
          { text: 'Findings as tasks:', bold: true },
          { text: ' each one carries an acceptance criterion instead of a recommendation.' },
        ],
        [
          { text: 'Screenshots attached:', bold: true },
          { text: ' linked at full resolution, so the agent opens the evidence itself.' },
        ],
        [
          { text: 'SEO tags rewritten:', bold: true },
          { text: ' ready to paste with no editing pass in between.' },
        ],
        [
          { text: 'Priorities set explicitly:', bold: true },
          { text: ' critical, major, minor, stated in plain text rather than implied by order.' },
        ],
      ],
    },
    {
      type: 'text',
      text: 'This is interface design for a non-human reader. The usual criteria, readability, rhythm, visual hierarchy, do not apply here. In their place: unambiguous phrasing and the whole context inside a single file.',
    },
    {
      type: 'image',
      src: `${SHOT}/img-5.webp`,
      alt: 'The generated .md report open in a code editor',
      w: 1440,
      h: 1023,
    },
    {
      type: 'image',
      src: `${SHOT}/img-6.webp`,
      alt: 'The report being worked through by a coding agent inside an editor',
      w: 1440,
      h: 1585,
      caption:
        'And in use. The file was designed to be handed over without a human translating between the report and the tickets.',
    },
    { type: 'break' },

    { type: 'eyebrow', text: '05 · Edge cases' },
    { type: 'heading', text: 'The cost of having no accounts' },
    {
      type: 'text',
      text: 'There are no accounts anywhere, not for the audit and not for the payment. The entry barrier disappears completely, and that is the right trade for a product people buy a minute after arriving. But removing registration does not remove the jobs registration was doing. They had to be solved another way, and that is where most of the design work turned out to be.',
    },
    {
      type: 'goals',
      items: [
        [
          { text: 'Proving the report is yours.', bold: true },
          {
            text: ' Recovery runs off the address the payment came from. The payment provider knows it, the product never stores it.',
          },
        ],
        [
          { text: 'Not turning recovery into surveillance.', bold: true },
          {
            text: ' The form answers identically every time, whether or not reports exist for that address, and links only ever leave by email. A different answer would tell a stranger which pages a specific person audited.',
          },
        ],
        [
          { text: 'What to do when the system half worked.', bold: true },
          {
            text: ' If the payment went through but the deep pass did not land, access opens anyway and the report states plainly what is missing from it. A half report handed over silently costs more than an honest refusal. If PageSpeed failed, the re-run is free: an incomplete report is not sold.',
          },
        ],
        [
          { text: 'What to do about a gap in the numbering.', bold: true },
          {
            text: ' When the model could not pin a finding to a place, the card numbers skip: 1, 2, 3, 4, 6. The card says why. An unexplained gap reads as lost data.',
          },
        ],
        [
          { text: 'What to do with a page too long to capture.', bold: true },
          {
            text: ' Capture stops at the twentieth screen and the buyer is told how far it got. Silence would look as though the audit simply missed the bottom of the page.',
          },
        ],
      ],
    },
    {
      type: 'image',
      src: `${SHOT}/img-7.webp`,
      alt: 'The access recovery form',
      w: 1180,
      h: 898,
    },
    {
      type: 'text',
      text: 'One principle runs under all five: the interface has to be precise at the exact moment something has gone wrong. For a paid product with no accounts that is not polish, it is the load-bearing part.',
    },
    { type: 'break' },

    { type: 'eyebrow', text: '06 · The result' },
    { type: 'heading', text: 'Evidence instead of a promise' },
    {
      type: 'text',
      text: 'The answer to the question from the first section turned out to be factual rather than textual: the product was run on itself, publicly, with a bad result. The first pass scored 64 and wrote that trust is practically absent, which for a paid product is fatal.',
    },
    {
      type: 'metrics',
      items: [
        { value: '64 → 75', label: 'Own landing page, three rounds of edits' },
        { value: '28 → 58', label: 'Trust' },
        { value: '62 → 82', label: 'Readability' },
        { value: '43 → 79', label: "Someone else's page, fixed by an agent" },
      ],
    },
    {
      type: 'text',
      text: 'All four passes sit on fixlist.dev raw and unedited. They are deliberately not rewritten into this case: a retold report is no longer evidence, it is a retelling. The re-run did not soften, and that was left on the page: the point about the absence of external social proof stayed critical. Removing it would have been exactly the behaviour the product is built against.',
    },
  ],
};
