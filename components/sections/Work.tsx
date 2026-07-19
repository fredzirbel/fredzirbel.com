'use client';

/**
 * Selected work as full-bleed rows: oversized index, display-type name,
 * a signal-tinted panel sliding in on hover, cursor label "VIEW".
 */
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap, motionAllowed, registerGsap } from '@/lib/motion';

const projects = [
  {
    name: 'SOC Box',
    subtitle: "The SOC Analyst's Toolbox",
    href: 'https://github.com/fredzirbel/SOCBox',
    description:
      'Containerized toolbox that detonates suspicious URLs across 8 concurrent security analyzers, enriches IPs across OSINT sources, and generates Defender XDR/Sentinel KQL hunting queries from any indicator.',
    tags: ['Python', 'Docker', 'Threat Intel', 'KQL'],
  },
  {
    name: 'SIGIL',
    subtitle: 'Detection-as-Code for Sigma rules',
    href: 'https://github.com/fredzirbel/SIGIL',
    description:
      'Validates Sigma rules, converts them to Splunk SPL and Sentinel KQL, tests detections against sample logs, and maps ATT&CK coverage gaps through an interactive dashboard with CI/CD integration.',
    tags: ['Python', 'Sigma', 'MITRE ATT&CK', 'CI/CD'],
  },
  {
    name: 'HomeSOC',
    subtitle: 'Live homelab detection engineering',
    href: 'https://github.com/fredzirbel/homesoc-platform',
    description:
      'Proxmox-deployed platform ingesting OPNsense and Proxmox telemetry into OpenSearch, running ATT&CK-mapped detections with tuned Discord alerting for personal triage.',
    tags: ['OpenSearch', 'Proxmox', 'OPNsense', 'Detection'],
  },
];

export default function Work() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionAllowed()) return;
      registerGsap();
      gsap.utils.toArray<HTMLElement>('[data-row]').forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 44,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 88%', once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="work"
      className="scroll-mt-24 py-16"
    >
      <p className="mx-auto mb-12 w-full max-w-[1440px] px-6 font-mono text-xl uppercase tracking-[0.2em] text-muted md:px-12">
        <span className="mr-4 text-signal">02</span>Projects
      </p>

      <div className="border-t border-line">
        {projects.map((project, i) => (
          <a
            key={project.name}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            data-row
            data-cursor="view"
            className="group relative block overflow-hidden border-b border-line px-6 py-12 transition-colors duration-(--duration-base) hover:bg-panel/60 md:px-12 md:py-16"
          >
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-1/3 translate-x-full bg-linear-to-l from-signal/10 to-transparent transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:translate-x-0"
            />
            <div className="relative mx-auto flex max-w-[1440px] flex-col gap-6 md:flex-row md:items-baseline md:gap-12">
              <span className="font-mono text-sm text-muted/60">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <h3
                  className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-black uppercase leading-none tracking-tight transition-colors duration-(--duration-base) group-hover:text-signal"
                  style={{ fontStretch: '115%' }}
                >
                  {project.name}
                </h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
                  {project.subtitle}
                </p>
                <p className="mt-5 max-w-2xl text-sm text-muted">{project.description}</p>
              </div>
              <ul className="flex shrink-0 flex-wrap gap-2.5 md:max-w-56 md:justify-end">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-line px-4 py-1.5 font-mono text-sm uppercase tracking-wider text-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
