import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/posts';

export const dynamic = 'force-static';

const SITE = 'https://fredzirbel.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  return [
    { url: `${SITE}/`, priority: 1 },
    ...(posts.length > 0 ? [{ url: `${SITE}/blog/`, priority: 0.8 }] : []),
    ...posts.map((post) => ({
      url: `${SITE}/blog/${post.slug}/`,
      lastModified: post.date,
      priority: 0.6,
    })),
  ];
}
