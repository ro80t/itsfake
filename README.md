# itsfake

Honeypot middleware for [Hono](https://hono.dev), [Next.js](https://nextjs.org), [Nuxt](https://nuxt.com), [SvelteKit](https://svelte.dev/docs/kit), [Astro](https://astro.build), [Express](https://expressjs.com), [Fastify](https://fastify.dev), [Elysia](https://elysiajs.com), and [TanStack Start](https://tanstack.com/start). Instead of a real 404, it serves fake-but-plausible secrets at paths attackers and scanners commonly probe — `.env`, `.git/config`, `.aws/credentials`, `wp-login.php`, `wp-admin`, `xmlrpc.php`, `phpinfo.php` — to waste their time and feed them bogus credentials.

## Install

```sh
npm install itsfake
pnpm add itsfake
yarn add itsfake
bun add itsfake
```

## Usage

### Hono

```ts
import { Hono } from "hono";
import { itsfake } from "itsfake/hono";

const app = new Hono();
app.use(itsfake());
```

### Next.js

```ts
// middleware.ts
import { itsfakeMiddleware } from "itsfake/next";

export const middleware = itsfakeMiddleware();
```

### Nuxt

```ts
// server/middleware/itsfake.ts
import { itsfakeMiddleware } from "itsfake/nuxt";

export default itsfakeMiddleware();
```

Nuxt's server layer (Nitro) runs on [h3](https://h3.unjs.io), so this registers an h3 event handler — Vue Router's `middleware/` directory only sees navigations within the app, not raw requests to paths like `/.env`.

### SvelteKit

```ts
// src/hooks.server.ts
import { itsfakeHandle } from "itsfake/sveltekit";

export const handle = itsfakeHandle();
```

### Astro

```ts
// src/middleware.ts
import { itsfakeMiddleware } from "itsfake/astro";

export const onRequest = itsfakeMiddleware();
```

### Express

```ts
import express from "express";
import { itsfake } from "itsfake/express";

const app = express();
app.use(itsfake());
```

### Fastify

```ts
import Fastify from "fastify";
import { itsfakeHook } from "itsfake/fastify";

const app = Fastify();
app.addHook("onRequest", itsfakeHook());
```

### Elysia

```ts
import { Elysia } from "elysia";
import { itsfakeHook } from "itsfake/elysia";

const app = new Elysia().onRequest(itsfakeHook());
```

### TanStack Start

```ts
// src/start.ts
import { createStart } from "@tanstack/react-start";
import { itsfakeMiddleware } from "itsfake/tanstack-start";

export const startInstance = createStart(() => ({
  requestMiddleware: [itsfakeMiddleware()],
}));
```

TanStack Start's `requestMiddleware` runs on every incoming request before
routing, unlike route `middleware` (which only runs for routes that already
matched), so it can trap scanner paths like `/.env` too.

### Remix / React Router

Remix (React Router v7+ framework mode) doesn't expose its own request-level
middleware — its `middleware` option only runs for routes that already
matched, which skips scanner paths like `/.env` entirely. Mount `itsfake/express`
(or the plain `itsfake/fastify`/`itsfake/hono` equivalent) on whatever server
adapter you deploy with, ahead of the Remix/React Router request handler.

### Options

`itsfake()` (Hono, Express), `itsfakeMiddleware()` (Next.js, Nuxt, Astro,
TanStack Start), and `itsfakeHandle()`/`itsfakeHook()` (SvelteKit, Fastify,
Elysia) all take the same options:

```ts
itsfake({
  // Override the default trap list.
  rules: [{ match: "/secret.txt", respond: () => ({ status: 200, body: "nope" }) }],
  // Called whenever a request matches a trap, e.g. to log the attacker.
  onTrap: ({ path }) => console.log("trapped:", path),
});
```

A `match` is a string (exact path, or `"prefix*"` for a prefix match) or a `RegExp` tested against the request pathname.

## API

| Export                                                                                          | Description                                                                    |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `itsfake(options?)` (`itsfake/hono`)                                                            | Hono middleware.                                                               |
| `itsfakeMiddleware(options?)` (`itsfake/next`)                                                  | Next.js middleware.                                                            |
| `itsfakeMiddleware(options?)` (`itsfake/nuxt`)                                                  | Nuxt (Nitro/h3) server middleware.                                             |
| `itsfakeHandle(options?)` (`itsfake/sveltekit`)                                                 | SvelteKit `handle` hook.                                                       |
| `itsfakeMiddleware(options?)` (`itsfake/astro`)                                                 | Astro middleware.                                                              |
| `itsfake(options?)` (`itsfake/express`)                                                         | Express middleware.                                                            |
| `itsfakeHook(options?)` (`itsfake/fastify`)                                                     | Fastify `onRequest` hook.                                                      |
| `itsfakeHook(options?)` (`itsfake/elysia`)                                                      | Elysia `onRequest` hook.                                                       |
| `itsfakeMiddleware(options?)` (`itsfake/tanstack-start`)                                        | TanStack Start request middleware.                                             |
| `DEFAULT_TRAP_RULES`                                                                            | The default `TrapRule[]` list used when `rules` isn't passed.                  |
| `findTrap(pathname, rules?)`                                                                    | Returns the first matching `TrapRule` for a path, or `null`.                   |
| `matchPath(pathname, pattern)`                                                                  | The matcher `findTrap` uses under the hood (string exact/prefix, or `RegExp`). |
| `fakeDotEnv()`, `fakeGitConfig()`, `fakeAwsCredentials()`, `fakeWpLoginPage()`, `fakePhpInfo()` | Individual fake-content generators, if you want to reuse them in custom rules. |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and the release process.

## License

MIT
