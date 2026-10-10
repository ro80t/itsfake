---
description: Run the same checks CI runs (lint, format check, typecheck, test, build) before opening a PR
---

Run these in order and stop at the first failure, reporting the error:

```sh
bun run lint
bun run format:check
bun run typecheck
bun run test
bun run build
```

Fix any failure at its root cause, then re-run from that step.
