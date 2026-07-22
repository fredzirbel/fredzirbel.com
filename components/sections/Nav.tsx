'use client';

/**
 * Corner-anchored nav: FZ monogram top-left; a minimal menu top-right.
 * Hairline backdrop appears after scrolling.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const baseLinks = [
  { href: '/#about', label: 'About' },
  { href: '/#work', label: 'Projects' },
  { href: '/fred-zirbel-resume.pdf', label: 'Resume' },
  { href: '/#contact', label: 'Contact' },
];

export default function Nav({ hasPosts }: { hasPosts: boolean }) {
  const pathname = usePathname();
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
        <ul className="flex items-center gap-4 sm:gap-6">
          {[
            ...baseLinks.slice(0, 2),
            ...(hasPosts ? [{ href: '/blog/', label: 'Blog' }] : []),
            ...baseLinks.slice(2),
          ].map((link) => {
            const active = pathname.startsWith('/blog') && link.href === '/blog/';
            const className = `text-sm transition-colors duration-(--duration-fast) hover:text-signal ${
              active ? 'text-signal' : 'text-muted'
            }`;
            return (
              <li key={link.href}>
                {link.href.endsWith('.pdf') ? (
                  <a href={link.href} className={className}>{link.label}</a>
                ) : (
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={className}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
