// Interaction + layout checks against the running dev server.
// Usage: npx tsx scripts/verify.ts [baseUrl] [outDir]
import { chromium, type Page } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:5173/';
const OUT = process.argv[3] ?? 'verify-out';
mkdirSync(OUT, { recursive: true });

const results: string[] = [];
const check = (ok: boolean, msg: string) => results.push(`${ok ? 'PASS' : 'FAIL'}  ${msg}`);
const count = (p: Page) => p.locator('.bar__count').innerText().then((t) => t.replace(/^Page\s*/, '').trim());
const wait = (p: Page, ms: number) => p.waitForTimeout(ms);

/** Text that spills past the bottom of its fixed-size page (book modes only). */
async function overflow(p: Page) {
  return p.evaluate(() => {
    const bad: string[] = [];
    document.querySelectorAll<HTMLElement>('.stf__item .page, .fadebook__page .page').forEach((pg) => {
      const r = pg.getBoundingClientRect();
      if (r.width === 0) return;
      pg.querySelectorAll<HTMLElement>('.page__inner > *:not(.folio):not([aria-hidden]), .page__inner > :not(.folio):not([aria-hidden]) > *').forEach((el) => {
        const e = el.getBoundingClientRect();
        if (e.height && e.bottom > r.bottom - 30 * (r.width / 660) + 1) bad.push(`p${pg.dataset.page}:${el.className || el.tagName}`);
      });
    });
    return bad;
  });
}

async function desktop() {
  const browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors: string[] = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.goto(BASE);
  await p.waitForSelector('.stf__item', { state: 'attached' });
  await wait(p, 600);
  await p.screenshot({ path: `${OUT}/desktop-01.png` });
  check((await count(p)) === '01 / 10', 'desktop opens on cover');

  for (let i = 0; i < 6; i++) {
    await p.keyboard.press('ArrowRight');
    await wait(p, 1200);
    const c = await count(p);
    await p.screenshot({ path: `${OUT}/desktop-${c.split(' ')[0]}.png` });
    const of = await overflow(p);
    check(of.length === 0, `spread ${c} fits page${of.length ? ' :: ' + of.join(', ') : ''}`);
  }
  check((await count(p)) === '10 / 10', 'arrow keys reach back cover');
  await p.keyboard.press('ArrowLeft');
  await wait(p, 1200);
  check((await count(p)) === '08-09 / 10', 'ArrowLeft goes back one spread');

  for (const [hash, want] of [
    ['letter', '02-03'],
    ['posy', '04-05'],
    ['work', '06-07'],
    ['projects', '06-07'],
    ['style', '08-09'],
    ['contact', '08-09'],
  ]) {
    await p.goto('about:blank');
    await p.goto(`${BASE}#${hash}`);
    await p.waitForSelector('.stf__item', { state: 'attached' });
    await wait(p, 400);
    check((await count(p)).startsWith(want), `deep link #${hash} opens ${want}`);
  }

  // Contents click
  await p.goto(`${BASE}#letter`);
  await wait(p, 500);
  await p.locator('.contents__link[href="#work"]').click();
  await wait(p, 1500);
  check((await count(p)).startsWith('06-07'), 'Contents link jumps to Work');
  await p.locator('.bar__btn', { hasText: 'Contents' }).click();
  await wait(p, 1500);
  check((await count(p)).startsWith('02-03'), 'persistent Contents button returns to Contents');

  // Drag to turn
  await p.goto(`${BASE}#letter`);
  await wait(p, 500);
  const box = (await p.locator('.flipbook').boundingBox())!;
  await p.mouse.move(box.x + box.width - 8, box.y + box.height - 8);
  await p.mouse.down();
  await p.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.6, { steps: 20 });
  await p.mouse.up();
  await wait(p, 1500);
  check((await count(p)).startsWith('04-05'), 'drag from corner turns the page');

  // Page edge click
  await p.locator('.edge--next').click();
  await wait(p, 1500);
  check((await count(p)).startsWith('06-07'), 'clicking the page edge turns the page');

  // Read as one page
  await p.locator('.bar__btn', { hasText: 'Read as one page' }).click();
  await wait(p, 500);
  const scrollPages = await p.locator('.scroll__page').count();
  check(scrollPages === 10, `one-page mode shows all 10 pages (${scrollPages})`);
  await p.screenshot({ path: `${OUT}/desktop-onepage.png`, fullPage: true });
  await p.goto('about:blank');
  await p.goto(`${BASE}#posy`);
  await p.locator('.bar__btn', { hasText: 'Read as one page' }).click();
  await wait(p, 300);
  await p.evaluate(() => (location.hash = '#projects'));
  await wait(p, 1200);
  const editTop = await p.locator('.scroll__page').nth(6).evaluate((e) => e.getBoundingClientRect().top);
  check(Math.abs(editTop) < 60, `one-page mode honors #projects (top=${Math.round(editTop)})`);

  // Text is real DOM
  const text = await p.evaluate(() => document.body.innerText);
  check(text.includes('graph theory'), 'page copy is real DOM text');
  check(errors.length === 0, `no page errors${errors.length ? ' :: ' + errors.join(' | ') : ''}`);
  await browser.close();
}

