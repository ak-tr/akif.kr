import getReadingTime from 'reading-time';

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

export default () => {
    return function (tree, { data }) {
        const textOnPage = extractText(tree)
        
        const readingTime = getReadingTime(textOnPage);

        data.astro.frontmatter.minutesRead = readingTime.text;
        data.astro.frontmatter.wordCount = readingTime.words;
    };
}