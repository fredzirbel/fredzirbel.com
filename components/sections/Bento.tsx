'use client';

/**
 * Numbers and credentials as a bento grid: count-up stats, education,
 * cert chips with contained watermarks, and a velocity-reactive tools
 * marquee that speeds up and skews with scroll.
 */
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import BrandIcon from '@/components/sections/BrandIcon';
import { gsap, motionAllowed, registerGsap, ScrollTrigger } from '@/lib/motion';

const stats = [
  { value: 2500, suffix: '+', label: 'environments defended' },
  { value: 9, suffix: '', label: 'SIEM & EDR/XDR platforms' },
  { value: 7, suffix: '', label: 'industry certifications' },
];

const certs = [
  { name: 'CompTIA SecurityX (CASP+)', org: 'comptia', href: null },
  { name: 'ISACA CISM', org: 'isaca', href: null },
  {
    name: 'CompTIA CySA+',
    org: 'comptia',
    href: 'https://www.credly.com/badges/169e383d-80ba-4a0a-b12b-b1cf447bac8e',
  },
  {
    name: 'CompTIA PenTest+',
    org: 'comptia',
    href: 'https://www.credly.com/badges/8ed7f32d-6a82-4aab-9079-8fec5bcef846/public_url',
  },
  {
    name: 'CompTIA Security+',
    org: 'comptia',
    href: 'https://www.credly.com/badges/9283e8db-5d15-40a4-af14-5b44b5fcc42c',
  },
  {
    name: 'CompTIA A+',
    org: 'comptia',
    href: 'https://www.credly.com/badges/c183d3cb-6f71-4313-abfd-2bae18629f53',
  },
  {
    name: 'ISC2 CC',
    org: 'isc2',
    href: 'https://www.credly.com/badges/bca3d97b-0a51-4905-9804-8aa872f78404/public_url',
  },
];

const tools = [
  { label: 'Microsoft Sentinel', icon: 'microsoft' },
  { label: 'Splunk', icon: 'splunk' },
  { label: 'Defender XDR', icon: 'microsoft' },
  { label: 'CrowdStrike Falcon', icon: 'bird' },
  { label: 'Cortex XDR', icon: 'paloalto' },
  { label: 'Cortex XSIAM', icon: 'paloalto' },
  { label: 'SentinelOne', icon: 'shield' },
  { label: 'Falcon Next-Gen SIEM', icon: 'bird' },
  { label: 'Sumo Logic', icon: 'sumologic' },
  { label: 'KQL', icon: 'microsoft' },
  { label: 'Python', icon: 'python' },
  { label: 'Azure', icon: 'microsoft' },
  { label: 'Entra ID', icon: 'microsoft' },
  { label: 'Wireshark', icon: 'wireshark' },
  { label: 'Nmap', icon: 'radar' },
];

export default function Bento() {
  const scope = useRef<HTMLElement>(null);
  const marqueeTrack = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (!motionAllowed()) return;
      registerGsap();

      // Count-up stats
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const obj = { n: 0 };
        gsap.to(obj, {
          n: target,
          duration: 1.2,
          ease: 'power2.out',
          snap: { n: 1 },
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = obj.n.toLocaleString('en-US');
          },
        });
      });

      // Tile reveals
      gsap.from('[data-tile]', {
        opacity: 0,
        y: 36,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.07,
        scrollTrigger: { trigger: scope.current, start: 'top 82%', once: true },
      });

      // Velocity-reactive marquee: speeds up and skews with scroll.
      // quickTo tweens touch only their own property, so the infinite
      // xPercent loop is never overwritten (overwrite:true here killed it).
      if (marqueeTrack.current) {
        const tween = gsap.to(marqueeTrack.current, {
          xPercent: -50,
          repeat: -1,
          ease: 'none',
          duration: 28,
        });
        const timeScaleTo = gsap.quickTo(tween, 'timeScale', {
          duration: 0.25,
          ease: 'power2.out',
        });
        const skewTo = gsap.quickTo(marqueeTrack.current, 'skewX', {
          duration: 0.3,
          ease: 'power2.out',
        });
        let settle: gsap.core.Tween | null = null;
        ScrollTrigger.create({
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            timeScaleTo(1 + gsap.utils.clamp(0, 3, Math.abs(velocity) / 900));
            skewTo(gsap.utils.clamp(-3, 3, velocity / 500));
            settle?.kill();
            settle = gsap.delayedCall(0.25, () => {
              timeScaleTo(1);
              skewTo(0);
            });
          },
        });
      }
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="credentials"
      className="mx-auto max-w-[1440px] scroll-mt-24 px-6 pb-8 pt-4 md:px-12 md:pb-10 md:pt-6"
    >
      <p className="mb-12 font-mono text-xl uppercase tracking-[0.2em] text-muted">
        <span className="mr-4 text-signal">04</span>Numbers &amp; credentials
      </p>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            data-tile
            className="rounded-xl border border-line bg-panel/70 p-7 transition-colors duration-(--duration-base) hover:border-signal/40"
          >
            <p className="font-display text-5xl font-black tracking-tight text-signal">
              <span data-count={stat.value}>0</span>
              {stat.suffix}
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted">
              {stat.label}
            </p>
          </div>
        ))}

        <div
          data-tile
          className="rounded-xl border border-line bg-panel/70 p-7 transition-colors duration-(--duration-base) hover:border-signal/40"
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Education
          </p>
          <p className="mt-3 text-sm">
            <span className="text-ink">M.S. Cybersecurity &amp; Information Assurance</span>
            <br />
            <span className="text-muted">Western Governors University</span>
          </p>
          <p className="mt-3 text-sm">
            <span className="text-ink">B.S. Information Systems</span>
            <br />
            <span className="text-muted">The University of Texas at Arlington</span>
          </p>
        </div>

        <div
          data-tile
          className="rounded-xl border border-line bg-panel/70 p-7 md:col-span-4"
        >
          <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-muted">
            Certifications
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {certs.map((cert) => {
              const inner = (
                <>
                  <BrandIcon
                    name={cert.org}
                    className="pointer-events-none absolute right-3 top-1/2 size-12 -translate-y-1/2 text-ink opacity-[0.08] transition-opacity duration-(--duration-base) group-hover:opacity-[0.16]"
                  />
                  <span className="relative block pr-14 font-mono text-xs">{cert.name}</span>
                </>
              );
              const cls =
                'group relative block overflow-hidden rounded-lg border border-line px-4 py-4 transition-colors duration-(--duration-fast)';
              return (
                <li key={cert.name}>
                  {cert.href ? (
                    <a
                      href={cert.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${cls} hover:border-signal/50 hover:text-signal`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={`${cls} text-muted`}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div
          data-tile
          className="relative overflow-hidden rounded-xl border border-line bg-panel/70 py-6 md:col-span-4"
          aria-label="Platforms and tools"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-void to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-void to-transparent"
          />
          <ul ref={marqueeTrack} className="flex w-max gap-16 pr-16">
            {[0, 1].map((copy) =>
              tools.map((tool) => (
                <li
                  key={`${copy}-${tool.label}`}
                  aria-hidden={copy === 1 ? 'true' : undefined}
                  className="flex items-center gap-3 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-muted"
                >
                  <BrandIcon name={tool.icon} className="size-4 shrink-0 opacity-70" />
                  {tool.label}
                </li>
              )),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

