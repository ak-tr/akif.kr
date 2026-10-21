// Latest release tag of one of my GitHub repos, for the version on /projects (see src/components/Release.astro).
// GitHub's answer is cached at the edge for an hour, so visitors never call GitHub or hit its rate limit.
// ponytail: unauthenticated, so GitHub's 60 requests/hour is per Cloudflare egress IP; add a token if that ever bites.
export const onRequest: PagesFunction<{}, 'repo'> = async ({ params }) => {
    const repo = String(params.repo);
    if (!/^(?!\.+$)[\w.-]+$/.test(repo)) return new Response(null, { status: 400 });

    const res = await fetch(`https://api.github.com/repos/ak-tr/${repo}/releases/latest`, {
        headers: { 'User-Agent': 'akif.kr', 'Accept': 'application/vnd.github+json' },
        cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (!res.ok) return new Response(null, { status: 404 });

    const { tag_name } = await res.json<{ tag_name: string }>();
    return Response.json({ tag: tag_name }, { headers: { 'Cache-Control': 'public, max-age=300' } });
};
