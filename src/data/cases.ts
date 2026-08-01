/**
 * The case list the site reads. Hand-written and safe to edit.
 *
 * Two sources feed it:
 *   - `cases.imported.ts` — GENERATED from the old site by `tools/import-cases.mjs`.
 *     Never edit that file by hand; the next run overwrites it.
 *   - one file per hand-written case (`case-fixlist.ts`, …) — the new work.
 *
 * Order here is the order of the Work list on the homepage, and the order the
 * build prerenders pages in. Newest first.
 */
export type { CaseBlock, CaseStudy } from './case-types';

import type { CaseStudy } from './case-types';
import { importedCases } from './cases.imported';
import { fixlist } from './case-fixlist';

export const cases: CaseStudy[] = [fixlist, ...importedCases];

export const caseBySlug = (slug: string): CaseStudy | undefined =>
  cases.find((c) => c.slug === slug);
