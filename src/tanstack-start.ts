import { createMiddleware } from "@tanstack/react-start";
import type { AnyRequestMiddleware } from "@tanstack/react-start";
import { findTrap } from "./core";
import { DEFAULT_TRAP_RULES } from "./rules";
import type { TrapHit, TrapRule } from "./types";

export interface ItsfakeTanStackStartOptions {
  /** Overrides the default trap list. Defaults to `DEFAULT_TRAP_RULES`. */
  rules?: TrapRule[];
  /** Called whenever a request matches a trap, e.g. to log the attacker's IP. */
  onTrap?: (hit: TrapHit) => void;
}

/**
 * TanStack Start request middleware that serves fake credentials/pages for
 * commonly-scanned paths (`.env`, `wp-login.php`, ...) instead of a real
 * 404, to waste an attacker's time and feed them bogus secrets.
 *
 * @example
 * ```ts
 * // src/start.ts
 * import { createStart } from "@tanstack/react-start";
 * import { itsfakeMiddleware } from "itsfake/tanstack-start";
 *
 * export const startInstance = createStart(() => ({
 *   requestMiddleware: [itsfakeMiddleware()],
 * }));
 * ```
 */
export function itsfakeMiddleware(options: ItsfakeTanStackStartOptions = {}): AnyRequestMiddleware {
  const rules = options.rules ?? DEFAULT_TRAP_RULES;

  return createMiddleware({ type: "request" }).server(({ pathname, next }) => {
    const rule = findTrap(pathname, rules);
    if (!rule) return next();

    options.onTrap?.({ path: pathname, rule });
    const { status, headers, body } = rule.respond();
    return new Response(body, { status, headers });
  });
}
