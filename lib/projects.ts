import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface ProjectCaseStudy {
  slug: string;
  title: string;
  description: string;
  repository: string;
  order: number;
  tags: string[];
  content: string;
}

const PROJECT_DIR = path.join(process.cwd(), 'content', 'projects');
const PROJECT_FILE = /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const REQUIRED_SECTIONS = ['Problem', 'Audience', 'Contribution', 'Architecture', 'Decisions', 'Security controls', 'Validation', 'Limitations', 'Lessons', 'Screenshots', 'Repository'];

function fail(file: string, message: string): never {
  throw new Error(`Invalid project case study "${file}": ${message}`);
}

export function parseProjectFile(file: string, raw: string): ProjectCaseStudy {
  if (!PROJECT_FILE.test(file)) fail(file, 'filename must be lowercase kebab-case');
  const { data, content } = matter(raw);
  if (typeof data.title !== 'string' || !data.title.trim()) fail(file, 'title must be a nonempty string');
  if (typeof data.description !== 'string' || !data.description.trim()) fail(file, 'description must be a nonempty string');
  if (typeof data.repository !== 'string' || !/^https:\/\/github\.com\/fredzirbel\//.test(data.repository)) fail(file, 'repository must be a Fred Zirbel GitHub URL');
  if (!Number.isInteger(data.order) || data.order < 1) fail(file, 'order must be a positive integer');
  if (!Array.isArray(data.tags) || data.tags.length === 0 || data.tags.some((tag: unknown) => typeof tag !== 'string')) fail(file, 'tags must be a nonempty array of strings');
  for (const section of REQUIRED_SECTIONS) {
    if (!new RegExp(`^## ${section}$`, 'mi').test(content)) fail(file, `missing required section: ${section}`);
  }
  return { slug: file.replace(/\.md$/, ''), title: data.title.trim(), description: data.description.trim(), repository: data.repository, order: data.order, tags: data.tags, content };
}

export function getProjects(): ProjectCaseStudy[] {
  if (!fs.existsSync(PROJECT_DIR)) return [];
  return fs.readdirSync(PROJECT_DIR).filter((file) => file.endsWith('.md')).map((file) => parseProjectFile(file, fs.readFileSync(path.join(PROJECT_DIR, file), 'utf8'))).sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): ProjectCaseStudy | undefined {
  return getProjects().find((project) => project.slug === slug);
}
