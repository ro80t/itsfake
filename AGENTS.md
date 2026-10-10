# Agent notes for itsfake

`itsfake` is honeypot middleware for Hono and Next.js: it serves fake
credentials/pages at commonly-scanned paths (`.env`, `wp-login.php`, ...)
instead of a real 404, to mislead attackers. See
[CONTRIBUTING.md](./CONTRIBUTING.md) for project layout, scripts, and the
release process.

## Commands

- `/preflight` — runs the full local CI-equivalent check (lint, format check,
  typecheck, test, build) before opening a PR.
