'use client';

/**
 * 600ms cinematic entry: counter runs 0-100, then the veil wipes up.
 * Shown once per session; skipped entirely under reduced motion.
 */
import { useEffect, useRef, useState } from 'react';
import { motionAllowed } from '@/lib/motion';

export default function Preloader() {
  const [state, setState] = useState<'idle' | 'counting' | 'done'>('idle');
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem('preloaded') === '1' || !motionAllowed()) return;
    sessionStorage.setItem('preloaded', '1');
    setState('counting');

    const start = performance.now();
    const DURATION = 550;
    let raf = 0;
    const tick = () => {
      const t = Math.min((performance.now() - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(eased * 100)).padStart(3, '0');
      }
      if (t < 1) raf = requestAnimationFrame(tick);
      else setState('done');
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (state === 'idle') return null;

  return (
    <div
      aria-hidden="true"
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
