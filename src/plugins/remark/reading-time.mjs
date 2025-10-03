import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export const filterAlphanumericWords = (input) => {
  return input
    .split(' ')
    .filter(word => /^[a-zA-Z0-9]+$/.test(word));
}

export const remarkReadingTime = () => {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const filteredTextOnPage = filterAlphanumericWords(textOnPage).join(' ');

    const readingTime = getReadingTime(filteredTextOnPage);

    data.astro.frontmatter.minutesRead = readingTime.text;
    data.astro.frontmatter.wordCount = readingTime.words;
  };
}