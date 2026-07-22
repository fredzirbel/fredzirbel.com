import BrandIcon from '@/components/sections/BrandIcon';
import { capabilityGroups, earnedCertifications } from '@/lib/portfolio';

export default function Bento() {
  return (
    <section id="credentials" className="mx-auto max-w-[1440px] scroll-mt-24 px-6 py-16 md:px-12">
      <p className="mb-12 font-mono text-xl uppercase tracking-[0.2em] text-muted"><span className="mr-4 text-signal">06</span>Credentials</p>
      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-xl border border-line bg-panel/70 p-7">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-bold">Earned certifications</h2>
            <span data-cert-count="6" className="font-mono text-xs text-signal">6 earned</span>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {earnedCertifications.map((cert) => {
              const content = <><BrandIcon name={cert.org} className="size-5 shrink-0 opacity-70" /><span>{cert.name}</span></>;
              const cls = 'flex items-center gap-3 rounded-lg border border-line px-4 py-3 font-mono text-xs';
              return <li key={cert.name}>{cert.href ? <a href={cert.href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:border-signal/50 hover:text-signal`}>{content}</a> : <div className={cls}>{content}</div>}</li>;
            })}
          </ul>
          <div className="mt-4 rounded-lg border border-signal/30 bg-signal/5 px-4 py-3">
            <p className="font-mono text-xs uppercase tracking-wider text-signal">In progress</p>
            <p className="mt-1 text-sm">ISACA CISM — In Progress</p>
          </div>
        </div>
        <div className="rounded-xl border border-line bg-panel/70 p-7">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Education</p>
          <p className="mt-4 text-sm"><span className="text-ink">M.S. Cybersecurity &amp; Information Assurance</span><br /><span className="text-muted">Western Governors University</span></p>
          <p className="mt-4 text-sm"><span className="text-ink">B.S. Information Systems</span><br /><span className="text-muted">The University of Texas at Arlington</span></p>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-panel/70">
        <div className="border-b border-line px-7 py-5"><h2 className="font-display text-2xl font-bold">Capability matrix</h2></div>
        <div className="grid md:grid-cols-3">
          {capabilityGroups.map((group) => (
            <div key={group.heading} className="border-b border-line p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-signal">{group.heading}</h3>
              <ul className="mt-5 space-y-2 text-sm text-muted">{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
