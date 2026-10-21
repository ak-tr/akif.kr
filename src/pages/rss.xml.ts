import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { excludeDrafts, sortBlogPosts } from "@/functions";
import { SITE_METADATA } from "@/consts";

export const GET: APIRoute = async ({ site }) => rss({
    title: SITE_METADATA.title,
    description: `${SITE_METADATA.description} by ${SITE_METADATA.author}`,
    site: site!,
    items: sortBlogPosts(await getCollection('blog', excludeDrafts)).map(({ id, data }) => ({
        title: data.title,
        pubDate: data.date,
        description: data.summary,
        link: `/blog/${id}/`,
        categories: data.tags.map((tag) => tag.id),
    })),
    customData: `<language>${SITE_METADATA.language}</language>`,
});
