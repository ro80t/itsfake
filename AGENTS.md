# Agent notes for itsfake

`itsfake` is honeypot middleware for Hono and Next.js: it serves fake
credentials/pages at commonly-scanned paths (`.env`, `wp-login.php`, ...)
instead of a real 404, to mislead attackers. See
[CONTRIBUTING.md](./CONTRIBUTING.md) for project layout, scripts, and the
release process.

## Skills

- [`add-trap-rule`](.agents/skills/add-trap-rule/SKILL.md) — adding a new
  honeypot trap (path + fake response) to `src/rules.ts` / `src/fakes.ts`.
  This is the most common recurring change in this repo; use it whenever a
  task involves covering another commonly-scanned path.

## Commands

- `/preflight` — runs the full local CI-equivalent check (lint, format check,
  typecheck, test, build) before opening a PR.
- `/auto-commit-push` — commits and pushes the current working-tree changes.
- `/open-pr` — commits on a new branch, pushes it, and opens a pull request.

## Git policy

**Never run `git commit`, `git push`, or create a pull request on your own
initiative** — not after finishing a change, not because "the work is
done," not even if asked to commit in an earlier turn of the same
conversation. Only do so when the user invokes the `/auto-commit-push` or
`/open-pr` command in that turn. Any other request to save or publish work
("commit this", "push it up", "open a PR") should go through one of those
two commands rather than running `git commit`/`git push`/`gh pr create`
directly, so the same checks (preflight, scoping, review) apply
consistently.
