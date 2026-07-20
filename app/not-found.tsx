import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-start justify-center px-6 md:px-12">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-signal">404</p>
      <h1
        className="font-display text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-none tracking-tight"
        style={{ fontStretch: '120%' }}
      >
        Nothing
        <br />
        detected
      </h1>
      <p className="mb-10 mt-6 max-w-md text-muted">
        This page doesn&apos;t exist. Is it a false positive, or has the link moved?
      </p>
      <Link
        href="/"
        className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-void transition-colors duration-(--duration-fast) hover:bg-signal"
      >
        Back home
      </Link>
    </div>
  );
}
