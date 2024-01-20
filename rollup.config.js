import eslint from '@rollup/plugin-eslint';
import terser from '@rollup/plugin-terser';
import scss from 'rollup-plugin-scss';

const scssConfig = (prod = false) => ({
  include: ['/**/*.css', '/**/*.scss', '/**/*.sass'],
  // output: './dist/nice-counter.css',
  // sourceMap: !prod,
  output: false,
  outputStyle: prod ? 'compressed' : undefined,
  failOnError: true,
});

export default [
  {
    input: './src/js/main.js',
    output: {
      file: './dist/nice-counter.es.js',
      format: 'es',
    },
    plugins: [
      eslint(),
      scss(scssConfig()),
    ],
  },
  {
    input: './src/js/main.js',
    watch: {
      include: './src/**',
    },
    output: {
      file: './dist/nice-counter.es.min.js',
      format: 'es',
      plugins: [terser()],
    },
    plugins: [
      eslint(),
      scss(scssConfig(true)),
    ],
  },
];
