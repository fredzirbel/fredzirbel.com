import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Security Engineering Case Studies',
  description: 'Case studies covering security investigation tooling, detection-as-code, and a live homelab detection platform.',
  alternates: { canonical: '/projects/' },
  openGraph: { url: '/projects/', images: ['/opengraph-image'] },
};

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-36 md:px-12">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">Selected work</p>
      <h1 className="font-display text-[clamp(3rem,9vw,7rem)] font-black uppercase leading-none tracking-tight">Case studies</h1>
      <p className="mt-6 max-w-2xl text-muted">Problems, tradeoffs, controls, and validation from security tools built to make investigations and detections more reliable.</p>
      <div className="mt-16 border-t border-line">
        {projects.map((project) => (
          <Link prefetch={false} key={project.slug} href={`/projects/${project.slug}/`} className="group block border-b border-line py-9 hover:bg-panel/60">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
              <div><h2 className="font-display text-3xl font-bold group-hover:text-signal">{project.title}</h2><p className="mt-2 max-w-2xl text-sm text-muted">{project.description}</p></div>
              <span className="font-mono text-xs uppercase tracking-wider text-signal">Read case study</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
