'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type MotionMode = 'system' | 'on' | 'reduced';

interface MotionState {
  enabled: boolean;
  mode: MotionMode;
  systemReduced: boolean;
  ready: boolean;
  setMode: (mode: MotionMode) => void;
}

const STORAGE_KEY = 'motion-preference';
const LEGACY_KEY = 'force-motion';
const MotionContext = createContext<MotionState | null>(null);

let registered = false;
export function registerGsap(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

function validMode(value: string | null): value is MotionMode {
  return value === 'system' || value === 'on' || value === 'reduced';
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [mode, updateMode] = useState<MotionMode>('system');
  const [systemReduced, setSystemReduced] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const readPreference = () => {
      let stored = localStorage.getItem(STORAGE_KEY);
      if (!validMode(stored) && localStorage.getItem(LEGACY_KEY) === '1') {
        stored = 'on';
        localStorage.setItem(STORAGE_KEY, stored);
        localStorage.removeItem(LEGACY_KEY);
      }
      updateMode(validMode(stored) ? stored : 'system');
      setSystemReduced(media.matches);
      setReady(true);
    };
    const onMedia = () => setSystemReduced(media.matches);
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === LEGACY_KEY) readPreference();
    };

    readPreference();
    media.addEventListener('change', onMedia);
    window.addEventListener('storage', onStorage);
    return () => {
      media.removeEventListener('change', onMedia);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const setMode = useCallback((next: MotionMode) => {
    updateMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    localStorage.removeItem(LEGACY_KEY);
  }, []);

  const enabled = ready && (mode === 'on' || (mode === 'system' && !systemReduced));

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.dataset.motion = enabled ? 'on' : 'reduced';
    root.dataset.motionMode = mode;
    root.classList.toggle('force-motion', mode === 'on');
    if (!enabled) {
      root.classList.remove('has-cursor');
      root.style.scrollBehavior = 'auto';
    }
  }, [enabled, mode, ready]);

  const value = useMemo(
    () => ({ enabled, mode, systemReduced, ready, setMode }),
    [enabled, mode, systemReduced, ready, setMode],
  );
  return createElement(MotionContext.Provider, { value }, children);
}

export function useMotion(): MotionState {
  const value = useContext(MotionContext);
  if (!value) throw new Error('useMotion must be used inside MotionProvider');
  return value;
}

export function useMotionAllowed(): boolean {
  return useMotion().enabled;
}

export function useIsFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    const update = () => setFine(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return fine;
}

export { gsap, ScrollTrigger, SplitText };
