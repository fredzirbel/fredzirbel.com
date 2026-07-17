import { filledIcons, strokedIcons } from '@/lib/icons';

interface Props {
  name: string;
  className?: string;
}

/** Inline brand/glyph SVG resolved at build time. */
export default function BrandIcon({ name, className }: Props) {
  const filled = filledIcons[name];
  const stroked = strokedIcons[name];
  const markup = filled ?? stroked;
  if (!markup) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      {...(filled
        ? { fill: 'currentColor' }
        : {
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 1.75,
            strokeLinecap: 'round' as const,
            strokeLinejoin: 'round' as const,
          })}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
