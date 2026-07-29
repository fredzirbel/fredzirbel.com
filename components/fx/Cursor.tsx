'use client';

/**
 * Custom cursor: a signal dot with a soft glow. Only active for fine
 * pointers with motion allowed; the native cursor is suppressed via
 * html.has-cursor.
 */
import { useEffect, useRef } from 'react';
import { useIsFinePointer, useMotionAllowed } from '@/lib/motion';

export default function Cursor() {
  const allowed = useMotionAllowed();
  const fine = useIsFinePointer();
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const active = allowed && fine;

  useEffect(() => {
    if (!active) return;
    const dot = dotRef.current;
    const trail = trailRef.current;
    if (!dot || !trail) return;

    document.documentElement.classList.add('has-cursor');

    let lastTrailAt = 0;
    const particles = new Set<HTMLSpanElement>();

    const onMove = (e: PointerEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;

      const now = performance.now();
      if (now - lastTrailAt < 28) return;
      lastTrailAt = now;

      const particle = document.createElement('span');
      particle.className = 'absolute size-1.5 rounded-full bg-signal/45 blur-[1px]';
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      trail.appendChild(particle);
      particles.add(particle);

      const animation = particle.animate(
        [
          { opacity: 0.5, transform: 'translate(-50%, -50%) scale(1)' },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(2.8)' },
        ],
        { duration: 520, easing: 'ease-out' },
      );
      animation.onfinish = () => {
        particles.delete(particle);
        particle.remove();
      };
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      particles.forEach((particle) => {
        particle.getAnimations().forEach((animation) => animation.cancel());
        particle.remove();
      });
      particles.clear();
    };
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      <div ref={trailRef} data-testid="cursor-trail" className="absolute inset-0" />
      <div
        ref={dotRef}
        data-testid="cursor-glow"
        className="absolute left-0 top-0 size-2 rounded-full bg-signal shadow-[0_0_8px_rgba(198,255,74,0.95),0_0_20px_rgba(198,255,74,0.55),0_0_40px_rgba(198,255,74,0.25)]"
      >
        <span className="absolute -inset-3 rounded-full bg-signal/20 blur-md" />
      </div>
    </div>
  );
}
