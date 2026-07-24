import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getProject, getProjects } from '@/lib/projects';

interface Props { params: Promise<{ slug: string }> }
export const dynamicParams = false;
export function generateStaticParams() { return getProjects().map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const url = `/projects/${project.slug}/`;
  return { title: `${project.title} case study`, description: project.description, alternates: { canonical: url }, openGraph: { title: project.title, description: project.description, url, images: ['/opengraph-image'] } };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareSourceCode', name: project.title, description: project.description, codeRepository: project.repository, author: { '@type': 'Person', name: 'Fred Zirbel', url: 'https://fredzirbel.com' } };
  return (
    <article className="mx-auto max-w-[1440px] px-6 pb-24 pt-36 md:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll('<', '\\u003c') }} />
      <header className="mb-14">
        <Link prefetch={false} href="/projects/" className="font-mono text-xs text-muted hover:text-signal">&larr; All case studies</Link>
        <h1 className="mt-8 max-w-5xl font-display text-[clamp(2.8rem,8vw,6.5rem)] font-black uppercase leading-[0.92] tracking-tight">{project.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{project.description}</p>
        <ul className="mt-6 flex flex-wrap gap-2">{project.tags.map((tag) => <li key={tag} className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">{tag}</li>)}</ul>
      </header>
      <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{project.content}</ReactMarkdown></div>
    </article>
  );
}
