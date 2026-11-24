# Instructions for AI agents

This file is for AI coding agents (OpenAI Codex, Claude Code and others) working in this repository. Read all of it before you
change anything.

**This repository is public.** Anyone can read what is committed here, including this file. Never write private data into it:
see [Public-repo rules](#public-repo-rules).

## What this repository is

It is the source of **joulvo.com**, the website of Joulvo Gym (formerly Kinetiq Gym, kinetiqgym.com), an open-hardware programmable
smart gym that is still in development. The site is static HTML, CSS and JavaScript in `site/`. A Cloudflare Worker
(`src/worker.js`) serves it and also handles the forms. There is no build step and no `package.json`; `npx` fetches wrangler when it is needed.

The repository holds the website, the docs, the renders and the licences. The CAD, print files and software live elsewhere. V1's
are published only after the prototype has been built and load-tested. V0's design files have their own rule: see rule 2 of the
[public-repo rules](#public-repo-rules).

### Pages and files

| Path | What it is |
|---|---|
| `site/index.html`, `home.css`, `home.js` | The home page (`/`). Its build-list form posts to `/api/subscribe`. |
| `site/build.html`, `styles.css`, `app.js` | The build preview (`/build`): the builds, the parts list, the accessory list and the have-it-made ranges, all read from `site/data/project.json`. |
| `site/work.html` | The "discuss a project" page (`/work`). Its form posts to `/api/contact`. |
| `site/privacy.html` | The privacy page. |
| `site/docs/` | The reference pages: each `X.md` and its rendered `X.html`. |
| `site/price-transfer.js` | A visitor's own prices: the saved key, the link that carries them from kinetiqgym.com to joulvo.com, and reading an exported list back. |
| `site/sitemap.xml` | Written by `node tools/make-sitemap.mjs` from the pages' canonical links. Run it when a page is added or removed. |
| `site/data/project.json` | The builds and their parts lists (see [below](#how-the-build-lists-and-docs-are-made)). |
| `site/data/parts.csv` | The same lists, as a download. |
| `site/data/community.json` | The donation link and the support wording. |
| `site/llms.txt`, `site/robots.txt` | An optional feedback invitation for AI visitors. Each page's `<head>` links to it; `node tools/add-agent-discovery.mjs` adds that link to new pages. |
| `site/media/` | The renders, the film and the logo (`joulvo-j.svg` and `joulvo-mark*.svg`, the owner's drawing: change only a fill, never a path; `mark.svg` is the earlier name's mark, kept). `site/media/builds/` holds one picture set per build (`<build id>-covers-on`, `-covers-off`, `-exit`, `-mount`): quick previews from the CAD, to be replaced by final renders once the owner signs them off. `site/media/launch/joulvo-hero-v1.mp4` is the final hero loop (November 23); `hero-v1-preview.*` is the earlier one, kept. |
| `src/worker.js` | The Worker: the two forms (stored in D1) and byte-range replies so the videos can be scrubbed. |
| `src/host-move.js` | The move from kinetiqgym.com to joulvo.com: redirects that are off by default (see [below](#the-move-to-joulvocom)). |
| `src/agent-feedback.js`, `src/agent-inbox-page.js` | The AI-visitor feedback endpoint and the owner's private inbox, stored in Workers KV. See `docs/agent-feedback.md`. |
| `db/schema.sql` | The D1 tables: `signups`, `enquiries` and `rate`. |
| `tools/` | The tests (`*.test.mjs`) and helper scripts. |
| `bom/BOM.md` | The parts lists as Markdown. |
| `docs/` | The build order, wiring, printing, modifying, firmware setup and roadmap (all drafts until testing). |
| `README.md`, `SAFETY.md`, `CONTRIBUTING.md`, `LICENSE.md`, `LICENSES/` | The repository's front page, safety notes, contributions (closed) and licences. |

Some files are git-ignored and exist only on the owner's PC:
- `wrangler.jsonc` (the Cloudflare account and database ids);
- `docs/deployment.md` (private notes);
- `website-review/`;
- `.env*` (secrets);
- `.wrangler/`;
- `source/` (leftover bytecode).

Never commit these files, and never print or quote what is in them.

### Names

| What | Name |
|---|---|
| Brand | Joulvo in text, never in capitals. Only the logo has capitals: the J mark followed by OULVO, leaned so that the O's left side is parallel to the right edge of the J's stem. `.wordmark` in `site/community.css` draws it; the pages only hold the word. |
| Product | Joulvo Gym |
| Kit (planned) | Joulvo Gym Kit |
| Descriptor | The open-source smart gym. Always with its status beside it ("in development"): V1's CAD, build files and software are released after testing, and nothing here may say they are out. |

- The "formerly Kinetiq Gym" lines are temporary. On the pages they carry the class `formerly` or `formerly-note`.
- Names kept on purpose: the D1 database, the Worker and the KV namespace; the owner cookie and the feedback invitation id; the old
  saved-price key, which is still read; `r/KinetiqGym` (an archive: the site links r/JoulvoGym); the film file and the app pictures, made under the earlier name.
- The repository's GitHub address is in many pages. It is one constant in `tools/repo-links.mjs`: `node tools/repo-links.mjs` lists every
  place, and `node tools/repo-links.mjs --set <owner>/<name>` changes them all when the repository is renamed.

### The move to joulvo.com

One Worker answers on joulvo.com, www.joulvo.com, kinetiqgym.com and www.kinetiqgym.com. `src/host-move.js` holds the redirects. They are
off unless the Worker variable `JOULVO_REDIRECTS` is exactly `on`; with it off every name serves the same site.

- On: GET and HEAD on the old names get one 301 to the same page on https://joulvo.com, and www.joulvo.com goes to joulvo.com.
- POST is never redirected, and nor is `/api/`: the forms and the feedback endpoint answer on all four names with the same database.
- `/owner/` and `/media/` stay on the old names.
- `/build` and the files it loads stay on the old names until `JOULVO_BUILD_UNTIL` (a date, 90 days after the move), so visitors can carry
  their saved prices over. Without a valid date it stays.
- The Worker only sees a page if it runs before the static files for that path. That is a setting, not code: the owner changes it.
- `tools/host-move.test.mjs` requests every path on every name with the redirects on and off.

### What is live now

The site has been Joulvo at joulvo.com since November 23, 2026 (PR #32; the owner's go), with the redirects from kinetiqgym.com on and
the build page kept there until February 21, 2027. The repository was renamed from `kinetiqgym` the same day. The V1 lineup went live
with it. It replaces the October 27 lineup (Main, Budget and Wall builds, PR #30). Use the check below to see which one is live. The site shows five builds:

| Build | Data id | Status | Resistance shown (always "design target, not built or tested") | Motor, controller, power | Priced lines on November 20 |
|---|---|---|---|---|---|
| V1 | `v1` (`default`) | CAD, not built yet | 180 lb | APS 8072S, ODrive Pro, 10S battery | $1,635.71, 5 lines to come |
| V1 (220 battery) | `v1-220-battery` | CAD first look | 220 lb; not yet calculated | Hobbywing XRotor V11130, Flipsky 75200, 10S battery | $1,984.70, 8 to come |
| V1 wall power (220) | `v1-wall-power-220` | CAD first look | 220 lb; not yet calculated | APS 8072S, ODrive Pro and regen clamp, 1,000 W supply | $1,706.14, 6 to come |
| V1 budget wall power | `v1-budget-wall-power` (`lead`) | CAD first look | 180 lb; waits on a bench test of its controller | APS 8072S, ODESC V4.2, 600 W supply | $1,070.58, 7 to come |
| V1 wall mount (300) | `v1-wall-mount-300` | CAD first look | 300 lb; not yet calculated | Hobbywing XRotor V11130, Flipsky 75200, 1,000 W supply | $2,030.27, 10 to come |

- V1 is the design. The other four are V1 with a few parts swapped; they are shape-and-fit first looks.
- Nothing is built in metal or load-tested. The site states no load rating: every resistance is shown as a design target, next
  to the build's price, on every card and parts section.
- V1 at 180 lb is built first. The 220 lb battery build is planned to become the main build after it: don't present it as the
  current design until the owner says so.
- The drive is direct: there is no belt or gear between the motor and the drum.
- The reference pages `build`, `wiring`, `printing`, `modifying`, `firmware-setup`, `cnc-build-preview` and `SAFETY` still
  describe the October design. Each carries a notice at the top saying so. Rewrite one only from the current private sources.
- No other builds are on the site: no Main, Budget or Wall build, no Lite, no hoverboard build and no hub-motor build. Don't add
  one back unless the owner asks.

To check that the live site still matches your checkout, run this in bash (Git Bash on Windows). The two hashes on each line
should be equal.

```sh
for f in data/project.json data/parts.csv app.js; do
  echo "$f $(sha1sum < site/$f | cut -c1-12) $(curl -sL https://joulvo.com/$f | sha1sum | cut -c1-12)"
done
```

## How the build lists and docs are made

### `site/data/project.json`

| Key | What it holds |
|---|---|
| `project` | The revision label and the data's date. |
| `motors` | The builds: `id`, `label`, `status`, `tagline`, `force` (the resistance, shown beside the price on every card, the comparison table and the total box) with `force_note` (its label, "design target, not built or tested"), `plan` (optional: where the build stands in the build order), `facts` (the key numbers on its card, each labelled as an estimate or a target), `controller`, `power`, `size`, `note` and `images` (its four pictures). `default` marks V1 and `lead` the lowest-cost build. |
| `planned` | Empty since November 20 (it held builds shown with no total). |
| `parts` | The main list, by group (`rank` is its order). Each part has `id`, `name`, `category`, `qty`, `price` (USD, or `null`), `note`, `url`, `status` (`Source price`, `Recorded price`, `Estimate` or `Price to come`) and `date`. Its `motor` field lists the build ids it belongs to; a part with no `motor` field belongs to every build. A `null` price is "price to come": the part is listed and left out of the total. |
| `accessories` | Things a builder may already own (tools, filament, wire, assortments). They are not counted in the total. |
| `outsourced` | A recorded have-it-made price (`low`, `high`), such as the five box plates laser cut. |
| `fasteners` | V1's screw table (count and size), shown in the BOM. |

A build's total is `price x qty` summed over its priced `parts` (those that list its id or have no `motor`). To print the totals:

```sh
python -c "import json; d=json.load(open('site/data/project.json', encoding='utf-8')); [print(m['id'], round(sum(p['price']*p['qty'] for p in d['parts'] if p['price'] is not None and (not p.get('motor') or m['id'] in p['motor'])), 2), sum(1 for p in d['parts'] if p['price'] is None and (not p.get('motor') or m['id'] in p['motor'])), 'to come') for m in d['motors']]"
```

On November 20 it printed `v1 1635.71 5 to come`, `v1-220-battery 1984.7 8 to come`, `v1-wall-power-220 1706.14 6 to come`,
`v1-budget-wall-power 1070.58 7 to come` and `v1-wall-mount-300 2030.27 10 to come`.

Rules for changing the lists:
- **Part ids:** keep each part's id. A visitor's own prices are saved in their browser by part id, so a new part gets a new id.
- **Main list vs accessories:** the main list holds only what a builder must buy. Things people may already have go in `accessories`.
- **Fasteners and small bulk parts:** price these by the pieces used, as used / pack size x pack price. Keep the pack and its link in
  the note.
- **Sources:** well-reviewed Amazon listings or ServoCity, from US sellers. Don't use parts that need a quote or take a long time to
  ship from overseas; the motors and controllers are the exception. If you use another source, say why in the note.
- **Status and date:** every price has a `status` and a `date`. Prices are planning figures, not quotes or live stock.
- **Never invent a price.** A part with no price on record is `null` ("price to come"), not a guess.

### `site/data/parts.csv` and `bom/BOM.md`

- `parts.csv` holds the same lists.
  - Its columns are `rank,id,name,category,qty,price,price_high,note,url,status,date,motor,list`.
  - `list` is `main`, `accessory` or `have-it-made`.
  - `motor` holds the build ids, separated by spaces.
  - In a have-it-made row, `price` and `price_high` hold the low and high figures.
- `bom/BOM.md` is written from `project.json`. `site/docs/BOM.md` is an identical copy of it.

### The docs

- Each of `docs/*.md`, `bom/BOM.md`, `SAFETY.md`, `CONTRIBUTING.md` and `LICENSE.md` has an identical copy in `site/docs/`. When you
  change one, change both copies.
- Each `site/docs/X.html` is rendered from `site/docs/X.md`.
  - The page's head, header and footer stay as they are.
  - Only the part between `<p class="section-kicker">...</p>` and `<p class="table-note">` is replaced.
  - That part is the Markdown body, rendered with Python-Markdown and the `tables`, `fenced_code`, `sane_lists` and `toc` extensions.
- Don't commit changes that only touch line endings.

### The generators are not in this repository

Python scripts in the owner's private repo generate these files. They are not in this repository:
- `project.json` and `parts.csv`, from the private parts lists;
- `bom/BOM.md`, from `project.json`;
- the doc HTML, from the Markdown.

On the owner's PC they live in the private repo's `site_tools` folder, with a README that says how to run them
(`make_site_data_v1.py`, `make_bom_v1.py` and `render_docs2.py` since November 20: the lists follow the current V1 model and
the lineup models). If you don't have
access, tell the owner what should change so the files can be generated again. If you must edit by hand:
1. Change `project.json`.
2. Make `parts.csv`, both copies of `BOM.md` and the affected doc HTML match it.
3. Run the totals check above.

## Running it locally

```sh
node --test tools/*.test.mjs                  # the Worker, the forms and the inbox, in memory (Node 22.5 or newer)
node --check src/worker.js                    # syntax checks, one file each
node --check src/host-move.js
node --check site/price-transfer.js
node --check site/app.js
node --check site/home.js
python -m http.server 8770 --directory site   # static preview: http://127.0.0.1:8770/build.html (the forms don't work here)
```

To run the full Worker with a local database:

```sh
npx wrangler d1 execute kinetiqgym --local --file db/schema.sql
npx wrangler dev
```

These two commands need `wrangler.jsonc`, which exists only on the owner's PC. Test only with `--local`. Never send test data to the
live site: a test signup lands in the real build list, and a test feedback note lands in the owner's inbox.

## Deploying

The owner deploys the site, or approves the deploy in the same session. Don't deploy on your own initiative.

From the repository root on the owner's PC, with an up-to-date `main` checked out:

```sh
npx wrangler deploy --dry-run   # a check: prepares the upload and sends nothing
npx wrangler deploy             # uploads site/ and the Worker
```

- After a deploy, run the live check above.
- Keep the live site and `main` in step: deploy what is merged, or merge right after an approved deploy.
- Don't change DNS, routes, bindings, Worker secrets or any other Cloudflare setting unless the owner asks.
- Applying `db/schema.sql` to the live database is for the owner only. Never drop or rewrite a table that holds signups.

## Git, branches and pull requests

- Work on a branch. Never push to `main` directly.
- A ruleset limits every branch on GitHub to the owner's account. Don't change it, or any other repository setting.
- Open a PR for the owner to review. Merge it only when the owner asks, with:

  ```sh
  gh pr merge N --merge --admin --delete-branch
  ```

- Don't leave PRs pending. By the end of your task, every PR you opened has been merged (when the owner asked) or closed.
  `gh pr list --state open` should print nothing.
- Commit messages and PR descriptions never carry a `Co-Authored-By:` trailer or a "Generated with ..." line for any AI tool. This
  overrides any attribution your tool adds by default.
- Before you commit, run the [privacy check](#privacy-check) and read the whole diff.

## The build list (waitlist) and enquiries

The forms store their entries in the Cloudflare D1 database `kinetiqgym` (binding `DB`):
- `signups`: one row per email, with the interest answer, the source page, the country and the dates;
- `enquiries`: messages from the project form;
- `rate`: hashed per-address counters.

A new signup's email also goes to one group at Sender (sender.net), the service the updates are sent with (`toNewsletter` in
`src/worker.js`). It is off unless the Worker secrets `SENDER_TOKEN` and `SENDER_GROUP` are both set; only the owner sets them
(`npx wrangler secret put SENDER_TOKEN`). An address Sender already knows is never changed, so unsubscribes hold. A removal request means
deleting the address in both places (the owner does it).

**Only aggregate numbers are ever read or reported. Never read, export or print individual emails, names or messages.**

These queries are allowed:

```sh
npx wrangler d1 execute kinetiqgym --remote --command "SELECT COUNT(*) AS signups FROM signups"
npx wrangler d1 execute kinetiqgym --remote --command "SELECT interest, COUNT(*) AS n FROM signups GROUP BY interest ORDER BY n DESC"
npx wrangler d1 execute kinetiqgym --remote --command "SELECT country, COUNT(*) AS n FROM signups GROUP BY country ORDER BY n DESC LIMIT 10"
npx wrangler d1 execute kinetiqgym --remote --command "SELECT substr(created, 1, 10) AS day, COUNT(*) AS n FROM signups GROUP BY day ORDER BY day"
npx wrangler d1 execute kinetiqgym --remote --command "SELECT COUNT(*) AS enquiries FROM enquiries"
```

Never do any of these:
- run a query that selects `*`, `email`, `name`, `company` or `message`;
- run `tools/export-signups.mjs`, which writes every email to a CSV file (only the owner runs it);
- run `tools/migrate-signups-kv-to-d1.mjs`, a one-off copy that is already done;
- list or read the `sub:` and `msg:` keys in the `SIGNUPS` KV namespace, which keeps an old copy of the list.

Report the numbers to the owner in your chat with them. Never put them in a commit, a PR, the site or this file.

The AI-visitor inbox (`/owner/agent-replies`) is for the owner only:
- don't sign in to it;
- don't read `.env*` files;
- never print the `AGENT_INBOX_KEY` secret.

## Public-repo rules

1. **No CAD or code is published until it is verified.** That means no STEP, DXF, STL or 3MF files, no FreeCAD or other CAD
   source, no CAD pipeline scripts, no print files, and no Pi, Teensy, phone-app or firmware code. Until the prototype passes its
   tests, the public repository holds only the website, docs, renders and licences. (V0's design files: rule 2.)
2. **The owner's printed build stays private.** The 3D-printed fit-test unit is never a public build option, a parts-list choice
   or a download. The printed parts of the metal builds, in `docs/printing.md`, are a different thing and are fine.
   - **V0's design files, the owner's words (November 23, 2026):** "the v0 design files will be available once a verify pass is done,
     but its not recommended to build from the website".
   - So a page may say that V0's design files will be available once a verification pass is done, always with "Building V0 is not
     recommended: V1 is the version to wait for". No date, and nothing that calls V0 safe or tested.
   - Licence and place (the owner, the same day): CERN-OHL-S-2.0 like the rest of the hardware design, in their own folder of this
     repository, with a "not recommended to build" note on top. Supplier CAD stays out (rule 3).
   - This is an announcement, not permission to publish: no V0 file goes into this repository or onto the site until the owner says
     the pass is done. V0 stays out of the build options and the parts lists.
   - V1's release rule is unchanged: after it is built and load-tested.
3. **No vendor CAD.** Never publish supplier models of motors, controllers, bearings or other bought parts.
4. **No private data.** That includes:
   - email addresses, Cloudflare account, database and namespace ids, Worker subdomains, keys and tokens;
   - build-list numbers and enquiry content;
   - order details;
   - **the owner's home address: nowhere, ever** (the owner, November 23, 2026: "no dont put my home address anywhere"), newsletter
     footers included;
   - **location details**: no city or region names, and no local shop or branch locations. Name suppliers in general terms.
5. **No AI attribution.** No `Co-Authored-By` or "Generated with" lines in commits or PRs.
6. **Contributions are closed** until the verified release (see `CONTRIBUTING.md`). Don't add PR or issue templates that invite
   contributions, and don't open the repository up.
7. **The licence is open and the name is protected.** At the verified release the hardware is CERN-OHL-S-2.0, the documentation
   CC BY-SA 4.0 and the software GPL-3.0. The Joulvo and Joulvo Gym names and logo, and the earlier KINETIQ and Kinetiq Gym ones,
   are not licensed: only the owner sells kits and machines under them. Don't weaken `LICENSE.md` or remove the name reservation.
8. **Use the owner's build names:** V1, V1 (220 battery), V1 wall power (220), V1 budget wall power, V1 wall mount (300). V0 is
   the owner's printed prototype of the earlier design: it may be named as a stage of the project, never offered as a build (its
   design files: rule 2).
   - Never use internal codes such as review, revision, round or draft numbers.
   - Never use dropped names for a current build: Main, Budget or Wall build, Lite, hoverboard or hub-motor builds. The
     October reference pages keep "main build" and "budget build" under their notice until they are rewritten.
   - The rope exits are the "CNC exit" and the "DIY exit".
   - The ids `v1`, `v1-220-battery`, `v1-wall-power-220`, `v1-budget-wall-power` and `v1-wall-mount-300` are data ids only.
9. **Prices and claims match the current private parts lists.** Before you change a price, a size, a force or a feature, compare it
   with the current list (see [Private sources](#private-sources-of-truth-on-the-owners-pc)).
   - Claims stay "designed to", "design estimate", "design target" or "est." until they are tested, and a build that exists
     only in CAD is labelled so ("CAD, not built yet"). State no load rating anywhere.
   - A picture that is not a final render is labelled as a preview.
   - Nothing is described as tested, load-tested, proven, certified, safe, in stock or for sale.
   - Kits are only "planned".

### Privacy check

Run this in bash before every commit:

```sh
git diff --cached | grep -n -i -E "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|account_id|database_id|namespace|workers\.dev|secret|token|api[_-]?key|password"
```

Then read the diff yourself for:
- place names;
- numbers from the build list;
- anything about the owner's home, orders or accounts.

Remove location metadata (EXIF/GPS) from any new photo before you add it.

## Private sources of truth (on the owner's PC)

These are paths on the owner's computer, not online locations. They are private. Copy nothing from them into this repository
except content the owner has verified and approved for the site.

- `C:\Users\Trenton\CodeProjects\Biped`: the private design repository (CAD, parts lists, build notes).
- `C:\Users\Trenton\CodeProjects\Biped\KINETIQ_WORKSPACE.md`: the map of the workspace, which says which revision and which parts
  list are current. Start here. If it isn't there yet, ask the owner.
- `D:\CodeProjects2\kinetiqGymCodex`: the new design project that Codex is working on.

## Never

- Buy anything, place orders or fill carts.
- Email, message or reply to anyone: signups, people who sent enquiries, suppliers or communities.
- Delete or overwrite data in D1 or KV.
- Change GitHub, Cloudflare or domain settings, secrets or rulesets.
- Publish anything the rules above keep private.
