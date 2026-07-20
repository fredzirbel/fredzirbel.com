import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Each page can own several WebGL contexts. Capping parallel pages prevents
  // Chromium from evicting healthy contexts under artificial test pressure.
  workers: 4,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node scripts/serve-static.mjs',
    url: 'http://127.0.0.1:3000',
    // Reusing this repository's static server is safe because it reads the
    // current out/ files on every request. CI still starts and owns its server.
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
