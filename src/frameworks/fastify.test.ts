import Fastify from "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { afterEach, describe, expect, it, vi } from "vitest";
import { itsfakeHook } from "./fastify";

describe("itsfakeHook (fastify)", () => {
  let app: ReturnType<typeof Fastify> | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it("serves a fake .env instead of falling through", async () => {
    app = Fastify();
    app.addHook("onRequest", itsfakeHook());

    const res = await app.inject({ method: "GET", url: "/.env" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("DB_PASSWORD=");
  });

  it("reaches the real route for an unmatched path", async () => {
    app = Fastify();
    app.addHook("onRequest", itsfakeHook());
    app.get("/about", () => "real page");

    const res = await app.inject({ method: "GET", url: "/about" });

    expect(res.body).toBe("real page");
  });

  it("invokes onTrap with the matched path and rule", async () => {
    const onTrap = vi.fn();
    app = Fastify();
    app.addHook("onRequest", itsfakeHook({ onTrap }));

    await app.inject({ method: "GET", url: "/wp-login.php" });

    expect(onTrap).toHaveBeenCalledTimes(1);
    expect(onTrap.mock.calls[0]?.[0].path).toBe("/wp-login.php");
  });

  it("uses a custom rule list when provided", async () => {
    app = Fastify();
    app.addHook(
      "onRequest",
      itsfakeHook({
        rules: [{ match: "/trap", respond: () => ({ status: 200, body: "gotcha" }) }],
      }),
    );
    app.setNotFoundHandler((_req: FastifyRequest, reply: FastifyReply) =>
      reply.code(404).send("real 404"),
    );

    const envRes = await app.inject({ method: "GET", url: "/.env" });
    const trapRes = await app.inject({ method: "GET", url: "/trap" });

    expect(envRes.statusCode).toBe(404);
    expect(trapRes.body).toBe("gotcha");
  });
});
