// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    logHeapUsage: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ Alias igual que en vite.config.ts
    },
  },
});
