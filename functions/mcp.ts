import { McpServer, createMcpHandler } from '@modelcontextprotocol/server';
import * as z from 'zod';

// Read-only MCP server over the blog, built from /posts.json and the .md twins.
// Stateless Streamable HTTP: a fresh server per request, nothing kept between them.
type Entry = { slug: string; type: string; title: string; summary?: string; url: string; markdown: string; date?: string; tags?: string[]; keywords?: string[] };

const text = (value: unknown) => ({
    content: [{ type: 'text' as const, text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }],
});

const createServer = (assets: Fetcher, origin: string) => {
    const entries = async (): Promise<Entry[]> => (await assets.fetch(`${origin}/posts.json`)).json();
    const server = new McpServer({ name: 'akif-kr', version: '1.0.0' }, {
        instructions: 'Read-only access to akif.kr, a blog about BMW E9x coding, PC builds, homelab and web development. Use list_posts or search_posts to find a slug, then get_post for the full markdown. Cite posts by their url.',
    });

    server.registerTool('list_posts', {
        description: 'List every blog post and guide on akif.kr, newest post first, with slug, title, summary, date, tags and URLs.',
        annotations: { readOnlyHint: true },
    }, async () => text(await entries()));

    server.registerTool('search_posts', {
        description: 'Find posts and guides whose title, summary, tags or keywords contain every word of the query (case-insensitive).',
        inputSchema: z.object({ query: z.string().min(1).describe('Words to search for, e.g. "e91 coding"') }),
        annotations: { readOnlyHint: true },
    }, async ({ query }) => {
        const words = query.toLowerCase().split(/\s+/).filter(Boolean);
        const matches = (await entries()).filter((entry) => {
            const haystack = [entry.title, entry.summary, ...(entry.tags ?? []), ...(entry.keywords ?? [])].join(' ').toLowerCase();
            return words.every((word) => haystack.includes(word));
        });
        return text(matches);
    });

    server.registerTool('get_post', {
        description: 'Get the full content of a post or guide as markdown, by slug.',
        inputSchema: z.object({ slug: z.string().describe('Slug from list_posts or search_posts, e.g. "ncs-workbench"') }),
        annotations: { readOnlyHint: true },
    }, async ({ slug }) => {
        const entry = (await entries()).find((candidate) => candidate.slug === slug);
        if (!entry) return { ...text(`No post or guide with slug "${slug}". Use list_posts to see what exists.`), isError: true };
        return text(await (await assets.fetch(entry.markdown.replace(/^https?:\/\/[^/]+/, origin))).text());
    });

    return server;
};

export const onRequest: PagesFunction<{ ASSETS: Fetcher }> = ({ request, env }) =>
    createMcpHandler(() => createServer(env.ASSETS, new URL(request.url).origin)).fetch(request);
