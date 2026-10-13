import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";
import { itsfake } from "./hono";

describe("itsfake (hono)", () => {
  it("serves a fake .env instead of falling through", async () => {
    const app = new Hono();
    app.use(itsfake());
    app.notFound((c) => c.text("real 404", 404));

    const res = await app.request("/.env");

    expect(res.status).toBe(200);
    expect(await res.text()).toMatch(/[A-Z_]+=/);
  });

  it("calls next() and reaches the real route for an unmatched path", async () => {
    const app = new Hono();
    app.use(itsfake());
    app.get("/about", (c) => c.text("real page"));

    const res = await app.request("/about");

    expect(await res.text()).toBe("real page");
  });

  it("invokes onTrap with the matched path and rule", async () => {
    const onTrap = vi.fn();
    const app = new Hono();
    app.use(itsfake({ onTrap }));

    await app.request("/wp-login.php");

    expect(onTrap).toHaveBeenCalledTimes(1);
    expect(onTrap.mock.calls[0]?.[0].path).toBe("/wp-login.php");
  });

  it("uses a custom rule list when provided", async () => {
    const app = new Hono();
    app.use(
      itsfake({
        rules: [{ match: "/trap", respond: () => ({ status: 200, body: "gotcha" }) }],
      }),
    );
    app.notFound((c) => c.text("real 404", 404));

    const envRes = await app.request("/.env");
    const trapRes = await app.request("/trap");

    expect(envRes.status).toBe(404);
    expect(await trapRes.text()).toBe("gotcha");
  });
});
