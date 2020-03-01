import commonjs from "@rollup/plugin-commonjs";
import buble from "@rollup/plugin-buble";
import replace from "@rollup/plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

export default {
  input: "src/app.js",
  output: {
    dir: "dist",
    format: "iife"
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
    process.env.NODE_ENV === "production" && uglify(),
    process.env.NODE_ENV !== "production" &&
      serve({
        open: true,
        openPage: "/",
        verbose: true,
        contentBase: ["dist"], // Path to fallback page
        port: 3333
      }),
    process.env.NODE_ENV !== "production" && livereload("dist")
  ]
};
