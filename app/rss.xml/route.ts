import { getPosts } from '@/lib/posts';

export const dynamic = 'force-static';

const SITE = 'https://fredzirbel.com';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function GET(): Response {
  const items = getPosts()
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <link>${SITE}/blog/${post.slug}/</link>
      <guid>${SITE}/blog/${post.slug}/</guid>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Fred Zirbel - Blog</title>
    <description>Notes on detection engineering, SOC operations, and security tooling.</description>
    <link>${SITE}/</link>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
