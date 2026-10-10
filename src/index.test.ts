import { expect, test } from "vitest";
import { VERSION } from "./index";

test("VERSION is exported", () => {
  expect(VERSION).toBe("0.0.0");
});
