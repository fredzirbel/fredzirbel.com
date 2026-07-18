'use client';

/**
 * Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays
 * perfectly in sync. Renders children untouched when motion is off.
 */
import { ReactLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';
import { useEffect, useRef } from 'react';
import { gsap, registerGsap, ScrollTrigger, useMotionAllowed } from '@/lib/motion';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const allowed = useMotionAllowed();

  useEffect(() => {
    if (!allowed) return;
    registerGsap();
    const lenis = lenisRef.current?.lenis;
    // Expose the instance so the progress bar can read scroll progress
    // directly (Lenis intercepts wheel, so a plain window 'scroll' listener
    // can miss updates)
    (window as unknown as { __lenis?: unknown }).__lenis = lenis;
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    lenis?.on('scroll', ScrollTrigger.update);
    return () => {
      gsap.ticker.remove(update);
      (window as unknown as { __lenis?: unknown }).__lenis = undefined;
    };
  }, [allowed]);

  if (!allowed) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.16,
        wheelMultiplier: 1.1,
        anchors: { offset: -72 },
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
}
