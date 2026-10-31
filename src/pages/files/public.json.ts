import type { APIRoute } from 'astro';
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

// Every file that's already public, for the public folders on /files: public/ as the site serves it,
// and src/content/ (the .mdx posts and their data) as raw files on GitHub, since the site doesn't serve those.
// Only files committed to git, so nothing gitignored or untracked on the build machine is ever listed.
const folders = [
    { dir: 'public/', name: 'public', base: '/' },
    { dir: 'src/content/', name: 'content', base: 'https://raw.githubusercontent.com/ak-tr/akif.kr/main/src/content/' },
];

export const GET: APIRoute = () => Response.json(
    execFileSync('git', ['ls-files', '-z', ...folders.map(({ dir }) => dir)], { encoding: 'utf8' })
        .split('\0')
        .filter(Boolean)
        .map((file) => {
            const { dir, name, base } = folders.find(({ dir }) => file.startsWith(dir))!;
            const path = file.slice(dir.length);
            return { path: `${name}/${path}`, size: statSync(file).size, url: base + path.split('/').map(encodeURIComponent).join('/') };
        })
        .sort((a, b) => a.path.localeCompare(b.path)),
);
