import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const demoScript = `
    <script type="module">
      (function(){

        // ---- Counter with manual control ----

        const counterEl = document.getElementById('nice-counter');
        const toggleEl = document.getElementById('btn-toggle');
        const setEl = document.getElementById('btn-set');

        function onToggleClick() {
          counterEl.value = counterEl.value === null ? '' : null;
        }

        function onSetClick() {
          counterEl.value = '987-654-321.98';
        }

        toggleEl.addEventListener('click', onToggleClick);
        setEl.addEventListener('click', onSetClick);

        // ---- Typical count up counter ----

        const counterEnterEl = document.getElementById('nice-counter-enter');
        const enterEl = document.getElementById('btn-enter');
        const resetEl = document.getElementById('btn-reset');

        function onEnterClick() {
          counterEnterEl.value = null;
        }

        function onResetClick() {
          counterEnterEl.value = '';
        }

        enterEl.addEventListener('click', onEnterClick);
        resetEl.addEventListener('click', onResetClick);

        // ---- Duration control ----

        const durationRangeEl = document.getElementById('in-duration-range');
        const durationValueEl = document.getElementById('in-duration-value');

        function onRangeChange() {
          durationValueEl.value = durationRangeEl.value;
          updateDuration();
        }

        function onValueChange() {
          durationRangeEl.value = durationValueEl.value;
          updateDuration();
        }

        function updateDuration() {
          counterEl.duration = durationRangeEl.value;
          counterEnterEl.duration = durationRangeEl.value;
        }

        durationRangeEl.addEventListener('input', onRangeChange);
        durationValueEl.addEventListener('change', onValueChange);

        // ----

      })();
    </script>
`;

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    {
      name: 'html-script-inject',
      transformIndexHtml(html) {
        if (command === 'serve') {
          return html
            .replace('<!-- LIBRARY_SCRIPT -->', '<script type="module" src="../../src/js/main.js"></script>')
            .replace('<!-- DEMO_SCRIPT -->', demoScript);
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
          html = html
            .replace('<!-- LIBRARY_SCRIPT -->', '<script type="module" src="./nice-counter.es.js"></script>')
            .replace('<!-- DEMO_SCRIPT -->', demoScript);
          fs.writeFileSync(htmlPath, html, 'utf8');
        }
      },
    },
  ],
  base: './',
  root: 'src/docs',
  build: {
    outDir: '../../docs',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/docs/index.html'),
      output: {
        entryFileNames: 'assets/demo.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
}));
