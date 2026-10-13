import { randomBase64, randomHex } from "./random";

/** A Laravel-flavored `.env` file. */
export function fakeDotEnvLaravel(): string {
  return (
    [
      "APP_ENV=production",
      `APP_KEY=base64:${randomBase64(32)}`,
      "APP_DEBUG=false",
      "DB_CONNECTION=mysql",
      "DB_HOST=127.0.0.1",
      "DB_PORT=3306",
      "DB_DATABASE=app_production",
      "DB_USERNAME=app_admin",
      `DB_PASSWORD=${randomBase64(18)}`,
      `AWS_ACCESS_KEY_ID=AKIA${randomHex(8).toUpperCase()}`,
      `AWS_SECRET_ACCESS_KEY=${randomBase64(30)}`,
      `STRIPE_SECRET_KEY=sk_live_${randomHex(24)}`,
      `MAIL_PASSWORD=${randomBase64(16)}`,
    ].join("\n") + "\n"
  );
}

/** A Node/Express-flavored `.env` file. */
export function fakeDotEnvNode(): string {
  return (
    [
      "NODE_ENV=production",
      "PORT=3000",
      `JWT_SECRET=${randomHex(32)}`,
      `SESSION_SECRET=${randomHex(32)}`,
      `DATABASE_URL=postgres://app_admin:${randomBase64(16)}@127.0.0.1:5432/app_production`,
      `REDIS_URL=redis://:${randomBase64(12)}@127.0.0.1:6379`,
      `STRIPE_SECRET_KEY=sk_live_${randomHex(24)}`,
      `SENDGRID_API_KEY=SG.${randomBase64(22)}.${randomBase64(22)}`,
    ].join("\n") + "\n"
  );
}

/** A Django-flavored `.env` file. */
export function fakeDotEnvDjango(): string {
  return (
    [
      "DEBUG=False",
      "ALLOWED_HOSTS=example.com",
      `SECRET_KEY=${randomBase64(40)}`,
      `DATABASE_URL=postgres://app_admin:${randomBase64(16)}@127.0.0.1:5432/app_production`,
      `EMAIL_HOST_PASSWORD=${randomBase64(16)}`,
      `AWS_SECRET_ACCESS_KEY=${randomBase64(30)}`,
    ].join("\n") + "\n"
  );
}

const ENV_FLAVORS = [fakeDotEnvLaravel, fakeDotEnvNode, fakeDotEnvDjango];

/** A plausible-looking `.env` file, randomly picking a framework flavor with fresh secrets on every call. */
export function fakeDotEnv(): string {
  const flavor = ENV_FLAVORS[Math.floor(Math.random() * ENV_FLAVORS.length)] ?? fakeDotEnvLaravel;
  return flavor();
}

/** A fake `.git/config` pointing at a private org repo over an SSH remote. */
export function fakeGitConfig(): string {
  return (
    [
      "[core]",
      "\trepositoryformatversion = 0",
      "\tfilemode = true",
      "\tbare = false",
      '[remote "origin"]',
      `\turl = git@github.com:acme-corp/internal-platform.git`,
      "\tfetch = +refs/heads/*:refs/remotes/origin/*",
    ].join("\n") + "\n"
  );
}

/** A fake AWS CLI credentials file. */
export function fakeAwsCredentials(): string {
  return (
    [
      "[default]",
      `aws_access_key_id = AKIA${randomHex(8).toUpperCase()}`,
      `aws_secret_access_key = ${randomBase64(30)}`,
    ].join("\n") + "\n"
  );
}

/** A static WordPress login page, served for `wp-login.php` and `wp-admin` probes. */
export function fakeWpLoginPage(): string {
  return `<!DOCTYPE html>
<html lang="en-US">
<head><title>Log In &lsaquo; Site &mdash; WordPress</title></head>
<body class="login">
<div id="login">
<h1>Powered by WordPress</h1>
<form name="loginform" id="loginform" action="wp-login.php" method="post">
<p><label for="user_login">Username or Email Address</label>
<input type="text" name="log" id="user_login"></p>
<p><label for="user_pass">Password</label>
<input type="password" name="pwd" id="user_pass"></p>
<p class="submit"><input type="submit" name="wp-submit" id="wp-submit" value="Log In"></p>
</form>
</div>
</body>
</html>
`;
}

/** A static `phpinfo()` page describing a plausible but fake server. */
export function fakePhpInfo(): string {
  return `<!DOCTYPE html>
<html><head><title>phpinfo()</title></head>
<body>
<h1>PHP Version 7.4.33</h1>
<table><tr><td>System</td><td>Linux web-prod-03 5.15.0-generic x86_64</td></tr>
<tr><td>Server API</td><td>FPM/FastCGI</td></tr></table>
</body></html>
`;
}

/** The ref a real `.git/HEAD` would contain, baiting the same git-dumper scanners as `.git/config`. */
export function fakeGitHead(): string {
  return "ref: refs/heads/main\n";
}

/** A fake OpenSSH private key — structurally plausible but random garbage, not a parseable key. */
export function fakeSshPrivateKey(): string {
  const body = randomBase64(600)
    .replace(/(.{64})/g, "$1\n")
    .trimEnd();
  return `-----BEGIN OPENSSH PRIVATE KEY-----\n${body}\n-----END OPENSSH PRIVATE KEY-----\n`;
}

/** A fake Spring Boot Actuator `/actuator/env` dump, exposing bogus datasource/cloud secrets. */
export function fakeSpringActuatorEnv(): string {
  return JSON.stringify({
    activeProfiles: ["production"],
    propertySources: [
      {
        name: "applicationConfig",
        properties: {
          "spring.datasource.password": { value: randomBase64(18) },
          "spring.datasource.username": { value: "app_admin" },
          "aws.secretKey": { value: randomBase64(30) },
          "server.port": { value: "8080" },
        },
      },
    ],
  });
}

/** A static phpMyAdmin login page. */
export function fakePhpMyAdminLoginPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><title>phpMyAdmin</title></head>
<body>
<div id="login">
<h1>phpMyAdmin</h1>
<form method="post" action="index.php">
<label for="input_username">Username:</label>
<input type="text" name="pma_username" id="input_username">
<label for="input_password">Password:</label>
<input type="password" name="pma_password" id="input_password">
<input type="submit" value="Go">
</form>
</div>
</body>
</html>
`;
}
