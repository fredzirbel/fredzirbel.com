import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => console.error('[pageerror]', error.message));
  page.on('console', (message) => { if (message.type() === 'error') console.error('[console]', message.text()); });
  page.on('response', (response) => { if (response.status() >= 400) console.error('[response]', response.status(), response.url()); });
});

test('recruiter essentials are discoverable from the first viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Fred Zirbel/ })).toBeVisible();
  await expect(page.getByText(/Principal Security Analyst/).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'View case studies' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View résumé' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Writing' })).toBeVisible();
});

test('motion preference remains user-controlled and shader survives toggles', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await page.getByRole('button', { name: 'Reduced', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await page.getByRole('button', { name: 'On', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await expect(page.getByTestId('shader-background')).toBeAttached();
});

test('mobile uses accessible fallbacks without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByTestId('wave-fallback')).toBeVisible();
  const metrics = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width);
  await expect(page.getByRole('link', { name: 'Résumé' }).first()).toBeVisible();
});

test('case studies, synthetic article, and resume are reachable', async ({ page, request }) => {
  for (const slug of ['soc-box', 'sigil', 'homesoc']) {
    await page.goto(`/projects/${slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Security controls' })).toBeVisible();
  }
  await page.goto('/blog/reconstructing-a-synthetic-phishing-intrusion/');
  await expect(page.getByText(/Synthetic exercise/)).toBeVisible();
  const resume = await request.get('/fred-zirbel-resume.pdf');
  expect(resume.ok()).toBeTruthy();
  expect(resume.headers()['content-type']).toContain('application/pdf');
});

test('keyboard navigation exposes a visible skip link', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('serves final content and metrics', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('16 min', { exact: true })).toBeVisible();
    await expect(page.getByText('300+', { exact: true })).toBeVisible();
    await expect(page.getByText('500+', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Fred Zirbel/ })).toBeVisible();
    await expect(page.getByTestId('experience-static')).toBeVisible();
  });
});
