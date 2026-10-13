import type { FastifyRequest, onRequestAsyncHookHandler } from "fastify";
import { findTrap } from "../core";
import { DEFAULT_TRAP_RULES } from "../rules";
import type { TrapHit, TrapRule } from "../types";

export interface ItsfakeFastifyOptions {
  /** Overrides the default trap list. Defaults to `DEFAULT_TRAP_RULES`. */
  rules?: TrapRule[];
  /** Called whenever a request matches a trap, e.g. to log the attacker's IP. */
  onTrap?: (hit: TrapHit<FastifyRequest>) => void;
}

/**
 * Fastify `onRequest` hook that serves fake credentials/pages for commonly-
 * scanned paths (`.env`, `wp-login.php`, ...) instead of a real 404, to
 * waste an attacker's time and feed them bogus secrets.
 *
 * @example
 * ```ts
 * import Fastify from "fastify";
 * import { itsfakeHook } from "itsfake/fastify";
 *
 * const app = Fastify();
 * app.addHook("onRequest", itsfakeHook());
 * ```
 */
export function itsfakeHook(options: ItsfakeFastifyOptions = {}): onRequestAsyncHookHandler {
  const rules = options.rules ?? DEFAULT_TRAP_RULES;

  return async (request, reply) => {
    const path = new URL(request.url, "http://localhost").pathname;
    const rule = findTrap(path, rules);
    if (!rule) return;

    options.onTrap?.({ path, rule, raw: request });
    const { status, headers, body } = rule.respond();
    if (headers) reply.headers(headers);
    reply.code(status).send(body);
  };
}
