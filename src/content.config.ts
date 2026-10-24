import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const authors = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/authors' }),
    schema: z.object({
        name: z.string(),
        occupation: z.string().optional(),
        shortBio: z.string().optional(),
        email: z.string().email(),
    }),
});

const gallery = defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/gallery' }),
    schema: z.object({
        id: z.string(),
        title: z.string(),
        tiles: z.boolean().optional(),
        images: z.array(
            z.object({
                url: z.string(),
                alt: z.string().optional(),
            })
        ),
    }),
});

const blog = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        tags: z.array(reference('tags')).default(['default']),
        lastmod: z.coerce.date().optional(),
        draft: z.boolean().default(false),
        summary: z.string().optional(),
        images: z.string().optional(), // social preview image, not rendered in the post
        keywords: z.array(z.string()).optional(), // search terms kept out of the title (JSON-LD only)
        authors: z.array(reference('authors')).default(['default']),
        hero: z.object({
            src: z.string().optional(),
            alt: z.string().optional(),
        }).optional(),
    }),
});

const guide = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guide' }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date().optional(),
        draft: z.boolean().default(false),
        summary: z.string().optional(),
        hero: z.object({
            src: z.string().optional(),
            alt: z.string().optional(),
        }).optional(),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        kind: z.string(), // e.g. "Web app", "Windows app"
        language: z.string(),
        platform: z.string(),
        stack: z.array(z.string()),
        started: z.coerce.date(),
        repo: z.string(), // GitHub "owner/name"
        site: z.string().url().optional(),
        download: z.string().optional(), // release asset name, shown in place of the site button
        post: reference('blog').optional(),
        image: z.object({ src: z.string(), alt: z.string() }),
    }),
});

const tags = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tags' }),
    schema: z.object({
        name: z.string(),
        description: z.string().optional(),
    }),
});

export const collections = { blog, authors, tags, gallery, guide, projects };
