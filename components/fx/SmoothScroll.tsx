'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, registerGsap, ScrollTrigger, useMotion } from '@/lib/motion';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { enabled } = useMotion();

  useEffect(() => {
    if (!enabled) return;
    registerGsap();
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.16,
      wheelMultiplier: 1.1,
      anchors: { offset: -72 },
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    const update = (time: number) => lenis.raf(time * 1000);
    const refresh = () => ScrollTrigger.update();
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', refresh);

    return () => {
      lenis.off('scroll', refresh);
      gsap.ticker.remove(update);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [enabled]);

  return <>{children}</>;
}
