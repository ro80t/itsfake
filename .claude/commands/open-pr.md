---
description: Commit the current changes on a new branch, push it, and open a pull request
---

Open a pull request for the current working-tree changes, following the PR
workflow in the system prompt (review the full diff and commit history for
what's actually changing, not just the latest commit).

1. If currently on `master` (or another protected/shared branch), create a
   new branch first — name it after the change, don't reuse `master`.
2. Run `/preflight`; fix any failure before committing.
3. Commit the changes (same scoping rules as `/auto-commit-push`).
4. Push the branch with `-u`.
5. `gh pr create` with a concise title and a body covering what changed and
   why, plus a test-plan checklist if relevant.

If the change should include a changeset (`bunx changeset` — see
`CONTRIBUTING.md`), add it before committing.

`$ARGUMENTS`, if given, is context for the PR title/description (e.g. an
issue number to link, or which change to scope the PR to if there are
multiple unrelated changes in the working tree — ask rather than guessing
if that's ambiguous).

Report the PR URL when done.
