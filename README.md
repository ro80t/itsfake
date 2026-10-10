# itsfake

Honeypot middleware for [Hono](https://hono.dev) and [Next.js](https://nextjs.org). Instead of a real 404, it serves fake-but-plausible secrets at paths attackers and scanners commonly probe — `.env`, `.git/config`, `.aws/credentials`, `wp-login.php`, `wp-admin`, `xmlrpc.php`, `phpinfo.php` — to waste their time and feed them bogus credentials.

## Install

```sh
npm install itsfake
pnpm add itsfake
yarn add itsfake
bun add itsfake
```

## Usage

### Hono

```ts
import { Hono } from "hono";
import { itsfake } from "itsfake/hono";

const app = new Hono();
app.use(itsfake());
```

### Next.js

```ts
// middleware.ts
import { itsfakeMiddleware } from "itsfake/next";

export const middleware = itsfakeMiddleware();
```

### Options

Both `itsfake()` (Hono) and `itsfakeMiddleware()` (Next.js) take the same options:

```ts
itsfake({
  // Override the default trap list.
  rules: [{ match: "/secret.txt", respond: () => ({ status: 200, body: "nope" }) }],
  // Called whenever a request matches a trap, e.g. to log the attacker.
  onTrap: ({ path }) => console.log("trapped:", path),
});
```

A `match` is a string (exact path, or `"prefix*"` for a prefix match) or a `RegExp` tested against the request pathname.

## API

| Export                             | Description                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------ |
| `itsfake(options?)` (`itsfake/hono`) | Hono middleware.                                                                    |
| `itsfakeMiddleware(options?)` (`itsfake/next`) | Next.js middleware.                                                       |
| `DEFAULT_TRAP_RULES`                | The default `TrapRule[]` list used when `rules` isn't passed.                       |
| `findTrap(pathname, rules?)`        | Returns the first matching `TrapRule` for a path, or `null`.                        |
| `matchPath(pathname, pattern)`      | The matcher `findTrap` uses under the hood (string exact/prefix, or `RegExp`).      |
| `fakeDotEnv()`, `fakeGitConfig()`, `fakeAwsCredentials()`, `fakeWpLoginPage()`, `fakePhpInfo()` | Individual fake-content generators, if you want to reuse them in custom rules. |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and the release process.

## License

MIT
