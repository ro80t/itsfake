import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/hono.ts", "src/next.ts", "src/nuxt.ts"],
  dts: true,
  format: ["cjs", "esm"],
  outDir: "dist",
  clean: true,
});
