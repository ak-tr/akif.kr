const extractText = (root) => {
    const acc = [];

    const visit = (node) => {
        if (!node) return;

        if (typeof node.value === "string") {
            acc.push(node.value);
        }

        if (node.children && Array.isArray(node.children)) {
            for (const child of node.children) visit(child);
        }
    }

    visit(root);
    return acc.join(" ").replace(/\s+/g, " ").trim();
}

export const getWordCount = (text) => {
    return text.split(/\s+/).filter(Boolean).length;
}

const getReadingTime = (text) => {
    const words = getWordCount(text);
    const minutes = words / 200;
    return `${Math.ceil(minutes)} min read`;
}

export default () => {
    return function (tree, { data }) {
        const textOnPage = extractText(tree)

        const readingTime = getReadingTime(textOnPage);
        const wordCount = getWordCount(textOnPage);
    
        data.astro.frontmatter.minutesRead = readingTime;
        data.astro.frontmatter.wordCount = wordCount;
    };
}