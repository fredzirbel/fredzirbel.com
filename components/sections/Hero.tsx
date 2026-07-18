'use client';

/**
 * Hero: FRED / ZIRBEL stacked huge over the wave-field. SplitText chars
 * rise in on load; scrolling scrubs the headline smaller and dimmer while
 * the section pins briefly. All of it degrades to plain visible text.
 */
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import WaveField from '@/components/fx/WaveField';
import { gsap, motionAllowed, registerGsap, SplitText } from '@/lib/motion';

export default function Hero() {
  const scope = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const foreground = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!motionAllowed()) return;
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
          yPercent: -25,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: 'bottom 75%',
            scrub: true,
          },
        });
      }

      return () => split.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative flex min-h-[90dvh] flex-col justify-end overflow-hidden">
      <WaveField />

      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-12 md:px-12 md:pb-10">
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
          className="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-end"
        >
          <p data-hero-fade className="max-w-md text-base text-muted sm:text-lg">
            A home for learning cybersecurity in the open - threat
            investigation by day, security tooling and write-ups the rest of
            the time.
          </p>
          <div data-hero-fade className="flex items-center gap-4">
            <a
              href="#work"
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-void transition-[background-color,transform] duration-(--duration-fast) hover:bg-signal active:scale-[0.97]"
            >
              Selected work
            </a>
            <a
              href="/blog/"
              className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-[border-color,color,transform] duration-(--duration-fast) hover:border-signal hover:text-signal active:scale-[0.97]"
            >
              Read the blog
            </a>
          </div>
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
