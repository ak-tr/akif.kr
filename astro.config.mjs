import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import { unified } from "@astrojs/markdown-remark";

import { SITE_METADATA } from "./src/consts.ts";

// Rehype plugins
import rehypeSlugAnchorSectionize from "rehype-slug-anchor-sectionize";
import rehypeNotProseCodeBlock from "./src/plugins/rehype/notProseCodeBlock.mjs";

// Remark plugins
import remarkReadingTime from "./src/plugins/remark/readingTime.mjs";

// Shiki plugins
import {
    transformerNotationFocus,
    transformerRenderIndentGuides,
    transformerMetaHighlight,
} from '@shikijs/transformers'

// https://astro.build/config
export default defineConfig({
    integrations: [
        mdx(),
        sitemap(),
        solidJs(),
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
            rehypePlugins: [rehypeSlugAnchorSectionize, rehypeNotProseCodeBlock],
        }),
    },
});
