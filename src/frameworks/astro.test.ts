import type { APIContext, MiddlewareNext } from "astro";
import { describe, expect, it, vi } from "vitest";
import { itsfakeMiddleware } from "./astro";

function makeContext(url: string): APIContext {
  return { url: new URL(url) } as APIContext;
}

describe("itsfakeMiddleware (astro)", () => {
  it("serves a fake .env instead of calling next", async () => {
    const middleware = itsfakeMiddleware();
    const next: MiddlewareNext = () => {
      throw new Error("should not call next");
    };

    const res = await middleware(makeContext("https://example.com/.env"), next);

    expect(res.status).toBe(200);
    expect(await res.text()).toMatch(/[A-Z_]+=/);
  });

  it("calls next() for an unmatched path", async () => {
    const next = vi.fn(() => Promise.resolve(new Response("real page")));
    const middleware = itsfakeMiddleware();

    const res = await middleware(makeContext("https://example.com/about"), next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(await res.text()).toBe("real page");
  });

  it("invokes onTrap with the matched path and rule", async () => {
    const onTrap = vi.fn();
    const middleware = itsfakeMiddleware({ onTrap });
    const next: MiddlewareNext = () => Promise.resolve(new Response("real page"));

    await middleware(makeContext("https://example.com/wp-login.php"), next);

    expect(onTrap).toHaveBeenCalledTimes(1);
    expect(onTrap.mock.calls[0]?.[0].path).toBe("/wp-login.php");
  });

  it("uses a custom rule list when provided", async () => {
    const middleware = itsfakeMiddleware({
      rules: [{ match: "/trap", respond: () => ({ status: 200, body: "gotcha" }) }],
    });
    const next: MiddlewareNext = () => Promise.resolve(new Response("real 404", { status: 404 }));

    const envRes = await middleware(makeContext("https://example.com/.env"), next);
    const trapRes = await middleware(makeContext("https://example.com/trap"), next);

    expect(envRes.status).toBe(404);
    expect(await trapRes.text()).toBe("gotcha");
  });
});
