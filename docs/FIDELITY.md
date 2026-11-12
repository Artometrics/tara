# Reference fidelity ledger

Status: waiting on the next desktop and mobile homepage, menu, and motion captures. This branch does not invent those missing frames. It is not merged.

Brand on the preview: Prism & Pollen. The twelve product records are the supplied reference catalog, with rights not cleared and stock unknown.

## Why the previous catalog did not match the handoff

The first build treated `products-12.json` as a size-and-price pattern and then invented twelve substitute garments (Column Dress, Chalk Trouser, River Jean, Studio Jacket, and the rest). It showed studio photographs that were already in this repository. Those plates are not the reference products. Three of them had no photograph at all, so the page drew a placeholder.

That was a reinterpretation. The handoff already had the real titles, public prices, variant ids, size runs, and image URLs.

## Catalog correction on this branch

| Handoff handle | Shown as | Images |
| --- | --- | --- |
| quinn-dress-salt | Quinn Dress, Salt, $278, XXS–XXL | Named Quinn files from public HTML |
| sebastiane-skirt-powder | Sebastiane Skirt, Powder, $228, XXS–XXL | Named flat lay only |
| the-jane-blouse-black-2 | The Jane Blouse, Black, $158, XXS–XXL | Named Jane blouse files |
| petra-cardigan-coral | Petra Cardigan, Coral, $328, XXS–XXL | Named Petra files |
| merit-sweater-red-umber | Merit Sweater, Red Umber, $498, XS–XL | Named Merit files |
| lavon-linen-pant-salt | Lavon Linen Pant, Salt, $198, XXS–XXL | Named Lavon files |
| diana-mid-rise-jean-marville-wash | Diana Mid Rise Jean, Marville Wash, $248, waist 23–34 | Named Diana files |
| germain-coat-light-khaki | Germain Coat, Light Khaki, $778, XS–XL | Named Germain files |
| devi-boot-black-stretch-suede | Devi Boot, Black Stretch Suede, $498, 35–41 | Named Devi files |
| balfour-beaded-bag-champagne | Balfour Beaded Bag, Champagne, $328, one size | Named Balfour files. Public title also says Flan Beads |
| long-scoop-neck-slip-conch-2 | Long Scoop Neck Slip, Conch, $68, XXS–XXL | Images on that public page, including its og:image |
| digital-gift-card | Digital Gift Card, $50–$1000 | Public gift-card image. Issuance stays off |

Public `og:image` files named Lois tank, Shep jean, and Monttee were not used for Sebastiane, Jane, or Lavon. Sebastiane’s on-model gallery was not in the public HTML under that product name, so it is not filled with another picture.

Gallery order is the order those filenames appeared in public HTML. It was not checked against the live gallery. Descriptions are the public `og:description` strings, unchanged. Zinnia Skirt appears in a screenshot and is not one of these twelve, so it is not added as a product.

## What the supplied screenshots actually show

Captured, and used only as observation:

- Desktop header, viewport, shop menu open. Caps: New, Shop, Collections, Discover. Centered wordmark. Right side: Account, USD, search, Assistance, bag.
- Shop menu columns: Clothing, Shoes & Accessories, Lingerie & Sleepwear, Featured, plus a photograph on the right.
- Mobile 390 menu: Menu, New, Shop, Collections, Discover, then Account, Assistance, Currency, Find a shop.
- Mobile 390 home, partial, cut off before the footer: hero with the line “Holiday Chapter Two” and a small ornament; a Dresses plate; a Tops plate; a script “Explore”; then framed plates reading Holiday Occasion Shop, Coats & Jackets, and Noir Edit.
- Desktop New Arrivals, partial, cut off at 16384px before the footer. Script title. Filter & Sort control.
- Desktop Filter & Sort drawer: script title, sort chips, an in-stock switch, accordions, Clear all, Apply.
- Desktop Zinnia Skirt viewport and a full page that does include a footer: large image, caps title, color line, price, swatches, size row with the selected size underlined, ornamental Add to cart, description / details / size & fit.

## Ledger

| Surface | Supplied evidence | This preview | Gap |
| --- | --- | --- | --- |
| Header | Caps nav, centered wordmark, right utilities, paper ground | Same roles. Wordmark reads Prism & Pollen | Exact tracking, icon drawings, and padding were not measured |
| Masthead | Reference wordmark in the captures | Prism & Pollen, by request | Not a trace of their lettering |
| Hero | “Holiday Chapter Two”, ornament, full-bleed photograph. Desktop is only the top of that hero | Not built | Photograph and motion are not in the files. Not invented |
| Section order | Partial mobile home only, list above | Not built | Desktop full home was not captured. Lower mobile sections were cut off |
| Spacing | Visible as airy paper retail | Existing preview spacing | No measured pixel grid. Not guessed into a new system |
| Fonts | High-contrast serif for the wordmark and nav; a formal script for New Arrivals, Explore, Filter & Sort | Cormorant Garamond and Italianno, both OFL | The reference font files were not identified and are not embedded. These are legal stand-ins, not a match |
| Shop menu | Full column lists, including collaborations and empty-to-us categories such as Kids and Swimwear | Only categories that exist in the twelve-product handoff | Collaboration names are reference-house partnerships. They are not copied onto Prism & Pollen |
| Collection | Partial desktop New Arrivals and the filter drawer | Twelve-product grid, local filter and sort, in-stock control disabled | Mobile collection was not captured. Desktop footer was cut off. This grid is the handoff, not the live collection |
| Product | Zinnia layout only | Same observed regions, filled with a handoff product | Zinnia’s own data is not in the twelve. Swatch fill color was not measured, so no color dot is invented. Size-guide content was not captured |
| Cart | Not captured on purpose | Local bag: required size, drawer, quantity, first-click remove, reload | Visual design of the bag is not verified against the reference |
| Search | Not captured | Local search over the twelve | Predictive layout is not verified |
| Motion | Not in the supplied stills | None | Waiting. No scroll, menu, or hero motion is invented |
| Breakpoints | Mobile file is 390×844 at 3x. Desktop files are about 1350–1365px wide | CSS changes at 720px and 980px | Those two widths are implementation choices. The reference stylesheet was not read |

