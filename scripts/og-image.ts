// Renders public/og-cover.png (1200x630): the cover on the warm desk background.
// Usage: npx tsx scripts/og-image.ts [url]   (dev server must be running)
import { chromium } from 'playwright';

const URL = process.argv[2] ?? 'http://localhost:5173/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(URL);
await page.addStyleTag({
  content: `.bar{display:none!important}.app--book .stage{padding:0!important}.fadebook{transform:none!important}`,
});
await page.evaluate(() => window.dispatchEvent(new Event('resize')));
await page.waitForTimeout(1200);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og-cover.png' });
await browser.close();
console.log('wrote public/og-cover.png');
