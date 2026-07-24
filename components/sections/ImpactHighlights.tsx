import { impactMetrics, organizationScope } from '@/lib/portfolio';

export default function ImpactHighlights() {
  return (
    <section id="impact" className="mx-auto max-w-[1440px] scroll-mt-24 px-6 py-16 md:px-12">
      <div className="flex flex-col gap-5 border-b border-line pb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xl uppercase tracking-[0.2em] text-muted">
            <span className="mr-4 text-signal">01</span>Impact
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[0.95] tracking-tight">
            Fast response. Durable signal.
          </h2>
        </div>
        <p className="max-w-md text-sm text-muted">{organizationScope}. Organizational scope, not a personal adoption claim.</p>
      </div>
      <div className="grid gap-px border-b border-line bg-line md:grid-cols-3">
        {impactMetrics.map((metric) => (
          <article key={metric.label} className="bg-void py-9 md:px-7 first:md:pl-0 last:md:pr-0">
            <p className="font-display text-5xl font-black tracking-tight text-signal">{metric.value}</p>
            <h3 className="mt-3 text-base font-medium text-ink">{metric.label}</h3>
            <p className="mt-2 text-sm text-muted">{metric.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
