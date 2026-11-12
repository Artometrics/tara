# Art direction: "Marigold Hour"

Warm ivory paper, blush washes, a marigold glint and Italian terracotta for emphasis. It should feel like late afternoon light in a room with flowers: calm, a little ceremonial, never loud. The structure comes from the boutique template this repo started from (hairline ornaments, diamond gems, script titles, mega menu, drawers), recolored and retyped for a bridal creator.

## Colors

| Name | Hex | Use | Contrast on Ivory Silk |
| --- | --- | --- | --- |
| Ivory Silk | `#FBF5EA` | Page background, button fill | n/a |
| Ivory Linen | `#F3E9D6` | Cards, notes, soft panels | n/a |
| Blush Petal | `#F2D6CE` | Washes, bands, placeholder gradients | n/a |
| Marigold | `#EFA91E` | Ornament diamonds, underlines, tags. Decorative only, never body text | 1.87 |
| Saffron Ink | `#9A5A00` | Small labels and kickers on light backgrounds | 5.04 (AA) |
| Terracotta | `#A8472A` | Primary accent, announcement bar, solid buttons, fund band | 5.38 (AA) |
| Terracotta Deep | `#8F3A20` | Text on blush, hover, emphasis | 6.93 (AA) |
| Aubergine Ink | `#2E1F1D` | Body text, lines | 14.55 (AAA) |
| Rose Taupe | `#6B5650` | Secondary text | 6.30 (AA) |

Ivory text on Terracotta is 5.38:1. Ink text on Marigold is 7.79:1. Secondary text on Blush Petal is 4.98:1.

## Fonts

All three are open-licensed (SIL OFL) and self-hosted through `@fontsource`, so the site makes no third-party requests.

| Role | Font | Weights | Notes |
| --- | --- | --- | --- |
| Display and reading | Cormorant Garamond | 400, 500, 600, 400 italic | Headings, body, captions |
| Script titles | Italianno | 400 | Page titles and section names only. Never for long text |
| Labels and forms | Jost | 400, 500 | Kickers, buttons, table headings, form labels, small print. Uppercase with wide tracking |

Sizes: body 19px, lede 20px, kickers 11px at 0.26em tracking, script titles clamp from 40px to 72px.

## Shape and motion

- Hairline rules, diamond gems on buttons and dividers, 8px inset frames on images.
- No shadows except the mega menu. No parallax or autoplay motion. Smooth scroll is switched off for reduced-motion users.
- Placeholders are gradients plus a thin line drawing, labeled as slots.

## Where the tokens live

`src/styles/global.css`, in `:root`. Palette keys for lookbook swatches are in `src/data/looks.ts` (`paletteHex`) and must stay in sync.
