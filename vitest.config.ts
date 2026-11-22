import { defineConfig } from 'vitest/config';

// Every test spawns git and the CLI, which a busy machine slows well past the 5 s default.
export default defineConfig({
  test: { include: ['test/**/*.test.ts'], setupFiles: ['test/sandbox.ts'], testTimeout: 30_000 },
});
