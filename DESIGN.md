# Design: Harbour Blue

A confident corporate trade partner: full-screen cinematic video, the original DommioGlobal blue, navy bands and a strict grid. Source of truth for values: `CSS/styles.css` `:root`.

## Color

| Token | Value | Use |
|---|---|---|
| `--blue` | #4a90e2 | Brand blue: accents, rules, icons and text on navy, logo ring |
| `--blue-strong` | #3375b6 | Fills that carry white text, blue text on white (the brand's #357abd, nudged to pass 4.5:1) |
| `--blue-deep` | #2b65a0 | Hover on fills |
| `--blue-tint` | #e7f0fb | Hover tint on service cells, focus ring, success message |
| `--navy` / `--navy-2` / `--navy-3` | #0b1b33 / #13294b / #1d3a66 | Hero shade, "Why us" band, industry panels, contact band; navy-3 for rules on navy |
| `--mist` | #f4f7fb | Services and Industries bands, input fill |
| `--ink` / `--ink-2` / `--ink-3` | #0b1b33 / #44546b / #5d6b80 | Text on light grounds |
| `--line` / `--line-strong` | #dde5ef / #c4d1e1 | Hairlines and grid rules |
| `--on-navy` / `--on-navy-2` | #e8eef7 / #a7b7cf | Text on navy |

Section rhythm: video hero → white fee strip → mist (services) → navy (why us) → white (process) → mist (industries) → white (FAQ) → navy/white split (contact) → darkest navy footer.

## Type

Archivo (Google Fonts, 400–900) throughout. Display: 800, tracking -0.035em, line-height 0.98, `--step-5` up to 5.75rem. Section titles: 800, `--step-4`, each led by a 48×4px blue bar. Small uppercase labels only for the fee strip side names and the "Why us" lead line.

## Shape

4px radius (`--radius`) on buttons, inputs, tabs and panels: square and corporate, no pills. Services sit in one framed grid with shared 1px rules rather than floating cards.

## Components

- **Header:** fixed and transparent with white text over the video; turns solid white with dark text after 50px of scroll (`.scrolled`). EN/ES is a boxed two-button switch with a blue active state.
- **Hero:** 100svh video, left-weighted navy gradient (vertical on phones), headline, subtitle, "For Suppliers" (blue fill) and "For Buyers" (white outline). The fee strip (`#commission-section`) is a white band on the hero's bottom edge.
- **Services:** navy-active segmented tabs; a 3/2/1-column manifest grid; cells tint blue and nudge the icon on hover.
- **Pillars:** three columns divided by navy rules inside the navy band.
- **Steps:** four 72px numbered circles on one blue route line; the first is filled.
- **Industries:** three navy panels, large blue icon at the top, title pinned to the bottom.
- **FAQ:** navy top rule, hairline items, a blue plus that turns into a minus.
- **Contact:** navy intro half and white form half; visible labels, mist inputs that go white with a blue ring on focus.

## Motion

Exponential ease-out. Header colour change on scroll, a 0.45s fade and rise when the services audience changes, small arrow and icon nudges on hover. All disabled under `prefers-reduced-motion`.

## Behaviour

The supplier/buyer choice stays in sync across the hero buttons, the services tabs and the form's "I am a" select. Translations write `textContent`, so translated elements must hold only text: put icons beside a keyed `<span>`.

## Logo

Mark: a globe split into two half-discs (left in ink or white, right in brand blue `#4A90E2`) with a small gap between them, crossed by one S-shaped trade route cut out of both halves. Two sides, one deal, one route. The wordmark is "Dommio" in Archivo 800 plus "Global" in Archivo 500, in blue.

Files in `Images/logo/`: `dommioglobal-mark.svg` (light grounds), `dommioglobal-mark-white.svg` (dark grounds), `dommioglobal-logo-dark.svg` and `dommioglobal-logo-white.svg` (lockups; the wordmark is live SVG text and needs Archivo installed or loaded, so outline it to paths before print or handoff), and `favicon.svg` (follows the browser's light or dark mode). On the site the mark is inlined, so its left half follows `currentColor`: white over the video, navy on the scrolled header. Minimum size is 16px; keep clear space of half the mark's width around it.

## Photography

Real photographs, never illustrations or gradients standing in for them. Photos sit under navy overlays wherever text crosses them; corners are 4px. Current images are free-licence Unsplash photos, loaded from `images.unsplash.com` with responsive `srcset` and lazy loading (only the hero video loads up front). Imagery represents Latin America as a whole: avoid subjects tied to one country (agave, specific landmarks, national symbols), and never show readable text in English or any brand label on products. Replace them with DommioGlobal's own photos of real partners' products when available.

| Placement | Unsplash photo id | Subject |
|---|---|---|
| Services, suppliers tab | 1772228616071-aa344913b93e | Farmer with harvested coffee cherries |
| Services, buyers tab | 1689942010216-dc412bb1e7a9 | Warehouse with pallets |
| Full-width band after "Why us" | 1707798178426-cbde69be5987 | Storm over farmland and mountains |
| Industries, fresh produce | 1632606325750-5749c9ff78e2 | Avocado on the tree |
| Industries, processed foods | 1645871306587-bebaa2f1dfc0 | Unlabelled jars of preserves |
| Industries, beverages | 1524350876685-274059332603 | Coffee beans in a burlap sack |
