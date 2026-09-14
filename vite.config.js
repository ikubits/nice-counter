import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    open: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/js/main.js'),
      name: 'niceCounter',
      fileName: (format) => `nice-counter.${format}.js`,
      formats: ['es', 'cjs', 'iife'],
    },
  },
});
