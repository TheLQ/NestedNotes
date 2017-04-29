// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'

export default {
  entry: 'src/main.jsx',
  sourceMap: true,
  format: 'iife',
  dest: 'build/bundle.js',
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      browser: true,
      //   extensions: [ '.js', '.json' ],
        preferBuiltins: false
    }),
    commonjs({
      include: 'node_modules/**',
      sourceMap: true,
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['es2015', { modules: false }], 'stage-0', 'react'],
      plugins: ['external-helpers']
    }),
  ]
}
