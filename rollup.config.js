import eslint from '@rollup/plugin-eslint';
import terser from '@rollup/plugin-terser';
import scss from 'rollup-plugin-scss';

const name = 'niceCounter';
const watchPath = './src/**';
const inputFile = './src/js/main.js';
const outputFile = (suffix = '') => `./dist/nice-counter${suffix}.js`;

const getScssConfig = (prod = false) => ({
  include: ['/**/*.css', '/**/*.scss', '/**/*.sass'],
  // output: './dist/nice-counter.css',
  // sourceMap: !prod,
  output: false,
  outputStyle: prod ? 'compressed' : undefined,
  failOnError: true,
});

const getPlugins = (prod = false) => ([
  eslint(),
  scss(getScssConfig(prod)),
]);

export default [
  { format: 'es', suffix: '.es', prod: false },
  { format: 'es', suffix: '.es.min', prod: true },
  { format: 'cjs', suffix: '.cjs', prod: false },
  { format: 'cjs', suffix: '.cjs.min', prod: true },
  { format: 'iife', suffix: '.iife', prod: false },
  { format: 'iife', suffix: '.iife.min', prod: true },
].map((config) => ((config.prod === true) ? ({
  input: inputFile,
  output: {
    name,
    file: outputFile(config.suffix),
    format: config.format,
    plugins: [terser()],
  },
  plugins: getPlugins(true),
}) : ({
  input: inputFile,
  watch: {
    include: watchPath,
  },
  output: {
    name,
    file: outputFile(config.suffix),
    format: config.format,
    sourcemap: true,
  },
  plugins: getPlugins(),
})));
