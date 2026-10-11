// 1) Every piece of copy in docs/brief-copy.md must appear verbatim in the rendered page.
// 2) No em/en dashes or banned phrases anywhere in src/, index.html or the brief copy.
// Usage: npx tsx scripts/check-copy.ts [url]   (dev server must be running)
import { chromium } from 'playwright';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const URL = process.argv[2] ?? 'http://localhost:5173/?one';
const brief = readFileSync('docs/brief-copy.md', 'utf8');
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

const wanted = new Set<string>();
// quoted strings, multi-line quotes split into paragraphs
for (const m of brief.matchAll(/"([^"]+)"/g)) {
  for (const para of m[1].split('\n')) {
    const t = norm(para).replace(/^([A-Z][\w' ]{0,20}),$/, '$1'); // brief writes labels as "Contents,"
    if (t && !/^\[TODO/.test(t)) wanted.add(t);
  }
}
// labeled lines
for (const m of brief.matchAll(/^\s*(?:Heading|Headline|Subhead|Label|Under it|Masthead again|Signature in Pinyon Script): (.+)$/gm)) {
  wanted.add(norm(m[1].replace(/\s*\(.*\)$/, '')));
}
// contents lines and the "Also in this issue" list
for (const m of brief.matchAll(/^\s+(\d\d)\s{2}(.+)$/gm)) wanted.add(norm(m[2]));
for (const m of brief.matchAll(/^\s*List: (.+)$/gm)) m[1].split(' | ').forEach((x) => wanted.add(norm(x)));
// work list rows (year | company | title | location)
for (const m of brief.matchAll(/^\s+(20\d\d) \| (.+)$/gm)) {
  m[2].split(' | ').filter((x) => !x.startsWith('link:')).forEach((x) => wanted.add(norm(x)));
}
// edit card names
for (const m of brief.matchAll(/^\s+(?:Featured video card \(navy\): )?([A-Z][^|"\n]+?) \| "/gm)) wanted.add(norm(m[1]));
wanted.delete('SARA (huge, Bodoni Moda). Under it, in italics:');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL);
await page.waitForSelector('.scroll__page');
const dom = norm(await page.evaluate(() => document.body.textContent ?? ''));
await browser.close();

const missing = [...wanted].filter((w) => !dom.includes(w));
console.log(`copy strings checked: ${wanted.size}`);
if (missing.length) {
  console.log('MISSING OR CHANGED:');
  missing.forEach((m) => console.log('  - ' + m));
}

// dashes + banned phrases
const banned = [/—/, /–/, /passionate about/i, /driven by/i, /leverag(e|ing)/i];
const files: string[] = ['index.html', 'docs/brief-copy.md'];
const walk = (d: string) =>
  readdirSync(d).forEach((f) => {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p) : files.push(p);
  });
walk('src');
const hits: string[] = [];
for (const f of files) {
  readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => banned.forEach((re) => re.test(line) && hits.push(`${f}:${i + 1} ${re} :: ${line.trim().slice(0, 80)}`)));
}
const emoji = /\p{Extended_Pictographic}/u;
for (const f of files) readFileSync(f, 'utf8').split('\n').forEach((l, i) => emoji.test(l) && !/©/.test(l) && hits.push(`${f}:${i + 1} emoji`));
console.log(hits.length ? 'BANNED CONTENT:\n  ' + hits.join('\n  ') : 'no em/en dashes, emojis or banned phrases found');
process.exit(missing.length || hits.length ? 1 : 0);
