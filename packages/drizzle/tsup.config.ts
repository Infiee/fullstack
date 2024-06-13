import type { Options } from "tsup";

export const tsup: Options = {
  entry: ["src/*.ts"],
  format: ["cjs", "esm"],
  dts: true,
  // splitting: true,
  splitting: false,
  clean: true,
  outDir: "dist",
  // sourcemap: "inline",
  cjsInterop: true,
};
