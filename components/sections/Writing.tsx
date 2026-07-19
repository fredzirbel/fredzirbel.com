import Link from 'next/link';
import { formatDate, type Post } from '@/lib/posts';

/**
 * Latest writing as minimal display-type rows. Titles carry a
 * view-transition-name so they morph into the post page.
 */
export default function Writing({ posts }: { posts: Post[] }) {
  return (
    <section
      id="writing"
      className="mx-auto max-w-[1440px] scroll-mt-24 px-6 py-16 md:px-12"
    >
      <p className="mb-12 font-mono text-xl uppercase tracking-[0.2em] text-muted">
        <span className="mr-4 text-signal">05</span>Writing
      </p>

      {posts.length === 0 ? (
        <div className="border-t border-line py-10">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-signal">
            Coming soon
          </p>
          <p className="mt-3 max-w-md text-muted">
            Hand-written write-ups on detection engineering and SOC work are on
            the way.
          </p>
        </div>
      ) : (
        <>
          <div className="border-t border-line">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}/`}
                data-cursor="view"
                className="group flex flex-col gap-2 border-b border-line py-8 transition-colors duration-(--duration-base) hover:bg-panel/60 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <div className="min-w-0">
                  <h3
                    className="font-display text-2xl font-bold tracking-tight transition-colors duration-(--duration-fast) group-hover:text-signal sm:text-3xl"
                    style={{ viewTransitionName: `post-${post.slug}` }}
                  >
                    {post.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm text-muted">{post.description}</p>
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

          <Link
            href="/blog/"
            className="mt-8 inline-block text-sm text-signal underline decoration-signal/40 underline-offset-4 transition-colors duration-(--duration-fast) hover:decoration-signal"
          >
            All posts
          </Link>
        </>
      )}
    </section>
  );
}
