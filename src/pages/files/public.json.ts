import type { APIRoute } from 'astro';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

// Every file that's already public, for the public folders on /files: public/ as the site serves it,
// and src/content/ (the .mdx posts and their data) as raw files on GitHub, since the site doesn't serve those.
const walk = (dir: string, name: string, base: string) => readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name !== '.DS_Store')
    .map((entry) => {
        const file = join(entry.parentPath, entry.name);
        const path = relative(dir, file).split(sep).join('/');
        return { path: `${name}/${path}`, size: statSync(file).size, url: base + path.split('/').map(encodeURIComponent).join('/') };
    });

export const GET: APIRoute = () => Response.json([
    ...walk('public', 'public', '/'),
    ...walk('src/content', 'content', 'https://raw.githubusercontent.com/ak-tr/akif.kr/main/src/content/'),
].sort((a, b) => a.path.localeCompare(b.path)));
