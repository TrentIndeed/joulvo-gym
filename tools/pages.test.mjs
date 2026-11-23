// The pages as files: old links, canonical addresses and the sitemap, the mark, the repository link, and the earlier name.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { pages, sitemap } from './make-sitemap.mjs';
import { places, REPO } from './repo-links.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = f => readFileSync(ROOT + f, 'utf8');
const build = read('site/build.html'), homeJs = read('site/home.js');

// home.js in an empty page at one address; what it asks the browser to open
function openHome(hash) {
  const went = [], nothing = () => null;
  const location = { hash, replace: to => went.push(to) };
  vm.runInNewContext(homeJs, { location, window: { addEventListener() {}, scrollY: 0 }, document: { querySelector: nothing, querySelectorAll: () => [] }, matchMedia: () => ({ matches: false }) });
  return went;
}

test('the old links into the builder still open it, and every target is on the build page', () => {
  for (const id of ['build', 'parts', 'files', 'modify', 'software', 'open-source', 'mechanism']) {
    assert.deepEqual(openHome('#' + id), ['/build#' + id]);
    assert.ok(build.includes(`id="${id}"`), id);
  }
  assert.deepEqual(openHome('#repo-status'), ['/build#repo-status']);
});

test('the home page keeps its own links', () => {
  const home = read('site/index.html');
  for (const id of ['', '#join', '#film', '#support', '#status', '#lineup', '#community', '#import=AAAA', '#nope']) assert.deepEqual(openHome(id), []);
  for (const id of ['join', 'film', 'support', 'status', 'lineup', 'community']) assert.ok(home.includes(`id="${id}"`), id);
});

test('the builder still reads ?motor= and ?modify=motor, and its import parts are on the page', () => {
  const app = read('site/app.js');
  assert.match(app, /URLSearchParams\(location\.search\)\.get\('motor'\)/);
  assert.match(app, /URLSearchParams\(location\.search\)\.get\('modify'\)==='motor'/);
  assert.match(build, /<script src="price-transfer\.js" defer><\/script><script src="app\.js" defer><\/script>/);
  for (const m of app.matchAll(/(?:\$|textIn)\('#([a-z-]+)'/g)) assert.ok(build.includes(`id="${m[1]}"`), m[1]);
});

test('every page names its address on joulvo.com once, and the sitemap lists exactly those', () => {
  const list = pages();
  for (const [file, url] of list) {
    assert.equal(url, 'https://joulvo.com/' + file.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, ''), file);
    assert.equal(read('site/' + file).split('rel="canonical"').length, 2, file);
  }
  assert.equal(read('site/sitemap.xml').replace(/\r\n/g, '\n'), sitemap());
  assert.match(read('site/robots.txt'), /^Sitemap: https:\/\/joulvo\.com\/sitemap\.xml\r?$/m);
  assert.ok(!/owner/.test(sitemap()));
});

