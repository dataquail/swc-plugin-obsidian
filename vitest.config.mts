/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths({ root: __dirname })],
  test: {
    globals: true,
    environment: 'jsdom',
    // setupFiles: './jest.setup-after-env.js',
    include: ['src/**/*.test.ts'],
  },
});
