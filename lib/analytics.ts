// Umami Cloud (https://umami.is): cookieless page views and click events.
// Keep the script and collect origins in sync with script-src and connect-src in public/_headers.
export const UMAMI_WEBSITE_ID = 'a472836d-d592-4703-ac10-b97e9702e0de';
export const UMAMI_SCRIPT = 'https://cloud.umami.is/script.js';
// cloud.umami.is/script.js POSTs (fetch) to this origin's /api/send by default.
export const UMAMI_COLLECT_ORIGIN = 'https://gateway.umami.is';
// data-domains: the tracker sends nothing on other hosts (previews, localhost).
export const ANALYTICS_HOSTS = ['fredzirbel.com', 'www.fredzirbel.com'];

/** Attributes that make the Umami tracker record a click event (https://docs.umami.is/docs/track-events). */
export function trackClick(event: string, label?: string) {
  return {
    'data-umami-event': event,
    ...(label ? { 'data-umami-event-label': label } : {}),
  };
}
