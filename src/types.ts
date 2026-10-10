export type TrapResponse = {
  status: number;
  headers?: Record<string, string>;
  body: string;
};

export type TrapRule = {
  /** A path matcher: exact string, `"prefix*"`, or a RegExp tested against the request pathname. */
  match: string | RegExp;
  respond: () => TrapResponse;
};

export type TrapHit = {
  path: string;
  rule: TrapRule;
};
