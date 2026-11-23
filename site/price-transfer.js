'use strict';
// A visitor's own prices: where they are saved, and how they are carried from kinetiqgym.com to joulvo.com or read back from an exported
// list. Browser storage belongs to one address, so a redirect can't bring the saved prices along: the old build page offers a link whose
// part after # holds them (browsers don't send that part to the server), and the new page asks before it uses them.
// No page code in here, so tools/price-transfer.test.mjs can run it. app.js uses it as PriceTransfer.
(function (root) {
  const KEY = 'joulvo-budget-v1', OLD_KEY = 'kinetiq-budget-v1';             // saved under KEY; OLD_KEY is only ever read
  const MAX_LINK = 16000, MAX_CSV = 200000, MAX_LINES = 500, MAX_PRICE = 100000;
  const PART_ID = /^[a-z][a-z0-9-]{0,39}$/, BUILD_ID = /^[a-z0-9][a-z0-9-]{0,59}$/;
  const HEAD = ['Rank', 'Part', 'Group', 'Purchase quantity', 'Unit price USD', 'Subtotal USD', 'Price basis', 'Price read', 'Source'];
  const HEAD_OCT = HEAD.filter(h => h !== 'Price read');                     // the October 2026 lists had no "Price read" column
  const MARK = '#import=';

  class Refused extends Error {}
  const refuse = why => { throw new Refused(why); };
  const plain = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const good = n => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= MAX_PRICE;
  const cents = n => Math.round(n * 100) / 100;

  // What this browser has saved for this address. The old key is read only while the new one is empty.
  function load(storage) {
    const out = { motor: '', prices: {} };
    try {
      const saved = JSON.parse(storage.getItem(KEY) ?? storage.getItem(OLD_KEY) ?? '{}');
      if (plain(saved)) {
        if (typeof saved.motor === 'string') out.motor = saved.motor;
        if (plain(saved.prices)) out.prices = saved.prices;
      }
    } catch { /* no storage, or not ours: start empty */ }
    return out;
  }
  function save(storage, state) { storage.setItem(KEY, JSON.stringify({ motor: state.motor, prices: state.prices })); }

  const ownPrices = (state, data) => data.parts.filter(p => good(state.prices[p.id]));

  // The text after "#import=": only parts in the list, only numbers, and the chosen build.
  function pack(state, data) {
    const prices = {};
    for (const p of ownPrices(state, data)) prices[p.id] = cents(state.prices[p.id]);
    const body = { v: 1, prices };
    if (data.motors.some(m => m.id === state.motor)) body.motor = state.motor;
    return btoa(JSON.stringify(body)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  const link = (home, state, data) => ownPrices(state, data).length
    ? `${home}/build${MARK}${pack(state, data)}`
    : `${home}/build${data.motors.some(m => m.id === state.motor) ? `?motor=${encodeURIComponent(state.motor)}` : ''}`;

  // The text of an import link, checked hard: anything that is not exactly a list of part ids and prices is refused as a whole.
  // A well-formed id that is not in the list any more is left out and counted.
  function unpack(text, data) {
    if (typeof text !== 'string' || !text) refuse('This link holds no prices.');
    if (text.length > MAX_LINK) refuse('This link is too long to be a saved price list.');
    if (!/^[A-Za-z0-9_-]+$/.test(text)) refuse('This link is not a saved price list.');
    let body;
    try {
      const raw = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
      if (/[^\x20-\x7e]/.test(raw)) refuse('This link is not a saved price list.');
      body = JSON.parse(raw);
    } catch { refuse('This link is not a saved price list.'); }
    if (!plain(body) || body.v !== 1 || !plain(body.prices)) refuse('This link is not a saved price list.');
    if (Object.keys(body).some(k => !['v', 'motor', 'prices'].includes(k))) refuse('This link holds something other than prices.');
    if ('motor' in body && (typeof body.motor !== 'string' || !BUILD_ID.test(body.motor))) refuse('This link holds something other than prices.');
    const list = Object.entries(body.prices);
    if (!list.length) refuse('This link holds no prices.');
    if (list.length > MAX_LINES) refuse('This link holds too many lines.');
    if (list.some(([id, n]) => !PART_ID.test(id) || !good(n))) refuse('This link holds something other than prices.');
    return result(list, body.motor, data, 'kinetiqgym.com');
  }

  // The file "Export this list" writes. Only the lines marked "Your price" are yours; the rest are the list's own.
  function fromCsv(text, data) {
    if (typeof text !== 'string' || !text.trim()) refuse('This file is empty.');
    if (text.length > MAX_CSV) refuse('This file is too large to be an exported list.');
    if (text.includes('\u0000')) refuse('This is not a list exported from this site.');
    const rows = parseCsv(text.replace(/^﻿/, '')).map(r => { while (r.length && r[r.length - 1].trim() === '') r.pop(); return r; });
    const title = /^(?:KINETIQ|Joulvo Gym) build: ([^\r\n]*)$/.exec((rows[0] || [])[0] || '');
    const head = [HEAD, HEAD_OCT].find(h => JSON.stringify(h) === JSON.stringify(rows[1]));
    if (!title || !head) refuse('This is not a list exported from this site.');
    const at = name => head.indexOf(name), byName = new Map(data.parts.map(p => [p.name, p.id]));
    const list = [];
    for (const r of rows.slice(2)) {
      if (!r.length || !/^\d{1,4}$/.test(r[at('Rank')].trim())) break;       // the totals and the accessory list follow
      if (r[at('Price basis')] !== 'Your price') continue;
      const unit = (r[at('Unit price USD')] || '').trim();
      if (!/^\d{1,6}(\.\d{1,2})?$/.test(unit) || !good(Number(unit))) refuse('A price in this file is not a number between 0 and 100,000.');
      list.push([byName.get(r[at('Part')]) ?? '', Number(unit)]);
      if (list.length > MAX_LINES) refuse('This file holds too many lines.');
    }
    if (!list.length) refuse('This file has no prices of your own in it.');
    // "V1 (220 battery) (CAD first look). Resistance: ...": the longest build label the title starts with
    const build = data.motors.filter(m => title[1].startsWith(`${m.label} (`)).sort((a, b) => b.label.length - a.label.length)[0];
    return result(list, build && build.id, data, 'the exported list');
  }

  function result(list, motor, data, from) {
    const known = new Set(data.parts.map(p => p.id)), prices = {};
    let left = 0;
    for (const [id, n] of list) { if (known.has(id)) prices[id] = cents(n); else left++; }
    const count = Object.keys(prices).length;
    if (!count) refuse('None of these lines are in the current parts list.');
    return { prices, motor: data.motors.some(m => m.id === motor) ? motor : '', count, left, from };
  }

  function parseCsv(text) {                                                   // RFC 4180: quoted fields, "" for a quote, CRLF or LF
    const rows = []; let row = [], cell = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (quoted) { if (c !== '"') cell += c; else if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false; }
      else if (c === '"' && cell === '') quoted = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
      else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell.replace(/\r$/, '')); rows.push(row); }
    return rows;
  }

  root.PriceTransfer = { KEY, OLD_KEY, HEAD, MARK, MAX_LINK, MAX_CSV, Refused, load, save, ownPrices, pack, link, unpack, fromCsv };
})(globalThis);
