const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
    // Colours, fonts and prose styles come from Mosaic. See DESIGN.md.
    presets: [require("mosaic/tailwind-preset.cjs")],
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
            colors: {
                primary: colors.pink,
            },
            screens: {
                toc: { max: "1200px" },
                // Touch screens fire hover on tap and leave it stuck, so hover styles go behind this
                "can-hover": { raw: "(hover: hover)" },
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
    ],
};
