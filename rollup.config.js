import commonjs from "@rollup/plugin-commonjs";
import buble from "@rollup/plugin-buble";
import replace from "@rollup/plugin-replace";

export default {
  input: "src/assets/js/app.js",
  output: {
    file: "src/assets/bundle/bundle.js",
    format: "umd"
  },
  plugins: [
    commonjs(),
    buble({
      exclude: "node_modules/**"
    }),
    replace({
      exclude: "node_modules/**",
      ENV: JSON.stringify(process.env.NODE_ENV || "development")
    }),
  ]
};
