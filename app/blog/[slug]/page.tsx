import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDate, getPost, getPosts } from '@/lib/posts';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-[1440px] px-6 pb-24 pt-36 md:px-12">
      <header className="mb-14">
        <Link
          href="/blog/"
          className="font-mono text-xs text-muted transition-colors duration-(--duration-fast) hover:text-signal"
        >
          &larr; All posts
        </Link>
        <h1
          className="mt-8 max-w-4xl font-display text-[clamp(2.2rem,6vw,4.5rem)] font-black leading-[1.02] tracking-tight"
          style={{ viewTransitionName: `post-${post.slug}` }}
        >
          {post.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <time dateTime={post.date.toISOString()} className="font-mono text-xs text-muted">
            {formatDate(post.date, 'long')}
          </time>
          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
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
      </header>

      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
