'use client';

import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { useRef } from 'react';
import { gsap, registerGsap, useMotion } from '@/lib/motion';
import { projects } from '@/lib/portfolio';

export default function Work() {
  const scope = useRef<HTMLElement>(null);
  const { enabled } = useMotion();
  useGSAP(() => {
    if (!enabled) return;
    registerGsap();
    gsap.utils.toArray<HTMLElement>('[data-project]').forEach((row) => gsap.from(row, { opacity: 0, y: 32, duration: 0.5, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 88%', once: true } }));
  }, { scope, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section ref={scope} id="work" className="scroll-mt-24 py-16">
      <div className="mx-auto mb-12 flex w-full max-w-[1440px] items-end justify-between gap-6 px-6 md:px-12">
        <p className="font-mono text-xl uppercase tracking-[0.2em] text-muted"><span className="mr-4 text-signal">02</span>Projects</p>
        <Link prefetch={false} href="/projects/" className="text-sm text-signal underline decoration-signal/40 underline-offset-4">All case studies</Link>
      </div>
      <div className="border-t border-line">
        {projects.map((project, index) => (
          <article key={project.slug} data-project className="group border-b border-line px-6 py-12 transition-colors hover:bg-panel/60 md:px-12 md:py-14">
            <div className="mx-auto grid max-w-[1440px] gap-6 md:grid-cols-[3rem_minmax(0,1fr)_auto] md:items-start">
              <span className="font-mono text-sm text-muted/60">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <Link prefetch={false} href={`/projects/${project.slug}/`} data-cursor="view">
                  <h3 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-black uppercase leading-none tracking-tight transition-colors group-hover:text-signal">{project.name}</h3>
                </Link>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">{project.subtitle}</p>
                <p className="mt-5 max-w-2xl text-sm text-muted">{project.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => <li key={tag} className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">{tag}</li>)}
                </ul>
              </div>
              <div className="flex gap-4 font-mono text-xs uppercase tracking-wider">
                <Link prefetch={false} href={`/projects/${project.slug}/`} className="text-signal">Case study</Link>
                <a href={project.repository} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-signal">GitHub ↗</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
