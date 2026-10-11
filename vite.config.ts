import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    // page-flip's "main" is a UMD bundle; use its ES module build instead.
    alias: {
      'page-flip': fileURLToPath(new URL('./node_modules/page-flip/dist/js/page-flip.module.js', import.meta.url)),
    },
  },
});