async function reduced() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(`${BASE}#posy`);
  await wait(p, 800);
  check((await p.locator('.stf__item').count()) === 0, 'reduced motion: no page curl');
  check((await p.locator('.fadebook').count()) === 1, 'reduced motion: fade reader active');
  check((await count(p)).startsWith('04-05'), 'reduced motion: deep link works');
  const stat = await p.locator('.stat__num').first().innerText();
  check(stat.startsWith('220'), `reduced motion: stats show final values (${stat})`);
  await p.keyboard.press('ArrowRight');
  await wait(p, 500);
  check((await count(p)).startsWith('06-07'), 'reduced motion: arrows work');
  await p.screenshot({ path: `${OUT}/reduced-06.png` });
  check((await overflow(p)).length === 0, 'reduced motion: spread fits');
  await browser.close();
}

async function tablet() {
  const browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 768, height: 1024 }, hasTouch: true });
  await p.goto(BASE);
  await p.waitForSelector('.stf__item', { state: 'attached' });
  await wait(p, 500);
  await p.screenshot({ path: `${OUT}/tablet-01.png` });
  await p.keyboard.press('ArrowRight');
  await wait(p, 1200);
  check((await count(p)) === '02 / 10', `tablet shows one page at a time (${await count(p)})`);
  await p.screenshot({ path: `${OUT}/tablet-02.png` });
  await p.goto(`${BASE}#posy`);
  await wait(p, 600);
  await p.screenshot({ path: `${OUT}/tablet-04.png` });
  const of = await overflow(p);
  check(of.length === 0, `tablet page fits${of.length ? ' :: ' + of.join(', ') : ''}`);
  await browser.close();
}

async function mobile() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto(BASE);
  await wait(p, 800);
  check((await p.locator('.swipe').count()) === 1, 'mobile uses swipe reader');
  await p.screenshot({ path: `${OUT}/mobile-01.png` });
  const hScroll = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  check(!hScroll, 'mobile: no horizontal page scroll');
  // simulate a swipe by scrolling the track one page
  await p.locator('.swipe').evaluate((el) => el.scrollTo({ left: el.clientWidth, behavior: 'auto' }));
  await wait(p, 500);
  check((await count(p)) === '02 / 10', `mobile swipe advances (${await count(p)})`);
  for (const [hash, idx] of [
    ['posy', 4],
    ['work', 6],
    ['projects', 7],
    ['style', 8],
    ['contact', 9],
  ] as const) {
    await p.goto(`${BASE}#${hash}`);
    await wait(p, 700);
    check((await count(p)) === `${String(idx).padStart(2, '0')} / 10`, `mobile deep link #${hash}`);
  }
  for (let i = 1; i <= 10; i++) {
    await p.locator('.swipe').evaluate((el, n) => el.scrollTo({ left: el.clientWidth * n, behavior: 'auto' }), i - 1);
    await wait(p, 350);
    const slide = p.locator('.swipe__slide').nth(i - 1);
    await slide.screenshot({ path: `${OUT}/mobile-${String(i).padStart(2, '0')}.png` });
    const wide = await slide.evaluate((s) => {
      const w = s.clientWidth;
      return [...s.querySelectorAll<HTMLElement>('*')].filter((e) => e.getBoundingClientRect().right > w + 1 && getComputedStyle(e).position !== 'absolute').map((e) => e.className || e.tagName).slice(0, 4);
    });
    check(wide.length === 0, `mobile page ${i} has no sideways overflow${wide.length ? ' :: ' + wide.join(', ') : ''}`);
  }
  await browser.close();
}

for (const fn of [desktop, reduced, tablet, mobile]) {
  try {
    await fn();
  } catch (e) {
    check(false, `${fn.name} crashed :: ${String(e).split('\n')[0]}`);
  }
}
console.log(results.join('\n'));
console.log(`\n${results.filter((r) => r.startsWith('FAIL')).length} failing of ${results.length}`);
