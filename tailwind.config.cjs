/** @type {import('tailwindcss').Config} */
module.exports = {
    // Colours, fonts and prose styles come from Mosaic. See DESIGN.md.
    presets: [require("mosaic/tailwind-preset.cjs")],
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    darkMode: "class",
    theme: {
        extend: {
            screens: {
                // Touch screens fire hover on tap and leave it stuck, so hover styles go behind this
                "can-hover": { raw: "(hover: hover)" },
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
    ],
};
