import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { NAVIGATION } from '@/consts';
import { excludeDrafts, sortBlogPosts } from '@/functions';
import { mdxToMarkdown } from '@/utils/mdxToMarkdown';

// Everything the ⌘K search covers (src/components/Search.astro): pages, posts, guides, projects, tags and
// galleries. Posts, guides and projects carry their plain text so the search reaches into their content.
// ponytail: one JSON with every post's text, fetched on first open; move to Pagefind if it grows past ~1MB
const plain = (body: string | undefined, site: URL) => mdxToMarkdown(body ?? '', site)
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^```.*$|^\s*[-+] |[#>|]+/gm, ' ')
    .replace(/[*`]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const GET: APIRoute = async ({ site }) => {
    const [posts, guides, projects, tags, galleries] = await Promise.all([
        getCollection('blog', excludeDrafts).then(sortBlogPosts),
        getCollection('guide', excludeDrafts),
        getCollection('projects'),
        getCollection('tags'),
        getCollection('gallery'),
    ]);

    return Response.json([
        ...[...NAVIGATION, { href: '/files/', title: 'Files' }].map(({ href, title }) => ({ type: 'Page', title, url: href })),
        ...posts.map(({ id, data, body }) => ({
            type: 'Post',
            title: data.title,
            summary: data.summary,
            keywords: [...data.tags.map((tag) => tag.id), ...(data.keywords ?? [])].join(' '),
            text: plain(body, site!),
            url: `/blog/${id}/`,
        })),
        ...guides.map(({ id, data, body }) => ({ type: 'Guide', title: data.title, summary: data.summary, text: plain(body, site!), url: `/909dimensions/guide/${id}/` })),
        ...projects.map(({ id, data, body }) => ({
            type: 'Project',
            title: data.title,
            summary: data.summary,
            keywords: [data.kind, data.language, data.platform, ...data.stack].join(' '),
            text: plain(body, site!),
            url: `/projects/${id}/`,
        })),
        ...tags.map(({ id, data }) => ({ type: 'Tag', title: data.name, summary: data.description, url: `/tags/${id}/` })),
        ...galleries.map(({ id, data }) => ({ type: 'Gallery', title: data.title, url: `/gallery/${id}/` })),
    ]);
};
