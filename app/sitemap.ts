import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/posts';
import { getProjects } from '@/lib/projects';

export const dynamic = 'force-static';

const SITE = 'https://fredzirbel.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const projects = getProjects();
  return [
    { url: `${SITE}/`, priority: 1 },
    { url: `${SITE}/projects/`, priority: 0.9 },
    { url: `${SITE}/blog/`, priority: 0.8 },
    ...projects.map((project) => ({ url: `${SITE}/projects/${project.slug}/`, priority: 0.8 })),
    ...posts.map((post) => ({
      url: `${SITE}/blog/${post.slug}/`,
      lastModified: post.date,
      priority: 0.6,
    })),
  ];
}
