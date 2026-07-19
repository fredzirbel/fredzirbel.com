'use client';

/**
 * A wireframe terminal: monitor, stand, and keyboard drawn as glowing
 * edges, with a dot-matrix "screen" whose text types itself in - dots
 * generate left-to-right, top-to-bottom with a blinking cursor tracking
 * the head. Types once when it first scrolls into view, then the cursor
 * blinks at the end of the last line like a code cursor. Static (fully
 * typed) under reduced motion; skipped on mobile.
 */
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useMotion } from '@/lib/motion';

const SIGNAL = 0xc6ff4a;
const TRACE = 0x7a87ff;
const INK = 0xf2f2ef;

// Dot-matrix layout, centered inside the screen with margin so the text
// and cursor never reach the bezel edge (points sit at group offset y=0.72).
const COL_STEP = 0.11;
const ROW_STEP = 0.2;
const X0 = -1.05;
const Y0 = 0.5;
const CURSOR_MAX_X = 0.95;

function edges(geo: THREE.BufferGeometry): THREE.EdgesGeometry {
  return new THREE.EdgesGeometry(geo);
}

function Terminal({ animate, started }: { animate: boolean; started: boolean }) {
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

  // Dot-matrix "text" in reading order (top row first, left-to-right) so a
  // draw range reveals it like typing. The last line is short so the cursor
  // parks right after it, like a cursor at the end of a line of code.
  const { geometry, endPoint, total } = useMemo(() => {
    const positions: number[] = [];
    const rows = 6;
    const cols = 20;
    let lastX = X0;
    let lastY = Y0;
    for (let r = 0; r < rows; r++) {
      const lineLength =
        r === rows - 1
          ? 4 + Math.floor(Math.random() * 3) // last line short: 4-6 chars
          : Math.max(2, Math.floor(cols * (0.2 + Math.random() * 0.8)));
      for (let c = 0; c < lineLength; c++) {
        const x = X0 + c * COL_STEP;
        const y = Y0 - r * ROW_STEP;
        positions.push(x, y, 0);
        lastX = x;
        lastY = y;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    // Cursor sits one column past the last dot of the last (short) line
    return {
      geometry: geo,
      endPoint: { x: Math.min(lastX + COL_STEP, CURSOR_MAX_X), y: lastY },
      total: positions.length / 3,
    };
  }, []);

  const TYPE_DURATION = 1.6;

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;

    // Reduced motion: render one static, fully-typed frame - no sway/blink
    if (!animate) {
      if (screenPoints.current) screenPoints.current.geometry.setDrawRange(0, total);
      if (cursor.current) {
        cursor.current.position.set(endPoint.x, endPoint.y, 0.13);
        (cursor.current.material as THREE.MeshBasicMaterial).opacity = 0.5;
      }
      return;
    }

    if (group.current) {
      const targetY = Math.sin(t * 0.4) * 0.1 + pointer.x * 0.1;
      const targetX = -0.05 + pointer.y * 0.07;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
      group.current.position.y = Math.sin(t * 0.8) * 0.03;
    }

    // Nothing shows until the terminal has scrolled into view
    if (!started) {
      if (screenPoints.current) screenPoints.current.geometry.setDrawRange(0, 0);
      if (cursor.current) {
        cursor.current.position.set(X0, Y0, 0.13);
        (cursor.current.material as THREE.MeshBasicMaterial).opacity = 0.95;
      }
      return;
    }

    // Type once
    if (typeStart.current === 0) typeStart.current = t;
    const progress = Math.min((t - typeStart.current) / TYPE_DURATION, 1);
    const revealed = Math.floor(progress * total);
    if (screenPoints.current) screenPoints.current.geometry.setDrawRange(0, revealed);

    // Cursor follows the head while typing, then parks and blinks at the end.
    // It shares the screen group's frame, so coords match the dots exactly.
    if (cursor.current) {
      const mat = cursor.current.material as THREE.MeshBasicMaterial;
      if (revealed < total) {
        const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
        const i = Math.min(revealed, total - 1);
        cursor.current.position.set(
          Math.min(positions.getX(i) + COL_STEP, CURSOR_MAX_X),
          positions.getY(i),
          0.02,
        );
        mat.opacity = 0.95;
      } else {
        cursor.current.position.set(endPoint.x, endPoint.y, 0.02);
        mat.opacity = Math.floor(t * 2.2) % 2 === 0 ? 0.95 : 0.05;
      }
    }
  });

  return (
    <group ref={group} scale={0.9}>
      <lineSegments geometry={parts.monitor.geo} material={parts.monitor.mat} position={[0, 0.7, 0]} />
      <lineSegments geometry={parts.bezel.geo} material={parts.bezel.mat} position={[0, 0.7, 0.115]} />
      {/* Screen: dots and cursor share one frame so they align exactly */}
      <group position={[0, 0.72, 0.13]}>
        <points ref={screenPoints} geometry={geometry}>
          <pointsMaterial color={TRACE} size={0.045} transparent opacity={0.85} />
        </points>
        <mesh ref={cursor} position={[X0, Y0, 0.02]}>
          <planeGeometry args={[0.09, 0.16]} />
          <meshBasicMaterial color={SIGNAL} transparent opacity={0.95} />
        </mesh>
      </group>
      <lineSegments geometry={parts.stand.geo} material={parts.stand.mat} position={[0, -0.85, 0]} />
      <lineSegments geometry={parts.base.geo} material={parts.base.mat} position={[0, -1.22, 0.1]} />
      <lineSegments
        geometry={parts.keyboard.geo}
        material={parts.keyboard.mat}
        position={[0, -1.22, 1.15]}
        rotation={[0.06, 0, 0]}
      />
      <mesh position={[1.55, -0.35, 0.13]}>
        <circleGeometry args={[0.035, 12]} />
        <meshBasicMaterial color={INK} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export default function TerminalObject({ active, onFailure }: { active: boolean; onFailure: () => void }) {
  const [started, setStarted] = useState(false);
  const { enabled } = useMotion();
  const animate = enabled && active;

  useEffect(() => {
    if (animate) setStarted(true);
  }, [animate]);

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0.2, 6.4], fov: 45 }}
        dpr={[1, 2]}
        frameloop={animate ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', onFailure, { once: true });
        }}
      >
        <Terminal animate={animate} started={started} />
      </Canvas>
    </div>
  );
}
