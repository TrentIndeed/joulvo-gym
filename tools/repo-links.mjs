// This repository's GitHub address, in one place. The pages are plain HTML, so the address is written out in each of them; this script
// lists every place and changes them all in one go when the repository is renamed (GitHub keeps redirecting the old address).
//   node tools/repo-links.mjs                                list the places
//   node tools/repo-links.mjs --set TrentIndeed/joulvo-gym   rewrite them, and the constant below
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO = 'TrentIndeed/joulvo-gym';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SELF = 'tools/repo-links.mjs';
const TEXT = /\.(html|md|js|mjs|json|css|csv|txt|xml|yml)$/;

// The address counts when it is not the start of a longer name ("kinetiqgym.com" or "kinetiqgym-film" are something else).
const pattern = repo => new RegExp(repo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z0-9_.-]*[A-Za-z0-9_-])', 'g');

export function places(repo = REPO) {
  const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(f => TEXT.test(f) && f !== SELF);
  return files.map(f => [f, (readFileSync(join(ROOT, f), 'utf8').match(pattern(repo)) || []).length]).filter(([, n]) => n);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const i = process.argv.indexOf('--set'), next = i > 0 ? process.argv[i + 1] : null;
  if (i > 0 && !/^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/.test(next || '')) { console.error('use: --set <owner>/<name>'); process.exit(1); }
  const list = places();
  for (const [f, n] of list) {
    if (next) { const p = join(ROOT, f); writeFileSync(p, readFileSync(p, 'utf8').replace(pattern(REPO), next)); }
    console.log(String(n).padStart(3), f);
  }
  if (next) { const p = join(ROOT, SELF); writeFileSync(p, readFileSync(p, 'utf8').replace(`REPO = '${REPO}'`, `REPO = '${next}'`)); }
  console.log(`${list.reduce((a, [, n]) => a + n, 0)} mentions of ${REPO} in ${list.length} files${next ? `, now ${next}` : ''}`);
}
