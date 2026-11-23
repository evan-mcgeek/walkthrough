import './test/sandbox';
import { defineConfig } from 'vitest/config';

// Every test and its hooks spawn git and the CLI, which a busy machine slows well past the 5 s and 10 s defaults.
export default defineConfig({
  test: { include: ['test/**/*.test.ts'], testTimeout: 30_000, hookTimeout: 30_000, maxWorkers: 4 },
});
