import './test/sandbox';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  testMatch: '*.spec.ts',
  fullyParallel: true,
  // Each worker runs its own browser, so the default of half the cores runs a laptop out of memory.
  workers: Number(process.env['PLAYWRIGHT_WORKERS'] ?? 4),
  forbidOnly: !!process.env['CI'],
  reporter: 'list',
  use: { trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
});
