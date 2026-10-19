const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

// Theme colours are "r g b" variables set per theme in global.css.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
const c = (name) => `rgb(var(--${name}))`; // for typography, where <alpha-value> isn't filled in
const neutral = Object.fromEntries([50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => [n, v(`n-${n}`)]));

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
                // Names are from the dark design: in a light theme "black" is the page and "white" the darkest text.
                black: v("page"),
                white: v("white"),
                neutral,
                gray: neutral,
                tile: { DEFAULT: v("tile"), 2: v("tile-2"), 3: v("tile-3") },
                invert: v("invert"),
                number: v("number"),
            },
            screens: {
                toc: { max: "1200px" },
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        a: {
                            color: c("white"),
                            textDecorationColor: c("n-600"),
                            textUnderlineOffset: "3px",
                            "&:hover": { textDecorationColor: c("white") },
                            code: { color: c("white") },
                        },
                        "h1,h2": {
                            fontWeight: "700",
                            letterSpacing: theme("letterSpacing.tight"),
                        },
                        h3: { fontWeight: "600" },
                        code: { color: c("n-200") },
                    },
                },
                invert: {
                    css: {
                        "--tw-prose-body": c("n-300"),
                        "--tw-prose-headings": c("white"),
                        "--tw-prose-lead": c("n-400"),
                        "--tw-prose-links": c("white"),
                        "--tw-prose-bold": c("white"),
                        "--tw-prose-counters": c("n-400"),
                        "--tw-prose-bullets": c("n-600"),
                        "--tw-prose-hr": c("n-800"),
                        "--tw-prose-quotes": c("n-100"),
                        "--tw-prose-quote-borders": c("n-700"),
                        "--tw-prose-captions": c("n-400"),
                        "--tw-prose-kbd": c("white"),
                        "--tw-prose-code": c("white"),
                        "--tw-prose-pre-code": c("n-300"),
                        "--tw-prose-th-borders": c("n-600"),
                        "--tw-prose-td-borders": c("n-700"),
                        "h1,h2,h3,h4,h5,h6": { color: c("n-100") },
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
