import { terser } from "rollup-plugin-terser";

export default {
  input: 'dist/esm/index.js',
  output: {
    file: './dist/index.min.js',
    name: 'StreamDisplay',
    format: 'iife',
  },
  plugins: [
    terser(),
  ]
}
