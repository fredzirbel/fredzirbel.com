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

## Publishing workflow

1. Create a lowercase, kebab-case Markdown file in this directory.
2. Copy the frontmatter example above and write the article beneath it.
3. Keep `draft: true` while working locally.
4. Run `npm run dev` and open the draft directly at `/blog/your-filename/`.
5. Change the flag to `draft: false`, run the full test suite, commit, and deploy.

Draft URLs are available only on the local development server. Production
builds exclude draft pages even when the files are committed.

When the first published post exists, the Writing navigation item, homepage
Writing section, blog sitemap entry, and RSS link appear automatically. They
remain hidden when every post is a draft or this directory contains no posts.

(This README is ignored; only `.md` files with the frontmatter above are
treated as posts... and this one has no frontmatter, so it's skipped.)
