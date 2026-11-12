# Tara: bridal creator site (draft preview)

A static Astro site for Tara, an emerging bridal creator planning celebrations in India, Italy and America. Draft preview: not indexed, nothing for sale, no accounts, database, payments, paid APIs or secrets.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: hero, intro, lookbook and journal teasers, the three weddings, wedding fund note |
| `/about` | About Tara: known facts, what is still blank, what this preview is |
| `/weddings` | The Three Weddings: India, Italy, America, with a comparison table |
| `/lookbook` | Look grid with filter and sort, filter state kept in the URL |
| `/lookbook/<look>` | Eight look detail pages: inspiration, details, questions |
| `/journal` | Six starter post drafts |
| `/journal/<post>` | Post pages |
| `/partner` | Draft media kit, audience pillars, example packages (not offers), pitch template |
| `/newsletter` | Front-end draft signup (localStorage, optional mailto) |
| `/404` | Not found |

## Run it

Requires Node.js 22 or newer (`.nvmrc`).

| Command | Action |
| :------ | :----- |
| `npm ci` | Install dependencies |
| `npm run dev` | Local dev server at `localhost:4321` |
| `npm run build` | Static site in `dist/` |
| `npm run preview` | Serve `dist/` |
| `npm run typecheck` | `astro check` |
| `npm test` | Unit tests (Vitest) |
| `npm run test:links` | Check links, images, srcset and anchors in `dist/` (after build) |
| `npm run test:browser` | Browser QA on every page at 320, 390 and 1440 px, plus interactions (after build; needs Chrome or Chromium) |
| `npm run screenshots` | Rewrites `docs/screenshots/` at 1440x900 and 390x844 (after build) |
| `npm run images` | Re-optimize bridal images from `assets/source-images/` |
| `npm run check` | Typecheck, tests, build, link check, browser QA |

## Where things live

- Copy and data: `src/data/` (`site.ts` for celebrations and menus, `looks.ts`, `journal.ts`, `partner.ts`, `images.ts`).
- Pure logic with tests: `src/lib/lookbook.ts`, `src/lib/newsletter.ts`.
- Components: `src/components/`. Client script: `src/scripts/site.ts`. Styles: `src/styles/global.css`.
- Docs: `docs/PLAYBOOK.md` (growth playbook), `docs/ART-DIRECTION.md`, `docs/IMAGE-SLOTS.md`, `docs/PROVENANCE.md`, `docs/screenshots/`.

## Hosting config

Static hosting of `dist/` only. Nothing here deploys anywhere.

- `firebase.json`: serves `dist/` with `X-Robots-Tag: noindex` and security headers. No site or project name is hardcoded and there is no `.firebaserc`. To use it, run `firebase use --add` against a project you own, then `firebase deploy --only hosting`.
- `netlify.toml`: `npm run build`, publish `dist`, Node 22, same headers.
- `public/_headers`: the same headers for hosts that read it.

Before a real launch, remove `noindex`, `robots.txt` disallow and the `X-Robots-Tag` headers together, replace placeholder handles and the contact address, and replace the AI-generated images or keep labeling them.
