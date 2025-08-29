import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";


import { SITE_METADATA } from "./src/consts.ts";

// Rehype plugins
import rehypeHighlight from "rehype-highlight";
import rehypeSlugAnchorSectionize from "rehype-slug-anchor-sectionize";

import langPython from "highlight.js/lib/languages/python";
import langJson from "highlight.js/lib/languages/json";
import langShell from "highlight.js/lib/languages/shell";

import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
    integrations: [
        mdx({
            rehypePlugins: [
                rehypeSlugAnchorSectionize,
                () => rehypeHighlight({
                    languages: {
                        python: langPython,
                        json: langJson,
                        sh: langShell,
                    }
                })
            ],
        }),
        sitemap(),
        robotsTxt(),
        tailwind(),
        solidJs(),
    ],
    prefetch: true,
    site: SITE_METADATA.siteUrl,
});
