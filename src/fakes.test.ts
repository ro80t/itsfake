import { describe, expect, it } from "vitest";
import { fakeAwsCredentials, fakeDotEnv, fakeGitConfig } from "./fakes";

describe("fakes", () => {
  it("fakeDotEnv produces a fresh secret on every call", () => {
    expect(fakeDotEnv()).not.toBe(fakeDotEnv());
    expect(fakeDotEnv()).toContain("AWS_SECRET_ACCESS_KEY=");
  });

  it("fakeGitConfig embeds a credential in the remote URL", () => {
    expect(fakeGitConfig()).toMatch(/url = https:\/\/\w+:\S+@github\.com/);
  });

  it("fakeAwsCredentials looks like a real credentials file", () => {
    expect(fakeAwsCredentials()).toMatch(/aws_access_key_id = AKIA[0-9A-F]{16}/);
  });
});
