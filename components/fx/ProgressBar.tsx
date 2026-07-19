'use client';

/**
 * Scroll progress: a bright signal bar across the very top of every page.
 * Driven by a document-spanning ScrollTrigger - the same system every other
 * scroll animation on the site uses - so it tracks Lenis and native scroll
 * identically and can't be missed.
 */
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { registerGsap, ScrollTrigger, useMotion } from '@/lib/motion';

export default function ProgressBar() {
  const bar = useRef<HTMLDivElement>(null);
  const { enabled } = useMotion();

  useGSAP(() => {
    const el = bar.current;
    if (!el || !enabled) {
      if (el) el.style.transform = 'scaleX(0)';
      return;
    }
    registerGsap();
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        el.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => {
      st.kill();
      el.style.transform = 'scaleX(0)';
    };
  }, { dependencies: [enabled], revertOnUpdate: true });

  return (
    <div
      ref={bar}
      aria-hidden="true"
      style={{ transform: 'scaleX(0)' }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-signal shadow-[0_0_10px_1px_rgb(198_255_74/0.6)] will-change-transform"
    />
  );
}
