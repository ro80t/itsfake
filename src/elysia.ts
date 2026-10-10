import type { PreContext } from "elysia";
import { findTrap } from "./core";
import { DEFAULT_TRAP_RULES } from "./rules";
import type { TrapHit, TrapRule } from "./types";

export interface ItsfakeElysiaOptions {
  /** Overrides the default trap list. Defaults to `DEFAULT_TRAP_RULES`. */
  rules?: TrapRule[];
  /** Called whenever a request matches a trap, e.g. to log the attacker's IP. */
  onTrap?: (hit: TrapHit) => void;
}

/**
 * Elysia `onRequest` hook that serves fake credentials/pages for commonly-
 * scanned paths (`.env`, `wp-login.php`, ...) instead of a real 404, to
 * waste an attacker's time and feed them bogus secrets.
 *
 * @example
 * ```ts
 * import { Elysia } from "elysia";
 * import { itsfakeHook } from "itsfake/elysia";
 *
 * const app = new Elysia().onRequest(itsfakeHook());
 * ```
 */
export function itsfakeHook(options: ItsfakeElysiaOptions = {}) {
  const rules = options.rules ?? DEFAULT_TRAP_RULES;

  return ({ request }: PreContext): Response | void => {
    const path = new URL(request.url).pathname;
    const rule = findTrap(path, rules);
    if (!rule) return;

    options.onTrap?.({ path, rule });
    const { status, headers, body } = rule.respond();
    return new Response(body, { status, headers });
  };
}
