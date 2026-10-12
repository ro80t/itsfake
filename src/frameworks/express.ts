import type { NextFunction, Request, RequestHandler, Response } from "express";
import { findTrap } from "../core";
import { DEFAULT_TRAP_RULES } from "../rules";
import type { TrapHit, TrapRule } from "../types";

export interface ItsfakeExpressOptions {
  /** Overrides the default trap list. Defaults to `DEFAULT_TRAP_RULES`. */
  rules?: TrapRule[];
  /** Called whenever a request matches a trap, e.g. to log the attacker's IP. */
  onTrap?: (hit: TrapHit) => void;
}

/**
 * Express middleware that serves fake credentials/pages for commonly-
 * scanned paths (`.env`, `wp-login.php`, ...) instead of a real 404, to
 * waste an attacker's time and feed them bogus secrets.
 *
 * @example
 * ```ts
 * import express from "express";
 * import { itsfake } from "itsfake/express";
 *
 * const app = express();
 * app.use(itsfake());
 * ```
 */
export function itsfake(options: ItsfakeExpressOptions = {}): RequestHandler {
  const rules = options.rules ?? DEFAULT_TRAP_RULES;

  return (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    const rule = findTrap(path, rules);
    if (!rule) {
      next();
      return;
    }

    options.onTrap?.({ path, rule });
    const { status, headers, body } = rule.respond();
    if (headers) res.set(headers);
    res.status(status).send(body);
  };
}
