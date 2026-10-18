const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    darkMode: "class",
    theme: {
        extend: {
            lineHeight: {
                11: "2.75rem",
                12: "3rem",
                13: "3.25rem",
                14: "3.5rem",
            },
            fontFamily: {
                sans: ["var(--font-sans)", ...fontFamily.sans],
                mono: ["var(--font-mono)", ...fontFamily.mono],
            },
            colors: {
                primary: colors.pink,
                gray: colors.neutral,
            },
            screens: {
                toc: { max: "1200px" },
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        a: {
                            color: theme("colors.white"),
                            textDecorationColor: theme("colors.neutral.600"),
                            textUnderlineOffset: "3px",
                            "&:hover": { textDecorationColor: theme("colors.white") },
                            code: { color: theme("colors.white") },
                        },
                        "h1,h2": {
                            fontWeight: "700",
                            letterSpacing: theme("letterSpacing.tight"),
                        },
                        h3: { fontWeight: "600" },
                        code: { color: theme("colors.neutral.200") },
                    },
                },
                invert: {
                    css: {
                        "--tw-prose-body": theme("colors.neutral.300"),
                        "--tw-prose-bullets": theme("colors.neutral.600"),
                        "--tw-prose-hr": theme("colors.neutral.800"),
                        "--tw-prose-quote-borders": theme("colors.neutral.700"),
                        "h1,h2,h3,h4,h5,h6": { color: theme("colors.neutral.100") },
                    },
                },
            }),
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
    ],
};