// The J is the owner's drawing, exactly. Only its colour and the canvas around it differ from file to file.
const DRAWING = ['M 21 43 L 110 3 L 103 33 Z', 'M 72 44 L 101 39 L 87 102 L 46 133 Z', 'M 1 98 L 47 93 L 35 133 Z'];
test('the mark is the owner\'s drawing: three paths, one offset, only the colour differs', () => {
  const view = { 'joulvo-mark.svg': '11.5 12 136 136', 'joulvo-j.svg': '25 15 109 130', 'joulvo-mark-light.svg': '0 0 160 160', 'joulvo-mark-dark.svg': '0 0 160 160' };
  for (const [f, box] of Object.entries(view)) {
    const svg = read('site/media/' + f);
    assert.deepEqual([...svg.matchAll(/<path d="([^"]+)"\/>/g)].map(m => m[1]), DRAWING, f);
    assert.ok(svg.includes(`viewBox="${box}"`) && svg.includes('transform="translate(24 12)"'), f);
    assert.ok(!/<(?:rect|circle|text|image|line|polygon)|stroke/.test(svg), f);
  }
  assert.deepEqual(readdirSync(ROOT + 'site/media').filter(f => /joulvo/.test(f)).sort(), Object.keys(view).sort());   // no other version of the J
  const [, stem] = DRAWING, n = stem.match(/[\d.]+/g).map(Number);
  assert.ok(Math.abs(Math.atan2(n[2] - n[4], n[5] - n[3]) * 180 / Math.PI - 12.529) < 0.001);                         // the stem's right edge: the letters' lean
  for (const [file] of pages()) {
    const page = read('site/' + file);
    assert.ok(/<link rel="icon" href="[./]*media\/joulvo-mark\.svg">/.test(page), file);
    assert.ok(!/media\/mark\.svg/.test(page), file);
  }
});

// The header's logo is the J mark followed by OULVO, leaned like the J's stem. The page holds the whole word; the drawing is in community.css and nowhere else.
const LOGO = '<a class="brand" href="/" aria-label="Joulvo home"><span class="wordmark" aria-hidden="true"><span>J</span>oulvo</span></a>';
test('the logo is named Joulvo for screen readers, copied text and search engines, on every page', () => {
  for (const [file] of pages()) {
    const page = read('site/' + file);
    assert.equal(page.split(LOGO).length, 2, file);
    for (const m of page.matchAll(/<a class="brand"([^>]*)>(.*?)<\/a>/g)) {                // header and footer
      const shown = m[2].replace(/<[^>]+>/g, ''), label = /aria-label="([^"]*)"/.exec(m[1]);
      assert.equal(shown, 'Joulvo', file);                                                 // what is copied or read without styles
      assert.ok((label ? label[1] : shown).includes(shown), file);                         // the accessible name holds the shown word
      if (/aria-hidden/.test(m[2])) assert.ok(label, file);                                // hidden pieces need the label
    }
    assert.ok(!/(?<![Jj])oulvo/.test(page.replace(LOGO, '')), file);                        // no other half word
    assert.match(page, /<title>[^<]*Joulvo Gym/, file);
    assert.match(page, /<link rel="stylesheet" href="\/community\.css">/, file);
    assert.ok(!/joulvo-j\.svg|joulvo-mark-(?:light|dark)\.svg|<svg[^>]*wordmark|>OULVO/.test(page), file);   // the drawing is not copied into pages
  }
  const css = read('site/community.css');
  assert.deepEqual([...css.matchAll(/^\.wordmark[^{]*\{ content: "([A-Z]*)"/gm)].map(m => m[1]), ['', 'O', 'UL', 'VO']);
  assert.match(css, /^\.wordmark \{[^}]*transform: skewX\(-12\.529deg\); transform-origin: 0 calc\(115 \* var\(--u\)\);/m);
  // the clip is the owner's three pieces, point for point, the lean taken out first (2 / 9 is the stem's right edge), with a hop from piece to piece
  const [a, b, c] = DRAWING.map(d => [...d.matchAll(/(\d+) (\d+)/g)].map(m => [Number(m[1]), Number(m[2])])), way = [a[2], a[0], a[1], a[2], b[1], b[2], b[3], c[2], c[0], c[1], c[2], b[3], b[0], b[1]];
  const clip = /^\.wordmark::before \{[^}]*clip-path: polygon\(([^;]*)\);/m.exec(css)[1];
  assert.deepEqual([...clip.matchAll(/calc\(\((\d+) \+ \((\d+) - 118\) \* 2 \/ 9 \+ 4\) \* var\(--u\)\) calc\(\(\2 - 3\) \* var\(--u\)\)/g)].map(m => [Number(m[1]), Number(m[2])]), way);
  assert.equal(clip.split(',').length, way.length);
  assert.equal((b[1][0] - b[2][0]) / (b[2][1] - b[1][1]), 2 / 9);
  assert.ok(!/url\(/.test(css));                                                             // no picture: the drawing is these points
  for (const f of ['site/home.css', 'site/styles.css', 'site/home.js', 'site/app.js']) assert.ok(!/wordmark|joulvo-j/.test(read(f)), f);
});

test('the repository address is the one constant, everywhere', () => {
  const found = places().reduce((n, [, k]) => n + k, 0);
  assert.ok(found > 15);
  for (const f of execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', 'site'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(f => /\.(html|md|js|json)$/.test(f))) {
    for (const m of read(f).matchAll(/github\.com\/TrentIndeed\/([A-Za-z0-9_.-]+)/g)) assert.equal('TrentIndeed/' + m[1], REPO, f);
  }
});

// Where the earlier name may still stand. Anywhere else (a generator run with the old text, say) it fails here.
const KEPT = [
  /formerly kinetiq ?gym(?:\.com)?/gi, /new name of Kinetiq Gym/g, /which was called Kinetiq Gym before/g,                       // the bridge lines
  /earlier ones: (?:\*\*|<strong>)KINETIQ(?:\*\*|<\/strong>), (?:\*\*|<strong>)Kinetiq Gym(?:\*\*|<\/strong>) and the Kinetiq logo/g,  // the name stays protected
  /earlier \**KINETIQ\** and \**Kinetiq Gym\** ones/g, /earlier Kinetiq name and logo/g, /not Joulvo, Kinetiq or anything/g,
  /joulvo\.com and (?:once on )?kinetiqgym\.com/g, /joulvo\.com, kinetiqgym\.com or their/g, /build page on kinetiqgym\.com/g, /(?:move|over|carried) from kinetiqgym\.com/gi,  // the move itself
  /shown on kinetiqgym\.com only/g, /kinetiqgym\.com\/#parts/g, /'(?:www\.)?kinetiqgym\.com'/g, /\/\/ kinetiqgym\.com, www\.kinetiqgym\.com/g, /KINETIQ\|Joulvo Gym/g,
  /r\/KinetiqGym/g, new RegExp(REPO, 'g'), /kinetiq-film\.mp4/g,                                                                   // addresses and files not renamed
  /kinetiq-agent-guestbook-v1/g, /__Host-kinetiq_agent_owner/g, /kinetiq-budget-v1/g,                                             // ids
];
test('the earlier name is only where it is kept on purpose', () => {
  const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: ROOT, encoding: 'utf8' }).split('\n')
    .filter(f => /^(site|src|docs|bom)\/|^(README|SAFETY|CONTRIBUTING|LICENSE)\.md$/.test(f) && /\.(html|md|js|json|css|csv|txt|xml|svg)$/.test(f));
  assert.ok(files.length > 60);
  for (const f of files) {
    let text = read(f).replace(/\s+/g, ' ');
    for (const k of KEPT) text = text.replace(k, '');
    const at = text.search(/kinetiq/i);
    assert.equal(at, -1, `${f}: ...${text.slice(Math.max(0, at - 80), at + 80)}...`);
  }
});

