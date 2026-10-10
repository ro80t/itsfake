import { describe, expect, it } from "vitest";
import { findTrap } from "./core";
import type { TrapRule } from "./types";

describe("findTrap", () => {
  it("matches .env and its variants via the default rules", () => {
    expect(findTrap("/.env")).not.toBeNull();
    expect(findTrap("/.env.production")).not.toBeNull();
  });

  it("matches wp-admin as a prefix", () => {
    expect(findTrap("/wp-admin/install.php")).not.toBeNull();
  });

  it("returns null for an unmatched path", () => {
    expect(findTrap("/about")).toBeNull();
  });

  it("uses a custom rule list when given one", () => {
    const rules: TrapRule[] = [
      { match: "/secret", respond: () => ({ status: 200, body: "nope" }) },
    ];
    expect(findTrap("/.env", rules)).toBeNull();
    expect(findTrap("/secret", rules)?.respond().body).toBe("nope");
  });
});
