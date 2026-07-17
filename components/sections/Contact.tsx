import Magnetic from '@/components/fx/Magnetic';
import BrandIcon from '@/components/sections/BrandIcon';

const year = new Date().getFullYear();

const links = [
  { href: 'mailto:fredzirbel@pm.me', label: 'fredzirbel@pm.me' },
  { href: 'https://github.com/fredzirbel', label: 'GitHub' },
  { href: 'https://linkedin.com/in/fredzirbel', label: 'LinkedIn' },
  { href: '/rss.xml', label: 'RSS' },
];

export default function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden px-6 pb-10 pt-24 md:px-12 md:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-full h-[60vmax] w-[90vmax] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-25"
        style={{
          background:
            'radial-gradient(circle, var(--color-signal) 0%, var(--color-trace) 30%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      <p className="mb-10 font-mono text-xs uppercase tracking-widest text-muted">
        <span className="text-signal">06</span> Contact
      </p>

      <Magnetic className="inline-block" strength={0.2}>
        <a
          href="mailto:fredzirbel@pm.me"
          className="text-outline group block font-display text-[clamp(3rem,12vw,11rem)] font-black uppercase leading-[0.9] tracking-tight transition-colors duration-(--duration-base) hover:text-signal hover:[-webkit-text-stroke-width:0px]"
          style={{ fontStretch: '120%' }}
        >
          Let&apos;s talk
        </a>
      </Magnetic>

      <div className="mt-16 flex flex-col justify-between gap-8 border-t border-line pt-8 md:flex-row md:items-center">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                rel={link.href.startsWith('http') ? 'noopener' : undefined}
                className="text-sm text-muted transition-colors duration-(--duration-fast) hover:text-signal"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="flex items-center gap-2 font-mono text-xs text-muted">
          <BrandIcon name="radar" className="size-3.5 opacity-60" />
          &copy; {year} Fred Zirbel &middot; Next.js on Cloudflare Pages
        </p>
      </div>
    </footer>
  );
}
