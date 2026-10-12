import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { itsfakeMiddleware } from "./next";

describe("itsfakeMiddleware", () => {
  it("serves a fake .env instead of passing through", async () => {
    const middleware = itsfakeMiddleware();
    const res = middleware(new NextRequest("https://example.com/.env"));

    expect(res.status).toBe(200);
    expect(await res.text()).toContain("DB_PASSWORD=");
  });

  it("calls NextResponse.next() for an unmatched path", () => {
    const middleware = itsfakeMiddleware();
    const res = middleware(new NextRequest("https://example.com/about"));

    expect(res.headers.get("x-middleware-next")).toBe("1");
  });

  it("invokes onTrap with the matched path and rule", () => {
    const onTrap = vi.fn();
    const middleware = itsfakeMiddleware({ onTrap });

    middleware(new NextRequest("https://example.com/wp-login.php"));

    expect(onTrap).toHaveBeenCalledTimes(1);
    expect(onTrap.mock.calls[0]?.[0].path).toBe("/wp-login.php");
  });
});
