import os from 'node:os';
import './test/sandbox';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  testMatch: '*.spec.ts',
  fullyParallel: true,
  // Each worker runs its own browser: more than 4 runs a laptop out of memory, more than the cores starves each page's timers.
  workers: Number(process.env['PLAYWRIGHT_WORKERS'] ?? Math.min(4, os.availableParallelism())),
  forbidOnly: !!process.env['CI'],
  reporter: 'list',
  use: { trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
});
