import type { APIRoute } from 'astro';

// Commented out line by line: crawlers reject anything else as invalid syntax
const easterEgg = `░█▀▄░█▀█░▀█▀░░░░░░░░                    
░█▀▄░█░█░░█░░░░░░░░░                    
░▀▀░░▀▀▀░░▀░░▄▀░░░░░                    
░█▀█░█░░░█▀▀░░░█▀▄░█▀▀░░░█▀█░▀█▀░█▀▀░█▀▀
░█▀▀░█░░░▀▀█░░░█▀▄░█▀▀░░░█░█░░█░░█░░░█▀▀
░▀░░░▀▀▀░▀▀▀░░░▀▀░░▀▀▀░░░▀░▀░▀▀▀░▀▀▀░▀▀▀`

// Training crawlers only. Search/retrieval bots (OAI-SearchBot, ChatGPT-User,
// PerplexityBot, Claude-SearchBot, Claude-User, Applebot) are allowed so posts
// can be cited in AI answers.
const blockedAIAgents = [
    "GPTBot",
    "ClaudeBot",
    "anthropic-ai",
    "Claude-Web",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "Bytespider",
    "Amazonbot",
    "FacebookBot",
    "meta-externalagent",
    "Diffbot",
    "ImagesiftBot",
    "Omgili",
    "Omgilibot",
]

const getRobotsTxt = (sitemapURL: URL) => `\
${easterEgg.split('\n').map(line => `# ${line.trimEnd()}`).join('\n')}

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
