'use client';

/** Scroll progress: a bright signal bar across the very top of every page. */
import { useEffect, useRef } from 'react';

export default function ProgressBar() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY || doc.scrollTop;
      const progress = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-signal shadow-[0_0_10px_1px_rgb(198_255_74/0.6)] will-change-transform"
    />
  );
}
