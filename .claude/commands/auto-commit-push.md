---
description: Commit the current changes and push directly to the current branch
---

Commit and push the current working-tree changes, following the git
workflow in the system prompt (review `git status`/`git diff` first, stage
by explicit path rather than `-A`, double-check nothing suspicious like a
secret is being staged).

If `$ARGUMENTS` names specific files/paths, stage only those; otherwise use
judgment about what belongs in one commit — see `AGENTS.md` if unsure which
untracked files, if any, are actually part of this change vs. unrelated
in-progress work that shouldn't be swept in.

Run `/preflight` first; fix any failure before committing.

After committing, `git push` to the current branch's existing upstream. If
there's no upstream yet, ask before setting one up rather than guessing
where this should go.
