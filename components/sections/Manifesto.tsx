'use client';

/**
 * Scrollytelling statement: the manifesto line fills from ghost to ink
 * as it scrolls through the viewport, keywords in signal. Short bio
 * follows. Fully readable without JS or motion.
 */
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import TerminalObject from '@/components/fx/TerminalObject';
import { gsap, motionAllowed, registerGsap, SplitText } from '@/lib/motion';

export default function Manifesto() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionAllowed()) return;
      registerGsap();

      const split = SplitText.create('[data-manifesto]', { type: 'words' });
      gsap.from(split.words, {
        opacity: 0.12,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-manifesto]',
          start: 'top 78%',
          end: 'bottom 40%',
          scrub: 0.4,
        },
      });

      gsap.from('[data-bio]', {
        opacity: 0,
        y: 28,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '[data-bio-grid]', start: 'top 85%', once: true },
      });

      return () => split.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="about"
      className="mx-auto max-w-[1440px] scroll-mt-24 px-6 py-24 md:px-12 md:py-28"
    >
      <p className="mb-10 font-mono text-xl uppercase tracking-[0.2em] text-muted">
        <span className="mr-4 text-signal">01</span>About
      </p>
      <p
        data-manifesto
        className="max-w-5xl font-display text-[clamp(1.8rem,4.6vw,4rem)] font-bold leading-[1.12] tracking-tight"
      >
        I find <span className="text-signal">threats</span> for a living - and
        build the <span className="text-signal">tools</span> to understand
        them.
      </p>

      <div
        data-bio-grid
        className="mt-16 grid items-center gap-10 text-muted md:grid-cols-3 md:gap-14"
      >
        <TerminalObject />
        <p data-bio>
          By day I&apos;m a Principal Security Analyst at{' '}
          <a
            href="https://www.criticalstart.com"
            rel="noopener"
            className="text-ink underline decoration-signal/40 underline-offset-4 transition-colors duration-(--duration-fast) hover:text-signal hover:decoration-signal"
          >
            Critical Start
          </a>
          , a 24/7 MDR protecting 2,500+ customer environments. When an alert
          fires, my job is deciding whether it&apos;s noise or an incident:
          digging through the logs to prove it, and executing remediation on
          live threats when it&apos;s real.
        </p>
        <p data-bio>
          The rest of the time I build the tools I wish I had on shift: a
          detection-as-code pipeline, a URL detonation toolbox, a homelab SOC.
          Building them is how I learn what&apos;s actually happening under
          the hood, and I document what I find on the{' '}
          <a
            href="/blog/"
            className="text-ink underline decoration-signal/40 underline-offset-4 transition-colors duration-(--duration-fast) hover:text-signal hover:decoration-signal"
          >
            blog
          </a>
          .
        </p>
      </div>
    </section>
  );
}
