import type {CollectionEntry} from "astro:content";

// Newest first
export const sortBlogPosts = (posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] =>
    posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

// Drafts show in dev, never in production builds
export const excludeDrafts = ({ data }: { data: { draft: boolean } }): boolean => !import.meta.env.PROD || !data.draft;

/**
 * Latest release tag of a GitHub repo ("owner/name"), read at build time.
 * Undefined when there's no release or GitHub can't be reached, so the build never fails on it.
 */
export const latestRelease = (repo: string): Promise<string | undefined> =>
    fetch(`https://api.github.com/repos/${repo}/releases/latest`)
        .then((res) => res.ok ? res.json() : undefined)
        .then((release) => release?.tag_name, () => undefined);
