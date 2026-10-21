import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { excludeGuideDrafts } from "@/functions";
import { entryToMarkdown } from "@/utils/mdxToMarkdown";

// Markdown twin of each guide, served to agents by functions/_middleware.ts
export const getStaticPaths = (async () => {
    const guides = await getCollection('guide', excludeGuideDrafts);
    return guides.map((guide) => ({ params: { slug: guide.id }, props: { guide } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site }) =>
    new Response(entryToMarkdown(props.guide as CollectionEntry<'guide'>, site!));
