'use client';

/**
 * Custom cursor: a blue pointer arrow that follows the pointer (the SVG origin
 * is the tip, so the tip is the hotspot). Over clickable elements it gains a
 * soft glow to signal interactivity. Only active for fine pointers with motion
 * allowed; the native cursor is suppressed via html.has-cursor.
 */
import { useEffect, useRef, useState } from 'react';
import { useIsFinePointer, useMotionAllowed } from '@/lib/motion';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary';

export default function Cursor() {
  const allowed = useMotionAllowed();
  const fine = useIsFinePointer();
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const hoveringRef = useRef(false);
  const active = allowed && fine;

  useEffect(() => {
    if (!active) return;
    const dot = dotRef.current;
    if (!dot) return;

    document.documentElement.classList.add('has-cursor');

    const onMove = (e: PointerEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      const target = e.target as Element | null;
      const interactive = Boolean(target?.closest?.(INTERACTIVE));
      if (interactive !== hoveringRef.current) {
        hoveringRef.current = interactive;
        setHovering(interactive);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      hoveringRef.current = false;
      setHovering(false);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      <div
        ref={dotRef}
        data-testid="cursor-glow"
        data-hovering={hovering ? 'true' : undefined}
        className="absolute left-0 top-0"
      >
        {/* Glow indicator, shown only over clickable elements. */}
        <span
          className={`absolute left-[7px] top-[13px] size-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-trace blur-md transition-opacity duration-(--duration-fast) ${hovering ? 'opacity-70' : 'opacity-0'}`}
        />
        <svg
          width="19"
          height="30"
          viewBox="0 0 12 19"
          aria-hidden="true"
          className={`relative transition-[filter] duration-(--duration-fast) ${hovering ? 'drop-shadow-[0_0_5px_rgba(119,141,169,0.95)]' : 'drop-shadow-[0_1px_2px_rgba(13,27,42,0.85)]'}`}
        >
          <path
            d="M0 0 L0 16 L4 12.5 L6.4 18.4 L8.8 17.4 L6.4 11.5 L11.5 11.5 Z"
            fill="var(--color-trace)"
            stroke="var(--color-void)"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
