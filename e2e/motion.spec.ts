import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => console.error('[pageerror]', error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') console.error('[console]', message.text());
  });
});

test('recruiter essentials are discoverable from the first viewport', async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByText(/Security Analyst · Incident Response · Threat Detection/).first()).toBeVisible();
  await expect(page.getByText(/Dallas, TX/).first()).toBeInViewport();
  await expect(page.getByText(/No sponsorship required now or in the future/).first()).toBeInViewport();
  await expect(page.getByText(/Available to interview/).first()).toBeInViewport();
  await expect(page.getByText(/approximately six minutes per alert/).first()).toBeInViewport();
  await expect(page.getByRole('link', { name: 'View case studies' })).toHaveCount(0);
  const navResume = page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Resume', exact: true });
  await expect(navResume).toHaveAttribute('target', '_blank');
  const viewResume = page.getByRole('link', { name: 'View resume' });
  await expect(viewResume).toBeVisible();
  await expect(viewResume).toHaveAttribute('target', '_blank');
  await expect(page.getByRole('link', { name: 'Contact me' })).toBeVisible();
  const download = page.getByRole('link', { name: 'Download resume' });
  await expect(download).toHaveAttribute('href', '/fred-zirbel-resume.pdf');
  await expect(download).toHaveAttribute('download', '');
  const resume = await request.get('/fred-zirbel-resume.pdf');
  expect(resume.ok()).toBeTruthy();
  expect(resume.headers()['content-type']).toContain('application/pdf');
});

test('CISM is the first certification and keeps the shared card height', async ({ page }) => {
  await page.goto('/');
  const certifications = page.getByRole('list', { name: 'Certifications' });
  await certifications.scrollIntoViewIfNeeded();
  const cards = certifications.locator('li');
  await expect(cards.first()).toContainText('ISACA CISM');
  await expect(cards.first()).toContainText('IN PROGRESS');
  await expect(cards.first().locator('div')).toHaveClass(/border-signal/);
  const heights = await cards.evaluateAll((items) => items.slice(0, 2).map((item) => item.getBoundingClientRect().height));
  expect(Math.abs(heights[0] - heights[1])).toBeLessThanOrEqual(1);
});

test('normal system preference enables motion and explicit Reduced stops it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await page.getByRole('button', { name: 'Reduced' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.getByText('2,500+', { exact: true })).toBeVisible();
});

test('motion toggles preserve the shader context', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('preloaded', '1'));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const shader = page.getByTestId('shader-background');
  const supportsWebGL = await shader.evaluate((element) =>
    Boolean((element as HTMLCanvasElement).getContext('webgl2')),
  );
  test.skip(!supportsWebGL, 'WebGL2 is unavailable in this browser');

  await expect.poll(() => shader.evaluate((element) => {
    const gl = (element as HTMLCanvasElement).getContext('webgl2');
    return Boolean(gl?.getParameter(gl.CURRENT_PROGRAM));
  })).toBe(true);
  await expect(shader).toHaveClass(/opacity-100/);
  await page.getByRole('button', { name: 'Reduced', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await page.getByRole('button', { name: 'On', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await expect(shader).toHaveClass(/opacity-100/);
  await expect.poll(() => shader.evaluate((element) => {
    const gl = (element as HTMLCanvasElement).getContext('webgl2');
    return gl ? gl.isContextLost() : true;
  })).toBe(false);
});

test('selecting reduced motion during the preloader never traps the page', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.getByTestId('preloader')).toBeVisible();

  await page.evaluate(() => {
    localStorage.setItem('motion-preference', 'reduced');
    dispatchEvent(new StorageEvent('storage', {
      key: 'motion-preference',
      newValue: 'reduced',
      storageArea: localStorage,
    }));
  });

  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.getByTestId('preloader')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Fred Zirbel' })).toBeVisible();
});

test('reduced system preference exposes a persistent opt-in', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Enable motion' })).toBeVisible();
  await page.getByRole('button', { name: 'Enable motion' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('motion-preference'))).toBe('on');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
});

