# akif.kr design guide

The site uses **Mosaic**, a design system kept in its own repo: [ak-tr/mosaic](https://github.com/ak-tr/mosaic). Read its guide before adding a page or component: [`node_modules/mosaic/DESIGN.md`](node_modules/mosaic/DESIGN.md). It covers the principles, colour tokens, themes, type, layout, the Mosaic grid, patterns, logo, copy and accessibility.

This file covers only what's specific to akif.kr. To change the design itself (a colour, a theme, a rule), change it in the mosaic repo, push, then run `pnpm update mosaic` here. To try changes before pushing, run `pnpm link ../mosaic`.

## How Mosaic is wired in

- **Colours and fonts:** `global.css` imports `mosaic/tokens.css`, which sets the font names and the colour variables for every theme. It also loads Onest and Geist Mono from Google Fonts.
- **Tailwind:** `tailwind.config.cjs` uses `mosaic/tailwind-preset.cjs`. The site only adds `primary` (pink, legacy, used by `ListWithTagsLayout`; don't use it in new work), extra line heights and the `toc` breakpoint.
- **Dark mode:** the `dark` class is always set on `<html>`, so don't write `dark:` variants.
- **Headings:** `h1`–`h6` and `header` default to Geist Mono (set in `global.css`). Add `font-sans` when a heading should use Onest, as the page titles do.

## Themes

- **Picker:** `THEME / DAKOTA BLACK` in the footer, built as a `popover`. The choice is saved in `localStorage` (`theme`) and applied by `applyTheme()` in `BaseHead`, before paint and after every ClientRouter swap, so there's no flash. It also sets the footer label, which defaults to Dakota Black.
- **Code blocks:** Shiki's `houston` theme, dark in every scheme.
- **Adding a theme:** add it in the mosaic repo (see its guide), update the package here, then add it to `THEMES` in `Footer.astro`.

## Site specifics

- **Mosaic grid:** `src/components/Mosaic.astro`, used by `/blog`, `/tags/:slug` and the home page. Pages hold 12 posts (`ITEMS_PER_PAGE`).
- **Projects:** `/projects` uses the Mosaic list layout, newest first. Project pages use the reading column with the guide's buttons: download for desktop apps (`releases/latest`, version from the build, refreshed in the browser by `Release.astro` from `/api/releases/<repo>`, which caches GitHub at the edge for an hour), the live site for web ones. The details box is `TLDR` with `label="Details"`. Screenshots live in `public/static/images/projects/`; run `node scripts/optimiseImages.mjs` after adding one.
- **Tag index:** `/tags` uses the square tile look in a 2/4-column grid. Uses items are `bg-tile` cards in a 2-column grid.
- **Home:** the bio (right) and the Potzo card (left) are staggered 80% wide blocks with gap labels `01 / ABOUT`, `02 / BUILDING`. The portrait is greyscale.
- **Page shell:** `max-w-6xl` container in `RootLayout`; posts and the guide use the `max-w-2xl` reading column (`SectionContainer`). Post titles use `PageTitle`.
- **Logo:** `public/static/brand/` holds copies of the Mosaic logo SVGs. The header shows `logo-mosaic.svg` in place of the `akif.kr` wordmark on hover/focus. `public/favicon.svg` is a copy of `logo.svg`. If the logo changes in mosaic, copy it over and regenerate `favicon.svg`, `favicon.ico` and `apple-touch-icon.png`.

## Where things live

| Thing | File |
|---|---|
| Font loading, base size, heading font, token import | `src/styles/global.css` |
| Tailwind preset and site extras | `tailwind.config.cjs` |
| Theme picker / theme script | `src/components/Footer.astro`, `src/components/BaseHead.astro` |
| Page shell | `src/layouts/RootLayout.astro`, `Header.astro`, `Footer.astro` |
| Post grid | `src/components/Mosaic.astro` |
| Listing page | `src/layouts/ListLayout.astro` |
| Post page | `src/layouts/PostLayout.astro` |
| Home | `src/layouts/AuthorLayout.astro` |
| Projects list / page / content | `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/content/projects/` |
