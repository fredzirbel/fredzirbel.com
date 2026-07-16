/**
 * Hero particle network: drifting nodes connected by lines when close,
 * with gentle cursor repulsion. Loaded lazily on desktop only; the CSS
 * gradient behind the canvas is the fallback everywhere else.
 */
import {
  BufferAttribute,
  BufferGeometry,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three';

const NODE_COUNT = 90;
const BOUNDS = { x: 34, y: 18, z: 8 };
const LINK_DISTANCE = 5.5;
const MOUSE_RADIUS = 5;
const NODE_COLOR = 0x9dc2cc; // accent-bright
const LINK_COLOR = 0x62929e; // pacific cyan

interface ParticleOptions {
  /** When false, render the network once as a static backdrop (reduced motion) */
  animate: boolean;
}

export function initParticles({ animate }: ParticleOptions = { animate: true }): void {
  const container = document.getElementById('hero-canvas');
  if (!container || container.querySelector('canvas')) return;

  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  camera.position.z = 24;

  // Node positions and velocities
  const positions = new Float32Array(NODE_COUNT * 3);
  const velocities = new Float32Array(NODE_COUNT * 3);
  for (let i = 0; i < NODE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2 * BOUNDS.x;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * BOUNDS.y;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2 * BOUNDS.z;
    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
  }

  const pointsGeometry = new BufferGeometry();
  pointsGeometry.setAttribute('position', new BufferAttribute(positions, 3));
  const points = new Points(
    pointsGeometry,
    new PointsMaterial({ color: NODE_COLOR, size: 0.14, transparent: true, opacity: 0.85 }),
  );
  scene.add(points);

  // Preallocated line buffer: worst case every pair is connected
  const maxPairs = (NODE_COUNT * (NODE_COUNT - 1)) / 2;
  const linePositions = new Float32Array(maxPairs * 6);
  const lineGeometry = new BufferGeometry();
  lineGeometry.setAttribute('position', new BufferAttribute(linePositions, 3));
  const lines = new LineSegments(
    lineGeometry,
    new LineBasicMaterial({ color: LINK_COLOR, transparent: true, opacity: 0.22 }),
  );
  scene.add(lines);

  // Slowly tumbling wireframe icosahedron anchored to the right of the hero
  const ico = new Mesh(
    new IcosahedronGeometry(7, 1),
    new MeshBasicMaterial({ color: LINK_COLOR, wireframe: true, transparent: true, opacity: 0.16 }),
  );
  ico.position.set(15, 1, -6);
  scene.add(ico);
  const icoInner = new Mesh(
    new IcosahedronGeometry(3.4, 0),
    new MeshBasicMaterial({ color: NODE_COLOR, wireframe: true, transparent: true, opacity: 0.22 }),
  );
  icoInner.position.copy(ico.position);
  scene.add(icoInner);

  // Cursor position in world space (z = 0 plane) + NDC for camera parallax
  let mouseX = Infinity;
  let mouseY = Infinity;
  let parallaxX = 0;
  let parallaxY = 0;
  container.ownerDocument.addEventListener('pointermove', (event) => {
    const rect = container.getBoundingClientRect();
    if (event.clientY < rect.top || event.clientY > rect.bottom) {
      mouseX = Infinity;
      return;
    }
    const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    parallaxX = ndcX;
    parallaxY = ndcY;
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const halfW = halfH * camera.aspect;
    mouseX = ndcX * halfW;
    mouseY = ndcY * halfH;
  });

  let running = true;
  let inView = true;

  function step(): void {
    for (let i = 0; i < NODE_COUNT; i++) {
      const ix = i * 3;
      let x = positions[ix] + velocities[ix];
      let y = positions[ix + 1] + velocities[ix + 1];
      let z = positions[ix + 2] + velocities[ix + 2];

      // Gentle cursor repulsion
      const dxm = x - mouseX;
      const dym = y - mouseY;
      const distM = Math.hypot(dxm, dym);
      if (distM < MOUSE_RADIUS && distM > 0.001) {
        const push = ((MOUSE_RADIUS - distM) / MOUSE_RADIUS) * 0.03;
        x += (dxm / distM) * push;
        y += (dym / distM) * push;
      }

      // Bounce off bounds
      if (Math.abs(x) > BOUNDS.x) velocities[ix] *= -1;
      if (Math.abs(y) > BOUNDS.y) velocities[ix + 1] *= -1;
      if (Math.abs(z) > BOUNDS.z) velocities[ix + 2] *= -1;

      positions[ix] = x;
      positions[ix + 1] = y;
      positions[ix + 2] = z;
    }
    pointsGeometry.attributes.position.needsUpdate = true;

    // Rebuild line segments between close nodes
    let vertex = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < LINK_DISTANCE * LINK_DISTANCE) {
          linePositions.set(
            [
              positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
              positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
            ],
            vertex,
          );
          vertex += 6;
        }
      }
    }
    lineGeometry.setDrawRange(0, vertex / 3);
    lineGeometry.attributes.position.needsUpdate = true;

    // Tumble the icosahedra in opposite directions
    ico.rotation.x += 0.0012;
    ico.rotation.y += 0.0016;
    icoInner.rotation.x -= 0.002;
    icoInner.rotation.y -= 0.0014;

    // Gentle camera parallax toward the cursor
    camera.position.x += (parallaxX * 1.4 - camera.position.x) * 0.03;
    camera.position.y += (parallaxY * 0.9 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  function loop(): void {
    if (!running) return;
    if (inView && !document.hidden) step();
    requestAnimationFrame(loop);
  }

  if (animate) {
    loop();
    // Pause when the hero scrolls out of view
    new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    ).observe(container);
  } else {
    // Reduced motion: draw the network once as a static backdrop
    step();
  }

  window.addEventListener('resize', () => {
    const { clientWidth, clientHeight } = container;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
    if (!animate) step();
  });

  // Astro view transitions or page hide: stop cleanly
  window.addEventListener('pagehide', () => {
    running = false;
    renderer.dispose();
  });
}
