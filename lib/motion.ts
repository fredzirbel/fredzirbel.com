'use client';

/**
 * Shared motion utilities: GSAP plugin registration and the site-wide
 * motion gate (prefers-reduced-motion, overridable via localStorage
 * force-motion=1 which also stamps html.force-motion for CSS).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useEffect, useState } from 'react';

let registered = false;
export function registerGsap(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

export function motionAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  const forced = localStorage.getItem('force-motion') === '1';
  if (forced) document.documentElement.classList.add('force-motion');
  return forced || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** SSR-safe hook: false on the server and first paint, then the real value. */
export function useMotionAllowed(): boolean {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    setAllowed(motionAllowed());
  }, []);
  return allowed;
}

export function useIsFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    setFine(window.matchMedia('(pointer: fine)').matches);
  }, []);
  return fine;
}

export { gsap, ScrollTrigger, SplitText };
