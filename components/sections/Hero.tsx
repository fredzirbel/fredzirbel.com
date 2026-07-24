'use client';

import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import WaveFieldLoader from '@/components/fx/WaveFieldLoader';
import { gsap, registerGsap, SplitText, useMotion } from '@/lib/motion';

export default function Hero() {
  const scope = useRef<HTMLElement>(null);
  const { enabled } = useMotion();

  useGSAP(() => {
    if (!enabled) return;
    registerGsap();
    const split = SplitText.create('[data-split]', { type: 'lines,chars', linesClass: 'split-line', mask: 'lines' });
    gsap.from(split.chars, { yPercent: 110, duration: 0.85, ease: 'expo.out', stagger: 0.02, delay: 0.1 });
    gsap.from('[data-hero-kicker]', { opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.45 });
    gsap.from('[data-hero-fade]', { opacity: 0, y: 18, duration: 0.55, ease: 'power3.out', stagger: 0.08, delay: 0.55 });
    return () => split.revert();
  }, { scope, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section ref={scope} className="relative flex min-h-dvh flex-col justify-end overflow-hidden">
      <WaveFieldLoader />
      <div className="relative z-[2] mx-auto w-full max-w-[1440px] px-6 pb-14 pt-32 md:px-12">
        <p data-hero-kicker className="mb-6 font-mono text-xs uppercase tracking-[0.24em] text-signal">
          Security Analyst · Incident Response · Threat Detection
        </p>
        <h1 className="max-w-6xl font-display font-black uppercase leading-[0.87] tracking-[-0.03em]" style={{ fontStretch: '120%' }}>
          <span data-split className="block text-[clamp(4rem,13vw,12rem)]">Fred Zirbel</span>
          <span data-split className="text-outline block text-[clamp(2.4rem,7vw,6.5rem)]">Turn alerts into action</span>
        </h1>
        <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,42rem)_1fr] lg:items-end">
          <p data-hero-fade className="text-base text-muted sm:text-lg">
            I investigate threats, improve detection quality, and build practical workflows that help analysts move from alert to defensible action.
          </p>
          <div data-hero-fade className="flex flex-wrap gap-3 lg:justify-end">
            <a href="#work" className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-void transition hover:bg-signal">View case studies</a>
            <a href="/fred-zirbel-resume.pdf" className="rounded-full border border-line px-6 py-3 text-sm font-medium transition hover:border-signal hover:text-signal">View résumé</a>
            <a href="#contact" className="rounded-full border border-line px-6 py-3 text-sm font-medium transition hover:border-signal hover:text-signal">Contact me</a>
          </div>
        </div>
        <ul
          data-hero-fade
          aria-label="Career details"
          className="mt-7 grid gap-x-8 gap-y-2 border-y border-line py-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted sm:grid-cols-2 lg:grid-cols-3"
        >
          <li><span className="text-ink">Dallas, TX</span> · Remote, hybrid, or onsite</li>
          <li>Open to relocation within the U.S.</li>
          <li><span className="text-ink">U.S. work authorized</span> · No sponsorship required now or in the future</li>
          <li><span className="text-ink">2 years</span> of professional cybersecurity experience</li>
          <li>Eligible and willing to obtain a U.S. security clearance</li>
          <li><span className="text-signal">Available to interview</span> · Two weeks&apos; notice to start</li>
        </ul>
        <p data-hero-fade className="mt-5 max-w-4xl border-l-2 border-signal pl-4 text-sm text-muted sm:text-base">
          Developed investigation playbooks for five alert types, reducing average triage time by approximately six minutes per alert while standardizing analyst workflows.
        </p>
      </div>
    </section>
  );
}
