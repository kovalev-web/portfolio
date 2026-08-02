/**
 * Block vocabulary for case-study pages. Lives on its own because the imported
 * cases (`cases.imported.ts`) are machine-generated and the hand-written ones
 * are not — both need these types, neither should own them.
 *
 * Every page is a flat list of blocks. Adding a case means adding an entry to
 * `cases.ts`; the renderer already knows all of these shapes.
 */

export type CaseBlock =
  | { type: 'meta'; items: { label: string; value: string }[] }
  | { type: 'lead'; text: string }
  | { type: 'text'; text: string }
  | { type: 'eyebrow'; text: string }
  /** `size: 'lg'` is for the one thesis-statement heading a case can open
   *  with, above the numbered sections — same register as the site's other
   *  big single-line statements (Work, Skills), not a second page title. */
  | { type: 'heading'; text: string; size?: 'lg' }
  /** Each item is a run of spans so the lead-in can be bold. */
  | { type: 'goals'; items: { text: string; bold?: boolean }[][] }
  /**
   * A decision with its alternatives, kept visible instead of summarised —
   * a rejected option is evidence of the thinking, not clutter.
   */
  | {
      type: 'options';
      items: { label: string; verdict: 'rejected' | 'chosen'; text: string }[];
    }
  /** Result numbers as a row of tiles: the "before → after" of a case. */
  | { type: 'metrics'; items: { value: string; label: string }[] }
  /** A short argument as a row of cards instead of stacked paragraphs — for
   *  2-4 beats that build on each other but don't need to be read top to
   *  bottom, one glance takes in all of them. The titles should read as a
   *  spine on their own, so the row is skimmable without the body copy. */
  | { type: 'cards'; items: { title: string; text: string }[] }
  | { type: 'quote'; text: string }
  | { type: 'image'; src: string; alt: string; w?: number; h?: number; caption?: string }
  /** Extra air between chapters — the old pages leaned on these for rhythm. */
  | { type: 'break' };

export type CaseStudy = {
  slug: string;
  tag: string;
  title: string;
  description: string;
  cover: string;
  blocks: CaseBlock[];
};
