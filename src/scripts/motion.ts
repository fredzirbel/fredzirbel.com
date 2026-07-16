/**
 * Site-wide motion: Lenis smooth scrolling, GSAP scroll reveals, nav behavior.
 * Everything is gated on prefers-reduced-motion; without JS or with reduced
 * motion, all content is visible and the browser's native scroll is used.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// localStorage 'force-motion' = '1' opts back into full animation even when
// the OS requests reduced motion (useful for testing; also flips CSS
// animations back on via the html.force-motion class in global.css)
const forcedMotion = localStorage.getItem('force-motion') === '1';
if (forcedMotion) document.documentElement.classList.add('force-motion');
const reducedMotion =
  !forcedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('site-nav');
const navDelayed = nav?.dataset.delayed === 'true';

function updateNav(): void {
  if (!nav) return;
  nav.classList.toggle('nav-scrolled', window.scrollY > 24);
  if (navDelayed && !reducedMotion) {
    nav.classList.toggle('nav-hidden', window.scrollY < window.innerHeight * 0.5);
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

if (!reducedMotion) {
  gsap.registerPlugin(ScrollTrigger);

  // Lenis drives scrolling through GSAP's ticker so ScrollTrigger stays in sync
  const lenis = new Lenis();
  // Exposed for debugging and console experimentation
  (window as unknown as { __lenis: Lenis }).__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Same-page anchor links scroll smoothly, offset for the fixed nav
  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const url = new URL(link.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.querySelector<HTMLElement>(url.hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -64 });
      history.pushState(null, '', url.hash);
    });
  });

  // Hero entrance: staggered fade-up on load
  const heroItems = gsap.utils.toArray<HTMLElement>('[data-hero-item]');
  if (heroItems.length > 0) {
    gsap.from(heroItems, {
      opacity: 0,
      y: 16,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.08,
      delay: 0.1,
    });
  }

  // Scroll reveals: each section's children cascade in with a small fade-up.
  // Children of [data-reveal-stagger] containers are staggered individually.
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((section) => {
    const targets: Element[] = [];
    for (const child of Array.from(section.children)) {
      if (child.hasAttribute('data-reveal-stagger')) {
        targets.push(...Array.from(child.children));
      } else {
        targets.push(child);
      }
    }
    gsap.from(targets, {
      opacity: 0,
      y: 14,
      duration: 0.4,
      ease: 'power1.out',
      stagger: 0.06,
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        once: true,
      },
    });
  });
}
