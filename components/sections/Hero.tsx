'use client';

/**
 * Hero: FRED / ZIRBEL stacked huge over the wave-field. SplitText chars
 * rise in on load; scrolling scrubs the headline smaller and dimmer while
 * the section pins briefly. All of it degrades to plain visible text.
 */
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import WaveFieldLoader from '@/components/fx/WaveFieldLoader';
import { gsap, registerGsap, SplitText, useMotion } from '@/lib/motion';

export default function Hero({ hasPosts }: { hasPosts: boolean }) {
  const scope = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const foreground = useRef<HTMLDivElement>(null);
  const { enabled } = useMotion();

  useGSAP(
    () => {
      if (!enabled) return;
      registerGsap();

      const split = SplitText.create('[data-split]', {
        type: 'lines,chars',
        linesClass: 'split-line',
        mask: 'lines',
      });
      gsap.from(split.chars, {
        yPercent: 110,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.028,
        delay: 0.15,
      });
      gsap.from('[data-hero-fade]', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.75,
      });

      // Scroll transition into About: the headline recedes while the
      // foreground (subline + CTAs + scroll hint) lifts and fades away,
      // easing the handoff instead of a hard cut.
      if (window.matchMedia('(min-width: 768px)').matches) {
        gsap.to(title.current, {
          scale: 0.72,
          opacity: 0.12,
          transformOrigin: 'left bottom',
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: 'bottom 40%',
            scrub: true,
          },
        });
        gsap.to('[data-hero-lift]', {
          yPercent: -20,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: 'bottom 65%',
            scrub: true,
          },
        });
      }

      return () => split.revert();
    },
    { scope, dependencies: [enabled], revertOnUpdate: true },
  );

  return (
    <section ref={scope} className="relative flex min-h-dvh flex-col justify-end overflow-hidden">
      <WaveFieldLoader />

      <div className="relative z-[2] mx-auto w-full max-w-[1440px] px-6 pb-16 md:px-12 md:pb-14">
        <p data-hero-fade className="mb-6 font-mono text-xs uppercase tracking-[0.24em] text-signal">
          Security Analyst · Incident Response · Threat Detection
        </p>
        <h1
          ref={title}
          className="font-display font-black uppercase leading-[0.82] tracking-[-0.03em]"
          style={{ fontStretch: '125%' }}
        >
          <span data-split className="block text-[clamp(4rem,15.5vw,15rem)]">
            Fred
          </span>
          <span
            data-split
            className="text-outline block text-[clamp(4rem,15.5vw,15rem)]"
          >
            Zirbel
          </span>
        </h1>

        <div
          data-hero-lift
          className="mt-8"
        >
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <p data-hero-fade className="max-w-2xl text-base text-muted sm:text-lg">
              I investigate threats, improve detection quality, and build practical workflows that help analysts move from alert to defensible action.
            </p>
            <div data-hero-fade className="flex flex-wrap items-center gap-3 md:justify-end">
              <a
                href="#work"
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-void transition-[background-color,transform] duration-(--duration-fast) hover:bg-signal active:scale-[0.97]"
              >
                View case studies
              </a>
              <a
                href="/fred-zirbel-resume.pdf"
                className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-[border-color,color,transform] duration-(--duration-fast) hover:border-signal hover:text-signal active:scale-[0.97]"
              >
                View résumé
              </a>
              <a
                href="#contact"
                className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-[border-color,color,transform] duration-(--duration-fast) hover:border-signal hover:text-signal active:scale-[0.97]"
              >
                Contact me
              </a>
              {hasPosts && (
                <a
                  href="/blog/"
                  className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-[border-color,color,transform] duration-(--duration-fast) hover:border-signal hover:text-signal active:scale-[0.97]"
                >
                  Read the blog
                </a>
              )}
            </div>
          </div>
          <ul
            data-hero-fade
            aria-label="Career details"
            className="mt-6 grid gap-x-8 gap-y-2 border-y border-line py-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted sm:grid-cols-2 lg:grid-cols-3"
          >
            <li><span className="text-ink">Dallas, TX</span> · Remote, hybrid, or onsite</li>
            <li>Open to relocation within the U.S.</li>
            <li><span className="text-ink">U.S. work authorized</span> · No sponsorship required now or in the future</li>
            <li><span className="text-ink">2 years</span> of professional cybersecurity experience</li>
            <li>Eligible and willing to obtain a U.S. security clearance</li>
            <li><span className="text-signal">Interviewing now</span> · Start after two weeks&apos; notice</li>
          </ul>
          <p data-hero-fade className="mt-5 max-w-4xl border-l-2 border-signal pl-4 text-sm text-muted sm:text-base">
            Developed investigation playbooks for five alert types, reducing average triage time by approximately six minutes per alert while standardizing analyst workflows.
          </p>
        </div>
      </div>

      <div
        data-hero-fade
        aria-hidden="true"
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted md:flex"
      >
        Scroll
        <span className="inline-block h-px w-10 bg-muted/60"></span>
      </div>
    </section>
  );
}
