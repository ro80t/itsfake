import type { MiddlewareHandler } from "hono";
import { findTrap } from "../core";
import { DEFAULT_TRAP_RULES } from "../rules";
import type { TrapHit, TrapRule } from "../types";

export interface ItsfakeOptions {
  /** Overrides the default trap list. Defaults to `DEFAULT_TRAP_RULES`. */
  rules?: TrapRule[];
  /** Called whenever a request matches a trap, e.g. to log the attacker's IP. */
  onTrap?: (hit: TrapHit) => void;
}

/**
 * Hono middleware that serves fake credentials/pages for commonly-scanned
 * paths (`.env`, `wp-login.php`, ...) instead of a real 404, to waste an
 * attacker's time and feed them bogus secrets.
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { itsfake } from "itsfake/hono";
 *
 * const app = new Hono();
 * app.use(itsfake());
 * ```
 */
export function itsfake(options: ItsfakeOptions = {}): MiddlewareHandler {
  const rules = options.rules ?? DEFAULT_TRAP_RULES;

  return async (c, next) => {
    const path = c.req.path;
    const rule = findTrap(path, rules);
    if (!rule) {
      await next();
      return;
    }

    options.onTrap?.({ path, rule });
    const { status, headers, body } = rule.respond();
    return new Response(body, { status, headers });
  };
}
