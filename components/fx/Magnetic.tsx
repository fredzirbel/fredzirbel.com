'use client';

/**
 * Magnetic hover: the child leans toward the cursor within its bounds
 * and springs back on leave. No-op without fine pointer or motion.
 */
import { useRef } from 'react';
import { gsap, useIsFinePointer, useMotionAllowed } from '@/lib/motion';

interface Props {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export default function Magnetic({ children, strength = 0.35, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Both hooks must run unconditionally (no short-circuit between hooks)
  const motionOk = useMotionAllowed();
  const finePointer = useIsFinePointer();
  const active = motionOk && finePointer;

  const onMove = (e: React.PointerEvent) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    gsap.to(ref.current, {
      x: (e.clientX - rect.left - rect.width / 2) * strength,
      y: (e.clientY - rect.top - rect.height / 2) * strength,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const onLeave = () => {
    if (!active || !ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={className}>
      {children}
    </div>
  );
}
