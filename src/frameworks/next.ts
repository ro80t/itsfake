import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { findTrap } from "../core";
import { DEFAULT_TRAP_RULES } from "../rules";
import type { TrapHit, TrapRule } from "../types";

export interface ItsfakeNextOptions {
  /** Overrides the default trap list. Defaults to `DEFAULT_TRAP_RULES`. */
  rules?: TrapRule[];
  /** Called whenever a request matches a trap, e.g. to log the attacker's IP. */
  onTrap?: (hit: TrapHit) => void;
}

/**
 * Next.js middleware that serves fake credentials/pages for commonly-scanned
 * paths (`.env`, `wp-login.php`, ...) instead of a real 404, to waste an
 * attacker's time and feed them bogus secrets.
 *
 * @example
 * ```ts
 * // middleware.ts
 * import { itsfakeMiddleware } from "itsfake/next";
 *
 * export const middleware = itsfakeMiddleware();
 * ```
 */
export function itsfakeMiddleware(options: ItsfakeNextOptions = {}) {
  const rules = options.rules ?? DEFAULT_TRAP_RULES;

  return function middleware(request: NextRequest): NextResponse {
    const path = request.nextUrl.pathname;
    const rule = findTrap(path, rules);
    if (!rule) return NextResponse.next();

    options.onTrap?.({ path, rule });
    const { status, headers, body } = rule.respond();
    return new NextResponse(body, { status, headers });
  };
}
