// GoatCounter (https://www.goatcounter.com): cookieless page views and click events.
// Keep GOATCOUNTER_CODE in sync with the connect-src and img-src hosts in public/_headers.
export const GOATCOUNTER_CODE = 'fredzirbel';
export const GOATCOUNTER_ENDPOINT = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
// Pinned, immutable count.js with Subresource Integrity.
// Source: https://www.goatcounter.com/help/countjs-versions
export const GOATCOUNTER_SCRIPT = 'https://gc.zgo.at/count.v5.js';
export const GOATCOUNTER_INTEGRITY = 'sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYElFmeR6EmLP5bYeoRVQ';
// Only count on the production host so preview deploys and local builds stay out of the stats.
export const ANALYTICS_HOSTS = ['fredzirbel.com', 'www.fredzirbel.com'];

/** Attributes that make count.js record a click event (https://www.goatcounter.com/help/events). */
export function trackClick(event: string, title?: string) {
  return {
    'data-goatcounter-click': event,
    ...(title ? { 'data-goatcounter-title': title } : {}),
  };
}
