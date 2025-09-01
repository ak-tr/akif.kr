/**
 * Site metadata that is used across the site.
 *
 * A few of these are not used yet, and are subject to change, example of this is Author.
 */
export const SITE_METADATA = {
    title: "akif.kr",
    headerTitle: "akif.kr",
    description: "Personal website and blog",
    language: "en-GB",
    theme: "light",
    siteUrl: "https://akif.kr/",
    siteRepo: "https://git.akif.kr/akif.kr",
    siteLogo: "/static/images/logo.png",
    socialBanner: "/static/images/twitter-card.png",
    locale: "en-US",
    robots: "index, follow",
    author: "Akif Karakus",
    email: "akif@muhl.is",
    github: "https://git.akif.kr",
    linkedin: "https://linkedin.akif.kr",
};

/**
 * Default posts per page for pagination.
 */
export const ITEMS_PER_PAGE = 5;

export const NAVIGATION = [
    { href: "/", title: "Home" },
    { href: "/blog", title: "Blog" },
    { href: "/tags", title: "Tags" },
    { href: "/uses", title: "Uses" },
];
