'use client';

/**
 * Hero centerpiece: a GPU wave-field - ~18k points displaced by simplex
 * noise in a custom vertex shader, a dark ocean of signals rolling under
 * the headline. Mouse gently tilts the camera. Desktop only; a single
 * static frame under reduced motion.
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useMotion } from '@/lib/motion';

const VERT = /* glsl */ `
uniform float uTime;
varying float vElev;

// Simplex-ish value noise, cheap and smooth enough at this scale
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

void main() {
  vec3 pos = position;
  float t = uTime * 0.35;
  float n = noise(pos.xy * 0.35 + t * 0.4)
          + 0.5 * noise(pos.xy * 0.8 - t * 0.25)
          + 0.25 * noise(pos.xy * 1.9 + t * 0.6);
  pos.z += n * 1.6;
  vElev = n;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (2.6 + vElev * 1.4) * (14.0 / -mv.z);
}`;

const FRAG = /* glsl */ `
varying float vElev;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  if (dot(c, c) > 0.25) discard;
  vec3 trace = vec3(0.478, 0.529, 1.0);
  vec3 signal = vec3(0.776, 1.0, 0.290);
  vec3 col = mix(trace * 0.55, signal, smoothstep(0.9, 1.7, vElev));
  float alpha = 0.28 + 0.5 * smoothstep(0.7, 1.7, vElev);
  gl_FragColor = vec4(col, alpha);
}`;

function Field({ animate }: { animate: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const { invalidate } = useThree();

  const geometry = useMemo(() => {
    const cols = 180;
    const rows = 100;
    const positions = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        positions[i++] = (x / (cols - 1) - 0.5) * 44;
        positions[i++] = (y / (rows - 1) - 0.5) * 24;
        positions[i++] = 0;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useEffect(() => {
    if (!animate) invalidate();
  }, [animate, invalidate]);

  useFrame(({ clock, pointer }) => {
    if (material.current) material.current.uniforms.uTime.value = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += (pointer.x * 0.08 - group.current.rotation.y) * 0.04;
      group.current.rotation.x +=
        (-1.05 + pointer.y * 0.05 - group.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={group} rotation={[-1.05, 0, 0]} position={[0, -3.2, 0]}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={material}
          vertexShader={VERT}
          fragmentShader={FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uTime: { value: 0 } }}
        />
      </points>
    </group>
  );
}

export default function WaveField({ active, onFailure }: { active: boolean; onFailure: () => void }) {
  const { enabled } = useMotion();
  const animate = enabled && active;
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 2.2, 10], fov: 55 }}
        dpr={[1, 2]}
        frameloop={animate ? 'always' : 'demand'}
        gl={{ antialias: false, powerPreference: 'low-power' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', onFailure, { once: true });
        }}
      >
        <Field animate={animate} />
      </Canvas>
    </div>
  );
}
