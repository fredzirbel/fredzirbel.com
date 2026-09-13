'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import { useMotion } from '@/lib/motion';
import { supportsWebGL2 } from '@/lib/webgl';

type WaveImplementation = ComponentType<{ active: boolean; onFailure: () => void }>;

export default function WaveFieldLoader() {
  const { enabled, ready } = useMotion();
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
    if (!enabled || !desktop || !element) {
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
  }, [desktop, enabled, failed, implementation]);

  const Implementation = implementation;
  // WebGL will carry the hero once it loads. During that brief load window show
  // nothing (the shader background shows through) rather than flashing the
  // static SVG lines, then fade the WebGL in. The SVG is only for cases where
  // WebGL is never used: reduced motion, small screens, or a failure.
  const willUseWebGL = enabled && desktop && !failed;
  // Show the static SVG only once motion state is resolved (so it never flashes
  // before WebGL takes over) and only when motion is enabled: under reduced
  // motion the hero has no wave field at all, just the quiet backdrop. The SVG
  // still covers motion-on cases without WebGL - small screens and failures.
  const showFallback = ready && enabled && !willUseWebGL;
  const fade = 'linear-gradient(to bottom, black 0%, black 58%, transparent 92%)';
  return (
    <div
      ref={host}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{ maskImage: fade, WebkitMaskImage: fade }}
      data-testid="wave-fallback"
    >
      {showFallback && (
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
      {willUseWebGL && Implementation && (
        <div className="h-full w-full" style={{ animation: 'wave-reveal 0.7s ease both' }}>
          <Implementation active={active} onFailure={() => setFailed(true)} />
        </div>
      )}
    </div>
  );
}
