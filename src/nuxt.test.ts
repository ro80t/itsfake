import { createServer } from "node:http";
import { createApp, defineEventHandler, setResponseStatus, toNodeListener } from "h3";
import type { App } from "h3";
import { afterEach, describe, expect, it, vi } from "vitest";
import { itsfakeMiddleware } from "./nuxt";

let server: ReturnType<typeof createServer> | undefined;

async function startApp(app: App): Promise<string> {
  server = createServer(toNodeListener(app));
  await new Promise<void>((resolve) => server?.listen(0, () => resolve()));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  return `http://127.0.0.1:${port}`;
}

afterEach(async () => {
  if (server) {
    await new Promise<void>((resolve) => server?.close(() => resolve()));
    server = undefined;
  }
});

describe("itsfakeMiddleware (nuxt/h3)", () => {
  it("serves a fake .env instead of falling through", async () => {
    const app = createApp();
    app.use(itsfakeMiddleware());
    const base = await startApp(app);

    const res = await fetch(`${base}/.env`);

    expect(res.status).toBe(200);
    expect(await res.text()).toContain("DB_PASSWORD=");
  });

  it("falls through to the next handler for an unmatched path", async () => {
    const app = createApp();
    app.use(itsfakeMiddleware());
    app.use(defineEventHandler(() => "real page"));
    const base = await startApp(app);

    const res = await fetch(`${base}/about`);

    expect(await res.text()).toBe("real page");
  });

  it("invokes onTrap with the matched path and rule", async () => {
    const onTrap = vi.fn();
    const app = createApp();
    app.use(itsfakeMiddleware({ onTrap }));
    const base = await startApp(app);

    await fetch(`${base}/wp-login.php`);

    expect(onTrap).toHaveBeenCalledTimes(1);
    expect(onTrap.mock.calls[0]?.[0].path).toBe("/wp-login.php");
  });

  it("uses a custom rule list when provided", async () => {
    const app = createApp();
    app.use(
      itsfakeMiddleware({
        rules: [{ match: "/trap", respond: () => ({ status: 200, body: "gotcha" }) }],
      }),
    );
    app.use(
      defineEventHandler((event) => {
        setResponseStatus(event, 404);
        return "real 404";
      }),
    );
    const base = await startApp(app);

    const envRes = await fetch(`${base}/.env`);
    const trapRes = await fetch(`${base}/trap`);

    expect(envRes.status).toBe(404);
    expect(await trapRes.text()).toBe("gotcha");
  });
});
