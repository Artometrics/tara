# Tara: bridal creator site

This repository is the Tara bridal-creator static preview (Astro, TypeScript). Read `docs/PROVENANCE.md` before changing copy, facts or photography.

- Facts about Tara are limited to those in `docs/PROVENANCE.md`. Do not invent a bio, dates, places, handles, contact details, policies, stock, prices or audience numbers. Use bracketed placeholders.
- Images are AI-generated and illustrative. Keep saying so (alt text, footer, `docs/IMAGE-SLOTS.md`). Do not present them as photos of Tara.
- No music content of any kind: no music page, streaming links or release listings.
- No accounts, database, payments, paid APIs, analytics or secrets. The newsletter stays front-end only.
- Keep `noindex` (meta robots, `public/robots.txt`, and `X-Robots-Tag` in `firebase.json`, `netlify.toml`, `public/_headers`). Keep `firebase.json` free of any site or project name.
- Do not restore the previous boutique template, its products, prices, cart or checkout.
- Partnership packages are examples with no rates. Income is never promised.
- Run `npm run check` before opening a pull request.
