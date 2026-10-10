# Contributing

## Setup

```sh
bun install
```

## Project layout

- `src/rules.ts` — default trap list (`DEFAULT_TRAP_RULES`)
- `src/fakes.ts` — fake content generators (`.env`, `.git/config`, `.aws/credentials`, WordPress, phpinfo)
- `src/match.ts` — path matcher (`matchPath`)
- `src/core.ts` — framework-agnostic lookup (`findTrap`)
- `src/index.ts` — public entry point, re-exports the above
- `src/hono.ts` — `itsfake` Hono middleware, published as the `itsfake/hono` subpath
- `src/next.ts` — `itsfakeMiddleware` Next.js middleware, published as the `itsfake/next` subpath

## Scripts

```sh
bun run lint          # static analysis via oxlint
bun run format        # format code with oxfmt
bun run format:check  # check formatting only
bun run typecheck     # tsc --noEmit
bun run test           # run unit tests with vitest
bun run build          # build dist/ with tsdown
```

Run all of the above (as CI does, see `.github/workflows/ci.yml`) before opening a PR.

## Releasing

This repo uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs. Every PR that changes published behavior should include a changeset:

```sh
bunx changeset
```

Follow the prompts to describe the change and pick a semver bump (patch/minor/major).

Once merged to `main`, GitHub Actions (`.github/workflows/release.yml`) opens or updates a "Version Packages" PR. Merging that PR builds the package and publishes it to npm via Trusted Publishing (OIDC) — no manual `npm publish` or token is needed.
