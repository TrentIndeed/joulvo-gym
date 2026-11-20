'use strict';
// Old links into the builder content (kinetiqgym.com/#parts and the like) now live on build.html.
const MOVED = ['build', 'parts', 'files', 'modify', 'software', 'open-source', 'mechanism', 'repo-status'];
if (MOVED.includes(location.hash.slice(1))) location.replace('/build' + location.hash);

const $ = s => document.querySelector(s);
const bar = $('#top'), nav = $('#site-nav'), toggle = $('.menu-toggle');
const solid = () => bar && bar.classList.toggle('solid', !document.querySelector('.hero') || window.scrollY > 40);
solid(); window.addEventListener('scroll', solid, { passive: true });
if (toggle) {
  toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
  nav.addEventListener('click', e => { if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); } });
}

// the hero loop stays still for people who ask for reduced motion
const hero = $('.hero-video');
if (hero && matchMedia('(prefers-reduced-motion: reduce)').matches) { hero.removeAttribute('autoplay'); hero.pause(); }

// the 1-minute film in a dialog
const dlg = $('#watch');
document.querySelectorAll('[data-watch]').forEach(b => b.addEventListener('click', () => {
  if (!dlg || !dlg.showModal) { location.hash = 'film'; return; }
  dlg.showModal(); const v = dlg.querySelector('video'); v.currentTime = 0; v.play().catch(() => {});
}));
if (dlg) {
  const close = () => { dlg.querySelector('video').pause(); dlg.close(); };
  $('#watch-close').addEventListener('click', close);
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => dlg.querySelector('video').pause());
}

// the build list: email first, then one optional question
let chosen = null, address = '';
document.querySelectorAll('[data-interest]').forEach(a => a.addEventListener('click', () => { chosen = a.dataset.interest; }));
async function post(path, data) {
  const r = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
  let body = {}; try { body = await r.json(); } catch { /* not JSON */ }
  if (!r.ok) throw new Error(body.error || 'Something went wrong. Please try again in a moment.');
  return body;
}
const signup = $('#signup'), interest = $('#interest');
if (signup) signup.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = $('#signup-msg'), btn = signup.querySelector('button[type=submit]'), email = signup.email.value.trim();
  msg.className = 'form-msg'; msg.textContent = '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.classList.add('err'); msg.textContent = 'Enter a valid email address.'; signup.email.focus(); return; }
  btn.disabled = true; btn.textContent = 'Joining…';
  try {
    const res = await post('/api/subscribe', { email, website: signup.website.value, source: 'home', interest: chosen || undefined });
    address = email; signup.hidden = true; interest.hidden = false;
    if (chosen) { const r = interest.querySelector(`input[value="${chosen}"]`); if (r) r.checked = true; }
    $('#interest-msg').className = 'form-msg ok';
    $('#interest-msg').textContent = res.returning ? 'You were already on the list. Thanks for coming back.' : 'You are on the build list.';
    interest.querySelector('input').focus();
  } catch (err) { msg.classList.add('err'); msg.textContent = err.message; }
  finally { btn.disabled = false; btn.textContent = 'Join the Build List'; }
});
const thanks = text => { interest.innerHTML = `<p class="form-msg ok" role="status">${text}</p>`; };
if (interest) {
  interest.addEventListener('submit', async e => {
    e.preventDefault();
    const pick = interest.querySelector('input[name=interest]:checked');
    if (!pick) { thanks('Thanks. You will hear about each stage of the build.'); return; }
    try { await post('/api/subscribe', { email: address, interest: pick.value, source: 'home' }); thanks('Thanks. You will hear about each stage of the build.'); }
    catch (err) { $('#interest-msg').className = 'form-msg err'; $('#interest-msg').textContent = err.message; }
  });
  $('#interest-skip').addEventListener('click', () => thanks('Thanks. You will hear about each stage of the build.'));
}

// the lineup: one card per build, from the same data the build preview uses (data/project.json), so the two pages cannot disagree
const lineup = $('#home-lineup');
if (lineup) fetch('data/project.json').then(r => { if (!r.ok) throw Error('Data unavailable'); return r.json(); }).then(d => {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const usd = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const mine = id => d.parts.filter(p => !p.motor || p.motor.includes(id));
  const fact = (m, k) => (m.facts.find(f => f[0] === k) || [])[1] || '';
  lineup.innerHTML = d.motors.map(m => {
    const parts = mine(m.id), come = parts.filter(p => p.price === null).length;
    const total = parts.filter(p => p.price !== null).reduce((a, p) => a + Math.round(p.price * 100) * p.qty, 0) / 100;
    return `<a class="lineup-card${m.default ? ' current' : ''}" href="/build?motor=${encodeURIComponent(m.id)}#lineup">
      <figure><img src="${esc(m.images['covers-on'])}" width="1600" height="1000" loading="lazy" alt="${esc(m.label)}: CAD preview picture of the unit with its covers on"><figcaption>CAD preview picture, to be re-rendered</figcaption></figure>
      <span class="lineup-state">${esc(m.status)}${m.default ? ' · the current design' : m.lead ? ' · lowest cost' : ''}</span>
      <strong>${esc(m.label)}</strong>
      <span class="lineup-what">${esc(m.tagline)}</span>
      <span class="lineup-fact">${esc(fact(m, 'Motor'))} · ${esc(fact(m, 'Power'))}</span>
      <span class="lineup-fact">Pull: ${esc(fact(m, 'Pull'))}</span>
      <span class="lineup-price">${usd(total)}<small>in priced parts so far${come ? ` · ${come} ${come === 1 ? 'line' : 'lines'} to come` : ''}</small></span>
    </a>`;
  }).join('');
}).catch(() => { /* the fallback link to the build preview stays */ });

// work.html: the project form
const contact = $('#contact');
if (contact) contact.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = $('#contact-msg'), btn = contact.querySelector('button[type=submit]');
  msg.className = 'form-msg'; msg.textContent = '';
  btn.disabled = true; btn.textContent = 'Sending…';
  try {
    await post('/api/contact', Object.fromEntries(new FormData(contact)));
    contact.innerHTML = '<p class="form-msg ok" role="status">Thanks. Your message is in, and I will reply by email.</p>';
  } catch (err) { msg.classList.add('err'); msg.textContent = err.message; btn.disabled = false; btn.textContent = 'Send'; }
});

// the Support section's PayPal button (data/community.json, as on the build page)
const donate = $('#donate-link');
if (donate) fetch('data/community.json').then(r => { if (!r.ok) throw Error('Community settings unavailable'); return r.json(); }).then(c => {
  if (!c.donationUrl) { if (c.donationProvider) $('#donation-pending').textContent = `${c.donationProvider} donation link coming soon.`; return; }
  const url = new URL(c.donationUrl); if (url.protocol !== 'https:') return;
  donate.href = url.href; donate.target = '_blank'; donate.rel = 'noopener noreferrer'; donate.hidden = false; $('#donation-pending').hidden = true;
  if (c.donationProvider) $('#donation-description').textContent = `Secure checkout via ${c.donationProvider}. Goes to prototype iterations and build support.`;
}).catch(() => { /* the page works without the donation link */ });
