// Flattens the MDX components used in src/content into plain markdown for the
// agent-facing .md twins. Code blocks are left alone since they hold example JSX.
// ponytail: regex per known component, a new component renders raw until it gets a rule here
const attr = (tag: string, name: string) =>
    tag.match(new RegExp(`${name}=(?:"([^"]*)"|\\{([\\s\\S]*?)\\}\\s*(?=\\w+=|/?>))`))?.slice(1).find((v) => v !== undefined);

const list = (tag: string, name: string): string[] => JSON.parse(attr(tag, name) ?? '[]');

const flatten = (text: string, site: URL) => text
    .replace(/^import .*\n/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}\n?/g, '')
    .replace(/^[ \t]*<\/?(div|TLDR|Collapsible)\b[^>]*>\n?/gm, '')
    .replace(/^[ \t]*<PostImage\b[\s\S]*?\/>/gm, (tag) => {
        const alt = attr(tag, 'alt') ?? '';
        const subtitle = attr(tag, 'subtitle');
        const image = `![${alt}](${new URL(attr(tag, 'src') ?? '', site)})`;
        return subtitle && subtitle !== alt ? `${image}\n*${subtitle}*` : image;
    })
    .replace(/^[ \t]*<StepFlow\b[\s\S]*?\/>/gm, (tag) => list(tag, 'steps').join(' → '))
    .replace(/^[ \t]*<TLDRRow\b([^>]*?)(?:\/>|>(.*?)<\/TLDRRow>)/gm, (tag, _, children) =>
        `- **${attr(tag, 'label')}:** ${children ?? list(tag, 'chips').map((chip) => `\`${chip}\``).join(', ')}`)
    .replace(/^[ \t]*<Card\b[\s\S]*?\/>/gm, (tag) => [
        `**${attr(tag, 'title')}**`,
        ...list(tag, 'description'),
        `[${tag.match(/text:\s*"([^"]*)"/)?.[1]}](${tag.match(/href:\s*"([^"]*)"/)?.[1]})`,
    ].join('\n\n'));

export const mdxToMarkdown = (body: string, site: URL) => body
    .split(/(^```[\s\S]*?^```)/m)
    .map((part, i) => (i % 2 ? part : flatten(part, site)))
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';

export const entryToMarkdown = ({ data, body }: { data: { title: string; summary?: string }; body?: string }, site: URL) =>
    `# ${data.title}\n\n${data.summary ? `> ${data.summary}\n\n` : ''}${mdxToMarkdown(body ?? '', site)}`;
