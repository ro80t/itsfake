import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/frameworks/hono.ts",
    "src/frameworks/next.ts",
    "src/frameworks/nuxt.ts",
    "src/frameworks/sveltekit.ts",
    "src/frameworks/astro.ts",
    "src/frameworks/express.ts",
    "src/frameworks/fastify.ts",
    "src/frameworks/elysia.ts",
    "src/frameworks/tanstack-start.ts",
  ],
  dts: true,
  format: ["cjs", "esm"],
  outDir: "dist",
  clean: true,
});
