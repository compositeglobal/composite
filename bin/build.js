import * as esbuild from "esbuild";

await esbuild
  .build({
    entryPoints: ["src/index.js"],
    bundle: true,
    minify: true,
    watch: true,
    sourcemap: false,
    outdir: "dist/",
  })
  .catch(() => ProcessingInstruction.exit(1));
