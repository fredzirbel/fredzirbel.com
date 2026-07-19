'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotion } from '@/lib/motion';

const FRAG = `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_dim;
out vec4 outColor;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.0,a=0.5;mat2 r=mat2(0.8,0.6,-0.6,0.8);for(int i=0;i<5;i++){v+=a*noise(p);p=r*p*2.02;a*=0.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/u_res;vec2 p=uv*vec2(u_res.x/u_res.y,1.0)*1.6;float t=u_time*0.03;vec2 m=u_mouse*vec2(u_res.x/u_res.y,1.0)*1.6;float md=length(p-m);p+=0.18*normalize(p-m+1e-4)*exp(-md*2.2);vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));vec2 r=vec2(fbm(p+2.6*q+vec2(1.7,9.2)+t*.7),fbm(p+2.6*q+vec2(8.3,2.8)-t*.4));float f=fbm(p+2.4*r);vec3 c=vec3(.020,.020,.028);vec3 tr=vec3(.478,.529,1.0),si=vec3(.776,1.0,.290);c=mix(c,tr*.16,smoothstep(.35,.85,f));c=mix(c,tr*.30,smoothstep(.55,.95,length(q)*f));c=mix(c,si*.22,smoothstep(.78,.98,r.y*f)*.7);c*=(1.0-.55*length(uv-.5))*u_dim;outColor=vec4(c,1.0);}`;
const VERT = `#version 300 es
in vec2 a_pos;
void main(){gl_Position=vec4(a_pos,0.0,1.0);}`;

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

export default function ShaderBackground({ dim = 1 }: { dim?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const { enabled, ready } = useMotion();

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let raf = 0;
    let cleanup = () => {};
    setFailed(false);

    const timer = window.setTimeout(() => {
      if (disposed) return;
      const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
      if (!gl) {
        setFailed(true);
        return;
      }
      const vertex = makeShader(gl, gl.VERTEX_SHADER, VERT);
      const fragment = makeShader(gl, gl.FRAGMENT_SHADER, FRAG);
      const program = gl.createProgram();
      if (!vertex || !fragment || !program) {
        setFailed(true);
        return;
      }
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        setFailed(true);
        return;
      }
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'a_pos');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const uRes = gl.getUniformLocation(program, 'u_res');
      const uTime = gl.getUniformLocation(program, 'u_time');
      const uMouse = gl.getUniformLocation(program, 'u_mouse');
      const uDim = gl.getUniformLocation(program, 'u_dim');
      let mouseX = 0.5, mouseY = 0.5, currentX = 0.5, currentY = 0.5;
      const started = performance.now();
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const draw = () => {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, (performance.now() - started) / 1000);
        gl.uniform2f(uMouse, currentX, currentY);
        gl.uniform1f(uDim, dim);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      const resize = () => {
        canvas.width = Math.round(innerWidth * dpr);
        canvas.height = Math.round(innerHeight * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        if (!enabled) draw();
      };
      const move = (event: PointerEvent) => {
        mouseX = event.clientX / innerWidth;
        mouseY = 1 - event.clientY / innerHeight;
      };
      const loop = () => {
        if (disposed || document.hidden || !enabled) return;
        draw();
        raf = requestAnimationFrame(loop);
      };
      const visibility = () => {
        cancelAnimationFrame(raf);
        if (!document.hidden && enabled) loop();
      };
      const contextLost = (event: Event) => {
        event.preventDefault();
        cancelAnimationFrame(raf);
        setFailed(true);
      };
      resize();
      draw();
      addEventListener('resize', resize);
      addEventListener('pointermove', move, { passive: true });
      document.addEventListener('visibilitychange', visibility);
      canvas.addEventListener('webglcontextlost', contextLost);
      if (enabled && !document.hidden) loop();
      cleanup = () => {
        cancelAnimationFrame(raf);
        removeEventListener('resize', resize);
        removeEventListener('pointermove', move);
        document.removeEventListener('visibilitychange', visibility);
        canvas.removeEventListener('webglcontextlost', contextLost);
        gl.deleteProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }, 200);

    return () => {
      disposed = true;
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [dim, enabled, ready]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="shader-background"
      className={`fixed inset-0 z-0 h-full w-full transition-opacity ${failed ? 'opacity-0' : 'opacity-100'}`}
    />
  );
}
