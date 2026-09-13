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
    // Transform-only reveals (no opacity) so the text can never get stuck
    // invisible if the intro is paused or interrupted - it only slides in.
    gsap.from('[data-hero-kicker]', { y: 12, duration: 0.6, ease: 'power3.out', delay: 0.3 });
    gsap.from('[data-hero-fade]', { y: 20, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: 0.4 });
    gsap.to('[data-hero-scroll]', {
      opacity: 0,
      yPercent: -6,
      ease: 'none',
      scrollTrigger: {
        trigger: scope.current,
        start: () => window.innerHeight * 0.5,
        end: 'bottom 15%',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    // The scroll cue is only useful at the very top; fade it out quickly.
    gsap.to('[data-scroll-hint]', {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: () => window.innerHeight * 0.3,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    return () => split.revert();
  }, { scope, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section ref={scope} className="relative flex min-h-dvh flex-col justify-center overflow-hidden">
      <WaveFieldLoader />
      <div data-hero-scroll data-testid="hero-content" className="relative z-[2] mx-auto w-full max-w-[1440px] px-6 py-14 md:px-12">
        <div data-testid="hero-kicker" className="mb-6">
          <p data-hero-kicker className="font-mono text-xs uppercase tracking-[0.24em] text-trace">
            Security Operations · Incident Response · Detection Engineering
          </p>
        </div>
        <h1 className="max-w-6xl font-display font-black uppercase leading-[0.87] tracking-[-0.03em]" style={{ fontStretch: '120%' }}>
          <span data-split className="block text-[clamp(4rem,13vw,12rem)]">Fred</span>
          <span data-split className="text-outline block text-[clamp(4rem,13vw,12rem)]">Zirbel</span>
        </h1>
        <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,42rem)_1fr] lg:items-end">
          <p data-hero-fade className="text-base text-muted sm:text-lg">
            I investigate threats, improve detection quality, and build practical workflows that help analysts move from alert to defensible action.
          </p>
          <div data-hero-fade className="flex flex-wrap gap-3 lg:justify-end">
            <a href="/fred-zirbel-resume.pdf" target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-void transition hover:bg-signal hover:text-ink">View resume</a>
            <a href="#work" className="rounded-full border border-line px-6 py-3 text-sm font-medium transition hover:border-trace hover:text-trace">View projects</a>
            <a href="#contact" className="rounded-full border border-line px-6 py-3 text-sm font-medium transition hover:border-trace hover:text-trace">Contact me</a>
          </div>
        </div>
        <ul
          data-hero-fade
          aria-label="Career details"
          className="mt-7 grid gap-x-8 gap-y-3 border-y border-line py-5 font-mono text-sm uppercase leading-relaxed tracking-[0.08em] text-muted sm:grid-cols-2 lg:grid-cols-3"
        >
          <li><span className="text-ink">Dallas, TX</span> · Remote, hybrid, or onsite</li>
          <li>Open to relocation within the U.S.</li>
          <li><span className="text-ink">U.S. work authorized</span> · No sponsorship required now or in the future</li>
          <li><span className="text-ink">2 years</span> of professional cybersecurity experience</li>
          <li>Eligible and willing to obtain a U.S. security clearance</li>
          <li><span className="text-ink">Available to interview</span> · Two weeks&apos; notice to start</li>
        </ul>
      </div>
      <a
        href="/#experience"
        data-scroll-hint
        aria-label="Scroll to experience"
        className="group absolute inset-x-0 bottom-6 z-[2] mx-auto hidden w-fit flex-col items-center gap-4 text-muted transition-colors duration-(--duration-fast) hover:text-trace [@media(min-width:768px)_and_(min-height:780px)]:flex"
      >
        <span className="font-mono text-[20px] uppercase tracking-[0.3em]">Scroll</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="scroll-hint-arrow size-8"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
