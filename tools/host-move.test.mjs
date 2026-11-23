// The move from kinetiqgym.com to joulvo.com (src/host-move.js): every path on every name, with the redirects off and on.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import worker from '../src/worker.js';
import { buildStays, finalPath, hostMove } from '../src/host-move.js';

const SITE = fileURLToPath(new URL('../site', import.meta.url));
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : ['/' + relative(SITE, join(dir, e.name)).split(sep).join('/')]);
const FILES = new Set(walk(SITE).filter(f => !['/README.md', '/.assetsignore'].includes(f)));

// The static host as it answers on the live site: /work.html and /work/ go to /work with a 307, /work is the page.
const assets = { fetch: async request => {
  const url = new URL(request.url), p = url.pathname, go = to => new Response(null, { status: 307, headers: { location: to + url.search } });
  if (p.endsWith('/index.html') && FILES.has(p)) return go(p.slice(0, -10));
  if (p.endsWith('.html') && FILES.has(p)) return go(p.slice(0, -5));
  if (p !== '/' && p.endsWith('/') && FILES.has(p.slice(0, -1) + '.html')) return go(p.slice(0, -1));
  const hit = p === '/' || FILES.has(p) || FILES.has(p + '.html');
  return new Response(hit && request.method !== 'HEAD' ? 'asset ' + p : null, { status: hit ? 200 : 404 });
} };
class MemoryD1 {
  db = new DatabaseSync(':memory:');
  constructor() { this.db.exec(readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8')); }
  prepare(sql) {
    const order = [], stmt = this.db.prepare(sql.replace(/\?(\d+)/g, (_, n) => { order.push(Number(n) - 1); return '?'; }));
    let args = [];
    const api = { bind: (...a) => { args = order.map(i => a[i] ?? null); return api; }, first: async () => stmt.get(...args) ?? null, run: async () => { stmt.run(...args); return { success: true }; } };
    return api;
  }
  rows(sql) { return this.db.prepare(sql).all(); }
}
class MemoryKV {
  values = new Map();
  async get(key, type) { const v = this.values.get(key); return v === undefined ? null : type === 'json' ? JSON.parse(v) : v; }
  async put(key, value) { this.values.set(key, value); }
}
const environment = (vars = {}) => ({ ASSETS: assets, DB: new MemoryD1(), SIGNUPS: new MemoryKV(), AGENT_INBOX_KEY: 'owner-test-fixture-not-a-production-key-123456', ...vars });
const OFF = [{}, { JOULVO_REDIRECTS: '' }, { JOULVO_REDIRECTS: 'off' }, { JOULVO_REDIRECTS: 'true' }, { JOULVO_REDIRECTS: 'ON' }, { JOULVO_REDIRECTS: true }];
const ON = { JOULVO_REDIRECTS: 'on', JOULVO_BUILD_UNTIL: '2999-01-01' };            // the 90 days are running
const LATER = { JOULVO_REDIRECTS: 'on', JOULVO_BUILD_UNTIL: '2026-01-01' };         // the 90 days are over
const OLD = ['kinetiqgym.com', 'www.kinetiqgym.com'], NEW = 'joulvo.com', WWW = 'www.joulvo.com', ALL = [...OLD, NEW, WWW];
const QUERIES = ['', '?motor=v1-wall-power-220&modify=motor', '?a=b%20c&d=%2Fe'];

// Every path the old site answers: each file, each page with and without .html and with a slash, the endpoints, and some that don't exist.
const PAGES = [...FILES].filter(f => f.endsWith('.html')).map(f => f === '/index.html' ? '/' : f.slice(0, -5));
const PATHS = [...new Set([...FILES, ...PAGES, ...PAGES.filter(p => p !== '/').map(p => p + '/'), '/api/subscribe', '/api/contact', '/api/agent-feedback', '/api/owner/agent-feedback',
  '/api/owner/agent-feedback/session', '/api/nope', '/api/site-move', '/owner/agent-replies', '/owner/agent-replies/', '/nope', '/nope/', '/docs', '/docs/', '//example.test/x', '/build/x', '/builder', '/media'])];
const BUILD_PART = p => ['/build', '/build/', '/build.html', '/app.js', '/price-transfer.js', '/styles.css', '/community.css'].includes(p) || p.startsWith('/data/');
const ALWAYS = p => p.startsWith('/api/') || p.startsWith('/owner/') || p.startsWith('/media/') || p === '/agent-inbox.js';
const ask = (env, host, path, method = 'GET', scheme = 'https') => worker.fetch(new Request(`${scheme}://${host}${path}`, { method, redirect: 'manual' }), env);

test('the site has the pages the table is about', () => {
  assert.ok(PATHS.length > 130, String(PATHS.length)); assert.equal(PAGES.length, 15);
  for (const p of ['/', '/build', '/work', '/privacy', '/docs/roadmap', '/docs/BOM']) assert.ok(PAGES.includes(p), p);
});

test('off (the default): every name answers every path exactly as the files and endpoints do, with no redirect to another host', async () => {
  for (const vars of OFF) {
    for (const host of ALL) for (const path of PATHS) for (const method of ['GET', 'HEAD', 'POST']) {
      assert.equal(hostMove(new Request(`https://${host}${path}`, { method }), environment(vars)), null);
    }
  }
  const env = environment();
  for (const path of PATHS) {
    const plain = await ask(env, 'preview.example.test', path);
    for (const host of ALL) {
      const r = await ask(env, host, path);
      assert.equal(r.status, plain.status, host + path);
      assert.equal(r.headers.get('location'), plain.headers.get('location'), host + path);
      assert.notEqual(r.status, 301, host + path);
    }
  }
});

test('on: the hand-written table (status, target, query kept)', async () => {
  const rows = [
    // path on kinetiqgym.com            while the build page stays      after the 90 days
    ['/', 'https://joulvo.com/', 'https://joulvo.com/'],
    ['/index.html', 'https://joulvo.com/', 'https://joulvo.com/'],
    ['/work', 'https://joulvo.com/work', 'https://joulvo.com/work'],
    ['/work.html', 'https://joulvo.com/work', 'https://joulvo.com/work'],
    ['/privacy.html?x=1', 'https://joulvo.com/privacy?x=1', 'https://joulvo.com/privacy?x=1'],
    ['/docs/roadmap', 'https://joulvo.com/docs/roadmap', 'https://joulvo.com/docs/roadmap'],
    ['/docs/BOM.html', 'https://joulvo.com/docs/BOM', 'https://joulvo.com/docs/BOM'],
    ['/docs/BOM.md', 'https://joulvo.com/docs/BOM.md', 'https://joulvo.com/docs/BOM.md'],
    ['/docs/LICENSES/GPL-3.0.txt', 'https://joulvo.com/docs/LICENSES/GPL-3.0.txt', 'https://joulvo.com/docs/LICENSES/GPL-3.0.txt'],
    ['/llms.txt', 'https://joulvo.com/llms.txt', 'https://joulvo.com/llms.txt'],
    ['/robots.txt', 'https://joulvo.com/robots.txt', 'https://joulvo.com/robots.txt'],
    ['/sitemap.xml', 'https://joulvo.com/sitemap.xml', 'https://joulvo.com/sitemap.xml'],
    ['/home.css', 'https://joulvo.com/home.css', 'https://joulvo.com/home.css'],
    ['/nope?q=1', 'https://joulvo.com/nope?q=1', 'https://joulvo.com/nope?q=1'],
    ['//example.test/x', 'https://joulvo.com//example.test/x', 'https://joulvo.com//example.test/x'],
    ['/build', 200, 'https://joulvo.com/build'],
    ['/build?motor=v1-220-battery&modify=motor', 200, 'https://joulvo.com/build?motor=v1-220-battery&modify=motor'],
    ['/build.html', 307, 'https://joulvo.com/build'],
    ['/app.js', 200, 'https://joulvo.com/app.js'],
    ['/price-transfer.js', 200, 'https://joulvo.com/price-transfer.js'],
    ['/styles.css', 200, 'https://joulvo.com/styles.css'],
    ['/community.css', 200, 'https://joulvo.com/community.css'],
    ['/data/project.json', 200, 'https://joulvo.com/data/project.json'],
    ['/data/parts.csv', 200, 'https://joulvo.com/data/parts.csv'],
    ['/media/mark.svg', 200, 200],
    ['/media/launch/kinetiq-film.mp4', 200, 200],
    ['/agent-inbox.js', 200, 200],
    ['/owner/agent-replies', 200, 200],
    ['/api/subscribe', 405, 405],
    ['/api/contact', 405, 405],
    ['/api/agent-feedback', 405, 405],
    ['/api/owner/agent-feedback', 401, 401],
    ['/api/nope', 404, 404],
  ];
  for (const [path, during, after] of rows) for (const [vars, want] of [[ON, during], [LATER, after]]) {
    for (const host of OLD) for (const scheme of ['https', 'http']) for (const method of ['GET', 'HEAD']) {
      const r = await ask(environment(vars), host, path, method, scheme), at = `${method} ${scheme}://${host}${path}`;
      if (typeof want === 'number') {
        assert.equal(r.status, want, at);
        assert.ok(!/joulvo/.test(r.headers.get('location') || ''), at);
      } else {
        assert.equal(r.status, 301, at); assert.equal(r.headers.get('location'), want, at);
        assert.equal(r.headers.get('cache-control'), 'public, max-age=3600', at);
        assert.equal(await r.text(), '', at);
      }
    }
  }
});

test('on: every old path on both old names takes at most one hop, keeps its query and ends where the new name answers', async () => {
  for (const vars of [ON, LATER]) {
    const env = environment(vars), stays = p => ALWAYS(p) || (vars === ON && BUILD_PART(p));
    for (const host of OLD) for (const path of PATHS) for (const query of QUERIES) {
      const r = await ask(env, host, path + query), at = host + path + query;
      if (stays(path)) { assert.ok(r.status !== 301 && !/joulvo/.test(r.headers.get('location') || ''), at); continue; }
      assert.equal(r.status, 301, at);
      const to = new URL(r.headers.get('location'));
      assert.equal(to.origin, 'https://joulvo.com', at); assert.equal(to.search, query, at); assert.equal(to.pathname, finalPath(path), at);
      const end = await worker.fetch(new Request(to, { redirect: 'manual' }), env);
      assert.ok(end.status === 200 || end.status === 404, `${at} -> ${to} -> ${end.status}`);          // never a second redirect
      const before = await worker.fetch(new Request(`https://preview.example.test${finalPath(path)}`, { redirect: 'manual' }), env);
      assert.equal(end.status, before.status, at);
    }
  }
});

test('on: www.joulvo.com goes to joulvo.com in one hop; joulvo.com and other hosts never redirect', async () => {
  for (const vars of [ON, LATER]) {
    const env = environment(vars);
    for (const path of PATHS) for (const query of QUERIES) {
      const r = await ask(env, WWW, path + query);
      if (path.startsWith('/api/')) assert.notEqual(r.status, 301, path);
      else { assert.equal(r.status, 301, path); assert.equal(r.headers.get('location'), 'https://joulvo.com' + finalPath(path) + query); }
      for (const host of [NEW, 'localhost', '127.0.0.1', 'preview.example.test', 'kinetiqgym.com.example.test', 'notkinetiqgym.com', 'cad.kinetiqgym.com']) {
        assert.equal(hostMove(new Request(`https://${host}${path}${query}`), env), null, host + path);
      }
    }
  }
});

test('on: http://joulvo.com goes to the same page on https, and only there; off: it does not', async () => {
  for (const vars of [ON, LATER]) for (const path of PATHS) for (const query of QUERIES) for (const method of ['GET', 'HEAD']) {
    const r = hostMove(new Request(`http://${NEW}${path}${query}`, { method }), environment(vars));
    if (path.startsWith('/api/')) assert.equal(r, null, path);
    else { assert.equal(r.status, 301, path); assert.equal(r.headers.get('location'), 'https://joulvo.com' + finalPath(path) + query); }
    for (const host of ['localhost', '127.0.0.1', 'preview.example.test', 'joulvo.com.example.test', 'notjoulvo.com', 'cad.joulvo.com']) {
      assert.equal(hostMove(new Request(`http://${host}${path}${query}`, { method }), environment(vars)), null, host + path);
    }
  }
  for (const vars of OFF) assert.equal(hostMove(new Request(`http://${NEW}/work`), environment(vars)), null);
});

test('on: no method but GET and HEAD is ever redirected', async () => {
  for (const vars of [ON, LATER]) for (const host of ALL) for (const path of PATHS) for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
    assert.equal(hostMove(new Request(`https://${host}${path}`, { method }), environment(vars)), null, `${method} ${host}${path}`);
  }
});

test('the forms and the feedback endpoint answer on all four names, off and on, into the same database', async () => {
  for (const vars of [{}, ON, LATER]) {
    const env = environment(vars);
    for (const [i, host] of ALL.entries()) {
      const post = (path, body) => worker.fetch(new Request(`https://${host}${path}`, { method: 'POST', redirect: 'manual', body: JSON.stringify(body),
        headers: { 'content-type': 'application/json', origin: `https://${host}`, 'cf-connecting-ip': `192.0.2.${i + 1}` } }), env);
      let r = await post('/api/subscribe', { email: `p${i}@example.test`, source: 'home' });
      assert.deepEqual([r.status, await r.json()], [200, { ok: true, returning: false }], host);
      r = await post('/api/contact', { name: 'N', email: `p${i}@example.test`, message: 'A message long enough to pass.' });
      assert.deepEqual([r.status, await r.json()], [200, { ok: true }], host);
      r = await post('/api/agent-feedback', { invitation: 'kinetiq-agent-guestbook-v1', page: `https://${host}/build?x=1#y`, message: 'A clear build roadmap would be useful.' });
      assert.equal(r.status, 201, host);
      assert.equal((await env.SIGNUPS.get('agent:v1:' + (await r.json()).id, 'json')).page, `https://${host}/build`);
      r = await post('/api/subscribe', { email: 'same@example.test' });                                  // the same person on every name: one row
      assert.equal((await r.json()).returning, i > 0, host);
    }
    assert.equal(env.DB.rows('SELECT * FROM signups').length, ALL.length + 1);
    assert.equal(env.DB.rows('SELECT * FROM enquiries').length, ALL.length);
    assert.equal([...env.SIGNUPS.values.keys()].filter(k => k.startsWith('agent:v1:')).length, ALL.length);
  }
});

test('the build page stays until the last day, and stays when the date is missing or wrong', () => {
  const at = iso => Date.parse(iso);
  assert.equal(buildStays({ JOULVO_BUILD_UNTIL: '2027-02-21' }, at('2027-02-21T23:00:00Z')), true);
  assert.equal(buildStays({ JOULVO_BUILD_UNTIL: '2027-02-21' }, at('2027-02-22T00:00:01Z')), false);
  for (const bad of [undefined, '', 'soon', '2027-2-1', '21.02.2027', '2027-13-45']) assert.equal(buildStays({ JOULVO_BUILD_UNTIL: bad }, at('2030-01-01T00:00:00Z')), true, String(bad));
});

test('the build page asks whether the move is on: only an old name says yes, and only while the page stays', async () => {
  for (const host of ALL) assert.equal((await ask(environment(), host, '/api/site-move')).status, 404, host);
  for (const host of OLD) {
    const r = await ask(environment(ON), host, '/api/site-move');
    assert.deepEqual([r.status, await r.json()], [200, { movedTo: 'https://joulvo.com', until: '2999-01-01' }]);
    assert.equal((await ask(environment(LATER), host, '/api/site-move')).status, 404);
  }
  for (const host of [NEW, WWW]) assert.equal((await ask(environment(ON), host, '/api/site-move')).status, 404);
});
