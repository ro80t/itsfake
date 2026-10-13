import type { APIContext, MiddlewareNext } from "astro";
import { findTrap } from "../core";
import { DEFAULT_TRAP_RULES } from "../rules";
import type { TrapHit, TrapRule } from "../types";

export interface ItsfakeAstroOptions {
  /** Overrides the default trap list. Defaults to `DEFAULT_TRAP_RULES`. */
  rules?: TrapRule[];
  /** Called whenever a request matches a trap, e.g. to log the attacker's IP. */
  onTrap?: (hit: TrapHit<Request>) => void;
}

/**
 * Astro middleware that serves fake credentials/pages for commonly-scanned
 * paths (`.env`, `wp-login.php`, ...) instead of a real 404, to waste an
 * attacker's time and feed them bogus secrets.
 *
 * @example
 * ```ts
 * // src/middleware.ts
 * import { itsfakeMiddleware } from "itsfake/astro";
 *
 * export const onRequest = itsfakeMiddleware();
 * ```
 */
export function itsfakeMiddleware(options: ItsfakeAstroOptions = {}) {
  const rules = options.rules ?? DEFAULT_TRAP_RULES;

  return (context: APIContext, next: MiddlewareNext): Response | Promise<Response> => {
    const path = context.url.pathname;
    const rule = findTrap(path, rules);
    if (!rule) return next();

    options.onTrap?.({ path, rule, raw: context.request });
    const { status, headers, body } = rule.respond();
    return new Response(body, { status, headers });
  };
}
