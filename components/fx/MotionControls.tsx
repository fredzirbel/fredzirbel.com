'use client';

import { useMotion, type MotionMode } from '@/lib/motion';

const options: { value: MotionMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'on', label: 'On' },
  { value: 'reduced', label: 'Reduced' },
];

export function EnableMotionPill() {
  const { mode, systemReduced, ready, setMode } = useMotion();
  if (!ready || mode !== 'system' || !systemReduced) return null;
  return (
    <button
      type="button"
      onClick={() => setMode('on')}
      className="fixed bottom-5 right-5 z-50 rounded-full border border-signal/50 bg-void/90 px-4 py-2 font-mono text-xs uppercase tracking-wider text-signal shadow-lg backdrop-blur"
    >
      Enable motion
    </button>
  );
}

export function MotionSelector() {
  const { mode, setMode } = useMotion();
  return (
    <fieldset className="flex items-center gap-2" data-testid="motion-selector">
      <legend className="sr-only">Motion preference</legend>
      <span aria-hidden="true" className="mr-1 font-mono text-[10px] uppercase tracking-wider text-muted">
        Motion
      </span>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={mode === option.value}
          onClick={() => setMode(option.value)}
          className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
            mode === option.value
              ? 'border-signal text-signal'
              : 'border-line text-muted hover:border-signal/50 hover:text-ink'
          }`}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}
