# KINETIQ website

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
  figures, not live inventory or quotes. A visitor's own prices and chosen build stay in their browser's local storage.
- `data/parts.csv`: the same lists as a download.
- `media/builds/`: one picture set per build (covers on, covers off, the exit, the mount). They are quick previews from the CAD, to be
  replaced by final renders; `media/launch/hero-v1-preview.mp4` is a preview too.
- `data/community.json`: the donation checkout link. Payments are handled by the provider, never on this site.
- `docs/`: readable HTML copies of the public Markdown references. Keep both copies aligned.

The renders and the build preview are design illustrations, not photographs of validated hardware or a working app. The CAD,
build files and software are released after the prototype is tested; do not present anything here as a validated download.
