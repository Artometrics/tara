# Provenance

## What this is

A static Astro preview of a bridal-creator website for Tara. It started from a boutique-site template and was rewritten in place: the header and mega menu, hero, card grid, detail pages, footer and mobile menu were kept in structure, and every name, product, price, cart and photograph from that template was removed.

## What is real and what is not

Known facts about Tara, all supplied in the brief for this build:

- Her name is Tara.
- She plans to marry in about two years.
- She works in business and care coordination.
- She is multi-ethnic, of Indian descent.
- She plans three celebrations: India, Italy and America.

Nothing else about Tara is asserted. A previous version of her site was a musical-artist template with placeholder text. None of its music content, bio text, show dates, releases or contact addresses is used here. A surname that appears in old commit history is also deliberately not used until Tara confirms how she wants to be named.

Everything else is labeled as placeholder, draft, example or illustration:

- Dates, places, venues, guest counts: "To be announced".
- Social handles and the contact email (`hello@tara.example`): placeholders. `.example` is a reserved domain that cannot receive mail.
- Journal posts: starter drafts, written as planning frameworks, each ending in a bracketed prompt for Tara's own story.
- Lookbook: inspiration with questions to ask. No brands, shops, prices or links to buy.
- Partner page: a draft media kit with blank metrics and three example packages with no rates.
- Images: AI-generated and illustrative. See `docs/IMAGE-SLOTS.md`.

## Off

Accounts, database, payments, paid APIs, secrets, analytics, email sending, reviews, inventory and fulfillment are all off. The newsletter form stores an address in the visitor's own `localStorage` under `tara.newsletter-draft.v1` or opens a `mailto:` draft. Nothing is sent.

## Indexing

The preview is not meant to be found. `public/robots.txt` disallows crawlers, every page carries `<meta name="robots" content="noindex, nofollow, noarchive">`, and `X-Robots-Tag` is set in `firebase.json`, `netlify.toml` and `public/_headers`. Remove these deliberately and together at launch.
