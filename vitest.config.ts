import { defineConfig } from 'vitest/config';

export default defineConfig({
  // `root` pins config discovery to this project so a Vitest config in a parent
  // directory (the shared Paperclip workspace) can't hijack the run.
  root: import.meta.dirname,
  test: {
    include: ['test/**/*.test.ts'],
  },
});
