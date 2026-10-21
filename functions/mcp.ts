import { McpServer, createMcpHandler } from '@modelcontextprotocol/server';
import * as z from 'zod';
import { notFound, searchPosts, type PostEntry } from '../src/utils/postSearch';

// Read-only MCP server over the blog, built from /posts.json and the .md twins.
// Stateless Streamable HTTP: a fresh server per request, nothing kept between them.
const text = (value: unknown) => ({
    content: [{ type: 'text' as const, text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }],
});

const createServer = (assets: Fetcher, origin: string) => {
    const entries = async (): Promise<PostEntry[]> => (await assets.fetch(`${origin}/posts.json`)).json();
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
    }, async ({ query }) => text(searchPosts(await entries(), query)));

    server.registerTool('get_post', {
        description: 'Get the full content of a post or guide as markdown, by slug.',
        inputSchema: z.object({ slug: z.string().describe('Slug from list_posts or search_posts, e.g. "ncs-workbench"') }),
        annotations: { readOnlyHint: true },
    }, async ({ slug }) => {
        const entry = (await entries()).find((candidate) => candidate.slug === slug);
        if (!entry) return { ...text(notFound(slug)), isError: true };
        return text(await (await assets.fetch(`${origin}${new URL(entry.markdown).pathname}`)).text());
    });

    return server;
};

export const onRequest: PagesFunction<{ ASSETS: Fetcher }> = ({ request, env }) =>
    createMcpHandler(() => createServer(env.ASSETS, new URL(request.url).origin)).fetch(request);
