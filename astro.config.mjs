import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";

import { SITE_METADATA } from "./src/consts.ts";

// Rehype plugins
import rehypeSlugAnchorSectionize from "rehype-slug-anchor-sectionize";
import rehypeNotProseCodeBlock from "./src/plugins/rehype/notProseCodeBlock.mjs";

// Remark plugins
import { remarkReadingTime } from "./src/plugins/remark/reading-time.mjs";

// Shiki plugins
import { 
    transformerNotationFocus, 
    transformerRenderIndentGuides,
    transformerMetaHighlight,
} from '@shikijs/transformers'

import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
    integrations: [
        mdx({
            rehypePlugins: [
                rehypeSlugAnchorSectionize,
                rehypeNotProseCodeBlock,
            ],
            remarkPlugins: [
                remarkReadingTime,
            ],
        }),
        sitemap(),
        robotsTxt(),
        tailwind(),
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
    },
});
