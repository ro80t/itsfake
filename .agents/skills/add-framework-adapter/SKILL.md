---
name: add-framework-adapter
description: Add support for a new web framework (e.g. Koa, NestJS, Remix server adapter, SolidStart) by creating a new middleware/hook file under src/frameworks/ and wiring it into the build, package exports, and docs. Use when the user wants itsfake to support another framework, or asks "why isn't there an itsfake/<framework>".
---

# Adding a framework adapter

Every supported framework gets its own thin adapter in `src/frameworks/` that
calls the framework-agnostic `findTrap` (`src/core.ts`) and wraps the result
in whatever response shape that framework expects. All nine existing
adapters (`hono.ts`, `next.ts`, `nuxt.ts`, `sveltekit.ts`, `astro.ts`,
`express.ts`, `fastify.ts`, `elysia.ts`, `tanstack-start.ts`) follow the same
shape — copy the closest existing one rather than writing from scratch.

## Steps

1. **Confirm the framework can see raw, unrouted requests.** itsfake only
   works if the framework offers a hook that runs for _every_ incoming
   request path, before/outside normal route matching — a true middleware,
   not a route-level guard. If it doesn't (see the Remix/React Router
   section in `README.md` for a framework that genuinely can't), don't add
   an adapter; document the limitation/workaround in the README instead, as
   Remix does.
2. **Write `src/frameworks/<name>.ts`**, modeled on the closest existing
   adapter (pick one with a similar request/response shape — e.g. Fastify's
   hook style is closer to Elysia's than to Hono's). It must export:
   - An `Itsfake<Name>Options` interface with `rules?: TrapRule[]` and
     `onTrap?: (hit: TrapHit) => void`, matching every other adapter's option
     shape exactly (consumers expect the same two options everywhere).
   - A middleware/hook factory function (name it the way that framework's
     ecosystem expects — `itsfake()`, `itsfakeMiddleware()`,
     `itsfakeHandle()`, `itsfakeHook()`, or a new verb if none fit) that:
     extracts the request pathname, calls `findTrap(path, rules)`, falls
     through to the real app when there's no match, and otherwise calls
     `options.onTrap?.(...)` and writes `rule.respond()`'s `status`/`headers`/
     `body` in that framework's response API.
   - A doc comment with an `@example` matching the README usage snippet.
3. **Write `src/frameworks/<name>.test.ts`**, covering the same four cases
   every adapter's test file covers (copy the closest one):
   - serves a fake response for a trapped path (e.g. `/.env`) instead of
     reaching the real handler,
   - falls through to a real route for an unmatched path,
   - calls `onTrap` with the matched path and rule,
   - honors a custom `rules` list (and that an unmatched default path, like
     `/.env`, now 404s through to the real app).
4. **Add the framework as a dependency**, in `package.json`:
   - `devDependencies`: pin a version for local dev/testing.
   - `peerDependencies`: a version range, matching the dependency's own
     major-version support policy.
   - `peerDependenciesMeta`: mark it `"optional": true` (itsfake supports
     many frameworks; no consumer should need all of them installed).
5. **Add the build entry** in `tsdown.config.ts`: `"src/frameworks/<name>.ts"`
   in the `entry` array.
6. **Add the package export** in `package.json`'s `exports` map:
   ```json
   "./<name>": {
     "import": "./dist/frameworks/<name>.mjs",
     "require": "./dist/frameworks/<name>.cjs",
     "types": "./dist/frameworks/<name>.d.mts"
   }
   ```
7. **Update docs**:
   - `README.md`: add the framework to the intro sentence's framework list,
     add a `### <Framework>` usage section (in rough popularity order, next
     to similar frameworks), add it to the "Options" paragraph's function-name
     grouping, and add a row to the API table.
   - `CONTRIBUTING.md`: add a bullet under `src/frameworks/` in the project
     layout list.
8. **Run the check**: `bun run lint && bun run typecheck && bun run test && bun run build`
   (or `/preflight`) — the build step matters here because it's the only way
   to confirm `tsdown`'s output filenames actually match the `exports` map
   entries you wrote in step 6.
9. **Add a changeset**: `bunx changeset` — a `minor` bump (new framework
   support is additive public API), e.g. "Add a Koa adapter (`itsfake/koa`)."

## Red flags — stop and ask instead of guessing

- The framework has no true request-level middleware hook (see step 1) —
  don't force an adapter onto a route-level guard; that silently fails to
  trap scanner paths, which defeats the point of itsfake.
- Two frameworks in this repo already share near-identical adapter code
  (e.g. two hook-style frameworks) — resist the urge to extract a shared
  helper unless a third near-identical case shows up; a one-off helper for
  two call sites is premature abstraction.
- The ask is for a non-JS/TS runtime (e.g. a Python/Go/Rust framework) — that
  is a different package/distribution model entirely, not a new file in this
  repo; raise it with the user rather than improvising.
