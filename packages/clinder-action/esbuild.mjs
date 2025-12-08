import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/main.mjs"],
  bundle: true,
  platform: "node",
  // actions/toolkit etc. are CJS
  format: "cjs",
  outfile: "dist/main.cjs",
});

await esbuild.build({
  entryPoints: ["src/post.mjs"],
  bundle: true,
  platform: "node",
  // actions/toolkit etc. are CJS
  format: "cjs",
  outfile: "dist/post.cjs",
});
