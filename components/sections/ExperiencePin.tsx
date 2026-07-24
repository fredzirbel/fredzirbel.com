import { roles } from '@/lib/portfolio';

export default function ExperiencePin() {
  return (
    <section id="experience" className="mx-auto max-w-[1440px] scroll-mt-24 px-6 py-16 md:px-12">
      <div className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="font-mono text-xl uppercase tracking-[0.2em] text-muted"><span className="mr-4 text-signal">03</span>Experience</p>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-tight">MDR progression</h2>
        </div>
        <p className="max-w-2xl text-muted">Three roles of increasing scope across identity, endpoint, email, and cloud investigations in a 24/7 managed detection and response environment.</p>
      </div>
      <div data-testid="experience-static" className="relative mt-8 border-l border-line pl-7 md:pl-10">
        {roles.map((role) => (
          <article key={role.title} data-experience-card className="relative border-b border-line py-8 first:pt-0">
            <span aria-hidden="true" className="absolute -left-[2.05rem] top-2 size-3 rounded-full border-2 border-void bg-signal md:-left-[2.82rem]" />
            <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
              <div>
                <h3 className="font-display text-2xl font-bold">{role.title}</h3>
                <p className="mt-1 font-mono text-xs text-signal">{role.period}</p>
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
