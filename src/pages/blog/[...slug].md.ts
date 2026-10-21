import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { excludeDrafts } from "@/functions";
import { entryToMarkdown } from "@/utils/mdxToMarkdown";

// Markdown twin of each post, served to agents by functions/_middleware.ts
export const getStaticPaths = (async () => {
    const posts = await getCollection('blog', excludeDrafts);
    return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site }) =>
    new Response(entryToMarkdown(props.post as CollectionEntry<'blog'>, site!));
