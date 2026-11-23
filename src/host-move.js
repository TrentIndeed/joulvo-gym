// The move from kinetiqgym.com to joulvo.com. One Worker answers on both names.
//
// Everything in this file is OFF unless the Worker variable JOULVO_REDIRECTS is exactly "on". Off: hostMove() returns null for every
// request, so every host behaves as it did before.
//
// On, for GET and HEAD only:
//   kinetiqgym.com, www.kinetiqgym.com   one 301 to the same page and query string on https://joulvo.com
//   www.joulvo.com                       one 301 to joulvo.com
//   http://joulvo.com                    one 301 to the same page on https
//   any other host                       nothing (https://joulvo.com itself, previews, local runs)
// POST and every other method are never redirected, and nor is /api/: the forms and the feedback endpoint answer on all four names,
// with the same database.
//
// Paths that keep answering on the old names:
//   /owner/, /agent-inbox.js   the owner's inbox; its page only allows scripts from its own host
//   /media/                    pictures and films that other sites link to
//   /build and the files it loads (BUILD_FILES, /data/), until JOULVO_BUILD_UNTIL: a visitor's own prices are saved in their browser for
//                              the old name and can't follow a redirect. The page there offers to carry them over (site/app.js).
// JOULVO_BUILD_UNTIL is the last day, as YYYY-MM-DD (UTC): 90 days after the move. Without a valid date /build stays, so that nobody's
// saved prices are cut off by a missing setting.
export const HOME = 'https://joulvo.com';
export const OLD_HOSTS = ['kinetiqgym.com', 'www.kinetiqgym.com'];
export const NEW_WWW = 'www.joulvo.com';
const BUILD_PAGE = ['/build', '/build/', '/build.html'];
const BUILD_FILES = ['/app.js', '/price-transfer.js', '/styles.css', '/community.css'];

export const moveOn = env => env.JOULVO_REDIRECTS === 'on';

export function buildStays(env, now = Date.now()) {
  const day = /^\d{4}-\d{2}-\d{2}$/.test(env.JOULVO_BUILD_UNTIL || '') ? Date.parse(`${env.JOULVO_BUILD_UNTIL}T23:59:59.999Z`) : NaN;
  return Number.isNaN(day) || now <= day;
}

function staysOnOldHost(path, env, now) {
  if (path.startsWith('/owner/') || path === '/agent-inbox.js' || path.startsWith('/media/')) return true;
  return buildStays(env, now) && (BUILD_PAGE.includes(path) || BUILD_FILES.includes(path) || path.startsWith('/data/'));
}

// The static host answers /work.html and /work/ with a redirect to /work. Sending an old link straight to the final address keeps it at
// one hop.
export function finalPath(path) {
  let p = path.replace(/\/index\.html$/, '/');
  if (p.endsWith('.html')) p = p.slice(0, -5);
  if (p.length > 1 && p.endsWith('/') && !p.endsWith('//')) p = p.slice(0, -1);
  return p || '/';
}

// A Response, or null when the request is to be answered as usual.
export function hostMove(request, env, now = Date.now()) {
  if (!moveOn(env)) return null;
  const url = new URL(request.url);
  const old = OLD_HOSTS.includes(url.hostname);
  const plain = url.hostname === 'joulvo.com' && url.protocol === 'http:';
  if (!old && !plain && url.hostname !== NEW_WWW) return null;
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  // The build page on an old name asks this before it shows its "this page moved" notice. With the move off it is a 404, as any unknown
  // /api/ path.
  if (old && url.pathname === '/api/site-move' && buildStays(env, now)) {
    return new Response(request.method === 'HEAD' ? null : JSON.stringify({ movedTo: HOME, until: env.JOULVO_BUILD_UNTIL || null }), {
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  if (url.pathname.startsWith('/api/')) return null;
  if (old && staysOnOldHost(url.pathname, env, now)) return null;
  // An hour, not for ever: browsers keep a 301 without a limit, which would outlive a rollback.
  return new Response(null, { status: 301, headers: { location: HOME + finalPath(url.pathname) + url.search, 'cache-control': 'public, max-age=3600' } });
}
