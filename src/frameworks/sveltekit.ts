import type { Handle } from "@sveltejs/kit/hooks";
import { findTrap } from "../core";
import { DEFAULT_TRAP_RULES } from "../rules";
import type { TrapHit, TrapRule } from "../types";

export interface ItsfakeSvelteKitOptions {
  /** Overrides the default trap list. Defaults to `DEFAULT_TRAP_RULES`. */
  rules?: TrapRule[];
  /** Called whenever a request matches a trap, e.g. to log the attacker's IP. */
  onTrap?: (hit: TrapHit) => void;
}

/**
 * SvelteKit `handle` hook that serves fake credentials/pages for commonly-
 * scanned paths (`.env`, `wp-login.php`, ...) instead of a real 404, to
 * waste an attacker's time and feed them bogus secrets.
 *
 * @example
 * ```ts
 * // src/hooks.server.ts
 * import { itsfakeHandle } from "itsfake/sveltekit";
 *
 * export const handle = itsfakeHandle();
 * ```
 */
export function itsfakeHandle(options: ItsfakeSvelteKitOptions = {}): Handle {
  const rules = options.rules ?? DEFAULT_TRAP_RULES;

  return ({ event, resolve }) => {
    const path = event.url.pathname;
    const rule = findTrap(path, rules);
    if (!rule) return resolve(event);

    options.onTrap?.({ path, rule });
    const { status, headers, body } = rule.respond();
    return new Response(body, { status, headers });
  };
}
