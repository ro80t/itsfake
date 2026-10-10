# itsfake

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
