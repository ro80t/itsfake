import type { RequestServerOptions } from "@tanstack/react-start";
import { describe, expect, it, vi } from "vitest";
import { itsfakeMiddleware } from "./tanstack-start";

function getServer(options?: Parameters<typeof itsfakeMiddleware>[0]) {
  const server = itsfakeMiddleware(options).options.server;
  if (!server) throw new Error("expected a server function");
  return server;
}

function makeArgs(url: string, next: (...args: never[]) => unknown) {
  return {
    request: new Request(url),
    pathname: new URL(url).pathname,
    context: undefined,
    handlerType: "router",
    next,
  } as unknown as RequestServerOptions<unknown, unknown>;
}

describe("itsfakeMiddleware (tanstack-start)", () => {
  it("serves a fake .env instead of calling next", async () => {
    const server = getServer();
    const next = () => {
      throw new Error("should not call next");
    };

    const result = await server(makeArgs("https://example.com/.env", next));
    const res = result as Response;

    expect(res.status).toBe(200);
    expect(await res.text()).toContain("DB_PASSWORD=");
  });

  it("calls next() for an unmatched path", async () => {
    const nextResult = {
      request: new Request("https://example.com/about"),
      pathname: "/about",
      context: undefined,
      response: new Response("real page"),
    };
    const next = vi.fn(() => nextResult);
    const server = getServer();

    const result = await server(makeArgs("https://example.com/about", next));

    expect(next).toHaveBeenCalledTimes(1);
    expect(result).toBe(nextResult);
  });

  it("invokes onTrap with the matched path and rule", async () => {
    const onTrap = vi.fn();
    const server = getServer({ onTrap });
    const next = () => {
      throw new Error("should not call next");
    };

    await server(makeArgs("https://example.com/wp-login.php", next));

    expect(onTrap).toHaveBeenCalledTimes(1);
    expect(onTrap.mock.calls[0]?.[0].path).toBe("/wp-login.php");
  });

  it("uses a custom rule list when provided", async () => {
    const server = getServer({
      rules: [{ match: "/trap", respond: () => ({ status: 200, body: "gotcha" }) }],
    });
    const next = () => ({
      request: new Request("https://example.com/.env"),
      pathname: "/.env",
      context: undefined,
      response: new Response("real 404", { status: 404 }),
    });

    const envResult = (await server(makeArgs("https://example.com/.env", next))) as {
      response: Response;
    };
    const trapResult = (await server(makeArgs("https://example.com/trap", next))) as Response;

    expect(envResult.response.status).toBe(404);
    expect(await trapResult.text()).toBe("gotcha");
  });
});
