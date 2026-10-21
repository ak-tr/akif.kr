---
title: "stash"
summary: "Share code snippets instantly, with one-read and timed expiry."
kind: "Web app"
language: "Vue"
platform: "Web"
stack: ["Vue", "TypeScript", "Cloudflare Workers", "KV"]
started: "2022-11-18"
repo: "ak-tr/stash"
site: "https://stash.akif.kr"
image:
  src: "/static/images/projects/stash.png"
  alt: "stash editor with a TypeScript snippet, expiry and syntax pickers, and the upload button"
---

Paste your code, pick an expiry and a syntax, and press Upload (or `⌘ + ⏎`). Stashes can expire after one read, or after 2, 12 or 24 hours. The ones you make are listed under **Your stashes** in that browser.

## API

The same host serves a small JSON API to create, read, read raw and delete stashes. One Cloudflare Worker serves both the app and the API.
