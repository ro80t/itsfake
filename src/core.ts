import { matchPath } from "./match";
import { DEFAULT_TRAP_RULES } from "./rules";
import type { TrapRule } from "./types";

/** Returns the first rule whose matcher matches `pathname`, or `null` if none match. */
export function findTrap(
  pathname: string,
  rules: TrapRule[] = DEFAULT_TRAP_RULES,
): TrapRule | null {
  return rules.find((rule) => matchPath(pathname, rule.match)) ?? null;
}
