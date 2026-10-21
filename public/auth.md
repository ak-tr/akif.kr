# akif.kr auth.md

How AI agents and other automated clients get access to https://akif.kr.

## Audience

Any agent, crawler or script that reads the site's content: blog posts, guides and the homepage.

## Registration

None. There's no registration or provisioning endpoint, no accounts and no API keys. Everything on the site is public.

## Supported methods

- **Anonymous:** plain, unauthenticated HTTP `GET` requests. This is the only method.

There's no OAuth, so no `/.well-known/oauth-protected-resource` or authorization server metadata is published.

## Credential use

No credentials are issued or accepted. Don't send an `Authorization` header; it's ignored.

## Reading content

- Send `Accept: text/markdown` to the homepage, a post or a guide to get it as markdown instead of HTML.
- Or request the markdown file directly: `https://akif.kr/blog/<slug>.md`.
- Every post and guide is listed in [llms.txt](https://akif.kr/llms.txt) and the [sitemap](https://akif.kr/sitemap-index.xml). New posts appear in the [RSS feed](https://akif.kr/rss.xml).
- The endpoints are described in [openapi.json](https://akif.kr/openapi.json), listed in the [API catalog](https://akif.kr/.well-known/api-catalog).

## Usage policy

Declared in [robots.txt](https://akif.kr/robots.txt) as `Content-Signal: ai-train=no, search=yes, ai-input=yes`. Search and citing posts in AI answers are welcome; training on the content isn't, and known training crawlers are disallowed.

## Contact

akif@muhl.is
