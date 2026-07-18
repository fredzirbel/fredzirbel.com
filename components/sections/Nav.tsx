'use client';

/**
 * Corner-anchored nav: FZ monogram top-left; live Plano time readout and
 * a minimal menu top-right. Hairline backdrop appears after scrolling.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { href: '/#about', label: 'About' },
  { href: '/#work', label: 'Projects' },
  { href: '/blog/', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
];

function useClock(): string {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'America/Chicago',
        }),
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Nav() {
  const pathname = usePathname();
  const time = useClock();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-(--duration-base) ${
        scrolled ? 'border-b border-line bg-void/70 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-12"
      >
        <Link
          href="/"
          aria-label="Fred Zirbel - home"
          className="font-display text-lg font-black tracking-tight transition-colors duration-(--duration-fast) hover:text-signal"
        >
          FZ
        </Link>
        <div className="flex items-center gap-8">
          <p
            className="hidden font-mono text-[11px] uppercase tracking-widest text-muted md:block"
            suppressHydrationWarning
          >
            Plano, TX {time && <span className="text-ink/80">{time}</span>} CST
          </p>
          <ul className="flex items-center gap-5 sm:gap-6">
            {links.map((link) => {
              const active = pathname.startsWith('/blog') && link.href === '/blog/';
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`text-sm transition-colors duration-(--duration-fast) hover:text-signal ${
                      active ? 'text-signal' : 'text-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
