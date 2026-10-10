import type { RequestEvent } from "@sveltejs/kit";
import { describe, expect, it, vi } from "vitest";
import { itsfakeHandle } from "./sveltekit";

function makeEvent(url: string): RequestEvent {
  return { url: new URL(url) } as RequestEvent;
}

describe("itsfakeHandle (sveltekit)", () => {
  it("serves a fake .env instead of resolving", async () => {
    const handle = itsfakeHandle();
    const res = await handle({
      event: makeEvent("https://example.com/.env"),
      resolve: () => {
        throw new Error("should not resolve");
      },
    });

    expect(res.status).toBe(200);
    expect(await res.text()).toContain("DB_PASSWORD=");
  });

  it("calls resolve(event) for an unmatched path", async () => {
    const resolve = vi.fn(() => Promise.resolve(new Response("real page")));
    const handle = itsfakeHandle();
    const event = makeEvent("https://example.com/about");

    const res = await handle({ event, resolve });

    expect(resolve).toHaveBeenCalledWith(event);
    expect(await res.text()).toBe("real page");
  });

  it("invokes onTrap with the matched path and rule", async () => {
    const onTrap = vi.fn();
    const handle = itsfakeHandle({ onTrap });

    await handle({
      event: makeEvent("https://example.com/wp-login.php"),
      resolve: () => Promise.resolve(new Response("real page")),
    });

    expect(onTrap).toHaveBeenCalledTimes(1);
    expect(onTrap.mock.calls[0]?.[0].path).toBe("/wp-login.php");
  });

  it("uses a custom rule list when provided", async () => {
    const handle = itsfakeHandle({
      rules: [{ match: "/trap", respond: () => ({ status: 200, body: "gotcha" }) }],
    });
    const resolve = () => Promise.resolve(new Response("real 404", { status: 404 }));

    const envRes = await handle({ event: makeEvent("https://example.com/.env"), resolve });
    const trapRes = await handle({ event: makeEvent("https://example.com/trap"), resolve });

    expect(envRes.status).toBe(404);
    expect(await trapRes.text()).toBe("gotcha");
  });
});
