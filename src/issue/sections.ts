// Page indexes are 0-based; folios are index + 1.
export const PAGE_COUNT = 10;

export const SECTIONS = [
  { hash: 'contents', index: 1 },
  { hash: 'letter', index: 2 },
  { hash: 'posy', index: 3 },
  { hash: 'work', index: 5 },
  { hash: 'projects', index: 6 },
  { hash: 'style', index: 7 },
  { hash: 'contact', index: 8 },
] as const;

export function indexForHash(hash: string): number | null {
  const h = hash.replace(/^#/, '');
  if (!h) return null;
  const s = SECTIONS.find((x) => x.hash === h);
  return s ? s.index : null;
}

/** Pages visible together in a two-page spread (cover and back cover stand alone). */
export function spreadOf(i: number): number[] {
  if (i <= 0) return [0];
  if (i >= PAGE_COUNT - 1) return [PAGE_COUNT - 1];
  return i % 2 === 1 ? [i, i + 1] : [i - 1, i];
}

/** The hash to show in the URL for what is on screen. Prefers named sections over #contents. */
export function hashForPages(pages: number[]): string {
  const named = SECTIONS.filter((s) => s.hash !== 'contents' && pages.includes(s.index));
  if (named.length) return named[0].hash;
  const c = SECTIONS.find((s) => pages.includes(s.index));
  return c ? c.hash : '';
}
