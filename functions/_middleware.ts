// Content negotiation for agents: `Accept: text/markdown` gets the prebuilt
// .md twin of the page (see src/pages/**/*.md.ts), everyone else gets HTML.
// The homepage also advertises the discovery documents as RFC 8288 Link headers.
// Only runs on the routes listed in public/_routes.json.
const homepageLinks = [
    '</.well-known/api-catalog>; rel="api-catalog"',
    '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
    '</llms.txt>; rel="service-doc"; type="text/plain"',
    '</auth.md>; rel="describedby"; type="text/markdown"',
    '</index.md>; rel="alternate"; type="text/markdown"',
    '</rss.xml>; rel="alternate"; type="application/rss+xml"',
].join(', ');

const markdownTwin = async (url: URL, assets: Fetcher) => {
    const twin = new URL(url);
    twin.pathname = (url.pathname.replace(/\/$/, '') || '/index') + '.md';
    const asset = await assets.fetch(twin);
    if (!asset.ok) return null;

    return new Response(asset.body, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Vary': 'Accept',
        },
    });
};

export const onRequest: PagesFunction<{ ASSETS: Fetcher }> = async ({ request, next, env }) => {
    const url = new URL(request.url);
    const wantsMarkdown = request.headers.get('Accept')?.includes('text/markdown');
    const response = (wantsMarkdown && await markdownTwin(url, env.ASSETS)) || await next();
    if (url.pathname !== '/') return response;

    const withLinks = new Response(response.body, response);
    withLinks.headers.set('Link', homepageLinks);
    return withLinks;
};
