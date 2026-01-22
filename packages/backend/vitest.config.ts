import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    env: {
      JWT_SECRET: 'test-secret-key',
      JWT_EXPIRES_IN: '1h',
    },
  },
});
