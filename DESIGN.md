# akif.kr design guide

The site uses one visual system, called **Mosaic**: monochrome, minimal, with a technical edge, dark by default. Content sits on a grid of square tiles. Read this before adding a page or component so new work matches what's already here.

## Principles

1. **Dakota Black first.** Black page, near-black tiles, white text. That's the default and the look everything is designed in; the other [themes](#themes) are recolourings of it.
2. **Monochrome.** No accent colour. Use differences in grey, weight and size for hierarchy. Interaction is shown by inverting (dark tile turns light), not by adding colour.
3. **Squares.** Tiles are square, corners are sharp, and gaps between tiles are hairline. Use square shapes for images and decoration too.
4. **Type does the work.** Listings have no hero images. A tile is a date, a tag, a big faint number and a title.
5. **Offset on purpose.** On desktop, content blocks can be staggered left and right. When they are, label the empty side so the gap reads as intentional.
6. **Mobile first.** Every layout collapses to a single or two-column version with no horizontal scroll at 375px.

## Colour

Every colour is a theme token: a CSS variable in `global.css`, exposed as a Tailwind colour in `tailwind.config.cjs`. Never write a hex value or `bg-[#...]` in a component, or it won't follow the theme. Values below are Dakota Black.

| Token | Class / CSS | Dakota Black | Use |
|---|---|---|---|
| Page | `bg-black` / `--page` | `#000` | Body background |
| Tile | `bg-tile` / `--tile` | `#111` | Default tile / card background |
| Tile alt 1 | `bg-tile-2` / `--tile-2` | `#161616` | Every 4th tile from the 2nd (`:nth-child(4n+2)`) |
| Tile alt 2 | `bg-tile-3` / `--tile-3` | `#0c0c0c` | Every 5th tile from the 3rd (`:nth-child(5n+3)`) |
| Hover | `bg-invert` + `text-black` | `#f2f2f2` + black | Hovered or focused tile (inverted) |
| Faint number | `text-number` / `--number` | `#2a2a2a` | Large decorative numbers. Goes `black` on hover |
| Heading | `text-white` / `--white` | `#fff` | Titles, logo, active nav |
| Body | `neutral-200` | `#e5e5e5` | Default text |
| Secondary | `neutral-400` / `--muted` | `#a3a3a3` / `#888` | Summaries, descriptions, prose body (`neutral-300`) |
| Muted | `neutral-500` | `#737373` | Mono labels, meta, inactive nav |
| Rule | `neutral-900` / `neutral-800` | `#171717` / `#262626` | Section dividers, chip borders |

`black`, `white` and the whole `neutral` scale are theme tokens, and Tailwind's `gray` is mapped to the same scale, so `gray-*` classes are pure greys with no blue tint. In CSS, use `rgb(var(--tile))` (values are `r g b`, so `rgb(var(--page) / .72)` works too).

Rotate the three tile shades through a grid so it reads as a mosaic, not a flat block. Don't add new background shades outside this set.

## Themes

