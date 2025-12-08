import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/main.mjs"],
  bundle: true,
  platform: "node",
  // commander is CJS
  format: "cjs",
  outfile: "dist/main.cjs",
});
