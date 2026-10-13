# itsfake

## 0.5.0

### Minor Changes

- [#14](https://github.com/ro80t/itsfake/pull/14) [`6fea4d1`](https://github.com/ro80t/itsfake/commit/6fea4d1fe774ff93dc7fd63bd7951b500d4488ff) Thanks [@ro80t](https://github.com/ro80t)! - Add a `raw` field to `TrapHit` passed to `onTrap`, exposing the underlying framework request object (the standard `Request` where a framework provides one — Hono, Elysia, Next.js, Astro, SvelteKit, TanStack Start — or the framework-native request/event otherwise — Express, Fastify, Nuxt/h3). `TrapHit` is now generic over this raw type.

## 0.4.1

### Patch Changes

- [#12](https://github.com/ro80t/itsfake/pull/12) [`db64763`](https://github.com/ro80t/itsfake/commit/db6476381a9a5bcefe5d1957b32bb606752ee369) Thanks [@ro80t](https://github.com/ro80t)! - Drop literal `https://` strings from the fake `.git/config` (now an SSH-style remote) and `wp-login.php` (dropped the wordpress.org link) output, to avoid tripping URL-fragment scanners on inert fake data.

## 0.4.0

### Minor Changes

- [#10](https://github.com/ro80t/itsfake/pull/10) [`89b3590`](https://github.com/ro80t/itsfake/commit/89b3590d629e7d14793eab25096c7bf2e9c6668e) Thanks [@ro80t](https://github.com/ro80t)! - Vary the fake `.env` content across Laravel/Node/Django flavors on each request, and widen the `.env` trap to also catch backup-style variants (`.env~`, `.env_old`, `.env-bak`) and nested paths (`/config/.env`).

- [#10](https://github.com/ro80t/itsfake/pull/10) [`8be3f4d`](https://github.com/ro80t/itsfake/commit/8be3f4d01710bcc2f455c5e5023247f54b535eca) Thanks [@ro80t](https://github.com/ro80t)! - Add traps for `.git/HEAD`, `.ssh/id_rsa`, Spring Boot Actuator `/actuator/env`, and phpMyAdmin/Adminer login pages.

## 0.3.0

### Minor Changes

- [#8](https://github.com/ro80t/itsfake/pull/8) [`e87b354`](https://github.com/ro80t/itsfake/commit/e87b354e5a540b434c269092db109ac9e387002e) Thanks [@ro80t](https://github.com/ro80t)! - Add Express (`itsfake/express`), Fastify (`itsfake/fastify`), and Elysia
  (`itsfake/elysia`) middleware that serve fake credentials/pages for
  commonly-scanned paths (`.env`, `wp-login.php`, ...) instead of a real 404.

- [#8](https://github.com/ro80t/itsfake/pull/8) [`e87b354`](https://github.com/ro80t/itsfake/commit/e87b354e5a540b434c269092db109ac9e387002e) Thanks [@ro80t](https://github.com/ro80t)! - Add TanStack Start request middleware (`itsfake/tanstack-start`) that
  serves fake credentials/pages for commonly-scanned paths (`.env`,
  `wp-login.php`, ...) instead of a real 404.

## 0.2.0

### Minor Changes

- [#4](https://github.com/ro80t/itsfake/pull/4) [`8ed7b70`](https://github.com/ro80t/itsfake/commit/8ed7b70b2dc7d64339800f6d3d2416fdf239bc5d) Thanks [@ro80t](https://github.com/ro80t)! - Add SvelteKit (`itsfake/sveltekit`) and Astro (`itsfake/astro`) middleware
  that serve fake credentials/pages for commonly-scanned paths (`.env`,
  `wp-login.php`, ...) instead of a real 404.

### Patch Changes

- [#6](https://github.com/ro80t/itsfake/pull/6) [`13ce2d2`](https://github.com/ro80t/itsfake/commit/13ce2d2d8f355fcbdbfe8079125085ced8eda85c) Thanks [@ro80t](https://github.com/ro80t)! - Widen the `h3` peer dependency to `^1 || ^2` so `itsfake/nuxt` works on
  Nuxt/Nitro setups that have upgraded to h3 v2, while still supporting v1.

## 0.1.0

### Minor Changes

- [`4872388`](https://github.com/ro80t/itsfake/commit/48723882d72b1dbe04adcc1ed697539a1be1e3c6) Thanks [@ro80t](https://github.com/ro80t)! - Add Nuxt server middleware via `itsfake/nuxt`, built on Nitro's h3 event
  handlers so it can trap paths (`.env`, `wp-login.php`, ...) that aren't
  real Vue Router routes.