Five colour schemes, taken from [NCS Workbench](https://github.com/ak-tr/NCS-Workbench/blob/main/docs/guides/themes.md) and named after BMW interior colours. Dakota Black is the default and the original Mosaic look; the others are for readability.

| Theme | `data-theme` | Kind | After |
|---|---|---|---|
| **Dakota Black** (default) | none | Dark | The original look: black with grey tiles |
| Anthracite | `anthracite` | Dim | BMW Individual anthracite headliner, neutral charcoal |
| Mocha | `mocha` | Dim | Dakota / Vernasca Mocha leather, warm brown-black |
| Canberra Beige | `canberra-beige` | Light | Vernasca Canberra Beige leather, cream and sand |
| Silverstone | `silverstone` | Light | M Merino Silverstone leather, plain light grey |

- **Picker:** `THEME / DAKOTA BLACK` in the footer. It opens a menu above itself (a `popover`, so Esc and clicking outside close it): a `bg-tile` panel with a `neutral-800` border, mono uppercase rows that invert on hover/focus, and a small filled square marking the current theme. The choice is saved in `localStorage` (`theme`) and applied by `applyTheme()` in `BaseHead`, before paint and after every ClientRouter swap, so there's no flash. It also sets the footer label, which defaults to Dakota Black.
- **Token names are from the dark design.** In a light theme `black` (`--page`) is the lightest colour and `white` the darkest text, so "invert on hover" still works: the tile goes dark, the text goes light. Write classes for Dakota Black and the other themes follow.
- **Contrast:** in every theme except Dakota Black, all text is at least 4.5:1 against its tile. Dakota Black keeps its original greys.
- **Still monochrome.** NCS Workbench adds blue/green/amber/red for focus and status; the site doesn't.
- **Not themed:** the logo (it carries its own black square), photos, and code blocks (Shiki's `houston` theme stays dark in every scheme).
- **Adding a theme:** add a `:root[data-theme="..."]` block in `global.css` with every variable the Dakota Black block sets, then add it to `THEMES` in `Footer.astro`.

## Typography

| Role | Font | Style |
|---|---|---|
| Body, titles, prose | **Onest** (`font-sans`, `--font-sans`) | Base size 16px |
| Labels, meta, nav, header, footer, numbers | **Geist Mono** (`font-mono`, `--font-mono`) | Usually 11–12px, uppercase, `tracking-wide` |

- **Page title** (Blog, Tags, Uses): `font-sans font-light`, `text-6xl sm:text-8xl md:text-9xl`, `leading-[.9]`, `tracking-[-.06em]`.
- **Home heading:** `font-light`, `text-4xl sm:text-6xl`, `tracking-[-.04em]`.
- **Post title** (`PageTitle`): `font-semibold`, `text-4xl md:text-5xl`, `tracking-[-.03em]`.
- **Tile title:** Onest 500, 15–20px (big tiles 24–44px), clamped to 4 lines.
- **Big number:** Geist Mono, `tracking-[-.05em]`, `leading-none`, colour `#2a2a2a`.
- **Mono label:** `font-mono text-xs uppercase tracking-wide text-neutral-500`.

`h1`–`h6` default to Geist Mono (set in `global.css`). Add `font-sans` when a heading should use Onest, as the page titles do.

## Layout

- **Container:** `max-w-6xl`, `px-4 sm:px-6` (in `RootLayout`).
- **Reading column:** `max-w-2xl`, centred (`SectionContainer`), used by posts and the guide.
- **Breakpoints:** the Mosaic grid switches at **720px** (3 columns down to 2). Offset/staggered layouts start at Tailwind `md` (768px).
- **Page header:** big light title on the left, mono meta on the right (`sm:grid-cols-[1fr_auto]`), e.g. "12 posts / 2024 - 2026".

## Mosaic grid

`src/components/Mosaic.astro` is the post grid used by `/blog`, `/tags/:slug` and the home page. Reuse it rather than building another list.

```text
3 columns, 2px gap, auto-flow dense
posts in groups of 3:
  1st -> 2x2 square (alternates left / right each group)
  2nd, 3rd -> 1x1 squares
leftovers:
  1 -> spans the full row
  2 -> one 2-wide + one 1x1
mobile (<720px): 2 columns, 2x2 tiles go full width
```

This way the grid never has holes, whatever the post count. Pages hold 12 posts (`ITEMS_PER_PAGE`), which is 4 full groups.

**Tile anatomy:**

```text
┌───────────────────────────┐
│ 4 JAN 2026      HOMELAB   │  mono label row (opacity .55)
│                           │
│ 12                        │  big faint number (counts down, newest = highest)
│                           │
│ Running Surfshark Behind… │  title (Onest)
│ A practical guide to…     │  summary, big tiles only
└───────────────────────────┘
```

Hover/focus: background goes `#f2f2f2`, text and number go black.

## Patterns

- **Square tiles outside the blog:** `/tags` uses the same tile look (count, big number, name) in a 2/4-column grid. Uses items are `#111` cards in a 2-column grid with 2px gaps.
- **Section label:** mono label with a count, e.g. `DEVELOPMENT / 06`, in a left column on desktop (`md:grid-cols-[200px_1fr]`).
- **Gap labels:** when blocks are staggered (home page bio right, Potzo card left, both 80% wide), fill each empty side with a faint big number and a mono label underneath: `01 / ABOUT`, `02 / BUILDING`. On mobile, hide the number and show the label above its block.
- **Tag filter row:** mono uppercase links, active one white.
- **Links:** white text, `underline decoration-neutral-600 underline-offset-[3px]`, decoration goes white on hover. Mono action links use the same treatment in uppercase, e.g. `ALL 12 POSTS →`.
- **Chips** (post tags): mono 11px uppercase, `border-neutral-800`, square corners, border and text go white on hover.
- **Post header:** `← BLOG` back link, mono meta line `25 DEC 2025 / 7 MIN READ / 1,338 WORDS`, title, tag chips.
- **Pagination:** mono uppercase `← NEWER · 1 / 2 · OLDER →` above a `neutral-900` rule.
- **Notices** (drafts): dashed `neutral-700` border, mono text. No yellow/red alert colours.

## Logo

A lowercase **a** built from square tiles on a 7x7 grid: white (`#f2f2f2`) letter tiles, faint (`#1c1c1c`) empty tiles, on black. Squares only, no font, so it stays sharp at 16px.

| File | Use |
|---|---|
| `public/static/brand/logo.svg` | Primary mark. Source for the favicon |
| `public/static/brand/logo-mosaic.svg` | Alternate: empty tiles rotate through the three tile greys (`#111` / `#161616` / `#0c0c0c`). Shown in place of the `akif.kr` wordmark when the header logo is hovered or focused. Also for larger, decorative uses |
| `public/favicon.svg` | Browser favicon (copy of `logo.svg`) |
| `public/favicon.ico` | Fallback favicon, 16/32/48px |
| `public/apple-touch-icon.png` | iOS home screen, 180px |

- Keep the grid at 7x7 and the letter centred. Don't add the full stop or other glyphs.
- Don't recolour it. On a light background, use it as-is (it carries its own black square).
- If `logo.svg` changes, regenerate `favicon.svg`, `favicon.ico` and `apple-touch-icon.png` from it.

## Imagery

- No hero images in listings.
- Photos of people are greyscale, with no colour on hover (home page).
- Hero images inside posts are fine: full column width, square corners.
- Gallery images: no rounded corners.

## Copy

- **No em dashes.** Use a comma, full stop, brackets, or `/` in UI strings. Use a plain hyphen for ranges (`2024 - 2026`).
- British English, `en-GB` dates: `4 Jan 2026`.
- Labels are short and uppercase in mono; sentences stay in sentence case in Onest.

## Don't

- Add an accent colour, gradients, shadows or rounded corners.
- Use `rounded-*`, `shadow-*`, `primary-*` (pink) or `blue-*` classes.
- Add `dark:` variants (the `dark` class is always set on `<html>`). Themes go through the tokens, not variants.
- Hard-code a colour (`#111`, `bg-[#f2f2f2]`, Tailwind palette colours). Use a theme token.
- Add non-square tiles to the Mosaic, or break the group-of-3 sizing.
- Add a new font. Two families only: Onest and Geist Mono.

## Accessibility

- Every hover state also applies on `:focus-visible`.
- Big decorative numbers are `aria-hidden`.
- `neutral-500` on black is about 4.6:1. Don't go darker than that for text people need to read. `#2a2a2a` is for decoration only.

## Where things live

| Thing | File |
|---|---|
| Fonts, base size, heading font, theme colours | `src/styles/global.css` |
| Theme picker / theme script | `src/components/Footer.astro`, `src/components/BaseHead.astro` |
| Colour tokens, prose styles | `tailwind.config.cjs` |
| Page shell | `src/layouts/RootLayout.astro`, `Header.astro`, `Footer.astro` |
| Post grid | `src/components/Mosaic.astro` |
| Listing page | `src/layouts/ListLayout.astro` |
| Post page | `src/layouts/PostLayout.astro` |
| Home | `src/layouts/AuthorLayout.astro` |
