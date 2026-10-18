# akif.kr design guide

The site uses one visual system, called **Mosaic**: dark, monochrome, minimal, with a technical edge. Content sits on a grid of square tiles. Read this before adding a page or component so new work matches what's already here.

## Principles

1. **Dark only.** Black page, near-black tiles, white text. There is no light mode and no theme toggle.
2. **Monochrome.** No accent colour. Use differences in grey, weight and size for hierarchy. Interaction is shown by inverting (dark tile turns light), not by adding colour.
3. **Squares.** Tiles are square, corners are sharp, and gaps between tiles are hairline. Use square shapes for images and decoration too.
4. **Type does the work.** Listings have no hero images. A tile is a date, a tag, a big faint number and a title.
5. **Offset on purpose.** On desktop, content blocks can be staggered left and right. When they are, label the empty side so the gap reads as intentional.
6. **Mobile first.** Every layout collapses to a single or two-column version with no horizontal scroll at 375px.

## Colour

| Token | Value | Use |
|---|---|---|
| Page | `#000` (`bg-black`) | Body background |
| Tile | `#111` | Default tile / card background |
| Tile alt 1 | `#161616` | Every 4th tile from the 2nd (`:nth-child(4n+2)`) |
| Tile alt 2 | `#0c0c0c` | Every 5th tile from the 3rd (`:nth-child(5n+3)`) |
| Hover | `#f2f2f2` + black text | Hovered or focused tile (inverted) |
| Faint number | `#2a2a2a` | Large decorative numbers. Goes black on hover |
| Heading | `white` | Titles, logo, active nav |
| Body | `neutral-200` | Default text |
| Secondary | `neutral-400` / `#888` | Summaries, descriptions, prose body (`neutral-300`) |
| Muted | `neutral-500` | Mono labels, meta, inactive nav |
| Rule | `neutral-900` / `neutral-800` | Section dividers, chip borders |

Tailwind's `gray` is mapped to `neutral` in `tailwind.config.cjs`, so `gray-*` classes are pure greys with no blue tint.

Rotate the three tile shades through a grid so it reads as a mosaic, not a flat block. Don't add new background shades outside this set.

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
| `public/static/brand/logo-mosaic.svg` | Alternate: empty tiles rotate through the three tile greys (`#111` / `#161616` / `#0c0c0c`). For larger, decorative uses on the site |
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
- Add a light theme or `dark:` variants (the `dark` class is always set on `<html>`).
- Add non-square tiles to the Mosaic, or break the group-of-3 sizing.
- Add a new font. Two families only: Onest and Geist Mono.

## Accessibility

- Every hover state also applies on `:focus-visible`.
- Big decorative numbers are `aria-hidden`.
- `neutral-500` on black is about 4.6:1. Don't go darker than that for text people need to read. `#2a2a2a` is for decoration only.

## Where things live

| Thing | File |
|---|---|
| Fonts, base size, heading font | `src/styles/global.css` |
| Colour mapping, prose styles | `tailwind.config.cjs` |
| Page shell | `src/layouts/RootLayout.astro`, `Header.astro`, `Footer.astro` |
| Post grid | `src/components/Mosaic.astro` |
| Listing page | `src/layouts/ListLayout.astro` |
| Post page | `src/layouts/PostLayout.astro` |
| Home | `src/layouts/AuthorLayout.astro` |
