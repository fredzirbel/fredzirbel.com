'use client';

/**
 * Scroll progress: a bright signal bar across the very top of every page.
 * Driven by a rAF loop that reads Lenis's own progress when present (Lenis
 * intercepts wheel, so a plain window 'scroll' event can be missed) and
 * falls back to window scroll otherwise.
 */
import { useEffect, useRef } from 'react';

interface LenisLike {
  progress?: number;
  scroll?: number;
  limit?: number;
}

export default function ProgressBar() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = -1;

    const read = (): number => {
      const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
      if (lenis && typeof lenis.progress === 'number' && Number.isFinite(lenis.progress)) {
        return lenis.progress;
      }
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY || doc.scrollTop;
      return max > 0 ? y / max : 0;
    };

    const tick = () => {
      const p = Math.min(Math.max(read(), 0), 1);
      if (bar.current && Math.abs(p - last) > 0.0005) {
        bar.current.style.transform = `scaleX(${p})`;
        last = p;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-signal shadow-[0_0_10px_1px_rgb(198_255_74/0.6)] will-change-transform"
    />
  );
}
