---
name: add-trap-rule
description: Add a new honeypot trap (path pattern + fake response) to DEFAULT_TRAP_RULES in src/rules.ts, or a new fake-content generator in src/fakes.ts. Use when the user wants to cover another commonly-scanned path (a new CMS admin panel, a cloud credentials file, a backup/config path, ...) or reports that a scanner path isn't being trapped.
---

# Adding a trap rule

itsfake's core value is `DEFAULT_TRAP_RULES` (`src/rules.ts`): a list of paths
attackers/scanners commonly probe, each paired with a fake-but-plausible
response. A rule that's too narrow misses real scanner traffic; a rule that's
too broad can shadow a real route in the host app, so match specifically.

## Steps

1. **Confirm it's actually scanner traffic**, not a path a real app might
   serve — a new rule should target a well-known probe path (common CMS
   admin/login endpoints, dotfiles, credential files, debug endpoints), not
   something generic like `/admin` that a real app likely owns.
2. **Pick (or write) a fake-content generator** in `src/fakes.ts`:
   - Reuse an existing generator (`fakeDotEnv`, `fakeGitConfig`,
     `fakeAwsCredentials`, `fakeWpLoginPage`, `fakePhpInfo`) if the new path
     serves the same kind of content.
   - Otherwise add a new `fake*()` function there. Keep output _plausible but
     inert_ — randomize secrets with `randomHex`/`randomBase64` from
     `src/random.ts` so every request gets a fresh value and nothing
     resembles a real credential anyone could reuse.
3. **Add the rule** to `DEFAULT_TRAP_RULES` in `src/rules.ts`:
   `{ match: "/path", respond: () => ({ status: 200, headers: {...}, body: fakeX() }) }`.
   - `match` is an exact string, a `"prefix*"` string, or a `RegExp` — see
     `matchPath` in `src/match.ts`. Prefer the narrowest match that still
     covers the real-world probe (e.g. `/wp-admin*` since scanners hit many
     sub-paths, but `/wp-login.php` exact since it's a single file).
   - Set `content-type` to whatever a real server would send for that path
     (`text/plain` for dotfiles/config, `text/html` for pages, `text/xml` for
     xmlrpc, ...) — a wrong content-type is an easy tell that it's fake.
4. **Add a test** in `src/core.test.ts` (match coverage) and/or
   `src/fakes.test.ts` (content shape), following the existing style — assert
   the path matches and the generator's output contains the identifying
   content (e.g. a secret-looking key), not an exact string match, since
   content is randomized per call.
5. **Run the check**: `bun run lint && bun run typecheck && bun run test`
   (or `/preflight`).
6. **Add a changeset**: `bunx changeset` — a `minor` bump (new trap coverage
   is a public behavior change), described from the consumer's point of
   view, e.g. "Add a trap for `/config.json`."

## Red flags — stop and ask instead of guessing

- The new fake content would be dangerous if an attacker actually used it
  (e.g. a real-looking link to an internal system, something that would
  execute if copy-pasted) — fake values must be inert strings only.
- The match pattern is broad enough to shadow a real route a consuming app
  is likely to define (e.g. matching `/api*` or `/*`) — this would silently
  break real apps that use `itsfake` as middleware.
- The request is to make the fake response _interactive_ (e.g. actually
  accept a login POST and pretend to authenticate) — that's a bigger design
  decision (follow-up behavior, state) than a static trap and should be
  raised with the user rather than built ad hoc.
