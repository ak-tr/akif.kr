import { readdirSync, readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";

import { SITE_METADATA } from "./src/consts.ts";

// Rehype plugins
import rehypeSlugAnchorSectionize from "rehype-slug-anchor-sectionize";

// Remark plugins
import remarkReadingTime from "./src/plugins/remark/readingTime.mjs";

// Shiki plugins
import {
    transformerNotationFocus,
    transformerRenderIndentGuides,
    transformerMetaHighlight,
} from '@shikijs/transformers'

// Post URL -> lastmod (or date) from frontmatter, for the sitemap's <lastmod>
const postDates = new Map(
    [["blog", "blog"], ["guide", "909dimensions/guide"]].flatMap(([dir, path]) =>
        readdirSync(`./src/content/${dir}`).map((file) => {
            const frontmatter = readFileSync(`./src/content/${dir}/${file}`, "utf8");
            const date = frontmatter.match(/^lastmod:\s*["']?([\d-]+)/m) ?? frontmatter.match(/^date:\s*["']?([\d-]+)/m);
            return [new URL(`${path}/${file.replace(/\.mdx?$/, "")}/`, SITE_METADATA.siteUrl).href, date?.[1]];
        })
    )
);

// https://astro.build/config
export default defineConfig({
    integrations: [
        mdx(),
        sitemap({
            serialize(item) {
                const lastmod = postDates.get(item.url);
                if (lastmod) item.lastmod = lastmod;
                return item;
            },
        }),
    ],
    prefetch: true,
    site: SITE_METADATA.siteUrl,
    markdown: {
        syntaxHighlight: 'shiki',
        shikiConfig: {
            theme: 'houston',
            transformers: [
                transformerNotationFocus(),
                transformerRenderIndentGuides({ position: 'trailing' }),
                transformerMetaHighlight(),
            ],
        },
        // Astro 7's default "satteri" processor does not run remark/rehype
        // plugins, so opt back into the unified pipeline for these.
        processor: unified({
            remarkPlugins: [remarkReadingTime],
            rehypePlugins: [rehypeSlugAnchorSectionize],
        }),
    },
});
