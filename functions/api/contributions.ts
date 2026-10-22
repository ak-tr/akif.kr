// Last year of my GitHub contribution calendar, for the Activity graph on the homepage (see src/components/Contributions.astro).
// GitHub's GraphQL API needs a token, so it stays here as a Pages secret. GraphQL is a POST, which Cloudflare won't cache
// on its own, so the answer goes into the edge cache by hand for a day: each data centre asks GitHub at most once a day.
const levels = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];

const query = `{ user(login: "ak-tr") { contributionsCollection { contributionCalendar {
    totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;

interface Calendar {
    totalContributions: number;
    weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
}

export const onRequest: PagesFunction<{ GITHUB_TOKEN: string }> = async ({ request, env, waitUntil }) => {
    const cache = caches.default;
    const key = new Request(new URL('/api/contributions', request.url));
    const cached = await cache.match(key);
    if (cached) return cached;

    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: { 'Authorization': `bearer ${env.GITHUB_TOKEN}`, 'User-Agent': 'akif.kr' },
        body: JSON.stringify({ query }),
    });
    const calendar = res.ok && (await res.json<{ data?: { user: { contributionsCollection: { contributionCalendar: Calendar } } } }>())
        .data?.user.contributionsCollection.contributionCalendar;
    if (!calendar) return new Response(null, { status: 502 });

    const body = Response.json({
        total: calendar.totalContributions,
        weeks: calendar.weeks.map((w) => w.contributionDays.map((d) => ({
            date: d.date, count: d.contributionCount, level: levels.indexOf(d.contributionLevel),
        }))),
    }, { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
    waitUntil(cache.put(key, body.clone()));
    return body;
};
