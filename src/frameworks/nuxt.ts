import { defineEventHandler, getRequestURL, setResponseHeaders, setResponseStatus } from "h3";
import type { H3Event } from "h3";
import { findTrap } from "../core";
import { DEFAULT_TRAP_RULES } from "../rules";
import type { TrapHit, TrapRule } from "../types";

export interface ItsfakeNuxtOptions {
  /** Overrides the default trap list. Defaults to `DEFAULT_TRAP_RULES`. */
  rules?: TrapRule[];
  /** Called whenever a request matches a trap, e.g. to log the attacker's IP. */
  onTrap?: (hit: TrapHit<H3Event>) => void;
}

/**
 * Nitro (h3) server middleware for Nuxt's `server/middleware/` that serves
 * fake credentials/pages for commonly-scanned paths (`.env`, `wp-login.php`,
 * ...) instead of a real 404, to waste an attacker's time and feed them
 * bogus secrets.
 *
 * @example
 * ```ts
 * // server/middleware/itsfake.ts
 * import { itsfakeMiddleware } from "itsfake/nuxt";
 *
 * export default itsfakeMiddleware();
 * ```
 */
export function itsfakeMiddleware(options: ItsfakeNuxtOptions = {}) {
  const rules = options.rules ?? DEFAULT_TRAP_RULES;

  return defineEventHandler((event) => {
    const path = getRequestURL(event).pathname;
    const rule = findTrap(path, rules);
    if (!rule) return;

    options.onTrap?.({ path, rule, raw: event });
    const { status, headers, body } = rule.respond();
    setResponseStatus(event, status);
    if (headers) setResponseHeaders(event, headers);
    return body;
  });
}
