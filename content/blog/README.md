# Blog posts

Drop your hand-written posts here as `.md` files. Each filename becomes the
URL slug (e.g. `my-first-post.md` -> `/blog/my-first-post/`).

Frontmatter each post needs:

```markdown
---
title: "Your Post Title"
description: "One-line summary shown in the list and meta tags."
date: 2026-07-20
tags: ["detection-engineering", "kql"]
draft: false
---

Your markdown content here...
```

- `date` drives ordering (newest first) and is shown formatted.
- `tags` is optional; it renders as chips on the blog index.
- Set `draft: true` to keep a post in the repo but hide it from the site.

While this folder has no published posts, the site shows a "Coming soon"
state on `/blog` and in the homepage Writing section automatically. Add your
first `.md` file and it replaces that with the real list on the next build.

(This README is ignored - only `.md` files with the frontmatter above are
treated as posts... and this one has no frontmatter, so it's skipped.)
