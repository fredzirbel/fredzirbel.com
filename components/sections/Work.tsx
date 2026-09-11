'use client';

import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap, registerGsap, useMotion } from '@/lib/motion';
import { projects } from '@/lib/portfolio';

export default function Work() {
  const scope = useRef<HTMLElement>(null);
  const { enabled } = useMotion();
  useGSAP(() => {
    if (!enabled) return;
    registerGsap();
    gsap.utils.toArray<HTMLElement>('[data-project]').forEach((card, index) =>
      gsap.from(card, {
        opacity: 0,
        y: 28,
        duration: 0.5,
        ease: 'power3.out',
        delay: (index % 2) * 0.06,
        scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      }),
    );
  }, { scope, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section ref={scope} id="work" className="mx-auto max-w-[1440px] scroll-mt-24 px-6 py-16 md:px-12">
      <p className="mb-12 font-mono text-xl uppercase tracking-[0.2em] text-muted"><span className="mr-4 text-ink">02</span>Projects</p>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project, index) => (
          <a
            key={project.slug}
            href={project.repository}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.name} on GitHub in a new tab`}
            data-project
            className="group flex flex-col rounded-xl border border-line bg-panel/70 p-7 transition-colors hover:border-trace/50"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-xs text-muted/60">{String(index + 1).padStart(2, '0')}</span>
              <span className="font-mono text-xs uppercase tracking-wider text-trace">GitHub ↗</span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight transition-colors group-hover:text-trace sm:text-3xl">{project.name}</h3>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">{project.subtitle}</p>
            <p className="mt-4 flex-1 text-sm text-muted">{project.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => <li key={tag} className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">{tag}</li>)}
            </ul>
          </a>
        ))}
      </div>
    </section>
  );
}
