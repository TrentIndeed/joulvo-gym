# Joulvo website

joulvo.com, formerly kinetiqgym.com.

Static HTML, CSS and JavaScript, served by a Cloudflare Worker with static assets (`../src/worker.js`; the Worker adds the
build-list and project-form endpoints). For a quick static preview:

```sh
python -m http.server 8770 --directory site
```

- `index.html`, `home.css`, `home.js`: the front page, `work.html` and `privacy.html`.
- `build.html`, `styles.css`, `app.js`: the build preview. The lineup cards, the picture viewer and the parts list read `data/project.json`: the builds (`motors`;
  `default` marks V1, `lead` the lowest-cost one; each has its `facts`, `status` and `images`), the main list (`parts`; a `motor` list
  limits a part to those builds; a `price` of `null` is "price to come" and is left out of the total), the accessory list and the
  have-it-made price (`outsourced`). The front page's lineup reads the same file. Prices are planning
  figures, not live inventory or quotes. A visitor's own prices and chosen build stay in their browser's local storage
  (`price-transfer.js`: the saved key, the link that carries them over from kinetiqgym.com, and reading an exported list back).
- `data/parts.csv`: the same lists as a download.
- `sitemap.xml`: written by `node tools/make-sitemap.mjs` from the pages' canonical links; run it when a page is added or removed.
- The logo: `.wordmark` in `community.css` draws the J mark (the points of `media/joulvo-j.svg`) followed by OULVO in the site's font, leaned so that the
  O's left side is parallel to the right edge of the J's stem, in the text's colour. Each page only holds the word "Joulvo", so the
  drawing is in one place.
- `media/joulvo-mark*.svg`: the J alone (`-light` for dark grounds, `-dark` for light grounds, and the tab icon, which follows the
  browser's theme and has a tighter canvas). Change only a fill, never a path. `media/mark.svg` is the earlier name's mark, kept.
- `media/builds/`: one picture set per build (covers on, covers off, the exit, the mount). They are quick previews from the CAD, to be
  replaced by final renders; `media/launch/hero-v1-preview.mp4` is a preview too.
- `data/community.json`: the donation checkout link. Payments are handled by the provider, never on this site.
- `docs/`: readable HTML copies of the public Markdown references. Keep both copies aligned.

The renders and the build preview are design illustrations, not photographs of validated hardware or a working app. V1's CAD,
build files and software are released after the prototype is tested. V0's design files will be available once a verification pass is
done, and building V0 is not recommended. Do not present anything here as a validated download.
