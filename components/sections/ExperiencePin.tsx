'use client';

/**
 * Experience as a pinned horizontal journey (desktop + motion): the
 * section pins and scroll scrubs sideways through Critical Start roles,
 * ending on the platforms wall. Mobile and reduced motion get a plain
 * vertical stack of the same panels.
 */
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap, motionAllowed, registerGsap } from '@/lib/motion';

const roles = [
  {
    title: 'Principal Security Analyst',
    period: 'Jul 2026 - Present',
    bullets: [
      'Investigate and respond to phishing, malware, and identity-based intrusions across 2,500+ multi-tenant environments, triaging alerts from 30+ integrated security products',
      'Maintain a 16-minute average time to investigation (TTI) while working 300+ alerts monthly',
      'Execute remediation on live incidents - host isolations, credential resets, session revocations, email deletions, file quarantines - under a dual-authorization workflow',
      'Communicate directly with customer stakeholders during high-priority incidents on impact, remediation status, and response decisions',
      'Train and mentor L1 analysts on investigation workflows and escalation quality',
    ],
  },
  {
    title: 'Senior Security Analyst',
    period: 'Jul 2025 - Jul 2026',
    bullets: [
      'Performed log and endpoint-telemetry analysis with custom KQL, correlating URL clicks, downloads, identity activity, and process telemetry to reconstruct attacker actions',
      'Seconded and verified remediation actions initiated by principal analysts - confirming scope, target accuracy, and justification before execution',
      'Briefed customer stakeholders in 3-5 weekly high-priority incident calls with evidence-backed findings and attribution',
      'Detected and correlated cross-tenant phishing and malware campaigns from shared indicators for coordinated, multi-customer response',
      'Engineered 500+ suppression filters (KVP logic + regex), eliminating thousands of recurring false positives; daily pre-deployment quality gate',
    ],
  },
  {
    title: 'Security Analyst',
    period: 'Oct 2024 - Jul 2025',
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

export default function ExperiencePin() {
  const scope = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!motionAllowed() || !window.matchMedia('(min-width: 768px)').matches) return;
      registerGsap();
      const el = track.current;
      if (!el) return;

      const getDist = () => el.scrollWidth - window.innerWidth;
      // Panels are centered (h-screen track); the moment the section pins
      // (centered in the viewport), the next scroll drives the horizontal
      // scrub - no hold.
      gsap.to(el, {
        x: () => -getDist(),
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: scope.current,
          // Pin when the panels reach the vertical center of the screen
          start: 'center center',
          pin: true,
          // Default (fixed) pin: nesting a transform-pin with the track's
          // own x transform was causing the sub-pixel vibration. scrollbar-
          // gutter: stable already prevents the horizontal jump on pin.
          scrub: true,
          end: () => `+=${getDist()}`,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="experience"
      className="scroll-mt-24 overflow-hidden py-16"
    >
      <div
        ref={track}
        className="flex flex-col gap-10 px-6 md:w-max md:flex-row md:items-center md:gap-14 md:px-12 md:will-change-transform"
      >
        {/* Intro panel */}
        <div className="md:w-[38rem] md:shrink-0">
          <p className="mb-6 font-mono text-xl uppercase tracking-[0.2em] text-muted">
            <span className="mr-4 text-signal">03</span>Experience
          </p>
          <h2
            className="font-display text-[clamp(2.4rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-tight"
            style={{ fontStretch: '115%' }}
          >
            <a
              href="https://www.criticalstart.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Critical
              <br />
              Start
            </a>
          </h2>
          <p className="mt-6 max-w-sm text-muted">
            24/7 Managed Detection and Response - Plano, TX. Nearly two years,
            three roles, thousands of investigations.
          </p>
          <p
            aria-hidden="true"
            className="mt-10 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted/60 md:block"
          >
            Scroll &rarr;
          </p>
        </div>

        {/* Role panels */}
        {roles.map((role) => (
          <article
            key={role.title}
            className="rounded-xl border border-line bg-panel p-7 md:w-[34rem] md:shrink-0"
          >
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-xl font-bold">{role.title}</h3>
              <p className="font-mono text-xs text-signal">{role.period}</p>
            </div>
            <ul className="space-y-3 text-sm text-muted">
              {role.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span
                    className="mt-2 size-1 shrink-0 rounded-full bg-signal"
                    aria-hidden="true"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </article>
        ))}

        {/* Platforms wall */}
        <div className="md:w-[30rem] md:shrink-0">
          <p className="mb-6 font-mono text-sm uppercase tracking-[0.2em] text-muted">
            Daily platforms &amp; frameworks
          </p>
          <ul className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <li
                key={platform}
                className="rounded-full border border-line bg-panel/70 px-5 py-2.5 font-mono text-sm text-muted"
              >
                {platform}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
