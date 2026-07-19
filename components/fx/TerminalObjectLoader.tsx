'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import { useMotion } from '@/lib/motion';
import { supportsWebGL2 } from '@/lib/webgl';

type TerminalImplementation = ComponentType<{ active: boolean; onFailure: () => void }>;

export default function TerminalObjectLoader() {
  const { enabled } = useMotion();
  const host = useRef<HTMLDivElement>(null);
  const [implementation, setImplementation] = useState<TerminalImplementation | null>(null);
  const [desktop, setDesktop] = useState(false);
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = matchMedia('(min-width: 768px)');
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const element = host.current;
    if (!desktop || !element) {
      setActive(false);
      return;
    }
    const nearObserver = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: '600px' });
    const activeObserver = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting && !document.hidden), { threshold: 0.1 });
    const visibility = () => {
      if (document.hidden) setActive(false);
      else {
        const rect = element.getBoundingClientRect();
        setActive(rect.bottom >= 0 && rect.top <= innerHeight);
      }
    };
    nearObserver.observe(element);
    activeObserver.observe(element);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      nearObserver.disconnect();
      activeObserver.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [desktop]);

  useEffect(() => {
    if (!desktop || !near || implementation || failed) return;
    if (!supportsWebGL2()) {
      setFailed(true);
      return;
    }
    import('./TerminalObject')
      .then((module) => setImplementation(() => module.default))
      .catch(() => setFailed(true));
  }, [desktop, failed, implementation, near]);

  const Implementation = implementation;
  const showingWebGL = desktop && Implementation && !failed;
  return (
    <div ref={host} aria-hidden="true" className="relative aspect-square w-full max-w-xs md:max-w-none" data-testid="terminal-fallback">
      {!showingWebGL && (
        <svg className={`terminal-fallback absolute inset-0 h-full w-full ${enabled ? 'motion-active' : ''}`} viewBox="0 0 400 400">
          <g fill="none" stroke="currentColor">
            <rect x="55" y="60" width="290" height="200" rx="8" />
            <rect x="72" y="77" width="256" height="166" opacity=".35" />
            <path d="M180 260v45m40-45v45M145 310h110M105 335h190l25 28H80z" />
          </g>
          <g className="terminal-dots" fill="currentColor">
            {Array.from({ length: 30 }, (_, index) => (
              <circle key={index} cx={100 + (index % 10) * 18} cy={112 + Math.floor(index / 10) * 28} r="3" />
            ))}
            <rect className="terminal-cursor" x="118" y="184" width="10" height="18" />
          </g>
        </svg>
      )}
      {showingWebGL && (
        <Implementation active={active} onFailure={() => setFailed(true)} />
      )}
    </div>
  );
}
