import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: Date;
  tags: string[];
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

/** All published posts, newest first. Build-time only (uses fs). */
export function getPosts(): Post[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ''),
        title: data.title as string,
        description: data.description as string,
        date: new Date(data.date),
        tags: (data.tags as string[]) ?? [],
        content,
        draft: (data.draft as boolean) ?? false,
      };
    })
    .filter((post) => !post.draft)
    .map(({ draft: _draft, ...post }) => post)
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export function formatDate(date: Date, style: 'short' | 'long' = 'short'): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: style === 'short' ? 'short' : 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
