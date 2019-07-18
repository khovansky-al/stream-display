import { terser } from "rollup-plugin-terser";
import sourcemaps from 'rollup-plugin-sourcemaps';
import copy from 'rollup-plugin-copy'

export default {
  input: 'dist/esm/StreamDisplay.js',
  output: {
    file: './dist/stream-display.js',
    name: 'StreamDisplay',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    sourcemaps(),
    terser(),
    copy({
      targets: [{ src: 'dist/esm/*.d.ts', dest: 'dist/' }],
    }),
  ]
}
