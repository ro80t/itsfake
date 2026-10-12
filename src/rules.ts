import {
  fakeAwsCredentials,
  fakeDotEnv,
  fakeGitConfig,
  fakeGitHead,
  fakePhpInfo,
  fakePhpMyAdminLoginPage,
  fakeSpringActuatorEnv,
  fakeSshPrivateKey,
  fakeWpLoginPage,
} from "./fakes";
import type { TrapRule } from "./types";

const XMLRPC_FAKE_OK = `<?xml version="1.0"?><methodResponse><params><param><value><string>OK</string></value></param></params></methodResponse>`;

/**
 * Default set of traps for paths attackers and scanners commonly probe:
 * dotenv files, `.git`/`.aws`/SSH credentials, WordPress endpoints, DB admin
 * tools, and Spring Boot Actuator.
 */
export const DEFAULT_TRAP_RULES: TrapRule[] = [
  {
    match: /^\/\.env(\..*)?$/,
    respond: () => ({ status: 200, headers: { "content-type": "text/plain" }, body: fakeDotEnv() }),
  },
  {
    match: "/.git/config",
    respond: () => ({
      status: 200,
      headers: { "content-type": "text/plain" },
      body: fakeGitConfig(),
    }),
  },
  {
    match: "/.aws/credentials",
    respond: () => ({
      status: 200,
      headers: { "content-type": "text/plain" },
      body: fakeAwsCredentials(),
    }),
  },
  {
    match: "/.git/HEAD",
    respond: () => ({
      status: 200,
      headers: { "content-type": "text/plain" },
      body: fakeGitHead(),
    }),
  },
  {
    match: "/.ssh/id_rsa",
    respond: () => ({
      status: 200,
      headers: { "content-type": "text/plain" },
      body: fakeSshPrivateKey(),
    }),
  },
  {
    match: "/actuator/env",
    respond: () => ({
      status: 200,
      headers: { "content-type": "application/json" },
      body: fakeSpringActuatorEnv(),
    }),
  },
  {
    match: "/phpmyadmin*",
    respond: () => ({
      status: 200,
      headers: { "content-type": "text/html" },
      body: fakePhpMyAdminLoginPage(),
    }),
  },
  {
    match: "/adminer.php",
    respond: () => ({
      status: 200,
      headers: { "content-type": "text/html" },
      body: fakePhpMyAdminLoginPage(),
    }),
  },
  {
    match: "/wp-login.php",
    respond: () => ({
      status: 200,
      headers: { "content-type": "text/html" },
      body: fakeWpLoginPage(),
    }),
  },
  {
    match: "/wp-admin*",
    respond: () => ({
      status: 200,
      headers: { "content-type": "text/html" },
      body: fakeWpLoginPage(),
    }),
  },
  {
    match: "/xmlrpc.php",
    respond: () => ({ status: 200, headers: { "content-type": "text/xml" }, body: XMLRPC_FAKE_OK }),
  },
  {
    match: "/phpinfo.php",
    respond: () => ({ status: 200, headers: { "content-type": "text/html" }, body: fakePhpInfo() }),
  },
];
