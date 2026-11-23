// Write site/sitemap.xml: one line per page in site/, at the address in the page's own canonical link.
//   node tools/make-sitemap.mjs           write it
//   node tools/make-sitemap.mjs --check   say whether it is up to date, and write nothing
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = fileURLToPath(new URL('../site', import.meta.url));
export const HOME = 'https://joulvo.com';

// [page file relative to site/, canonical address or null]
export function pages(dir = SITE) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { out.push(...pages(path)); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const found = /<link rel="canonical" href="([^"]+)">/.exec(readFileSync(path, 'utf8'));
    out.push([relative(SITE, path).split(sep).join('/'), found && found[1]]);
  }
  return out;
}

export function sitemap() {
  const urls = pages().map(([file, url]) => {
    if (!url || !url.startsWith(HOME + '/')) throw new Error(`${file} has no canonical link on ${HOME}`);
    return url;
  }).sort();
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(u => `  <url><loc>${u}</loc></url>`), '</urlset>', ''].join('\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const file = join(SITE, 'sitemap.xml'), text = sitemap();
  if (process.argv.includes('--check')) {
    let now = ''; try { now = readFileSync(file, 'utf8').replace(/\r\n/g, '\n'); } catch { /* none yet */ }
    console.log(now === text ? 'up to date' : 'out of date'); process.exitCode = now === text ? 0 : 1;
  } else { writeFileSync(file, text); console.log(`${text.split('<url>').length - 1} pages written`); }
}
