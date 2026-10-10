import { Elysia } from "elysia";
import { describe, expect, it, vi } from "vitest";
import { itsfakeHook } from "./elysia";

describe("itsfakeHook (elysia)", () => {
  it("serves a fake .env instead of falling through", async () => {
    const app = new Elysia().onRequest(itsfakeHook());

    const res = await app.handle(new Request("http://localhost/.env"));

    expect(res.status).toBe(200);
    expect(await res.text()).toContain("DB_PASSWORD=");
  });

  it("reaches the real route for an unmatched path", async () => {
    const app = new Elysia().onRequest(itsfakeHook()).get("/about", () => "real page");

    const res = await app.handle(new Request("http://localhost/about"));

    expect(await res.text()).toBe("real page");
  });

  it("invokes onTrap with the matched path and rule", async () => {
    const onTrap = vi.fn();
    const app = new Elysia().onRequest(itsfakeHook({ onTrap }));

    await app.handle(new Request("http://localhost/wp-login.php"));

    expect(onTrap).toHaveBeenCalledTimes(1);
    expect(onTrap.mock.calls[0]?.[0].path).toBe("/wp-login.php");
  });

  it("uses a custom rule list when provided", async () => {
    const app = new Elysia()
      .onRequest(
        itsfakeHook({
          rules: [{ match: "/trap", respond: () => ({ status: 200, body: "gotcha" }) }],
        }),
      )
      .all("/*", () => new Response("real 404", { status: 404 }));

    const envRes = await app.handle(new Request("http://localhost/.env"));
    const trapRes = await app.handle(new Request("http://localhost/trap"));

    expect(envRes.status).toBe(404);
    expect(await trapRes.text()).toBe("gotcha");
  });
});
