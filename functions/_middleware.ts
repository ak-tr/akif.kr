// Content negotiation for agents: `Accept: text/markdown` gets the prebuilt
// .md twin of the page (see src/pages/**/*.md.ts), everyone else gets HTML.
// Only runs on the routes listed in public/_routes.json.
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
    const wantsMarkdown = request.headers.get('Accept')?.includes('text/markdown');
    return (wantsMarkdown && await markdownTwin(new URL(request.url), env.ASSETS)) || next();
};
