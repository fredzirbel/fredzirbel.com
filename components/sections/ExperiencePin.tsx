'use client';

/**
 * Experience is a pinned horizontal journey on motion-enabled desktop.
 * Reduced motion and no-JavaScript rendering use an intentional responsive
 * editorial grid rather than inheriting the horizontal track's fixed widths.
 */
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap, registerGsap, useMotion } from '@/lib/motion';

const roles = [
  {
    title: 'Principal Security Analyst',
    period: 'Jul 2026–Present',
    bullets: [
      'Investigate and respond to phishing, malware, and identity-based intrusions across 2,500+ multi-tenant environments, triaging alerts from 30+ integrated security products',
      'Maintain a 16-minute average time to investigation (TTI) while working 300+ alerts monthly',
      'Execute remediation on live incidents—host isolations, credential resets, session revocations, email deletions, and file quarantines—under a dual-authorization workflow',
      'Communicate directly with customer stakeholders during high-priority incidents about impact, remediation status, and response decisions',
      'Train and mentor L1 analysts on investigation workflows and escalation quality',
    ],
  },
  {
    title: 'Senior Security Analyst',
    period: 'Jul 2025–Jul 2026',
    bullets: [
      'Performed log and endpoint-telemetry analysis with custom KQL, correlating URL clicks, downloads, identity activity, and process telemetry to reconstruct attacker actions',
      'Seconded and verified remediation actions initiated by principal analysts—confirming scope, target accuracy, and justification before execution',
      'Briefed customer stakeholders during three to five high-priority incident calls per week, providing evidence-backed findings and attribution',
      'Detected and correlated cross-tenant phishing and malware campaigns from shared indicators for coordinated, multi-customer response',
      'Engineered 500+ suppression filters (KVP logic and regex), eliminating thousands of recurring false positives, and conducted daily pre-deployment quality reviews',
    ],
  },
  {
    title: 'Security Analyst',
    period: 'Oct 2024–Jul 2025',
    bullets: [
      'Triaged and investigated identity threats, phishing, malware, and endpoint alerts across a large client base using Defender, Sentinel, CrowdStrike, and SentinelOne',
      'Developed custom KQL queries in Microsoft Sentinel and Defender to scope incidents across identity, endpoint, and email telemetry',
      'Produced client-ready escalations with accurate attribution and remediation guidance, supporting senior-led customer communications',
    ],
  },
];

const platforms = [
  'Microsoft Defender XDR',
  'Microsoft Sentinel',
  'CrowdStrike Falcon',
  'Cortex XDR',
  'SentinelOne',
  'Splunk ES',
  'Sumo Logic',
  'MITRE ATT&CK',
  'NIST SP 800-61',
];

type Role = (typeof roles)[number];

function ExperienceHeading({ showHint = false }: { showHint?: boolean }) {
  return (
    <div>
      <p className="mb-6 font-mono text-xl uppercase tracking-[0.2em] text-muted">
        <span className="mr-4 text-signal">03</span>Experience
      </p>
      <h2
        className="font-display text-[clamp(2.4rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-tight"
        style={{ fontStretch: '115%' }}
      >
        <a href="https://www.criticalstart.com" target="_blank" rel="noopener noreferrer">
          Critical
          <br />
          Start
        </a>
      </h2>
      {showHint && (
        <p aria-hidden="true" className="mt-10 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted/60 md:block">
          Scroll &rarr;
        </p>
      )}
    </div>
  );
}

function RoleCard({ role, className = '' }: { role: Role; className?: string }) {
  return (
    <article
      data-experience-card
      className={`rounded-xl border border-line bg-panel p-6 sm:p-7 ${className}`}
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-bold">{role.title}</h3>
        <p className="font-mono text-xs text-signal">{role.period}</p>
      </div>
      <ul className="space-y-3 text-sm text-muted">
        {role.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-signal" aria-hidden="true" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function PlatformList({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mb-6 font-mono text-sm uppercase tracking-[0.2em] text-muted">
        Daily platforms &amp; frameworks
      </p>
      <ul className="flex flex-wrap gap-2.5 sm:gap-3">
        {platforms.map((platform) => (
          <li
            key={platform}
            className="rounded-full border border-line bg-panel/70 px-4 py-2 font-mono text-xs text-muted sm:px-5 sm:py-2.5 sm:text-sm"
          >
            {platform}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ExperiencePin() {
  const scope = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { enabled } = useMotion();

  useGSAP(
    () => {
      if (!enabled || !window.matchMedia('(min-width: 768px)').matches) return;
      registerGsap();
      const element = track.current;
      const section = scope.current;
      if (!element || !section) return;

      const getDistance = () => Math.max(0, element.scrollWidth - window.innerWidth);
      const setHeight = () => {
        section.style.height = `${window.innerHeight + getDistance()}px`;
      };
      setHeight();

      gsap.to(element, {
        x: () => -getDistance(),
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: setHeight,
        },
      });
      return () => {
        section.style.height = '';
      };
    },
    { scope, dependencies: [enabled], revertOnUpdate: true },
  );

  return (
    <section
      ref={scope}
      id="experience"
      className={`scroll-mt-24 ${enabled ? 'py-16 md:py-0' : 'py-16 md:py-24'}`}
    >
      {enabled ? (
        <div className="md:sticky md:top-0 md:flex md:h-dvh md:items-center md:overflow-hidden">
          <div
            ref={track}
            className="flex flex-col gap-10 px-6 md:w-max md:flex-row md:items-center md:gap-14 md:px-12 md:will-change-transform"
          >
            <div className="md:w-[38rem] md:shrink-0">
              <ExperienceHeading showHint />
              <p className="mt-6 max-w-sm text-muted">
                24/7 Managed Detection and Response—Plano, TX. Nearly two years,
                three roles, thousands of investigations.
              </p>
            </div>
            {roles.map((role) => (
              <RoleCard key={role.title} role={role} className="md:w-[34rem] md:shrink-0" />
            ))}
            <PlatformList className="md:w-[30rem] md:shrink-0" />
          </div>
        </div>
      ) : (
        <div
          data-testid="experience-static"
          className="mx-auto w-full max-w-[1440px] px-6 md:px-12"
        >
          <div className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
            <ExperienceHeading />
            <p className="max-w-2xl text-base text-muted sm:text-lg lg:pb-1">
              24/7 Managed Detection and Response in Plano, TX. Nearly two years,
              three roles, and thousands of investigations across identity,
              endpoint, email, and cloud telemetry.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {roles.map((role, index) => (
              <RoleCard
                key={role.title}
                role={role}
                className={`h-full ${index === roles.length - 1 ? 'lg:col-span-2 xl:col-span-1' : ''}`}
              />
            ))}
          </div>

          <PlatformList className="mt-4 rounded-xl border border-line bg-panel/40 p-6 sm:p-8" />
        </div>
      )}
    </section>
  );
}
