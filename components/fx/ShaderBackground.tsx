'use client';

/**
 * Site-wide cinematic backdrop: a fullscreen WebGL2 quad running a
 * hand-written domain-warped fbm shader. Motion preference changes pause or
 * resume the existing context; they must never destroy the canvas context.
 *
 * Reduced motion renders exactly one frame (a static nebula).
 */
import { useEffect, useRef, useState } from 'react';
import { useMotion } from '@/lib/motion';

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
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotation = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = rotation * p * 2.02;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0) * 1.6;
  float time = u_time * 0.03;

  // The pointer gently warps the field locally.
  vec2 mouse = u_mouse * vec2(u_res.x / u_res.y, 1.0) * 1.6;
  float mouseDistance = length(p - mouse);
  p += 0.18 * normalize(p - mouse + 1e-4) * exp(-mouseDistance * 2.2);

  // Domain-warped fractional Brownian motion creates the flowing nebula.
  vec2 q = vec2(fbm(p + time), fbm(p + vec2(5.2, 1.3) - time));
  vec2 r = vec2(
    fbm(p + 2.6 * q + vec2(1.7, 9.2) + time * 0.7),
    fbm(p + 2.6 * q + vec2(8.3, 2.8) - time * 0.4)
  );
  float field = fbm(p + 2.4 * r);

  // Palette: void -> trace violet -> a whisper of signal lime.
  vec3 voidColor = vec3(0.020, 0.020, 0.028);
  vec3 trace = vec3(0.478, 0.529, 1.000);
  vec3 signal = vec3(0.776, 1.000, 0.290);
  vec3 color = voidColor;
  color = mix(color, trace * 0.16, smoothstep(0.35, 0.85, field));
  color = mix(color, trace * 0.30, smoothstep(0.55, 0.95, length(q) * field));
  color = mix(color, signal * 0.22, smoothstep(0.78, 0.98, r.y * field) * 0.7);

  // Blog pages can dim the shader without changing the palette.
  float vignette = 1.0 - 0.55 * length(uv - 0.5);
  color *= vignette * u_dim;
  outColor = vec4(color, 1.0);
}`;

const VERT = /* glsl */ `#version 300 es
in vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

function makeShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface ShaderController {
  applyMotionPreference: () => void;
}

export default function ShaderBackground({ dim = 1 }: { dim?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ShaderController | null>(null);
  const [failed, setFailed] = useState(false);
  const [contextGeneration, setContextGeneration] = useState(0);
  const { enabled, ready } = useMotion();
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  // Preference changes only alter the animation loop. Recreating a WebGL
  // context here would turn a reversible accessibility setting into GPU churn.
  useEffect(() => {
    controllerRef.current?.applyMotionPreference();
  }, [enabled]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let running = false;
    let raf = 0;
    let cleanup = () => {};
    setFailed(false);

    const timer = window.setTimeout(() => {
      if (disposed) return;
      const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
      if (!gl || gl.isContextLost()) {
        setFailed(true);
        return;
      }

      const vertex = makeShader(gl, gl.VERTEX_SHADER, VERT);
      const fragment = makeShader(gl, gl.FRAGMENT_SHADER, FRAG);
      const program = gl.createProgram();
      const buffer = gl.createBuffer();
      if (!vertex || !fragment || !program || !buffer) {
        if (program) gl.deleteProgram(program);
        if (vertex) gl.deleteShader(vertex);
        if (fragment) gl.deleteShader(fragment);
        if (buffer) gl.deleteBuffer(buffer);
        setFailed(true);
        return;
      }

      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        gl.deleteBuffer(buffer);
        setFailed(true);
        return;
      }

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      const position = gl.getAttribLocation(program, 'a_pos');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(program, 'u_res');
      const uTime = gl.getUniformLocation(program, 'u_time');
      const uMouse = gl.getUniformLocation(program, 'u_mouse');
      const uDim = gl.getUniformLocation(program, 'u_dim');
      let mouseX = 0.5;
      let mouseY = 0.5;
      let currentX = 0.5;
      let currentY = 0.5;
      const started = performance.now();
      const dpr = Math.min(window.devicePixelRatio, 1.5);

      const draw = () => {
        if (disposed || gl.isContextLost()) return;
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, (performance.now() - started) / 1000);
        gl.uniform2f(uMouse, currentX, currentY);
        gl.uniform1f(uDim, dim);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      const loop = () => {
        if (disposed || document.hidden || !enabledRef.current || gl.isContextLost()) {
          running = false;
          return;
        }
        draw();
        raf = requestAnimationFrame(loop);
      };

      const start = () => {
        if (running || disposed || document.hidden || !enabledRef.current) return;
        running = true;
        loop();
      };

      const stop = (drawStaticFrame: boolean) => {
        running = false;
        cancelAnimationFrame(raf);
        if (drawStaticFrame) draw();
      };

      const applyMotionPreference = () => {
        if (enabledRef.current) start();
        else stop(true);
      };

      const resize = () => {
        canvas.width = Math.round(innerWidth * dpr);
        canvas.height = Math.round(innerHeight * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        draw();
      };

      const move = (event: PointerEvent) => {
        mouseX = event.clientX / innerWidth;
        mouseY = 1 - event.clientY / innerHeight;
      };

      const visibility = () => {
        if (document.hidden) stop(false);
        else applyMotionPreference();
      };

      const contextLost = (event: Event) => {
        event.preventDefault();
        stop(false);
        setFailed(true);
      };

      // A restored context has no GPU resources. Re-run initialization rather
      // than leaving the CSS fallback in place for the rest of the page view.
      const contextRestored = () => setContextGeneration((value) => value + 1);

      controllerRef.current = { applyMotionPreference };
      resize();
      addEventListener('resize', resize);
      addEventListener('pointermove', move, { passive: true });
      document.addEventListener('visibilitychange', visibility);
      canvas.addEventListener('webglcontextlost', contextLost);
      canvas.addEventListener('webglcontextrestored', contextRestored);
      applyMotionPreference();

      cleanup = () => {
        stop(false);
        controllerRef.current = null;
        removeEventListener('resize', resize);
        removeEventListener('pointermove', move);
        document.removeEventListener('visibilitychange', visibility);
        canvas.removeEventListener('webglcontextlost', contextLost);
        canvas.removeEventListener('webglcontextrestored', contextRestored);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
      };
    }, 200);

    return () => {
      disposed = true;
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [contextGeneration, dim, ready]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="shader-background"
      className={`fixed inset-0 z-0 h-full w-full transition-opacity ${failed ? 'opacity-0' : 'opacity-100'}`}
    />
  );
}
