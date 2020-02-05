import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
	// browser-friendly UMD build
	{
		entry: 'index.js',
		dest: pkg.browser,
		format: 'umd',
		moduleName: 'progress-bar',
		plugins: [
  		resolve(),
  		commonjs(),
			babel({
				exclude: ['node_modules/**']
			})
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// the `targets` option which can specify `dest` and `format`)
	{
		entry: 'index.js',
		targets: [
			{ dest: pkg.main, format: 'cjs' },
			{ dest: pkg.module, format: 'es' }
		],
		plugins: [
  		resolve(),
  		commonjs(),
  		babel({
				exclude: ['node_modules/**']
			})
		]
	}
];