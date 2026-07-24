import Magnetic from '@/components/fx/Magnetic';
import BrandIcon from '@/components/sections/BrandIcon';
import { MotionSelector } from '@/components/fx/MotionControls';

const year = new Date().getFullYear();

const baseLinks: { href: string; label: string; icon: string; download?: boolean }[] = [
  { href: 'mailto:me@fredzirbel.com', label: 'me@fredzirbel.com', icon: 'mail' },
  { href: 'https://github.com/fredzirbel', label: 'GitHub', icon: 'github' },
  { href: 'https://linkedin.com/in/fredzirbel', label: 'LinkedIn', icon: 'linkedin' },
  { href: '/fred-zirbel-resume.pdf', label: 'Download résumé', icon: 'file', download: true },
];

export default function Contact() {
  const links = [...baseLinks, { href: '/rss.xml', label: 'RSS', icon: 'rss' }];
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
          <span className="mr-4 text-signal">07</span>Contact
        </p>

        <Magnetic className="inline-block" strength={0.2}>
          <a
            href="mailto:me@fredzirbel.com"
            className="text-outline group block font-display text-[clamp(3rem,12vw,11rem)] font-black uppercase leading-[0.9] tracking-tight transition-colors duration-(--duration-base) hover:text-signal hover:[-webkit-text-stroke-width:0px]"
            style={{ fontStretch: '120%' }}
          >
            Let&apos;s talk
          </a>
        </Magnetic>

        <a
          href="/fred-zirbel-resume.pdf"
          download
          className="mt-8 inline-flex rounded-full border border-ink px-7 py-3 text-base font-medium text-ink transition-[border-color,color,transform] duration-(--duration-fast) hover:border-signal hover:text-signal active:scale-[0.97]"
        >
          Download resume
        </a>

        <div className="mt-16 flex flex-col justify-between gap-8 border-t border-line pt-8 md:flex-row md:items-center">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  download={link.download}
                  className="group inline-flex items-center gap-2.5 text-sm text-muted transition-colors duration-(--duration-fast) hover:text-signal"
                >
                  <BrandIcon
                    name={link.icon}
                    className="size-4 opacity-60 transition-opacity duration-(--duration-fast) group-hover:opacity-100"
                  />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
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
