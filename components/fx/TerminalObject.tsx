'use client';

/**
 * A wireframe terminal: monitor, stand, and keyboard drawn as glowing
 * edges, with a dot-matrix "screen" whose text types itself in - dots
 * generate left-to-right, top-to-bottom with a blinking cursor tracking
 * the head. Types once each time it scrolls into view. Slow sway plus
 * mouse tilt. Static (fully typed) under reduced motion; skipped on mobile.
 */
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { motionAllowed } from '@/lib/motion';

const SIGNAL = 0xc6ff4a;
const TRACE = 0x7a87ff;
const INK = 0xf2f2ef;

const COL_STEP = 0.125;
const ROW_STEP = 0.24;
const X0 = -1.35;
const Y0 = 0.78;

function edges(geo: THREE.BufferGeometry): THREE.EdgesGeometry {
  return new THREE.EdgesGeometry(geo);
}

function Terminal({ animate, typeKey }: { animate: boolean; typeKey: number }) {
  const group = useRef<THREE.Group>(null);
  const cursor = useRef<THREE.Mesh>(null);
  const screenPoints = useRef<THREE.Points>(null);
  const typeStart = useRef<number>(0);

  const parts = useMemo(() => {
    const line = (color: number, opacity: number) =>
      new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    return {
      monitor: { geo: edges(new THREE.BoxGeometry(3.6, 2.4, 0.22)), mat: line(SIGNAL, 0.9) },
      bezel: { geo: edges(new THREE.PlaneGeometry(3.15, 1.95)), mat: line(SIGNAL, 0.35) },
      stand: { geo: edges(new THREE.CylinderGeometry(0.16, 0.3, 0.7, 6)), mat: line(SIGNAL, 0.7) },
      base: { geo: edges(new THREE.BoxGeometry(1.5, 0.1, 0.9)), mat: line(SIGNAL, 0.7) },
      keyboard: { geo: edges(new THREE.BoxGeometry(2.6, 0.12, 1.0)), mat: line(TRACE, 0.8) },
    };
  }, []);

  // Dot-matrix "text": rows of points with ragged line lengths, stored in
  // reading order (top row first, each row left-to-right) so a draw range
  // reveals them exactly like typing. Each point also records its row/col
  // so the cursor can sit at the current head.
  const { geometry, heads } = useMemo(() => {
    const positions: number[] = [];
    const heads: { x: number; y: number }[] = [];
    const rows = 7;
    const cols = 22;
    for (let r = 0; r < rows; r++) {
      const lineLength = Math.max(3, Math.floor(cols * (0.35 + Math.random() * 0.6)));
      for (let c = 0; c < lineLength; c++) {
        const x = X0 + c * COL_STEP;
        const y = Y0 - r * ROW_STEP;
        positions.push(x, y, 0);
        // The "head" is the slot just after this dot on its row
        heads.push({ x: x + COL_STEP, y });
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    return { geometry: geo, heads };
  }, []);

  const total = heads.length;
  const TYPE_DURATION = 1.6; // seconds to fully type

  // Reset the typing clock whenever typeKey changes (re-entry into view)
  useEffect(() => {
    typeStart.current = 0;
    if (!animate && screenPoints.current) {
      screenPoints.current.geometry.setDrawRange(0, total);
    }
  }, [typeKey, animate, total]);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;

    // Reduced motion: render one static, fully-typed frame - no sway/blink
    if (!animate) {
      if (screenPoints.current) screenPoints.current.geometry.setDrawRange(0, total);
      if (cursor.current) {
        const last = heads[total - 1];
        cursor.current.position.set(last.x, last.y, 0.13);
        (cursor.current.material as THREE.MeshBasicMaterial).opacity = 0.5;
      }
      return;
    }

    if (group.current) {
      const targetY = Math.sin(t * 0.4) * 0.2 + pointer.x * 0.18;
      const targetX = -0.06 + pointer.y * 0.1;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
      group.current.position.y = Math.sin(t * 0.8) * 0.04;
    }

    // Typing reveal
    if (typeStart.current === 0) typeStart.current = t;
    const progress = Math.min((t - typeStart.current) / TYPE_DURATION, 1);
    const revealed = Math.floor(progress * total);
    if (screenPoints.current) screenPoints.current.geometry.setDrawRange(0, revealed);

    // Cursor: follow the head while typing, blink when done
    if (cursor.current) {
      const mat = cursor.current.material as THREE.MeshBasicMaterial;
      if (revealed < total) {
        const head = heads[Math.min(revealed, total - 1)];
        cursor.current.position.set(head.x, head.y, 0.13);
        mat.opacity = 0.95; // solid while typing
      } else {
        const last = heads[total - 1];
        cursor.current.position.set(last.x, last.y, 0.13);
        mat.opacity = Math.floor(t * 2.2) % 2 === 0 ? 0.95 : 0.05;
      }
    }
  });

  return (
    <group ref={group} scale={0.9}>
      {/* Monitor + bezel */}
      <lineSegments geometry={parts.monitor.geo} material={parts.monitor.mat} position={[0, 0.7, 0]} />
      <lineSegments geometry={parts.bezel.geo} material={parts.bezel.mat} position={[0, 0.7, 0.115]} />
      {/* Screen dot-matrix (typed reveal) */}
      <points ref={screenPoints} geometry={geometry} position={[0, 0.72, 0.13]}>
        <pointsMaterial color={TRACE} size={0.045} transparent opacity={0.85} />
      </points>
      {/* Cursor: tracks the typing head */}
      <mesh ref={cursor} position={[X0, Y0, 0.13]}>
        <planeGeometry args={[0.09, 0.16]} />
        <meshBasicMaterial color={SIGNAL} transparent opacity={0.95} />
      </mesh>
      {/* Stand, base, keyboard */}
      <lineSegments geometry={parts.stand.geo} material={parts.stand.mat} position={[0, -0.85, 0]} />
      <lineSegments geometry={parts.base.geo} material={parts.base.mat} position={[0, -1.22, 0.1]} />
      <lineSegments
        geometry={parts.keyboard.geo}
        material={parts.keyboard.mat}
        position={[0, -1.22, 1.15]}
        rotation={[0.06, 0, 0]}
      />
      {/* Ink accent: power dot */}
      <mesh position={[1.55, -0.35, 0.13]}>
        <circleGeometry args={[0.035, 12]} />
        <meshBasicMaterial color={INK} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export default function TerminalObject() {
  const [ready, setReady] = useState<null | { animate: boolean }>(null);
  const [typeKey, setTypeKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(min-width: 768px)').matches) return;
    const timer = setTimeout(() => setReady({ animate: motionAllowed() }), 300);
    return () => clearTimeout(timer);
  }, []);

  // Re-arm the typing each time the terminal scrolls into view
  useEffect(() => {
    if (!ready?.animate || !containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setTypeKey((k) => k + 1);
      },
      { threshold: 0.4 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [ready]);

  if (!ready) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="aspect-square w-full max-w-xs md:max-w-none"
    >
      <Canvas
        camera={{ position: [0, 0.2, 6.4], fov: 45 }}
        dpr={[1, 2]}
        frameloop={ready.animate ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      >
        <Terminal animate={ready.animate} typeKey={typeKey} />
      </Canvas>
    </div>
  );
}
