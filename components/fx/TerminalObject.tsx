'use client';

/**
 * A wireframe terminal: monitor, stand, and keyboard drawn as glowing
 * edges, with a dot-matrix "screen" and a blinking cursor. Slow sway plus
 * mouse tilt. Static frame under reduced motion; skipped on mobile.
 */
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { motionAllowed } from '@/lib/motion';

const SIGNAL = 0xc6ff4a;
const TRACE = 0x7a87ff;
const INK = 0xf2f2ef;

function edges(geo: THREE.BufferGeometry): THREE.EdgesGeometry {
  return new THREE.EdgesGeometry(geo);
}

function Terminal({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const cursor = useRef<THREE.Mesh>(null);

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

  // Dot-matrix "text" on the screen: rows of points with ragged line lengths
  const screenDots = useMemo(() => {
    const points: number[] = [];
    const rows = 7;
    const cols = 22;
    for (let r = 0; r < rows; r++) {
      const lineLength = Math.floor(cols * (0.35 + Math.random() * 0.6));
      for (let c = 0; c < lineLength; c++) {
        points.push(-1.35 + c * 0.125, 0.78 - r * 0.24, 0);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));
    return geo;
  }, []);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    if (group.current) {
      const targetY = Math.sin(t * 0.4) * 0.28 + pointer.x * 0.25;
      const targetX = -0.08 + pointer.y * 0.12;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
      group.current.position.y = Math.sin(t * 0.8) * 0.05;
    }
    if (cursor.current) {
      (cursor.current.material as THREE.MeshBasicMaterial).opacity =
        Math.floor(t * 2.2) % 2 === 0 ? 0.95 : 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* Monitor + bezel */}
      <lineSegments geometry={parts.monitor.geo} material={parts.monitor.mat} position={[0, 0.7, 0]} />
      <lineSegments geometry={parts.bezel.geo} material={parts.bezel.mat} position={[0, 0.7, 0.115]} />
      {/* Screen dot-matrix */}
      <points geometry={screenDots} position={[0, 0.72, 0.13]}>
        <pointsMaterial color={TRACE} size={0.045} transparent opacity={0.85} />
      </points>
      {/* Blinking cursor */}
      <mesh ref={cursor} position={[-0.1, -0.02, 0.13]}>
        <planeGeometry args={[0.12, 0.16]} />
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

  useEffect(() => {
    if (!window.matchMedia('(min-width: 768px)').matches) return;
    const timer = setTimeout(() => setReady({ animate: motionAllowed() }), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;

  return (
    <div aria-hidden="true" className="aspect-square w-full max-w-xs md:max-w-none">
      <Canvas
        camera={{ position: [0, 0.2, 5.4], fov: 45 }}
        dpr={[1, 2]}
        frameloop={ready.animate ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      >
        <Terminal animate={ready.animate} />
      </Canvas>
    </div>
  );
}
