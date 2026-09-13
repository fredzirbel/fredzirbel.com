import { roles } from '@/lib/portfolio';

export default function ExperiencePin() {
  return (
    <section id="experience" className="mx-auto max-w-[1440px] scroll-mt-10 px-6 py-16 md:px-12">
      <div className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="font-mono text-xl uppercase tracking-[0.2em] text-muted"><span className="mr-4 text-ink">01</span>Experience</p>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-tight">
            <a href="https://www.criticalstart.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-trace">
              Critical Start
            </a>
          </h2>
        </div>
        <p className="max-w-2xl text-muted">Promoted from Security Analyst to Principal Security Analyst through three roles of increasing scope in investigations, customer response, detection tuning, remediation, and analyst mentorship.</p>
      </div>
      <div data-testid="experience-static" className="relative mt-8 border-l border-line pl-7 md:pl-10">
        {roles.map((role) => (
          <article key={role.title} data-experience-card className="border-b border-line py-8 first:pt-0">
            <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
              <div className="relative">
                <span aria-hidden="true" className="absolute -left-[2.16rem] top-[0.625rem] size-3 rounded-full border-2 border-void bg-signal md:-left-[2.9rem]" />
                <h3 className="font-display text-2xl font-bold">{role.title}</h3>
                <p className="mt-1 font-mono text-xs text-trace">{role.period}</p>
              </div>
              <ul className="space-y-3 text-sm text-muted">
                {role.bullets.map((bullet) => <li key={bullet} className="flex gap-3"><span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-signal" /><span>{bullet}</span></li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
