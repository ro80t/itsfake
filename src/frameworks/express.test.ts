import express from "express";
import type { Server } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import { itsfake } from "./express";

let server: Server | undefined;

async function startApp(app: express.Express): Promise<string> {
  server = app.listen(0);
  await new Promise<void>((resolve) => server?.once("listening", () => resolve()));
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

describe("itsfake (express)", () => {
  it("serves a fake .env instead of falling through", async () => {
    const app = express();
    app.use(itsfake());
    const base = await startApp(app);

    const res = await fetch(`${base}/.env`);

    expect(res.status).toBe(200);
    expect(await res.text()).toContain("DB_PASSWORD=");
  });

  it("calls next() and reaches the real route for an unmatched path", async () => {
    const app = express();
    app.use(itsfake());
    app.get("/about", (_req, res) => res.send("real page"));
    const base = await startApp(app);

    const res = await fetch(`${base}/about`);

    expect(await res.text()).toBe("real page");
  });

  it("invokes onTrap with the matched path and rule", async () => {
    const onTrap = vi.fn();
    const app = express();
    app.use(itsfake({ onTrap }));
    const base = await startApp(app);

    await fetch(`${base}/wp-login.php`);

    expect(onTrap).toHaveBeenCalledTimes(1);
    expect(onTrap.mock.calls[0]?.[0].path).toBe("/wp-login.php");
  });

  it("uses a custom rule list when provided", async () => {
    const app = express();
    app.use(
      itsfake({
        rules: [{ match: "/trap", respond: () => ({ status: 200, body: "gotcha" }) }],
      }),
    );
    app.use((_req, res) => res.status(404).send("real 404"));
    const base = await startApp(app);

    const envRes = await fetch(`${base}/.env`);
    const trapRes = await fetch(`${base}/trap`);

    expect(envRes.status).toBe(404);
    expect(await trapRes.text()).toBe("gotcha");
  });
});
