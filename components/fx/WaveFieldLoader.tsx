'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import { useMotion } from '@/lib/motion';
import { supportsWebGL2 } from '@/lib/webgl';

type WaveImplementation = ComponentType<{ active: boolean; onFailure: () => void }>;

export default function WaveFieldLoader() {
  const { enabled } = useMotion();
  const host = useRef<HTMLDivElement>(null);
  const [implementation, setImplementation] = useState<WaveImplementation | null>(null);
  const [desktop, setDesktop] = useState(false);
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting && !document.hidden);
        if (entry.isIntersecting && !implementation && !failed) {
          if (!supportsWebGL2()) {
            setFailed(true);
            return;
          }
          import('./WaveField')
            .then((module) => setImplementation(() => module.default))
            .catch(() => setFailed(true));
        }
      },
      { rootMargin: '160px' },
    );
    const visibility = () => {
      if (document.hidden) setActive(false);
      else {
        const rect = element.getBoundingClientRect();
        setActive(rect.bottom >= -160 && rect.top <= innerHeight + 160);
      }
    };
    observer.observe(element);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [desktop, failed, implementation]);

  const Implementation = implementation;
  const showingWebGL = desktop && Implementation && !failed;
  const fade = 'linear-gradient(to bottom, transparent 0%, black 20%, black 52%, transparent 92%)';
  return (
    <div
      ref={host}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{ maskImage: fade, WebkitMaskImage: fade }}
      data-testid="wave-fallback"
    >
      {!showingWebGL && (
        <svg className={`wave-fallback h-full w-full overflow-hidden ${enabled ? 'motion-active' : ''}`} viewBox="0 0 1200 700" preserveAspectRatio="none">
          {Array.from({ length: 15 }, (_, index) => (
            <path
              key={index}
              d={`M -80 ${280 + index * 22} Q 220 ${190 + index * 25} 520 ${285 + index * 18} T 1280 ${270 + index * 22}`}
              style={{ animationDelay: `${index * -0.12}s` }}
            />
          ))}
        </svg>
      )}
      {showingWebGL && (
        <Implementation active={active} onFailure={() => setFailed(true)} />
      )}
    </div>
  );
}