## Still not visually verified

Mobile collection, mobile product, mobile cart, mobile search, cart drawer, search, editorial pages, support pages, shop pages, size guide, and the 404. Desktop home from header through footer. Desktop collection footer. Any motion.

## Homepage, PDP, and cart after clone02 and clone03

Implemented from the overlapping home captures and the desktop plus mobile Quinn captures:

- Full-width Holiday Chapter Two hero, Dresses/Tops, Explore collage, campaign video with pause, Featured row, Our Shops layout, torn-paper newsletter, compact footer.
- Shop hover opens the mega menu. Collections hover swaps the columns and the feature image. Escape closes it. Pointer-leave did not close it in the capture, so it stays open.
- Mobile menu is a left drawer with a dimmed backdrop.
- Quinn: XXS struck through as a capture observation, not live stock. No size selected shows Select size. A chosen size shows Add to cart, then the button dims with a spinner. Timing was not measured.
- Bag drawer: In your bag, stepper, Remove, subtotal. Quantity changes keep the previous subtotal and dim the controls for a short unmeasured hold. Remove fades the line, then Your cart is empty and $0.
- Mobile drawer fills the viewport. A sticky Size selector / Add to cart bar appears after the main button scrolls away.
- Gift box $5 and free shipping over $500 are labeled reference observations, not offers. Checkout stays disabled.
- Mobile arrival with M already selected was a URL variant, not a verified fresh tap. Gallery swipe, mobile size guide, and accordion motion were not captured.

## Visual QA pass on the same branch

Adjusted from the still-image review. Not a new feature set.

- Hero uses a dark lower scrim, a smaller white title, and a light divider. Height is capped near 56–58vh. Exact reference crop was not measured in pixels.
- Wordmark is lighter and more widely tracked. Icons use a 1px stroke.
- Desktop Explore is taller, with a lighter script title. Mobile Explore keeps offsets and the floral background. Coats & jackets comes before Noir edit on small screens.
- Featured cards sit in a narrower row with frame padding. The rights line is one note under the row.
- Shop names are grouped lines between wide rules. The button has an outer rule. The line under it says these are reference locations.
- Newsletter band is full width. The footer badge is a drawn cartouche.
- Mobile product image is edge to edge. Dots sit on the image. The buy column no longer repeats the stock and rights paragraphs. Learn more reveals that the monthly line is not an offer.
- A fresh mobile size tap was tested: S started unpressed, then Add to cart opened the bag. Exact open/close timing is still unknown.

## Measured pass after 4211399, plus collection, filter, and search

Reference frames used: clone02 at 1365×1072 and 390×844, clone03 desktop cart and PDP at 1365×1072, clone03 mobile PDP and cart, clone04 collection and search at 1365×900 and 390×844.

- Desktop hero source is 2600×1300. Shown at full width with its own height, about 682px, so the face is in frame. The reference title spans about 324px. Desktop tracking is 0.2em at 16px. Mobile title is 20px.
- Desktop Explore cards are larger and overlap the floral ground. Featured is three columns with 48px side padding and 36px gaps, not a 280px cap.
- Shop names stay grouped between wide rules. The prototype sentence is in the footer, not in the shop or featured block.
- Shop menu is three text columns. Lingerie sits under Shoes. The photograph is the right column, about 36% of the width. Mobile utility links sit at the bottom of the drawer.
- Quinn’s title is 26px on desktop and 30px on a phone. The desktop gallery starts at the left edge. The handoff has one Quinn color, Salt, so one filled swatch is shown. A second color was not invented.
- Bag heading stays on one line. Subtotal and the disabled checkout sit at the bottom of the panel. Checkout remains disabled.
- Dresses collection, filter drawer, and search use the twelve-product catalog. `sort_by=price-ascending` with `filter.v.price.gte=0` and an empty `filter.v.price.lte` is written while the drawer is open. Apply closes it. Search for dress reports 2 results, not 749. Escape closes search and the filter drawer. Open and close timing is still unmeasured.

## Quinn mobile guide from clone05

The capture counted 11 gallery slides and moved the pagination dot from 1 to 2 and back to 1. A gesture swipe was not used. This preview has the nine Quinn files already stored. Two slides were not in those files, and none were invented. Dot clicks are tested. Swipe timing and easing were not measured.

Size S is variant `40107503124593`. Details holds the captured care line. There is no separate Care tab. The size guide is Quinn only: body inches and the captured bust centimeters, the visible garment columns, and the visible conversion columns. Waist and hip centimeters were off the mobile frame, so those cells stay in inches. Other garments do not get this chart.

Timing, easing, and a gesture swipe remain unverified. The preview is a bounded representative storefront, not an exact clone of the whole reference site.

## Held on purpose

Payments, accounts, email, SMS, reviews, gift issuance, inventory, and fulfillment stay off. Nothing was merged or deployed.
