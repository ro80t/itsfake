import { randomBase64, randomHex } from "./random";

/** A plausible-looking `.env` file, seeded with fresh random secrets on every call. */
export function fakeDotEnv(): string {
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

/** A fake `.git/config` pointing at a credential-embedded remote URL. */
export function fakeGitConfig(): string {
  return (
    [
      "[core]",
      "\trepositoryformatversion = 0",
      "\tfilemode = true",
      "\tbare = false",
      '[remote "origin"]',
      `\turl = https://${randomHex(4)}:${randomBase64(20)}@github.com/acme-corp/internal-platform.git`,
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
<h1><a href="https://wordpress.org/">Powered by WordPress</a></h1>
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
