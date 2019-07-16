import { terser } from "rollup-plugin-terser";
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  input: 'dist/esm/index.js',
  output: {
    file: './dist/index.js',
    name: 'StreamDisplay',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    sourcemaps(),
    terser(),
  ]
}
