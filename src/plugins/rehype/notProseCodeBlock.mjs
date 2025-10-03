import { visit } from 'unist-util-visit';

/**
 * Rehype plugin that adds 'not-prose' class to pre blocks with 'astro-code' class
 * This prevents Tailwind's typography plugin from applying prose styles to Astro code blocks
 */
export default function rehypeNotProseCodeBlock() {
    return (tree) => {
        visit(tree, 'element', (node) => {
            if (node.tagName === 'pre') {
                const className = node.properties?.className;
                
                // Check if the pre element has the 'astro-code' class
                const hasAstroCodeClass = 
                    (typeof className === 'string' && className.includes('astro-code')) ||
                    (Array.isArray(className) && className.includes('astro-code'));
                
                if (hasAstroCodeClass) {
                    // Add not-prose class to the pre element
                    if (!className?.includes('not-prose')) {
                        node.properties = node.properties || {};
                        node.properties.className = node.properties.className || [];
                        
                        // Handle both string and array className formats
                        if (typeof node.properties.className === 'string') {
                            node.properties.className += ' not-prose';
                        } else if (Array.isArray(node.properties.className)) {
                            node.properties.className.push('not-prose');
                        }
                    }
                }
            }
        });
    };
}
