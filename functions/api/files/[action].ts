// The private file browser on /files (see src/pages/files/index.astro). Files live in the R2 bucket bound as FILES,
// never in the repo. Every action but login/logout needs the session cookie that login sets.
import { checkPassword, checkSession, createSession, SESSION_SECONDS } from '../../../src/utils/filesAuth';

interface Env {
    FILES: R2Bucket;
    FILES_PASSWORD: string;
    FILES_SESSION_SECRET: string;
}

const cookie = (value: string, maxAge: number) =>
    `files_session=${value}; Path=/api/files; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;

const status = (code: number, headers?: HeadersInit) => new Response(null, { status: code, headers });

export const onRequest: PagesFunction<Env, 'action'> = async ({ request, env, params }) => {
    // Fail closed until both secrets are set
    if (!env.FILES_PASSWORD || !env.FILES_SESSION_SECRET) return status(503);
    // The password is part of the key, so changing it logs everyone out
    const secret = env.FILES_SESSION_SECRET + env.FILES_PASSWORD;
    const post = request.method === 'POST';

    if (params.action === 'login' && post) {
        const password = (await request.json<{ password?: unknown }>().catch(() => null))?.password;
        if (typeof password !== 'string' || !await checkPassword(password, env.FILES_PASSWORD)) return status(401);
        return status(204, { 'Set-Cookie': cookie(await createSession(secret), SESSION_SECONDS) });
    }
    if (params.action === 'logout' && post) return status(204, { 'Set-Cookie': cookie('', 0) });

    const token = request.headers.get('Cookie')?.match(/(?:^|;\s*)files_session=([^;]+)/)?.[1];
    if (!await checkSession(secret, token)) return status(401);
    const path = new URL(request.url).searchParams.get('path') ?? '';

    if (params.action === 'list') {
        // ponytail: first 1000 entries of a folder; follow listing.cursor if one ever gets that big
        const listing = await env.FILES.list({ prefix: path, delimiter: '/' });
        return Response.json({
            folders: listing.delimitedPrefixes.map((prefix) => prefix.slice(path.length, -1)),
            // Keys ending in "/" are empty folder markers some upload tools leave behind
            files: listing.objects.filter((object) => !object.key.endsWith('/')).map((object) => ({
                name: object.key.slice(path.length), size: object.size, modified: object.uploaded,
            })),
        }, { headers: { 'Cache-Control': 'private, no-store' } });
    }

    if (params.action === 'get') {
        const object = await env.FILES.get(path);
        if (!object) return status(404);
        const headers = new Headers({ 'Cache-Control': 'private, no-store' });
        object.writeHttpMetadata(headers);
        headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(path.split('/').pop()!)}`);
        return new Response(object.body, { headers });
    }

    return status(404);
};
