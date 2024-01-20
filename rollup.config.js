import terser from '@rollup/plugin-terser';
import scss from "rollup-plugin-scss";

const scssConfig = (prod = false) => ({
	include: ['/**/*.css', '/**/*.scss', '/**/*.sass'],
	// output: './dist/nice-counter.css',
	// sourceMap: !prod,
	output: false,
	outputStyle: prod ? 'compressed' : undefined,
	failOnError: true,
})

export default [
	{
		input: './src/main.js',
		output: {
			file: './dist/nice-counter.es.js',
			format: 'es',
		},
		plugins: [
			scss(scssConfig()),
		]
	},
	{
		input: './src/main.js',
		watch: {
			include: './src/**'
		},
		output: {
			file: './dist/nice-counter.es.min.js',
			format: 'es',
			plugins: [terser()],
		},
		plugins: [
			scss(scssConfig(true)),
		],
	},
];
