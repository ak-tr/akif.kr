import type { APIRoute } from 'astro';

const easterEgg = `░█▀▄░█▀█░▀█▀░░░░░░░░                    
░█▀▄░█░█░░█░░░░░░░░░                    
░▀▀░░▀▀▀░░▀░░▄▀░░░░░                    
░█▀█░█░░░█▀▀░░░█▀▄░█▀▀░░░█▀█░▀█▀░█▀▀░█▀▀
░█▀▀░█░░░▀▀█░░░█▀▄░█▀▀░░░█░█░░█░░█░░░█▀▀
░▀░░░▀▀▀░▀▀▀░░░▀▀░░▀▀▀░░░▀░▀░▀▀▀░▀▀▀░▀▀▀`

const blockedAIAgents = [
    "GPTBot",
    "ChatGPT-User",
    "Google-Extended",
    "PerplexityBot",
    "Amazonbot",
    "ClaudeBot",
    "Omgilibot",
    "FacebookBot",
    "Applebot",
    "anthropic-ai",
    "Bytespider",
    "Claude-Web",
    "Diffbot",
    "ImagesiftBot",
    "Omgili",
    "YouBot"
]

const getRobotsTxt = (sitemapURL: URL) => `\
${easterEgg}

User-agent: *
Disallow: /cdn-cgi/l/email-protection

${blockedAIAgents.map(agent => {
    return `User-agent: ${agent}
Disallow: /`
}).join('\n')}

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(getRobotsTxt(sitemapURL));
};
