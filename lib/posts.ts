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

interface ParsedPost extends Post {
  draft: boolean;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const POST_FILE = /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

function fail(file: string, message: string): never {
  throw new Error(`Invalid blog post "${file}": ${message}`);
}

export function parsePostFile(file: string, raw: string): ParsedPost {
  if (!POST_FILE.test(file)) {
    fail(file, 'filename must be lowercase kebab-case (for example, incident-notes.md)');
  }
  const { data, content } = matter(raw);
  if (typeof data.title !== 'string' || !data.title.trim()) fail(file, 'title must be a nonempty string');
  if (typeof data.description !== 'string' || !data.description.trim()) fail(file, 'description must be a nonempty string');
  if (data.date === undefined || data.date === null || data.date === '') fail(file, 'date is required');
  const date = new Date(data.date as string | number | Date);
  if (Number.isNaN(date.valueOf())) fail(file, 'date must be valid');
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some((tag: unknown) => typeof tag !== 'string'))) {
    fail(file, 'tags must be an array of strings');
  }
  if (data.draft !== undefined && typeof data.draft !== 'boolean') fail(file, 'draft must be a boolean');

  return {
    slug: file.replace(/\.md$/, ''),
    title: data.title.trim(),
    description: data.description.trim(),
    date,
    tags: data.tags ?? [],
    draft: data.draft ?? false,
    content,
  };
}

/** All published posts, newest first. Build-time only (uses fs). */
export function getPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.toLowerCase().endsWith('.md') && file !== 'README.md')
    .map((file) => parsePostFile(file, fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')))
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
