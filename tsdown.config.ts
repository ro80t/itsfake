import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/hono.ts",
    "src/next.ts",
    "src/nuxt.ts",
    "src/sveltekit.ts",
    "src/astro.ts",
    "src/express.ts",
    "src/fastify.ts",
    "src/elysia.ts",
    "src/tanstack-start.ts",
  ],
  dts: true,
  format: ["cjs", "esm"],
  outDir: "dist",
  clean: true,
});
