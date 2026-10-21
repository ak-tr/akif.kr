import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { excludeDrafts, excludeGuideDrafts, sortBlogPosts } from "@/functions";

// Every post and guide with its metadata, read by the MCP server in functions/mcp.ts
export const GET: APIRoute = async ({ site }) => {
    const entry = (type: 'post' | 'guide', path: string, id: string, data: { title: string; summary?: string }) => ({
        slug: id,
        type,
        title: data.title,
        summary: data.summary,
        url: new URL(`${path}/${id}/`, site).href,
        markdown: new URL(`${path}/${id}.md`, site).href,
    });
    const posts = sortBlogPosts(await getCollection('blog', excludeDrafts)).map(({ id, data }) => ({
        ...entry('post', 'blog', id, data),
        date: data.date.toISOString().slice(0, 10),
        tags: data.tags.map((tag) => tag.id),
        keywords: data.keywords ?? [],
    }));
    const guides = (await getCollection('guide', excludeGuideDrafts))
        .map(({ id, data }) => entry('guide', '909dimensions/guide', id, data));

    return Response.json([...posts, ...guides]);
};
