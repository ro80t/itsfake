import { describe, expect, it } from "vitest";
import {
  fakeAwsCredentials,
  fakeDotEnv,
  fakeGitConfig,
  fakeGitHead,
  fakePhpMyAdminLoginPage,
  fakeSpringActuatorEnv,
  fakeSshPrivateKey,
} from "./fakes";

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

  it("fakeGitHead looks like a git ref", () => {
    expect(fakeGitHead()).toBe("ref: refs/heads/main\n");
  });

  it("fakeSshPrivateKey produces a fresh PEM-shaped block on every call", () => {
    expect(fakeSshPrivateKey()).not.toBe(fakeSshPrivateKey());
    expect(fakeSshPrivateKey()).toMatch(
      /-----BEGIN OPENSSH PRIVATE KEY-----\n[\s\S]+\n-----END OPENSSH PRIVATE KEY-----\n/,
    );
  });

  it("fakeSpringActuatorEnv exposes a fake datasource password", () => {
    expect(fakeSpringActuatorEnv()).toContain("spring.datasource.password");
  });

  it("fakePhpMyAdminLoginPage looks like a phpMyAdmin login form", () => {
    expect(fakePhpMyAdminLoginPage()).toContain("pma_password");
  });
});
