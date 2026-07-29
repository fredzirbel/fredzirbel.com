import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => console.error('[pageerror]', error.message));
  page.on('console', (message) => { if (message.type() === 'error') console.error('[console]', message.text()); });
  page.on('response', (response) => { if (response.status() >= 400) console.error('[response]', response.status(), response.url()); });
});

test('recruiter essentials are discoverable from the first viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page).toHaveTitle('Fred Zirbel | Security Operations & Incident Response');
  await expect(page.getByRole('heading', { name: /Fred Zirbel/ })).toBeVisible();
  await expect(page.getByText('Turn alerts into action', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Security Operations · Incident Response · Detection Engineering/).first()).toBeVisible();
  await expect(page.getByText(/Dallas, TX/).first()).toBeInViewport();
  await expect(page.getByText(/No sponsorship required/).first()).toBeInViewport();
  await expect(page.getByText(/Available to interview/).first()).toBeInViewport();
  await expect(page.getByRole('link', { name: 'View projects' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View resume' })).toHaveAttribute('target', '_blank');
  await expect(page.getByRole('link', { name: 'Contact me' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Writing' })).toHaveCount(0);
});

test('motion preference remains user-controlled and graphics degrade safely', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await page.getByRole('button', { name: 'Reduced', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  const wave = page.getByTestId('wave-fallback');
  await expect(wave.locator('canvas')).toHaveCount(0);
  await expect(wave.locator('svg')).toBeVisible();
  await expect(wave.locator('svg')).not.toHaveClass(/motion-active/);
  await page.getByRole('button', { name: 'On', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await expect(page.getByTestId('shader-background')).toBeAttached();
  await expect(page.getByTestId('cursor-glow')).toBeAttached();
  await page.mouse.move(120, 140);
  await page.mouse.move(280, 220, { steps: 4 });
  await expect.poll(async () => page.getByTestId('cursor-trail').locator('span').count()).toBeGreaterThan(0);
  await expect.poll(async () => page.getByTestId('cursor-glow').evaluate((element) => element.getAttribute('style'))).toContain('280px, 220px');
});

test('mobile uses accessible fallbacks without horizontal overflow', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('motion-preference', 'on'));
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  await expect(page.getByTestId('wave-fallback')).toBeVisible();
  await expect(page.locator('[data-testid="wave-fallback"] canvas')).toHaveCount(0);
  const nav = page.getByRole('navigation', { name: 'Main' });
  const kicker = page.getByText(/Security Operations · Incident Response · Detection Engineering/).first();
  const [navBox, kickerBox] = await Promise.all([nav.boundingBox(), kicker.boundingBox()]);
  expect(navBox).not.toBeNull();
  expect(kickerBox).not.toBeNull();
  expect(kickerBox!.y).toBeGreaterThanOrEqual(navBox!.y + navBox!.height);
  await expect(page.getByTestId('hero-content')).toHaveCSS('opacity', '1');
  await page.evaluate(() => window.scrollTo(0, 120));
  await expect(page.getByTestId('hero-content')).toHaveCSS('opacity', '1');
  await page.evaluate(() => window.scrollTo(0, Math.min(document.documentElement.scrollHeight - window.innerHeight, window.innerHeight * 0.75)));
  await expect.poll(async () => Number(await page.getByTestId('hero-content').evaluate((element) => getComputedStyle(element).opacity))).toBeLessThan(0.5);
  const metrics = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width);
  await expect(nav.getByRole('link', { name: 'Experience' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Projects' })).toBeHidden();
  await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Resume' }).first()).toBeVisible();
});

test('projects open GitHub and the resume remains reachable', async ({ page, request }) => {
  await page.goto('/');
  for (const project of ['SOC Box', 'SIGIL', 'HomeSOC']) {
    const link = page.getByRole('link', { name: `Open ${project} on GitHub in a new tab` });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('href', /^https:\/\/github\.com\/fredzirbel\//);
  }
  await page.getByRole('link', { name: 'Open SOC Box on GitHub in a new tab' }).hover();
  await expect(page.getByText('VIEW', { exact: true })).toHaveCount(0);
  await expect(page.locator('a[href^="/projects/"]')).toHaveCount(0);
  const resume = await request.get('/fred-zirbel-resume.pdf');
  expect(resume.ok()).toBeTruthy();
  expect(resume.headers()['content-type']).toContain('application/pdf');
});

test('experience precedes projects and contact links are promoted', async ({ page }) => {
  await page.goto('/');
  const employer = page.getByRole('link', { name: 'Critical Start' });
  await expect(employer).toHaveAttribute('href', 'https://www.criticalstart.com/');
  await expect(employer).toHaveAttribute('target', '_blank');
  const order = await page.evaluate(() => {
    const experience = document.querySelector('#experience');
    const projects = document.querySelector('#work');
    return experience && projects
      ? Boolean(experience.compareDocumentPosition(projects) & Node.DOCUMENT_POSITION_FOLLOWING)
      : false;
  });
  expect(order).toBeTruthy();
  const contact = page.locator('#contact');
  for (const label of ['me@fredzirbel.com', 'GitHub', 'LinkedIn']) {
    await expect(contact.getByRole('link', { name: label })).toBeVisible();
  }
  expect(await page.getByTestId('contact-links').getByRole('link').allTextContents()).toEqual(['me@fredzirbel.com', 'LinkedIn', 'GitHub']);
  await expect(contact.getByRole('link', { name: 'Download resume' })).toHaveCount(0);
  const navLabels = await page.getByRole('navigation', { name: 'Main' }).getByRole('link').allTextContents();
  expect(navLabels).toEqual(['FZ', 'Experience', 'Projects', 'Contact', 'Resume']);
});

test('simulated WebGL failure preserves decorative fallbacks', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto('/');
  await expect(page.getByTestId('wave-fallback')).toBeVisible();
  await expect(page.getByTestId('shader-background')).toHaveClass(/opacity-0/);
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
