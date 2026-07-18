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
    period: 'Current',
    bullets: [
      'Investigate and respond to phishing, malware, and identity-based intrusion attempts across 2,500+ multi-tenant environments in an MDR operation',
      'Log and endpoint-telemetry analysis with custom KQL - correlating URL clicks, downloads, identity activity, and process telemetry to establish root cause',
      'Execute containment through EDR/XDR consoles: host isolation, account disablement, session termination',
      'Evidence-backed escalations with attribution and timeline; 3-5 weekly high-priority incident calls with stakeholders',
      'Detect cross-tenant phishing and malware campaigns from shared indicators for coordinated multi-customer response',
      'Engineer SOC detection content: 500+ suppression filters, escalation templates, daily quality gate on suppression and orchestration changes',
    ],
  },
  {
    title: 'Security Analyst',
    period: 'Oct 2024 - Jul 2025',
    bullets: [
      'Triaged 300+ monthly security alerts across a large multi-tenant client base: identity threats, phishing, malware, endpoint activity',
      'Developed KQL investigation queries in Microsoft Sentinel and Defender for root-cause analysis',
      'Client-ready escalations with accurate attribution; recognized during onboarding for escalation accuracy and consistency',
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

      const distance = () => el.scrollWidth - window.innerWidth;
      gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: scope.current,
          // Explicit start: the default ('top bottom') engaged the pin the
          // moment the section entered the viewport, causing a hard snap
          start: 'top top',
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="experience" className="scroll-mt-24 overflow-hidden py-24 md:py-0">
      <div
        ref={track}
        className="flex flex-col gap-10 px-6 md:h-screen md:w-max md:flex-row md:items-center md:gap-14 md:px-12"
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
            <a href="https://www.criticalstart.com" rel="noopener">
              Critical
              <br />
              Start
            </a>
          </h2>
          <p className="mt-6 max-w-sm text-muted">
            24/7 Managed Detection and Response - Plano, TX. Two years, three
            roles, thousands of investigations.
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
            className="rounded-xl border border-line bg-panel/70 p-7 backdrop-blur-sm md:w-[34rem] md:shrink-0"
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
