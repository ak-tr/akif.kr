import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";

import { SITE_METADATA } from "./src/consts.ts";

// Rehype plugins
import rehypeSlugAnchorSectionize from "rehype-slug-anchor-sectionize";

// Shiki plugins
import { 
    transformerNotationFocus, 
    transformerRenderIndentGuides,
} from '@shikijs/transformers'

import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
    integrations: [
        mdx({
            rehypePlugins: [
                rehypeSlugAnchorSectionize,
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
            wrap: true,
            transformers: [
                transformerNotationFocus(),
                transformerRenderIndentGuides({ position: 'trailing' })
            ],
        },
    },
});
