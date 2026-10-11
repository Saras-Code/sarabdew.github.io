// Requests every external URL in src/content/links.ts and reports the HTTP status.
import { links } from '../src/content/links';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36';
let bad = 0;
for (const [name, url] of Object.entries(links)) {
  if (url === null) {
    console.log(`TODO    ${name}`);
    continue;
  }
  if (!/^https?:/.test(url)) {
    console.log(`LOCAL   ${name} -> ${url}`);
    continue;
  }
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': UA } });
    const note = res.status === 999 ? ' (LinkedIn blocks automated requests; check by hand)' : '';
    if (res.status >= 400 && res.status !== 999) bad++;
    console.log(`${res.status}     ${name} -> ${url}${note}`);
  } catch (e) {
    bad++;
    console.log(`ERROR   ${name} -> ${url} :: ${String(e)}`);
  }
}
process.exit(bad ? 1 : 0);
