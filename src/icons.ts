/**
 * Inline SVG inner-markup for brand and glyph icons, resolved at build time.
 * Official brand paths come from simple-icons (CC0); brands not available
 * there (trademark removals) get neutral glyphs instead - no hand-drawn
 * imitations of real logos.
 */
import {
  siComptia,
  siIsc2,
  siPaloaltonetworks,
  siPython,
  siSplunk,
  siSumologic,
  siWireshark,
} from 'simple-icons';

/** Filled icons (fill: currentColor) */
export const filledIcons: Record<string, string> = {
  splunk: `<path d="${siSplunk.path}"/>`,
  paloalto: `<path d="${siPaloaltonetworks.path}"/>`,
  sumologic: `<path d="${siSumologic.path}"/>`,
  python: `<path d="${siPython.path}"/>`,
  wireshark: `<path d="${siWireshark.path}"/>`,
  comptia: `<path d="${siComptia.path}"/>`,
  isc2: `<path d="${siIsc2.path}"/>`,
  // Microsoft's four squares - used for Sentinel, Defender, Azure, Entra, KQL
  microsoft: '<path d="M2 2h9.5v9.5H2zM12.5 2H22v9.5h-9.5zM2 12.5h9.5V22H2zM12.5 12.5H22V22h-9.5z"/>',
};

/** Stroked glyphs (stroke: currentColor, no fill) - Lucide-style neutrals */
export const strokedIcons: Record<string, string> = {
  // Falcon stand-in for CrowdStrike products
  bird: '<path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/>',
  // Shield for SentinelOne
  shield:
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  // Shield-check for ISACA
  shieldCheck:
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  // Scanner crosshair for Nmap
  radar:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/>',
};
