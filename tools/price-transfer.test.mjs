// Saved prices: the key, the link from kinetiqgym.com to joulvo.com, and reading an exported list back (site/price-transfer.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import '../site/price-transfer.js';

const T = globalThis.PriceTransfer;
const data = JSON.parse(readFileSync(new URL('../site/data/project.json', import.meta.url), 'utf8'));
const some = data.parts.slice(0, 3), b64 = v => Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');
class Store { constructor(v = {}) { this.v = { ...v }; } getItem(k) { return this.v[k] ?? null; } setItem(k, v) { this.v[k] = String(v); } }
const refused = (text, why) => assert.throws(() => T.unpack(text, data), e => e instanceof T.Refused && (!why || why.test(e.message)), String(text).slice(0, 60));

test('prices are saved under the new key; the earlier key is read while the new one is empty, and never written', () => {
  const old = JSON.stringify({ motor: 'v1', prices: { [some[0].id]: 12.5 } });
  const s = new Store({ [T.OLD_KEY]: old });
  assert.equal(T.OLD_KEY, 'kinetiq-budget-v1'); assert.notEqual(T.KEY, T.OLD_KEY);
  assert.deepEqual(T.load(s), { motor: 'v1', prices: { [some[0].id]: 12.5 } });
  T.save(s, { motor: 'v1', prices: { [some[0].id]: 9 }, search: 'x' });
  assert.equal(s.v[T.OLD_KEY], old);
  assert.deepEqual(JSON.parse(s.v[T.KEY]), { motor: 'v1', prices: { [some[0].id]: 9 } });
  assert.deepEqual(T.load(s).prices, { [some[0].id]: 9 });
  T.save(s, { motor: 'v1', prices: {} });                                     // a reset stays a reset: the old prices don't come back
  assert.deepEqual(T.load(s).prices, {});
});

test('unreadable or blocked storage starts empty', () => {
  for (const s of [null, new Store({ [T.KEY]: '{' }), new Store({ [T.KEY]: '[]' }), new Store({ [T.KEY]: '{"prices":[1],"motor":3}' }), { getItem() { throw new Error('blocked'); } }]) {
    assert.deepEqual(T.load(s), { motor: '', prices: {} });
  }
});

