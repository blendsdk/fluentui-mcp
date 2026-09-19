import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Several suites build TypeScript programs with ts-morph, which is CPU
    // heavy. Under parallel execution those tests can starve each other, so
    // the default 5s timeout is too tight for the slower integration cases.
    testTimeout: 15000,
    include: ['src/__tests__/**/*.test.ts', 'scripts/**/tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/__tests__/**', 'src/types/**'],
    },
  },
});
