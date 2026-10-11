// Injects the static issue markup into dist/index.html after `vite build`.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href);
const file = resolve('dist/index.html');
const html = readFileSync(file, 'utf8');
if (!html.includes('<!--prerender-->')) throw new Error('prerender marker missing from dist/index.html');
writeFileSync(file, html.replace('<!--prerender-->', render()));
rmSync(resolve('dist-ssr'), { recursive: true, force: true });
console.log('prerendered issue into dist/index.html');
