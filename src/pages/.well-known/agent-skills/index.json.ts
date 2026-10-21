import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Agent Skills Discovery RFC v0.2.0 index. Skills live in public/.well-known/agent-skills,
// digests are computed at build time so they always match the published files.
const skills = [
    {
        name: 'read-akif-kr',
        description: 'Read posts and guides from akif.kr as clean markdown: where to find them, how to request markdown, and the usage policy.',
    },
];

export const GET: APIRoute = () => Response.json({
    $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
    skills: skills.map(({ name, description }) => {
        const url = `/.well-known/agent-skills/${name}/SKILL.md`;
        return {
            name,
            type: 'skill-md',
            description,
            url,
            digest: `sha256:${createHash('sha256').update(readFileSync(`public${url}`)).digest('hex')}`,
        };
    }),
});
