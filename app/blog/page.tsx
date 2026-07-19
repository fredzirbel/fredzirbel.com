import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDate, getPosts } from '@/lib/posts';

export function generateMetadata(): Metadata {
  const empty = getPosts().length === 0;
  return {
    title: 'Blog',
    description: 'Notes on detection engineering, SOC operations, and security tooling - documenting what I learn as I build.',
    alternates: { canonical: '/blog/' },
    robots: empty ? { index: false, follow: true } : undefined,
    openGraph: { url: '/blog/', images: ['/opengraph-image'] },
  };
}

export default function BlogIndex() {
  const posts = getPosts();

  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-36 md:px-12">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">Blog</p>
      <h1
        className="font-display text-[clamp(3rem,9vw,7rem)] font-black uppercase leading-none tracking-tight"
        style={{ fontStretch: '120%' }}
      >
        Writing
      </h1>
      <p className="mt-6 max-w-xl text-muted">
        Notes on detection engineering, SOC operations, and the security
        tooling I&apos;m building. Learning in public.
      </p>

      {posts.length === 0 ? (
        <div className="mt-16 border-t border-line py-16">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-signal">
            Coming soon
          </p>
          <p className="mt-3 max-w-md text-muted">
            I&apos;m hand-writing the first posts - detection engineering
            walk-throughs, SOC notes, and project deep-dives. Check back soon.
          </p>
        </div>
      ) : (
        <div className="mt-16 border-t border-line">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              data-cursor="view"
              className="group flex flex-col gap-2 border-b border-line py-8 transition-colors duration-(--duration-base) hover:bg-panel/60 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <div className="min-w-0">
                <h2
                  className="font-display text-2xl font-bold tracking-tight transition-colors duration-(--duration-fast) group-hover:text-signal sm:text-3xl"
                  style={{ viewTransitionName: `post-${post.slug}` }}
                >
                  {post.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-muted">{post.description}</p>
                {post.tags.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-line px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <time
                dateTime={post.date.toISOString()}
                className="shrink-0 font-mono text-xs text-muted"
              >
                {formatDate(post.date)}
              </time>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
