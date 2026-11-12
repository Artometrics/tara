# Image slots

**All photographic imagery on this site is AI-generated and illustrative.** These are not photos of Tara, and none is a photograph of her family, her partner, a real venue, a real vendor or a real outfit. Every `alt` text says so, and the footer repeats it. Replace these with real photography as it exists, and keep labeling anything that stays AI-generated.

The six generated images live in `public/images/bridal/`. Originals are kept outside the build in `assets/source-images/bridal/`. Run `npm run images` to regenerate the optimized files (webp plus jpeg fallback, a full size and a 640px size). Source images are 1280px or smaller, so nothing is upscaled; the 1600px cap in the script only applies to larger replacements.

## Slots filled with generated images

| Slot | Where it appears | File | Source size | Ratio | Notes |
| --- | --- | --- | --- | --- | --- |
| Home hero | Home, top of page | `hero-lehenga` | 1280x720 | 16:9 | Cropped with `object-fit: cover`, focus at 30% on narrow screens |
| India celebration | Home "three weddings" card, Weddings section | `india-mandap` | 1152x864 | 4:3 | Cropped to 3:4 in the home card on desktop |
| Italy celebration | Home card, Weddings section, "The Weddings" mega menu photo | `italy-villa` | 1152x864 | 4:3 | |
| America celebration | Home card, Weddings section | `us-ceremony` | 1152x864 | 4:3 | |
| Lookbook card and detail | Lookbook grid, look detail "Silk Column & Cathedral Veil", home tout and featured looks, "Lookbook" mega menu photo | `look-silk-gown` | 864x1152 | 3:4 | The only lookbook look with an illustration |
| Creator and About | About page "creator" section, home "Journal" tout | `creator-flatlay` | 864x1152 | 3:4 | A creator's desk with henna hands. Not Tara's hands |

## Slots using drawn placeholders

These use the `Plate` component: a gradient from two palette colors with a simple line drawing and the label "Image slot" or "Cover slot". They are deliberately plain so they read as placeholders, not as finished art.

| Slot | Where | Motif | Wanted when real |
| --- | --- | --- | --- |
| Look: Blush Lehenga & Net Dupatta | Lookbook grid, detail | dupatta | 3:4 inspiration image |
| Look: Marigold Morning Look | Lookbook grid, detail | marigold | 3:4 |
| Look: Red & Gold Ceremony Study | Lookbook grid, detail | arch | 3:4 |
| Look: Terracotta Welcome Dinner | Lookbook grid, detail, home featured | table | 3:4 |
| Look: Lemon Grove Aperitivo | Lookbook grid, detail | lemon | 3:4 |
| Look: Ivory Aisle Gown | Lookbook grid, detail | aisle | 3:4 |
| Look: Fusion Reception Second Look | Lookbook grid, detail | jacket | 3:4 |
| Journal cover: Lehenga shopping | Journal index, post, home | dupatta | 4:3 card, 16:9 on the post |
| Journal cover: Italy venue scouting | Journal index, post, home | lemon | 4:3, 16:9 |
| Journal cover: Fusion ceremonies | Journal index, post, home | arch | 4:3, 16:9 |
| Journal cover: Budget diary #0 | Journal index, post | table | 4:3, 16:9 |
| Journal cover: Making content around a full-time job | Journal index, post | marigold | 4:3, 16:9 |
| Journal cover: The three-dress question | Journal index, post | veil | 4:3, 16:9 |

## Other visual elements (not photos)

| Element | File or component |
| --- | --- |
| Favicon | `public/favicon.svg` (a diamond with a marigold center) |
| Footer lockup | Inline SVG in `src/components/Footer.astro` |
| Ornament dividers and corner gems | `src/components/Ornament.astro` and button gems in CSS |

## Rules for replacing images

1. Put the original in `assets/source-images/bridal/` using the same base name, run `npm run images`, then `npm run build`.
2. If adding a new slot, add it to `src/data/images.ts` with honest alt text.
3. Photographs of people need consent from everyone shown. Do not publish guests, children or vendors without permission.
4. Keep captions truthful. If it is AI-generated, say so.
