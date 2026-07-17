'use client';

/**
 * Site-wide cinematic backdrop: a fullscreen WebGL2 quad running a
 * hand-written domain-warped fbm shader - slow volumetric flow in
 * void/trace hues with sparse signal highlights, gently mouse-reactive.
 *
 * Reduced motion renders exactly one frame (a static nebula).
 * Deferred init via load + setTimeout (never requestIdleCallback).
 */
import { useEffect, useRef } from 'react';
import { motionAllowed } from '@/lib/motion';

const FRAG = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_dim;
out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0) * 1.6;
  float t = u_time * 0.03;

  // Mouse warps the field locally
  vec2 m = u_mouse * vec2(u_res.x / u_res.y, 1.0) * 1.6;
  float md = length(p - m);
  p += 0.18 * normalize(p - m + 1e-4) * exp(-md * 2.2);

  // Domain-warped fbm
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 2.6 * q + vec2(1.7, 9.2) + t * 0.7),
                fbm(p + 2.6 * q + vec2(8.3, 2.8) - t * 0.4));
  float f = fbm(p + 2.4 * r);

  // Palette: void -> trace violet -> whisper of signal lime
  vec3 void_ = vec3(0.020, 0.020, 0.028);
  vec3 trace = vec3(0.478, 0.529, 1.000);
  vec3 signal = vec3(0.776, 1.000, 0.290);

  vec3 col = void_;
  col = mix(col, trace * 0.16, smoothstep(0.35, 0.85, f));
  col = mix(col, trace * 0.30, smoothstep(0.55, 0.95, length(q) * f));
  col = mix(col, signal * 0.22, smoothstep(0.78, 0.98, r.y * f) * 0.7);

  // Vignette and dim factor (blog pages run dimmer)
  float vig = 1.0 - 0.55 * length(uv - 0.5);
  col *= vig * u_dim;

  outColor = vec4(col, 1.0);
}`;

const VERT = /* glsl */ `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

interface Props {
  /** 1 on the homepage, lower on blog pages */
  dim?: number;
}

export default function ShaderBackground({ dim = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let disposed = false;
    let cleanupGl: (() => void) | undefined;

    const init = () => {
      if (disposed) return;
      const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
      if (!gl) return;

      const animate = motionAllowed();
      const dpr = Math.min(window.devicePixelRatio, 1.5);

      const compile = (type: number, src: string) => {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        return shader;
      };
      const program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      const loc = gl.getAttribLocation(program, 'a_pos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(program, 'u_res');
      const uTime = gl.getUniformLocation(program, 'u_time');
      const uMouse = gl.getUniformLocation(program, 'u_mouse');
      const uDim = gl.getUniformLocation(program, 'u_dim');

      let mouseX = 0.5;
      let mouseY = 0.5;
      let curX = 0.5;
      let curY = 0.5;
      const onMove = (e: PointerEvent) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = 1 - e.clientY / window.innerHeight;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      const resize = () => {
        canvas.width = Math.round(window.innerWidth * dpr);
        canvas.height = Math.round(window.innerHeight * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      resize();
      window.addEventListener('resize', resize);

      const start = performance.now();
      const draw = () => {
        curX += (mouseX - curX) * 0.05;
        curY += (mouseY - curY) * 0.05;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, (performance.now() - start) / 1000);
        gl.uniform2f(uMouse, curX, curY);
        gl.uniform1f(uDim, dim);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      if (!animate) {
        draw();
        window.addEventListener('resize', () => draw());
      } else {
        const loop = () => {
          if (disposed) return;
          if (!document.hidden) draw();
          raf = requestAnimationFrame(loop);
        };
        loop();
      }

      cleanupGl = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('resize', resize);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    };

    const timer = setTimeout(init, 200);
    return () => {
      disposed = true;
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      cleanupGl?.();
    };
  }, [dim]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full"
    />
  );
}
