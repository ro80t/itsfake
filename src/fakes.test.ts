import { describe, expect, it } from "vitest";
import {
  fakeAwsCredentials,
  fakeDotEnv,
  fakeDotEnvDjango,
  fakeDotEnvLaravel,
  fakeDotEnvNode,
  fakeGitConfig,
  fakeGitHead,
  fakePhpMyAdminLoginPage,
  fakeSpringActuatorEnv,
  fakeSshPrivateKey,
} from "./fakes";

describe("fakes", () => {
  it("fakeDotEnv produces a fresh secret on every call", () => {
    expect(fakeDotEnv()).not.toBe(fakeDotEnv());
  });

  it("fakeDotEnv picks from the Laravel/Node/Django flavors", () => {
    const outputs = Array.from({ length: 30 }, () => fakeDotEnv());
    expect(outputs.some((o) => o.includes("APP_KEY="))).toBe(true);
    expect(outputs.some((o) => o.includes("JWT_SECRET="))).toBe(true);
    expect(outputs.some((o) => o.includes("ALLOWED_HOSTS="))).toBe(true);
  });

  it("fakeDotEnvLaravel looks like a Laravel .env", () => {
    expect(fakeDotEnvLaravel()).toContain("AWS_SECRET_ACCESS_KEY=");
  });

  it("fakeDotEnvNode looks like a Node .env", () => {
    expect(fakeDotEnvNode()).toContain("DATABASE_URL=postgres://");
  });

  it("fakeDotEnvDjango looks like a Django .env", () => {
    expect(fakeDotEnvDjango()).toContain("SECRET_KEY=");
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
