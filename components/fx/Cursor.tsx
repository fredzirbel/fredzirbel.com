'use client';

/**
 * Custom cursor: an accent dot with a soft glow that morphs into a ring
 * over clickable elements to signal interactivity. Only active for fine
 * pointers with motion allowed; the native cursor is suppressed via
 * html.has-cursor.
 */
import { useEffect, useRef, useState } from 'react';
import { useIsFinePointer, useMotionAllowed } from '@/lib/motion';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary';

export default function Cursor() {
  const allowed = useMotionAllowed();
  const fine = useIsFinePointer();
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const hoveringRef = useRef(false);
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
      const target = e.target as Element | null;
      const interactive = Boolean(target?.closest?.(INTERACTIVE));
      if (interactive !== hoveringRef.current) {
        hoveringRef.current = interactive;
        setHovering(interactive);
      }

      // Over clickables the arrow tip is the hotspot (origin at top-left); the
      // plain dot is centered on the pointer.
      dot.style.transform = interactive
        ? `translate(${e.clientX}px, ${e.clientY}px)`
        : `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;

      // No particle trail while the arrow is showing.
      if (interactive) return;

      const now = performance.now();
      if (now - lastTrailAt < 28) return;
      lastTrailAt = now;

      const particle = document.createElement('span');
      particle.className = 'absolute size-1.5 rounded-full bg-trace/45 blur-[1px]';
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
      hoveringRef.current = false;
      setHovering(false);
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
        data-hovering={hovering ? 'true' : undefined}
        className="absolute left-0 top-0"
      >
        {hovering ? (
          <svg
            width="19"
            height="30"
            viewBox="0 0 12 19"
            aria-hidden="true"
            className="drop-shadow-[0_1px_2px_rgba(13,27,42,0.85)]"
          >
            <path
              d="M0 0 L0 16 L4 12.5 L6.4 18.4 L8.8 17.4 L6.4 11.5 L11.5 11.5 Z"
              fill="var(--color-trace)"
              stroke="var(--color-void)"
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <div className="relative size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-trace shadow-[0_0_12px_rgba(119,141,169,0.95),0_0_30px_rgba(119,141,169,0.55),0_0_60px_rgba(119,141,169,0.25)]">
            <span className="absolute -inset-4 rounded-full bg-trace/20 blur-md" />
          </div>
        )}
      </div>
    </div>
  );
}