test('legacy force-motion setting migrates to On', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('force-motion', '1'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion-mode', 'on');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('force-motion'))).toBeNull();
});

test('mobile retains fallbacks without section WebGL canvases', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByTestId('wave-fallback')).toBeVisible();
  await expect(page.getByTestId('terminal-fallback')).toBeVisible();
  await expect(page.locator('[data-testid="wave-fallback"] canvas')).toHaveCount(0);
  await expect(page.locator('[data-testid="terminal-fallback"] canvas')).toHaveCount(0);
});

test('simulated WebGL failure never leaves decorative regions blank', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto('/');
  await expect(page.getByTestId('wave-fallback')).toBeVisible();
  await expect(page.getByTestId('terminal-fallback')).toBeVisible();
  await expect(page.getByTestId('shader-background')).toHaveClass(/opacity-0/);
});

test('healthy terminal canvas replaces rather than overlays its fallback', async ({ page }) => {
  await page.goto('/');
  const terminal = page.getByTestId('terminal-fallback');
  await terminal.scrollIntoViewIfNeeded();
  await expect(terminal.locator('canvas')).toHaveCount(1);
  await expect(terminal.locator('svg')).toHaveCount(0);
});

test('reduced experience is centered, responsive, and mobile-safe', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('motion-preference', 'reduced'));
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/');
  const layout = page.getByTestId('experience-static');
  await layout.scrollIntoViewIfNeeded();
  await expect(layout.locator('[data-experience-card]')).toHaveCount(3);

  const desktop = await layout.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const cards = [...element.querySelectorAll('[data-experience-card]')].map((card) =>
      card.getBoundingClientRect(),
    );
    return {
      layout: { left: bounds.left, right: bounds.right, width: bounds.width },
      cards: cards.map((card) => ({ left: card.left, top: card.top, width: card.width })),
    };
  });
  expect(desktop.layout.left).toBeGreaterThanOrEqual(70);
  expect(desktop.layout.right).toBeLessThanOrEqual(1530);
  expect(new Set(desktop.cards.map((card) => Math.round(card.left))).size).toBe(3);
  expect(Math.max(...desktop.cards.map((card) => card.left + card.width)) - Math.min(...desktop.cards.map((card) => card.left))).toBeGreaterThan(1200);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await page.evaluate(() => {
    const staticLayout = document.querySelector('[data-testid="experience-static"]');
    if (!staticLayout) throw new Error('Static experience layout not found');
    const bounds = staticLayout.getBoundingClientRect();
    const cardLefts = [...staticLayout.querySelectorAll('[data-experience-card]')].map(
      (card) => Math.round(card.getBoundingClientRect().left),
    );
    window.scrollTo({ left: 1000, top: window.scrollY, behavior: 'instant' });
    return {
      viewportWidth: document.documentElement.clientWidth,
      layoutLeft: bounds.left,
      layoutRight: bounds.right,
      horizontalScroll: window.scrollX,
      cardLefts,
    };
  });
  expect(mobile.layoutLeft).toBeGreaterThanOrEqual(0);
  expect(mobile.layoutRight).toBeLessThanOrEqual(mobile.viewportWidth);
  expect(mobile.horizontalScroll).toBe(0);
  expect(new Set(mobile.cardLefts).size).toBe(1);
});

test('blog discovery and indexing follow publication state', async ({ page }) => {
  await page.goto('/blog/');
  const empty = (await page.getByText('Coming soon', { exact: true }).count()) > 0;
  if (empty) await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await page.goto('/');
  const blogLink = page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Blog' });
  await expect(blogLink).toHaveCount(empty ? 0 : 1);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('serves final stats and readable content', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('2,500+', { exact: true })).toBeVisible();
    await expect(page.getByText('9', { exact: true })).toBeVisible();
    await expect(page.getByText('6', { exact: true })).toBeVisible();
    await expect(page.getByText('IN PROGRESS', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Fred Zirbel' })).toBeVisible();
  });
});
