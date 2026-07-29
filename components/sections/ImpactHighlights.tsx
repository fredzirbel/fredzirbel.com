import { impactMetrics } from '@/lib/portfolio';

export default function ImpactHighlights() {
  return (
    <section id="impact" className="mx-auto max-w-[1440px] scroll-mt-24 px-6 py-16 md:px-12">
      <div className="pb-10">
        <div>
          <p className="font-mono text-xl uppercase tracking-[0.2em] text-muted">
            <span className="mr-4 text-signal">01</span>Impact
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[0.95] tracking-tight">
            Fast response. Durable signal.
          </h2>
        </div>
      </div>
      <div className="grid gap-10 border-y border-line py-10 md:grid-cols-3 md:gap-0">
        {impactMetrics.map((metric, index) => (
          <article key={metric.label} className={`relative md:px-8 ${index === 0 ? 'md:pl-0' : ''} ${index < impactMetrics.length - 1 ? 'md:border-r md:border-line' : 'md:pr-0'}`}>
            <span aria-hidden="true" className="mb-6 block h-px w-10 bg-signal" />
            <p className="font-display text-5xl font-black tracking-tight text-signal">{metric.value}</p>
            <h3 className="mt-3 text-base font-medium text-ink">{metric.label}</h3>
            <p className="mt-2 text-sm text-muted">{metric.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
