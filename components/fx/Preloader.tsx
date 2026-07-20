'use client';

/**
 * 600ms cinematic entry: counter runs 0-100, then the veil wipes up.
 * Shown once per session; skipped entirely under reduced motion.
 */
import { useEffect, useRef, useState } from 'react';
import { useMotion } from '@/lib/motion';

export default function Preloader() {
  const [state, setState] = useState<'idle' | 'counting' | 'done'>('idle');
  const counterRef = useRef<HTMLSpanElement>(null);
  const attempted = useRef(false);
  const rafRef = useRef(0);
  const { enabled, ready } = useMotion();
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    if (!ready || attempted.current) return;
    attempted.current = true;
    if (sessionStorage.getItem('preloaded') === '1' || !enabledRef.current) {
      sessionStorage.setItem('preloaded', '1');
      return;
    }
    sessionStorage.setItem('preloaded', '1');
    setState('counting');

    const start = performance.now();
    const DURATION = 550;
    const tick = () => {
      const t = Math.min((performance.now() - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(eased * 100)).padStart(3, '0');
      }
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setState('done');
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready]);

  // If reduced motion is selected during the intro, remove the veil
  // immediately. The counter must never be left paused over the page.
  useEffect(() => {
    if (!enabled && state === 'counting') {
      cancelAnimationFrame(rafRef.current);
      setState('idle');
    }
  }, [enabled, state]);

  if (state === 'idle') return null;

  return (
    <div
      aria-hidden="true"
      data-testid="preloader"
      onTransitionEnd={() => setState('idle')}
      className={`fixed inset-0 z-[60] flex items-end justify-between bg-void px-6 pb-6 transition-transform duration-500 ease-(--ease-out-expo) md:px-12 ${
        state === 'done' ? '-translate-y-full' : ''
      }`}
    >
      <span className="font-mono text-xs uppercase tracking-widest text-muted">
        fredzirbel.com
      </span>
      <span ref={counterRef} className="font-mono text-sm text-signal">
        000
      </span>
    </div>
  );
}
