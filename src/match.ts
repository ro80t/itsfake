export function matchPath(pathname: string, pattern: string | RegExp): boolean {
  if (pattern instanceof RegExp) return pattern.test(pathname);
  if (pattern.endsWith("*")) return pathname.startsWith(pattern.slice(0, -1));
  return pathname === pattern;
}
