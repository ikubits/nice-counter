import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    {
      name: 'html-script-inject',
      transformIndexHtml(html) {
        if (command === 'serve') {
          return html;
        }
        return html;
      },
      closeBundle() {
        const files = ['nice-counter.es.js', 'nice-counter.cjs.js', 'nice-counter.iife.js'];
        files.forEach((file) => {
          const src = resolve(__dirname, `dist/${file}`);
          const dest = resolve(__dirname, `docs/${file}`);
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
          }
        });

        const htmlPath = resolve(__dirname, 'docs/index.html');
        if (htmlPath && fs.existsSync(htmlPath)) {
          let html = fs.readFileSync(htmlPath, 'utf8');
          html = html.replace('./src/js/main.js', './nice-counter.es.js');
          fs.writeFileSync(htmlPath, html, 'utf8');
        }
      },
    },
  ],
  base: './',
  root: '.',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: 'assets/demo.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
}));
