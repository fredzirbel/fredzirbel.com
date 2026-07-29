import BrandIcon from '@/components/sections/BrandIcon';
import { MotionSelector } from '@/components/fx/MotionControls';

const year = new Date().getFullYear();

const contactLinks = [
  { href: 'mailto:me@fredzirbel.com', label: 'me@fredzirbel.com', icon: 'mail' },
  { href: 'https://linkedin.com/in/fredzirbel', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'https://github.com/fredzirbel', label: 'GitHub', icon: 'github' },
] as const;

export default function Contact({ hasPosts }: { hasPosts: boolean }) {
  return (
    <footer id="contact" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-full h-[60vmax] w-[90vmax] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-25"
        style={{
          background:
            'radial-gradient(circle, var(--color-signal) 0%, var(--color-trace) 30%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      <div className="relative mx-auto max-w-[1440px] px-6 py-16 md:px-12">
        <p className="mb-10 font-mono text-xl uppercase tracking-[0.2em] text-muted">
          <span className="mr-4 text-signal">{hasPosts ? '06' : '05'}</span>Contact
        </p>

        <div className="inline-block">
          <a
            href="mailto:me@fredzirbel.com"
            className="text-outline group block font-display text-[clamp(3rem,12vw,11rem)] font-black uppercase leading-[0.9] tracking-tight transition-colors duration-(--duration-base) hover:text-signal hover:[-webkit-text-stroke-width:0px]"
            style={{ fontStretch: '120%' }}
          >
            Let&apos;s talk
          </a>
        </div>

        <ul data-testid="contact-links" className="mt-10 grid border-y border-line sm:grid-cols-3">
          {contactLinks.map((link, index) => (
            <li key={link.label} className={index < contactLinks.length - 1 ? 'border-b border-line sm:border-b-0 sm:border-r sm:border-line' : ''}>
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`group flex items-center gap-4 py-6 text-lg text-ink transition-colors duration-(--duration-fast) hover:text-signal sm:text-xl ${index === 0 ? 'sm:pr-6' : 'sm:px-6'}`}
              >
                <BrandIcon
                  name={link.icon}
                  className="size-7 shrink-0 opacity-80 transition-opacity duration-(--duration-fast) group-hover:opacity-100"
                />
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-col justify-between gap-8 border-t border-line pt-8 md:flex-row md:items-center">
          {hasPosts ? (
            <a href="/rss.xml" className="inline-flex items-center gap-2.5 text-sm text-muted transition-colors duration-(--duration-fast) hover:text-signal">
              <BrandIcon name="rss" className="size-4 opacity-60" />
              RSS
            </a>
          ) : <span />}
          <div className="flex flex-col items-start gap-4 md:items-end">
            <MotionSelector />
            <p className="font-mono text-xs text-muted">
              {`© ${year} Fred Zirbel · Next.js on Cloudflare Pages`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
