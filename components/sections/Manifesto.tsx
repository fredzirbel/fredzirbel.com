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

      // Eyebrow eases up as the section arrives, connecting the hero handoff
      gsap.from('[data-about-eyebrow]', {
        opacity: 0,
        y: 24,
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: { trigger: scope.current, start: 'top 82%', once: true },
      });

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
      className="mx-auto flex min-h-[80dvh] max-w-[1440px] flex-col justify-center scroll-mt-24 px-6 py-12 md:px-12"
    >
      <p
        data-about-eyebrow
        className="mb-10 font-mono text-xl uppercase tracking-[0.2em] text-muted"
      >
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
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-signal/40 underline-offset-4 transition-colors duration-(--duration-fast) hover:text-signal hover:decoration-signal"
          >
            Critical Start
          </a>
          , a 24/7 MDR protecting 2,500+ customer environments. I triage and
          investigate alerts across 30+ integrated security products, decide
          whether each one is noise or a real incident, and execute remediation
          on live threats when it counts.
        </p>
        <p data-bio>
          Outside of work I go deeper on the craft - detection engineering,
          incident response, and security automation. I build projects like a
          detection-as-code pipeline, a URL detonation toolbox, and a homelab
          SOC to learn how the tooling actually works under the hood, and I
          write up what I find on the{' '}
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
