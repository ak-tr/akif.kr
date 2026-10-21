// Post lookups shared by the MCP server (functions/mcp.ts) and the in-browser
// WebMCP tools (src/components/WebMcpTools.astro), both reading /posts.json.
export type PostEntry = {
    slug: string;
    type: string;
    title: string;
    summary?: string;
    url: string;
    markdown: string;
    date?: string;
    tags?: string[];
    keywords?: string[];
};

// Entries whose title, summary, tags or keywords contain every word of the query
export const searchPosts = (entries: PostEntry[], query: string) => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return entries.filter((entry) => {
        const haystack = [entry.title, entry.summary, ...(entry.tags ?? []), ...(entry.keywords ?? [])].join(' ').toLowerCase();
        return words.every((word) => haystack.includes(word));
    });
};

export const notFound = (slug: string) => `No post or guide with slug "${slug}". Use list_posts to see what exists.`;
