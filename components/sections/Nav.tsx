'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Nav({ hasPosts }: { hasPosts: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const links = [
    { href: '/#experience', label: 'Experience', active: '/experience' },
    { href: '/#work', label: 'Projects', active: '/projects' },
    ...(hasPosts ? [{ href: '/blog/', label: 'Writing', active: '/blog' }] : []),
    { href: '/#contact', label: 'Contact', active: '/contact' },
    { href: '/fred-zirbel-resume.pdf', label: 'Resume', active: '/resume', external: true },
  ];
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors ${scrolled ? 'border-b border-line bg-void/80 backdrop-blur-md' : 'border-b border-transparent'}`}>
      <nav aria-label="Main" className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" aria-label="Fred Zirbel - home" className="font-display text-lg font-black tracking-tight hover:text-signal">FZ</Link>
        <ul className="flex items-center gap-4 sm:gap-6">
          {links.map((link) => <li key={link.href} className={link.label === 'Experience' ? 'hidden md:block' : ''}><Link prefetch={false} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined} aria-current={pathname.startsWith(link.active) ? 'page' : undefined} className={`text-xs transition-colors hover:text-signal sm:text-sm ${pathname.startsWith(link.active) ? 'text-signal' : 'text-muted'}`}>{link.label}</Link></li>)}
        </ul>
      </nav>
    </header>
  );
}
