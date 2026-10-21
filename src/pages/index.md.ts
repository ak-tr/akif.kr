import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { SITE_METADATA } from "@/consts";
import { mdxToMarkdown } from "@/utils/mdxToMarkdown";

// Markdown twin of the homepage, served to agents by functions/_middleware.ts
export const GET: APIRoute = async ({ site }) => {
    const author = await getEntry('authors', 'default');
    return new Response(`# ${SITE_METADATA.title}

${SITE_METADATA.description} by ${SITE_METADATA.author}.

## About

${mdxToMarkdown(author?.body ?? "", site!)}`);
};
