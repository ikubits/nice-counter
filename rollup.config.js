import eslint from '@rollup/plugin-eslint';
import terser from '@rollup/plugin-terser';
import scss from 'rollup-plugin-scss';

const inputFile = './src/js/main.js';
const outputFile = (suffix = '') => `./dist/nice-counter${suffix}.js`;

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
    input: inputFile,
    output: {
      file: outputFile('.es'),
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      eslint(),
      scss(scssConfig()),
    ],
  },
  {
    input: inputFile,
    watch: {
      include: './src/**',
    },
    output: {
      file: outputFile('.es.min'),
      format: 'es',
      plugins: [terser()],
    },
    plugins: [
      eslint(),
      scss(scssConfig(true)),
    ],
  },
  {
    input: inputFile,
    output: {
      file: outputFile('.iife'),
      format: 'iife',
      sourcemap: true,
    },
    plugins: [
      eslint(),
      scss(scssConfig()),
    ],
  },
  {
    input: inputFile,
    watch: {
      include: './src/**',
    },
    output: {
      file: outputFile('.iife.min'),
      format: 'iife',
      plugins: [terser()],
    },
    plugins: [
      eslint(),
      scss(scssConfig(true)),
    ],
  },
];
