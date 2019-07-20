import { terser } from "rollup-plugin-terser";
import sourcemaps from 'rollup-plugin-sourcemaps';
import copy from 'rollup-plugin-copy';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'dist/cjs/StreamDisplay.js',
  output: {
    file: './dist/stream-display.js',
    name: 'StreamDisplay',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    commonjs(),
    sourcemaps(),
    terser(),
    copy({
      targets: [{ src: 'dist/cjs/*.d.ts', dest: 'dist/' }],
    }),
  ]
}
