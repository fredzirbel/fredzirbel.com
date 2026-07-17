'use client';

/**
 * Custom cursor: a signal dot with a trailing ring in difference blend.
 * Expands over interactive elements; shows a label over elements with
 * data-cursor="view". Only active for fine pointers with motion allowed;
 * the native cursor is suppressed via html.has-cursor.
 */
import { useEffect, useRef, useState } from 'react';
import { useIsFinePointer, useMotionAllowed } from '@/lib/motion';

export default function Cursor() {
  const allowed = useMotionAllowed();
  const fine = useIsFinePointer();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const active = allowed && fine;

  useEffect(() => {
    if (!active) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add('has-cursor');

    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let rx = x;
    let ry = y;
    let hovering = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element).closest(
        'a, button, [role="button"], [data-cursor]',
      );
      hovering = !!target;
      setLabel(target?.getAttribute('data-cursor') === 'view' ? 'VIEW' : '');
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      const scale = hovering ? 2.6 : 1;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    return () => {
      document.documentElement.classList.remove('has-cursor');
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 size-1.5 rounded-full bg-signal"
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex size-9 items-center justify-center rounded-full border border-ink/60 mix-blend-difference transition-[width,height] duration-(--duration-fast)"
      >
        {label && (
          <span className="font-mono text-[8px] tracking-widest text-ink">{label}</span>
        )}
      </div>
    </div>
  );
}