test('the status wording stays beside the name', () => {
  for (const f of ['site/index.html', 'site/build.html', 'README.md', 'site/llms.txt']) {
    const text = read(f);
    assert.match(text, /in development/, f); assert.match(text, /load-tested/, f);
    for (const m of text.matchAll(/open-source smart gym[^.<"]{0,40}/gi)) assert.match(m[0], /in development/, `${f}: ${m[0]}`);
  }
});

test("V0's design files: after a verification pass, not recommended, no date and no promise; V1 keeps its own release rule", () => {
  const flat = f => read(f).replace(/\r?\n>? ?/g, ' ').replace(/\s+/g, ' ');
  for (const f of ['site/index.html', 'site/build.html', 'site/llms.txt', 'README.md', 'docs/roadmap.md', 'site/docs/roadmap.html', 'site/README.md']) {
    const text = flat(f);
    assert.match(text, /design files will be available once a verification pass is done[.,]/, f);
    assert.match(text, /[Bb]uilding V0 is not recommended/, f);
    for (const m of text.matchAll(/[^.>]*design files will be available[^.]*\./g)) assert.ok(!/\b(?:20\d\d|safe|tested|proven|certified|soon|week|month)\b/i.test(m[0]), `${f}: ${m[0]}`);
  }
  // a line that speaks for every design would contradict it
  const all = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', 'site', 'docs', 'README.md', 'CONTRIBUTING.md'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(f => /\.(html|md|txt|js)$/.test(f));
  for (const f of all) {
    const text = flat(f);
    for (const bad of [/(?<!V1's )\bCAD, build files and software(?:<\/?[a-z]+>|\*)* are (?:released|published)/, /Nothing is released before/, /(?<!V1's )\bfiles (?:will be published|are held back)/i, /(?<!V1's )\bfiles are released once/i, /The CAD and every build file/]) {
      assert.ok(!bad.test(text), `${f}: ${bad}`);
    }
  }
  // the licence: both designs, V0 only after its verification pass; the table, the names and the warranty text stay
  for (const f of ['LICENSE.md', 'site/docs/LICENSE.md']) {
    const text = flat(f);
    assert.match(text, /V1's design files are released after the physical prototype has been built and load-tested\./, f);
    assert.match(text, /V0's design files \(the earlier, 3D-printed design\) will be available once a verification pass is done\. They will not have been load-tested, and building V0 is not recommended\./, f);
    assert.match(text, /Hardware design: CAD, STEP, DXF and print files, parts lists \| CERN Open Hardware Licence v2, Strongly Reciprocal \(CERN-OHL-S-2\.0\)/, f);
    assert.match(text, /Their CAD is not redistributed here and is not covered by these licences/, f);
    assert.match(text, /None of the licences above grants any right to use them/, f);
    assert.match(text, /the design is provided as is, without any warranty/, f);
  }
  for (const f of ['README.md', 'docs/roadmap.md']) assert.match(flat(f), /own folder of this repository, with a "not recommended to build" note on top/, f);
  const published = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: ROOT, encoding: 'utf8' }).split('\n');
  assert.deepEqual(published.filter(f => /\.(step|stp|dxf|stl|3mf|brep|fcstd|iges|igs)$/i.test(f) || /^v0\b/i.test(f)), []);   // nothing is published yet
  // V1's own rule
  assert.match(flat('README.md'), /V1's CAD, build files and software are released after a prototype has been built and load-tested/);
  assert.match(flat('site/build.html'), /V1's CAD and every build file are released together,[^.]*once a prototype has been built and load-tested/);
});
