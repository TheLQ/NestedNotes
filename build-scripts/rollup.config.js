// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript';

export default {
  entry: 'src/main.tsx',
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
    typescript({
      typescript: require('typescript')
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
  ]
}
