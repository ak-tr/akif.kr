---
name: read-akif-kr
description: Read posts and guides from akif.kr, Akif Karakus's blog about BMW E9x coding, PC builds, homelab and web development. Use when you need content from akif.kr as clean markdown instead of HTML.
---

# Reading akif.kr

All content is public and read-only. No registration, API key or `Authorization` header is needed (see https://akif.kr/auth.md).

## Find content

- https://akif.kr/llms.txt lists every post and guide with a summary and a link to its markdown version.
- https://akif.kr/rss.xml has every post, newest first, with dates and tags.
- https://akif.kr/sitemap-index.xml lists every page.
- https://akif.kr/posts.json has every post and guide as JSON, with tags and keywords.

## Get markdown

Either:

- Request the page URL with `Accept: text/markdown`, for example `GET https://akif.kr/blog/ncs-workbench/`. The response is `text/markdown`.
- Or fetch the markdown file directly: drop the trailing slash and add `.md`, for example `https://akif.kr/blog/ncs-workbench.md`.

This works for the homepage (`/index.md`), blog posts (`/blog/<slug>`) and guides (`/909dimensions/guide/<slug>`). Other pages, such as tags and the gallery, are HTML only.

Images are absolute URLs under `https://akif.kr/static/`.

## MCP

If you support MCP, connect to `https://akif.kr/mcp` (Streamable HTTP, no auth). Tools: `list_posts`, `search_posts` (words in title, summary, tags or keywords) and `get_post` (full markdown by slug).

## Usage policy

robots.txt declares `Content-Signal: ai-train=no, search=yes, ai-input=yes`. Use the content to answer questions and cite it with a link to the post. Don't use it for model training.

## Machine-readable descriptions

- API catalog: https://akif.kr/.well-known/api-catalog
- OpenAPI: https://akif.kr/openapi.json
