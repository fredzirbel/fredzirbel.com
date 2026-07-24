# Blog posts

Drop your handwritten posts here as `.md` files. Each filename becomes the
URL slug (e.g. `my-first-post.md` -> `/blog/my-first-post/`).

Each post requires the following frontmatter:

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

Published posts are statically exported, linked from the homepage, included in
the sitemap, and added to the RSS feed.

(This README is ignored; only `.md` files with the frontmatter above are
treated as posts... and this one has no frontmatter, so it's skipped.)