test('a good link carries the prices and the build over', () => {
  const state = { motor: 'v1-wall-power-220', prices: { [some[0].id]: 12.345, [some[1].id]: 0, [some[2].id]: 100000, retired9: 5, bad: 'x' } };
  const link = T.link('https://joulvo.com', state, data);
  assert.match(link, /^https:\/\/joulvo\.com\/build#import=[A-Za-z0-9_-]+$/);
  const found = T.unpack(link.split(T.MARK)[1], data);
  assert.deepEqual(found, { prices: { [some[0].id]: 12.35, [some[1].id]: 0, [some[2].id]: 100000 }, motor: 'v1-wall-power-220', count: 3, left: 0, from: 'kinetiqgym.com' });
});

test('with no prices of your own the link has none; a build that no longer exists is dropped', () => {
  assert.equal(T.link('https://joulvo.com', { motor: 'v1', prices: {} }, data), 'https://joulvo.com/build?motor=v1');
  assert.equal(T.link('https://joulvo.com', { motor: 'mp8085', prices: {} }, data), 'https://joulvo.com/build');
  assert.equal(T.unpack(b64({ v: 1, motor: 'mp8085', prices: { [some[0].id]: 4 } }), data).motor, '');
});

test('every part priced still fits in the size limit', () => {
  const state = { motor: 'v1', prices: Object.fromEntries(data.parts.map(p => [p.id, 99999.99])) };
  const text = T.pack(state, data);
  assert.ok(text.length < T.MAX_LINK / 4, String(text.length)); assert.equal(T.unpack(text, data).count, data.parts.length);
});

test('oversized links are refused before they are read', () => {
  refused('A'.repeat(T.MAX_LINK + 1), /too long/);
  refused(b64({ v: 1, prices: Object.fromEntries(Array.from({ length: 501 }, (_, i) => ['p' + (1000 + i), 1])) }), /too (many|long)/);
});

test('wrong keys are refused as a whole', () => {
  const ok = { [some[0].id]: 4 };
  for (const body of [{ v: 1, prices: ok, extra: 1 }, { v: 1, prices: ok, html: '<b>' }, { v: 2, prices: ok }, { prices: ok }, { v: 1 }, { v: 1, prices: [4] }, { v: 1, prices: null }, { v: 1, prices: 'x' },
    { v: 1, prices: {} }, { v: 1, prices: { ...ok, '<img src=x onerror=alert(1)>': 4 } }, { v: 1, prices: { ...ok, 'P 1': 4 } }, { v: 1, prices: { ...ok, constructor_: 4 } }, [], null, 5, 'x']) refused(b64(body));
  refused(b64('{"v":1,"prices":{"__proto__":4}}')); refused(b64('{"v":1,"__proto__":{"x":1},"prices":{"p001":4}}'));
  assert.equal({}.x, undefined);
});

test('a well-formed part that is not in the list any more is left out and counted, and never saved', () => {
  const found = T.unpack(b64({ v: 1, prices: { [some[0].id]: 4, retired9: 5, constructor: 6 } }), data);
  assert.deepEqual([found.prices, found.count, found.left], [{ [some[0].id]: 4 }, 1, 2]);
  refused(b64({ v: 1, prices: { retired9: 5 } }), /current parts list/);
});

test('only numbers from 0 to 100,000', () => {
  for (const n of ['4', '<script>alert(1)</script>', null, true, [], {}, -1, 100000.01, 1e9]) refused(b64({ v: 1, prices: { [some[0].id]: n } }));
  for (const n of ['NaN', 'Infinity', '1e999']) refused(b64(`{"v":1,"prices":{"${some[0].id}":${n}}}`));
});

test('script text and anything that is not a list is refused', () => {
  for (const text of ['', '<script>alert(1)</script>', 'javascript:alert(1)', '%3Cscript%3E', '{"v":1}', 'a b', 'AAAA', '=', '\u0000', undefined, null, 5]) refused(text);
  refused(b64('<script>alert(1)</script>')); refused(b64('{"v":1,"prices":{"p001":4}}é'));
  for (const motor of ['<b>', 'a'.repeat(61), 5, {}, 'V1 (220)']) refused(b64({ v: 1, motor, prices: { [some[0].id]: 4 } }));
});

const q = v => '"' + String(v).replace(/"/g, '""') + '"', csv = rows => rows.map(r => r.map(q).join(',')).join('\r\n');
const v1 = data.parts.filter(p => !p.motor || p.motor.includes('v1-220-battery'));
const exported = (title = 'Joulvo Gym build: V1 (220 battery) (CAD first look). Resistance: 220 lb (design target).', head = T.HEAD, own = { 0: '12.50', 4: '7.00' }) => csv([[title], head,
  ...v1.map((p, i) => { const r = [p.rank, p.name, p.category, p.qty, own[i] ?? '1.00', '1.00', own[i] ? 'Your price' : p.status, p.date || '', p.url || '']; return head.length === 9 ? r : [...r.slice(0, 7), r[8]]; }),
  ['', 'Priced lines total', '', '', '', '99.00'], [], ['Accessory list (not in the total)'], ['', 'Drill', 'Tools', 1, '5.00', '5.00', 'Your price', '', '']]);
const WANT = { [v1[0].id]: 12.5, [v1[4].id]: 7 };

test('an exported list is read back: your own lines only, and the build it was for', () => {
  const found = T.fromCsv(exported(), data);
  assert.deepEqual([found.prices, found.motor, found.count, found.left], [WANT, 'v1-220-battery', 2, 0]);
});

test('lists exported under the earlier name, and in the October format, are read too', () => {
  assert.deepEqual(T.fromCsv(exported('KINETIQ build: V1 (220 battery) (CAD first look). Resistance: 220 lb.'), data).prices, WANT);
  const oct = T.fromCsv(exported('KINETIQ build: 180 lb Budget build', T.HEAD.filter(h => h !== 'Price read')), data);
  assert.deepEqual([oct.prices, oct.motor], [WANT, '']);
});

test('a list saved again by a spreadsheet (no quotes, padded rows, LF, a byte-order mark) is read', () => {
  const plain = exported().split('\r\n').map(l => l.replace(/^"([^",]*)"$/, '$1') + ',,').join('\n');
  assert.deepEqual(T.fromCsv('﻿' + plain, data).prices, WANT);
});

test('other files, bad prices and oversized files are refused', () => {
  const bad = (text, why) => assert.throws(() => T.fromCsv(text, data), e => e instanceof T.Refused && (!why || why.test(e.message)));
  for (const text of ['', '  ', 'a,b\r\n1,2', '<html><script>alert(1)</script></html>', readFileSync(new URL('../site/data/parts.csv', import.meta.url), 'utf8'), exported('Somebody else build: V1'), exported(undefined, ['Rank', 'Part']), undefined, 5, '\u0000']) bad(text);
  for (const n of ['<script>', '-1', '1e3', '100000.01', 'to come', '=1+1', '1,000.00', '12.345', '9999999']) bad(exported(undefined, T.HEAD, { 0: n }), /not a number/);
  bad(exported(undefined, T.HEAD, {}), /no prices of your own/);
  bad('x'.repeat(T.MAX_CSV + 1), /too large/);
});

test('a line whose name is not in the list is left out, whatever it says', () => {
  const found = T.fromCsv(exported().replace(q(v1[4].name), q('<img src=x onerror=alert(1)>')), data);
  assert.deepEqual([found.prices, found.left], [{ [v1[0].id]: 12.5 }, 1]);
});
