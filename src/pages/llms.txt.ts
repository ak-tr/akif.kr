import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { excludeDrafts, excludeGuideDrafts, sortBlogPosts } from "@/functions";
import { SITE_METADATA } from "@/consts";

// llms.txt (https://llmstxt.org): agent-facing index linking to the .md twins
export const GET: APIRoute = async ({ site }) => {
    const link = (path: string, title: string, summary?: string) =>
        `- [${title}](${new URL(`${path}.md`, site)})${summary ? `: ${summary}` : ''}`;
    const posts = sortBlogPosts(await getCollection('blog', excludeDrafts))
        .map(({ id, data }) => link(`blog/${id}`, data.title, data.summary));
    const guides = (await getCollection('guide', excludeGuideDrafts))
        .map(({ id, data }) => link(`909dimensions/guide/${id}`, data.title, data.summary));

    return new Response(`# ${SITE_METADATA.title}

> ${SITE_METADATA.description} by ${SITE_METADATA.author}.

Every page listed here is also served as markdown to requests with \`Accept: text/markdown\`. No authentication is needed, see ${new URL('auth.md', site)}.

## Blog

${posts.join('\n')}

## Guides

${guides.join('\n')}

## Optional

- [About](${new URL('index.md', site)}): about the author
- [MCP server](${new URL('mcp', site)}): Streamable HTTP, tools list_posts, search_posts and get_post
- [Post index](${new URL('posts.json', site)}): every post and guide as JSON
- [API catalog](${new URL('.well-known/api-catalog', site)})
- [RSS feed](${new URL('rss.xml', site)}): every post with its summary
- [OpenAPI description](${new URL('openapi.json', site)})
- [Sitemap](${new URL('sitemap-index.xml', site)})
`);
};
