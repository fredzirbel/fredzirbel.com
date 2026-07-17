import type { Metadata } from 'next';
import { Archivo, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import Cursor from '@/components/fx/Cursor';
import ShaderBackground from '@/components/fx/ShaderBackground';
import SmoothScroll from '@/components/fx/SmoothScroll';
import Nav from '@/components/sections/Nav';
import '@/styles/globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  axes: ['wdth'],
});
const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fredzirbel.com'),
  title: {
    default: 'Fred Zirbel',
    template: '%s - Fred Zirbel',
  },
  description:
    'Principal Security Analyst. Threat investigation, detection engineering, and security tooling - learning cybersecurity in the open.',
  openGraph: {
    siteName: 'Fred Zirbel',
    type: 'website',
  },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${grotesk.variable} ${jetbrains.variable}`}
    >
      <body className="grain">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:border focus:border-line focus:bg-panel focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <ShaderBackground />
        <Cursor />
        <SmoothScroll>
          <div className="relative z-10">
            <Nav />
            <main id="main">{children}</main>
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
